import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const rpID = "localhost";
const origin = "http://localhost:3000";

// ---------------------------
// PASSKEY REGISTER - STEP 1
// ---------------------------

export const generatePasskeyRegistration = async (req, res) => {
  try {
    const user = req.user;

    const userIDBuffer = new mongoose.Types.ObjectId(user._id).id;

    const options = generateRegistrationOptions({
      rpName: "ShapeSense AI",
      rpID: "localhost",
      userID: userIDBuffer,
      userName: user.email,
      userDisplayName: user.name,
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
      attestationType: "none",
    });

    await User.updateOne(
      { _id: user._id },
      { passkeyChallenge: options.challenge }
    );

    res.json(options);
  } catch (err) {
    console.log("🔴 Passkey registration error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ---------------------------
// PASSKEY REGISTER - STEP 2
// ---------------------------
export const verifyPasskeyRegistration = async (req, res) => {
  try {
    const { userId, challenge } = req.session;

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified)
      return res.status(400).json({ msg: "Verification failed" });

    const { credentialID, credentialPublicKey, counter } =
      verification.registrationInfo;

    await User.findByIdAndUpdate(userId, {
      $push: {
        passkeys: {
          credentialID: credentialID.toString("base64url"),
          credentialPublicKey: credentialPublicKey.toString("base64url"),
          counter,
        },
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.log("Registration error:", err);
    res.status(500).json({ msg: "Error verifying passkey" });
  }
};

// ---------------------------
// PASSKEY LOGIN - STEP 1
// ---------------------------
export const generatePasskeyLogin = async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });

  if (!user || user.passkeys.length === 0) {
    return res.status(400).json({ msg: "No passkeys found for user" });
  }

  const options = await generateAuthenticationOptions({
    allowCredentials: user.passkeys.map((pk) => ({
      id: Buffer.from(pk.credentialID, "base64url"),
      type: "public-key",
    })),
    userVerification: "required",
    rpID,
  });

  req.session = {};
  req.session.challenge = options.challenge;
  req.session.userId = user.id;

  res.json(options);
};

// ---------------------------
// PASSKEY LOGIN - STEP 2
// ---------------------------
export const verifyPasskeyLogin = async (req, res) => {
  try {
    const { challenge, userId } = req.session;

    const user = await User.findById(userId);

    const authenticator = user.passkeys.find(
      (dev) => dev.credentialID === req.body.id
    );

    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(authenticator.credentialID, "base64url"),
        credentialPublicKey: Buffer.from(
          authenticator.credentialPublicKey,
          "base64url"
        ),
        counter: authenticator.counter,
      },
    });

    if (!verification.verified)
      return res.status(400).json({ msg: "Login failed" });

    // Create JWT and return
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Passkey login error" });
  }
};
