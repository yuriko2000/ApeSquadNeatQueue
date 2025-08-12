<script>
	import { onMount, onDestroy, tick } from 'svelte';

	let queueData = [];
	let loading = true;
	let error = null;
	let refreshInterval = null;
	let lastUpdate = null;
	let autoRefreshActive = false;
	let countdown = 60; // Countdown timer in seconds

		// Function to fetch queue data from our API
	async function fetchQueueData() {
		try {
			loading = true;
			error = null;
			
			const response = await fetch('/api/neatqueue/queue');
			const result = await response.json();
			
			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch queue data');
			}
			
			queueData = result.data || result;
			// Use the timestamp from the API response if available, otherwise use current time
			console.log('[Queue Debug] API response:', result);
			console.log('[Queue Debug] API timestamp:', result.timestamp);
			lastUpdate = result.timestamp ? new Date(result.timestamp) : new Date();
			console.log('[Queue Debug] lastUpdate set to:', lastUpdate);
		} catch (err) {
			error = 'Failed to load queue data. Please try again later.';
			console.error('Error fetching queue data:', err);
		} finally {
			loading = false;
		}
	}

	// Function to format timestamp
	function formatTime(timestamp) {
		if (!timestamp) return 'Unknown';
		const date = new Date(timestamp);
		return date.toLocaleTimeString();
	}

	// Function to format duration
	function formatDuration(startTime) {
		if (!startTime) return 'Unknown';
		const start = new Date(startTime);
		const now = new Date();
		const diff = now - start;
		const minutes = Math.floor(diff / 60000);
		const seconds = Math.floor((diff % 60000) / 1000);
		return `${minutes}m ${seconds}s`;
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
		console.log('[Queue Debug] formatCountdown called with countdown:', countdown);
		return `Auto-refresh in ${countdown}s`;
	}

	// Function to format player list
	function formatPlayers(players) {
		if (!players || players.length === 0) return 'No players';
		return players.map(p => p.username || p.name || 'Unknown').join(', ');
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
			console.log('[Queue Debug] Countdown updated:', countdown);
			
			// Force Svelte to update the DOM
			await tick();
			
			// When countdown reaches 0, refresh data and reset
			if (countdown <= 0) {
				console.log('Auto-refreshing queue data...');
				fetchQueueData();
				countdown = 60;
				console.log('[Queue Debug] Countdown reset to 60');
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
		console.log('[Queue Debug] Component mounted, starting auto-refresh');
		fetchQueueData();
		startAutoRefresh();
	});

	onDestroy(() => {
		stopAutoRefresh();
	});
</script>

<div class="queue-page">
	<div class="queue-card">
		<div class="auto-refresh-indicator">
			<span class="countdown">Auto-refresh in {countdown}s</span>
		</div>
		
		<div class="queue-header">
			<h1 class="queue-title">3v3 Queue</h1>
		</div>

		{#if loading && queueData.length === 0}
			<div class="loading">
				<p>Loading queue data...</p>
			</div>
		{:else if error}
			<div class="error">
				<p>{error}</p>
			</div>
		{:else if queueData.length === 0}
			<div class="empty-queue">
				<p>No teams currently in queue</p>
				<p class="subtitle">Teams will appear here when they join the 3v3 queue</p>
			</div>
		{:else}
			<div class="queue-list">
				<div class="queue-item header-item">
					<div class="position">#</div>
					<div class="team-info">Team</div>
					<div class="players">Players</div>
					<div class="stats">Avg Level/Score</div>
					<div class="wait-time">Wait Time</div>
					<div class="joined-time">Joined</div>
				</div>
				
				{#each queueData as team, index}
					<div class="queue-item">
						<div class="position">{index + 1}</div>
						<div class="team-info">
							<span class="team-name">{team.teamName}</span>
							<span class="team-size">{team.players?.length || 0}/3 players</span>
						</div>
						<div class="players">
							{formatPlayers(team.players)}
						</div>
						<div class="stats">
							<span class="avg-level">Level {team.averageLevel}</span>
							<span class="avg-score">{team.averageScore?.toLocaleString() || 0}</span>
						</div>
						<div class="wait-time">{formatDuration(team.joinedAt)}</div>
						<div class="joined-time">{formatTime(team.joinedAt)}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.queue-page {
		max-width: 1000px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.queue-card {
		position: relative;
		background: var(--color-card-bg);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		backdrop-filter: blur(10px);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.queue-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
	}

	.auto-refresh-indicator {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 10;
	}

	.queue-header {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 1.5rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.queue-title {
		font-size: 2.5rem;
		font-weight: 600;
		margin: 0;
		background: linear-gradient(135deg, var(--color-theme-1), var(--color-theme-2));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.countdown {
		color: var(--color-text-muted);
		font-size: 0.8rem;
		font-weight: 500;
	}

	.loading, .error, .empty-queue {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 3rem;
		color: var(--color-text-muted);
		font-size: 1.1rem;
		text-align: center;
	}

	.empty-queue .subtitle {
		font-size: 0.9rem;
		margin-top: 0.5rem;
		opacity: 0.7;
	}

	.error {
		color: var(--color-theme-1);
	}

	.queue-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.queue-item {
		display: grid;
		grid-template-columns: 60px 1fr 2fr 120px 120px 120px;
		align-items: center;
		padding: 1rem;
		background: var(--color-card-bg);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		transition: all 0.2s ease;
		gap: 1rem;
	}

	.queue-item:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: var(--color-theme-1);
	}

	.header-item {
		background: var(--color-bg-2);
		font-weight: 600;
		color: var(--color-theme-1);
		border-color: var(--color-theme-1);
	}

	.position {
		font-size: 1.2rem;
		font-weight: 700;
		text-align: center;
		color: var(--color-theme-1);
	}

	.team-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.team-name {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.team-size {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.players {
		font-size: 0.9rem;
		color: var(--color-text);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: center;
	}

	.avg-level {
		font-weight: 600;
		color: var(--color-theme-1);
	}

	.avg-score {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}

	.wait-time, .joined-time {
		text-align: center;
		font-size: 0.9rem;
		color: var(--color-text-muted);
	}

	.wait-time {
		font-weight: 600;
		color: var(--color-theme-2);
	}

	/* Responsive design */
	@media (max-width: 1024px) {
		.queue-item {
			grid-template-columns: 50px 1fr 1.5fr 100px 100px;
			gap: 0.5rem;
		}

		.joined-time {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.queue-header {
			flex-direction: column;
			gap: 1rem;
			align-items: center;
		}

		.queue-item {
			grid-template-columns: 40px 1fr 1fr 80px;
			gap: 0.5rem;
		}

		.stats {
			display: none;
		}

		.queue-title {
			font-size: 2rem;
		}
	}

	@media (max-width: 480px) {
		.queue-item {
			grid-template-columns: 30px 1fr;
			gap: 0.5rem;
		}

		.players, .wait-time {
			display: none;
		}

		.queue-title {
			font-size: 1.8rem;
		}
	}
</style>
