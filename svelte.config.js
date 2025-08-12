import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // Try to enable fallback for SPA mode
      fallback: 'index.html'
    }),
    paths: {
      base: "",
    },
    outDir: "build",
  },
};

export default config;
