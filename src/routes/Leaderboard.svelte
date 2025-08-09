<script>
	import { onMount } from 'svelte';

	let rankings = [];
	let loading = true;
	let error = null;

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

	onMount(() => {
		fetchLeaderboard();
	});
</script>

<div class="leaderboard">
	<div class="leaderboard-card">
		<div class="leaderboard-header">
			<h1 class="leaderboard-title">ApeSquad Rankings</h1>
			<button on:click={fetchLeaderboard} disabled={loading}>
				{loading ? 'Refreshing...' : 'Refresh'}
			</button>
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
				{#each rankings as player, index}
					<div class="rank-item">
						<div class="rank-number {getRankClass(index)}">
							{index + 1}
						</div>
						<div class="user-info">
							<div class="username">{player.username}</div>
							<div class="user-stats">
								Level {player.level} • {formatNumber(player.wins)} wins • {getWinRate(player.wins, player.gamesPlayed)}% win rate
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
	button {
		background: var(--color-theme-1);
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.2s ease;
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
</style>
