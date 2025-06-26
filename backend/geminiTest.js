// geminiTest.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace with your actual API key
const API_KEY = "AIzaSyB9yGPE8sH4FKk3aRBsbTbHpJW2uENYk5o";

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      "Give me a random anime recommendation."
    );
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini response:\n", text);
  } catch (error) {
    console.error("❌ Gemini test failed:\n", error);
  }
}

testGemini();
