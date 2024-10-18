import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const getSchema = (version) => ({
  description: "List of recipes",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      possibleIn: {
        type: SchemaType.STRING,
        description: `Version in which this breaking change is possible with value ${version}`,
        nullable: false,
      },
      necessaryAsOf: {
        type: SchemaType.STRING,
        description: `Version in which this breaking change is necessary with value ${version}`,
        nullable: false,
      },
      level: {
        type: SchemaType.STRING,
        description:
          "Estimate how common would that update be. The value could be 'ApplicationComplexity.Basic', 'ApplicationComplexity.Medium', or 'ApplicationComplexity.Advanced' based on how common you think this breaking change is",
        nullable: false,
      },
      step: {
        type: SchemaType.STRING,
        description: `Unique identifier of the step that's a summary of the breaking change and should be prefixed with ${version}`,
        nullable: false,
      },
      action: {
        type: SchemaType.STRING,
        description:
          "Instruction explaining how a developer should update their application in response to this breaking change. This string should rephrase the breaking change message as actionable steps for the developer",
        nullable: false,
      },
      original: {
        type: SchemaType.STRING,
        description: "Original breaking change message",
        nullable: false,
      },
    },
    required: [
      "possibleIn",
      "necessaryAsOf",
      "level",
      "step",
      "action",
      "original",
    ],
  },
});

export const formatBreakingChanges = async (changes, version) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-advanced",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: getSchema(version)
    },
  });

  const prompt = `
      List with each breaking change separated by the "##########" marker and newlines:
  
      ${changes.join("\n##########\n")}
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jsonOutput = response.text();

  return JSON.parse(jsonOutput);
};
