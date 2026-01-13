import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

const API_KEY_REF =
  "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";

export const getBriefAdmin = async (metrics: any) => {
  const openrouter = createOpenRouter({
    apiKey: API_KEY_REF,
  });

  const response = streamText({
    model: openrouter("openai/gpt-oss-20b:free"),
    prompt: `
      You are an expert data analyst for a student housing platform.
      We connect students with off-campus accommodation.
      Analyze the following dashboard metrics and provide a concise, 2-sentence executive summary and 1 strategic recommendation.
      
      Metrics:
      ${JSON.stringify(metrics, null, 2)}
      
      Output format:
      Summary: [Your summary]
      Start a New Paragraph. Skip 2 lines
      Action: [Your recommendation]`,
  });

  await response.consumeStream();
  return response.text;
};
