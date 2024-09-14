"use client";
import { Button } from "../components/ui/button";
import { Vortex } from "../components/ui/vortex";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Brain } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="h-screen">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex h-full w-full flex-col items-center justify-center px-4 py-8 md:px-10"
      >
        <div className="flex min-h-screen w-full flex-col items-center justify-center py-2 text-paleLavender-100">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-5xl font-extrabold sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="animate-gradient-x bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                SimpleGTD
              </span>
            </h1>
            <p className="mb-6 text-xl font-light text-gray-300 sm:text-2xl">
              ADHD-Friendly Get Things Done
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="h-6 w-6 text-purple-400 sm:h-8 sm:w-8" />
              <h2 className="text-center text-2xl font-semibold sm:text-3xl">
                AI-Powered Task Management
              </h2>
            </div>
            <p className="max-w-xl px-4 text-center text-lg sm:max-w-2xl sm:text-xl">
              Create tasks easily and let AI optimize and prioritize them for
              you. Simplified for ADHD minds, powerful for everyone.
            </p>
          </div>

          <div className="flex flex-col space-y-4 py-6 sm:flex-row sm:space-x-6 sm:space-y-0 sm:py-10">
            <SignInButton mode="modal">
              <Button className="w-full px-8 py-3 text-lg sm:w-auto">
                Log in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-full bg-darkPurple-400 px-8 py-3 text-lg sm:w-auto">
                Sign up
              </Button>
            </SignUpButton>
          </div>

          <div className="max-w-xl px-4 text-center sm:max-w-2xl">
            <p className="text-base text-gray-300 sm:text-lg">
              Experience a new way of managing tasks, tailored for your ADHD
              brain. Let SimpleGTD handle the complexity while you focus on what
              matters.
            </p>
          </div>
        </div>
      </Vortex>
    </div>
  );
};

export default HomePage;
