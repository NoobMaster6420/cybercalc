import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type LeaderboardUser = Pick<User, "id" | "username" | "points">;

export default function LeaderboardPage() {
  const { user } = useAuth();
  
  const { data: leaderboardUsers, isLoading: isLoadingLeaderboard } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 2000, // Refetch every 2 seconds
    refetchOnWindowFocus: true,
  });

  // Helper function to get user level based on points
  const getUserLevel = (points: number) => {
    if (points >= 1000) return { name: "Maestro", bgColor: "bg-yellow-600", textColor: "text-yellow-100" };
    if (points >= 700) return { name: "Experto", bgColor: "bg-purple-600", textColor: "text-purple-100" };
    if (points >= 400) return { name: "Avanzado", bgColor: "bg-blue-600", textColor: "text-blue-100" };
    return { name: "Intermedio", bgColor: "bg-green-600", textColor: "text-green-100" };
  };

  if (isLoadingLeaderboard) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyberprimary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!leaderboardUsers) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive" className="max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudo cargar el ranking. Por favor, intenta de nuevo.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Find current user's position in leaderboard
  const currentUserRank = leaderboardUsers.findIndex(u => user && u.id === user.id) + 1;

  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-3xl font-cyber font-bold text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tabla de <span className="text-cyberaccent">Clasificación</span>
          </motion.h1>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-cyberdark p-6 rounded-lg cyber-border">
              <div className="grid grid-cols-12 gap-4 items-center mb-4 pb-2 border-b border-cyberprimary">
                <div className="col-span-1 text-gray-300 font-medium">#</div>
                <div className="col-span-6 text-gray-300 font-medium">Usuario</div>
                <div className="col-span-3 text-gray-300 font-medium text-right">Puntos</div>
                <div className="col-span-2 text-gray-300 font-medium text-right">Nivel</div>
              </div>
              
              {leaderboardUsers.slice(0, 10).map((leaderboardUser, index) => {
                const isCurrentUser = user && leaderboardUser.id === user.id;
                const rank = index + 1;
                const userLevel = getUserLevel(leaderboardUser.points);
                
                // Different styling for top 3
                let rowClasses = "grid grid-cols-12 gap-4 items-center py-3 border-b border-cyberprimary border-opacity-20 hover:bg-cyberprimary hover:bg-opacity-10 transition duration-200";
                let rankStyle = "text-gray-400";
                
                if (rank === 1) {
                  rowClasses = "grid grid-cols-12 gap-4 items-center py-3 border-b border-cyberbg bg-gradient-to-r from-cyberprimary to-cyberbg bg-opacity-20 rounded-md mb-2 transform transition duration-300 hover:scale-102";
                  rankStyle = "font-medium text-yellow-400";
                } else if (rank === 2) {
                  rowClasses = "grid grid-cols-12 gap-4 items-center py-3 border-b border-cyberbg bg-gradient-to-r from-gray-500 to-cyberbg bg-opacity-20 rounded-md mb-2 transform transition duration-300 hover:scale-102";
                  rankStyle = "font-medium text-gray-300";
                } else if (rank === 3) {
                  rowClasses = "grid grid-cols-12 gap-4 items-center py-3 border-b border-cyberbg bg-gradient-to-r from-yellow-700 to-cyberbg bg-opacity-20 rounded-md mb-2 transform transition duration-300 hover:scale-102";
                  rankStyle = "font-medium text-yellow-700";
                }
                
                // Apply special styling if it's the current user
                if (isCurrentUser) {
                  rowClasses = "grid grid-cols-12 gap-4 items-center py-3 mb-2 border border-cyberaccent bg-cyberaccent bg-opacity-10 rounded-md transform transition duration-300 hover:scale-102";
                  rankStyle = "font-medium text-cyberaccent";
                }
                
                return (
                  <div key={leaderboardUser.id} className={rowClasses}>
                    <div className={`col-span-1 ${rankStyle}`}>{rank}</div>
                    <div className={`col-span-6 ${isCurrentUser ? "font-medium text-white" : "text-gray-300"}`}>
                      {isCurrentUser ? "TÚ" : leaderboardUser.username}
                    </div>
                    <div className={`col-span-3 text-right ${isCurrentUser ? "font-medium text-cyberaccent" : "text-cyberaccent"}`}>
                      {leaderboardUser.points}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className={`${userLevel.bgColor} ${userLevel.textColor} px-2 py-1 rounded text-xs`}>
                        {userLevel.name}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Show current user if not in top 10 */}
              {user && currentUserRank > 10 && (
                <>
                  <div className="grid grid-cols-12 gap-4 items-center py-3 border-b border-dashed border-cyberprimary opacity-50">
                    <div className="col-span-12 text-center text-gray-400">...</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-4 items-center py-3 mb-2 border border-cyberaccent bg-cyberaccent bg-opacity-10 rounded-md mt-4">
                    <div className="col-span-1 font-medium text-cyberaccent">{currentUserRank}</div>
                    <div className="col-span-6 font-medium text-white">TÚ</div>
                    <div className="col-span-3 text-right font-medium text-cyberaccent">{user.points}</div>
                    <div className="col-span-2 text-right">
                      <span className={`${getUserLevel(user.points).bgColor} ${getUserLevel(user.points).textColor} px-2 py-1 rounded text-xs`}>
                        {getUserLevel(user.points).name}
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-center mt-6">
                <Button className="cyber-btn px-6 py-2 bg-cybersecondary hover:bg-blue-700 text-white font-medium rounded-md transition duration-300 shadow-neon-blue">
                  Ver Tabla Completa
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
