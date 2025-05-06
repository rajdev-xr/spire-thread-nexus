
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';

const ThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    getThreadById, 
    toggleReaction, 
    toggleBookmark, 
    isThreadBookmarked, 
    hasUserReacted,
    forkThread,
    getUserCollections,
    addToCollection
  } = useData();
  
  const thread = getThreadById(id || '');
  const [showCollections, setShowCollections] = useState(false);
  
  if (!thread) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Thread Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This thread may have been removed or doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }
  
  const isOwner = user?.id === thread.authorId;
  const isBookmarked = isThreadBookmarked(thread.id);
  const userCollections = getUserCollections();
  
  const handleReaction = (reactionType: keyof Thread['reactions']) => {
    if (!isAuthenticated) {
      toast.error("Please login to react to threads");
      return;
    }
    toggleReaction(thread.id, reactionType);
  };
  
  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark threads");
      return;
    }
    toggleBookmark(thread.id);
  };
  
  const handleFork = () => {
    if (!isAuthenticated) {
      toast.error("Please login to fork threads");
      return;
    }
    
    const forkedThread = forkThread(thread.id);
    if (forkedThread) {
      navigate(`/thread/${forkedThread.id}`);
    }
  };
  
  const handleAddToCollection = (collectionId: string) => {
    addToCollection(thread.id, collectionId);
    setShowCollections(false);
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-threadspire-purple hover:underline flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to feed
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">{thread.title}</CardTitle>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
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
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {thread.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-threadspire-light-purple text-threadspire-dark-purple">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Thread segments */}
            <div className="space-y-6 mb-8">
              {thread.segments.map((segment) => (
                <div key={segment.id} className="thread-segment">
                  <p>{segment.content}</p>
                </div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-8 pt-4 border-t">
              {/* Reactions */}
              <div className="flex gap-2">
                {(['👏', '❤️', '🔥', '💡', '🙏'] as const).map(reaction => (
                  <Button
                    key={reaction}
                    variant={hasUserReacted(thread.id, reaction) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleReaction(reaction)}
                    className={hasUserReacted(thread.id, reaction) ? "bg-threadspire-purple text-white" : ""}
                  >
                    {reaction} {thread.reactions[reaction].length}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2 ml-auto">
                {/* Bookmark button */}
                <Button
                  variant={isBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? "bg-threadspire-purple text-white" : ""}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Bookmark ({thread.bookmarks.length})
                </Button>
                
                {/* Collections dropdown */}
                {isAuthenticated && (
                  <DropdownMenu open={showCollections} onOpenChange={setShowCollections}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M3 3h18v18H3z" />
                          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" />
                          <path d="M12 12V3" />
                          <path d="m8 8 4-4 4 4" />
                        </svg>
                        Save to
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Save to collection</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {userCollections.length === 0 ? (
                        <DropdownMenuItem>
                          <Link to="/collections" className="w-full text-center">Create a collection</Link>
                        </DropdownMenuItem>
                      ) : (
                        userCollections.map(collection => (
                          <DropdownMenuItem 
                            key={collection.id}
                            onClick={() => handleAddToCollection(collection.id)}
                          >
                            {collection.name}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                {/* Fork button */}
                {!isOwner && (
                  <Button variant="outline" size="sm" onClick={handleFork}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M12 12v6" />
                      <path d="m15 9-3 3-3-3" />
                      <path d="M9.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      <path d="M17.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      <path d="M3 12c0-2.8 0-4.2.545-5.27a5 5 0 0 1 2.185-2.185C6.8 4 8.2 4 11 4h2c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C21 7.8 21 9.2 21 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C17.2 20 15.8 20 13 20h-2c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C3 16.2 3 14.8 3 12Z" />
                    </svg>
                    Fork ({thread.forks.length})
                  </Button>
                )}
                
                {/* Edit button (if owner) */}
                {isOwner && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/edit/${thread.id}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreadDetailPage;
