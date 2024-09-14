import React from "react";
import { cn } from "../lib/utils";
import { UserButton } from "@clerk/nextjs";

export const Navbar: React.FC = () => {
  return (
    <header
      className={cn("flex justify-between bg-background-800 p-4 shadow-md")}
    >
      <div className="animate-gradient-x bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-2xl font-semibold text-transparent">
        Simple GTD
      </div>
      <UserButton></UserButton>
    </header>
  );
};

export default Navbar;
