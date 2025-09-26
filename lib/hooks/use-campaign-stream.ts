"use client";

import { useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { updateMessage, startStreaming, stopStreaming } from '../features/chat/chatSlice';
import { CampaignGenerationData, ExtendedStreamEvent, TabsData } from '@/lib/types';
import { appendImages, appendSources, setAnswer } from '../features/chat/tabsSlice';

// StreamEvent type moved to lib/types

export function useCampaignStream() {
  const dispatch = useAppDispatch();

  const streamCampaign = useCallback(async (
    query: string,
    messageId: string,
    onProgress?: (data: CampaignGenerationData) => void
  ) => {
    try {
      const response = await fetch('/api/campaign/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ query }),
        cache: 'no-store',
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialData: CampaignGenerationData = { campaign: {} };
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        let lineBreakIndex: number;
        while ((lineBreakIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, lineBreakIndex);
          buffer = buffer.slice(lineBreakIndex + 1);

          // Processed in the loop above
          if (line.startsWith('data: ')) {
            try {
              const event: ExtendedStreamEvent = JSON.parse(line.slice(6));

              // Handle tabs updates
              if (event.tabs) {
                const tabs: TabsData = event.tabs;
                if (tabs.answer !== undefined) {
                  dispatch(setAnswer({ messageId, answer: tabs.answer }));
                }
                if (tabs.images && tabs.images.length) {
                  dispatch(appendImages({ messageId, images: tabs.images }));
                }
                if (tabs.sources && tabs.sources.length) {
                  dispatch(appendSources({ messageId, sources: tabs.sources }));
                }
              }

              switch (event.type) {
                case 'start':
                  // Update message to show streaming started
                  dispatch(updateMessage({
                    id: messageId,
                    content: 'Generating your campaign configuration...',
                    streaming: true,
                  }));
                  dispatch(startStreaming(messageId));
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
                  dispatch(stopStreaming());
                  break;

                case 'error':
                  dispatch(updateMessage({
                    id: messageId,
                    content: `Error generating campaign: ${event.error}`,
                    streaming: false,
                  }));
                  dispatch(stopStreaming());
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