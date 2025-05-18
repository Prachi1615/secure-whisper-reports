
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LockIcon, PhoneIcon, ShieldIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-whistleblower-secondary/95 text-white py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <ShieldIcon className="h-6 w-6 text-whistleblower-accent" />
          <span>SecureWhistle</span>
        </Link>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-whistleblower-accent transition-colors">Home</Link>
          <Link to="/submit" className="hover:text-whistleblower-accent transition-colors">Submit Report</Link>
          <Link to="/check-status" className="hover:text-whistleblower-accent transition-colors">Check Status</Link>
          <Link to="/contact" className="hover:text-whistleblower-accent transition-colors">Help</Link>
          <Link to="/ai-assistant">
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent border-whistleblower-accent text-white hover:bg-whistleblower-accent">
              <PhoneIcon className="h-4 w-4" />
              <span>AI Assistant</span>
            </Button>
          </Link>
        </div>
        
        <div className="md:hidden">
          {/* Mobile menu button could be added here */}
          <Button variant="ghost" size="sm" className="text-white">
            <span className="sr-only">Open menu</span>
            ≡
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
