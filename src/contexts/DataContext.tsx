
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

// Mock data for demo purposes
const INITIAL_THREADS: Thread[] = [
  {
    id: "1",
    title: "The Art of Mindful Productivity",
    segments: [
      { id: "1-1", content: "Productivity isn't about doing more—it's about being intentional with how you allocate your limited time and energy. When we rush from task to task, we miss the opportunity to be fully present.", order: 1 },
      { id: "1-2", content: "Start by identifying your most important task each day. This isn't necessarily the most urgent one, but the one that moves your most meaningful projects forward.", order: 2 },
      { id: "1-3", content: "Build in transition time between tasks. Our brains need time to switch contexts. Even 5 minutes of reflection or mindful breathing can improve your focus and decision-making.", order: 3 },
    ],
    authorId: "2",
    authorName: "Jane Smith",
    createdAt: "2025-05-01T12:00:00Z",
    updatedAt: "2025-05-01T12:00:00Z",
    tags: ["Productivity", "Mindfulness", "Work"],
    isPublished: true,
    reactions: {
      '👏': ['1'],
      '❤️': ['1'],
      '🔥': [],
      '💡': ['1'],
      '🙏': [],
    },
    bookmarks: ['1'],
    forks: [],
  },
  {
    id: "2",
    title: "Building a Second Brain",
    segments: [
      { id: "2-1", content: "Your mind is for having ideas, not holding them. By creating an external system to capture and organize your thoughts, you free up mental bandwidth for deep thinking and creativity.", order: 1 },
      { id: "2-2", content: "Start with a simple note-taking system. The key is to make it frictionless so you actually use it. Capture everything that resonates with you—quotes, ideas, observations.", order: 2 },
      { id: "2-3", content: "Review your notes regularly. The magic happens when you connect ideas across different domains and times. This is how innovation occurs.", order: 3 },
      { id: "2-4", content: "Share what you learn. Teaching forces you to clarify your thinking and exposes gaps in your understanding.", order: 4 },
    ],
    authorId: "2",
    authorName: "Jane Smith",
    createdAt: "2025-05-03T14:30:00Z",
    updatedAt: "2025-05-03T14:30:00Z",
    tags: ["Productivity", "Learning", "Knowledge Management"],
    isPublished: true,
    reactions: {
      '👏': [],
      '❤️': ['1'],
      '🔥': ['1'],
      '💡': ['1', '2'],
      '🙏': [],
    },
    bookmarks: [],
    forks: [],
  },
  {
    id: "3",
    title: "Career Pivots: When and How",
    segments: [
      { id: "3-1", content: "A career pivot doesn't always mean changing industries. Sometimes it's about changing your role, your company, or even how you approach your current position.", order: 1 },
      { id: "3-2", content: "Before making a change, get crystal clear on your motivations. Are you running from something or toward something? The answer will guide your approach.", order: 2 },
      { id: "3-3", content: "Leverage your transferable skills. Every role you've had has taught you something valuable. The key is translating that value to a new context.", order: 3 },
    ],
    authorId: "1",
    authorName: "Demo User",
    createdAt: "2025-05-04T09:15:00Z",
    updatedAt: "2025-05-04T09:15:00Z",
    tags: ["Career", "Growth", "Change"],
    isPublished: true,
    reactions: {
      '👏': ['2'],
      '❤️': [],
      '🔥': [],
      '💡': ['2'],
      '🙏': ['2'],
    },
    bookmarks: ['2'],
    forks: [],
  },
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "1",
    name: "Productivity Gems",
    userId: "1",
    threads: ["1", "2"],
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
