export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  return res.status(200).json({
    isMicroSipRunning: false,
    platform: 'vercel',
    message: 'سيرفر سحابي (Vercel) - متاح رفع الملفات الصوتية يدوياً ومباشرة.'
  });
}
