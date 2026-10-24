// Open  https://YOUR-SITE.netlify.app/.netlify/functions/health  to check the setup. It never shows secret values.
exports.handler = async () => {
  const e = process.env;
  let fb = 'MISSING - add FIREBASE_SERVICE_ACCOUNT in Netlify variables';
  if (e.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const j = JSON.parse(e.FIREBASE_SERVICE_ACCOUNT);
      fb = j.project_id && j.private_key && j.client_email ? 'OK (project: ' + j.project_id + ')' : 'JSON found but incomplete - paste the whole .json file text';
    } catch (x) { fb = 'NOT valid JSON - open the .json file, select ALL text, copy and paste it again'; }
  }
  let adminLoad = 'OK';
  try { require('firebase-admin'); } catch (x) { adminLoad = 'FAILED to load: ' + x.message; }
  const out = {
    functionsWorking: true,
    nodeVersion: process.version,
    fetchAvailable: typeof fetch === 'function',
    firebaseAdmin: adminLoad,
    FIREBASE_SERVICE_ACCOUNT: fb,
    TELEGRAM_BOT_TOKEN: e.TELEGRAM_BOT_TOKEN ? 'set' : 'MISSING',
    TELEGRAM_CHAT_ID: e.TELEGRAM_CHAT_ID ? 'set' : 'MISSING',
    RAZORPAY_KEY_ID: e.RAZORPAY_KEY_ID ? 'set' : 'not set (fine for now)',
    RAZORPAY_KEY_SECRET: e.RAZORPAY_KEY_SECRET ? 'set' : 'not set (fine for now)',
  };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(out, null, 2) };
};
