export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body style={{ background: "#050505", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
