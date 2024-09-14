import "~/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import axios from "axios";

import { cn } from "../lib/utils";

axios.defaults.xsrfHeaderName = "x-csrftoken";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="">
      <body
        className={cn(
          "bg-background min-h-screen font-sans text-white antialiased",
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
