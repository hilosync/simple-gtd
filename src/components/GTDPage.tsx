"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Navbar from "./Navbar";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import TodoList from "./TodoList";

const API_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

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
  const [todoLimit, setTodoLimit] = useState(false);

  const { getToken } = useAuth();

  const fetchTodos = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get<Todo[]>(`${API_URL}/todos/`, {
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
    if (todos.filter((todo) => !todo.completed).length >= 20) {
      setTodoLimit(true);
      return;
    }
    setTodoLimit(false);

    try {
      const token = await getToken();
      const newtodo = await axios.post<Todo>(
        `${API_URL}/todos/`,
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
      fetchTodos().catch((error) => {
        console.error("Error in fetchTodos:", error);
      });
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
        `${API_URL}/todos/${todoId}/toggle_completion/`,
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

  const handleDelete = async () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/todos/delete_completed/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      fetchTodos().catch((error) => {
        console.error("Error in fetchTodos:", error);
      });
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleOptimise = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await axios.post(
        `${API_URL}/todos/generate_tips/`,
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

  return (
    <div className="min-h-screen bg-background-500">
      <Navbar />
      <div className="mx-auto p-4">
        <form onSubmit={handleSubmit} className="mb-8 w-full">
          <div className="flex w-full flex-col space-y-2">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your task"
              autoFocus
            />
            {todoLimit && (
              <p className="mx-auto text-red-500">
                Maximum number of todos reached (20)
              </p>
            )}
          </div>
        </form>
        <div className="flex flex-col space-y-6">
          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Tasks</CardTitle>
              <Button onClick={handleOptimise}>Optimise</Button>
            </CardHeader>
            <Separator className="my-2" />
            <CardContent>
              <TodoList
                todos={todos}
                completed={false}
                loading={loading}
                onToggle={toggleTodoCompletion}
              />
            </CardContent>
          </Card>

          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Completed</CardTitle>
              <Button onClick={handleDelete}>Delete All</Button>
            </CardHeader>
            <Separator className="my-1" />
            <CardContent>
              <TodoList
                todos={todos}
                completed={true}
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
