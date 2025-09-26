"use client";

import { useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { updateMessage } from '../features/chat/chatSlice';

interface StreamEvent {
  type: 'start' | 'partial' | 'complete' | 'error';
  field?: string;
  value?: any;
  data?: any;
  message?: string;
  error?: string;
}

export function useCampaignStream() {
  const dispatch = useAppDispatch();

  const streamCampaign = useCallback(async (
    query: string, 
    messageId: string,
    onProgress?: (data: any) => void
  ) => {
    try {
      const response = await fetch('/api/campaign/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialData: any = { campaign: {} };

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: StreamEvent = JSON.parse(line.slice(6));
              
              switch (event.type) {
                case 'start':
                  // Update message to show streaming started
                  dispatch(updateMessage({
                    id: messageId,
                    content: 'Generating your campaign configuration...',
                    streaming: true,
                  }));
                  break;

                case 'partial':
                  // Update partial data
                  if (event.data) {
                    partialData = { ...partialData, ...event.data };
                    
                    // Update message with partial JSON
                    dispatch(updateMessage({
                      id: messageId,
                      content: `Generating campaign... (${event.field} added)`,
                      jsonData: partialData,
                      streaming: true,
                    }));

                    onProgress?.(partialData);
                  }
                  break;

                case 'complete':
                  // Final complete data
                  if (event.data) {
                    dispatch(updateMessage({
                      id: messageId,
                      content: 'Campaign generation complete! Here\'s your configuration:',
                      jsonData: event.data,
                      streaming: false,
                    }));

                    onProgress?.(event.data);
                  }
                  break;

                case 'error':
                  dispatch(updateMessage({
                    id: messageId,
                    content: `Error generating campaign: ${event.error}`,
                    streaming: false,
                  }));
                  break;
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      dispatch(updateMessage({
        id: messageId,
        content: 'Error connecting to campaign generation service.',
        streaming: false,
      }));
    }
  }, [dispatch]);

  return { streamCampaign };
}