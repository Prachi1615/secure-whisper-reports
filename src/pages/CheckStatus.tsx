
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ClockIcon, MessageSquareIcon, SendIcon } from 'lucide-react';

type MessageType = {
  id: string;
  isInvestigator: boolean;
  content: string;
  timestamp: string;
};

type ReportType = {
  id: string;
  status: 'pending' | 'active' | 'resolved' | 'declined';
  category: string;
  dateSubmitted: string;
  messages: MessageType[];
  updates: {
    date: string;
    title: string;
    description: string;
  }[];
};

const mockReport: ReportType = {
  id: 'WB-XYZ12345',
  status: 'active',
  category: 'Workplace Harassment',
  dateSubmitted: '2024-05-15',
  messages: [
    {
      id: '1',
      isInvestigator: true,
      content: 'Thank you for your report. We are currently reviewing the information you provided. If we need additional details, we will contact you through this secure channel.',
      timestamp: '2024-05-16 09:30'
    },
    {
      id: '2',
      isInvestigator: false,
      content: 'I forgot to mention that the incident also happened during the company retreat last month. There were several witnesses.',
      timestamp: '2024-05-16 10:15'
    },
    {
      id: '3',
      isInvestigator: true,
      content: 'Thank you for this additional information. Could you provide any names of potential witnesses who might be willing to corroborate your report?',
      timestamp: '2024-05-16 14:22'
    }
  ],
  updates: [
    {
      date: '2024-05-15',
      title: 'Report Received',
      description: 'Your report has been securely recorded on our blockchain.'
    },
    {
      date: '2024-05-16',
      title: 'Under Review',
      description: 'An investigator has been assigned to review your report.'
    }
  ]
};

const CheckStatus = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [reportId, setReportId] = useState(initialId);
  const [report, setReport] = useState<ReportType | null>(initialId ? mockReport : null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Report ID",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (reportId.toUpperCase().startsWith('WB-')) {
        setReport(mockReport);
      } else {
        toast({
          title: "Report not found",
          description: "No report found with the provided ID. Please check and try again.",
          variant: "destructive"
        });
        setReport(null);
      }
      setLoading(false);
    }, 1000);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: MessageType = {
      id: Date.now().toString(),
      isInvestigator: false,
      content: message,
      timestamp: new Date().toLocaleString()
    };
    
    if (report) {
      const updatedReport = {
        ...report,
        messages: [...report.messages, newMessage]
      };
      setReport(updatedReport);
      setMessage('');
      
      toast({
        title: "Message sent",
        description: "Your message has been securely sent to the investigators."
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">Check Report Status</h1>
      <p className="text-gray-600 mb-8 text-center">Track the progress of your whistleblower report</p>
      
      {!report ? (
        <Card>
          <CardHeader>
            <CardTitle>Enter Report ID</CardTitle>
            <CardDescription>Please enter the Report ID you received when submitting your report</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportId">Report ID</Label>
                  <Input
                    id="reportId"
                    value={reportId}
                    onChange={(e) => setReportId(e.target.value)}
                    placeholder="e.g., WB-XYZ12345"
                    className="font-mono"
                  />
                </div>
                <Button type="submit" className="w-full bg-whistleblower-accent hover:bg-whistleblower-primary" disabled={loading}>
                  {loading ? "Checking..." : "Check Status"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report {report.id}</CardTitle>
                  <CardDescription>Submitted on {report.dateSubmitted}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(report.status)} px-3 py-1 uppercase text-xs font-semibold`}>
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <p>{report.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date Submitted</h3>
                  <p>{report.dateSubmitted}</p>
                </div>
              </div>
              
              <Tabs defaultValue="messages">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="messages">
                    <MessageSquareIcon className="h-4 w-4 mr-2" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="timeline">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="messages" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-80 overflow-y-auto">
                    {report.messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`mb-4 ${msg.isInvestigator ? 'pl-4' : 'pr-4'}`}
                      >
                        <div className={`flex ${msg.isInvestigator ? 'justify-start' : 'justify-end'}`}>
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.isInvestigator 
                              ? 'bg-whistleblower-light text-gray-800' 
                              : 'bg-whistleblower-accent text-white'
                            }`}
                          >
                            <div className="text-sm">{msg.content}</div>
                            <div className={`text-xs mt-1 ${msg.isInvestigator ? 'text-gray-500' : 'text-white/70'}`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${msg.isInvestigator ? 'text-left' : 'text-right'}`}>
                          {msg.isInvestigator ? 'Investigator' : 'You'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                      <Label htmlFor="message" className="sr-only">Your message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Type your message here..." 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button onClick={sendMessage} size="icon" className="h-10 w-10">
                      <SendIcon className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500">All messages are end-to-end encrypted and stored securely on the blockchain.</p>
                </TabsContent>
                
                <TabsContent value="timeline" className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <ul className="space-y-4">
                      {report.updates.map((update, index) => (
                        <li key={index} className="relative pl-6 pb-4">
                          {index < report.updates.length - 1 && (
                            <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-gray-200"></div>
                          )}
                          <div className="absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-whistleblower-accent bg-white"></div>
                          <div className="text-sm text-gray-500">{update.date}</div>
                          <h4 className="font-medium">{update.title}</h4>
                          <p className="text-gray-600">{update.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setReport(null)}>
                Check Another Report
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CheckStatus;
