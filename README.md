# ApeSquad NeatQueue Rankings

A modern, dark-themed web application for displaying Discord bot rankings and leaderboards, powered by the NeatQueue platform.

## 🦍 Features

- **Real-time Leaderboards**: Live rankings from your Discord bot
- **Dark Theme**: Minimalistic design optimized for extended viewing
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **NeatQueue Integration**: Seamless API integration with Discord bot data
- **Player Statistics**: Detailed win rates, levels, and performance metrics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (required for Svelte 5)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```sh
git clone https://github.com/yuriko2000/ApeSquadNeatQueue.git
cd ApeSquadNeatQueue
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## ⚙️ Configuration

### NeatQueue API Integration

To connect with your NeatQueue Discord bot, you'll need to configure the API settings:

1. Get your API credentials from the NeatQueue dashboard
2. Set up environment variables (create a `.env` file):

```sh
# NeatQueue API Configuration
NEATQUEUE_API_URL=https://api.neatqueue.com
NEATQUEUE_API_KEY=your_api_key_here
DISCORD_GUILD_ID=your_guild_id_here
```

3. Without proper API configuration, the app will use mock data for demonstration.

### Configuration Options

The app uses `src/lib/config.js` for configuration management:

- **API Settings**: NeatQueue API URL, key, and guild ID
- **App Settings**: Refresh intervals, theme colors
- **Pagination**: Default and maximum limits for leaderboard data

## 🛠️ Development

### Project Structure

```
src/
├── lib/
│   ├── config.js          # App configuration
│   └── images/            # Static assets
├── routes/
│   ├── api/
│   │   └── neatqueue/     # API endpoints
│   ├── about/             # About page
│   ├── Leaderboard.svelte # Main leaderboard component
│   ├── Header.svelte      # Navigation header
│   └── +page.svelte       # Home page
└── app.css                # Global styles
```

### Building for Production

```sh
npm run build
```

Preview the production build:
```sh
npm run preview
```

## 🎨 Customization

### Theme Colors

The dark theme can be customized by modifying CSS variables in `src/app.css`:

```css
:root {
  --color-theme-1: #ff6b35;  /* Primary accent */
  --color-theme-2: #4ecdc4;  /* Secondary accent */
  --color-bg-1: #141414;     /* Background */
  /* ... more variables */
}
```

### API Integration

To integrate with your specific NeatQueue setup:

1. Update the API endpoint in `src/routes/api/neatqueue/+server.js`
2. Modify the data transformation functions to match your API response format
3. Adjust the mock data structure if needed

## 📊 NeatQueue Integration

This application is designed to work with the NeatQueue Discord bot platform. NeatQueue provides:

- Queue management for Discord gaming communities
- Player ranking and rating systems
- Tournament organization tools
- Statistical tracking and leaderboards

Visit [NeatQueue's website](https://neatqueue.com) for more information about the platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [NeatQueue Platform](https://neatqueue.com)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [GitHub Repository](https://github.com/yuriko2000/ApeSquadNeatQueue)

---

Built with ❤️ using SvelteKit and the NeatQueue API
