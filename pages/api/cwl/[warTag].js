// Server-side API route: fetch specific CWL war data
const { fetchCWLWar } = require('../../../lib/coc')

export default async function handler(req, res) {
  const { warTag } = req.query
  if (!warTag) return res.status(400).json({ error: 'warTag is required' })
  try {
    const war = await fetchCWLWar(warTag)
    res.status(200).json(war)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'failed to fetch CWL war' })
  }
}
