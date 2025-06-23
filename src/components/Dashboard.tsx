import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, BookOpen, TestTube, Sword, Target, Flame, Star } from 'lucide-react';
import { Badge } from './ui/Badge';
import { CardGrid } from './dashboard/CardGrid';
import { UserGreeting } from './dashboard/UserGreeting';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { currentUser, skills, tutorials, challenges, gameTests } from '../data/mockData';
import { cn } from '../lib/utils';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const [selectedSection, setSelectedSection] = useSessionStorage<string>('selectedSection', 'Continue Learning');

  const xpThreshold = 1000;
  const xpProgress = useMemo(() => (currentUser.xp / xpThreshold) * 100, []);

  const inProgress = useMemo(() => {
    const activeSkills = skills.filter(s => !s.completed && s.progress > 0);
    const activeTutorials = tutorials.filter(t => !t.completed && t.progress > 0);
    const activeChallenges = challenges.filter(c => c.status === 'active');
    const activeTests = gameTests.filter(t => t.status === 'active');

    return {
      skills: activeSkills,
      tutorials: activeTutorials,
      challenges: activeChallenges,
      tests: activeTests,
      all: [...activeSkills, ...activeTutorials, ...activeChallenges, ...activeTests]
    };
  }, []);

  const sectionContent = useMemo(() => {
    switch (selectedSection) {
      case 'Continue Learning':
        return [...inProgress.skills, ...inProgress.tutorials].slice(0, 6);
      case 'Active Tutorials':
        return inProgress.tutorials;
      case 'Active Challenges':
        return inProgress.challenges;
      case 'Game Testing':
        return inProgress.tests;
      default:
        return inProgress.all.slice(0, 6);
    }
  }, [selectedSection, inProgress]);

  const handleSectionChange = useCallback((section: string) => {
    setSelectedSection(section);
  }, [setSelectedSection]);

  const handleItemClick = useCallback((item: any) => {
    // Store the selected item in sessionStorage for the respective component
    if (item.lessons) {
      // It's a skill
      sessionStorage.setItem('selectedSkillId', item.id);
      onTabChange('skills');
    } else if (item.modules) {
      // It's a tutorial
      sessionStorage.setItem('selectedTutorialId', item.id);
      onTabChange('tutorials');
    } else if (item.timeLimit) {
      // It's a challenge
      sessionStorage.setItem('selectedChallengeId', item.id);
      onTabChange('challenges');
    } else if (item.testingAreas) {
      // It's a game test
      sessionStorage.setItem('selectedGameTestId', item.id);
      onTabChange('game-testing');
    }
  }, [onTabChange]);

  const sections = useMemo(() => [
    { 
      id: 'Continue Learning', 
      label: 'Continue Learning', 
      icon: BookOpen,
      count: inProgress.skills.length + inProgress.tutorials.length 
    },
    { 
      id: 'Active Tutorials', 
      label: 'Active Tutorials', 
      icon: BookOpen,
      count: inProgress.tutorials.length 
    },
    { 
      id: 'Active Challenges', 
      label: 'Active Challenges', 
      icon: Sword,
      count: inProgress.challenges.length 
    },
    { 
      id: 'Game Testing', 
      label: 'Game Testing', 
      icon: TestTube,
      count: inProgress.tests.length 
    }
  ], [inProgress]);

  const completedSkills = skills.filter(skill => skill.completed);
  const totalLessons = skills.reduce((acc, skill) => acc + skill.lessons.length, 0);
  const completedLessons = skills.reduce((acc, skill) => 
    acc + skill.lessons.filter(lesson => lesson.completed).length, 0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* User Greeting */}
      <UserGreeting 
        name={currentUser.name}
        xp={currentUser.xp}
        level={currentUser.level}
        xpProgress={xpProgress}
        streak={currentUser.streak}
        badges={currentUser.badges.length}
      />

      {/* Enhanced Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { 
            label: 'Current Streak', 
            value: `${currentUser.streak} days`, 
            icon: Flame, 
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/20'
          },
          { 
            label: 'Skills Completed', 
            value: completedSkills.length, 
            icon: Trophy, 
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/20'
          },
          { 
            label: 'Total XP', 
            value: currentUser.totalXp.toLocaleString(), 
            icon: Star, 
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/20'
          },
          { 
            label: 'Badges Earned', 
            value: currentUser.badges.length, 
            icon: Target, 
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/20'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-wrap gap-3"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Badge
              key={section.id}
              variant={selectedSection === section.id ? 'primary' : 'default'}
              size="md"
              className={cn(
                'cursor-pointer transition-all duration-300 flex items-center space-x-2 px-4 py-2',
                selectedSection === section.id 
                  ? 'scale-105 shadow-lg' 
                  : 'hover:scale-105'
              )}
              onClick={() => handleSectionChange(section.id)}
            >
              <Icon className="h-4 w-4" />
              <span>{section.label}</span>
              {section.count > 0 && (
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {section.count}
                </span>
              )}
            </Badge>
          );
        })}
      </motion.div>

      {/* Dynamic Content Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <CardGrid 
            items={sectionContent} 
            onClick={handleItemClick}
            columns={2}
            showProgress={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Trophy className="h-6 w-6 text-yellow-400 mr-3" />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currentUser.badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
              className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all cursor-pointer transform hover:scale-105"
            >
              <div className={cn(
                'inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 shadow-lg',
                badge.rarity === 'Common' ? 'bg-gray-600' :
                badge.rarity === 'Rare' ? 'bg-blue-600' :
                badge.rarity === 'Epic' ? 'bg-purple-600' :
                'bg-yellow-600'
              )}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{badge.name}</h3>
              <p className="text-xs text-gray-400">{badge.rarity}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'New Tutorial',
            description: 'Start learning something new',
            icon: BookOpen,
            color: 'from-purple-600 to-blue-600',
            action: () => onTabChange('tutorials')
          },
          {
            title: 'Test Games',
            description: 'Help improve gaming experiences',
            icon: TestTube,
            color: 'from-cyan-600 to-blue-600',
            action: () => onTabChange('game-testing')
          },
          {
            title: 'Join Challenge',
            description: 'Compete with other learners',
            icon: Sword,
            color: 'from-yellow-600 to-orange-600',
            action: () => onTabChange('challenges')
          }
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
              onClick={action.action}
              className={cn(
                'bg-gradient-to-r rounded-2xl p-6 text-white text-center cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                action.color
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">{action.title}</h3>
              <p className="text-white/80 text-sm">{action.description}</p>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;