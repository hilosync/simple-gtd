"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Navbar from "./Navbar";
import { useCallback, useEffect, useState } from "react";
import TodoList from "./TodoList";
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
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const { getToken } = useAuth();

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

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken"))
      ?.split("=")[1];

    try {
      const token = await getToken();
      const response = await axios.post<Todo>(
        "http://127.0.0.1:8000/api/todos/",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken ?? "",
          },
          withCredentials: true,
        },
      );

      console.log("Todo created:", response.data);
      setTitle("");
      fetchTodos().catch((error) => {
        console.error("Error in fetchTodos:", error);
      });
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  };

  const handleToggleTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    if (updatedTodo.completed) {
      setCompletedTodos([...completedTodos, updatedTodo]);
      setTodos(todos.filter((t) => t.id !== todo.id));
    } else {
      setTodos([...todos, updatedTodo]);
      setCompletedTodos(completedTodos.filter((t) => t.id !== todo.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
          Simple GTD
        </h1>

        {/* <Card className="mb-8">
          <CardContent> */}
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
        {/* </CardContent>
        </Card> */}

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
                {todos.map((todo) => (
                  <li key={todo.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo)}
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
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="line-through">{todo.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>

    // <div>
    //   <Navbar />
    //   <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2 dark:bg-black">
    //     <h1 className="mb-4 text-center text-4xl font-bold">To Do</h1>

    //     <div className="mt-12 max-w-xl text-center">
    //       <div>
    //         <form onSubmit={handleSubmit}>
    //           <div>
    //             <input
    //               type="text"
    //               id="title"
    //               value={title}
    //               onChange={(e) => setTitle(e.target.value)}
    //               required
    //             />
    //           </div>
    //           <button type="submit">{"Create Todo"}</button>
    //         </form>
    //       </div>
    //       <div>
    //         <h1>Todo List</h1>
    //         <div>
    //           {loading ? (
    //             <div className="flex items-center justify-center">
    //               <Loader2 className="animate-spin" />
    //               <span className="ml-2">Loading todos...</span>
    //             </div>
    //           ) : (
    //             <TodoList todos={todos} />
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default HomePage;
