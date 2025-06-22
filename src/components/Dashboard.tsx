import React from 'react';
import { Trophy, Flame, Target, TrendingUp, Star, Zap, GraduationCap, TestTube, Gamepad2, Play, ArrowRight } from 'lucide-react';
import { currentUser, skills, challenges, tutorials, gameTests } from '../data/mockData';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const completedSkills = skills.filter(skill => skill.completed);
  const inProgressSkills = skills.filter(skill => skill.progress > 0 && !skill.completed);
  const activeChallenges = challenges.filter(challenge => challenge.status === 'active');
  const activeTutorials = tutorials.filter(tutorial => tutorial.progress > 0 && !tutorial.completed);
  const activeGameTests = gameTests.filter(test => test.status === 'active');

  const xpProgress = (currentUser.xp / 1000) * 100;
  const nextLevel = currentUser.level + 1;
  const xpToNextLevel = 1000 - currentUser.xp;

  const handleTutorialClick = (tutorialId: string) => {
    // Store the selected tutorial in sessionStorage for the Tutorials component
    sessionStorage.setItem('selectedTutorialId', tutorialId);
    onTabChange('tutorials');
  };

  const handleSkillClick = (skillId: string) => {
    // Store the selected skill in sessionStorage for the Skills component
    sessionStorage.setItem('selectedSkillId', skillId);
    onTabChange('skills');
  };

  const handleChallengeClick = (challengeId: string) => {
    // Store the selected challenge in sessionStorage for the Challenges component
    sessionStorage.setItem('selectedChallengeId', challengeId);
    onTabChange('challenges');
  };

  const handleGameTestClick = (testId: string) => {
    // Store the selected test in sessionStorage for the GameTesting component
    sessionStorage.setItem('selectedGameTestId', testId);
    onTabChange('game-testing');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
            <p className="text-purple-100 mt-2">Ready to level up your skills today?</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-300" />
              Level {currentUser.level}
            </div>
            <div className="text-purple-200">{xpToNextLevel} XP to Level {nextLevel}</div>
          </div>
        </div>
        
        <div className="relative mt-4">
          <div className="flex justify-between text-sm text-purple-200 mb-1">
            <span>{currentUser.xp} XP</span>
            <span>{nextLevel * 1000} XP</span>
          </div>
          <div className="w-full bg-purple-800/50 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-1000 animate-pulse"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-orange-400">{currentUser.streak} days</p>
            </div>
            <div className="bg-orange-400/20 p-3 rounded-lg">
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Skills Completed</p>
              <p className="text-2xl font-bold text-green-400">{completedSkills.length}</p>
            </div>
            <div className="bg-green-400/20 p-3 rounded-lg">
              <Trophy className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total XP</p>
              <p className="text-2xl font-bold text-blue-400">{currentUser.totalXp.toLocaleString()}</p>
            </div>
            <div className="bg-blue-400/20 p-3 rounded-lg">
              <Star className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Badges Earned</p>
              <p className="text-2xl font-bold text-purple-400">{currentUser.badges.length}</p>
            </div>
            <div className="bg-purple-400/20 p-3 rounded-lg">
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Continue Learning</h2>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              {inProgressSkills.slice(0, 3).map((skill) => (
                <div 
                  key={skill.id} 
                  onClick={() => handleSkillClick(skill.id)}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer group transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center">
                      {skill.title}
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      {skill.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{skill.progress}% Complete</span>
                    <span>+{skill.xpReward} XP</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tutorials */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Active Tutorials</h2>
              <GraduationCap className="h-5 w-5 text-cyan-400" />
            </div>
            
            <div className="space-y-4">
              {activeTutorials.slice(0, 2).map((tutorial) => (
                <div 
                  key={tutorial.id} 
                  onClick={() => handleTutorialClick(tutorial.id)}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer group transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center">
                      {tutorial.title}
                      <Play className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <span className="text-xs bg-cyan-600 text-white px-2 py-1 rounded-full">
                      {tutorial.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{tutorial.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{tutorial.progress}% Complete</span>
                    <span className="text-yellow-400 font-semibold">+{tutorial.xpReward} XP</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${tutorial.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Active Challenges</h2>
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            
            <div className="space-y-4">
              {activeChallenges.slice(0, 2).map((challenge) => (
                <div 
                  key={challenge.id} 
                  onClick={() => handleChallengeClick(challenge.id)}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer group transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-yellow-300 transition-colors flex items-center">
                      {challenge.title}
                      <Zap className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      challenge.difficulty === 'Easy' ? 'bg-green-600 text-white' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-600 text-white' :
                      challenge.difficulty === 'Hard' ? 'bg-red-600 text-white' :
                      'bg-purple-600 text-white'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{challenge.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{challenge.participants} participants</span>
                    <span className="text-yellow-400 font-semibold">+{challenge.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Testing */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Game Testing</h2>
              <TestTube className="h-5 w-5 text-cyan-400" />
            </div>
            
            <div className="space-y-4">
              {activeGameTests.slice(0, 2).map((test) => (
                <div 
                  key={test.id} 
                  onClick={() => handleGameTestClick(test.id)}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer group transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center">
                      {test.title}
                      <Gamepad2 className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <span className="text-xs bg-cyan-600 text-white px-2 py-1 rounded-full">
                      {test.gameType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{test.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{test.bugsFound} bugs found</span>
                    <span className="text-yellow-400 font-semibold">+{test.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currentUser.badges.map((badge) => (
            <div key={badge.id} className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-all cursor-pointer transform hover:scale-105">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                badge.rarity === 'Common' ? 'bg-gray-600' :
                badge.rarity === 'Rare' ? 'bg-blue-600' :
                badge.rarity === 'Epic' ? 'bg-purple-600' :
                'bg-yellow-600'
              }`}>
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white text-sm">{badge.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{badge.rarity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onTabChange('tutorials')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white text-center cursor-pointer hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <GraduationCap className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">New Tutorial</h3>
          <p className="text-purple-100 text-sm">Start learning something new</p>
        </button>

        <button
          onClick={() => onTabChange('game-testing')}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-white text-center cursor-pointer hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <TestTube className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Test Games</h3>
          <p className="text-cyan-100 text-sm">Help improve gaming experiences</p>
        </button>

        <button
          onClick={() => onTabChange('challenges')}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white text-center cursor-pointer hover:from-yellow-700 hover:to-orange-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <Zap className="h-8 w-8 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Join Challenge</h3>
          <p className="text-yellow-100 text-sm">Compete with other learners</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;