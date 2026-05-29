const payments = {};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const body = req.body;
    // Nexuspag envia o id da transacao e status
    const txid = body?.transaction?.id || body?.id;
    const status = body?.transaction?.status || body?.status;
    
    if (txid && (status === 'paid' || status === 'completed' || status === 'approved')) {
      // Salva no storage global da Vercel (KV seria melhor mas usamos memoria por ora)
      global.paidTransactions = global.paidTransactions || {};
      global.paidTransactions[txid] = true;
    }
    
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
