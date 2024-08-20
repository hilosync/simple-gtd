"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Navbar from "./Navbar";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2, ArrowRight, Check } from "lucide-react";

export interface Todo {
  userId: string;
  id: number;
  title: string;
  completed: boolean;
}

const HomePage: React.FC = () => {
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
      console.log(newtodo.data);
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
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
          Simple GTD
        </h1>

        <form onSubmit={handleSubmit} className="mb-8 flex space-x-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your todo"
            className="flex-grow text-lg"
          />
          <Button type="submit" size="icon">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </form>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Todo List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading todos...</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {activeTodos.map((todo) => (
                  <li key={todo.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodoCompletion(todo.id)}
                    />
                    <span>{todo.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {completedTodos.map((todo) => (
                <li key={todo.id} className="flex items-center space-x-2">
                  <span>{todo.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
