<script>
	import Leaderboard from './Leaderboard.svelte';
</script>

<svelte:head>
	<title>ApeSquad NeatQueue Rankings</title>
	<meta name="description" content="ApeSquad Discord Bot Rankings - powered by NeatQueue" />
</svelte:head>

<main>
	<Leaderboard />
</main>

<style>
	main {
		min-height: 100vh;
		padding: 2rem 0;
	}
</style>
