import { json } from '@sveltejs/kit';

// NeatQueue Discord Bot API Configuration
const NEATQUEUE_API_BASE = process.env.NEATQUEUE_API_URL || 'https://api.neatqueue.com';
const NEATQUEUE_API_KEY = process.env.NEATQUEUE_API_KEY;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

/**
 * GET /api/neatqueue
 * Fetch leaderboard data from NeatQueue Discord bot API
 */
export async function GET({ url }) {
	try {
		const limit = url.searchParams.get('limit') || '50';
		const offset = url.searchParams.get('offset') || '0';

		// TODO: Replace with actual NeatQueue API endpoint
		// This is a placeholder implementation
		if (!NEATQUEUE_API_KEY || !GUILD_ID) {
			console.warn('NeatQueue API not configured. Using mock data.');
			return json(getMockLeaderboardData(parseInt(limit)));
		}

		// Example API call structure (adjust based on actual NeatQueue API documentation)
		const response = await fetch(`${NEATQUEUE_API_BASE}/guilds/${GUILD_ID}/leaderboard`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${NEATQUEUE_API_KEY}`,
				'Content-Type': 'application/json'
			},
			params: {
				limit: limit,
				offset: offset
			}
		});

		if (!response.ok) {
			throw new Error(`NeatQueue API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		
		// Transform NeatQueue data to our format if needed
		const transformedData = transformNeatQueueData(data);
		
		return json(transformedData);

	} catch (error) {
		console.error('Error fetching leaderboard data:', error);
		
		// Fallback to mock data on error
		return json({
			error: 'Failed to fetch leaderboard data',
			data: getMockLeaderboardData(10)
		}, { status: 500 });
	}
}

/**
 * Transform NeatQueue API response to our frontend format
 * @param {Object} neatqueueData - Raw data from NeatQueue API
 * @returns {Array} - Transformed leaderboard data
 */
function transformNeatQueueData(neatqueueData) {
	// TODO: Implement actual transformation based on NeatQueue API response structure
	// This is a placeholder - adjust based on actual API response format
	
	if (!neatqueueData || !neatqueueData.leaderboard) {
		return [];
	}

	return neatqueueData.leaderboard.map((player, index) => ({
		id: player.user_id || player.id,
		username: player.username || player.display_name,
		score: player.rating || player.score || 0,
		level: calculateLevel(player.rating || player.score || 0),
		wins: player.wins || 0,
		gamesPlayed: player.total_games || player.games_played || 0,
		rank: index + 1
	}));
}

/**
 * Calculate level based on score/rating
 * @param {number} score - Player's score
 * @returns {number} - Calculated level
 */
function calculateLevel(score) {
	// Simple level calculation - adjust as needed
	return Math.floor(score / 300) + 1;
}

/**
 * Generate mock leaderboard data for development/fallback
 * @param {number} limit - Number of players to return
 * @returns {Array} - Mock leaderboard data
 */
function getMockLeaderboardData(limit = 10) {
	const mockPlayers = [
		{ username: 'ApeKing001', score: 15420, wins: 128, gamesPlayed: 150 },
		{ username: 'BananaMaster', score: 13850, wins: 115, gamesPlayed: 142 },
		{ username: 'SquadLeader', score: 12750, wins: 102, gamesPlayed: 135 },
		{ username: 'NeatGamer', score: 11600, wins: 95, gamesPlayed: 128 },
		{ username: 'QueueMaster', score: 10950, wins: 88, gamesPlayed: 120 },
		{ username: 'DiscordApe', score: 10200, wins: 82, gamesPlayed: 115 },
		{ username: 'RankClimber', score: 9750, wins: 76, gamesPlayed: 108 },
		{ username: 'BotSlayer', score: 9150, wins: 71, gamesPlayed: 102 },
		{ username: 'ElitePlayer', score: 8650, wins: 65, gamesPlayed: 95 },
		{ username: 'TopApe', score: 8200, wins: 60, gamesPlayed: 90 },
		{ username: 'ClimbMaster', score: 7850, wins: 55, gamesPlayed: 85 },
		{ username: 'RankWarrior', score: 7500, wins: 50, gamesPlayed: 80 },
		{ username: 'GameChanger', score: 7200, wins: 47, gamesPlayed: 75 },
		{ username: 'ProGamer', score: 6900, wins: 43, gamesPlayed: 70 },
		{ username: 'SkillMaster', score: 6600, wins: 40, gamesPlayed: 65 }
	];

	return mockPlayers
		.slice(0, limit)
		.map((player, index) => ({
			id: index + 1,
			username: player.username,
			score: player.score,
			level: calculateLevel(player.score),
			wins: player.wins,
			gamesPlayed: player.gamesPlayed,
			rank: index + 1
		}));
}
