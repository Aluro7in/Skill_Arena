export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  badges: Badge[];
  completedSkills: string[];
  currentChallenges: Challenge[];
  tutorialsCompleted: string[];
  gameTestingStats: GameTestingStats;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  xpReward: number;
  prerequisites: string[];
  lessons: Lesson[];
  completed: boolean;
  progress: number;
  icon: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'Gaming' | 'Coding' | 'Vibe Coding' | 'AI' | 'Game Testing';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  type: 'interactive' | 'video' | 'coding' | 'game' | 'ai-project';
  estimatedTime: string;
  xpReward: number;
  modules: TutorialModule[];
  completed: boolean;
  progress: number;
  icon: string;
  hasCodeEditor: boolean;
  hasGameSimulation: boolean;
}

export interface TutorialModule {
  id: string;
  title: string;
  type: 'theory' | 'practice' | 'challenge' | 'project';
  content: string;
  codeTemplate?: string;
  expectedOutput?: string;
  completed: boolean;
  xpReward: number;
}

export interface GameTest {
  id: string;
  title: string;
  description: string;
  gameType: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: string;
  developer: string;
  testingPeriod: string;
  xpReward: number;
  bugsFound: number;
  status: 'active' | 'completed' | 'upcoming';
  feedbackSubmitted: boolean;
  testingAreas: string[];
}

export interface GameTestingStats {
  totalBugReports: number;
  totalGamesInvolved: number;
  validBugs: number;
  feedbackScore: number;
  specializations: string[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'coding' | 'reading';
  duration: string;
  completed: boolean;
  xpReward: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  timeLimit: string;
  xpReward: number;
  participants: number;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'upcoming';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  earnedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  xp: number;
  level: number;
  skillsCompleted: number;
  streak: number;
}