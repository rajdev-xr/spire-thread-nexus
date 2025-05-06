
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <section className="mb-10">
          <h1 className="text-3xl font-bold mb-6 font-heading text-center">About ThreadSpire</h1>
          
          <Card className="mb-8 bg-gradient-to-br from-threadspire-light-purple/30 to-white shadow-md">
            <CardContent className="pt-6">
              <p className="mb-4 text-lg">
                ThreadSpire is a platform dedicated to sharing and discovering wisdom in a 
                unique thread-based format. We believe that knowledge is most powerful when 
                it's structured as a journey—a sequence of connected insights that build upon 
                each other to create deeper understanding.
              </p>
              <p className="mb-4 text-lg">
                Our mission is to create a space where people can share their hard-earned 
                wisdom, lessons, and insights in a way that's more structured than social media 
                but more accessible than long-form articles. ThreadSpire helps users distill 
                complex ideas into digestible segments while maintaining the narrative flow 
                that makes wisdom memorable and applicable.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-4 font-heading">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-threadspire-dark-purple font-heading">Wisdom Over Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We prioritize practical wisdom and insights over raw data or mere information.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-threadspire-dark-purple font-heading">Clarity Through Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our thread format helps creators organize their thoughts in a clear, sequential way.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-threadspire-dark-purple font-heading">Community Curation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>The best wisdom rises to the top through community engagement and thoughtful reactions.</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-semibold mb-4 font-heading">How It Works</h2>
          <Card className="mb-10 shadow-md">
            <CardContent className="p-6">
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-threadspire-purple text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">Create a Thread</h3>
                    <p className="text-muted-foreground">
                      Start a new wisdom thread by adding connected segments that build upon each other.
                      Give your thread a title and add relevant tags to make it discoverable.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-threadspire-purple text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Engage with Content</h3>
                    <p className="text-muted-foreground">
                      Explore threads from others, react with emoji responses that resonate with you,
                      and bookmark valuable threads to revisit later.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-threadspire-purple text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Fork and Remix</h3>
                    <p className="text-muted-foreground">
                      See a thread that inspires you? Create your own version by forking it,
                      adding your own insights while maintaining attribution to the original author.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-threadspire-purple text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Organize Collections</h3>
                    <p className="text-muted-foreground">
                      Group related threads into collections for easy access and sharing with others.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 font-heading">Ready to Share Your Wisdom?</h2>
            <Button asChild className="bg-threadspire-purple hover:bg-threadspire-dark-purple text-white px-8 py-6 text-lg">
              <Link to="/create">Start a Thread</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
