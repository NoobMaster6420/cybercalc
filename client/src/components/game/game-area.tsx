import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen } from "lucide-react";

interface StoryScenario {
  id: number;
  title: string;
  description: string;
  image: string;
  stories: StoryEpisode[];
}

interface StoryEpisode {
  id: string;
  title: string;
  content: string;
  example: string;
  solution: string;
  explanation: string;
  questionPrompt: string;
  question: any;
}

interface GameAreaProps {
  scenarios: StoryScenario[];
  selectedScenario: number | null;
  selectedStory: string | null;
  onSelectScenario: (id: number) => void;
  onSelectStory: (id: string) => void;
  progress: Record<string, boolean>;
}

export default function GameArea({
  scenarios,
  selectedScenario,
  selectedStory,
  onSelectScenario,
  onSelectStory,
  progress
}: GameAreaProps) {
  // Encontrar el escenario seleccionado
  const currentScenario = selectedScenario !== null 
    ? scenarios.find(s => s.id === selectedScenario) 
    : null;

  // Lista de escenarios
  if (selectedScenario === null) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map(scenario => (
          <motion.div
            key={scenario.id}
            className="bg-cyberbg p-6 rounded-lg cyber-border hover:shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
            whileHover={{ y: -5 }}
            onClick={() => onSelectScenario(scenario.id)}
          >
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{scenario.image}</div>
              <h2 className="text-2xl font-cyber font-bold text-blue-400">{scenario.title}</h2>
            </div>
            <p className="text-gray-300 mb-4">
              {scenario.description}
            </p>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">
                {scenario.stories.length} episodios
              </div>
              <Button
                className="cyber-btn bg-blue-600 hover:bg-blue-500"
              >
                Explorar <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Lista de historias si hay un escenario seleccionado pero no una historia
  if (currentScenario && selectedStory === null) {
    return (
      <div className="bg-cyberbg p-6 rounded-lg cyber-border mb-6">
        <div className="flex items-center mb-6">
          <div className="text-5xl mr-4">{currentScenario.image}</div>
          <div>
            <h2 className="text-2xl font-cyber font-bold text-blue-400">{currentScenario.title}</h2>
            <p className="text-gray-300 mt-1">
              {currentScenario.description}
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {currentScenario.stories.map(story => (
            <motion.div
              key={story.id}
              className={`p-4 rounded-lg cyber-border cursor-pointer ${
                progress[story.id] ? 'bg-blue-900 bg-opacity-20 border-blue-500' : 'bg-cyberdark'
              }`}
              whileHover={{ x: 5 }}
              onClick={() => onSelectStory(story.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-cyber font-medium text-blue-400">{story.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {story.content.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex items-center">
                  {progress[story.id] && (
                    <span className="mr-3 text-green-400">Completado</span>
                  )}
                  <ChevronRight className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}