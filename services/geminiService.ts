
import { GoogleGenAI, Type } from "@google/genai";
import { ContactData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        "fullName": { "type": Type.STRING, description: "The full name of the person (e.g., 'Dr. Max Mustermann')." },
        "firstName": { "type": Type.STRING, description: "The first name." },
        "lastName": { "type": Type.STRING, description: "The last name." },
        "prefix": { "type": Type.STRING, description: "Any titles or prefixes (e.g., 'Dr.', 'Mr.')." },
        "organization": { "type": Type.STRING, description: "The company or organization name." },
        "title": { "type": Type.STRING, description: "The job title or position." },
        "address": { "type": Type.STRING, description: "The full work address as a single string (e.g., 'Street, City, Postal Code')." },
        "workPhone": { "type": Type.STRING, description: "The primary work phone number." },
        "mobilePhone": { "type": Type.STRING, description: "The mobile phone number." },
        "email": { "type": Type.STRING, description: "The email address." },
        "website": { "type": Type.STRING, description: "The company or personal website URL." }
    },
    required: ["fullName", "firstName", "lastName", "email"]
};


export const parseSignatureWithGemini = async (signatureText: string): Promise<ContactData> => {
    try {
        const prompt = `Extract contact details from the following email signature. Return the data as a JSON object matching the provided schema. If a field is not found, leave its value as an empty string. Be accurate.

Email Signature:
\`\`\`
${signatureText}
\`\`\``;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const extractedData = JSON.parse(jsonString);

        // Ensure all keys are present, even if empty, to match the ContactData interface
        const fullContactData: ContactData = {
            fullName: extractedData.fullName || '',
            firstName: extractedData.firstName || '',
            lastName: extractedData.lastName || '',
            prefix: extractedData.prefix || '',
            organization: extractedData.organization || '',
            title: extractedData.title || '',
            address: extractedData.address || '',
            workPhone: extractedData.workPhone || '',
            mobilePhone: extractedData.mobilePhone || '',
            email: extractedData.email || '',
            website: extractedData.website || '',
        };

        return fullContactData;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to parse signature with AI. Please check the console for details.");
    }
};
