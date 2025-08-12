import { json } from "@sveltejs/kit";
import { neatQueueAPI } from "$lib/neatqueue-api.js";

/**
 * GET /api/neatqueue/discover
 * Discover available NeatQueue API endpoints
 */
export async function GET() {
  try {
    // Check if API is configured
    if (!neatQueueAPI.isAPIConfigured()) {
      return json({
        success: false,
        error: "NeatQueue API not configured",
        config: neatQueueAPI.getConfigStatus(),
        message: "Please set NEATQUEUE_API_KEY and DISCORD_GUILD_ID environment variables"
      }, { status: 400 });
    }

    // Discover available endpoints
    const endpoints = await neatQueueAPI.discoverEndpoints();
    
    return json({
      success: true,
      config: neatQueueAPI.getConfigStatus(),
      endpoints: endpoints,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error discovering endpoints:", error);
    
    return json({
      success: false,
      error: error.message,
      config: neatQueueAPI.getConfigStatus(),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
