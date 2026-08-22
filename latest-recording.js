export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  return res.status(200).json({
    success: false,
    message: 'الجلب التلقائي المباشر من مجلد MicroSIP على جهازك يعمل عبر الخادم المحلي (Localhost). على Vercel، يمكنك سحب وإفلات أو اختيار ملف التسجيل الصوتي مباشرة وسيقوم الذكاء الاصطناعي بتحليله فوراً!',
    platform: 'vercel'
  });
}
