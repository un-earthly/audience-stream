"use client";

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { updateMessage, startStreaming, stopStreaming } from '../features/chat/chatSlice';
import { CampaignGenerationData, ExtendedStreamEvent, TabsData } from '@/lib/types';
import { appendImages, appendSources, setAnswer, appendThoughts, setTabs } from '../features/chat/tabsSlice';
import { updateJsonPanelData, openJsonPanel } from '../features/chat/uiSlice';
import { updateMessageInConversation } from '../features/chat/historySlice';

// StreamEvent type moved to lib/types

export function useCampaignStream() {
  const dispatch = useAppDispatch();
  const tabsState = useAppSelector((state) => state.tabs);
  const activeConversationId = useAppSelector((s) => s.history.activeConversationId);

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
      // Local accumulation buffers to avoid stale reads
      let answerBuffer = '';
      let suggestionsBuffer: string[] = [];
      let summaryText = '';
      let blocksBuffer: TabsData['blocks'] = [];

      const mergeDeep = (target: any, source: any) => {
        if (typeof target !== 'object' || target === null) return source;
        if (typeof source !== 'object' || source === null) return target;
        const out: any = Array.isArray(target) ? [...target] : { ...target };
        for (const key of Object.keys(source)) {
          const sVal: any = (source as any)[key];
          const tVal: any = (out as any)[key];
          if (Array.isArray(sVal)) {
            out[key] = sVal; // replace arrays
          } else if (typeof sVal === 'object' && sVal !== null) {
            out[key] = mergeDeep(tVal ?? {}, sVal);
          } else {
            out[key] = sVal;
          }
        }
        return out;
      };

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
                if (tabs.thoughts && tabs.thoughts.length) {
                  dispatch(appendThoughts({ messageId, thoughts: tabs.thoughts }));
                }
                if (tabs.uiComponent) {
                  // Update the entire tabs state to include the UI component
                  const existingTabs = { answer: tabs.answer, images: tabs.images, sources: tabs.sources, thoughts: tabs.thoughts };
                  dispatch(setTabs({ messageId, data: { ...existingTabs, uiComponent: tabs.uiComponent } }));
                }
              }

              // Handle block-based streaming
              if (event.block) {
                switch (event.block) {
                  case 'init':
                    // Initialize clean state for this message
                    answerBuffer = '';
                    suggestionsBuffer = [];
                    summaryText = '';
                    blocksBuffer = [];
                    dispatch(setAnswer({ messageId, answer: '' }));
                    dispatch(setTabs({ messageId, data: { blocks: blocksBuffer } }));
                    break;

                  case 'para':
                    if (event.content) {
                      // Append to local buffer and push to store
                      answerBuffer = answerBuffer + (answerBuffer ? '\n\n' : '') + event.content;
                      dispatch(setAnswer({ messageId, answer: answerBuffer }));
                      blocksBuffer = [ ...(blocksBuffer ?? []), { kind: 'para' as const, content: event.content } ];
                      dispatch(setTabs({ messageId, data: { blocks: blocksBuffer } }));
                    }
                    break;

                  case 'artifact_start':
                    // Open the side panel and render the CampaignConfigurator card immediately in the message
                    dispatch(openJsonPanel({}));
                    {
                      const currentTabs = tabsState[messageId] || {};
                      if (!currentTabs.uiComponent) {
                        dispatch(setTabs({
                          messageId,
                          data: {
                            uiComponent: {
                              type: 'campaign_configurator',
                              data: {},
                              title: 'Campaign Configuration',
                              description: 'Live configuration is being generated in the side panel.'
                            },
                          },
                        }));
                      }
                      blocksBuffer = [ ...(blocksBuffer ?? []), { kind: 'artifact_indicator' as const, title: 'Campaign Configuration', description: 'Live configuration is being generated in the side panel.' } ];
                      dispatch(setTabs({ messageId, data: { blocks: blocksBuffer } }));
                    }
                    // Persist placeholder uiComponent in message/jsonData for hydration
                    {
                      const uiComponent = {
                        type: 'campaign_configurator',
                        data: {},
                        title: 'Campaign Configuration',
                        description: 'Live configuration is being generated in the side panel.'
                      } as any;
                      const jsonData = { ...(partialData as any), uiComponent };
                      dispatch(updateMessage({ id: messageId, jsonData, streaming: true }));
                      if (activeConversationId) {
                        dispatch(updateMessageInConversation({ conversationId: activeConversationId, messageId, patch: { jsonData } }));
                      }
                    }
                    break;

                  case 'artifact_chunk':
                    if (event.artifact) {
                      partialData = mergeDeep(partialData, event.artifact as any);
                      const jsonData = partialData as any;
                      dispatch(updateJsonPanelData(jsonData));
                      dispatch(updateMessage({ id: messageId, jsonData, streaming: true }));
                      if (activeConversationId) {
                        dispatch(updateMessageInConversation({ conversationId: activeConversationId, messageId, patch: { jsonData } }));
                      }
                    }
                    break;

                  case 'artifact_end':
                    if (event.artifact) {
                      partialData = mergeDeep(partialData, event.artifact as any);
                      // finalize uiComponent data to full artifact for persistence
                      const jsonData = { ...(partialData as any), uiComponent: { type: 'campaign_configurator', data: partialData } };
                      dispatch(updateJsonPanelData(jsonData));
                      dispatch(updateMessage({ id: messageId, jsonData, streaming: true }));
                      if (activeConversationId) {
                        dispatch(updateMessageInConversation({ conversationId: activeConversationId, messageId, patch: { jsonData } }));
                      }
                    }
                    break;

                  case 'sugg':
                    if (event.suggestions?.length) {
                      suggestionsBuffer = event.suggestions;
                      blocksBuffer = [ ...(blocksBuffer ?? []), { kind: 'suggestions' as const, suggestions: suggestionsBuffer } ];
                      dispatch(setTabs({ messageId, data: { suggestions: suggestionsBuffer, blocks: blocksBuffer } }));
                    }
                    break;

                  case 'sum':
                    if (event.content) {
                      summaryText = event.content;
                      blocksBuffer = [ ...(blocksBuffer ?? []), { kind: 'summary' as const, content: summaryText } ];
                      dispatch(setTabs({ messageId, data: { summary: summaryText, blocks: blocksBuffer } }));
                    }
                    break;

                  case 'conclusion':
                    if (event.content) {
                      answerBuffer = answerBuffer + (answerBuffer ? '\n' : '') + event.content;
                      dispatch(setAnswer({ messageId, answer: answerBuffer }));
                      blocksBuffer = [ ...(blocksBuffer ?? []), { kind: 'conclusion' as const, content: event.content } ];
                      dispatch(setTabs({ messageId, data: { blocks: blocksBuffer } }));
                    }
                    break;
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

                    // Update panel data (panel should already be open from json_generation_start)
                    dispatch(updateJsonPanelData(partialData));
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
  }, [dispatch, tabsState]);

  return { streamCampaign };
}