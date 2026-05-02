module.exports = {
  apps: [
    {
      name: 'dosusupplements',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3005',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
      },
    },
  ],
};
