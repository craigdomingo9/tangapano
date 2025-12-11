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
