<script>
	import github from '$lib/images/github.svg';
</script>

<header>
	<div class="corner">
		<div class="logo">
			<span class="logo-emoji">🦍</span>
			<span class="logo-text">ApeSquad</span>
		</div>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li>
				<a href="/">Rankings</a>
			</li>
			<li>
				<a href="/queue">Queue</a>
			</li>
			<li>
				<a href="/about">About</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<a href="https://github.com/yuriko2000/ApeSquadNeatQueue" target="_blank" rel="noopener noreferrer">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.5rem;
		min-height: 4em;
		border-bottom: 1px solid var(--color-border);
		box-sizing: border-box;
		width: 100%;
	}

	.corner {
		width: 12em;
		height: 3em;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		gap: 0.75rem;
	}

	.logo-emoji {
		font-size: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.logo-text {
		font-weight: 700;
		font-size: 1.3rem;
		color: var(--color-theme-1);
		white-space: nowrap;
		letter-spacing: 0.05em;
		line-height: 1.2;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: var(--color-card-bg);
		flex: 1;
		max-width: 20em;
		margin: 0 1rem;
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	/* Responsive design for smaller screens */
	@media (max-width: 768px) {
		header {
			padding: 0.5rem 1rem;
		}

		.corner {
			width: 9em;
		}

		.logo-text {
			font-size: 1.1rem;
		}

		.logo-emoji {
			font-size: 1.5rem;
		}

		nav {
			max-width: 15em;
			margin: 0 0.5rem;
		}
	}

	@media (max-width: 480px) {
		header {
			padding: 0.25rem 0.5rem;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.corner {
			width: 7em;
			height: 3em;
		}

		.logo-text {
			font-size: 1rem;
		}

		.logo-emoji {
			font-size: 1.25rem;
		}

		nav {
			max-width: 12em;
			margin: 0;
			order: 3;
			width: 100%;
		}
	}
</style>
