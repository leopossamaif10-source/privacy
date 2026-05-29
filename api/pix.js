export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { amount, description } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount required' });
  try {
    const response = await fetch('https://nexuspag.com/api/pix/create', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NEXUSPAG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: parseFloat(amount), description: description || 'Assinatura Larih Melo', expiration: 1800 }),
    });
    const data = await response.json();
    if (data.success && data.transaction) {
      return res.status(200).json({
        pix_code: data.transaction.pix_copia_cola,
        qr_code_base64: data.transaction.qr_code_base64,
      });
    }
    return res.status(400).json({ error: 'Falha', details: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
