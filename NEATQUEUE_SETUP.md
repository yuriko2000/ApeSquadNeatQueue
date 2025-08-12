# NeatQueue API Integration Setup Guide

This guide will help you configure the ApeSquad NeatQueue application to connect with your NeatQueue Discord bot API.

## 🔧 Prerequisites

1. **NeatQueue Discord Bot**: Must be installed and configured in your Discord server
2. **API Access**: You need API credentials from the NeatQueue platform
3. **Discord Guild ID**: The ID of your Discord server where the bot is installed

## 📋 Required Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

```bash
# NeatQueue API Configuration
NEATQUEUE_API_URL=https://api.neatqueue.com
NEATQUEUE_API_KEY=your_api_key_here
DISCORD_GUILD_ID=your_guild_id_here
```

### How to Get These Values

#### 1. NeatQueue API Key

- Log into your NeatQueue dashboard
- Navigate to the API/Developer section
- Generate a new API key
- Copy the key and add it to your `.env` file

#### 2. Discord Guild ID

- Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
- Right-click on your server name
- Select "Copy Server ID"
- Add this ID to your `.env` file

#### 3. API URL

- The default URL is `https://api.neatqueue.com`
- If you're using a custom NeatQueue instance, update this URL accordingly

## 🚀 Configuration Steps

### Step 1: Environment Setup

1. Create the `.env` file:

```bash
touch .env
```

2. Add your configuration:

```bash
echo "NEATQUEUE_API_URL=https://api.neatqueue.com" >> .env
echo "NEATQUEUE_API_KEY=your_actual_api_key" >> .env
echo "DISCORD_GUILD_ID=your_actual_guild_id" >> .env
```

### Step 2: Verify Configuration

The application includes built-in configuration checking. You can verify your setup by:

1. Starting the development server:

```bash
npm run dev
```

2. Check the browser console for configuration status messages
3. The API will automatically fall back to mock data if not properly configured

### Step 3: Test API Connection

Once configured, the application will:

- Automatically fetch real data from your NeatQueue bot
- Display live leaderboard rankings
- Update every 60 seconds with fresh data
- Show player statistics, win rates, and levels

## 📊 API Endpoints

The application uses the following NeatQueue API endpoints:

### Leaderboard Data

- **Endpoint**: `GET /guilds/{guild_id}/leaderboard`
- **Parameters**:
  - `limit` (number): Number of players to return (default: 50)
  - `offset` (number): Pagination offset (default: 0)
  - `season` (string): Season filter (optional)

### Player Statistics

- **Endpoint**: `GET /guilds/{guild_id}/players/{player_id}`
- **Parameters**:
  - `season` (string): Season filter (optional)

### Guild Statistics

- **Endpoint**: `GET /guilds/{guild_id}/stats`
- **Parameters**:
  - `season` (string): Season filter (optional)

### Recent Matches

- **Endpoint**: `GET /guilds/{guild_id}/matches`
- **Parameters**:
  - `limit` (number): Number of matches to return (default: 20)
  - `offset` (number): Pagination offset (default: 0)

## 🔍 Troubleshooting

### Common Issues

#### 1. "NeatQueue API not configured" Error

- **Cause**: Missing or incorrect environment variables
- **Solution**: Verify your `.env` file contains all required variables

#### 2. "401 Unauthorized" Error

- **Cause**: Invalid API key
- **Solution**: Regenerate your API key in the NeatQueue dashboard

#### 3. "404 Not Found" Error

- **Cause**: Incorrect guild ID or API endpoint
- **Solution**: Verify your guild ID and ensure the bot is installed in that server

#### 4. "403 Forbidden" Error

- **Cause**: Insufficient API permissions
- **Solution**: Check your API key permissions in the NeatQueue dashboard

### Debug Mode

Enable debug logging by adding to your `.env` file:

```bash
DEBUG=true
```

This will show detailed API request/response information in the console.

## 🔄 Data Refresh

The application automatically refreshes data every 60 seconds. You can:

- **Manual Refresh**: Click the "Refresh" button in the UI
- **Auto Refresh**: Data updates automatically every minute
- **Real-time Updates**: The API provides live data from your Discord bot

## 📈 Data Transformation

The application transforms NeatQueue API data to match the frontend format:

```javascript
{
  id: "player_discord_id",
  username: "Player Name",
  score: 1500,
  level: 5,
  wins: 25,
  gamesPlayed: 30,
  rank: 1,
  winRate: "83.3%",
  lastActive: "2024-01-15T10:30:00Z"
}
```

## 🛡️ Security Considerations

1. **API Key Security**: Never commit your `.env` file to version control
2. **Rate Limiting**: The application respects NeatQueue API rate limits
3. **Error Handling**: Graceful fallback to mock data on API errors
4. **CORS**: Ensure your NeatQueue API allows requests from your domain

## 📚 Additional Resources

- [NeatQueue Documentation](https://docs.neatqueue.com)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment variables
3. Test your API key with a tool like Postman
4. Check the NeatQueue dashboard for API status
5. Review the troubleshooting section above

---

**Note**: This setup guide assumes you have access to the NeatQueue platform and API. If you need help with NeatQueue bot setup, please refer to their official documentation.
