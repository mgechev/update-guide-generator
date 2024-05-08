import { GoogleGenerativeAI } from "@google/generative-ai";

export const formatBreakingChanges = async (changes, version) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
      For each breaking change, output an element in a JSON array. Each element in the array should have the following properties:
      - "possibleIn" with value ${version}
      - "necessaryAsOf" with value ${version}
      - "level" which could be "ApplicationComplexity.Basic", "ApplicationComplexity.Medium", or "ApplicationComplexity.Advanced" based on how common you think this change is
      - "step" with value 5 word summary of the change prefixed with ${version}. It should be a unique value
      - "action" which contains an instruction explaining how a developer should update their application in response to this breaking change
      - "original" which contains the original breaking change message
  
      Here is the list with each breaking change separated by the "##########" marker and newlines:
  
      ${changes.join("\n##########\n")}
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonOutput = response.text().replace('```json', '').replace('```', '');

  return JSON.parse(jsonOutput);
};
