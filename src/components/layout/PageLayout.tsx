
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow pt-24 ${className}`}>
        <div className="page-transition">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
