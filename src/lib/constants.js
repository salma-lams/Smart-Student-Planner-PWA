import { Book, Code, Calculator, Globe, Music, Palette, Beaker, Languages, Terminal, Brain } from 'lucide-react';

export const SUBJECT_ICONS = {
  math: Calculator,
  mathematics: Calculator,
  science: Beaker,
  physics: Beaker,
  chemistry: Beaker,
  biology: Beaker,
  history: Globe,
  geography: Globe,
  english: Languages,
  spanish: Languages,
  french: Languages,
  coding: Code,
  programming: Code,
  dev: Code,
  art: Palette,
  music: Music,
  reading: Book,
  literature: Book,
  philosophy: Brain,
  psychology: Brain,
  default: Book
};

export const getSubjectIcon = (subject = '') => {
  const s = subject.toLowerCase().trim();
  for (const key in SUBJECT_ICONS) {
    if (s.includes(key)) return SUBJECT_ICONS[key];
  }
  return SUBJECT_ICONS.default;
};

export const PRIORITY_COLORS = {
  low: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  high: 'text-red-500 bg-red-500/10 border-red-500/20'
};
