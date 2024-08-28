"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Navbar from "./Navbar";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import TodoList from "./TodoList";

export interface Todo {
  userId: string;
  id: number;
  title: string;
  extra: string;
  priority: number;
  completed: boolean;
}

const GTDPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const { getToken } = useAuth();

  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get<Todo[]>(
        "http://127.0.0.1:8000/api/todos/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
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
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchTodos().catch((error) => {
      console.error("Error in fetchTodos:", error);
    });
  }, [fetchTodos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getToken();
      const newtodo = await axios.post<Todo>(
        "http://127.0.0.1:8000/api/todos/",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      setTitle("");
      setTodos([...todos, newtodo.data]);
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  };

  const toggleTodoCompletion = async (todoId: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    );
    setTodos(updatedTodos);
    try {
      const token = await getToken();
      await axios.patch(
        `http://127.0.0.1:8000/api/todos/${todoId}/toggle_completion/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      fetchTodos().catch((error) => {
        console.error("Error in fetchTodos:", error);
      });
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleOptimise = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `http://127.0.0.1:8000/api/todos/generate_tips/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit} className="mb-8 flex space-x-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your todo"
            className="mx-auto w-full max-w-2xl flex-grow text-lg"
          />
        </form>

        <div className="flex flex-col space-y-6">
          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Todos</CardTitle>
              <Button onClick={handleOptimise}>Optimise</Button>
            </CardHeader>
            <CardContent>
              <TodoList
                todos={activeTodos}
                loading={loading}
                onToggle={toggleTodoCompletion}
              />
            </CardContent>
          </Card>

          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <TodoList
                todos={completedTodos}
                loading={loading}
                onToggle={toggleTodoCompletion}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GTDPage;
