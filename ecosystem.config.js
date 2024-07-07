module.exports = {
  apps: [
    {
      name: "app",
      script: "node src/index.js",
      watch: ["src"],
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
    },
  ],
};
