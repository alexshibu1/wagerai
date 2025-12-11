'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface TaskInputDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (tasks: string[]) => void;
}

export default function TaskInputDialog({ open, onClose, onConfirm }: TaskInputDialogProps) {
  const [tasks, setTasks] = useState(['', '', '']);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Auto-focus first input when dialog opens
  useEffect(() => {
    if (open) {
      // Reset tasks when dialog opens
      setTasks(['', '', '']);
      // Focus first input with slight delay for animation
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [open]);

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to next input on Enter (except for last input)
    if (e.key === 'Enter' && index < 2) {
      e.preventDefault();
      inputRefs[index + 1].current?.focus();
    }
    // Submit on Enter in last input if all tasks are filled
    if (e.key === 'Enter' && index === 2 && tasks.every(t => t.trim())) {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    const validTasks = tasks.filter(t => t.trim());
    if (validTasks.length === 3) {
      onConfirm(validTasks);
      onClose();
    }
  };

  const allTasksFilled = tasks.every(t => t.trim());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="label-text text-xl text-white">
            SET YOUR TOP 3 TASKS
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm mt-2">
            Define your focus priorities for this session. These will appear in your session terminal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <label className="label-text text-xs text-zinc-400 mb-2 block">
                TASK {index + 1}
              </label>
              <Input
                ref={inputRefs[index]}
                type="text"
                placeholder={`Enter task ${index + 1}...`}
                value={tasks[index]}
                onChange={(e) => handleTaskChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 h-12 text-white text-base transition-all focus-visible:border-amber-500/60 focus-visible:bg-white/[0.05] focus-visible:shadow-[0_0_0_2px_rgba(251,191,36,0.4),0_0_20px_rgba(251,191,36,0.2)]"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.08]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!allTasksFilled}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Tasks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
