const { Client } = require('clashofclans.js')
const NodeCache = require('node-cache')

const cache = new NodeCache({ stdTTL: 5 })

// Initialize client with email/password login with increased timeout
const client = new Client({
  cache: true,
  retryLimit: 3,
  restRequestTimeout: 30000 // Increased from 5000ms to 30000ms (30 seconds)
})

let loggedIn = false
let loginPromise = null

// Login function using email/password with retry logic
async function ensureLoggedIn() {
  if (loggedIn) return

  // Prevent multiple concurrent login attempts
  if (loginPromise) return loginPromise

  const email = process.env.COC_EMAIL || process.env.COC_API_EMAIL
  const password = process.env.COC_PASSWORD || process.env.COC_API_PASSWORD

  if (!email || !password) {
    throw new Error('COC_EMAIL and COC_PASSWORD must be set in .env file')
  }

  loginPromise = (async () => {
    let retries = 3
    while (retries > 0) {
      try {
        await client.login({ email, password })
        loggedIn = true
        console.log('✅ CoC API client logged in successfully')
        return
      } catch (error) {
        retries--
        if (retries === 0) {
          console.error('❌ Failed to login to CoC API after 3 attempts:', error.message)
          throw error
        }
        console.log(`⚠️ Login failed, retrying... (${retries} attempts left)`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  })()

  return loginPromise
}

function formatTag(tag) {
  if (!tag) throw new Error('Tag is required')
  return tag.startsWith('#') ? tag : `#${tag}`
}

async function fetchClan(tag) {
  await ensureLoggedIn()
  const formatted = formatTag(tag)
  const cacheKey = `clan_${formatted}`

  const cached = cache.get(cacheKey)
  if (cached) return { ...cached, cached: true }

  const clan = await client.getClan(formatted)
  
  // Convert Badge object to plain JSON
  const badgeUrls = clan.badgeUrls || clan.badge || clan.badges
  const badgeJson = badgeUrls ? {
    small: badgeUrls.small || null,
    medium: badgeUrls.medium || null,
    large: badgeUrls.large || null
  } : null
  
  // Convert clanCapital to plain JSON
  const capitalJson = clan.clanCapital ? {
    capitalHallLevel: clan.clanCapital.capitalHallLevel || null,
    districts: clan.clanCapital.districts || null
  } : null
  
  // Convert location to plain JSON
  const locationJson = clan.location ? {
    id: clan.location.id || null,
    name: clan.location.name || null,
    isCountry: clan.location.isCountry || null
  } : null
  
  // Convert warLeague to plain JSON
  const warLeagueJson = clan.warLeague ? {
    id: clan.warLeague.id || null,
    name: clan.warLeague.name || null
  } : null
  
  // Convert member list to plain JSON
  const memberListJson = clan.members?.map(member => ({
    tag: member.tag || null,
    name: member.name || null,
    role: member.role || 'member',
    townHallLevel: member.townHallLevel || member.townhallLevel || 0,
    expLevel: member.expLevel || 0,
    trophies: member.trophies || 0,
    donations: member.donations || 0,
    donationsReceived: member.donationsReceived || 0,
    clanRank: member.clanRank || 0
  })) || []

  const safe = {
    name: clan.name || null,
    tag: clan.tag || null,
    description: clan.description || null,
    clanLevel: clan.clanLevel || clan.level || null,
    members: clan.memberCount || clan.members?.length || 0,
    memberList: memberListJson,
    warWins: clan.warWins || null,
    warWinStreak: clan.warWinStreak || null,
    warLog: clan.isWarLogPublic || false,
    badgeUrls: badgeJson,
    clanCapital: capitalJson,
    location: locationJson,
    warLeague: warLeagueJson,
    clanPoints: clan.clanPoints || null,
    warFrequency: clan.warFrequency || null,
    requiredTrophies: clan.requiredTrophies || null
  }

  cache.set(cacheKey, safe)
  return { ...safe, cached: false }
}

async function fetchClans(tags) {
  return Promise.all(tags.map((t) => fetchClan(t)))
}

async function fetchPlayer(tag) {
  await ensureLoggedIn()
  const formatted = formatTag(tag)
  const cacheKey = `player_${formatted}`

  const cached = cache.get(cacheKey)
  if (cached) return { ...cached, cached: true }

  const player = await client.getPlayer(formatted)
  
  // Convert clan to plain JSON
  const clanJson = player.clan ? {
    tag: player.clan.tag || null,
    name: player.clan.name || null,
    clanLevel: player.clan.clanLevel || null,
    badgeUrls: player.clan.badgeUrls ? {
      small: player.clan.badgeUrls.small || null,
      medium: player.clan.badgeUrls.medium || null,
      large: player.clan.badgeUrls.large || null
    } : null
  } : null
  
  // Convert league to plain JSON
  const leagueJson = player.league ? {
    id: player.league.id || null,
    name: player.league.name || null,
    iconUrls: player.league.iconUrls || null
  } : null
  
  const safe = {
    name: player.name || null,
    tag: player.tag || null,
    townHallLevel: player.townHallLevel || null,
    expLevel: player.expLevel || null,
    trophies: player.trophies || null,
    bestTrophies: player.bestTrophies || null,
    warStars: player.warStars || null,
    attackWins: player.attackWins || null,
    defenseWins: player.defenseWins || null,
    clan: clanJson,
    league: leagueJson,
    role: player.role || null,
    builderHallLevel: player.builderHallLevel || null,
    builderBaseTrophies: player.builderBaseTrophies || null,
    bestBuilderBaseTrophies: player.bestBuilderBaseTrophies || null
  }

  cache.set(cacheKey, safe)
  return { ...safe, cached: false }
}

async function fetchCurrentWar(tag) {
  await ensureLoggedIn()
  const formatted = formatTag(tag)
  const cacheKey = `war_${formatted}`

  const cached = cache.get(cacheKey)
  if (cached) return { ...cached, cached: true }

  try {
    const war = await client.getClanWar(formatted)
    cache.set(cacheKey, war)
    return { ...war, cached: false }
  } catch (error) {
    if (error.reason === 'privateWarLog') {
      return { 
        state: 'private', 
        error: 'War log is private. The clan must set war log to public in game settings.',
        cached: false 
      }
    }
    throw error
  }
}

async function fetchCWLGroup(tag) {
  await ensureLoggedIn()
  const formatted = formatTag(tag)
  const cacheKey = `cwl_${formatted}`

  const cached = cache.get(cacheKey)
  if (cached) return { ...cached, cached: true }

  try {
    const cwlGroup = await client.getClanWarLeagueGroup(formatted)
  
  // Fetch full clan details for badge URLs
  const clansWithBadges = await Promise.all(
    cwlGroup.clans.map(async (c) => {
      try {
        const fullClan = await client.getClan(c.tag)
        const badgeUrls = fullClan.badgeUrls || fullClan.badge || fullClan.badges
        const badgeJson = badgeUrls ? {
          small: badgeUrls.small || null,
          medium: badgeUrls.medium || null,
          large: badgeUrls.large || null
        } : null
        
        return {
          name: c.name,
          tag: c.tag,
          badgeUrls: badgeJson,
          clanLevel: c.clanLevel,
          members: c.members?.length || 0,
          memberList: c.members.map(m => ({
            name: m.name,
            tag: m.tag,
            townHallLevel: m.townHallLevel,
            role: m.role,
            expLevel: m.expLevel,
            trophies: m.trophies,
            donations: m.donations,
            donationsReceived: m.donationsReceived
          }))
        }
      } catch (err) {
        return {
          name: c.name,
          tag: c.tag,
          badgeUrls: null,
          clanLevel: c.clanLevel,
          members: c.members?.length || 0
        }
      }
    })
  )

  const result = {
    state: cwlGroup.state,
    season: cwlGroup.season,
    clans: clansWithBadges,
    rounds: cwlGroup.rounds
  }

  cache.set(cacheKey, result)
  return { ...result, cached: false }
  } catch (error) {
    if (error.reason === 'notInWar' || error.status === 404) {
      return { 
        state: 'notInCWL', 
        error: 'Clan is not participating in CWL this season.',
        cached: false 
      }
    }
    throw error
  }
}

async function fetchCWLWar(warTag) {
  await ensureLoggedIn()
  const formatted = formatTag(warTag)
  const cacheKey = `cwl_war_${formatted}`

  const cached = cache.get(cacheKey)
  if (cached) return { ...cached, cached: true }

  const war = await client.getClanWarLeagueRound(formatted)
  cache.set(cacheKey, war)
  return { ...war, cached: false }
}

async function fetchWarLog(tag) {
  await ensureLoggedIn()
  const formatted = formatTag(tag)
  const cacheKey = `warlog_${formatted}`

  const cached = cache.get(cacheKey)
  if (cached) return { ...cached, cached: true }

  try {
    const warLog = await client.getClanWarLog(formatted)
    
    const warLogJson = warLog.map(war => ({
      result: war.result || null,
      endTime: war.endTime || null,
      teamSize: war.teamSize || null,
      attacksPerMember: war.attacksPerMember || null,
      clan: {
        tag: war.clan?.tag || null,
        name: war.clan?.name || null,
        badgeUrls: war.clan?.badgeUrls ? {
          small: war.clan.badgeUrls.small || null,
          medium: war.clan.badgeUrls.medium || null,
          large: war.clan.badgeUrls.large || null
        } : null,
        clanLevel: war.clan?.clanLevel || null,
        attacks: war.clan?.attacks || null,
        stars: war.clan?.stars || null,
        destructionPercentage: war.clan?.destructionPercentage || null
      },
      opponent: {
        tag: war.opponent?.tag || null,
        name: war.opponent?.name || null,
        badgeUrls: war.opponent?.badgeUrls ? {
          small: war.opponent.badgeUrls.small || null,
          medium: war.opponent.badgeUrls.medium || null,
          large: war.opponent.badgeUrls.large || null
        } : null,
        clanLevel: war.opponent?.clanLevel || null,
        stars: war.opponent?.stars || null,
        destructionPercentage: war.opponent?.destructionPercentage || null
      }
    }))

    const result = { wars: warLogJson }
    cache.set(cacheKey, result)
    return { ...result, cached: false }
  } catch (error) {
    if (error.status === 403 || error.message?.includes('privateWarLog')) {
      return { state: 'private', error: 'War log is private' }
    }
    throw error
  }
}

module.exports = { 
  fetchClan, 
  fetchClans, 
  fetchPlayer, 
  fetchCurrentWar, 
  fetchCWLGroup,
  fetchCWLWar,
  fetchWarLog,
  client 
}
