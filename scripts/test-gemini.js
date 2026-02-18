
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyApsZqaP0v4is9VjE57QFYzeY9hUsO_LlY";

async function testKey() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // List models
        // Note: listModels is not directly on genAI, but we can try to use the model to list or just try a different known model. 
        // Actually, let's try 'gemini-pro' which is the most standard one.
        // OR better, let's try to simulate a list if possible, but the SDK structure is specific.
        // Let's just try 'gemini-1.5-flash-001' which is a specific version.
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "Explain how AI works in one sentence.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success with gemini-1.5-flash-001! Output:", text);
    } catch (error) {
        console.error("Error with gemini-1.5-flash-001:", error);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Test");
            console.log("Success with gemini-pro!");
        } catch (e) {
            console.error("Error with gemini-pro:", e);
        }
    }
}

testKey();
