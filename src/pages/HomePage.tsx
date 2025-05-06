
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ThreadCard from '@/components/ThreadCard';

const HomePage = () => {
  const { threads, sortThreads } = useData();
  const [activeSort, setActiveSort] = useState<'newest' | 'bookmarks' | 'forks'>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);

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
        <section className="mb-12">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3">ThreadSpire</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover and share wisdom threads on topics that matter.
            </p>
            <Link to="/create" className="bg-threadspire-purple hover:bg-threadspire-dark-purple text-white px-6 py-3 rounded-md transition-colors inline-block">
              Start a Thread
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Threads</h2>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSort('newest')}
                  className={`text-sm px-3 py-1 rounded-full ${
                    activeSort === 'newest' 
                      ? 'bg-threadspire-purple text-white' 
                      : 'bg-threadspire-light-purple text-threadspire-dark-purple'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setActiveSort('bookmarks')}
                  className={`text-sm px-3 py-1 rounded-full ${
                    activeSort === 'bookmarks' 
                      ? 'bg-threadspire-purple text-white' 
                      : 'bg-threadspire-light-purple text-threadspire-dark-purple'
                  }`}
                >
                  Most Bookmarked
                </button>
                <button
                  onClick={() => setActiveSort('forks')}
                  className={`text-sm px-3 py-1 rounded-full ${
                    activeSort === 'forks' 
                      ? 'bg-threadspire-purple text-white' 
                      : 'bg-threadspire-light-purple text-threadspire-dark-purple'
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
              className={`cursor-pointer ${!activeTag ? 'bg-threadspire-purple hover:bg-threadspire-dark-purple' : 'bg-secondary hover:bg-accent'}`}
            >
              All
            </Badge>
            {allTags.map(tag => (
              <Badge 
                key={tag}
                onClick={() => setActiveTag(tag)} 
                className={`cursor-pointer ${activeTag === tag ? 'bg-threadspire-purple hover:bg-threadspire-dark-purple' : 'bg-secondary hover:bg-accent'}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {sortedThreads.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-lg text-muted-foreground">No threads found for this tag or filter.</p>
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
