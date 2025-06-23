import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, Star, Play, ChevronRight } from 'lucide-react';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { cn, getProgressColor } from '../../lib/utils';

interface CardItem {
  id: string;
  title: string;
  description?: string;
  progress?: number;
  xpReward: number;
  completed?: boolean;
  category?: string;
  type?: string;
  estimatedTime?: string;
  difficulty?: string;
  color?: string;
}

interface CardGridProps {
  items: CardItem[];
  onClick: (item: CardItem) => void;
  columns?: 1 | 2 | 3 | 4;
  showProgress?: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({
  items,
  onClick,
  columns = 2,
  showProgress = true
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-gray-500 text-lg">No items to display</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('grid gap-6', gridClasses[columns])}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          onClick={() => onClick(item)}
          className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {item.description}
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors transform group-hover:translate-x-1" />
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.category && (
              <Badge variant="outline" size="sm">
                {item.category}
              </Badge>
            )}
            {item.difficulty && (
              <Badge 
                variant={
                  item.difficulty === 'Beginner' ? 'success' :
                  item.difficulty === 'Intermediate' ? 'warning' :
                  item.difficulty === 'Advanced' ? 'error' : 'default'
                }
                size="sm"
              >
                {item.difficulty}
              </Badge>
            )}
            {item.completed && (
              <Badge variant="success" size="sm">
                <Trophy className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            {item.estimatedTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{item.estimatedTime}</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-yellow-400">
              <Trophy className="h-4 w-4" />
              <span className="font-semibold">+{item.xpReward} XP</span>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && item.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(item.progress)}%</span>
              </div>
              <Progress 
                value={item.progress} 
                variant={item.completed ? 'success' : 'default'}
                size="md"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-center">
            <motion.button
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all',
                item.completed
                  ? 'bg-green-600 text-white'
                  : item.progress && item.progress > 0
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-4 w-4" />
              <span>
                {item.completed 
                  ? 'Review' 
                  : item.progress && item.progress > 0 
                  ? 'Continue' 
                  : 'Start'
                }
              </span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export { CardGrid };