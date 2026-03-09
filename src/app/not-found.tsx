export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", paddingTop: "20vh" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>404</h1>
        <p style={{ marginTop: "1rem", color: "#666" }}>Page not found.</p>
        <a href="/" style={{ marginTop: "2rem", display: "inline-block", textDecoration: "underline" }}>
          Go to homepage
        </a>
      </body>
    </html>
  );
}
