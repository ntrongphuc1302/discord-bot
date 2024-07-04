const {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const { exec } = require("child_process");

module.exports = {
  data: {
    name: "git",
    description: "Execute Git commands",
    options: [
      {
        name: "command",
        description: "Select the Git command to execute",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "add",
            value: "add",
          },
          {
            name: "commit",
            value: "commit",
          },
          {
            name: "push",
            value: "push",
          },
          {
            name: "reset",
            value: "reset",
          },
        ],
      },
      {
        name: "message",
        description: "Commit message (required for commit subcommand)",
        type: ApplicationCommandOptionType.String,
        required: false,
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
      let gitCommand;

      switch (command) {
        case "add":
          gitCommand = "git add .";
          break;
        case "commit":
          let commitMessage = interaction.options.getString("message");
          if (!commitMessage) {
            commitMessage = "update"; // Default commit message
          }
          gitCommand = `git commit -m "${commitMessage}"`;
          break;
        case "push":
          gitCommand = "git push -u origin main";
          break;
        case "reset":
          gitCommand = "git reset --hard";
          break;
        default:
          return await interaction.editReply({
            content: "Invalid command option.",
            ephemeral: true,
          });
      }

      exec(gitCommand, (error, stdout, stderr) => {
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
          .setTitle("Git Command Execution")
          .addFields({ name: "Command", value: `\`\`\`${gitCommand}\`\`\`` })
          .addFields({ name: "Output", value: `\`\`\`${output}\`\`\`` })
          .setColor("#591bfe")
          .setFooter({
            text: `Executed by ${interaction.user.displayName}`,
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
