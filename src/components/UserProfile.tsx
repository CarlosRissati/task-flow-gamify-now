
import { UserStats } from "@/pages/Index";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Star } from "lucide-react";

interface UserProfileProps {
  stats: UserStats;
}

export const UserProfile = ({ stats }: UserProfileProps) => {
  const nextLevelPoints = stats.level * 100;
  const currentLevelPoints = stats.totalPoints % 100;
  const progressToNextLevel = (currentLevelPoints / 100) * 100;

  const getLevelBadge = (level: number) => {
    if (level >= 10) return { color: "bg-game-gold text-yellow-900", icon: "🏆" };
    if (level >= 5) return { color: "bg-game-silver text-gray-900", icon: "🥈" };
    return { color: "bg-game-bronze text-orange-900", icon: "🥉" };
  };

  const levelBadge = getLevelBadge(stats.level);

  return (
    <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <Avatar className="w-12 h-12">
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
          <User className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900">Usuário</h3>
          <Badge className={`text-xs ${levelBadge.color}`}>
            {levelBadge.icon} Nível {stats.level}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-purple-500" />
          <span>{stats.totalPoints} pontos</span>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Próximo nível</span>
            <span>{currentLevelPoints}/100</span>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>
      </div>
    </div>
  );
};
