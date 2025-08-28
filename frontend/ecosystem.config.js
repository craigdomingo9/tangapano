module.exports = {
  apps: [
    {
      name: 'tangapano',     // Custom app name
      script: 'npm',           // Use npm to run the app
      args: 'start',           // Script args: `npm start`
      instances: 'max',        // Use all CPU cores (optional)
      exec_mode: 'cluster',    // Enable clustering (optional)
      env: {
        NODE_ENV: 'production',
        PORT: 3000,            // Set port (change if needed)
      },
    },
  ],
};