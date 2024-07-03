const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const models = require("../../data/models.js"); // Assuming models array is correctly exported

module.exports = {
  data: {
    name: "imagine",
    description: "Generate an image using a prompt.",
    options: [
      {
        name: "prompt",
        description: "Enter your prompt",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "model",
        description: "The image model",
        type: ApplicationCommandOptionType.String,
        choices: models.map((model) => ({
          name: model.name,
          value: model.value,
        })),
        required: false,
      },
    ],
  },

  async execute(interaction) {
    // Permission check
    if (interaction.member.id !== process.env.discord_bot_owner_id) {
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      const { default: Replicate } = await import("replicate");

      const replicate = new Replicate({
        auth: process.env.replicate_api_key,
      });

      const prompt = interaction.options.getString("prompt");
      const model = interaction.options.getString("model") || models[0].value;

      const output = await replicate.run(model, { input: { prompt } });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Download")
          .setStyle(ButtonStyle.Link)
          .setURL(output[0])
          .setEmoji("1101133529607327764")
      );

      const resultEmbed = new EmbedBuilder()
        .setTitle("Image Generated")
        .addFields({ name: "Prompt", value: `\`\`\`${prompt}\`\`\`` })
        .setImage(output[0])
        .setColor("#591bfe")
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.editReply({
        embeds: [resultEmbed],
        components: [row],
      });
    } catch (error) {
      const errEmbed = new EmbedBuilder()
        .setTitle("An error occurred")
        .setDescription("```" + error + "```")
        .setColor(0xe32424);

      await interaction.editReply({ embeds: [errEmbed] });
    }
  },
};
