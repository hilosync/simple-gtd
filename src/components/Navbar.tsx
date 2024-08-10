import React from "react";
import { cn } from "../lib/utils";
import { UserButton } from "@clerk/nextjs";

export const Navbar: React.FC = () => {
  return (
    <header
      className={cn("flex items-center justify-between bg-white p-4 shadow-md")}
    >
      <div className="text-xl font-semibold">Simple GTD</div>
      <div>
        <UserButton></UserButton>
      </div>
    </header>
  );
};

export default Navbar;
