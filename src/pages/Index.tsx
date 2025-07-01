
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskDateGroup } from "@/components/TaskDateGroup";
import { AddTaskForm } from "@/components/AddTaskForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const updateUserStats = () => {
    const completedTasks = tasks.filter(task => task.status === "concluída");
    const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);
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
      
      case "history":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Histórico</h2>
            <div className="text-center py-12">
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        );
      
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Configurações</h2>
            <div className="text-center py-12">
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4">
            {Object.entries(groupedTasks)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([dateKey, group]) => (
                <div key={dateKey}>
                  {group.alta.length > 0 && (
                    <TaskDateGroup date={group.date} tasks={group.alta} priority="alta" />
                  )}
                  {group.média.length > 0 && (
                    <TaskDateGroup date={group.date} tasks={group.média} priority="média" />
                  )}
                  {group.baixa.length > 0 && (
                    <TaskDateGroup date={group.date} tasks={group.baixa} priority="baixa" />
                  )}
                </div>
              ))}
            
            {tasks.length === 0 && (
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
            )}
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex w-full">
        <AppSidebar activeItem={activeView} onItemClick={setActiveView} />
        
        <main className="flex-1 overflow-auto">
          <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              5:13 PM
            </span>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
