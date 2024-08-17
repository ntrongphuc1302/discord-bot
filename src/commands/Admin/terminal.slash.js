const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");
const path = require("path");
const { embedErrorColor } = require("../../config");

module.exports = {
  admin: true,
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
    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color || embedBotColor;

    try {
      await interaction.deferReply();

      const command = interaction.options.getString("command");

      // Calculate the parent directory of the current script location
      const scriptDirectory = __dirname;
      const parentDirectory = path.resolve(scriptDirectory, "..");

      exec(command, { cwd: parentDirectory }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          const errEmbed = new EmbedBuilder()
            .setTitle("An error occurred")
            .setDescription("```" + error.message + "```")
            .setColor(embedErrorColor);

          return interaction.editReply({ embeds: [errEmbed], ephemeral: true });
        }

        const output = stdout || stderr || "No output";

        const resultEmbed = new EmbedBuilder()
          .setTitle("Terminal Command Execution")
          .setDescription("```" + output + "```")
          .setColor(botColor);
        // .setFooter({
        //   text: `Executed by ${interaction.user.displayName}`,
        //   iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        // })
        // .setTimestamp();

        interaction.editReply({ embeds: [resultEmbed] });
      });
    } catch (error) {
      console.error(`Error executing command: ${error}`);
      const errEmbed = new EmbedBuilder()
        .setTitle("An error occurred")
        .setDescription("```" + error.message + "```")
        .setColor(embedErrorColor);

      await interaction.editReply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
