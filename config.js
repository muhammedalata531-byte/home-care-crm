export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // If environment variable is configured in Vercel Dashboard
  const envKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

  return res.status(200).json({
    apiKey: envKey,
    model: 'auto',
    speechLanguage: 'ar-SA',
    platform: 'vercel'
  });
}
