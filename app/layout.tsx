"use client";
import "./globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThirdwebProvider activeChain="goerli">
        <body className="mx-auto container p-4">{children}</body>
      </ThirdwebProvider>
    </html>
  );
}
