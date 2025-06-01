
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Sparkles } from 'lucide-react';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  currentPath: string;
}

const NavItem = ({ to, children, currentPath }: NavItemProps) => {
  const isActive = currentPath === to || 
                  (to !== '/' && currentPath.startsWith(to));
  
  return (
    <li>
      <Link 
        to={to}
        className={`transition-colors px-4 py-2 ${
          isActive 
            ? 'text-mindweave-sage font-medium' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {children}
      </Link>
    </li>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Brain className="h-8 w-8 text-mindweave-sage" />
                  <Sparkles className="h-4 w-4 text-mindweave-lavender absolute -top-1 -right-1" />
                </div>
                <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-mindweave-sage to-mindweave-deep-sage font-heading">
                  MindWeave
                </div>
              </div>
            </Link>
            <nav className="hidden md:flex">
              <ul className="flex items-center space-x-4">
                <NavItem to="/" currentPath={location.pathname}>Home</NavItem>
                <NavItem to="/explore" currentPath={location.pathname}>Explore</NavItem>
                {isAuthenticated && (
                  <>
                    <NavItem to="/my-threads" currentPath={location.pathname}>My Threads</NavItem>
                    <NavItem to="/collections" currentPath={location.pathname}>Collections</NavItem>
                  </>
                )}
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/create" className="hidden sm:block">
                  <Button variant="outline" size="sm">Create Thread</Button>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <Button size="sm" variant="ghost" onClick={logout}>Logout</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 MindWeave. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
