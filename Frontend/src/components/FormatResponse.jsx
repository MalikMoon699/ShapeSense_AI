import React from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Code Copied!");
};

export const FormatResponse = ({ text }) => {
  return (
    <div
      style={{
        padding: "0px 10px",
        borderRadius: "10px",
        lineHeight: "1.6",
      }}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <>
                <div className="code-header">
                  <strong>Code</strong>
                  <span onClick={() => handleCopy(String(children))}>
                    <Copy size={15} />
                    Copy
                  </span>
                </div>
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </>
            ) : (
              <code {...props}>{children}</code>
            );
          },
          h1: ({ children }) => (
            <h1 style={{ fontSize: "1.8em", margin: "10px 0" }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: "1.5em", margin: "10px 0" }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: "1.3em", margin: "8px 0" }}>{children}</h3>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: "6px" }}>{children}</li>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export const parseDietPlan = (planText) => {
  const sections = {};
  const lines = planText.split(
    /\n|(?=Breakfast|Snack 1|Snack 2|Lunch|Dinner)/g
  );

  let currentSection = "";

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    const calorieMatch = line.match(/Total Daily Calories:\s*(\d+)/i);
    if (calorieMatch) {
      return;
    }

    if (line.startsWith("At the end")) {
      return;
    }

    if (
      line.startsWith("Breakfast") ||
      line.startsWith("Snack 1") ||
      line.startsWith("Snack 2") ||
      line.startsWith("Lunch") ||
      line.startsWith("Dinner")
    ) {
      currentSection = line;
      sections[currentSection] = [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  });

  return sections;
};

export const getTotalCalories = (text) => {
  const match = text.match(/Total Daily Calories:\s*(\d+)/i);
  return match ? match[1] : null;
};
