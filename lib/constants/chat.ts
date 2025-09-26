// Chat-related constants and configurations
export const CHAT_CONFIG = {
  MAX_FILES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  LARGE_TEXT_THRESHOLD: {
    WORDS: 400,
    LINES: 5,
  },
  TEXTAREA: {
    MIN_HEIGHT: 64,
    MIN_HEIGHT_MD: 80,
    MAX_HEIGHT: 160,
  },
  DELAYS: {
    BEFORE_ASSISTANT_REPLY: 400,
    BEFORE_STEPS: 500,
    AUTO_TITLE: 1000,
  },
} as const;

// Dynamic response templates for varied streaming
export const RESPONSE_TEMPLATES = [
  {
    initial: "I'll help you create a comprehensive marketing campaign. Let me analyze your requirements and generate the perfect strategy.",
    steps: [
      { title: "Understanding Requirements", description: "Analyzing your campaign goals and target audience" },
      { title: "Market Research", description: "Gathering insights from connected data sources" },
      { title: "Strategy Generation", description: "Creating personalized campaign recommendations" },
    ],
  },
  {
    initial: "Great! I'll design a multi-channel campaign tailored to your needs. Let me process your request and build something amazing.",
    steps: [
      { title: "Audience Analysis", description: "Identifying your ideal customer segments" },
      { title: "Channel Optimization", description: "Selecting the best marketing channels for your goals" },
      { title: "Content Creation", description: "Generating compelling messages and creative assets" },
    ],
  },
  {
    initial: "Perfect! I'll orchestrate a data-driven campaign that maximizes your reach and engagement. Starting the analysis now.",
    steps: [
      { title: "Data Processing", description: "Analyzing customer behavior and preferences" },
      { title: "Segmentation", description: "Creating targeted audience groups" },
      { title: "Campaign Assembly", description: "Building your complete marketing strategy" },
    ],
  },
  {
    initial: "Excellent request! I'll craft a sophisticated campaign strategy using AI-powered insights. Let me get started.",
    steps: [
      { title: "Intent Recognition", description: "Understanding your marketing objectives" },
      { title: "Competitive Analysis", description: "Researching market opportunities" },
      { title: "Solution Design", description: "Developing your custom campaign blueprint" },
    ],
  },
] as const;

// Lorem ipsum variations for dynamic content streaming
export const LOREM_VARIATIONS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.",
  "Explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  "Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
] as const;

// Campaign response chunks for varied streaming
export const CAMPAIGN_RESPONSE_CHUNKS = [
  [
    "I'm analyzing your target audience and market positioning to create the most effective campaign strategy. ",
    "Based on your requirements, I'll design a multi-channel approach that maximizes engagement across email, social media, and direct marketing. ",
    "The campaign will include personalized messaging, optimal timing recommendations, and performance tracking metrics. ",
    "Let me finalize the configuration with detailed audience segments and creative recommendations."
  ],
  [
    "Creating a comprehensive marketing strategy tailored to your specific goals and audience demographics. ",
    "I'm incorporating advanced segmentation techniques and behavioral targeting to ensure maximum campaign effectiveness. ",
    "The strategy includes cross-platform coordination, A/B testing frameworks, and real-time optimization capabilities. ",
    "Finalizing the campaign blueprint with detailed execution timelines and success metrics."
  ],
  [
    "Developing an intelligent campaign orchestration that leverages your connected data sources for precision targeting. ",
    "The system is analyzing customer journey patterns and engagement preferences to optimize message delivery timing. ",
    "I'm building automated workflows that adapt based on real-time performance data and audience responses. ",
    "Completing the campaign configuration with advanced analytics and conversion tracking setup."
  ],
  [
    "Crafting a data-driven marketing campaign that combines creativity with analytical precision for optimal results. ",
    "The strategy incorporates predictive modeling to identify high-value prospects and optimize budget allocation. ",
    "I'm designing dynamic content variations that personalize the experience for different audience segments. ",
    "Putting the finishing touches on your comprehensive campaign strategy with detailed implementation guidelines."
  ],
] as const;

// File type configurations
export const FILE_CONFIG = {
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  SUPPORTED_TEXT_EXTENSIONS: ['.txt', '.md', '.csv', '.json', '.log'] as const,
  DEFAULT_ATTACHMENT_NAME: 'pasted-text.txt',
} as const;

// UI Messages
export const UI_MESSAGES = {
  ERRORS: {
    MAX_FILES_EXCEEDED: (max: number) => `You can attach up to ${max} files`,
    FILE_TOO_LARGE: (filename: string) => `${filename} is larger than 10MB`,
    COPY_FAILED: 'Failed to copy',
    PASTE_FAILED: 'Failed to attach pasted text',
  },
  SUCCESS: {
    COPIED: 'Copied to clipboard',
    LARGE_TEXT_ATTACHED: 'Large text attached as file',
    THUMBS_UP: 'Thanks for the thumbs up!',
    THUMBS_DOWN: 'Thanks for the feedback!',
    FEEDBACK_REMOVED: 'Removed feedback',
  },
  PLACEHOLDERS: {
    CHAT_INPUT: 'Ask me to create a campaign, analyze your audience, or optimize your marketing strategy...',
    CONVERSATION_TITLE: 'Untitled chat',
  },
} as const;

// Helper function to get random response template
export const getRandomResponseTemplate = () => {
  const randomIndex = Math.floor(Math.random() * RESPONSE_TEMPLATES.length);
  return RESPONSE_TEMPLATES[randomIndex];
};

// Helper function to get random campaign chunks
export const getRandomCampaignChunks = () => {
  const randomIndex = Math.floor(Math.random() * CAMPAIGN_RESPONSE_CHUNKS.length);
  return CAMPAIGN_RESPONSE_CHUNKS[randomIndex];
};

// Concluding remarks for streaming after JSON
export const CONCLUDING_REMARKS_CHUNKS = [
  [
    "This campaign is now fully configured and ready for your review. ",
    "I've optimized the audience targeting and channel mix based on the latest data. ",
    "You can adjust any of the parameters in the campaign builder before launching. ",
    "Let me know if you'd like to proceed or if you have any further refinements in mind. Good luck!",
  ],
  [
    "The campaign strategy has been generated successfully. ",
    "The provided JSON contains all the necessary details for execution. ",
    "I recommend reviewing the message copy and audience segments closely. ",
    "Feel free to ask for any modifications or alternative suggestions. Ready when you are!",
  ],
  [
    "Your new campaign blueprint is complete. ",
    "I've included a mix of high-impact channels and personalized messaging to maximize ROI. ",
    "Please verify the timing and budget allocation before activation. ",
    "I'm here to assist with any further adjustments or to start a new campaign from scratch.",
  ],
] as const;

// Helper function to get random lorem text
export const getRandomLoremText = (count: number = 1) => {
  const shuffled = [...LOREM_VARIATIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(' ');
};

// Helper function to get random concluding remarks
export const getRandomConcludingRemarks = () => {
  const randomIndex = Math.floor(Math.random() * CONCLUDING_REMARKS_CHUNKS.length);
  return CONCLUDING_REMARKS_CHUNKS[randomIndex];
};
