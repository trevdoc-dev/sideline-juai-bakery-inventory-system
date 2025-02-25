import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppinsFont = Poppins({
  weight: ["400", "700"], // Specify desired weights
  subsets: ["latin"], // Optional: Specify character subsets
  variable: "--font-poppins", // Create a CSS variable for dynamic styling [1, 5, 7]
});

export const metadata: Metadata = {
  title: "JU&AI Bakeshop Inventory System",
  description:
    "This is an exploratory capstone project for JU&AI Bakeshop Inventory System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsFont.className} antialiased`}>{children}</body>
    </html>
  );
}
