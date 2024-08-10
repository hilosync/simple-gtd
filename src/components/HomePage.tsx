"use client";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

import { SignUpButton, SignInButton, SignIn } from "@clerk/nextjs";

const HomePage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2">
      <h1 className="mb-4 text-center text-4xl font-bold">
        Welcome to ADHD-Friendly To-Do App
      </h1>
      <p className="mb-8 text-center text-lg">
        Designed to help you manage your tasks effectively, with features that
        are especially helpful for people with ADHD.
      </p>

      <div className="flex space-x-4">
        <SignInButton mode="modal">
          <Button>Log in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign up</Button>
        </SignUpButton>
      </div>

      <div className="mt-12 max-w-xl text-center">
        <h2 className="text-2xl font-semibold">
          Why this app is great for people with ADHD
        </h2>
        <ul className="mt-4 list-inside list-disc text-left">
          <li>Simple and intuitive interface to avoid distractions.</li>
          <li>Task reminders to keep you on track.</li>
          <li>Ability to break tasks into smaller, manageable steps.</li>
          <li>Customizable task lists tailored to your needs.</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
