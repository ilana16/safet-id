
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, QrCode, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Let's fake the motion import to avoid dependency issues
// Normally we'd install framer-motion, but for this demo we'll simulate it
const MotionDiv = ({ children, ...props }: any) => <div {...props}>{children}</div>;

const features = [
  {
    icon: <Lock className="h-10 w-10 text-safet-500" />,
    title: 'Secure Medical Information',
    description: 'Your health data is encrypted and stored securely, compliant with HIPAA standards.'
  },
  {
    icon: <QrCode className="h-10 w-10 text-safet-500" />,
    title: 'QR Code Access',
    description: 'Share your medical information instantly via a unique QR code, protected by your access code.'
  },
  {
    icon: <Clock className="h-10 w-10 text-safet-500" />,
    title: 'Immediate Access',
    description: 'Healthcare providers can access your critical information in seconds during emergencies.'
  },
  {
    icon: <Users className="h-10 w-10 text-safet-500" />,
    title: 'Proxy Accounts',
    description: 'Allow family members or caregivers controlled access to your medical information.'
  }
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-safet-50 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-block px-3 py-1 rounded-full bg-safet-100 text-safet-800 text-xs font-medium mb-6">
                HIPAA Compliant
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
                Your Medical Information,<br />
                <span className="text-safet-500">Accessible When Needed</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                SafeT-iD securely stores your health information and makes it accessible through a unique QR code - putting you in control of your medical data.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto bg-safet-500 hover:bg-safet-600 text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Create Your SafeT-iD
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto border-safet-200 text-safet-700 hover:bg-safet-50"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-in hidden lg:block">
              <div className="relative w-full h-[400px] rounded-2xl bg-white p-6 shadow-xl">
                <div className="absolute -right-6 -top-6">
                  <div className="p-3 bg-white rounded-xl shadow-lg">
                    <QrCode className="h-14 w-14 text-safet-500" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-10 w-3/4 bg-safet-100 rounded-lg animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                    <div className="h-20 bg-gray-100 rounded-lg"></div>
                  </div>
                  <div className="h-8 w-1/2 bg-safet-200 rounded-lg mx-auto"></div>
                </div>
              </div>
              <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2 w-40 h-40 bg-safet-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 w-60 h-60 bg-safet-100 rounded-full opacity-50 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Your Health Information, Secured
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              SafeT-iD provides a comprehensive, secure solution for storing and sharing your medical information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-safet-100"
              >
                <div className="absolute -top-6 left-6 p-3 bg-white rounded-xl shadow-sm">
                  {feature.icon}
                </div>
                <div className="pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How SafeT-iD Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and designed with your privacy in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-safet-100 text-safet-600 text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Account</h3>
              <p className="text-gray-600 mb-6">
                Register and fill in your comprehensive medical profile with all your important health information.
              </p>
              <Link to="/register">
                <Button 
                  variant="link" 
                  className="text-safet-600 hover:text-safet-700"
                >
                  Get Started →
                </Button>
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-safet-100 text-safet-600 text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Receive Your QR Code</h3>
              <p className="text-gray-600 mb-6">
                Get a unique QR code and 5-digit access code to securely share your medical information.
              </p>
              <Button 
                variant="link" 
                className="text-safet-600 hover:text-safet-700"
                disabled
              >
                View Demo →
              </Button>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-safet-100 text-safet-600 text-xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share When Needed</h3>
              <p className="text-gray-600 mb-6">
                Allow healthcare providers to scan your QR code and enter your access code to view your information.
              </p>
              <Link to="/view">
                <Button 
                  variant="link" 
                  className="text-safet-600 hover:text-safet-700"
                >
                  Learn More →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-safet-50 rounded-2xl p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-50">
              <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-safet-100 rounded-full"></div>
              <div className="absolute -left-20 -top-20 w-60 h-60 bg-safet-200 rounded-full opacity-50"></div>
            </div>
            
            <div className="relative z-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                  Ready to take control of your medical information?
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                  Create your SafeT-iD account today and ensure your critical health information is always accessible when needed.
                </p>
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="bg-safet-500 hover:bg-safet-600 text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
