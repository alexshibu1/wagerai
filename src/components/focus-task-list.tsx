'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface FocusTaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export default function FocusTaskList({ tasks, onTaskToggle }: FocusTaskListProps) {
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

    // Create 20 confetti pieces
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'data-text text-2xl neon-mint';
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

  return (
    <div className="space-y-3 w-full max-w-2xl">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => handleToggle(task.id)}
          className={`glass-panel w-full px-6 py-5 flex items-center gap-4 hover:bg-white/[0.05] transition-all cursor-pointer group ${
            animatingTask === task.id ? 'scale-105' : ''
          }`}
        >
          {/* Custom Checkbox */}
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'border-neon-mint bg-neon-mint' 
              : 'border-white/30 group-hover:border-white/50'
          }`}>
            {task.completed && <Check size={16} className="text-black font-bold" />}
          </div>

          {/* Task Title */}
          <div className={`data-text text-lg transition-all ${
            task.completed ? 'text-zinc-500 line-through' : 'text-white'
          }`}>
            {task.title}
          </div>
        </button>
      ))}
    </div>
  );
}
