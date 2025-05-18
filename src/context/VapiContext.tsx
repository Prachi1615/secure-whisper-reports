
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// This is a mock Vapi context that simulates the Vapi functionality
// In a real implementation, you would use @vapi-ai/web

type Message = {
  type: string;
  speaker?: string;
  text?: string;
  content?: string;
};

class MockVapi {
  private apiKey: string;
  private listeners: Record<string, ((msg: any) => void)[]>;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.listeners = {};
  }
  
  async start(assistantId: string) {
    console.log(`Starting call with assistant ${assistantId}`);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Notify listeners that the call has started
    this.notifyListeners('message', {
      type: 'transcript',
      speaker: 'agent',
      text: 'Hello, I am your whistleblower assistant. How can I help you today?'
    });
    
    return true;
  }
  
  async stop() {
    console.log('Stopping call');
    return true;
  }
  
  addListener(event: string, callback: (msg: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  removeListener(event: string, callback: (msg: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
  
  private notifyListeners(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

type VapiContextType = {
  vapi: MockVapi | null;
  loading: boolean;
  error: string | null;
  isCallActive: boolean;
  startCall: (assistantId: string) => Promise<void>;
  endCall: () => void;
  messages: Message[];
};

const VapiContext = createContext<VapiContextType>({
  vapi: null,
  loading: true,
  error: null,
  isCallActive: false,
  startCall: async () => {},
  endCall: () => {},
  messages: [],
});

export function VapiProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [vapi, setVapi] = useState<MockVapi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize the Vapi instance when the component mounts
  useEffect(() => {
    const initVapi = () => {
      try {
        setLoading(true);
        setError(null);

        // For demo purposes, we're using a mock API key
        const apiKey = 'mock-api-key';
        
        // Create a new Vapi instance
        const vapiInstance = new MockVapi(apiKey);
        
        setVapi(vapiInstance);
        setError(null);
      } catch (err) {
        console.error('Error initializing VAPI:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize VAPI');
        setVapi(null);
      } finally {
        setLoading(false);
      }
    };

    initVapi();

    // Clean up when the component unmounts
    return () => {
      if (isCallActive && vapi) {
        vapi.stop();
      }
      setVapi(null);
    };
  }, []);

  // Function to start a call with the Vapi assistant
  const startCall = async (assistantId: string) => {
    if (!vapi) {
      setError('Vapi is not initialized');
      toast({
        title: "Error",
        description: "Failed to initialize the voice assistant",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Add message event listener
      const handleMessage = (msg: Message) => {
        console.log('VAPI message:', msg);
        setMessages(prev => [...prev, msg]);
      };
      
      vapi.addListener('message', handleMessage);
      
      // Start the call
      await vapi.start(assistantId);
      setIsCallActive(true);
      
      toast({
        title: "Call started",
        description: "You're connected to the AI assistant"
      });
    } catch (err) {
      console.error('Error starting call:', err);
      setError(err instanceof Error ? err.message : 'Failed to start call');
      
      toast({
        title: "Error",
        description: "Failed to start the voice call",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to end a call with the Vapi assistant
  const endCall = () => {
    if (!vapi || !isCallActive) return;

    try {
      vapi.stop();
      setIsCallActive(false);
      setMessages([]);
      
      toast({
        title: "Call ended",
        description: "Your call with the AI assistant has ended"
      });
    } catch (err) {
      console.error('Error ending call:', err);
      
      toast({
        title: "Error",
        description: "Failed to end the call properly",
        variant: "destructive"
      });
    }
  };

  return (
    <VapiContext.Provider 
      value={{ 
        vapi, 
        loading, 
        error, 
        isCallActive,
        startCall,
        endCall,
        messages
      }}
    >
      {children}
    </VapiContext.Provider>
  );
}

export function useVapi() {
  return useContext(VapiContext);
}
