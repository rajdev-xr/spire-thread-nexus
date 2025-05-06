
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData, ThreadSegment } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const EditThreadPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { getThreadById, updateThread } = useData();
  const navigate = useNavigate();
  
  const thread = getThreadById(id || '');
  
  const [title, setTitle] = useState('');
  const [segments, setSegments] = useState<ThreadSegment[]>([]);
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Populate form with thread data
  useEffect(() => {
    if (thread) {
      setTitle(thread.title);
      setSegments([...thread.segments]);
      setTags(thread.tags.join(', '));
      setIsPublished(thread.isPublished);
    }
  }, [thread]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to edit threads");
      navigate('/login');
    } else if (thread && user?.id !== thread.authorId) {
      toast.error("You can only edit your own threads");
      navigate('/my-threads');
    } else if (!thread) {
      toast.error("Thread not found");
      navigate('/my-threads');
    }
  }, [isAuthenticated, navigate, thread, user]);

  const handleAddSegment = () => {
    const newOrder = segments.length + 1;
    setSegments([
      ...segments,
      { id: `${thread?.id}-${newOrder}`, content: '', order: newOrder }
    ]);
  };

  const handleUpdateSegment = (id: string, content: string) => {
    setSegments(
      segments.map(segment => 
        segment.id === id ? { ...segment, content } : segment
      )
    );
  };

  const handleRemoveSegment = (id: string) => {
    if (segments.length <= 1) {
      toast.error("You need at least one segment");
      return;
    }
    
    const filteredSegments = segments.filter(segment => segment.id !== id);
    
    // Update order of remaining segments
    const updatedSegments = filteredSegments.map((segment, index) => ({
      ...segment,
      order: index + 1
    }));
    
    setSegments(updatedSegments);
  };

  const handleSubmit = (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please add a title for your thread");
      return;
    }
    
    if (segments.some(segment => !segment.content.trim())) {
      toast.error("Please fill in all segments or remove empty ones");
      return;
    }
    
    // Parse tags from comma-separated string to array
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    if (tagArray.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }
    
    try {
      updateThread(thread?.id || '', {
        title,
        segments,
        tags: tagArray,
        isPublished: publish
      });
      navigate(`/thread/${thread?.id}`);
    } catch (error) {
      toast.error("Failed to update thread. Please try again.");
    }
  };

  if (!thread) {
    return null; // Loading or redirection will happen due to useEffect
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Thread</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title">Thread Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your thread"
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-4">
                <Label>Thread Segments</Label>
                <div className="space-y-6">
                  {segments.map((segment, index) => (
                    <div key={segment.id} className="thread-segment space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Segment {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSegment(segment.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <Textarea
                        value={segment.content}
                        onChange={(e) => handleUpdateSegment(segment.id, e.target.value)}
                        placeholder="Write your segment content here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSegment}
                    className="w-full"
                  >
                    Add New Segment
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Productivity, Mindfulness, Career"
                />
                <p className="text-sm text-muted-foreground">
                  Add relevant tags to help others find your thread
                </p>
              </div>
              
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, false)}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="bg-threadspire-purple hover:bg-threadspire-dark-purple text-white"
                >
                  {thread.isPublished ? 'Update Thread' : 'Publish Thread'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditThreadPage;
