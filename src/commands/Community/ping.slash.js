const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get bot current ping!"),
  async execute(interaction, client) {
    const ping = client.ws.ping;
    await interaction.reply({
      content: `Pong! ${ping}ms`,
      //   ephemeral: true,
    });
  },
};
