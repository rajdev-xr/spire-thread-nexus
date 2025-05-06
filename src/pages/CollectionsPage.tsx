
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData, Collection } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ThreadCard from '@/components/ThreadCard';

const CollectionCard = ({ collection }: { collection: Collection }) => {
  const { getThreadById } = useData();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const threads = collection.threads
    .map(threadId => getThreadById(threadId))
    .filter(thread => thread !== undefined);
  
  return (
    <Card className="feed-card">
      <CardHeader>
        <CardTitle>{collection.name}</CardTitle>
        <CardDescription>
          {collection.isPublic ? 'Public collection' : 'Private collection'}
          <span className="mx-2">•</span>
          {threads.length} thread{threads.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isExpanded ? (
          <div className="space-y-6">
            {threads.length > 0 ? (
              threads.map(thread => thread && (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No threads in this collection yet
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {threads.length > 0
              ? `Contains threads like "${threads[0]?.title}"`
              : "This collection is empty"}
          </p>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'View threads'}
        </Button>
        
        <Button variant="outline" className="ml-auto" asChild>
          <Link to={`/collections/${collection.id}`}>
            Open Collection
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const CreateCollectionDialog = ({ 
  onCreate 
}: { 
  onCreate: (name: string, isPublic: boolean) => void 
}) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onCreate(name, isPublic);
    setName('');
    setIsPublic(false);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-threadspire-purple hover:bg-threadspire-dark-purple text-white">
          Create Collection
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your bookmarked threads
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Career Growth"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="public">Make collection public</Label>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Create Collection</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CollectionsPage = () => {
  const { isAuthenticated } = useAuth();
  const { getUserCollections, createCollection } = useData();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const collections = getUserCollections();
  
  const handleCreateCollection = (name: string, isPublic: boolean) => {
    createCollection(name, isPublic);
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Collections</h1>
          <CreateCollectionDialog onCreate={handleCreateCollection} />
        </div>
        
        {collections.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Collections Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create a collection to organize your bookmarked threads
            </p>
            <CreateCollectionDialog onCreate={handleCreateCollection} />
          </Card>
        ) : (
          <div className="space-y-6">
            {collections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
