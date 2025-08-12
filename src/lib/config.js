/**
 * Application Configuration
 *
 * This file contains configuration settings for the ApeSquad NeatQueue application.
 * Environment variables can be used to override these defaults in production.
 */

// Load environment variables directly
const env = typeof process !== "undefined" ? process.env : {};
const importMetaEnv = typeof import.meta !== "undefined" ? import.meta.env : {};

// NeatQueue Discord Bot API Configuration
export const NEATQUEUE_CONFIG = {
  // API Base URL - replace with actual NeatQueue API endpoint
  apiUrl:
    env.NEATQUEUE_API_URL ||
    importMetaEnv.VITE_NEATQUEUE_API_URL ||
    "https://api.neatqueue.com",

  // API Key - get this from your NeatQueue dashboard
  apiKey: env.NEATQUEUE_API_KEY || importMetaEnv.VITE_NEATQUEUE_API_KEY || null,

  // Discord Guild/Server ID where the bot is installed
  guildId: env.DISCORD_GUILD_ID || importMetaEnv.VITE_DISCORD_GUILD_ID || null,

  // Default pagination settings
  defaultLimit: 50,
  maxLimit: 100,

  // API request settings
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Application Settings
export const APP_CONFIG = {
  name: "ApeSquad NeatQueue Rankings",
  description: "Real-time Discord bot rankings and leaderboards",

  // Auto-refresh interval (in milliseconds) - 60 seconds as requested
  refreshInterval: 60000, // 60 seconds

  // Theme settings
  theme: {
    primary: "#ff6b35",
    secondary: "#4ecdc4",
    background: "#141414",
  },

  // Debug mode
  debug: env.DEBUG === "true" || importMetaEnv.VITE_DEBUG === "true" || false,
};

// API Endpoints
export const API_ENDPOINTS = {
  leaderboard: "/api/neatqueue",
  player: (playerId) => `/api/neatqueue/player/${playerId}`,
  stats: "/api/neatqueue/stats",
  seasons: "/api/neatqueue/seasons",
  matches: "/api/neatqueue/matches",
};

/**
 * Check if NeatQueue API is properly configured
 * @returns {boolean} - True if API is configured
 */
export function isNeatQueueConfigured() {
  return !!(NEATQUEUE_CONFIG.apiKey && NEATQUEUE_CONFIG.guildId);
}

/**
 * Get API configuration status message
 * @returns {string} - Configuration status message
 */
export function getConfigStatus() {
  if (isNeatQueueConfigured()) {
    return "NeatQueue API is configured and ready.";
  }

  const missing = [];
  if (!NEATQUEUE_CONFIG.apiKey) missing.push("API Key");
  if (!NEATQUEUE_CONFIG.guildId) missing.push("Guild ID");

  return `NeatQueue API not configured. Missing: ${missing.join(
    ", "
  )}. Using mock data.`;
}

/**
 * Get detailed configuration status
 * @returns {Object} - Detailed configuration status
 */
export function getDetailedConfigStatus() {
  const status = {
    isConfigured: isNeatQueueConfigured(),
    hasApiKey: !!NEATQUEUE_CONFIG.apiKey,
    hasGuildId: !!NEATQUEUE_CONFIG.guildId,
    apiUrl: NEATQUEUE_CONFIG.apiUrl,
    missing: [],
    warnings: [],
    debug: {
      envKeys: Object.keys(env),
      importMetaEnvKeys: Object.keys(importMetaEnv),
      apiKeyLength: NEATQUEUE_CONFIG.apiKey
        ? NEATQUEUE_CONFIG.apiKey.length
        : 0,
      guildIdValue: NEATQUEUE_CONFIG.guildId,
    },
  };

  if (!NEATQUEUE_CONFIG.apiKey) {
    status.missing.push("NEATQUEUE_API_KEY");
  }
  if (!NEATQUEUE_CONFIG.guildId) {
    status.missing.push("DISCORD_GUILD_ID");
  }

  // Check for potential issues
  if (NEATQUEUE_CONFIG.apiKey && NEATQUEUE_CONFIG.apiKey.length < 10) {
    status.warnings.push("API key seems too short - may be invalid");
  }

  return status;
}

/**
 * Validate environment variables
 * @returns {Object} - Validation results
 */
export function validateEnvironment() {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check required variables
  if (!NEATQUEUE_CONFIG.apiKey) {
    results.errors.push("NEATQUEUE_API_KEY is required");
    results.valid = false;
  }

  if (!NEATQUEUE_CONFIG.guildId) {
    results.errors.push("DISCORD_GUILD_ID is required");
    results.valid = false;
  }

  // Check URL format
  if (NEATQUEUE_CONFIG.apiUrl && !NEATQUEUE_CONFIG.apiUrl.startsWith("http")) {
    results.warnings.push("API URL should start with http:// or https://");
  }

  // Check guild ID format (should be numeric)
  if (NEATQUEUE_CONFIG.guildId && !/^\d+$/.test(NEATQUEUE_CONFIG.guildId)) {
    results.warnings.push("Guild ID should be numeric");
  }

  return results;
}

/**
 * Get configuration for development vs production
 * @returns {Object} - Environment-specific configuration
 */
export function getEnvironmentConfig() {
  const isDev =
    env.NODE_ENV === "development" || importMetaEnv.MODE === "development";

  return {
    isDevelopment: isDev,
    isProduction: !isDev,
    apiUrl: isDev ? NEATQUEUE_CONFIG.apiUrl : NEATQUEUE_CONFIG.apiUrl,
    debug: isDev || APP_CONFIG.debug,
    refreshInterval: isDev ? 30000 : APP_CONFIG.refreshInterval, // Faster refresh in dev
  };
}

// Export configuration status for immediate use
export const configStatus = getDetailedConfigStatus();
export const envValidation = validateEnvironment();

// Debug logging
if (APP_CONFIG.debug) {
  console.log("[Config] Environment variables loaded:", {
    apiKey: NEATQUEUE_CONFIG.apiKey
      ? `${NEATQUEUE_CONFIG.apiKey.substring(0, 8)}...`
      : "not set",
    guildId: NEATQUEUE_CONFIG.guildId || "not set",
    apiUrl: NEATQUEUE_CONFIG.apiUrl,
    isConfigured: isNeatQueueConfigured(),
  });
}
