
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ThreadCard from '@/components/ThreadCard';

const MyThreadsPage = () => {
  const { isAuthenticated } = useAuth();
  const { getUserThreads } = useData();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const allThreads = getUserThreads();
  
  const filteredThreads = 
    filter === 'all' ? allThreads :
    filter === 'published' ? allThreads.filter(t => t.isPublished) :
    allThreads.filter(t => !t.isPublished);
  
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Threads</h1>
          <Button 
            className="bg-threadspire-purple hover:bg-threadspire-dark-purple text-white"
            asChild
          >
            <Link to="/create">Create Thread</Link>
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex gap-2">
            <Badge 
              className={`cursor-pointer ${filter === 'all' ? 'bg-threadspire-purple hover:bg-threadspire-dark-purple' : 'bg-secondary hover:bg-accent'}`}
              onClick={() => setFilter('all')}
            >
              All ({allThreads.length})
            </Badge>
            <Badge 
              className={`cursor-pointer ${filter === 'published' ? 'bg-threadspire-purple hover:bg-threadspire-dark-purple' : 'bg-secondary hover:bg-accent'}`}
              onClick={() => setFilter('published')}
            >
              Published ({allThreads.filter(t => t.isPublished).length})
            </Badge>
            <Badge 
              className={`cursor-pointer ${filter === 'drafts' ? 'bg-threadspire-purple hover:bg-threadspire-dark-purple' : 'bg-secondary hover:bg-accent'}`}
              onClick={() => setFilter('drafts')}
            >
              Drafts ({allThreads.filter(t => !t.isPublished).length})
            </Badge>
          </div>
        </div>
        
        {filteredThreads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">No threads found</h2>
              <p className="text-muted-foreground mb-6">
                {filter === 'all' 
                  ? "You haven't created any threads yet"
                  : filter === 'published'
                    ? "You don't have any published threads"
                    : "You don't have any draft threads"
                }
              </p>
              <Button asChild>
                <Link to="/create">Create Your First Thread</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredThreads.map(thread => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyThreadsPage;
