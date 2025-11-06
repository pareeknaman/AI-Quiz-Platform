import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // --- THIS IS THE FIX ---
    // We changed the port from 5173 to 3000
    // to match the `vercel dev` server.
    baseUrl: "http://localhost:3000",
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
