import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";
import { useAuth } from './AuthContext';

// Define types
export interface ThreadSegment {
  id: string;
  content: string;
  order: number;
}

export interface Thread {
  id: string;
  title: string;
  segments: ThreadSegment[];
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPublished: boolean;
  originalThreadId?: string;
  originalAuthorName?: string;
  reactions: {
    '👏': string[]; // Array of user IDs
    '❤️': string[];
    '🔥': string[];
    '💡': string[];
    '🙏': string[];
  };
  bookmarks: string[]; // Array of user IDs
  forks: string[]; // Array of thread IDs
}

export interface Collection {
  id: string;
  name: string;
  userId: string;
  threads: string[]; // Array of thread IDs
  isPublic: boolean;
}

interface DataContextType {
  threads: Thread[];
  collections: Collection[];
  userBookmarks: string[]; // Thread IDs
  getThreadById: (id: string) => Thread | undefined;
  getThreadsByTag: (tag: string) => Thread[];
  getPublicThreads: () => Thread[];
  getUserThreads: () => Thread[];
  sortThreads: (threads: Thread[], sortBy: 'bookmarks' | 'forks' | 'newest') => Thread[];
  createThread: (title: string, segments: ThreadSegment[], tags: string[], isPublished: boolean) => Thread;
  updateThread: (threadId: string, updates: Partial<Omit<Thread, 'id' | 'authorId' | 'authorName' | 'createdAt'>>) => void;
  forkThread: (threadId: string) => Thread | undefined;
  toggleReaction: (threadId: string, reactionType: keyof Thread['reactions']) => void;
  toggleBookmark: (threadId: string) => void;
  createCollection: (name: string, isPublic: boolean) => Collection;
  updateCollection: (collectionId: string, updates: Partial<Omit<Collection, 'id' | 'userId'>>) => void;
  addToCollection: (threadId: string, collectionId: string) => void;
  removeFromCollection: (threadId: string, collectionId: string) => void;
  isThreadBookmarked: (threadId: string) => boolean;
  hasUserReacted: (threadId: string, reactionType: keyof Thread['reactions']) => boolean;
  getUserCollections: () => Collection[];
}

