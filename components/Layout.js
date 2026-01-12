import { FaUsers, FaGamepad, FaChevronDown } from 'react-icons/fa'
import Link from 'next/link'
import { useState } from 'react'

export default function Layout({ children, clans = [] }) {
  const [showClansDropdown, setShowClansDropdown] = useState(false);

  return (
    <div className="site">
      {/* Background Characters */}
      <img src="/GW_CosmicCurse_f20_4k.png" alt="" className="char-overlay char-left" />
      <img src="/ArcherQueen_LNY_2025_Skin.png" alt="" className="char-overlay char-right" />
      <img src="/Troop_HV_Baby_Dragon_3.png" alt="" className="minion-float" />

      <header className="site-header">
        <Link href="/" className="brand-logo-link">
          <div className="brand-logo">
            <img src="/banner.png" alt="Fabulous Flame" className="logo-banner" />
          </div>
        </Link>
        <nav className="main-nav">
          <Link href="/" className="nav-link-with-icon">
            <img src="/home.png" alt="Home" className="nav-icon" />
            <span>Home</span>
          </Link>
          {clans && clans.length > 0 && (
            <div 
              className="nav-dropdown"
              onMouseEnter={() => setShowClansDropdown(true)}
              onMouseLeave={() => setShowClansDropdown(false)}
            >
              <button className="nav-dropdown-btn">
                <FaUsers size={16} />
                <span>Clans</span>
                <FaChevronDown size={10} />
              </button>
              {showClansDropdown && (
                <div className="nav-dropdown-menu">
                  {clans.map((clan) => (
                    <Link key={clan.tag} href={`/clan/${encodeURIComponent(clan.tag)}`}>
                      <div className="nav-dropdown-item">
                        <img src={clan.badgeUrls?.small} alt={clan.name} className="nav-clan-badge" />
                        <span>{clan.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          <Link href="/admin" className="nav-link-with-icon">
            <FaGamepad size={16} />
            <span>Admin</span>
          </Link>
        </nav>
        <div className="nav-bottom-decor-bar"></div>
      </header>

      <main className="content">{children}</main>
    </div>
  )
}
