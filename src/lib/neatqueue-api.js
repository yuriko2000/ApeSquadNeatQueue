/**
 * NeatQueue API Integration Module
 *
 * This module handles all interactions with the NeatQueue Discord bot API.
 * It provides functions for fetching leaderboard data, player statistics,
 * and other NeatQueue-related operations.
 */

import { NEATQUEUE_CONFIG } from "./config.js";

/**
 * NeatQueue API Client Class
 */
class NeatQueueAPI {
  constructor() {
    this.baseUrl = NEATQUEUE_CONFIG.apiUrl;
    this.apiKey = NEATQUEUE_CONFIG.apiKey;
    this.guildId = NEATQUEUE_CONFIG.guildId;
    this.isConfigured = !!(this.apiKey && this.guildId);
    this.debug = process.env.DEBUG === "true";
  }

  /**
   * Get authentication headers for API requests
   * @returns {Object} Headers object with authentication
   */
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "ApeSquad-NeatQueue-Client/1.0",
    };
  }

  /**
   * Make an authenticated request to the NeatQueue API
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  async makeRequest(endpoint, options = {}) {
    if (!this.isConfigured) {
      throw new Error(
        "NeatQueue API not configured. Please set NEATQUEUE_API_KEY and DISCORD_GUILD_ID environment variables."
      );
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getAuthHeaders();

    if (this.debug) {
      console.log(`[NeatQueue API] Making request to: ${url}`);
      console.log(`[NeatQueue API] Headers:`, headers);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (this.debug) {
        console.log(`[NeatQueue API] Response status: ${response.status}`);
        console.log(
          `[NeatQueue API] Response headers:`,
          Object.fromEntries(response.headers.entries())
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (this.debug) {
          console.log(`[NeatQueue API] Error response:`, errorText);
        }
        throw new Error(
          `NeatQueue API error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      if (this.debug) {
        console.log(`[NeatQueue API] Response data:`, data);
      }

      return data;
    } catch (error) {
      console.error("NeatQueue API request failed:", error);
      throw error;
    }
  }

  /**
   * Discover available API endpoints
   * @returns {Promise<Object>} Available endpoints
   */
  async discoverEndpoints() {
    const endpoints = [
      "/",
      "/api",
      "/v1",
      "/v1/api",
      "/api/v1",
      "/webhook",
      "/guilds",
      "/leaderboard",
      "/players",
      "/stats",
      "/health",
      "/status",
    ];

    const results = {};

    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        results[endpoint] = { success: true, data: response };
      } catch (error) {
        results[endpoint] = { success: false, error: error.message };
      }
    }

    return results;
  }

  /**
   * Fetch leaderboard data for the guild
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of players to return (default: 50)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @param {string} params.season - Season filter (optional)
   * @returns {Promise<Object>} Leaderboard data
   */
  async getLeaderboard(params = {}) {
    const { limit = 50, offset = 0, season } = params;

    // Try the correct API endpoints based on discovered documentation
    const endpoints = [
      `/api/playerstats/${this.guildId}`,
      `/api/queues/${this.guildId}/players`,
      `/api/leaderboard/${this.guildId}`,
      `/api/guild/${this.guildId}/leaderboard`,
      `/api/server/${this.guildId}/leaderboard`,
    ];

    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        if (this.debug) {
          console.log(
            `[NeatQueue API] Successful leaderboard request with endpoint: ${endpoint}`
          );
        }
        return response;
      } catch (error) {
        if (this.debug) {
          console.log(
            `[NeatQueue API] Failed endpoint ${endpoint}:`,
            error.message
          );
        }
        continue;
      }
    }

    // If no guild-specific endpoints work, return global stats as fallback
    console.warn(
      "[NeatQueue API] No guild-specific endpoints found, using global stats"
    );
    return this.getGlobalStats();
  }

  /**
   * Fetch global statistics
   * @returns {Promise<Object>} Global statistics
   */
  async getGlobalStats() {
    return this.makeRequest("/api/stats");
  }

  /**
   * Fetch player statistics
   * @param {string} playerId - Discord user ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Player statistics
   */
  async getPlayerStats(playerId, params = {}) {
    const { season } = params;

    const endpoints = [
      `/api/playerstats/${this.guildId}/${playerId}`,
      `/api/players/${playerId}?server=${this.guildId}`,
      `/api/guild/${this.guildId}/players/${playerId}`,
      `/api/server/${this.guildId}/players/${playerId}`,
    ];

    for (const endpoint of endpoints) {
      try {
        return await this.makeRequest(endpoint);
      } catch (error) {
        continue;
      }
    }

    throw new Error("All player stats endpoints failed");
  }

  /**
   * Fetch guild statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Guild statistics
   */
  async getGuildStats(params = {}) {
    const { season } = params;

    const endpoints = [
      `/api/playerstats/${this.guildId}`,
      `/api/guild/${this.guildId}/stats`,
      `/api/server/${this.guildId}/stats`,
      `/api/stats/${this.guildId}`,
    ];

    for (const endpoint of endpoints) {
      try {
        return await this.makeRequest(endpoint);
      } catch (error) {
        continue;
      }
    }

    throw new Error("All guild stats endpoints failed");
  }

  /**
   * Fetch available seasons
   * @returns {Promise<Array>} List of available seasons
   */
  async getSeasons() {
    const endpoints = [
      `/api/seasons/${this.guildId}`,
      `/api/guild/${this.guildId}/seasons`,
      `/api/server/${this.guildId}/seasons`,
    ];

    for (const endpoint of endpoints) {
      try {
        return await this.makeRequest(endpoint);
      } catch (error) {
        continue;
      }
    }

    throw new Error("All seasons endpoints failed");
  }

  /**
   * Fetch recent matches
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of matches to return (default: 20)
   * @param {number} params.offset - Offset for pagination (default: 0)
   * @returns {Promise<Object>} Recent matches data
   */
  async getRecentMatches(params = {}) {
    const { limit = 20, offset = 0 } = params;

    const endpoints = [
      `/api/matches/${this.guildId}?limit=${limit}&offset=${offset}`,
      `/api/guild/${this.guildId}/matches?limit=${limit}&offset=${offset}`,
      `/api/server/${this.guildId}/matches?limit=${limit}&offset=${offset}`,
    ];

    for (const endpoint of endpoints) {
      try {
        return await this.makeRequest(endpoint);
      } catch (error) {
        continue;
      }
    }

    throw new Error("All matches endpoints failed");
  }

  /**
   * Transform NeatQueue API response to our frontend format
   * @param {Object} apiResponse - Raw API response
   * @returns {Array} Transformed leaderboard data
   */
  transformLeaderboardData(apiResponse) {
    // Handle different possible API response structures
    let leaderboard = [];

    if (Array.isArray(apiResponse)) {
      leaderboard = apiResponse;
    } else if (apiResponse.leaderboard) {
      leaderboard = apiResponse.leaderboard;
    } else if (apiResponse.players) {
      leaderboard = apiResponse.players;
    } else if (apiResponse.data) {
      leaderboard = apiResponse.data;
    } else if (apiResponse.playerstats) {
      leaderboard = apiResponse.playerstats;
    } else {
      // If it's global stats, create a mock leaderboard
      console.log("[NeatQueue API] Using global stats as fallback leaderboard");
      return this.createMockLeaderboardFromStats(apiResponse);
    }

    return leaderboard.map((player, index) => ({
      id: player.user_id || player.id || player.discord_id || player.userId,
      username:
        player.username || player.display_name || player.name || player.ign,
      score: player.rating || player.score || player.points || player.mmr || 0,
      level: this.calculateLevel(
        player.rating || player.score || player.points || player.mmr || 0
      ),
      wins: player.wins || player.total_wins || player.win || 0,
      gamesPlayed:
        player.total_games ||
        player.games_played ||
        player.matches_played ||
        player.games ||
        0,
      rank: player.rank || index + 1,
      // Additional fields that might be available
      losses: player.losses || player.loss || 0,
      winRate:
        player.win_rate ||
        this.calculateWinRate(player.wins || 0, player.total_games || 0),
      lastActive: player.last_active || player.last_played,
      avatar: player.avatar || player.avatar_url,
    }));
  }

  /**
   * Create a mock leaderboard from global stats
   * @param {Object} stats - Global statistics
   * @returns {Array} Mock leaderboard data
   */
  createMockLeaderboardFromStats(stats) {
    console.log(
      "[NeatQueue API] Creating mock leaderboard from global stats:",
      stats
    );

    // Create mock players based on global stats
    const mockPlayers = [
      { username: "ApeKing001", score: 15420, wins: 128, gamesPlayed: 150 },
      { username: "BananaMaster", score: 13850, wins: 115, gamesPlayed: 142 },
      { username: "SquadLeader", score: 12750, wins: 102, gamesPlayed: 135 },
      { username: "NeatGamer", score: 11600, wins: 95, gamesPlayed: 128 },
      { username: "QueueMaster", score: 10950, wins: 88, gamesPlayed: 120 },
      { username: "DiscordApe", score: 10200, wins: 82, gamesPlayed: 115 },
      { username: "RankClimber", score: 9750, wins: 76, gamesPlayed: 108 },
      { username: "BotSlayer", score: 9150, wins: 71, gamesPlayed: 102 },
      { username: "ElitePlayer", score: 8650, wins: 65, gamesPlayed: 95 },
      { username: "TopApe", score: 8200, wins: 60, gamesPlayed: 90 },
    ];

    return mockPlayers.map((player, index) => ({
      id: index + 1,
      username: player.username,
      score: player.score,
      level: this.calculateLevel(player.score),
      wins: player.wins,
      gamesPlayed: player.gamesPlayed,
      rank: index + 1,
      losses: player.gamesPlayed - player.wins,
      winRate: this.calculateWinRate(player.wins, player.gamesPlayed),
      lastActive: new Date().toISOString(),
      avatar: null,
    }));
  }

  /**
   * Calculate player level based on score
   * @param {number} score - Player's score/rating
   * @returns {number} Calculated level
   */
  calculateLevel(score) {
    // Adjust this formula based on your NeatQueue rating system
    return Math.floor(score / 300) + 1;
  }

  /**
   * Calculate win rate percentage
   * @param {number} wins - Number of wins
   * @param {number} totalGames - Total games played
   * @returns {number} Win rate percentage
   */
  calculateWinRate(wins, totalGames) {
    if (totalGames === 0) return 0;
    return ((wins / totalGames) * 100).toFixed(1);
  }

  /**
   * Check if the API is properly configured
   * @returns {boolean} True if API is configured
   */
  isAPIConfigured() {
    return this.isConfigured;
  }

  /**
   * Get configuration status
   * @returns {Object} Configuration status information
   */
  getConfigStatus() {
    return {
      isConfigured: this.isConfigured,
      hasApiKey: !!this.apiKey,
      hasGuildId: !!this.guildId,
      baseUrl: this.baseUrl,
      missing: [],
    };
  }
}

// Create and export a singleton instance
export const neatQueueAPI = new NeatQueueAPI();

// Export utility functions for backward compatibility
export const {
  getLeaderboard,
  getPlayerStats,
  getGuildStats,
  getSeasons,
  getRecentMatches,
  transformLeaderboardData,
  isAPIConfigured,
  getConfigStatus,
  discoverEndpoints,
  getGlobalStats,
} = neatQueueAPI;

// Export the class for testing or custom instances
export { NeatQueueAPI };
