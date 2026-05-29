export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { txid } = req.query;
  if (!txid) return res.status(400).json({ error: 'txid required' });
  
  try {
    // Consulta status direto na API do Nexuspag
    const response = await fetch(`https://nexuspag.com/api/pix/${txid}`, {
      headers: {
        'x-api-key': process.env.NEXUSPAG_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    const status = data?.transaction?.status || data?.status;
    const paid = status === 'paid' || status === 'completed' || status === 'approved';
    
    return res.status(200).json({ paid, status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
