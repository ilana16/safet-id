
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn, LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isAuthed = !!session;
        setIsAuthenticated(isAuthed);
        localStorage.setItem('isLoggedIn', isAuthed ? 'true' : 'false');
        setIsLoading(false);
      }
    );
    
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthed = !!session;
      setIsAuthenticated(isAuthed);
      localStorage.setItem('isLoggedIn', isAuthed ? 'true' : 'false');
      setIsLoading(false);
    };
    
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.setItem('isLoggedIn', 'false');
      setIsAuthenticated(false);
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="w-full py-4 bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-100 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-transform hover:scale-[1.02] duration-300"
          >
            <Logo size="md" />
            <span className="text-xl font-semibold text-gray-900">SafeT-iD</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-safet-600 ${
                location.pathname === '/' ? 'text-safet-500' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-safet-600 ${
                location.pathname === '/about' ? 'text-safet-500' : 'text-gray-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/privacy" 
              className={`text-sm font-medium transition-colors hover:text-safet-600 ${
                location.pathname === '/privacy' ? 'text-safet-500' : 'text-gray-600'
              }`}
            >
              Privacy
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-10 w-20 bg-gray-100 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 hover:bg-safet-50"
                  >
                    <User className="h-5 w-5 text-safet-500" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 hover:bg-safet-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 text-safet-500" />
                  <span className="text-sm font-medium">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 hover:bg-safet-50"
                  >
                    <LogIn className="h-5 w-5 text-safet-500" />
                    <span className="text-sm font-medium">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="bg-safet-500 hover:bg-safet-600 text-white shadow-sm transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
