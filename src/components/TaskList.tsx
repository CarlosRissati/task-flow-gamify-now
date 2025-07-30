
import { Task } from "@/pages/Index";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSkip: (id: string) => void;
}

export const TaskList = ({ tasks, onToggle, onDelete, onSkip }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500">
          Crie sua primeira tarefa para começar a ganhar pontos!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TaskCard
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onSkip={onSkip}
          />
        </div>
      ))}
    </div>
  );
};
