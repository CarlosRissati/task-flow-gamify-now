
import { Task } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Trash2, Clock, Star, SkipForward, Coins } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSkip: (id: string) => void;
}

export const TaskCard = ({ task, onToggle, onDelete, onSkip }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "média":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSkipCost = (priority: string) => {
    switch (priority) {
      case "alta": return 50;
      case "média": return 30;
      case "baixa": return 20;
      default: return 20;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluída":
        return "bg-success-50 border-success-200";
      case "atrasada":
        return "bg-danger-50 border-danger-200";
      default:
        return "bg-white/70 backdrop-blur-sm border-white/20";
    }
  };

  const handleToggle = () => {
    onToggle(task.id);
    // Add completion animation
    if (task.status !== "concluída") {
      const element = document.getElementById(`task-${task.id}`);
      if (element) {
        element.style.animation = "task-complete 0.6s ease-out";
      }
    }
  };

  return (
    <Card
      id={`task-${task.id}`}
      className={`transition-all duration-300 hover:shadow-lg ${getStatusColor(task.status)} ${
        task.status === "concluída" ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggle}
            className={`mt-1 p-1 h-6 w-6 rounded-full ${
              task.status === "concluída"
                ? "bg-success-500 text-white hover:bg-success-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {task.status === "concluída" && <Check className="w-3 h-3" />}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-semibold text-gray-900 ${
                  task.status === "concluída" ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
                <div className="flex items-center gap-1 text-game-exp">
                  <Star className="w-3 h-3" />
                  <span className="text-xs font-medium">{task.points}pts</span>
                </div>
              </div>
            </div>

            {task.description && (
              <p
                className={`text-sm text-gray-600 mt-1 ${
                  task.status === "concluída" ? "line-through" : ""
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(task.dueDate, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
                {task.status === "concluída" && task.completedAt && (
                  <span className="text-success-600 font-medium">
                    Concluída {formatDistanceToNow(task.completedAt, { addSuffix: true, locale: ptBR })}
                  </span>
                )}
              </div>

              <div className="flex gap-1">
                {task.status === "pendente" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSkip(task.id)}
                    className="text-orange-500 hover:text-orange-700 p-1 h-6 w-6"
                    title={`Pular tarefa (-${getSkipCost(task.priority)} pontos)`}
                  >
                    <Coins className="w-2 h-2" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="text-gray-400 hover:text-red-500 p-1 h-6 w-6"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
