"use client";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", paddingTop: "20vh" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Something went wrong</h1>
        <p style={{ marginTop: "1rem", color: "#666" }}>An unexpected error occurred.</p>
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "inherit",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
