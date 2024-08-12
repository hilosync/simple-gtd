"use client";
import { useAuth } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";

export interface Todo {
  userId: string;
}

const HomePage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchTodos() {
      try {
        const token = await getToken();
        const response = await axios.get<Todo[]>(
          "http://127.0.0.1:8000/api/todos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTodos(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Failed to fetch todos:",
            error.response?.data || error.message,
          );
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    }

    fetchTodos().catch((error) => {
      console.error("Error in fetchTodos:", error);
    });
  }, [getToken]);

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2 dark:bg-black">
        <h1 className="mb-4 text-center text-4xl font-bold">To Do</h1>

        <div className="mt-12 max-w-xl text-center">
          <h2 className="text-2xl font-semibold">
            Why this app is great for people with ADHD
          </h2>
          <div>
            <h1>Todo List</h1>
            <ul>
              {todos.map((todo) => (
                <li key={todo.userId}>{todo.userId}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
