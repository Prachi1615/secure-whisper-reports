
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Secure Whistleblower Reporting System</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">Report workplace misconduct, corruption, or other issues securely and anonymously using blockchain technology</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/submit" className="cta-button primary">Submit a Report</Link>
              <Link to="/check-status" className="cta-button secondary">Check Report Status</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="features">
          <Card className="feature transition-all hover:border-whistleblower-accent">
            <CardContent className="pt-6">
              <div className="feature-icon">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Anonymous Reporting</h3>
              <p className="text-gray-600">Submit reports completely anonymously with no personally identifiable information required</p>
            </CardContent>
          </Card>
          
          <Card className="feature transition-all hover:border-whistleblower-accent">
            <CardContent className="pt-6">
              <div className="feature-icon">⛓️</div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
              <p className="text-gray-600">All reports are stored on a secure blockchain network for tamper-proof record keeping</p>
            </CardContent>
          </Card>
          
          <Card className="feature transition-all hover:border-whistleblower-accent">
            <CardContent className="pt-6">
              <div className="feature-icon">💰</div>
              <h3 className="text-xl font-semibold mb-2">Monetary Rewards</h3>
              <p className="text-gray-600">Optionally provide a crypto wallet address to receive rewards for verified reports</p>
            </CardContent>
          </Card>
          
          <Card className="feature transition-all hover:border-whistleblower-accent">
            <CardContent className="pt-6">
              <div className="feature-icon">💬</div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600">Securely communicate with investigators while maintaining your anonymity</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="my-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <ol className="relative border-l border-gray-300">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-whistleblower-accent text-white">1</span>
                <h3 className="flex items-center text-xl font-semibold">Submit your report</h3>
                <p className="text-gray-600 mt-2">Through our secure form with an optional crypto wallet address for rewards</p>
              </li>
              
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-whistleblower-accent text-white">2</span>
                <h3 className="flex items-center text-xl font-semibold">Receive a unique report ID</h3>
                <p className="text-gray-600 mt-2">To check your report status and communicate with investigators</p>
              </li>
              
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-whistleblower-accent text-white">3</span>
                <h3 className="flex items-center text-xl font-semibold">Investigators review</h3>
                <p className="text-gray-600 mt-2">Reports based on criticality and begin their investigation</p>
              </li>
              
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-whistleblower-accent text-white">4</span>
                <h3 className="flex items-center text-xl font-semibold">Communicate securely</h3>
                <p className="text-gray-600 mt-2">With investigators while maintaining anonymity throughout the process</p>
              </li>
              
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-whistleblower-accent text-white">5</span>
                <h3 className="flex items-center text-xl font-semibold">Get updates</h3>
                <p className="text-gray-600 mt-2">On the progress and outcome of your report investigation</p>
              </li>
              
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-whistleblower-accent text-white">6</span>
                <h3 className="flex items-center text-xl font-semibold">Receive rewards</h3>
                <p className="text-gray-600 mt-2">If your report leads to successful action (if wallet was provided)</p>
              </li>
            </ol>
          </div>
        </div>
        
        <div className="text-center pb-16">
          <h2 className="text-3xl font-bold mb-6">Ready to make a report?</h2>
          <Button asChild size="lg" className="bg-whistleblower-accent hover:bg-whistleblower-primary text-white">
            <Link to="/submit" className="flex items-center">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
