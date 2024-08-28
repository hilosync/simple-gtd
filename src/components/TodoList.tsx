import type { Todo } from "./GTDPage";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../components/ui/checkbox";
import { ScrollArea } from "../components/ui/scroll-area";

const TodoList: React.FC<{
  todos: Todo[];
  loading: boolean;
  onToggle: (id: number) => void;
}> = ({ todos, loading, onToggle }) => {
  // Sort todos by priority (highest to lowest)
  const sortedTodos = [...todos].sort((a, b) => b.priority - a.priority);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-lg">Loading todos...</span>
      </div>
    );
  }

  return (
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
  );
};

export default TodoList;
