
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ThreadCard from '@/components/ThreadCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ExplorePage = () => {
  const { threads, sortThreads } = useData();
  const [activeSort, setActiveSort] = useState<'newest' | 'bookmarks' | 'forks'>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get published threads
  const publishedThreads = threads.filter(thread => thread.isPublished);
  
  // Extract all unique tags from published threads
  const allTags = Array.from(
    new Set(
      publishedThreads.flatMap(thread => thread.tags)
    )
  ).sort();

  // Get trending tags (top 5 most used tags)
  const trendingTags = [...allTags]
    .map(tag => ({
      tag,
      count: publishedThreads.filter(thread => thread.tags.includes(tag)).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Filter by tag if there's an active tag
  const filteredByTag = activeTag 
    ? publishedThreads.filter(thread => 
        thread.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      )
    : publishedThreads;
  
  // Filter by search query
  const filteredThreads = searchQuery
    ? filteredByTag.filter(thread => 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.segments.some(segment => 
          segment.content.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        thread.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : filteredByTag;
  
  // Sort threads by selected sort method
  const sortedThreads = sortThreads(filteredThreads, activeSort);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <section className="mb-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3 font-heading">Explore Threads</h1>
            <p className="text-muted-foreground">
              Discover wisdom threads on various topics
            </p>
          </div>
          
          {/* Trending Tags */}
          <div className="mb-6 overflow-x-auto pb-3">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Trending Tags</h2>
            <div className="flex space-x-2">
              {trendingTags.map(({ tag, count }) => (
                <Badge 
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)} 
                  className={`cursor-pointer px-3 py-1 whitespace-nowrap ${
                    activeTag === tag 
                      ? 'bg-threadspire-purple hover:bg-threadspire-dark-purple text-white' 
                      : 'bg-threadspire-light-purple text-threadspire-dark-purple hover:bg-threadspire-purple/70'
                  }`}
                >
                  {tag} <span className="ml-1 opacity-70">({count})</span>
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search threads by title, content or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-background border-threadspire-light-purple focus:border-threadspire-purple"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
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
            
            <div className="flex items-center gap-3">
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

          {sortedThreads.length === 0 ? (
            <Card className="p-8 text-center shadow-md">
              <p className="text-lg text-muted-foreground">No threads found for this search or filter.</p>
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

export default ExplorePage;
