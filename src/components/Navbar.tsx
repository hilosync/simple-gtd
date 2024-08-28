import React from "react";
import { cn } from "../lib/utils";
import { UserButton } from "@clerk/nextjs";

export const Navbar: React.FC = () => {
  return (
    <header
      className={cn("flex items-center justify-between bg-white p-4 shadow-md")}
    >
      <div className="mx-auto text-xl font-semibold">Simple GTD</div>
      <UserButton></UserButton>
    </header>
  );
};

export default Navbar;
