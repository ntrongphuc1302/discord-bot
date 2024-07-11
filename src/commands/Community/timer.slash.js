const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Set a timer")
    .addIntegerOption((option) =>
      option.setName("hours").setDescription("Hours").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("minutes").setDescription("Minutes").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("seconds").setDescription("Seconds").setRequired(true)
    ),
  async execute(interaction) {
    const hours = interaction.options.getInteger("hours");
    const minutes = interaction.options.getInteger("minutes");
    const seconds = interaction.options.getInteger("seconds");

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds < 1 || totalSeconds > 3600) {
      return await interaction.reply({
        content: "The total time must be between 1 and 3600 seconds!",
        ephemeral: true,
      });
    }

    let timeString = "";
    if (hours > 0) timeString += `${hours} hours`;
    if (minutes > 0)
      timeString += `${timeString ? ", " : ""}${minutes} minutes`;
    if (seconds > 0)
      timeString += `${timeString ? ", " : ""}${seconds} seconds`;

    const botMember = await interaction.guild.members.fetch(
      interaction.client.user.id
    );
    const botColor = botMember.roles.highest.color;

    const initialEmbed = new EmbedBuilder()
      .setColor(botColor)
      .setTitle(`:timer: Timer set for ${timeString}!`)
      .setFooter({
        text: `Requested by ${interaction.user.displayName}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const initialMessage = await interaction.reply({
      embeds: [initialEmbed],
      fetchReply: true,
    });

    const countdown = async (remainingTime) => {
      for (let i = remainingTime; i > 0; i--) {
        const countdownEmbed = new EmbedBuilder()
          .setColor(botColor)
          .setTitle(`:timer: Timer ends in \`${i}\` seconds!`);

        await interaction.editReply({ embeds: [countdownEmbed] });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await initialMessage.delete();

      const finalEmbed = new EmbedBuilder()
        .setColor(botColor)
        .setTitle(`:alarm_clock: Timer done!`)
        .setTimestamp();

      await interaction.followUp({
        content: `${interaction.user.toString()}`,
        embeds: [finalEmbed],
      });
    };

    if (totalSeconds <= 15) {
      await countdown(totalSeconds);
    } else {
      setTimeout(async () => {
        await countdown(15);
      }, (totalSeconds - 15) * 1000);
    }
  },
};
