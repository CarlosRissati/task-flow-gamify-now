import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Coffee, Zap } from "lucide-react";

interface PomodoroTimerProps {
  onComplete?: () => void;
}

export const PomodoroTimer = ({ onComplete }: PomodoroTimerProps) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [cycles, setCycles] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      // Timer finished
      setIsActive(false);
      
      if (mode === "work") {
        setCycles(prev => prev + 1);
        setMode("break");
        setMinutes(5);
        onComplete?.();
        
        // Show notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Pomodoro concluído! 🍅", {
            body: "Hora do intervalo! Você ganhou pontos de foco.",
            icon: "/favicon.ico"
          });
        }
      } else {
        setMode("work");
        setMinutes(25);
        
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Intervalo terminado! ⚡", {
            body: "Hora de voltar ao trabalho!",
            icon: "/favicon.ico"
          });
        }
      }
      setSeconds(0);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds, mode, onComplete]);

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setMinutes(mode === "work" ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (newMode: "work" | "break") => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === "work" ? 25 : 5);
    setSeconds(0);
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = mode === "work" 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Timer Pomodoro 🍅
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Mantenha o foco e seja mais produtivo
        </p>
      </div>

      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50">
        <CardHeader className="text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <Badge 
              variant={mode === "work" ? "default" : "secondary"}
              className={`cursor-pointer transition-all ${
                mode === "work" 
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => switchMode("work")}
            >
              <Zap className="w-3 h-3 mr-1" />
              Trabalho
            </Badge>
            <Badge 
              variant={mode === "break" ? "default" : "secondary"}
              className={`cursor-pointer transition-all ${
                mode === "break" 
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => switchMode("break")}
            >
              <Coffee className="w-3 h-3 mr-1" />
              Intervalo
            </Badge>
          </div>
          
          <CardTitle className={`text-6xl font-mono transition-colors ${
            mode === "work" 
              ? "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
              : "text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500"
          }`}>
            {formatTime(minutes, seconds)}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                mode === "work" 
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-green-500 to-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleStart}
              className={`px-8 py-3 rounded-xl text-white transition-all transform hover:scale-105 ${
                mode === "work"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar
                </>
              )}
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-6 py-3 rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ciclos completados: <span className="font-semibold text-purple-600 dark:text-purple-400">{cycles}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};