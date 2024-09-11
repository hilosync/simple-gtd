import type { Todo } from "./GTDPage";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { ScrollArea } from "../components/ui/scroll-area";

const TodoList: React.FC<{
  todos: Todo[];
  completed: boolean;
  loading: boolean;
  onToggle: (id: number) => void;
}> = ({ todos, completed, loading, onToggle }) => {
  const { filteredTodos, noTodosText } = completed
    ? {
        filteredTodos: todos.filter((todo) => todo.completed),
        noTodosText: "No todos completed yet",
      }
    : {
        filteredTodos: todos.filter((todo) => !todo.completed),
        noTodosText: "Create a new todo above!",
      };

  const sortedTodos = [...filteredTodos].sort(
    (a, b) => b.priority - a.priority,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-lg">Loading todos...</span>
      </div>
    );
  }

  return sortedTodos.length != 0 ? (
    <ScrollArea className="h-[400px] pr-4">
      <ul className="space-y-4">
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => onToggle(todo.id)}
              />
              <span
                className={`text-lg font-medium ${todo.completed ? "text-gray-500 line-through" : ""}`}
              >
                {todo.title}
              </span>
            </div>
            {todo.extra && (
              <p className="mt-2 pl-7 text-sm text-gray-600">{todo.extra}</p>
            )}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ) : (
    <p className="pt-4 text-center text-slate-400">{noTodosText}</p>
  );
};

export default TodoList;
