
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TheoryPage from "@/pages/theory-page";
import QuizPage from "@/pages/quiz-page";
import ChallengesPage from "@/pages/challenges-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import GamePage from "@/pages/game-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/teoria" component={TheoryPage} />
      <ProtectedRoute path="/quiz" component={QuizPage} />
      <ProtectedRoute path="/retos" component={ChallengesPage} />
      <ProtectedRoute path="/ranking" component={LeaderboardPage} />
      <ProtectedRoute path="/juegos-historia" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-cyberdark">
          <Router />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
