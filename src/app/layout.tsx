import "~/styles/globals.css";
import { ThemeProvider } from "~/components/ThemeProvider";
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
          "bg-background min-h-screen font-sans text-black antialiased dark:bg-black dark:text-white",
          fontSans.variable,
        )}
      >
        <input
          type="hidden"
          name="csrfmiddlewaretoken"
          value="{{ csrf_token }}"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
