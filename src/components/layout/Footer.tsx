
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-safet-500" />
              <span className="text-lg font-semibold text-gray-900">SafeT-iD</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Secure, HIPAA-compliant health information storage and sharing.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/view" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  View Medical Info
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/hipaa" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  HIPAA Compliance
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@safet-id.com" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  support@safet-id.com
                </a>
              </li>
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-safet-500 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} SafeT-iD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
