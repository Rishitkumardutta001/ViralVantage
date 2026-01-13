
import { GoogleGenAI, Type } from "@google/genai";
import { 
  UserInputs, StrategyResult, AnalysisInputs, AnalysisResult, 
  AudienceInputs, AudienceResult, CommentInputs, CommentResult,
  VideoAuditInputs, VideoAuditResult
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateViralStrategy = async (inputs: UserInputs): Promise<StrategyResult> => {
  const systemInstruction = `You are a world-class senior social media growth strategist and viral content expert specializing in short-form video.
  Your task is to generate high-performing content optimized for maximum watch time, retention, and conversion.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a viral content strategy: ${JSON.stringify(inputs)}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          viralHook: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.INTEGER },
                onScreenText: { type: Type.STRING },
                spokenDialogue: { type: Type.STRING },
                cameraAction: { type: Type.STRING }
              }
            }
          },
          caption: { type: Type.STRING },
          hashtags: {
            type: Type.OBJECT,
            properties: {
              lowReach: { type: Type.ARRAY, items: { type: Type.STRING } },
              midReach: { type: Type.ARRAY, items: { type: Type.STRING } },
              highReach: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          cta: {
            type: Type.OBJECT,
            properties: {
              soft: { type: Type.STRING },
              strong: { type: Type.STRING }
            }
          }
        }
      }
    }
  });
  const text = response.text || "";
  return JSON.parse(text.trim());
};

export const analyzeViralHook = async (inputs: AnalysisInputs): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit and optimize this hook: ${JSON.stringify(inputs)}`,
    config: {
      systemInstruction: "You are a viral content analyst. Reverse-engineer high-performing hooks.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          viralityScore: { type: Type.INTEGER },
          whyItWorks: { type: Type.ARRAY, items: { type: Type.STRING } },
          whyItFails: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvedHooks: {
            type: Type.OBJECT,
            properties: {
              curiosity: { type: Type.STRING },
              emotional: { type: Type.STRING },
              controversial: { type: Type.STRING },
              dataDriven: { type: Type.STRING },
              storyDriven: { type: Type.STRING }
            }
          },
          bestVersion: { type: Type.STRING },
          ctaSuggestion: { type: Type.STRING }
        }
      }
    }
  });
  const text = response.text || "";
  return JSON.parse(text.trim());
};

export const generateAudiencePersona = async (inputs: AudienceInputs): Promise<AudienceResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate audience persona: ${JSON.stringify(inputs)}`,
    config: {
      systemInstruction: "You are an audience intelligence expert.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coreProfile: {
            type: Type.OBJECT,
            properties: {
              ageRange: { type: Type.STRING },
              genderSplit: { type: Type.STRING },
              locationAssumptions: { type: Type.STRING }
            }
          },
          psychologicalTriggers: {
            type: Type.OBJECT,
            properties: {
              painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              desires: { type: Type.ARRAY, items: { type: Type.STRING } },
              objections: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          contentThatResonates: { type: Type.ARRAY, items: { type: Type.STRING } },
          buyingIntent: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          scalingAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
          engagementPhrases: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  const text = response.text || "";
  return JSON.parse(text.trim());
};

export const analyzeComment = async (inputs: CommentInputs): Promise<CommentResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze comment: ${JSON.stringify(inputs)}`,
    config: {
      systemInstruction: "You are a community growth manager.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commentType: { type: Type.STRING, enum: ['fan', 'question', 'objection', 'troll', 'lead'] },
          sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
          recommendedResponses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                text: { type: Type.STRING }
              }
            }
          },
          followUp: { type: Type.STRING }
        }
      }
    }
  });
  const text = response.text || "";
  return JSON.parse(text.trim());
};