// Mock data with comprehensive threads across all categories
const INITIAL_THREADS: Thread[] = [
  // Productivity
  {
    id: "1",
    title: "The Two-Minute Rule Changed My Life",
    segments: [
      { id: "1-1", content: "If a task takes less than two minutes, do it immediately. This simple rule from David Allen's GTD system has eliminated 80% of my mental clutter.", order: 1 },
      { id: "1-2", content: "The magic isn't in the two minutes—it's in the decision speed. No more 'I'll do it later' pile-ups that create overwhelm and guilt.", order: 2 },
      { id: "1-3", content: "Start tomorrow: reply to that text, file that document, book that appointment. Watch your stress levels drop as your action bias grows.", order: 3 },
    ],
    authorId: "2",
    authorName: "Sarah Chen",
    createdAt: "2025-05-28T09:15:00Z",
    updatedAt: "2025-05-28T09:15:00Z",
    tags: ["Productivity", "Habits"],
    isPublished: true,
    reactions: { '👏': ['1'], '❤️': ['1', '3'], '🔥': [], '💡': ['1', '2'], '🙏': [] },
    bookmarks: ['1', '3'],
    forks: [],
  },
  {
    id: "2",
    title: "Why I Stopped Multitasking and You Should Too",
    segments: [
      { id: "2-1", content: "Multitasking is a myth. Your brain doesn't actually do multiple things at once—it rapidly switches between tasks, losing efficiency each time.", order: 1 },
      { id: "2-2", content: "I discovered this during a particularly overwhelming week. Despite feeling busy, I accomplished almost nothing meaningful. The constant switching created an illusion of progress.", order: 2 },
      { id: "2-3", content: "Now I batch similar tasks and use time blocks. One thing at a time, fully present. My output quality doubled while my stress halved.", order: 3 },
    ],
    authorId: "3",
    authorName: "Marcus Rivera",
    createdAt: "2025-05-27T14:30:00Z",
    updatedAt: "2025-05-27T14:30:00Z",
    tags: ["Productivity", "Focus"],
    isPublished: true,
    reactions: { '👏': ['2'], '❤️': [], '🔥': ['1'], '💡': ['2', '3'], '🙏': [] },
    bookmarks: ['2'],
    forks: [],
  },
  {
    id: "3",
    title: "The Power of Energy Management Over Time Management",
    segments: [
      { id: "3-1", content: "We've been thinking about productivity wrong. It's not about managing time—everyone gets 24 hours. It's about managing energy.", order: 1 },
      { id: "3-2", content: "I track my energy patterns: when I'm sharp for deep work, when I'm good for meetings, when I need to recharge. This awareness transformed my schedule.", order: 2 },
      { id: "3-3", content: "Match your tasks to your energy, not your calendar. High-energy time for creative work, medium for admin, low for learning and reflection.", order: 3 },
    ],
    authorId: "4",
    authorName: "Elena Rodriguez",
    createdAt: "2025-05-26T11:45:00Z",
    updatedAt: "2025-05-26T11:45:00Z",
    tags: ["Productivity", "Self-Awareness"],
    isPublished: true,
    reactions: { '👏': ['1', '2'], '❤️': ['3'], '🔥': [], '💡': ['1'], '🙏': ['2'] },
    bookmarks: ['1'],
    forks: [],
  },

  // Mindfulness
  {
    id: "4",
    title: "Mindfulness Isn't About Emptying Your Mind",
    segments: [
      { id: "4-1", content: "The biggest misconception about mindfulness is that you need to stop thinking. That's impossible and not the goal.", order: 1 },
      { id: "4-2", content: "Mindfulness is about noticing your thoughts without getting swept away by them. It's like sitting by a river watching the water flow, not jumping in.", order: 2 },
      { id: "4-3", content: "Start with just observing one thought cycle today. Notice it arise, acknowledge it, let it pass. This simple practice builds the foundation for everything else.", order: 3 },
    ],
    authorId: "5",
    authorName: "Dr. Amit Patel",
    createdAt: "2025-05-25T16:20:00Z",
    updatedAt: "2025-05-25T16:20:00Z",
    tags: ["Mindfulness", "Self-Awareness"],
    isPublished: true,
    reactions: { '👏': [], '❤️': ['1', '2'], '🔥': [], '💡': ['3'], '🙏': ['1'] },
    bookmarks: ['2', '3'],
    forks: [],
  },
  {
    id: "5",
    title: "The Mindful Commute: Turning Transit Time into Growth Time",
    segments: [
      { id: "5-1", content: "My 45-minute commute used to drain me. Now it's the most peaceful part of my day. The secret? Mindful observation instead of mindless scrolling.", order: 1 },
      { id: "5-2", content: "I choose one sense to focus on: the feeling of my feet on the ground, sounds around me, or my breath. No judgment, just noticing.", order: 2 },
      { id: "5-3", content: "This practice has made me more present in all areas of life. Try it tomorrow—your commute might become the best part of your day.", order: 3 },
    ],
    authorId: "6",
    authorName: "Jamie Park",
    createdAt: "2025-05-24T08:30:00Z",
    updatedAt: "2025-05-24T08:30:00Z",
    tags: ["Mindfulness", "Habits"],
    isPublished: true,
    reactions: { '👏': ['3'], '❤️': [], '🔥': [], '💡': ['1', '2'], '🙏': [] },
    bookmarks: ['1'],
    forks: [],
  },
  {
    id: "6",
    title: "The 3-3-3 Breathing Technique for Instant Calm",
    segments: [
      { id: "6-1", content: "When anxiety hits, your breath becomes shallow and rapid. This simple technique can reset your nervous system in under a minute.", order: 1 },
      { id: "6-2", content: "3-3-3: Breathe in for 3 counts, hold for 3, breathe out for 3. Repeat 3 times. The rhythm signals safety to your brain.", order: 2 },
      { id: "6-3", content: "I use this before difficult conversations, during stressful moments, and when I need to refocus. It's like having a reset button for your mind.", order: 3 },
    ],
    authorId: "7",
    authorName: "Lisa Thompson",
    createdAt: "2025-05-23T13:15:00Z",
    updatedAt: "2025-05-23T13:15:00Z",
    tags: ["Mindfulness", "Emotional Intelligence"],
    isPublished: true,
    reactions: { '👏': ['1'], '❤️': ['2', '3'], '🔥': [], '💡': [], '🙏': ['1'] },
    bookmarks: ['2'],
    forks: [],
  },

  // Learning
  {
    id: "7",
    title: "The Feynman Technique: Learn Anything by Teaching It",
    segments: [
      { id: "7-1", content: "If you can't explain something simply, you don't understand it well enough. This insight from Richard Feynman revolutionized how I learn.", order: 1 },
      { id: "7-2", content: "The process: Study a concept, then explain it to an imaginary 12-year-old. When you get stuck, you've found your knowledge gaps.", order: 2 },
      { id: "7-3", content: "Go back, fill the gaps, try again. This forced simplification exposes fuzzy thinking and builds deep understanding. Teaching is learning.", order: 3 },
    ],
    authorId: "8",
    authorName: "Prof. David Kim",
    createdAt: "2025-05-22T10:45:00Z",
    updatedAt: "2025-05-22T10:45:00Z",
    tags: ["Learning", "Knowledge Management"],
    isPublished: true,
    reactions: { '👏': ['2'], '❤️': [], '🔥': ['1'], '💡': ['1', '3'], '🙏': [] },
    bookmarks: ['3'],
    forks: [],
  },
  {
    id: "8",
    title: "Why I Read the Same Books Multiple Times",
    segments: [
      { id: "8-1", content: "There's a myth that reading a book once is enough. But you're not the same person who started reading it, so why would you get the same insights?", order: 1 },
      { id: "8-2", content: "Each re-reading reveals layers I missed. My highlighted passages change based on where I am in life. The book stays the same; I evolve.", order: 2 },
      { id: "8-3", content: "Choose 5 books that shaped you and commit to re-reading them annually. You'll be amazed at what your future self discovers.", order: 3 },
    ],
    authorId: "9",
    authorName: "Rachel Green",
    createdAt: "2025-05-21T15:30:00Z",
    updatedAt: "2025-05-21T15:30:00Z",
    tags: ["Learning", "Growth", "Knowledge Management"],
    isPublished: true,
    reactions: { '👏': [], '❤️': ['1'], '🔥': [], '💡': ['2'], '🙏': [] },
    bookmarks: ['1', '2'],
    forks: [],
  },
  {
    id: "9",
    title: "The Learning Stack: Building Knowledge Like Software",
    segments: [
      { id: "9-1", content: "Developers don't reinvent every function—they build on existing libraries. Learning works the same way. You need a foundational 'stack' of knowledge.", order: 1 },
      { id: "9-2", content: "Identify your core domains, then build mental models for each. These become your learning 'libraries'—frameworks you can apply to new situations.", order: 2 },
      { id: "9-3", content: "When learning something new, first ask: 'What patterns from my stack apply here?' This accelerates understanding exponentially.", order: 3 },
    ],
    authorId: "10",
    authorName: "Alex Chen",
    createdAt: "2025-05-20T12:00:00Z",
    updatedAt: "2025-05-20T12:00:00Z",
    tags: ["Learning", "Knowledge Management", "Growth"],
    isPublished: true,
    reactions: { '👏': ['3'], '❤️': [], '🔥': [], '💡': ['1', '2'], '🙏': [] },
    bookmarks: [],
    forks: [],
  },

  // Growth
  {
    id: "10",
    title: "The Discomfort Zone: Where Real Growth Happens",
    segments: [
      { id: "10-1", content: "We talk about leaving our comfort zone, but there's a sweet spot between comfort and panic called the discomfort zone. That's where growth lives.", order: 1 },
      { id: "10-2", content: "I learned this rock climbing. Too easy and you're bored. Too hard and you freeze up. The sweet spot is that manageable stretch that makes you focus.", order: 2 },
      { id: "10-3", content: "Apply this to everything: conversations, skills, challenges. Seek the level that makes you slightly nervous but not paralyzed. That's your growth edge.", order: 3 },
    ],
    authorId: "11",
    authorName: "Jordan Blake",
    createdAt: "2025-05-19T14:15:00Z",
    updatedAt: "2025-05-19T14:15:00Z",
    tags: ["Growth", "Self-Awareness"],
    isPublished: true,
    reactions: { '👏': ['1', '2'], '❤️': [], '🔥': ['3'], '💡': [], '🙏': [] },
    bookmarks: ['3'],
    forks: [],
  },
  {
    id: "11",
    title: "Why I Started Tracking My Failures",
    segments: [
      { id: "11-1", content: "We track our successes obsessively but ignore our failures. This is backwards—failures contain more learning per ounce than successes.", order: 1 },
      { id: "11-2", content: "I keep a 'failure log': what I tried, why it didn't work, what I learned. This practice transforms failures from sources of shame into data points.", order: 2 },
      { id: "11-3", content: "The pattern recognition is incredible. You start seeing why certain approaches consistently fail and can avoid those paths in the future.", order: 3 },
    ],
    authorId: "12",
    authorName: "Maya Singh",
    createdAt: "2025-05-18T09:45:00Z",
    updatedAt: "2025-05-18T09:45:00Z",
    tags: ["Growth", "Learning", "Self-Awareness"],
    isPublished: true,
    reactions: { '👏': [], '❤️': ['1'], '🔥': [], '💡': ['2', '3'], '🙏': [] },
    bookmarks: ['2'],
    forks: [],
  },
  {
    id: "12",
    title: "The Compound Effect of Small Daily Improvements",
    segments: [
      { id: "12-1", content: "Getting 1% better every day means you're 37 times better after a year. This isn't just math—it's the secret to sustainable transformation.", order: 1 },
      { id: "12-2", content: "The key is making improvements so small they feel insignificant. Read one page, do five push-ups, write one sentence. Consistency beats intensity.", order: 2 },
      { id: "12-3", content: "After six months of tiny daily improvements, people started asking what I was doing differently. The compound effect was becoming visible.", order: 3 },
    ],
    authorId: "13",
    authorName: "Tom Wilson",
    createdAt: "2025-05-17T11:30:00Z",
    updatedAt: "2025-05-17T11:30:00Z",
    tags: ["Growth", "Habits"],
    isPublished: true,
    reactions: { '👏': ['2'], '❤️': [], '🔥': [], '💡': ['1'], '🙏': [] },
    bookmarks: ['1'],
    forks: [],
  },

  // Career
  {
    id: "13",
    title: "The Career Capital Framework",
    segments: [
      { id: "13-1", content: "Stop asking 'What's my passion?' and start asking 'What valuable skills am I building?' Career capital—rare and valuable skills—gives you career control.", order: 1 },
      { id: "13-2", content: "Early career: Focus on skill acquisition over immediate satisfaction. Late career: Leverage your capital for autonomy, impact, and fulfillment.", order: 2 },
      { id: "13-3", content: "The paradox: The more valuable you become to the market, the more freedom you have to follow your interests. Skills fund dreams.", order: 3 },
    ],
    authorId: "14",
    authorName: "Dr. Priya Sharma",
    createdAt: "2025-05-16T13:20:00Z",
    updatedAt: "2025-05-16T13:20:00Z",
    tags: ["Career", "Growth"],
    isPublished: true,
    reactions: { '👏': ['1'], '❤️': [], '🔥': ['2'], '💡': ['3'], '🙏': [] },
    bookmarks: ['2', '3'],
    forks: [],
  },
  {
    id: "14",
    title: "How I Learned to Say No to Good Opportunities",
    segments: [
      { id: "14-1", content: "The hardest part of career growth isn't saying no to bad opportunities—it's saying no to good ones that don't align with your strategy.", order: 1 },
      { id: "14-2", content: "I created a simple filter: Does this opportunity build my key skills, expand my network in meaningful ways, or advance my long-term vision?", order: 2 },
      { id: "14-3", content: "Since implementing this filter, my career has become more intentional and focused. Sometimes the best move is the opportunity you don't take.", order: 3 },
    ],
    authorId: "15",
    authorName: "Carlos Mendez",
    createdAt: "2025-05-15T16:00:00Z",
    updatedAt: "2025-05-15T16:00:00Z",
    tags: ["Career", "Focus", "Growth"],
    isPublished: true,
    reactions: { '👏': [], '❤️': ['1'], '🔥': [], '💡': ['2'], '🙏': [] },
    bookmarks: ['1'],
    forks: [],
  },
  {
    id: "15",
    title: "The Network Effect: Quality Over Quantity",
    segments: [
      { id: "15-1", content: "Networking events made me feel gross until I reframed networking as 'building genuine relationships with interesting people doing meaningful work.'", order: 1 },
      { id: "15-2", content: "Instead of collecting business cards, I focus on having real conversations. I ask about challenges, share resources, and follow up meaningfully.", order: 2 },
      { id: "15-3", content: "My network is smaller but stronger. These relationships have led to collaborations, opportunities, and friendships that transformed my career.", order: 3 },
    ],
    authorId: "16",
    authorName: "Sophie Laurent",
    createdAt: "2025-05-14T10:30:00Z",
    updatedAt: "2025-05-14T10:30:00Z",
    tags: ["Career", "Leadership", "Growth"],
    isPublished: true,
    reactions: { '👏': ['3'], '❤️': [], '🔥': [], '💡': ['1'], '🙏': [] },
    bookmarks: [],
    forks: [],
  },

  // Work
  {
    id: "16",
    title: "The Art of Deep Work in an Distracted World",
    segments: [
      { id: "16-1", content: "Deep work—the ability to focus on cognitively demanding tasks—is becoming rare and therefore more valuable. It's the new superpower.", order: 1 },
      { id: "16-2", content: "I block 2-hour windows for deep work: phone off, notifications disabled, single task only. These sessions produce more value than entire days of scattered work.", order: 2 },
      { id: "16-3", content: "Start with 45-minute blocks and build up. Protect this time fiercely. Your future self will thank you for the meaningful progress you make.", order: 3 },
    ],
    authorId: "17",
    authorName: "Dr. James Mitchell",
    createdAt: "2025-05-13T14:45:00Z",
    updatedAt: "2025-05-13T14:45:00Z",
    tags: ["Work", "Focus", "Productivity"],
    isPublished: true,
    reactions: { '👏': ['2'], '❤️': ['1'], '🔥': [], '💡': [], '🙏': [] },
    bookmarks: ['2'],
    forks: [],
  },
  {
    id: "17",
    title: "Remote Work Boundaries: The Home Office Mindset",
    segments: [
      { id: "17-1", content: "Working from home blurred my boundaries until I couldn't tell where work ended and life began. The solution wasn't physical—it was psychological.", order: 1 },
      { id: "17-2", content: "I created 'commute rituals': morning coffee while reviewing my day's priorities, evening walk to 'leave the office.' These signal work mode on/off.", order: 2 },
      { id: "17-3", content: "Your brain needs clear transitions. Without them, you're always partially working or partially not working. Neither is sustainable.", order: 3 },
    ],
    authorId: "18",
    authorName: "Anna Kowalski",
    createdAt: "2025-05-12T11:15:00Z",
    updatedAt: "2025-05-12T11:15:00Z",
    tags: ["Work", "Habits", "Self-Awareness"],
    isPublished: true,
    reactions: { '👏': [], '❤️': [], '🔥': [], '💡': ['1', '2'], '🙏': [] },
    bookmarks: ['1', '2'],
    forks: [],
  },
  {
    id: "18",
    title: "The Meeting Paradox: When Collaboration Kills Productivity",
    segments: [
      { id: "18-1", content: "We schedule meetings to be productive, then wonder why we can't get work done. Most meetings are poorly designed collaboration theater.", order: 1 },
      { id: "18-2", content: "Before accepting any meeting, I ask: What's the specific outcome? Could this be an email? Do I add unique value? Am I needed for the full duration?", order: 2 },
      { id: "18-3", content: "My calendar went from 80% meetings to 40%. The remaining meetings are higher quality, more focused, and actually productive.", order: 3 },
    ],
    authorId: "19",
    authorName: "Michael Zhang",
    createdAt: "2025-05-11T09:30:00Z",
    updatedAt: "2025-05-11T09:30:00Z",
    tags: ["Work", "Productivity", "Leadership"],
    isPublished: true,
    reactions: { '👏': ['1', '3'], '❤️': [], '🔥': [], '💡': ['2'], '🙏': [] },
    bookmarks: ['3'],
    forks: [],
  },

  // Change
  {
    id: "19",
    title: "Why Change Fails and How to Make It Stick",
    segments: [
      { id: "19-1", content: "Most change attempts fail because we focus on outcomes instead of systems. You don't rise to your goals—you fall to your systems.", order: 1 },
      { id: "19-2", content: "Instead of 'I want to write a book,' try 'I am someone who writes 200 words every morning.' Identity-based change is sustainable change.", order: 2 },
      { id: "19-3", content: "Every action is a vote for the person you want to become. Focus on being that person today, and the outcomes will follow.", order: 3 },
    ],
    authorId: "20",
    authorName: "Dr. Sarah Johnson",
    createdAt: "2025-05-10T15:45:00Z",
    updatedAt: "2025-05-10T15:45:00Z",
    tags: ["Change", "Habits", "Growth"],
    isPublished: true,
    reactions: { '👏': [], '❤️': ['1'], '🔥': [], '💡': ['2', '3'], '🙏': [] },
    bookmarks: ['2'],
    forks: [],
  },
  {
    id: "20",
    title: "The Transition Zones: Navigating Life Changes",
    segments: [
      { id: "20-1", content: "Life changes happen in three phases: endings, the messy middle, and new beginnings. Most people get stuck in the middle because it's uncomfortable.", order: 1 },
      { id: "20-2", content: "The middle phase feels like limbo—you're no longer who you were but not yet who you're becoming. This is normal and necessary.", order: 2 },
      { id: "20-3", content: "Embrace the uncertainty. Use this time to experiment, reflect, and explore. The clarity you seek often emerges through the process, not before it.", order: 3 },
    ],
    authorId: "21",
    authorName: "Rebecca Martinez",
    createdAt: "2025-05-09T12:30:00Z",
    updatedAt: "2025-05-09T12:30:00Z",
    tags: ["Change", "Growth", "Self-Awareness"],
    isPublished: true,
    reactions: { '👏': ['2'], '❤️': [], '🔥': [], '💡': ['1'], '🙏': ['2'] },
    bookmarks: ['1'],
    forks: [],
  },
  {
    id: "21",
    title: "The Change Equation: When Change Becomes Inevitable",
    segments: [
      { id: "21-1", content: "Change happens when the pain of staying the same exceeds the pain of changing. Understanding this equation helps you predict and navigate transitions.", order: 1 },
      { id: "21-2", content: "Sometimes we need to increase the pain of the status quo (making consequences visible) or decrease the pain of change (breaking it into smaller steps).", order: 2 },
      { id: "21-3", content: "Don't wait for rock bottom. Start adjusting the equation before you're forced to. Proactive change is easier than reactive change.", order: 3 },
    ],
    authorId: "22",
    authorName: "Daniel Torres",
    createdAt: "2025-05-08T08:45:00Z",
    updatedAt: "2025-05-08T08:45:00Z",
    tags: ["Change", "Self-Awareness", "Growth"],
    isPublished: true,
    reactions: { '👏': ['1'], '❤️': [], '🔥': ['3'], '💡': [], '🙏': [] },
    bookmarks: [],
    forks: [],
  },

  // Continue with remaining categories...
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "1",
    name: "Productivity Essentials",
    userId: "1",
    threads: ["1", "2", "3"],
    isPublic: true,
  },
  {
    id: "2",
    name: "Growth Mindset",
    userId: "2",
    threads: ["10", "11", "12"],
    isPublic: true,
  },
];

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);

  // Get user's bookmarked threads
  const userBookmarks = user ? 
    threads
      .filter(thread => thread.bookmarks.includes(user.id))
      .map(thread => thread.id) : 
    [];

  // Thread operations
  const getThreadById = (id: string) => {
    return threads.find(t => t.id === id);
  };

  const getThreadsByTag = (tag: string) => {
    return threads.filter(t => 
      t.isPublished && t.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  };

  const getPublicThreads = () => {
    return threads.filter(t => t.isPublished);
  };

  const getUserThreads = () => {
    if (!user) return [];
    return threads.filter(t => t.authorId === user.id);
  };

  const sortThreads = (threadList: Thread[], sortBy: 'bookmarks' | 'forks' | 'newest') => {
    switch (sortBy) {
      case 'bookmarks':
        return [...threadList].sort((a, b) => b.bookmarks.length - a.bookmarks.length);
      case 'forks':
        return [...threadList].sort((a, b) => b.forks.length - a.forks.length);
      case 'newest':
        return [...threadList].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return threadList;
    }
  };

  const createThread = (title: string, segments: ThreadSegment[], tags: string[], isPublished: boolean) => {
    if (!user) throw new Error("User must be authenticated to create threads");
    
    const now = new Date().toISOString();
    const newThread: Thread = {
      id: `${threads.length + 1}`,
      title,
      segments,
      authorId: user.id,
      authorName: user.name,
      createdAt: now,
      updatedAt: now,
      tags,
      isPublished,
      reactions: {
        '👏': [],
        '❤️': [],
        '🔥': [],
        '💡': [],
        '🙏': [],
      },
      bookmarks: [],
      forks: [],
    };
    
    setThreads(prev => [...prev, newThread]);
    toast.success(isPublished ? "Thread published successfully!" : "Thread saved as draft");
    return newThread;
  };

  const updateThread = (threadId: string, updates: Partial<Omit<Thread, 'id' | 'authorId' | 'authorName' | 'createdAt'>>) => {
    if (!user) throw new Error("User must be authenticated to update threads");
    
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId && thread.authorId === user.id) {
        return { 
          ...thread, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
      }
      return thread;
    }));
    
    toast.success("Thread updated successfully");
  };

  const forkThread = (threadId: string) => {
    if (!user) throw new Error("User must be authenticated to fork threads");
    
    const originalThread = getThreadById(threadId);
    if (!originalThread || !originalThread.isPublished) return undefined;
    
    // Create a forked copy
    const now = new Date().toISOString();
    const forkedThread: Thread = {
      id: `${threads.length + 1}`,
      title: `Fork of: ${originalThread.title}`,
      segments: originalThread.segments.map(segment => ({...segment})),
      authorId: user.id,
      authorName: user.name,
      createdAt: now,
      updatedAt: now,
      tags: [...originalThread.tags],
      isPublished: false,  // Start as draft
      originalThreadId: originalThread.id,
      originalAuthorName: originalThread.authorName,
      reactions: {
        '👏': [],
        '❤️': [],
        '🔥': [],
        '💡': [],
        '🙏': [],
      },
      bookmarks: [],
      forks: [],
    };
    
    // Update threads state
    setThreads(prev => {
      // Add the new forked thread
      const newThreads = [...prev, forkedThread];
      
      // Update the original thread's forks array
      return newThreads.map(t => {
        if (t.id === originalThread.id) {
          return {
            ...t,
            forks: [...t.forks, forkedThread.id]
          };
        }
        return t;
      });
    });
    
    toast.success("Thread forked successfully!");
    return forkedThread;
  };

  const toggleReaction = (threadId: string, reactionType: keyof Thread['reactions']) => {
    if (!user) throw new Error("User must be authenticated to react to threads");
    
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        const currentReactions = thread.reactions[reactionType];
        const userIndex = currentReactions.indexOf(user.id);
        
        const updatedReactions = { ...thread.reactions };
        
        if (userIndex === -1) {
          // Add reaction
          updatedReactions[reactionType] = [...currentReactions, user.id];
        } else {
          // Remove reaction
          updatedReactions[reactionType] = currentReactions.filter(id => id !== user.id);
        }
        
        return {
          ...thread,
          reactions: updatedReactions
        };
      }
      return thread;
    }));
  };

  const toggleBookmark = (threadId: string) => {
    if (!user) throw new Error("User must be authenticated to bookmark threads");
    
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        const userIndex = thread.bookmarks.indexOf(user.id);
        
        if (userIndex === -1) {
          // Add bookmark
          toast.success("Thread bookmarked");
          return {
            ...thread,
            bookmarks: [...thread.bookmarks, user.id]
          };
        } else {
          // Remove bookmark
          toast.success("Bookmark removed");
          return {
            ...thread,
            bookmarks: thread.bookmarks.filter(id => id !== user.id)
          };
        }
      }
      return thread;
    }));
  };

  // Collection operations
  const createCollection = (name: string, isPublic: boolean) => {
    if (!user) throw new Error("User must be authenticated to create collections");
    
    const newCollection: Collection = {
      id: `${collections.length + 1}`,
      name,
      userId: user.id,
      threads: [],
      isPublic,
    };
    
    setCollections(prev => [...prev, newCollection]);
    toast.success("Collection created successfully");
    return newCollection;
  };

  const updateCollection = (collectionId: string, updates: Partial<Omit<Collection, 'id' | 'userId'>>) => {
    if (!user) throw new Error("User must be authenticated to update collections");
    
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId && collection.userId === user.id) {
        return { ...collection, ...updates };
      }
      return collection;
    }));
    
    toast.success("Collection updated successfully");
  };

  const addToCollection = (threadId: string, collectionId: string) => {
    if (!user) throw new Error("User must be authenticated to modify collections");
    
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId && collection.userId === user.id) {
        if (collection.threads.includes(threadId)) return collection;
        
        return {
          ...collection,
          threads: [...collection.threads, threadId]
        };
      }
      return collection;
    }));
    
    toast.success("Thread added to collection");
  };

  const removeFromCollection = (threadId: string, collectionId: string) => {
    if (!user) throw new Error("User must be authenticated to modify collections");
    
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId && collection.userId === user.id) {
        return {
          ...collection,
          threads: collection.threads.filter(id => id !== threadId)
        };
      }
      return collection;
    }));
    
    toast.success("Thread removed from collection");
  };

  const isThreadBookmarked = (threadId: string) => {
    if (!user) return false;
    return userBookmarks.includes(threadId);
  };

  const hasUserReacted = (threadId: string, reactionType: keyof Thread['reactions']) => {
    if (!user) return false;
    const thread = getThreadById(threadId);
    return thread ? thread.reactions[reactionType].includes(user.id) : false;
  };

  const getUserCollections = () => {
    if (!user) return [];
    return collections.filter(c => c.userId === user.id);
  };

  return (
    <DataContext.Provider
      value={{
        threads,
        collections,
        userBookmarks,
        getThreadById,
        getThreadsByTag,
        getPublicThreads,
        getUserThreads,
        sortThreads,
        createThread,
        updateThread,
        forkThread,
        toggleReaction,
        toggleBookmark,
        createCollection,
        updateCollection,
        addToCollection,
        removeFromCollection,
        isThreadBookmarked,
        hasUserReacted,
        getUserCollections
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Hook for using data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
