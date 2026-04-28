import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrueScan — AI Supply Chain Authenticity Platform",
  description:
    "TrueScan uses Vertex AI and blockchain provenance to verify FMCG product authenticity across global supply chains in real time.",
  keywords: ["supply chain", "authenticity", "AI", "counterfeit", "FMCG", "blockchain", "Vertex AI"],
  openGraph: {
    title: "TrueScan",
    description: "AI-powered product authenticity verification",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