export const auditVideoPerformance = async (inputs: VideoAuditInputs): Promise<VideoAuditResult> => {
  const systemInstruction = `You are an elite multi-platform video growth strategist.
  
  CONTEXT: The user has selected a specific "Architecture" for their video. 
  FORMAT STRATEGIES:
  - Vlog: Audit for personality density, transition speed, and narrative "open loops".
  - Talking Head: Audit for authority, clarity of message, and visual pattern interrupts.
  - POV/Skit: Audit for relatability, character speed, and the "AHA" moment timing.
  - Aesthetic: Audit for visual hook effectiveness, color coherence, and audio-visual sync.
  - Tutorial: Audit for "Save-ability", complexity vs clarity, and rapid value delivery.
  - Podcast: Audit for clip selection (climax placement) and caption readability.
  - Gaming: Audit for high-action "heat maps", commentary synchronization, and gameplay climax timing.
  - Meme/Trend: Audit for trend-jack timing, subversion of expectation, and audio-template relevance.
  - Product Showcase: Audit for macro-lighting quality, problem-solution framing, and tactile features.

  ANALYSIS: You have high-density frames (15+) and full audio context. Use the audio to analyze pacing, tone, and sound quality.
  Provide actionable fixes based on the specific architecture: ${inputs.style}.`;

  const { visualFrames, audioData, ...textInputs } = inputs;
  const parts: any[] = [
    { text: `Audit this ${inputs.style} content: ${JSON.stringify(textInputs)}` }
  ];

  // Add Visual Frames
  if (visualFrames && visualFrames.length > 0) {
    parts.push(...visualFrames.map(data => ({
      inlineData: { data, mimeType: 'image/jpeg' }
    })));
  }

  // Add Audio Data (100% coverage)
  if (audioData) {
    parts.push({
      inlineData: { data: audioData, mimeType: 'audio/mp3' }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallPerformance: {
            type: Type.OBJECT,
            properties: {
              rating: { type: Type.INTEGER },
              verdict: { type: Type.STRING }
            },
            required: ['rating', 'verdict']
          },
          performanceBreakdown: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.INTEGER },
              retention: { type: Type.INTEGER },
              engagement: { type: Type.INTEGER },
              platformFit: { type: Type.INTEGER },
              alignment: { type: Type.STRING, enum: ['Strong', 'Medium', 'Weak'] }
            },
            required: ['hook', 'retention', 'engagement', 'platformFit', 'alignment']
          },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          retentionPrediction: {
            type: Type.OBJECT,
            properties: {
              hookEvaluation: { type: Type.STRING },
              dropOffTimestamps: { type: Type.ARRAY, items: { type: Type.STRING } },
              disengagementReasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              bingePotential: { type: Type.STRING }
            },
            required: ['hookEvaluation', 'dropOffTimestamps', 'disengagementReasons', 'bingePotential']
          },
          fixMyVideo: {
            type: Type.OBJECT,
            properties: {
              hookRewrite: { type: Type.STRING },
              structureChanges: { type: Type.STRING },
              titleVariations: { type: Type.ARRAY, items: { type: Type.STRING } },
              ctaOptimization: { type: Type.STRING },
              engagementPrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['hookRewrite', 'structureChanges', 'titleVariations', 'ctaOptimization', 'engagementPrompts']
          },
          platformTips: {
            type: Type.OBJECT,
            properties: {
              tactical: { type: Type.ARRAY, items: { type: Type.STRING } },
              mistakesToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['tactical', 'mistakesToAvoid']
          },
          prePostingPrediction: {
            type: Type.OBJECT,
            properties: {
              expectedPerformance: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              confidence: { type: Type.STRING },
              mostImpactfulChange: { type: Type.STRING }
            },
            required: ['expectedPerformance', 'confidence', 'mostImpactfulChange']
          },
          repurposing: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                adjustments: { type: Type.STRING }
              }
            }
          },
          spectacleMode: {
            type: Type.OBJECT,
            properties: {
              ideaClarity: { type: Type.INTEGER },
              stakesAssessment: { type: Type.STRING },
              escalationSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              boldChange: { type: Type.STRING }
            }
          },
          growthAssessment: {
            type: Type.OBJECT,
            properties: {
              ceiling: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              nextTierRequirement: { type: Type.STRING },
              limitingFactor: { type: Type.STRING, enum: ['Idea', 'Execution', 'Both'] }
            },
            required: ['ceiling', 'nextTierRequirement', 'limitingFactor']
          },
          visualAnalysis: {
            type: Type.OBJECT,
            properties: {
              lightingAndQuality: { type: Type.STRING },
              compositionScore: { type: Type.INTEGER },
              visualHookEffectiveness: { type: Type.STRING },
              aestheticFit: { type: Type.STRING }
            }
          }
        }
      }
    }
  });
  const text = response.text || "";
  return JSON.parse(text.trim());
};
