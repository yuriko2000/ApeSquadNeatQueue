import { neatQueueAPI } from "$lib/neatqueue-api.js";

export async function GET({ url }) {
  const limit = url.searchParams.get("limit") || "50";

  console.log("[API] Queue request received with limit:", limit);

  try {
    // Check if API is configured
    if (!neatQueueAPI.isAPIConfigured()) {
      console.log("[API] NeatQueue API not configured, returning empty queue");
      return new Response(
        JSON.stringify({
          success: true,
          data: [],
          timestamp: new Date().toISOString(),
          source: "no-api-configured",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Try to fetch queue data from NeatQueue API
    console.log("[API] Attempting to fetch queue data from NeatQueue API...");

    // Try different queue endpoints
    const queueEndpoints = [
      `/api/queues/${neatQueueAPI.guildId}`,
      `/api/queues/${neatQueueAPI.guildId}/teams`,
      `/api/queue/${neatQueueAPI.guildId}`,
      `/api/queue/${neatQueueAPI.guildId}/teams`,
      "/api/queues",
      "/api/queue",
    ];

    let queueData = null;
    let lastError = null;

    for (const endpoint of queueEndpoints) {
      try {
        console.log(`[API] Trying endpoint: ${endpoint}`);
        const response = await neatQueueAPI.makeRequest(endpoint);

        if (
          response &&
          (Array.isArray(response) ||
            response.teams ||
            response.queue ||
            response.data)
        ) {
          queueData = response;
          console.log(`[API] Successfully fetched queue data from ${endpoint}`);
          break;
        }
      } catch (error) {
        console.log(`[API] Endpoint ${endpoint} failed:`, error.message);
        lastError = error;
      }
    }

    // If no queue data found, return empty array (no teams in queue)
    if (!queueData) {
      console.log("[API] No queue data available, returning empty queue");
      return new Response(
        JSON.stringify({
          success: true,
          data: [],
          timestamp: new Date().toISOString(),
          source: "no-queue-data",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Transform the data to our team format
    const transformedData = transformQueueData(queueData, parseInt(limit));

    return new Response(
      JSON.stringify({
        success: true,
        data: transformedData,
        timestamp: new Date().toISOString(),
        source: "neatqueue-api",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[API] Error in queue endpoint:", error);

    // Return empty queue as fallback
    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
        source: "error-fallback",
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function transformQueueData(apiResponse, limit = 50) {
  console.log("[API] Transforming queue data:", apiResponse);

  let teams = [];

  // Handle different response structures
  if (Array.isArray(apiResponse)) {
    teams = apiResponse;
  } else if (apiResponse.teams) {
    teams = apiResponse.teams;
  } else if (apiResponse.queue) {
    teams = apiResponse.queue;
  } else if (apiResponse.data) {
    teams = apiResponse.data;
  } else {
    teams = [];
  }

  // Transform to our team format
  return teams.slice(0, limit).map((team, index) => ({
    id: team.id || index + 1,
    teamName: team.teamName || team.name || `Team ${index + 1}`,
    players: team.players || team.members || [],
    averageLevel:
      team.averageLevel ||
      calculateAverageLevel(team.players || team.members || []),
    averageScore:
      team.averageScore ||
      calculateAverageScore(team.players || team.members || []),
    joinedAt:
      team.joinedAt ||
      team.timestamp ||
      team.createdAt ||
      new Date().toISOString(),
    position: index + 1,
    waitTime: calculateWaitTime(
      team.joinedAt || team.timestamp || team.createdAt
    ),
  }));
}

function calculateWaitTime(joinedAt) {
  if (!joinedAt) return 0;
  const joined = new Date(joinedAt);
  const now = new Date();
  return now - joined;
}

function calculateAverageLevel(players) {
  if (!players || players.length === 0) return 1;
  const totalLevel = players.reduce(
    (sum, player) => sum + (player.level || 1),
    0
  );
  return Math.floor(totalLevel / players.length);
}

function calculateAverageScore(players) {
  if (!players || players.length === 0) return 0;
  const totalScore = players.reduce(
    (sum, player) => sum + (player.score || 0),
    0
  );
  return Math.floor(totalScore / players.length);
}
