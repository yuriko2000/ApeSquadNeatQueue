<svelte:head>
	<title>About - ApeSquad NeatQueue</title>
	<meta name="description" content="About ApeSquad NeatQueue Rankings" />
</svelte:head>

<div class="text-column">
	<h1>About ApeSquad NeatQueue</h1>

	<p>
		Welcome to the ApeSquad NeatQueue Rankings platform! This website displays real-time leaderboards 
		and statistics from our Discord bot gaming community.
	</p>

	<h2>What is NeatQueue?</h2>
	<p>
		NeatQueue is a powerful Discord bot platform that manages gaming queues, tournaments, and player 
		rankings in Discord servers. Our ApeSquad community uses this system to track competitive gaming 
		performance and maintain fair, organized gameplay.
	</p>

	<h2>Features</h2>
	<ul>
		<li><strong>Real-time Rankings:</strong> Live leaderboard updates from our Discord bot</li>
		<li><strong>Player Statistics:</strong> Detailed win rates, levels, and game performance</li>
		<li><strong>Dark Theme:</strong> Minimalistic design optimized for extended viewing</li>
		<li><strong>Mobile Responsive:</strong> Access rankings from any device</li>
	</ul>

	<h2>Technology</h2>
	<p>
		This platform is built with <a href="https://svelte.dev/docs/kit" target="_blank" rel="noopener noreferrer">SvelteKit</a> 
		and integrates with the NeatQueue Discord bot API to provide seamless data synchronization.
	</p>

	<p>
		Join our Discord community to participate in ranked matches and climb the leaderboard!
	</p>
</div>

<style>
	.text-column {
		max-width: 48rem;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h2 {
		color: var(--color-theme-1);
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	strong {
		color: var(--color-theme-2);
	}
</style>
