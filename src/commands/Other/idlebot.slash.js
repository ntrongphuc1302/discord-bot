const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Eris = require("eris");

// Bot instance
const bot = new Eris(process.env.discord_token);

let isBotOnline = false;

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("idlebot")
    .setDescription("Manage the Discord idle bot")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action to perform")
        .setRequired(true)
        .addChoices(
          { name: "start", value: "start" }
          //   { name: "stop", value: "stop" },
          //   { name: "status", value: "status" }
        )
    ),
  async execute(interaction) {
    const action = interaction.options.getString("action");

    const botColor = 0xff0000; // Replace with your desired embed color in Eris

    if (action === "start") {
      await interaction.deferReply();

      if (isBotOnline) {
        const embed = new EmbedBuilder()
          .setColor(botColor)
          .setTitle("Discord Idle Bot")
          .setDescription("The Discord idle bot is already running.");

        return interaction.editReply({ embeds: [embed] });
      }

      bot.once("ready", async () => {
        isBotOnline = true;

        const embed = new EmbedBuilder()
          .setColor(botColor)
          .setTitle("Discord Idle Bot")
          .setDescription("Successfully logged into Discord and idling.");

        interaction.editReply({ embeds: [embed] });
      });

      bot.on("error", async (err) => {
        isBotOnline = false;

        const embed = new EmbedBuilder()
          .setColor(botColor)
          .setTitle("Discord Idle Bot")
          .setDescription(`Failed to log into Discord: ${err.message}`);

        interaction.editReply({ embeds: [embed] });
      });

      bot.connect();
    }

    // if (action === "stop") {
    //   await interaction.deferReply();

    //   if (!isBotOnline) {
    //     const embed = new EmbedBuilder()
    //       .setColor(botColor)
    //       .setTitle("Discord Idle Bot")
    //       .setDescription("The Discord idle bot is not running.");

    //     return interaction.editReply({ embeds: [embed] });
    //   }

    //   bot.disconnect({ reconnect: false });

    //   const embed = new EmbedBuilder()
    //     .setColor(botColor)
    //     .setTitle("Discord Idle Bot")
    //     .setDescription("The Discord idle bot has been stopped.");

    //   interaction.editReply({ embeds: [embed] });

    //   isBotOnline = false;
    // }

    // if (action === "status") {
    //   const status = isBotOnline ? "running" : "stopped";
    //   const embed = new EmbedBuilder()
    //     .setColor(botColor)
    //     .setTitle("Discord Idle Bot")
    //     .setDescription(`The Discord idle bot is currently ${status}.`);

    //   await interaction.reply({ embeds: [embed] });
    // }
  },
};
