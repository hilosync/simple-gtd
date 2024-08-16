import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

const CreateTodo: React.FC = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken"))
      ?.split("=")[1];

    try {
      const token = await getToken();
      const response = await axios.post<Todo>(
        "http://127.0.0.1:8000/api/",
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
      // You might want to update your todo list here or notify a parent component
    } catch (err) {
      setError("Failed to create todo. Please try again.");
      console.error("Error creating todo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
};

export default CreateTodo;
