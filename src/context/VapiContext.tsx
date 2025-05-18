
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import Vapi from '@vapi-ai/web';

type Message = {
  type: string;
  speaker?: string;
  text?: string;
  content?: string;
  role?: 'assistant' | 'user';
};

type VapiContextType = {
  vapi: Vapi | null;
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
  const [vapi, setVapi] = useState<Vapi | null>(null);
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

        // In a real implementation, this would come from environment variables
        // For demo purposes, we're using a placeholder
        const apiKey = 'YOUR_VAPI_API_KEY'; // Replace this with your actual API key
        
        // Create a new Vapi instance
        const vapiInstance = new Vapi(apiKey);
        
        const handleMessage = (msg: any) => {
          console.log('VAPI message:', msg);
          
          if (msg.type === 'transcript') {
            setMessages(prev => [...prev, {
              type: 'transcript',
              speaker: msg.speaker,
              text: msg.text,
              role: msg.speaker === 'agent' ? 'assistant' : 'user'
            }]);
          } else if (msg.type === 'message') {
            setMessages(prev => [...prev, {
              type: 'message',
              content: msg.content,
              role: 'assistant'
            }]);
          }
        };
        
        // Add listener for all messages
        vapiInstance.addListener('message', handleMessage);
        
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
      setMessages([]); // Clear previous messages
      
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
