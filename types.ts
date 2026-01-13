
export interface Scene {
  number: number;
  onScreenText: string;
  spokenDialogue: string;
  cameraAction: string;
}

export interface Hashtags {
  lowReach: string[];
  midReach: string[];
  highReach: string[];
}

export interface StrategyResult {
  viralHook: string;
  scenes: Scene[];
  caption: string;
  hashtags: Hashtags;
  cta: {
    soft: string;
    strong: string;
  };
}

export interface UserInputs {
  niche: string;
  targetAudience: string;
  duration: number;
  goal: string;
  tone: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube Shorts';
}

export interface AnalysisInputs {
  originalHook: string;
  niche: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube Shorts';
  targetAudience: string;
}

export interface AnalysisResult {
  viralityScore: number;
  whyItWorks: string[];
  whyItFails: string[];
  improvedHooks: {
    curiosity: string;
    emotional: string;
    controversial: string;
    dataDriven: string;
    storyDriven: string;
  };
  bestVersion: string;
  ctaSuggestion?: string;
}

export interface AudienceInputs {
  niche: string;
  sampleComments: string;
  sampleCaptions: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube Shorts';
}

export interface AudienceResult {
  coreProfile: {
    ageRange: string;
    genderSplit: string;
    locationAssumptions: string;
  };
  psychologicalTriggers: {
    painPoints: string[];
    desires: string[];
    objections: string[];
  };
  contentThatResonates: string[];
  buyingIntent: 'Low' | 'Medium' | 'High';
  scalingAngles: string[];
  engagementPhrases: string[];
}

export interface CommentInputs {
  commentText: string;
  creatorTone: string;
  context: string;
  responseStyle: 'friendly' | 'witty' | 'professional' | 'persuasive';
}

export interface CommentResult {
  commentType: 'fan' | 'question' | 'objection' | 'troll' | 'lead';
  sentiment: 'positive' | 'neutral' | 'negative';
  recommendedResponses: Array<{ label: string; text: string }>;
  followUp?: string;
}

export interface AIContentReview {
  confidence: 'Low' | 'Medium' | 'High';
  indicators: string[];
  promptQualityScore: number;
  creativeControlLevel: string;
  sceneConsistency: string;
  platformAlignment: string;
  strengths: string[];
  limitations: string[];
  risks: string[];
  opportunities: {
    refinements: string[];
    diversitySuggestions: string[];
    pacingImprovements: string[];
    humanizationStrategies: string[];
  };
  optimizedPrompt?: string;
  promptTips?: string[];
}

export interface VideoAuditInputs {
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'LinkedIn' | 'X' | 'Shorts';
  title: string;
  description?: string;
  transcript?: string;
  duration?: string;
  niche: string;
  targetAudience: string;
  visuals?: string;
  visualFrames?: string[]; 
  audioData?: string;
  optimizationMode: 'default' | 'spectacle';
  style?: string;
  isAiGenerated?: boolean;
}

export interface VideoAuditResult {
  overallPerformance: {
    rating: number;
    verdict: string;
  };
  performanceBreakdown: {
    hook: number;
    retention: number;
    engagement: number;
    platformFit: number;
    alignment: 'Strong' | 'Medium' | 'Weak';
  };
  pros: string[];
  cons: string[];
  retentionPrediction: {
    hookEvaluation: string;
    dropOffTimestamps: string[];
    disengagementReasons: string[];
    bingePotential: string;
  };
  fixMyVideo: {
    hookRewrite: string;
    structureChanges: string;
    titleVariations: string[];
    ctaOptimization: string;
    engagementPrompts: string[];
  };
  platformTips: {
    tactical: string[];
    mistakesToAvoid: string[];
  };
  prePostingPrediction: {
    expectedPerformance: 'Low' | 'Medium' | 'High';
    confidence: string;
    mostImpactfulChange: string;
  };
  repurposing: Array<{
    platform: string;
    adjustments: string;
  }>;
  spectacleMode?: {
    ideaClarity: number;
    stakesAssessment: string;
    escalationSuggestions: string[];
    boldChange: string;
  };
  growthAssessment: {
    ceiling: 'Low' | 'Medium' | 'High';
    nextTierRequirement: string;
    limitingFactor: 'Idea' | 'Execution' | 'Both';
  };
  visualAnalysis?: {
    lightingAndQuality: string;
    compositionScore: number;
    visualHookEffectiveness: string;
    aestheticFit: string;
  };
  aiContentReview?: AIContentReview;
}
