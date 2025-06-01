
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ThreadCard from '@/components/ThreadCard';
import { Brain, Sparkles, Quote } from 'lucide-react';

// Quotes for the "Quote of the Day" section
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Wisdom begins in wonder.", author: "Socrates" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "It's not about how much we give but how much love we put into giving.", author: "Mother Teresa" },
  { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus" },
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
];

const HomePage = () => {
  const { threads, sortThreads } = useData();
  const [activeSort, setActiveSort] = useState<'newest' | 'bookmarks' | 'forks'>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Get random quote for the day
  const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Get published threads
  const publishedThreads = threads.filter(thread => thread.isPublished);
  
  // Filter by tag if there's an active tag
  const filteredThreads = activeTag 
    ? publishedThreads.filter(thread => 
        thread.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      )
    : publishedThreads;
  
  // Sort threads by selected sort method
  const sortedThreads = sortThreads(filteredThreads, activeSort);
  
  // Extract all unique tags from published threads
  const allTags = Array.from(
    new Set(
      publishedThreads.flatMap(thread => thread.tags)
    )
  ).sort();

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Brain className="h-12 w-12 text-mindweave-sage animate-gentle-pulse" />
                <Sparkles className="h-6 w-6 text-mindweave-lavender absolute -top-1 -right-1" />
              </div>
              <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-mindweave-sage to-mindweave-deep-sage bg-clip-text text-transparent">
                MindWeave
              </h1>
            </div>
            <p className="text-xl text-mindweave-warm-gray mb-2 font-medium">
              Weave your thoughts. Discover collective insight.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              A thoughtful platform for reflecting, sharing, and organizing threads of wisdom.
            </p>
            <Link 
              to="/create" 
              className="bg-gradient-to-br from-mindweave-sage to-mindweave-deep-sage hover:from-mindweave-deep-sage hover:to-mindweave-sage text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 inline-block shadow-gentle"
            >
              Start Weaving
            </Link>
          </div>
        </section>

        {/* Quote of the Day */}
        <section className="mb-8">
          <Card className="p-6 bg-gradient-to-br from-mindweave-soft-cream to-mindweave-light-sage border-mindweave-light-sage shadow-gentle">
            <div className="flex items-start gap-3">
              <Quote className="h-6 w-6 text-mindweave-sage mt-1 flex-shrink-0" />
              <blockquote className="text-center flex-1">
                <p className="text-lg italic font-medium mb-2 text-mindweave-deep-sage">"{todaysQuote.text}"</p>
                <footer className="text-sm text-mindweave-warm-gray">— {todaysQuote.author}</footer>
              </blockquote>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold font-heading text-mindweave-deep-sage">Featured Wisdom</h2>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSort('newest')}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    activeSort === 'newest' 
                      ? 'bg-mindweave-sage text-white' 
                      : 'bg-mindweave-light-sage text-mindweave-deep-sage hover:bg-mindweave-sage/70'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setActiveSort('bookmarks')}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    activeSort === 'bookmarks' 
                      ? 'bg-mindweave-sage text-white' 
                      : 'bg-mindweave-light-sage text-mindweave-deep-sage hover:bg-mindweave-sage/70'
                  }`}
                >
                  Most Bookmarked
                </button>
                <button
                  onClick={() => setActiveSort('forks')}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    activeSort === 'forks' 
                      ? 'bg-mindweave-sage text-white' 
                      : 'bg-mindweave-light-sage text-mindweave-deep-sage hover:bg-mindweave-sage/70'
                  }`}
                >
                  Most Forked
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge 
              onClick={() => setActiveTag(null)} 
              className={`cursor-pointer transition-colors ${!activeTag ? 'bg-mindweave-sage hover:bg-mindweave-deep-sage' : 'bg-secondary hover:bg-accent'}`}
            >
              All
            </Badge>
            {allTags.map(tag => (
              <Badge 
                key={tag}
                onClick={() => setActiveTag(tag)} 
                className={`cursor-pointer transition-colors ${activeTag === tag ? 'bg-mindweave-sage hover:bg-mindweave-deep-sage' : 'bg-secondary hover:bg-accent'}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {sortedThreads.length === 0 ? (
            <Card className="p-8 text-center shadow-gentle">
              <p className="text-lg text-muted-foreground">No wisdom threads found for this tag or filter.</p>
              <p className="text-sm text-mindweave-warm-gray mt-2">Be the first to share your insights!</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedThreads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
