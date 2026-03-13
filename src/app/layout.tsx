import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mega Guitar",
  description: "Free and ad-free alternative to Ultimate Guitar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ margin: 0 }}><a href="/" style={{ color: 'inherit' }}>Mega Guitar</a></h1>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
