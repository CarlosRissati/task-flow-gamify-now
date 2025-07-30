import { Task } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Trophy, Target } from "lucide-react";

interface TaskHistoryProps {
  tasks: Task[];
}

export const TaskHistory = ({ tasks }: TaskHistoryProps) => {
  const completedTasks = tasks
    .filter(task => task.status === "concluída")
    .sort((a, b) => {
      const dateA = a.completedAt || a.createdAt;
      const dateB = b.completedAt || b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "média":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "baixa":
        return "bg-gradient-to-r from-green-500 to-blue-500 text-white";
      default:
        return "bg-gray-200 dark:bg-gray-700";
    }
  };

  const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
  const thisWeekTasks = completedTasks.filter(task => {
    const completedDate = task.completedAt || task.createdAt;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return completedDate >= oneWeekAgo;
  });

  if (completedTasks.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Histórico de Atividades
        </h2>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Nenhuma tarefa concluída ainda
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Complete suas primeiras tarefas para ver seu histórico aqui!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Histórico de Atividades
        </h2>
        
        {/* Estatísticas do histórico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Concluídas</p>
                  <p className="text-2xl font-bold">{completedTasks.length}</p>
                </div>
                <Target className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pontos Ganhos</p>
                  <p className="text-2xl font-bold">{totalPoints}</p>
                </div>
                <Trophy className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Esta Semana</p>
                  <p className="text-2xl font-bold">{thisWeekTasks.length}</p>
                </div>
                <Calendar className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lista de tarefas concluídas */}
      <div className="space-y-3">
        {completedTasks.map(task => (
          <Card 
            key={task.id} 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {task.title}
                    </h3>
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Concluída em: {format(task.completedAt || task.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {format(task.completedAt || task.createdAt, "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    +{task.points} pts
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};