import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        const chunk = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
        controller.enqueue(chunk);
      };

      // Send initial response
      sendEvent({ type: 'start', message: 'Starting campaign generation...' });

      // Simulate progressive JSON generation
      const generateCampaign = async () => {
        const campaignData = {
          campaign: {
            id: `campaign_${Date.now()}`,
            name: "",
            audience: "",
            channels: [] as string[],
            message: "",
            timing: "",
            meta: {
              priority: "medium" as "low" | "medium" | "high",
              experiment_id: "",
              estimated_reach: 0
            }
          }
        };

        // Step 1: Generate name
        await new Promise(resolve => setTimeout(resolve, 500));
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
        await new Promise(resolve => setTimeout(resolve, 300));
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
        await new Promise(resolve => setTimeout(resolve, 600));
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

        // Send complete campaign
        sendEvent({ 
          type: 'complete', 
          data: campaignData
        });

        controller.close();
      };

      generateCampaign().catch(error => {
        sendEvent({ type: 'error', error: error.message });
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}