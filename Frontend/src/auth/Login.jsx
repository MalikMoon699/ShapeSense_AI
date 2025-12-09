import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Eye, EyeClosed, X } from "lucide-react";
import "../assets/style/Auth.css";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "sonner";
import API from "../utils/api";
import { startAuthentication } from "@simplewebauthn/browser";

const Login = ({ setAcountState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setTimeout(async () => {
          await refresh();
          navigate("/", { replace: true });
          setAcountState(null);
        }, 100);
      }
      toast.success("Login successfully.");
    } catch (err) {
      console.error("[Login] Login error:", err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    const email = form.email;

    if (!email) return toast.error("Enter email first");

    const opts = await API.get(`/passkey/login-options?email=${email}`);

    try {
      const authResp = await startAuthentication(opts.data);

      const verify = await API.post("/passkey/login-verify", authResp);

      if (verify.data.token) {
        localStorage.setItem("token", verify.data.token);
        await refresh();
        navigate("/");
        toast.success("Logged in with Passkey");
      }
    } catch (err) {
      toast.error("No biometrics/passcode available");
    }
  };

  const Authrized =
    location.pathname === "/cart" ||
    location.pathname.startsWith(`/my-orders/`);

  return (
    <div
      onClick={() => {
        navigate("/");
        setTimeout(() => {
          setAcountState(null);
        }, 100);
      }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="modal-title">Welcome Back</h2>
          <button
            onClick={() => {
              if (Authrized) {
                navigate("/");
                setTimeout(() => {
                  setAcountState(null);
                }, 100);
              } else {
                setAcountState(null);
              }
            }}
            className="modal-close-btn"
          >
            <X />
          </button>
        </div>

        <input
          name="email"
          className="login-input"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          placeholder="Email Address"
        />

        <div className="login-password-collection">
          <input
            style={{ boxShadow: "none" }}
            name="password"
            type={!showPassword ? "password" : "text"}
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </span>
        </div>
        <button style={{marginBottom:"8px"}} onClick={handlePasskeyLogin} className="login-btn">
          Login with Passkey
        </button>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`login-btn ${loading ? "loading" : ""}`}
        >
          {loading ? <Loader color="white" size="16" stroke="2" /> : "Login"}
        </button>

        <div className="signup">
          Don't have an account?
          <span
            onClick={() => {
              setAcountState("signUp");
            }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
