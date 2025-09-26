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
        const deepthink = (query ?? "").toLowerCase().includes('[deepthink]');

        const channelPool = ["Email", "SMS", "WhatsApp", "Push", "Ads", "In-App", "Messenger"]; 
        const randomChannels = () => channelPool.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 2));
        const randomPriority = (): "low" | "medium" | "high" => (Math.random() < 0.33 ? "low" : Math.random() < 0.66 ? "medium" : "high");
        const randomReach = () => 600 + Math.floor(Math.random() * 5000);
        const randomTiming = () => new Date(Date.now() + (24 + Math.floor(Math.random() * 72)) * 60 * 60 * 1000).toISOString();

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
          const thoughtText = i % 2 === 0
            ? `Clarifying goal based on query: "${query}"`
            : 'Mapping channels and audience for best reach';
          sendEvent({ type: 'partial', message: 'thinking_tick', tabs: { thoughts: [{ text: thoughtText, ts: Date.now() }] } as any });
        }

        // Phase 1: Analyze - produce sources (placeholders)
        const sources = (
          deepthink
            ? [
                { title: 'Facebook Ads Best Practices', url: 'https://example.com/fb-ads', source: 'facebook' },
                { title: 'Email Engagement Benchmarks', url: 'https://example.com/email-benchmarks', source: 'email' },
                { title: 'Ecommerce Cart Recovery', url: 'https://example.com/cart-recovery', source: 'blog' },
                { title: 'Behavioral Segmentation 101', url: 'https://example.com/behavioral-segmentation', source: 'blog' },
                { title: 'WhatsApp Engagement Trends', url: 'https://example.com/wa-trends', source: 'report' },
              ]
            : [
                { title: 'Facebook Ads Best Practices', url: 'https://example.com/fb-ads', source: 'facebook' },
                { title: 'Email Engagement Benchmarks', url: 'https://example.com/email-benchmarks', source: 'email' },
                { title: 'Ecommerce Cart Recovery', url: 'https://example.com/cart-recovery', source: 'blog' },
              ]
        );
        sendEvent({ type: 'partial', message: 'analyze_start', tabs: { sources } as any });
        await new Promise(resolve => setTimeout(resolve, 150));

        // Phase 2: Generate - stream answer text and images
        const imgSeed = Math.floor(Math.random() * 10000);
        const images = Array.from({ length: deepthink ? 6 : 4 }).map((_, i) => `https://picsum.photos/seed/${imgSeed + i}/800/450`);
        sendEvent({ type: 'partial', message: 'generate_start', tabs: { images } as any });
        const answerChunks = (
          deepthink
            ? [
                "Here’s a deeply reasoned multi-channel campaign plan crafted for your objectives.",
                " It integrates behavioral triggers, audience recency, and cross-channel sequencing.",
                " We’ll orchestrate Email, SMS, and WhatsApp with staggered timings and adaptive copy.",
                " Personalization leverages abandonment context and prior engagement intensity.",
                " Finally, we’ll monitor micro-conversions and dynamically allocate reach.",
              ]
            : [
                "Here's a tailored multi-channel campaign plan.",
                " It targets recent cart abandoners with timely nudges.",
                " Channels include Email, SMS, and WhatsApp.",
                " Messages emphasize urgency and value, with a weekend offer.",
              ]
        );
        let answerSoFar = '';
        for (const chunk of answerChunks) {
          answerSoFar += chunk;
          sendEvent({ type: 'partial', message: 'generate_progress', tabs: { answer: answerSoFar } as any });
          await new Promise(resolve => setTimeout(resolve, 120));
        }

        // Step 1: Generate name
        await new Promise(resolve => setTimeout(resolve, 150));
        const namePool = ["Weekend Flash Sale", "Holiday Collection Launch", "VIP Loyalty Event", "Back-to-Stock Drive", "Cart Recovery Sprint"];
        campaignData.campaign.name = namePool[Math.floor(Math.random() * namePool.length)];
        sendEvent({
          type: 'partial',
          field: 'name',
          value: campaignData.campaign.name,
          data: { campaign: { name: campaignData.campaign.name } },
        });

        // Step 2: Generate audience
        await new Promise(resolve => setTimeout(resolve, 150));
        const audiences = [
          "High LTV Prospects",
          "Dormant purchasers (90 days)",
          "New subscribers in last 14 days",
        ];
        campaignData.campaign.audience = deepthink ? audiences.sort(() => Math.random() - 0.5)[Math.floor(Math.random() * 4)] : audiences[Math.floor(Math.random() * 4)];
        sendEvent({
          type: 'partial',
          field: 'audience',
          value: campaignData.campaign.audience,
          data: {
            campaign: {
              name: campaignData.campaign.name,
              audience: campaignData.campaign.audience,
            },
          },
        });

        // Step 2.5: Generate target (who the campaign is for)
        await new Promise(resolve => setTimeout(resolve, 100));
        const targets = [
          'Returning website visitors',
          'High intent mobile users',
          'Email subscribers with 2+ opens',
          'Recent social engagers',
        ];
        campaignData.campaign.target = targets[Math.floor(Math.random() * targets.length)];
        sendEvent({
          type: 'partial',
          field: 'target',
          value: campaignData.campaign.target,
          data: {
            campaign: {
              target: campaignData.campaign.target,
            },
          },
        });

        // Step 3: Generate channels
        await new Promise(resolve => setTimeout(resolve, 120));
        campaignData.campaign.channels = randomChannels();
        sendEvent({
          type: 'partial',
          field: 'channels',
          value: campaignData.campaign.channels,
          data: {
            campaign: {
              name: campaignData.campaign.name,
              audience: campaignData.campaign.audience,
              channels: campaignData.campaign.channels,
            },
          },
        });

        // Step 4: Generate message
        await new Promise(resolve => setTimeout(resolve, 180));
        const msgPool = [
          "Get 20% off before Sunday ends! Complete your purchase now.",
          "Back for a reason? Pick up where you left off with a special perk.",
          "We saved your cart—unlock your exclusive discount now.",
          "Limited-time relaunch: finalize your order and enjoy free shipping.",
        ];
        campaignData.campaign.message = msgPool[Math.floor(Math.random() * msgPool.length)];
        sendEvent({
          type: 'partial',
          field: 'message',
          value: campaignData.campaign.message,
          data: {
            campaign: {
              name: campaignData.campaign.name,
              audience: campaignData.campaign.audience,
              channels: campaignData.campaign.channels,
              message: campaignData.campaign.message,
            },
          },
        });

        // Step 5: Generate timing and meta
        await new Promise(resolve => setTimeout(resolve, 120));
        campaignData.campaign.timing = randomTiming();
        campaignData.campaign.meta = {
          priority: randomPriority(),
          experiment_id: `exp_${Date.now()}`,
          estimated_reach: randomReach(),
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