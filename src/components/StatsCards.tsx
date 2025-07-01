
import { UserStats } from "@/pages/Index";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Zap, Star } from "lucide-react";

interface StatsCardsProps {
  stats: UserStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tarefas Completas</p>
              <p className="text-2xl font-bold">{stats.completedTasks}</p>
              <p className="text-blue-100 text-xs">de {stats.totalTasks} total</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pontos Totais</p>
              <p className="text-2xl font-bold">{stats.totalPoints}</p>
              <Badge className="bg-purple-400 text-purple-900 text-xs mt-1">
                Nível {stats.level}
              </Badge>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Sequência</p>
              <p className="text-2xl font-bold">{stats.streak}</p>
              <p className="text-orange-100 text-xs">dias consecutivos</p>
            </div>
            <Zap className="w-8 h-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Esta Semana</p>
              <p className="text-2xl font-bold">{stats.weeklyCompleted}</p>
              <p className="text-green-100 text-xs">tarefas concluídas</p>
            </div>
            <Trophy className="w-8 h-8 text-green-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
