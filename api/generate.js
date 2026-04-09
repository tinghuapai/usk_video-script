// api/generate.js
const { VertexAI } = require('@google-cloud/vertexai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    const vertexAI = new VertexAI({
      project: credentials.project_id,
      location: 'us-central1',
      googleAuthOptions: { credentials }
    });

    const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates[0].content.parts[0].text;

    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
