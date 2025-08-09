/**
 * Application Configuration
 * 
 * This file contains configuration settings for the ApeSquad NeatQueue application.
 * Environment variables can be used to override these defaults in production.
 */

// NeatQueue Discord Bot API Configuration
export const NEATQUEUE_CONFIG = {
	// API Base URL - replace with actual NeatQueue API endpoint
	apiUrl: process.env.NEATQUEUE_API_URL || 'https://api.neatqueue.com',
	
	// API Key - get this from your NeatQueue dashboard
	apiKey: process.env.NEATQUEUE_API_KEY || null,
	
	// Discord Guild/Server ID where the bot is installed
	guildId: process.env.DISCORD_GUILD_ID || null,
	
	// Default pagination settings
	defaultLimit: 50,
	maxLimit: 100
};

// Application Settings
export const APP_CONFIG = {
	name: 'ApeSquad NeatQueue Rankings',
	description: 'Real-time Discord bot rankings and leaderboards',
	
	// Auto-refresh interval (in milliseconds)
	refreshInterval: 30000, // 30 seconds
	
	// Theme settings
	theme: {
		primary: '#ff6b35',
		secondary: '#4ecdc4',
		background: '#141414'
	}
};

// API Endpoints
export const API_ENDPOINTS = {
	leaderboard: '/api/neatqueue',
	player: (playerId) => `/api/neatqueue/player/${playerId}`,
	stats: '/api/neatqueue/stats'
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
		return 'NeatQueue API is configured and ready.';
	}
	
	const missing = [];
	if (!NEATQUEUE_CONFIG.apiKey) missing.push('API Key');
	if (!NEATQUEUE_CONFIG.guildId) missing.push('Guild ID');
	
	return `NeatQueue API not configured. Missing: ${missing.join(', ')}. Using mock data.`;
}
