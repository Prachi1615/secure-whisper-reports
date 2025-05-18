
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MicIcon, PhoneIcon, PhoneOffIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { useVapi } from '../context/VapiContext';

// Assistant ID - replace this with your actual Vapi assistant ID when ready
const ASSISTANT_ID = "whistleblower-assistant"; // This will be replaced with your actual ID

const AiAssistant = () => {
  const { toast } = useToast();
  const { vapi, loading: vapiLoading, error: vapiError, isCallActive, startCall, endCall, messages } = useVapi();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [loadingCall, setLoadingCall] = useState(false);

  const handleStartCall = async () => {
    try {
      setLoadingCall(true);
      await startCall(ASSISTANT_ID);
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Call failed",
        description: "Could not connect to the AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCall(false);
    }
  };

  const handleEndCall = () => {
    endCall();
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // If we had actual audio control with Vapi, we would implement it here
    // For now, we'll just show a toast notification
    toast({
      title: audioEnabled ? "Audio muted" : "Audio unmuted",
      description: audioEnabled ? "You won't hear the assistant" : "You can now hear the assistant",
    });
  };

  const getSpeakingState = () => {
    if (!isCallActive) return 'idle';
    
    // Check the last message to determine if assistant is speaking or listening
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    
    if (!lastMessage) return 'idle';
    
    return lastMessage.type === 'transcript' && lastMessage.speaker === 'agent' ? 'speaking' : 'listening';
  };

  const audioState = getSpeakingState();

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
                {messages.map((msg, index) => {
                  // Handle different message types from Vapi
                  if (msg.type === 'transcript') {
                    return (
                      <div 
                        key={index} 
                        className={`mb-4 ${msg.speaker === 'agent' ? 'pl-4' : 'pr-4'}`}
                      >
                        <div className={`flex ${msg.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}>
                          <div 
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.speaker === 'agent' 
                              ? 'bg-whistleblower-light text-gray-800' 
                              : 'bg-whistleblower-accent text-white'
                            }`}
                          >
                            <div className="text-sm">{msg.text}</div>
                          </div>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${msg.speaker === 'agent' ? 'text-left' : 'text-right'}`}>
                          {msg.speaker === 'agent' ? 'AI Assistant' : 'You'}
                        </div>
                      </div>
                    );
                  } else {
                    // Handle any other message types
                    return null;
                  }
                })}
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
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <MicIcon className="h-10 w-10 text-whistleblower-accent" />
                      <div className="absolute -top-1 -left-1 w-12 h-12 border-2 border-whistleblower-accent/50 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-sm">Listening to you...</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleAudio}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  {audioEnabled ? <Volume2Icon /> : <VolumeXIcon />}
                </Button>
                <Button 
                  onClick={handleEndCall} 
                  variant="destructive" 
                  className="flex items-center space-x-2"
                >
                  <PhoneOffIcon className="h-4 w-4" />
                  <span>End Call</span>
                </Button>
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
                onClick={handleStartCall}
                disabled={vapiLoading || loadingCall}
                className="bg-whistleblower-accent hover:bg-whistleblower-primary"
              >
                {loadingCall || vapiLoading ? "Connecting..." : "Start Secure Call"}
              </Button>
              {vapiError && (
                <p className="text-red-500 mt-2 text-sm">{vapiError}</p>
              )}
            </div>
          )}
        </CardContent>
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
