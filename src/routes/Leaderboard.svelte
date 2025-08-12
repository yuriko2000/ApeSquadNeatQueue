<script>
	import { onMount, onDestroy, tick } from 'svelte';

	let rankings = [];
	let loading = true;
	let error = null;
	let refreshInterval = null;
	let lastUpdate = null;
	let autoRefreshActive = false;
	let countdown = 60; // Countdown timer in seconds

	// Function to fetch leaderboard data from our API
	async function fetchLeaderboard() {
		try {
			loading = true;
			error = null;
			
			const response = await fetch('/api/neatqueue?limit=50');
			const result = await response.json();
			
			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch leaderboard');
			}
			
			// Handle both successful API response and fallback mock data
			rankings = result.data || result;
			// Use the timestamp from the API response if available, otherwise use current time
			lastUpdate = result.timestamp ? new Date(result.timestamp) : new Date();
		} catch (err) {
			error = 'Failed to load leaderboard data. Please try again later.';
			console.error('Error fetching leaderboard:', err);
		} finally {
			loading = false;
		}
	}

	// Function to get rank class for special styling
	function getRankClass(index) {
		switch (index) {
			case 0: return 'first';
			case 1: return 'second';
			case 2: return 'third';
			default: return '';
		}
	}

	// Function to format numbers with commas
	function formatNumber(num) {
		return num.toLocaleString();
	}

	// Function to calculate win rate
	function getWinRate(wins, gamesPlayed) {
		return ((wins / gamesPlayed) * 100).toFixed(1);
	}

	// Function to format last update time
	function formatLastUpdate() {
		if (!lastUpdate) return 'Never';
		return lastUpdate.toLocaleString();
	}

	// Function to format countdown timer
	function formatCountdown() {
		const minutes = Math.floor(countdown / 60);
		const seconds = countdown % 60;
		console.log('[Leaderboard Debug] formatCountdown called with countdown:', countdown);
		return `Auto-refresh in ${countdown}s`;
	}

	// Combined auto-refresh and countdown timer
	function startAutoRefresh() {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
		
		autoRefreshActive = true;
		countdown = 60;
		
		// Start the countdown timer that ticks every second
		refreshInterval = setInterval(async () => {
			// Update countdown with explicit assignment to trigger reactivity
			countdown = countdown - 1;
			console.log('[Leaderboard Debug] Countdown updated:', countdown);
			
			// Force Svelte to update the DOM
			await tick();
			
			// When countdown reaches 0, refresh data and reset
			if (countdown <= 0) {
				console.log('Auto-refreshing leaderboard...');
				fetchLeaderboard();
				countdown = 60;
				console.log('[Leaderboard Debug] Countdown reset to 60');
			}
		}, 1000); // Every second
	}

	function stopAutoRefresh() {
		if (refreshInterval) {
			clearInterval(refreshInterval);
			refreshInterval = null;
		}
		autoRefreshActive = false;
		countdown = 60;
	}

	onMount(() => {
		console.log('[Leaderboard Debug] Component mounted, starting auto-refresh');
		fetchLeaderboard();
		startAutoRefresh();
	});

	onDestroy(() => {
		stopAutoRefresh();
	});
</script>

<div class="leaderboard">
	<div class="leaderboard-card">
		<div class="auto-refresh-indicator">
			<span class="countdown">Auto-refresh in {countdown}s</span>
		</div>
		
		<div class="leaderboard-header">
			<h1 class="leaderboard-title">ApeSquad Rankings</h1>
		</div>

		{#if loading}
			<div class="loading">
				<p>Loading leaderboard...</p>
			</div>
		{:else if error}
			<div class="error">
				<p>{error}</p>
				<button on:click={fetchLeaderboard}>Try Again</button>
			</div>
		{:else if rankings.length === 0}
			<div class="loading">
				<p>No rankings data available.</p>
			</div>
		{:else}
			<div class="rankings-list">
				<div class="rank-item header-item">
					<div class="rank-number">#</div>
					<div class="user-info">
						<div class="header-text">Name</div>
					</div>
					<div class="score">
						<div class="header-text">MMR</div>
					</div>
				</div>
				
				{#each rankings as player, index}
					<div class="rank-item">
						<div class="rank-number {getRankClass(index)}">
							{index + 1}
						</div>
						<div class="user-info">
							<div class="username">{player.username}</div>
							<div class="user-stats">
								{formatNumber(player.wins)} wins • {getWinRate(player.wins, player.gamesPlayed)}% win rate
							</div>
						</div>
						<div class="score">
							{formatNumber(player.score)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.leaderboard-card {
		position: relative;
		background: var(--color-card-bg);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		backdrop-filter: blur(10px);
	}

	.auto-refresh-indicator {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 10;
	}

	.leaderboard-header {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 2rem;
		padding-top: 1rem;
	}

	.leaderboard-title {
		margin: 0 0 0.5rem 0;
		color: var(--color-theme-1);
		font-size: 2rem;
		font-weight: 700;
	}

	.status-indicator {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.status-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
		flex-shrink: 0;
	}

	.status-dot.active {
		background-color: #4ecdc4;
		box-shadow: 0 0 6px rgba(78, 205, 196, 0.6);
	}

	.status-dot.inactive {
		background-color: #666;
	}

	.status-text {
		font-weight: 500;
	}

	.countdown {
		color: var(--color-text-muted);
		font-size: 0.8rem;
		font-weight: 500;
	}

	.last-update {
		color: var(--color-text-muted);
		font-size: 0.8rem;
	}

	button {
		background: var(--color-theme-1);
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.2s ease;
		white-space: nowrap;
	}

	button:hover:not(:disabled) {
		background: #e55a2b;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.rankings-list {
		max-height: 70vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.rank-item {
		display: flex;
		align-items: center;
		padding: 1rem;
		background: var(--color-card-bg);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		transition: all 0.2s ease;
		gap: 1rem;
	}

	.rank-item:hover:not(.header-item) {
		background: rgba(255, 255, 255, 0.08);
		border-color: var(--color-theme-1);
	}

	.header-item {
		background: var(--color-bg-2);
		font-weight: 600;
		color: var(--color-theme-1);
		border-color: var(--color-theme-1);
	}

	.rank-number {
		font-size: 1.2rem;
		font-weight: 700;
		text-align: center;
		color: var(--color-theme-1);
		min-width: 60px;
	}

	.rank-number.first {
		color: #ffd700;
	}

	.rank-number.second {
		color: #c0c0c0;
	}

	.rank-number.third {
		color: #cd7f32;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.username {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.user-stats {
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.score {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--color-theme-1);
		min-width: 120px;
		text-align: right;
	}

	.header-text {
		font-weight: 600;
		color: var(--color-theme-1);
	}

	/* Custom scrollbar for webkit browsers */
	.rankings-list::-webkit-scrollbar {
		width: 8px;
	}

	.rankings-list::-webkit-scrollbar-track {
		background: var(--color-bg-2);
		border-radius: 4px;
	}

	.rankings-list::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 4px;
	}

	.rankings-list::-webkit-scrollbar-thumb:hover {
		background: var(--color-theme-1);
	}

	@media (max-width: 768px) {
		.leaderboard-header {
			flex-direction: column;
			align-items: center;
		}

		.status-indicator {
			gap: 0.25rem;
		}

		.status-row {
			flex-wrap: wrap;
			justify-content: center;
		}
	}
</style>
