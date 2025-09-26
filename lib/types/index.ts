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
export type StreamBlockType = "init" | "para" | "artifact_start" | "artifact_chunk" | "artifact_end" | "sum" | "sugg" | "conclusion";

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
  feedback?: 'up' | 'down' | null;
  suggestions?: string[];
  summary?: string;
  // Streamed, ordered render blocks for fine-grained UI composition
  blocks?: RenderBlock[];
  uiComponent?: {
    type: 'campaign_configurator';
    data: unknown;
    title?: string;
    description?: string;
  };
}

export type RenderBlock =
  | { kind: 'para'; content: string }
  | { kind: 'artifact_indicator'; title?: string; description?: string }
  | { kind: 'summary'; content: string }
  | { kind: 'suggestions'; suggestions: string[] }
  | { kind: 'conclusion'; content: string };

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
  block?: StreamBlockType;
  content?: string;
  artifact?: unknown;
  suggestions?: string[];
};
export interface StatCard {
  label: string;
  value: string | number;
  delta: string;
  trend: "up" | "down" | "neutral";
}

export interface TimeSeriesData {
  name: string;
  reach: number;
  impressions: number;
  engagement: number;
}

export interface ChannelPerformance {
  channel: string;
  clicks: number;
  conversions: number;
}

export interface CampaignRow {
  name: string;
  reach: number;
  ctr: string;
  conv: string;
  revenue: string;
}

export interface ConversionRow {
  id: string;
  channel: string;
  value: string;
  time: string;
}

export interface AudienceShare {
  name: string;
  value: number;
}

export interface RadarData {
  metric: string;
  A: number;
  fullMark: number;
}

export interface SourcePerformance {
  source: string;
  users: number;
  conv: string;
  aov: string;
}

export interface AudienceSegmentSummary {
  segment: string;
  size: number;
  growth: string;
}

export interface Anomaly {
  ts: string;
  issue: string;
  severity: "low" | "medium" | "high";
}
