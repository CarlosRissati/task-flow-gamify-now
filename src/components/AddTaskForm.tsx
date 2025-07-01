
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
        <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-3">Data</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">
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
        <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-3">Time</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="text-center text-lg"
          />
        </div>
      </div>

      <div>
        <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-3">Atividades</h3>
        <Textarea
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Digite sua atividade..."
          className="bg-white dark:bg-gray-800 min-h-[100px]"
        />
      </div>

      <div>
        <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-3">Prioridade</h3>
        <div className="flex space-x-4">
          {["alta", "média", "baixa"].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p as "baixa" | "média" | "alta")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                priority === p
                  ? "bg-white dark:bg-gray-700 shadow-md"
                  : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full ${
                  p === "alta"
                    ? "bg-red-500"
                    : p === "média"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              />
              <span className="text-gray-700 dark:text-gray-300 capitalize">{p}</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-gray-400 hover:bg-gray-500 text-white rounded-lg py-3"
        disabled={!activity.trim()}
      >
        Adicionar Tarefa
      </Button>
    </div>
  );
};
