"use client";
import Navbar from "./Navbar";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2">
        <h1 className="mb-4 text-center text-4xl font-bold">To Do</h1>

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
    </div>
  );
};

export default HomePage;
