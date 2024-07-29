const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const SteamTotp = require("steam-totp");

module.exports = {
  admin: true,
  data: new SlashCommandBuilder()
    .setName("steamcode")
    .setDescription(
      "Send the Steam authentication code for the selected account"
    )
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription("Select the account")
        .setRequired(true)
        .addChoices(
          { name: "PeterKing", value: "account1" },
          { name: "Slime", value: "account2" }
        )
    ),
  async execute(interaction) {
    const userChoice = interaction.options.getString("user");

    let authCode;
    if (userChoice === "account1") {
      authCode = SteamTotp.generateAuthCode(process.env.steam_shared);
    } else if (userChoice === "account2") {
      authCode = SteamTotp.generateAuthCode(process.env.steam_shared2);
    }

    // Get the bot's color from the guild's highest role
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || "#1e1f22"; // Default to black if no color is set

    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setTitle("Steam Authentication Code")
      .setDescription(
        `The authentication code for ${
          userChoice === "account1" ? "PeterKing" : "Slime"
        } is: ${authCode}`
      );

    await interaction.reply({ embeds: [embed] });
  },
};
