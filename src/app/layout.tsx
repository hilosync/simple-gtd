import "~/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import axios from "axios";
import { type Metadata } from "next";

import { cn } from "../lib/utils";

axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SimpleGTD",
  description: "A simple way to manage tasks for people with ADHD",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body
        className={cn(
          "bg-background h-screen font-sans text-white antialiased",
          fontSans.variable,
        )}
      >
        <input
          type="hidden"
          name="csrfmiddlewaretoken"
          value="{{ csrf_token }}"
        />
        {children}
      </body>
    </html>
  );
}
