import React from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, Trophy } from 'lucide-react';
import { Progress } from '../ui/Progress';
import { formatNumber } from '../../lib/utils';

interface UserGreetingProps {
  name: string;
  xp: number;
  level: number;
  xpProgress: number;
  streak?: number;
  badges?: number;
}

const UserGreeting: React.FC<UserGreetingProps> = ({
  name,
  xp,
  level,
  xpProgress,
  streak = 0,
  badges = 0
}) => {
  const nextLevel = level + 1;
  const xpToNextLevel = Math.ceil((1000 - (xp % 1000)) / 10) * 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-8 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-2"
          >
            Welcome back, {name}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-purple-100 text-lg"
          >
            Ready to continue your learning journey?
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-right"
        >
          <div className="text-3xl font-bold flex items-center mb-2">
            <Star className="h-8 w-8 mr-3 text-yellow-300" />
            Level {level}
          </div>
          <div className="text-purple-200 text-lg">
            {formatNumber(xpToNextLevel)} XP to Level {nextLevel}
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative mt-6"
      >
        <div className="flex justify-between text-sm text-purple-200 mb-2">
          <span>{formatNumber(xp)} XP</span>
          <span>{formatNumber(nextLevel * 1000)} XP</span>
        </div>
        <Progress 
          value={xpProgress} 
          variant="success"
          size="lg"
          className="bg-purple-800/50"
        />
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-start space-x-8 mt-6"
      >
        {streak > 0 && (
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-300" />
            <span className="font-semibold">{streak} day streak</span>
          </div>
        )}
        {badges > 0 && (
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-300" />
            <span className="font-semibold">{badges} badges</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-blue-300" />
          <span className="font-semibold">{formatNumber(xp)} total XP</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { UserGreeting };