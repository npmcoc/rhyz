import { getStoreData, addClanTag, removeClanTag, reorderClanTags, updateSettings } from '../../lib/store';
import { fetchClan, fetchClans } from '../../lib/coc';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = getStoreData();
    // Fetch clan details for names
    let enrichedTags = [];
    try {
      if (data.tags.length > 0) {
        const clans = await fetchClans(data.tags);
        // Map tags to names, preserving order
        enrichedTags = data.tags.map(tag => {
          const clan = clans.find(c => c.tag === tag);
          return { tag, name: clan ? clan.name : 'Unknown' };
        });
      }
    } catch (e) {
      console.error("Failed to fetch clan names for admin", e);
      enrichedTags = data.tags.map(tag => ({ tag, name: 'Error fetching name' }));
    }
    
    return res.status(200).json({ ...data, enrichedTags });
  }

  const { password, tag, action, newTags, settings } = req.body;
  const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();

  if (!adminPassword) {
    return res.status(500).json({ message: 'Admin password not configured' });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  if (req.method === 'POST') {
    if (action === 'check') {
      // Just a password check, return success
      return res.status(200).json({ success: true, message: 'Authenticated' });
    } else if (action === 'add') {
      if (!tag) return res.status(400).json({ message: 'Tag is required' });
      try {
        await fetchClan(tag);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid Clan Tag: Clan not found' });
      }
      const success = addClanTag(tag);
      return res.status(200).json({ success, ...getStoreData() });
    } else if (action === 'remove') {
      if (!tag) return res.status(400).json({ message: 'Tag is required' });
      const success = removeClanTag(tag);
      return res.status(200).json({ success, ...getStoreData() });
    } else if (action === 'reorder') {
      if (!newTags) return res.status(400).json({ message: 'New tags required' });
      const success = reorderClanTags(newTags);
      return res.status(200).json({ success, ...getStoreData() });
    } else if (action === 'settings') {
      if (!settings) return res.status(400).json({ message: 'Settings required' });
      const success = updateSettings(settings);
      return res.status(200).json({ success, ...getStoreData() });
    } else {
      return res.status(400).json({ message: 'Unknown action' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
