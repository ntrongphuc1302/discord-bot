const {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  data: {
    name: "terminal",
    description: "Execute terminal commands",
    options: [
      {
        name: "command",
        description: "Enter the command to execute",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async execute(interaction) {
    // Permission check (replace with your bot owner's ID)
    if (interaction.user.id !== process.env.discord_bot_owner_id) {
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      const command = interaction.options.getString("command");

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          const errEmbed = new EmbedBuilder()
            .setTitle("An error occurred")
            .setDescription("```" + error.message + "```")
            .setColor("#e32424");

          return interaction.editReply({ embeds: [errEmbed], ephemeral: true });
        }

        const output = stdout || stderr || "No output";

        const resultEmbed = new EmbedBuilder()
          .setTitle("Terminal Command Execution")
          .setDescription("```" + output + "```")
          .setColor("#591bfe")
          .setFooter({
            text: `Executed by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        interaction.editReply({ embeds: [resultEmbed] });
      });
    } catch (error) {
      console.error(`Error executing command: ${error}`);
      const errEmbed = new EmbedBuilder()
        .setTitle("An error occurred")
        .setDescription("```" + error.message + "```")
        .setColor("#e32424");

      await interaction.editReply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};