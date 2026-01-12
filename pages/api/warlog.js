// Server-side API route: proxies war log data
const { fetchWarLog } = require('../../lib/coc')

export default async function handler(req, res) {
  const { tag } = req.query
  if (!tag) return res.status(400).json({ error: 'tag is required' })
  try {
    const warLog = await fetchWarLog(tag)
    res.status(200).json(warLog)
  } catch (err) {
    console.error('War Log API Error:', err.message)
    if (err.code === 'UND_ERR_ABORTED' || err.message.includes('aborted')) {
      return res.status(504).json({ error: 'Request timeout - API took too long to respond' })
    }
    res.status(500).json({ error: 'Failed to fetch war log' })
  }
}
