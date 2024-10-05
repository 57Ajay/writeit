import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReduxProvider } from "@/redux/ReduxProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { ReduxPersistProvider } from "@/redux/ReduxPersistProvider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "StoryArc",
  description: "Developed by Ajay Upadhyay, with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <ReduxPersistProvider>
              <Header />
              {children}
            </ReduxPersistProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
