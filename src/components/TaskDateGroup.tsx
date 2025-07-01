
import { Task } from "@/pages/Index";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskDateGroupProps {
  date: Date;
  tasks: Task[];
  priority: "baixa" | "média" | "alta";
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskDateGroup = ({ date, tasks, priority, onToggle, onDelete }: TaskDateGroupProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "média":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "baixa":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return "Hoje é " + format(date, "dd 'de' MMMM", { locale: ptBR });
    }
    
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="mb-6 animate-slide-up">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 mb-3 shadow-lg border border-white/20 dark:border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
            {formatDate(date)}
          </h3>
          <Badge className={`${getPriorityColor(priority)} capitalize font-medium px-3 py-1 shadow-md`}>
            {priority}
          </Badge>
        </div>
        <div className="space-y-3">
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
