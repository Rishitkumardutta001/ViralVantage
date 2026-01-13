
import { GoogleGenAI, Type } from "@google/genai";
import { 
  UserInputs, StrategyResult, AnalysisInputs, AnalysisResult, 
  AudienceInputs, AudienceResult, CommentInputs, CommentResult,
  VideoAuditInputs, VideoAuditResult
} from "../types";

// Helper to safely get the API key from the environment
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

export const generateViralStrategy = async (inputs: UserInputs): Promise<StrategyResult> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
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
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
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
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
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
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
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
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const systemInstruction = `You are an elite multi-platform video growth strategist and AI content quality analyst.
  
  TASK 1: GENERAL PERFORMANCE AUDIT
  Analyze based on platform architecture (${inputs.style}).
  
  TASK 2: AI CONTENT REVIEW (USER-IDENTIFIED: ${inputs.isAiGenerated ? 'YES' : 'NO'})
  If the user has identified the content as AI-generated, you MUST activate the "aiContentReview" module.
  Focus on:
  - Prompt Quality Assessment (0-10)
  - Scene consistency & Platform-native behavior
  - AI Strengths (value add) and Risks (generic phrasing/over-polished)
  - Opportunities for humanization and visual diversity.
  - Interactive Action: Provide an optimized prompt AND writing tips.

  AI should be treated as a creative partner. Keep scoring logic for general audit separate.`;

  const { visualFrames, audioData, ...textInputs } = inputs;
  const parts: any[] = [
    { text: `Audit this content: ${JSON.stringify(textInputs)}` }
  ];

  if (visualFrames && visualFrames.length > 0) {
    parts.push(...visualFrames.map(data => ({
      inlineData: { data, mimeType: 'image/jpeg' }
    })));
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
            }
          },
          fixMyVideo: {
            type: Type.OBJECT,
            properties: {
              hookRewrite: { type: Type.STRING },
              structureChanges: { type: Type.STRING },
              titleVariations: { type: Type.ARRAY, items: { type: Type.STRING } },
              ctaOptimization: { type: Type.STRING },
              engagementPrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          platformTips: {
            type: Type.OBJECT,
            properties: {
              tactical: { type: Type.ARRAY, items: { type: Type.STRING } },
              mistakesToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          prePostingPrediction: {
            type: Type.OBJECT,
            properties: {
              expectedPerformance: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              confidence: { type: Type.STRING },
              mostImpactfulChange: { type: Type.STRING }
            }
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
          growthAssessment: {
            type: Type.OBJECT,
            properties: {
              ceiling: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              nextTierRequirement: { type: Type.STRING },
              limitingFactor: { type: Type.STRING, enum: ['Idea', 'Execution', 'Both'] }
            }
          },
          aiContentReview: {
            type: Type.OBJECT,
            properties: {
              confidence: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
              promptQualityScore: { type: Type.INTEGER },
              creativeControlLevel: { type: Type.STRING },
              sceneConsistency: { type: Type.STRING },
              platformAlignment: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: {
                type: Type.OBJECT,
                properties: {
                  refinements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  diversitySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pacingImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  humanizationStrategies: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              optimizedPrompt: { type: Type.STRING },
              promptTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        required: ['overallPerformance', 'performanceBreakdown', 'fixMyVideo', 'prePostingPrediction']
      }
    }
  });
  const text = response.text || "";
  return JSON.parse(text.trim());
};
