// First API call with reasoning
export const getBriefAdmin = async (metrics: any) => {
  let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        {
          role: "user",
          content: `
            You are an expert data analyst for a student housing platform.
            We connect students with off-campus accommodation.
            Analyze the following dashboard metrics and provide a concise, 2-sentence executive summary and 1 strategic recommendation.
            
            Metrics:
            ${JSON.stringify(metrics, null, 2)}
            
            Output format:
            Summary: [Your summary]
            Start a New Paragraph. Skip 2 lines
            Action: [Your recommendation]`,
        },
      ],
      reasoning: { enabled: false },
    }),
  });
  // Extract the assistant message with reasoning_details and save it to the response variable
  const result = await response.json();
  const responseContent = result.choices[0].message
    .contentresponseContent as string;

  return responseContent;
};
