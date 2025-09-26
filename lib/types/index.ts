// Centralized application types

// Redux store helper types
export type { RootState, AppDispatch } from "../store";

// Domain types
export interface AudienceSegment {
  id: string;
  name: string;
  filters: {
    geography?: string[];
    pastPurchases?: string[];
    websiteVisits?: string[];
    demographics?: string[];
  };
  estimatedSize: number;
}

export interface CampaignMeta {
  priority: "low" | "medium" | "high";
  experiment_id: string;
  estimated_reach: number;
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  target?: string;
  channels: string[];
  message: string;
  timing: string;
  meta: CampaignMeta;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "enterprise";
}

export type MessageType = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: number;
  streaming?: boolean;
  jsonData?: unknown;
}

export type StepStatus = "pending" | "running" | "completed" | "error";

export interface Step<T = unknown> {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  progress: number;
  result?: T;
  error?: string;
}

export interface StepExecution {
  id: string;
  messageId: string;
  steps: Step[];
  currentStepIndex: number;
  isRunning: boolean;
}

export type DataSourceType = "shopify" | "analytics" | "facebook" | "email" | "sms";
export type ConnectionStatus = "connected" | "pending" | "disconnected" | "error";

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: ConnectionStatus;
  lastSync?: number;
  icon: string;
}

// Streaming event types for campaign generation
export type StreamEventType = "start" | "partial" | "complete" | "error";

export interface CampaignGenerationData {
  campaign: Partial<Campaign>;
}

export interface StreamEvent {
  type: StreamEventType;
  field?: keyof Campaign;
  value?: unknown;
  data?: CampaignGenerationData;
  message?: string;
  error?: string;
}

// Perplexity-like tabs
export interface SourceLink {
  title: string;
  url: string;
  source?: string;
}

export interface ThoughtItem {
  text: string;
  ts: number;
}

export interface TabsData {
  answer?: string;
  images?: string[];
  sources?: SourceLink[];
  thoughts?: ThoughtItem[];
}

export type PhaseEventType =
  | 'thinking_start'
  | 'thinking_tick'
  | 'thinking_complete'
  | 'analyze_start'
  | 'analyze_progress'
  | 'analyze_complete'
  | 'generate_start'
  | 'generate_progress'
  | 'generate_complete'
  | 'tabs_update';

export type ExtendedStreamEvent = StreamEvent & {
  phase?: PhaseEventType;
  tabs?: TabsData;
};
