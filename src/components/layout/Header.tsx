
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Header = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('user') !== null;

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
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 hover:bg-safet-50"
                >
                  <User className="h-5 w-5 text-safet-500" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Button>
              </Link>
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
