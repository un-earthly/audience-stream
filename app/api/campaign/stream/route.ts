import { NextRequest } from 'next/server';
import { ExtendedStreamEvent, CampaignGenerationData } from '@/lib/types';

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: ExtendedStreamEvent) => {
        const chunk = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
        controller.enqueue(chunk);
      };

      // Send initial response
      // Padding to avoid proxy buffering and indicate stream start
      controller.enqueue(encoder.encode(': stream start\n\n'));
      sendEvent({ type: 'start', message: 'Starting campaign generation...' });

      // Heartbeat every 15s to keep the connection alive
      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: keep-alive ${Date.now()}\n\n`));
      }, 15000);

      // Simulate multi-phase process with tabs updates and progressive JSON generation
      const generateCampaign = async () => {
        const campaignData: CampaignGenerationData = {
          campaign: {
            id: `campaign_${Date.now()}`,
            name: "",
            audience: "",
            channels: [] as string[],
            message: "",
            timing: "",
            meta: {
              priority: "medium",
              experiment_id: "",
              estimated_reach: 0
            }
          }
        };

        // Phase 0: Thinking
        sendEvent({ type: 'partial', message: 'Thinking...', });
        sendEvent({ type: 'partial', message: 'Analyzing requirements...', });
        // random ticks with thoughts
        for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
          await new Promise(resolve => setTimeout(resolve, 80 + Math.floor(Math.random() * 70)));
          const thought = i % 2 === 0
            ? `Clarifying goal based on query: "${query}"`
            : 'Mapping channels and audience for best reach';
          sendEvent({ type: 'partial', message: 'thinking_tick', tabs: { thoughts: [thought] } as any });
        }

        // Phase 1: Analyze - produce sources (placeholders)
        const sources = [
          { title: 'Facebook Ads Best Practices', url: 'https://example.com/fb-ads', source: 'facebook' },
          { title: 'Email Engagement Benchmarks', url: 'https://example.com/email-benchmarks', source: 'email' },
          { title: 'Ecommerce Cart Recovery', url: 'https://example.com/cart-recovery', source: 'blog' },
        ];
        sendEvent({ type: 'partial', message: 'analyze_start', tabs: { sources } as any });
        await new Promise(resolve => setTimeout(resolve, 150));

        // Phase 2: Generate - stream answer text and images
        const images = [
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
          'https://images.unsplash.com/photo-1516542076529-1ea3854896e1',
          'https://images.unsplash.com/photo-1519336555923-59661f41bb86',
          'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1',
        ];
        sendEvent({ type: 'partial', message: 'generate_start', tabs: { images } as any });
        const answerChunks = [
          "Here's a tailored multi-channel campaign plan.",
          " It targets recent cart abandoners with timely nudges.",
          " Channels include Email, SMS, and WhatsApp.",
          " Messages emphasize urgency and value, with a weekend offer.",
        ];
        let answerSoFar = '';
        for (const chunk of answerChunks) {
          answerSoFar += chunk;
          sendEvent({ type: 'partial', message: 'generate_progress', tabs: { answer: answerSoFar } as any });
          await new Promise(resolve => setTimeout(resolve, 120));
        }

        // Step 1: Generate name
        await new Promise(resolve => setTimeout(resolve, 150));
        campaignData.campaign.name = query.toLowerCase().includes('flash') 
          ? "Weekend Flash Sale" 
          : "Holiday Collection Launch";
        sendEvent({ 
          type: 'partial', 
          field: 'name', 
          value: campaignData.campaign.name,
          data: { campaign: { name: campaignData.campaign.name } }
        });

        // Step 2: Generate audience
        await new Promise(resolve => setTimeout(resolve, 400));
        campaignData.campaign.audience = "Cart abandoners in last 7 days";
        sendEvent({ 
          type: 'partial', 
          field: 'audience', 
          value: campaignData.campaign.audience,
          data: { 
            campaign: { 
              name: campaignData.campaign.name,
              audience: campaignData.campaign.audience 
            } 
          }
        });

        // Step 3: Generate channels
        await new Promise(resolve => setTimeout(resolve, 120));
        campaignData.campaign.channels = ["Email", "SMS", "WhatsApp"];
        sendEvent({ 
          type: 'partial', 
          field: 'channels', 
          value: campaignData.campaign.channels,
          data: { 
            campaign: { 
              name: campaignData.campaign.name,
              audience: campaignData.campaign.audience,
              channels: campaignData.campaign.channels
            } 
          }
        });

        // Step 4: Generate message
        await new Promise(resolve => setTimeout(resolve, 180));
        campaignData.campaign.message = "Get 20% off before Sunday ends! Complete your purchase now.";
        sendEvent({ 
          type: 'partial', 
          field: 'message', 
          value: campaignData.campaign.message,
          data: { 
            campaign: { 
              name: campaignData.campaign.name,
              audience: campaignData.campaign.audience,
              channels: campaignData.campaign.channels,
              message: campaignData.campaign.message
            } 
          }
        });

        // Step 5: Generate timing and meta
        await new Promise(resolve => setTimeout(resolve, 300));
        campaignData.campaign.timing = "2025-09-28T10:00:00Z";
        campaignData.campaign.meta = {
          priority: "high" as "low" | "medium" | "high",
          experiment_id: `exp_${Date.now()}`,
          estimated_reach: 1200
        };

        sendEvent({ type: 'partial', message: 'tabs_update', tabs: { answer: answerSoFar } as any });
        sendEvent({ type: 'complete', data: campaignData });

        if (heartbeat) clearInterval(heartbeat);
        controller.close();
      };

      generateCampaign().catch(error => {
        sendEvent({ type: 'error', error: error.message });
        if (heartbeat) clearInterval(heartbeat);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      // Disable buffering on some proxies (nginx, Vercel)
      'X-Accel-Buffering': 'no',
    },
  });
}