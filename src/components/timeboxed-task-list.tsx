'use client';

import { useState } from 'react';
import { Check, Sun, Zap, Moon } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  timebox?: 'morning' | 'deep' | 'closing';
}

interface TimeboxedTaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export default function TimeboxedTaskList({ tasks, onTaskToggle }: TimeboxedTaskListProps) {
  const [animatingTask, setAnimatingTask] = useState<string | null>(null);

  const handleToggle = (taskId: string) => {
    setAnimatingTask(taskId);
    onTaskToggle(taskId);
    
    // Trigger confetti animation
    createConfetti();
    
    setTimeout(() => setAnimatingTask(null), 1000);
  };

  const createConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);

    // Create 20 confetti pieces with soft mint color
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'data-text text-2xl soft-mint';
      confetti.textContent = ['$', '✓'][Math.floor(Math.random() * 2)];
      confetti.style.position = 'absolute';
      confetti.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
      confetti.style.top = '50%';
      confetti.style.transform = 'translate(-50%, -50%)';
      confetti.style.animation = `confettiFall ${1 + Math.random()}s ease-out forwards`;
      confettiContainer.appendChild(confetti);
    }

    // Clean up after animation
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 2000);
  };

  const timeboxes = [
    {
      id: 'morning',
      label: 'Morning Flow',
      icon: Sun,
      color: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
    },
    {
      id: 'deep',
      label: 'Deep Work',
      icon: Zap,
      color: 'from-purple-500/20 to-blue-500/20',
      iconColor: 'text-purple-400',
    },
    {
      id: 'closing',
      label: 'Closing Bell',
      icon: Moon,
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-400',
    },
  ];

  const getTasksByTimebox = (timebox: string) => {
    return tasks.filter(t => t.timebox === timebox);
  };

  return (
    <div className="space-y-6 w-full">
      {timeboxes.map((box) => {
        const BoxIcon = box.icon;
        const boxTasks = getTasksByTimebox(box.id);

        return (
          <div key={box.id} className="glass-panel p-6">
            {/* Timebox Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${box.color}`}>
                <BoxIcon size={18} className={box.iconColor} />
              </div>
              <div>
                <div className="label-text">{box.label.toUpperCase()}</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {boxTasks.filter(t => t.completed).length} / {boxTasks.length} complete
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {boxTasks.length > 0 ? (
                boxTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleToggle(task.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] transition-all cursor-pointer group ${
                      animatingTask === task.id ? 'scale-105' : ''
                    }`}
                  >
                    {/* Custom Checkbox */}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      task.completed 
                        ? 'border-soft-mint bg-soft-mint' 
                        : 'border-white/30 group-hover:border-white/50'
                    }`}>
                      {task.completed && <Check size={14} className="text-black font-bold" />}
                    </div>

                    {/* Task Title */}
                    <div className={`data-text text-sm transition-all flex-1 text-left ${
                      task.completed ? 'text-zinc-500 line-through' : 'text-chalk'
                    }`}>
                      {task.title}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-600 text-sm">
                  No tasks assigned
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
