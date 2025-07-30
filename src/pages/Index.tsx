
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskDateGroup } from "@/components/TaskDateGroup";
import { AddTaskForm } from "@/components/AddTaskForm";
import { StatsCards } from "@/components/StatsCards";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TaskHistory } from "@/components/TaskHistory";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, SkipForward, Coins } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

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
  const [activeView, setActiveView] = useState("home");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalTasks: 0,
    completedTasks: 0,
    streak: 1,
    totalPoints: 0,
    level: 1,
    weeklyCompleted: 0,
  });
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);

  // Load tasks and theme from localStorage on component mount
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

    const savedTheme = localStorage.getItem("taskify-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskify-tasks", JSON.stringify(tasks));
    updateUserStats();
  }, [tasks]);

  // Handle theme toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("taskify-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("taskify-theme", "light");
    }
  }, [darkMode]);

  const updateUserStats = () => {
    const completedTasks = tasks.filter(task => task.status === "concluída");
    const earnedPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
    const totalPoints = earnedPoints + accumulatedPoints;
    const level = Math.floor(totalPoints / 100) + 1;
    
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
    setActiveView("home");
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "concluída" ? "pendente" : "concluída";
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === "concluída" ? new Date() : undefined
        };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const skipTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const skipCost = task.priority === "alta" ? 50 : task.priority === "média" ? 30 : 20;
    
    if (userStats.totalPoints < skipCost) {
      toast.error(`Pontos insuficientes! Você precisa de ${skipCost} pontos para pular esta tarefa.`);
      return;
    }

    // Deduct points from accumulated points
    setAccumulatedPoints(prev => prev - skipCost);

    // Mark task as skipped (completed with 0 points)
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: "concluída" as const,
          completedAt: new Date(),
          points: 0 // No points for skipped tasks
        };
      }
      return t;
    }));

    toast.success(`Tarefa pulada! -${skipCost} pontos gastos.`);
  };

  const onPomodoroComplete = () => {
    const focusPoints = 25;
    setAccumulatedPoints(prev => prev + focusPoints);
    toast.success(`🍅 Pomodoro concluído! +${focusPoints} pontos de foco!`);
  };

  // Check for task reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const pendingTasks = tasks.filter(task => task.status === "pendente");
      
      pendingTasks.forEach(task => {
        const timeDiff = task.dueDate.getTime() - now.getTime();
        const hoursUntilDue = timeDiff / (1000 * 60 * 60);
        
        // Remind 1 hour before due time
        if (hoursUntilDue <= 1 && hoursUntilDue > 0.95) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`⏰ Lembrete: ${task.title}`, {
              body: `Esta tarefa vence em menos de 1 hora!`,
              icon: "/favicon.ico"
            });
          }
          toast.warning(`⏰ ${task.title} vence em menos de 1 hora!`);
        }
      });
    };

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check reminders every 5 minutes
    const reminderInterval = setInterval(checkReminders, 5 * 60 * 1000);
    
    return () => clearInterval(reminderInterval);
  }, [tasks]);

  // Group tasks by date and priority
  const groupedTasks = tasks.reduce((groups, task) => {
    const dateKey = format(task.dueDate, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: task.dueDate,
        alta: [],
        média: [],
        baixa: [],
      };
    }
    groups[dateKey][task.priority].push(task);
    return groups;
  }, {} as Record<string, { date: Date; alta: Task[]; média: Task[]; baixa: Task[] }>);

  const renderContent = () => {
    switch (activeView) {
      case "add":
        return <AddTaskForm onSubmit={addTask} />;
      
      case "pomodoro":
        return <PomodoroTimer onComplete={onPomodoroComplete} />;
      
      case "history":
        return <TaskHistory tasks={tasks} />;
      
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Configurações</h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {darkMode ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    <span className="text-gray-700 dark:text-gray-300">Tema Escuro</span>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 space-y-6">
            <StatsCards stats={userStats} />
            
            {Object.entries(groupedTasks)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([dateKey, group]) => (
                <div key={dateKey}>
                  {group.alta.length > 0 && (
                     <TaskDateGroup 
                      date={group.date} 
                      tasks={group.alta} 
                      priority="alta" 
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onSkip={skipTask}
                    />
                  )}
                  {group.média.length > 0 && (
                     <TaskDateGroup 
                      date={group.date} 
                      tasks={group.média} 
                      priority="média" 
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onSkip={skipTask}
                    />
                  )}
                  {group.baixa.length > 0 && (
                     <TaskDateGroup 
                      date={group.date} 
                      tasks={group.baixa} 
                      priority="baixa" 
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onSkip={skipTask}
                    />
                  )}
                </div>
              ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center animate-bounce-in">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Nenhuma tarefa encontrada
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Crie sua primeira tarefa para começar a ganhar pontos!
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex w-full">
        <AppSidebar activeItem={activeView} onItemClick={setActiveView} />
        
        <main className="flex-1 overflow-auto">
          <div className="h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50 flex items-center justify-between px-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Nível {userStats.level}</span>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{userStats.level}</span>
              </div>
            </div>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
