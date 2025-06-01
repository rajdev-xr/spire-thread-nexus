
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ThreadCard from '@/components/ThreadCard';
import { Input } from '@/components/ui/input';
import { Search, Compass } from 'lucide-react';

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
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Compass className="h-8 w-8 text-mindweave-sage" />
              <h1 className="text-3xl font-bold font-heading text-mindweave-deep-sage">Explore Wisdom</h1>
            </div>
            <p className="text-muted-foreground">
              Discover thoughtful threads and collective insights from our community
            </p>
          </div>
          
          {/* Trending Tags */}
          <div className="mb-6 overflow-x-auto pb-3">
            <h2 className="text-sm font-medium text-mindweave-warm-gray mb-2">Trending Topics</h2>
            <div className="flex space-x-2">
              {trendingTags.map(({ tag, count }) => (
                <Badge 
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)} 
                  className={`cursor-pointer px-3 py-1 whitespace-nowrap transition-colors ${
                    activeTag === tag 
                      ? 'bg-mindweave-sage hover:bg-mindweave-deep-sage text-white' 
                      : 'bg-mindweave-light-sage text-mindweave-deep-sage hover:bg-mindweave-sage/70'
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
              className="pl-10 w-full bg-background border-mindweave-light-sage focus:border-mindweave-sage"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <Badge 
                onClick={() => setActiveTag(null)} 
                className={`cursor-pointer ${!activeTag ? 'bg-mindweave-sage hover:bg-mindweave-deep-sage' : 'bg-secondary hover:bg-accent'}`}
              >
                All
              </Badge>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  onClick={() => setActiveTag(tag)} 
                  className={`cursor-pointer ${activeTag === tag ? 'bg-mindweave-sage hover:bg-mindweave-deep-sage' : 'bg-secondary hover:bg-accent'}`}
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

          {sortedThreads.length === 0 ? (
            <Card className="p-8 text-center shadow-gentle">
              <p className="text-lg text-muted-foreground">No wisdom threads found for this search or filter.</p>
              <p className="text-sm text-mindweave-warm-gray mt-2">Try adjusting your search terms or explore different topics.</p>
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
