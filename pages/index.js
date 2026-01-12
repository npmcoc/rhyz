import Layout from '../components/Layout'
import ClanCard from '../components/ClanCard'
import { fetchClans } from '../lib/coc'
import { getStoreData } from '../lib/store'

export default function Home({ clans, settings }) {
  const clansPerRow = settings?.clansPerRow || 0;

  return (
    <Layout clans={clans}>
      <section 
        className="grid" 
        style={{ '--clans-per-row': clansPerRow }}
        data-fixed={clansPerRow > 0 ? 'true' : 'false'}
      >
        {clans.map((c) => (
          <ClanCard key={c.tag} clan={c} />
        ))}
      </section>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const { tags, settings } = getStoreData()
    const clansData = await fetchClans(tags)
    // Remove cached flag for cleaner props
    const clans = clansData.map(c => {
      const { cached, ...rest } = c
      return rest
    })
    return { props: { clans, settings } }
  } catch (err) {
    console.error(err)
    return { props: { clans: [], settings: { clansPerRow: 3 } } }
  }
}
