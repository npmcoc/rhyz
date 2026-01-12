// Server-side API route: fetch player data
const { fetchPlayer } = require('../../lib/coc')

export default async function handler(req, res) {
  const { tag } = req.query
  if (!tag) return res.status(400).json({ error: 'tag is required' })  
  // Add cache control headers
  res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=10');
    try {
    const player = await fetchPlayer(tag)
    res.status(200).json(player)
  } catch (err) {
    console.error('Player API Error:', err.message)
    if (err.code === 'UND_ERR_ABORTED' || err.message.includes('aborted')) {
      return res.status(504).json({ error: 'Request timeout - API took too long to respond' })
    }
    res.status(500).json({ error: 'Failed to fetch player data' })
  }
}
