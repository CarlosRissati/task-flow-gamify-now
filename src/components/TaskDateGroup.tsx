
import { Task } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskDateGroupProps {
  date: Date;
  tasks: Task[];
  priority: "baixa" | "média" | "alta";
}

export const TaskDateGroup = ({ date, tasks, priority }: TaskDateGroupProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "text-red-500";
      case "média":
        return "text-yellow-500";
      case "baixa":
        return "text-green-500";
      default:
        return "text-gray-500";
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
    <div className="mb-4">
      <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4 mb-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-700 dark:text-gray-300 font-medium">
            {formatDate(date)}
          </h3>
          <Badge className={`${getPriorityColor(priority)} capitalize`}>
            {priority}
          </Badge>
        </div>
        <ul className="space-y-1">
          {tasks.map((task) => (
            <li key={task.id} className="text-gray-600 dark:text-gray-400 text-sm">
              • {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
