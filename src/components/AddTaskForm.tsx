
import { useState } from "react";
import { Task } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AddTaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
}

export const AddTaskForm = ({ onSubmit }: AddTaskFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("13:47");
  const [activity, setActivity] = useState("");
  const [priority, setPriority] = useState<"baixa" | "média" | "alta">("média");

  const handleSubmit = () => {
    if (!activity.trim()) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const dueDate = new Date(selectedDate);
    dueDate.setHours(hours, minutes);

    const pointsMap = {
      baixa: 10,
      média: 20,
      alta: 30,
    };

    onSubmit({
      title: activity.trim(),
      description: "",
      priority,
      dueDate,
      tags: [],
      points: pointsMap[priority],
    });

    setActivity("");
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-3 text-lg">📅 Data</h3>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
            </span>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-3 text-lg">🕐 Horário</h3>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-gray-700/50">
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="text-center text-lg font-medium bg-transparent border-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-3 text-lg">✏️ Atividades</h3>
        <Textarea
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Digite sua atividade..."
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm min-h-[100px] rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-3 text-lg">🎯 Prioridade</h3>
        <div className="flex space-x-3">
          {[
            { value: "alta", label: "Alta", color: "from-red-500 to-pink-500", points: "30pts" },
            { value: "média", label: "Média", color: "from-yellow-500 to-orange-500", points: "20pts" },
            { value: "baixa", label: "Baixa", color: "from-green-500 to-emerald-500", points: "10pts" }
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPriority(p.value as "baixa" | "média" | "alta")}
              className={`flex-1 flex flex-col items-center space-y-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                priority === p.value
                  ? `bg-gradient-to-r ${p.color} text-white shadow-lg transform scale-105`
                  : "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-600/80 hover:shadow-md"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full ${
                  priority === p.value
                    ? "bg-white/30"
                    : `bg-gradient-to-r ${p.color}`
                }`}
              />
              <span className="font-medium">{p.label}</span>
              <span className="text-xs opacity-75">{p.points}</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl py-4 font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
        disabled={!activity.trim()}
      >
        🚀 Adicionar Tarefa
      </Button>
    </div>
  );
};
