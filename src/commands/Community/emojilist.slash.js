const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojilist")
    .setDescription("Shows all server emojis"),

  async execute(interaction) {
    const emojis = interaction.guild.emojis.cache;
    const emojiCount = emojis.size;

    if (emojiCount === 0) {
      await interaction.reply({
        content: "This server has no custom emojis.",
        ephemeral: true,
      });
      return;
    }

    const maxEmojisPerEmbed = 50; // Adjust as needed
    const emojiChunks = chunkArray([...emojis.values()], maxEmojisPerEmbed);

    let currentIndex = 0; // Start index for emoji numbering

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const embeds = emojiChunks.map((chunk, index) => {
      const embed = new EmbedBuilder()
        .setTitle(
          `Server Emojis [${emojiCount}] (Page ${index + 1}/${
            emojiChunks.length
          })`
        )
        .setColor(botColor)
        .setDescription(
          chunk
            .map(
              (emoji, i) =>
                `${currentIndex + i + 1} - ${emoji.toString()} - \`:${
                  emoji.name
                }:\``
            )
            .join("\n")
        )
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();
      currentIndex += chunk.length;
      return embed;
    });

    // Reply with the first embed
    await interaction.reply({ embeds: [embeds[0]], ephemeral: false });

    // Follow up with additional embeds if there are more than one
    for (let j = 1; j < embeds.length; j++) {
      await interaction.followUp({ embeds: [embeds[j]], ephemeral: false });
    }
  },
};

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
