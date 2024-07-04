const { REST, Routes } = require("discord.js");
require("dotenv").config({
  path: require("path").resolve(__dirname, ".env"),
});

const botID = process.env.discord_bot_id;
const token = process.env.discord_bot_token;

if (!token) {
  console.error(
    "Uh-oh! It looks like the bot token is missing. Please set it in your .env file."
  );
  process.exit(1);
}

const rest = new REST().setToken(token);

const removeSlashCommands = async () => {
  try {
    await rest.put(Routes.applicationCommands(botID), { body: [] });
    console.log("🗑️ Successfully deleted all application commands.");
  } catch (error) {
    console.error(
      "⚠️ Oops! There was an error deleting the application commands:",
      error
    );
  }
};

removeSlashCommands();
