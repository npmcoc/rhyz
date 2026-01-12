1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
2. Import project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub: `DevCadbury/Fabulousflame`
   - Add environment variables
   - Deploy!

## 🔧 Configuration

### Adding Clans

1. Navigate to `/admin` page
2. Enter admin password
3. Add clan tags in format `#TAG123`
4. Set clans per row (optional)

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `COC_EMAIL` | Supercell API email | `user@example.com` |
| `COC_PASSWORD` | Supercell API password | `yourpassword` |
| `ADMIN_PASSWORD` | Admin panel password | `UCUPBOSS` |

## 📱 Pages

- **/** - Home page with clan grid
- **/clan/[tag]** - Detailed clan information and members
- **/player/[tag]** - Player profile and statistics
- **/war/[tag]** - Current war details
- **/cwl/[tag]** - Clan War League overview
- **/warlog/[tag]** - War history (if public)
- **/admin** - Admin panel for managing clans

## 🎨 Customization

### Theme Colors

Edit `styles/globals.css`:
```css
:root {
  --neon-purple: #d500f9;
  --neon-glow: rgba(213, 0, 249, 0.6);
}
```

### Logo

Replace `/public/banner.png` with your custom logo (recommended: 600x150px)

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **API Client**: clashofclans.js
- **Styling**: Custom CSS with gaming theme
- **Icons**: React Icons (Font Awesome)
- **Caching**: NodeCache (5-minute TTL)
- **Hosting**: Vercel

## 📄 License

MIT License - feel free to use for your clan!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 🔗 Links

- **GitHub**: https://github.com/DevCadbury/Fabulousflame
- **Clash of Clans API**: https://developer.clashofclans.com

---

Made with 🔥 by FABULOUS FLAME clan

```bash
npm run dev
```

## API Routes

All routes are server-side only and never expose credentials to the client:

- `GET /api/clan?tag=#CLANTAG` - Fetch clan information
- `GET /api/player?tag=#PLAYERTAG` - Fetch player information  
- `GET /api/war?tag=#CLANTAG` - Fetch current war data
- `GET /api/cwl?tag=#CLANTAG` - Fetch CWL group data
- `GET /api/cwl/[warTag]` - Fetch specific CWL war details

## Project Structure

```
ucup/
├── pages/
│   ├── _app.js           # Global app wrapper
│   ├── index.js          # Home page with SSR clan showcase
│   └── api/
│       ├── clan.js       # Clan data endpoint
│       ├── player.js     # Player data endpoint
│       ├── war.js        # War data endpoint
│       ├── cwl.js        # CWL group endpoint
│       └── cwl/
│           └── [warTag].js  # CWL war detail endpoint
├── components/
│   ├── Layout.js         # Main layout with header/footer
│   └── ClanCard.js       # Clan display card
├── lib/
│   └── coc.js           # CoC client wrapper with caching
├── styles/
│   └── globals.css      # Gaming-themed dark styles
└── .env.local           # Environment variables (not in repo)
```

## Notes

- Clash of Clans access uses `clashofclans.js` with email/password auth and in-memory caching (5 minutes).
- Credentials never leave the server; SSR fetches data via `getServerSideProps` in `pages/index.js`.
- Icons are provided via `react-icons` (no emoji used).
- API routes available: `/api/clan?tag=`, `/api/player?tag=`, `/api/war?tag=`, `/api/cwl?tag=`, `/api/cwl/[warTag]`
- Login includes automatic retry logic (3 attempts) to handle temporary API issues.
