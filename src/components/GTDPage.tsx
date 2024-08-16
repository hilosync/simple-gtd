"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import TodoList from "./TodoList";
import CreateTodo from "./CreateTodo";

export interface Todo {
  userId: string;
  id: number;
  title: string;
  completed: boolean;
}

const HomePage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchTodos() {
      try {
        const token = await getToken();
        const response = await axios.get<Todo[]>("http://127.0.0.1:8000/api", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
          <CreateTodo />
          <div>
            <h1>Todo List</h1>
            <TodoList todos={todos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
