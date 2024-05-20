"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRef } from "react";
import { AppStore, makeStore } from "@/utils/redux/store";
import { Provider } from "react-redux";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <html lang="en">
        <head>

        </head>
        <body
          className={inter.className + " h-screen flex flex-col  bg-gray-50"}
        >
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </Provider>
  );
}
