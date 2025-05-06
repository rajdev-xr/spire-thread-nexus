
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MyStatsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { threads, userBookmarks } = useData();
  
  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4 font-heading">Please Log In</h1>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to view your stats.
        </p>
        <Button asChild className="bg-threadspire-purple hover:bg-threadspire-dark-purple">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }
  
  // Get user's threads
  const userThreads = threads.filter(thread => thread.authorId === user?.id);
  
  // Calculate total reactions across all user's threads
  const totalReactions = userThreads.reduce((total, thread) => {
    const threadReactions = Object.values(thread.reactions).reduce(
      (sum, reactions) => sum + reactions.length, 
      0
    );
    return total + threadReactions;
  }, 0);
  
  // Calculate most popular reaction
  const reactionCounts = userThreads.reduce((counts, thread) => {
    Object.entries(thread.reactions).forEach(([reaction, users]) => {
      counts[reaction] = (counts[reaction] || 0) + users.length;
    });
    return counts;
  }, {} as Record<string, number>);
  
  let mostPopularReaction = '👏';
  let maxCount = 0;
  
  Object.entries(reactionCounts).forEach(([reaction, count]) => {
    if (count > maxCount) {
      mostPopularReaction = reaction;
      maxCount = count;
    }
  });
  
  // Calculate total bookmarks across all user's threads
  const totalBookmarks = userThreads.reduce(
    (sum, thread) => sum + thread.bookmarks.length, 
    0
  );
  
  // Calculate total forks across all user's threads
  const totalForks = userThreads.reduce(
    (sum, thread) => sum + thread.forks.length, 
    0
  );

  // Find most popular thread (most reactions + bookmarks + forks)
  const mostPopularThread = userThreads.length > 0 
    ? userThreads.reduce((popular, thread) => {
        const threadPopularity = 
          Object.values(thread.reactions).reduce(
            (sum, reactions) => sum + reactions.length, 
            0
          ) + 
          thread.bookmarks.length + 
          thread.forks.length;
        
        const popularityScore = 
          Object.values(popular.reactions).reduce(
            (sum, reactions) => sum + reactions.length, 
            0
          ) + 
          popular.bookmarks.length + 
          popular.forks.length;
        
        return threadPopularity > popularityScore ? thread : popular;
      }, userThreads[0])
    : null;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 font-heading">My Stats</h1>
          <p className="text-muted-foreground">
            Track the performance and engagement of your wisdom threads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-threadspire-light-purple to-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading">Threads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userThreads.length}</div>
              <p className="text-sm text-muted-foreground">Total threads created</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-threadspire-soft-gray to-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading">Reactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalReactions}</div>
              <p className="text-sm text-muted-foreground">
                Most popular: {mostPopularReaction} ({maxCount})
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-threadspire-soft-gray to-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading">Bookmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalBookmarks}</div>
              <p className="text-sm text-muted-foreground">
                Saved by others: {totalBookmarks}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-threadspire-light-purple to-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading">Forks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalForks}</div>
              <p className="text-sm text-muted-foreground">
                Threads remixed by others
              </p>
            </CardContent>
          </Card>
        </div>

        {userThreads.length > 0 && mostPopularThread && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="font-heading">Your Most Popular Thread</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <Link to={`/thread/${mostPopularThread.id}`} className="text-xl font-semibold hover:text-threadspire-purple transition-colors">
                  {mostPopularThread.title}
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center">
                  <span className="text-lg mr-1">👏❤️🔥</span>
                  {Object.values(mostPopularThread.reactions).reduce((sum, users) => sum + users.length, 0)} reactions
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {mostPopularThread.bookmarks.length} bookmarks
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 12v6" />
                    <path d="m15 9-3 3-3-3" />
                    <path d="M9.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    <path d="M17.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    <path d="M3 12c0-2.8 0-4.2.545-5.27a5 5 0 0 1 2.185-2.185C6.8 4 8.2 4 11 4h2c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C21 7.8 21 9.2 21 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C17.2 20 15.8 20 13 20h-2c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C3 16.2 3 14.8 3 12Z" />
                  </svg>
                  {mostPopularThread.forks.length} forks
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-heading">Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Threads Created:</span>
                  <span className="font-semibold">{userThreads.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Threads Bookmarked:</span>
                  <span className="font-semibold">{userBookmarks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Published Threads:</span>
                  <span className="font-semibold">
                    {userThreads.filter(t => t.isPublished).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Draft Threads:</span>
                  <span className="font-semibold">
                    {userThreads.filter(t => !t.isPublished).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-heading">Engagement Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Avg. Reactions per Thread:</span>
                  <span className="font-semibold">
                    {userThreads.length ? (totalReactions / userThreads.length).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg. Bookmarks per Thread:</span>
                  <span className="font-semibold">
                    {userThreads.length ? (totalBookmarks / userThreads.length).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg. Forks per Thread:</span>
                  <span className="font-semibold">
                    {userThreads.length ? (totalForks / userThreads.length).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Most Popular Reaction:</span>
                  <span className="font-semibold">
                    {maxCount > 0 ? `${mostPopularReaction} (${maxCount})` : 'None yet'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyStatsPage;
