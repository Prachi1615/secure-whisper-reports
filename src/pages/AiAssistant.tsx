
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MicIcon, PhoneIcon, PhoneOffIcon } from 'lucide-react';

// Mock audio URL - this would be replaced by the actual Vapi AI assistant
const mockAudioUrl = "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3";

const AiAssistant = () => {
  const { toast } = useToast();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string; }[]>([]);
  const [vapiKey, setVapiKey] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<'idle' | 'speaking' | 'listening'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check for Vapi API key in localStorage (if user has stored it before)
    const storedApiKey = localStorage.getItem('vapiApiKey');
    if (storedApiKey) {
      setVapiKey(storedApiKey);
    }

    // Initialize audio element
    audioRef.current = new Audio();
    
    // Clean up
    return () => {
      if (isCallActive) {
        endCall();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const startCall = async () => {
    try {
      setIsLoading(true);
      
      if (!vapiKey) {
        // If no API key, ask user to enter one
        promptForApiKey();
        setIsLoading(false);
        return;
      }
      
      // Simulate API initialization
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Start the call
      setIsCallActive(true);
      setMessages([
        { role: 'assistant', content: 'Hello, I\'m your whistleblower assistant. How can I help you today?' }
      ]);
      
      // Simulate the assistant speaking
      setAudioState('speaking');
      if (audioRef.current) {
        audioRef.current.src = mockAudioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setAudioState('listening');
        };
      }
      
      toast({
        title: "Call connected",
        description: "You are now connected to our AI assistant."
      });
      
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to the assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = () => {
    // End the call
    setIsCallActive(false);
    setAudioState('idle');
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    
    toast({
      title: "Call ended",
      description: "Your call with the AI assistant has ended."
    });
  };

  const promptForApiKey = () => {
    const apiKey = window.prompt("Please enter your Vapi API key to continue:");
    if (apiKey) {
      setVapiKey(apiKey);
      localStorage.setItem('vapiApiKey', apiKey);
      // Start call again now that we have the key
      startCall();
    }
  };

  const handleUserSpeak = () => {
    // Simulate user speaking
    setAudioState('listening');
    
    setTimeout(() => {
      // After 3 seconds, add user message
      const userMessage = "I'd like to know how the whistleblower reporting system protects my anonymity";
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      
      // Then simulate assistant responding
      setTimeout(() => {
        setAudioState('speaking');
        const assistantResponse = "The whistleblower system protects your anonymity through several layers of security. First, all reports are encrypted end-to-end. Second, we use blockchain technology to ensure that once data is recorded, it cannot be altered. Third, no personally identifiable information is required to submit a report. You're identified only by a randomly generated report ID that you should keep secure. If you choose to provide a crypto wallet for rewards, that information is kept separate from your report details.";
        
        setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
        
        if (audioRef.current) {
          audioRef.current.src = mockAudioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => {
            setAudioState('listening');
          };
        }
      }, 1000);
    }, 3000);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">AI Whistleblowing Assistant</h1>
      <p className="text-gray-600 mb-8 text-center">Get help with reporting and ask questions about whistleblower protections</p>
      
      <Card>
        <CardHeader className={isCallActive ? 'bg-whistleblower-accent text-white' : ''}>
          <CardTitle>Whistleblower AI Assistant</CardTitle>
          <CardDescription className={isCallActive ? 'text-white/80' : ''}>
            {isCallActive 
              ? 'Call in progress - speak clearly and ask your questions' 
              : 'Start a secure voice call with our AI assistant to get help'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isCallActive ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-64 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 ${msg.role === 'assistant' ? 'pl-4' : 'pr-4'}`}
                  >
                    <div className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'assistant' 
                          ? 'bg-whistleblower-light text-gray-800' 
                          : 'bg-whistleblower-accent text-white'
                        }`}
                      >
                        <div className="text-sm">{msg.content}</div>
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${msg.role === 'assistant' ? 'text-left' : 'text-right'}`}>
                      {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                {audioState === 'idle' && (
                  <div className="text-gray-500">Call connected. Assistant will speak shortly...</div>
                )}
                
                {audioState === 'speaking' && (
                  <div className="flex items-center space-x-2 text-whistleblower-primary">
                    <div className="relative">
                      <div className="w-3 h-3 bg-whistleblower-primary rounded-full animate-pulse"></div>
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-whistleblower-primary/30 rounded-full animate-ping"></div>
                    </div>
                    <span>Assistant is speaking...</span>
                  </div>
                )}
                
                {audioState === 'listening' && (
                  <Button 
                    onClick={handleUserSpeak}
                    size="lg" 
                    className="rounded-full h-16 w-16 p-0 bg-whistleblower-accent hover:bg-whistleblower-primary"
                  >
                    <MicIcon className="h-6 w-6" />
                    <span className="sr-only">Speak</span>
                  </Button>
                )}
                
                <p className="text-sm text-gray-500">
                  {audioState === 'listening' 
                    ? 'Click the mic button and speak clearly' 
                    : audioState === 'speaking'
                      ? 'Please wait for the assistant to finish speaking'
                      : 'Please wait...'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-whistleblower-light rounded-full p-6 mb-6">
                <PhoneIcon className="h-10 w-10 text-whistleblower-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Speak with our AI Assistant</h3>
              <p className="text-gray-600 text-center mb-6">
                Get answers about whistleblowing, report procedures, and protections through a secure voice interface.
              </p>
              <Button
                onClick={startCall}
                disabled={isLoading}
                className="bg-whistleblower-accent hover:bg-whistleblower-primary"
              >
                {isLoading ? "Connecting..." : "Start Secure Call"}
              </Button>
            </div>
          )}
        </CardContent>
        {isCallActive && (
          <CardFooter className="flex justify-center">
            <Button 
              onClick={endCall} 
              variant="destructive" 
              className="flex items-center space-x-2"
            >
              <PhoneOffIcon className="h-4 w-4" />
              <span>End Call</span>
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">About the AI Assistant</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">Secure Conversations</h3>
              <p className="text-gray-600">All voice conversations are encrypted and not stored permanently after the call ends.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">Information & Guidance</h3>
              <p className="text-gray-600">Get helpful information about how to submit reports and the protections available to you.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-2">Available 24/7</h3>
              <p className="text-gray-600">Our AI assistant is available any time you need information or have questions about the process.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
