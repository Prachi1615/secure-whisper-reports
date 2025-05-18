
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoIcon } from 'lucide-react';

const SubmitReport = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    date: '',
    location: '',
    individuals: '',
    evidence: '',
    walletAddress: '',
    includeWallet: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulating API call with timeout
    setTimeout(() => {
      // Generate a random report ID
      const newReportId = 'WB-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      
      setReportId(newReportId);
      setReportSubmitted(true);
      setLoading(false);
      
      toast({
        title: "Report submitted successfully",
        description: "Your report has been securely recorded on our blockchain.",
      });
    }, 1500);
  };

  const nextTab = () => {
    if (activeTab === 'details') {
      setActiveTab('evidence');
    } else if (activeTab === 'evidence') {
      setActiveTab('reward');
    }
  };

  const prevTab = () => {
    if (activeTab === 'reward') {
      setActiveTab('evidence');
    } else if (activeTab === 'evidence') {
      setActiveTab('details');
    }
  };
  
  if (reportSubmitted) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Card>
          <CardHeader className="text-center bg-whistleblower-success rounded-t-lg">
            <CardTitle className="text-2xl text-green-800">Report Successfully Submitted</CardTitle>
            <CardDescription className="text-green-700">Your report has been securely recorded on our blockchain</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Important: Save Your Report ID</h3>
              <p className="text-gray-600 text-center mb-4">You'll need this ID to check your report status. Store it somewhere safe.</p>
              
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 w-full text-center mb-4">
                <span className="font-mono text-2xl font-semibold tracking-wider">{reportId}</span>
              </div>
              
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(reportId);
                  toast({
                    title: "Copied to clipboard",
                    description: "Report ID has been copied to your clipboard."
                  });
                }}
                variant="outline" 
                className="mb-4"
              >
                Copy to Clipboard
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h4 className="font-semibold flex items-center mb-3">
                <InfoIcon className="h-5 w-5 mr-2 text-blue-500" /> 
                Next Steps
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Your report will be reviewed by our investigators within 24-48 hours</li>
                <li>You can check your report status using your Report ID</li>
                <li>Any communication from investigators will be available in your report status page</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button 
              variant="ghost"
              onClick={() => {
                setReportSubmitted(false);
                setFormData({
                  category: '',
                  description: '',
                  date: '',
                  location: '',
                  individuals: '',
                  evidence: '',
                  walletAddress: '',
                  includeWallet: false,
                });
                setActiveTab('details');
              }}
            >
              Submit Another Report
            </Button>
            <Button asChild>
              <a href={`/check-status?id=${reportId}`}>Check Report Status</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">Submit a Secure Report</h1>
      <p className="text-gray-600 mb-8 text-center">All information is encrypted and stored securely on the blockchain</p>
      
      <Card>
        <CardHeader>
          <CardTitle>New Whistleblower Report</CardTitle>
          <CardDescription>Please provide as much detail as possible to help with the investigation.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="details">Report Details</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="reward">Reward Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category of Report</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange('category', value)} 
                    value={formData.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fraud">Financial Fraud</SelectItem>
                      <SelectItem value="corruption">Corruption</SelectItem>
                      <SelectItem value="harassment">Workplace Harassment</SelectItem>
                      <SelectItem value="discrimination">Discrimination</SelectItem>
                      <SelectItem value="ethics">Ethical Violations</SelectItem>
                      <SelectItem value="safety">Health & Safety Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description of Incident</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a detailed description of what happened..."
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date of Incident</Label>
                    <Input 
                      id="date" 
                      name="date" 
                      type="date" 
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      placeholder="Where did this occur?"
                      value={formData.location}
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="individuals">Individuals Involved</Label>
                  <Textarea
                    id="individuals"
                    name="individuals"
                    placeholder="Names and positions of people involved (if known)..."
                    rows={3}
                    value={formData.individuals}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={nextTab}>Next: Evidence</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="evidence" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence Description</Label>
                  <Textarea
                    id="evidence"
                    name="evidence"
                    placeholder="Describe any evidence you have (documents, recordings, etc.)..."
                    rows={5}
                    value={formData.evidence}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Files (Optional)</Label>
                  <Input id="file" type="file" className="py-2" multiple />
                  <p className="text-xs text-gray-500">Files are encrypted before storage. Max 5 files, 10MB each.</p>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevTab}>Previous: Details</Button>
                  <Button type="button" onClick={nextTab}>Next: Reward Options</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="reward" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  <h3 className="text-lg font-medium mb-2">Receive Rewards for Verified Reports</h3>
                  <p className="text-gray-600 mb-4">If your report leads to a successful resolution, you may be eligible for a monetary reward. Providing a crypto wallet address is optional and won't affect how your report is handled.</p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                      id="includeWallet" 
                      checked={formData.includeWallet} 
                      onCheckedChange={(checked) => handleSwitchChange('includeWallet', checked)} 
                    />
                    <Label htmlFor="includeWallet">I want to provide a wallet address for potential rewards</Label>
                  </div>
                  
                  {formData.includeWallet && (
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Crypto Wallet Address</Label>
                      <Input 
                        id="walletAddress" 
                        name="walletAddress" 
                        placeholder="Enter your wallet address..."
                        value={formData.walletAddress}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-gray-500">We support Ethereum, Solana, and Bitcoin addresses.</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="consent" className="h-4 w-4 text-whistleblower-accent" required />
                    <Label htmlFor="consent">I confirm all information provided is true and accurate to the best of my knowledge.</Label>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevTab}>Previous: Evidence</Button>
                  <Button type="submit" disabled={loading} className="bg-whistleblower-accent hover:bg-whistleblower-primary">
                    {loading ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitReport;
