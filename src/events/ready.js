const { ActivityType } = require("discord.js");
const {
  playingNames,
  streamingNames,
  watchingNames,
  listeningNames,
  competingNames,
  customNames,
} = require("../data/activities");
const mongoose = require("mongoose");
const mongoURI = process.env.mongo_uri;

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const activities = [
      {
        name: playingNames[Math.floor(Math.random() * playingNames.length)],
        type: ActivityType.Playing,
      },
      {
        name: streamingNames[Math.floor(Math.random() * streamingNames.length)],
        type: ActivityType.Streaming,
        url: "https://youtu.be/dQw4w9WgXcQ",
      },
      {
        name: watchingNames[Math.floor(Math.random() * watchingNames.length)],
        type: ActivityType.Watching,
      },
      {
        name: listeningNames[Math.floor(Math.random() * listeningNames.length)],
        type: ActivityType.Listening,
      },
      {
        name: competingNames[Math.floor(Math.random() * competingNames.length)],
        type: ActivityType.Competing,
      },
      {
        type: ActivityType.Custom,
        name: customNames[Math.floor(Math.random() * customNames.length)],
      },
    ];

    const setRandomActivity = () => {
      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(randomActivity);
    };

    setRandomActivity();

    setInterval(setRandomActivity, 1000 * 60 * 60);

    if (!mongoURI) return;

    try {
      await mongoose.connect(mongoURI || "");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }

    console.log("Bot Online!");
  },
};
