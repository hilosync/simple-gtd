import React, { useState, useEffect } from "react";

interface Todo {
  userId: string;
  id: number;
  title: string;
  completed: boolean;
}

const TodoList: React.FC<{ todos: Todo[] | null }> = ({ todos }) => {
  const [todoArray, setTodoArray] = useState<Todo[]>([]);

  useEffect(() => {
    if (todos) {
      const newTodoArray = Object.values(todos);
      setTodoArray(newTodoArray);
    }
  }, [todos]);

  if (todoArray.length === 0) {
    return <div>No todos found.</div>;
  }

  return (
    <ul>
      {todoArray.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};

export default TodoList;
