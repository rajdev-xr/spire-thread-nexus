
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Heart, Lightbulb, Users, Compass } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <section className="mb-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Brain className="h-12 w-12 text-mindweave-sage" />
                <Sparkles className="h-6 w-6 text-mindweave-lavender absolute -top-1 -right-1" />
              </div>
              <h1 className="text-3xl font-bold font-heading text-mindweave-deep-sage">About MindWeave</h1>
            </div>
          </div>
          
          <Card className="mb-8 bg-gradient-to-br from-mindweave-soft-cream to-mindweave-light-sage shadow-gentle">
            <CardContent className="pt-6">
              <p className="mb-4 text-lg text-mindweave-deep-sage">
                MindWeave is a thoughtful platform dedicated to the art of sharing and discovering wisdom 
                through carefully crafted thread narratives. We believe that the most profound insights 
                emerge when knowledge is woven together—each thought building upon the last to create 
                a tapestry of understanding that transcends individual perspective.
              </p>
              <p className="mb-4 text-lg text-mindweave-deep-sage">
                Our mission is to create a sanctuary where reflective minds can share their hard-earned 
                wisdom, life lessons, and meaningful insights in a structured yet accessible format. 
                MindWeave helps you distill complex experiences into digestible threads while preserving 
                the narrative flow that makes wisdom memorable, applicable, and transformative.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-4 font-heading text-mindweave-deep-sage">Our Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="shadow-gentle hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Lightbulb className="h-8 w-8 text-mindweave-sage mx-auto mb-2" />
                <CardTitle className="text-mindweave-deep-sage font-heading">Wisdom Over Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">We prioritize thoughtful insights and practical wisdom over raw data or surface-level information.</p>
              </CardContent>
            </Card>
            <Card className="shadow-gentle hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Compass className="h-8 w-8 text-mindweave-sage mx-auto mb-2" />
                <CardTitle className="text-mindweave-deep-sage font-heading">Clarity Through Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">Our thread format guides creators to organize their thoughts in a clear, sequential journey of understanding.</p>
              </CardContent>
            </Card>
            <Card className="shadow-gentle hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-mindweave-sage mx-auto mb-2" />
                <CardTitle className="text-mindweave-deep-sage font-heading">Collective Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">The most valuable wisdom emerges through community reflection and thoughtful engagement.</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-semibold mb-4 font-heading text-mindweave-deep-sage">How MindWeave Works</h2>
          <Card className="mb-10 shadow-gentle">
            <CardContent className="p-6">
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-mindweave-sage text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-mindweave-deep-sage">Weave Your Thread</h3>
                    <p className="text-muted-foreground">
                      Create wisdom threads by connecting related insights that build upon each other.
                      Add a meaningful title and relevant tags to help others discover your wisdom.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-mindweave-sage text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-mindweave-deep-sage">Discover & Reflect</h3>
                    <p className="text-muted-foreground">
                      Explore wisdom from fellow thinkers, engage with content through thoughtful reactions,
                      and save valuable threads to revisit and reflect upon later.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-mindweave-sage text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-mindweave-deep-sage">Build Upon Wisdom</h3>
                    <p className="text-muted-foreground">
                      Found a thread that resonates? Create your own version by forking it,
                      adding your unique insights while honoring the original author's contribution.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-mindweave-sage text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold mb-1 text-mindweave-deep-sage">Curate Collections</h3>
                    <p className="text-muted-foreground">
                      Organize meaningful threads into personal collections for easy reference and 
                      share curated wisdom with others in your journey of growth.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 font-heading text-mindweave-deep-sage">Ready to Share Your Wisdom?</h2>
            <p className="text-muted-foreground mb-6">Join our thoughtful community and begin weaving your insights into meaningful threads.</p>
            <Button asChild className="bg-mindweave-sage hover:bg-mindweave-deep-sage text-white px-8 py-6 text-lg shadow-gentle">
              <Link to="/create">Start Weaving</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
