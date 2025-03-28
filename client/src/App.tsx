import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import AuthPage from "./pages/auth-page";
import HomePage from "./pages/home-page";
import ChallengesPage from "./pages/challenges-page";
import LeaderboardPage from "./pages/leaderboard-page";
import ProfilePage from "./pages/profile-page";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-cyberdark">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route path="/" component={HomePage} />
          <Route path="/challenges" component={ChallengesPage} />
          <Route path="/leaderboard" component={LeaderboardPage} />
          <Route path="/profile" component={ProfilePage} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}