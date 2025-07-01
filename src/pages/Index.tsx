
import { useState, useEffect } from "react";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { StatsCards } from "@/components/StatsCards";
import { UserProfile } from "@/components/UserProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "baixa" | "média" | "alta";
  status: "pendente" | "concluída" | "atrasada";
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
  points: number;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  streak: number;
  totalPoints: number;
  level: number;
  weeklyCompleted: number;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<"todas" | "pendente" | "concluída" | "atrasada">("todas");
  const [userStats, setUserStats] = useState<UserStats>({
    totalTasks: 0,
    completedTasks: 0,
    streak: 1,
    totalPoints: 0,
    level: 1,
    weeklyCompleted: 0,
  });

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskify-tasks");
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskify-tasks", JSON.stringify(tasks));
    updateUserStats();
  }, [tasks]);

  // Update overdue tasks
  useEffect(() => {
    const updateOverdueTasks = () => {
      const now = new Date();
      setTasks(prev => prev.map(task => {
        if (task.status === "pendente" && task.dueDate < now) {
          return { ...task, status: "atrasada" as const };
        }
        return task;
      }));
    };

    updateOverdueTasks();
    const interval = setInterval(updateOverdueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const updateUserStats = () => {
    const completedTasks = tasks.filter(task => task.status === "concluída");
    const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
    const level = Math.floor(totalPoints / 100) + 1;
    
    // Calculate weekly completed tasks
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyCompleted = completedTasks.filter(
      task => task.completedAt && task.completedAt >= oneWeekAgo
    ).length;

    setUserStats({
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      streak: Math.max(1, Math.floor(completedTasks.length / 3)),
      totalPoints,
      level,
      weeklyCompleted,
    });
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "status">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: "pendente",
    };
    setTasks(prev => [...prev, newTask]);
    setIsFormOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newStatus = task.status === "concluída" ? "pendente" : "concluída";
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === "concluída" ? new Date() : undefined,
        };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "todas") return true;
    return task.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Taskify
            </h1>
            <p className="text-gray-600 mt-2">Gerencie suas tarefas com estilo e gamificação</p>
          </div>
          <UserProfile stats={userStats} />
        </div>

        {/* Stats Cards */}
        <StatsCards stats={userStats} />

        {/* Main Content */}
        <Tabs defaultValue="tarefas" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-white/70 backdrop-blur-sm">
              <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
              <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            </TabsList>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <TaskForm onSubmit={addTask} />
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="tarefas" className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {["todas", "pendente", "concluída", "atrasada"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status as typeof filter)}
                  className={`capitalize ${
                    filter === status 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600" 
                      : "bg-white/70 backdrop-blur-sm"
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>

            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          </TabsContent>

          <TabsContent value="estatisticas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* More detailed statistics will go here */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Próximas Funcionalidades</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Gráficos de produtividade</li>
                  <li>• Integração com calendários</li>
                  <li>• Notificações push</li>
                  <li>• Modo Pomodoro</li>
                  <li>• Comandos por voz</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
