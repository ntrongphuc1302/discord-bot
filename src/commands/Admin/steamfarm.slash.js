const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const { games1, games2 } = require("../../data/steamgameid"); // Adjust the path as necessary

const user1 = new SteamUser();
const user2 = new SteamUser();
let isLoggedOn1 = false;
let isLoggedOn2 = false;

const logOnOptions1 = {
  accountName: process.env.steam_username,
  password: process.env.steam_password,
  twoFactorCode: SteamTotp.generateAuthCode(process.env.steam_shared),
};

const logOnOptions2 = {
  accountName: process.env.steam_username2,
  password: process.env.steam_password2,
  twoFactorCode: SteamTotp.generateAuthCode(process.env.steam_shared2),
};

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("steamfarm")
    .setDescription("Manage the Steam farming bot")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Action to perform")
        .setRequired(true)
        .addChoices(
          { name: "start", value: "start" },
          { name: "stop", value: "stop" },
          { name: "status", value: "status" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("account")
        .setDescription("Account to manage")
        .setRequired(true)
        .addChoices(
          { name: "PeterKing", value: "account1" },
          { name: "Slime", value: "account2" }
        )
    ),
  async execute(interaction) {
    const action = interaction.options.getString("action");
    const account = interaction.options.getString("account");

    let user, isLoggedOn, logOnOptions, games;

    if (account === "account1") {
      user = user1;
      isLoggedOn = isLoggedOn1;
      logOnOptions = logOnOptions1;
      games = games1;
    } else if (account === "account2") {
      user = user2;
      isLoggedOn = isLoggedOn2;
      logOnOptions = logOnOptions2;
      games = games2;
    }

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    if (action === "start") {
      await interaction.deferReply();

      if (isLoggedOn) {
        const embed = new EmbedBuilder()
          .setColor("YELLOW")
          .setTitle("Steam Farming Bot")
          .setDescription(
            `The Steam farming bot for ${account} is already running.`
          );

        return interaction.editReply({ embeds: [embed] });
      }

      user.logOn(logOnOptions);

      user.once("loggedOn", async () => {
        if (account === "account1") {
          isLoggedOn1 = true;
        } else if (account === "account2") {
          isLoggedOn2 = true;
        }
        user.setPersona(1);
        user.gamesPlayed(games);

        const embed = new EmbedBuilder()
          .setColor(botColor)
          .setTitle("Steam Farming Bot")
          .setDescription(
            `User: ${logOnOptions.accountName} - Successfully logged into Steam.`
          );

        interaction.editReply({ embeds: [embed] });
      });

      user.once("error", async (err) => {
        if (account === "account1") {
          isLoggedOn1 = false;
        } else if (account === "account2") {
          isLoggedOn2 = false;
        }

        const embed = new EmbedBuilder()
          .setColor(botColor)
          .setTitle("Steam Farming Bot")
          .setDescription(`Failed to log into Steam: ${err.message}`);

        interaction.editReply({ embeds: [embed] });
      });
    }

    if (action === "stop") {
      await interaction.deferReply();

      if (!isLoggedOn) {
        const embed = new EmbedBuilder()
          .setColor(botColor)
          .setTitle("Steam Farming Bot")
          .setDescription(
            `The Steam farming bot for ${account} is not running.`
          );

        return interaction.editReply({ embeds: [embed] });
      }

      user.logOff();
      if (account === "account1") {
        isLoggedOn1 = false;
      } else if (account === "account2") {
        isLoggedOn2 = false;
      }

      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setTitle("Steam Farming Bot")
        .setDescription(
          `The Steam farming bot for ${account} has been stopped.`
        );

      interaction.editReply({ embeds: [embed] });
    }

    if (action === "status") {
      const status = isLoggedOn ? "running" : "stopped";
      const embed = new EmbedBuilder()
        .setColor(botColor)
        .setTitle("Steam Farming Bot")
        .setDescription(
          `The Steam farming bot for ${account} is currently ${status}.`
        );

      await interaction.reply({ embeds: [embed] });
    }
  },
};
