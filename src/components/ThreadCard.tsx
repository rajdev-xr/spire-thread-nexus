
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Thread, useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

interface ThreadCardProps {
  thread: Thread;
  showFullContent?: boolean;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, showFullContent = false }) => {
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isThreadBookmarked } = useData();
  
  const bookmarked = isThreadBookmarked(thread.id);
  
  // Get a preview of segments (first 2 by default)
  const previewSegments = showFullContent 
    ? thread.segments 
    : thread.segments.slice(0, 2);
  
  // Calculate total reactions
  const totalReactions = Object.values(thread.reactions)
    .reduce((sum, userIds) => sum + userIds.length, 0);
  
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleBookmark(thread.id);
    } else {
      // Redirect to login or show a message
      window.location.href = '/login';
    }
  };

  return (
    <Link to={`/thread/${thread.id}`}>
      <Card className="feed-card hover:border-threadspire-purple transition-all duration-200 hover:shadow-lg rounded-xl">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg font-heading">{thread.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${bookmarked ? 'text-threadspire-purple' : ''} hover:scale-110 transition-transform`}
              onClick={handleBookmarkClick}
            >
              {bookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              )}
            </Button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>by {thread.authorName}</span>
            <span className="mx-2">•</span>
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            {thread.originalAuthorName && (
              <>
                <span className="mx-2">•</span>
                <span>Forked from {thread.originalAuthorName}</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {previewSegments.map((segment) => (
              <div key={segment.id} className="thread-segment">
                <p>{segment.content}</p>
              </div>
            ))}
            {!showFullContent && thread.segments.length > 2 && (
              <div className="text-sm font-medium text-threadspire-purple hover:underline">
                Read more...
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {thread.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-threadspire-light-purple text-threadspire-dark-purple">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="mr-1 text-lg">👏 <span className="text-xs bg-threadspire-light-purple text-threadspire-dark-purple rounded-full px-1">{thread.reactions['👏'].length}</span></span>
                <span className="mr-1 text-lg">❤️ <span className="text-xs bg-threadspire-light-purple text-threadspire-dark-purple rounded-full px-1">{thread.reactions['❤️'].length}</span></span>
                <span className="mr-1 text-lg">🔥 <span className="text-xs bg-threadspire-light-purple text-threadspire-dark-purple rounded-full px-1">{thread.reactions['🔥'].length}</span></span>
              </div>
              <span>{totalReactions} reactions</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                {thread.bookmarks.length}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M12 12v6" />
                  <path d="m15 9-3 3-3-3" />
                  <path d="M9.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  <path d="M17.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  <path d="M3 12c0-2.8 0-4.2.545-5.27a5 5 0 0 1 2.185-2.185C6.8 4 8.2 4 11 4h2c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C21 7.8 21 9.2 21 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C17.2 20 15.8 20 13 20h-2c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C3 16.2 3 14.8 3 12Z" />
                </svg>
                {thread.forks.length}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ThreadCard;
