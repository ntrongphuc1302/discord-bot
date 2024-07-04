const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("webscreenshot")
    .setDescription("Take a screenshot of a website.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The URL of the website.")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const options = interaction.options;
    const website = options.getString("url");

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(website);
      await page.setViewport({ width: 2560, height: 1440 });

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const screenshot = await page.screenshot();
      await browser.close();

      const buffer = Buffer.from(screenshot, "base64");
      const attachment = new AttachmentBuilder(buffer, {
        name: "screenshot.png",
      });

      const embed = new EmbedBuilder()
        .setImage("attachment://screenshot.png")
        .setColor("#591bfe")
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
        files: [attachment],
      });
    } catch (e) {
      console.error(e);
      await interaction.editReply({
        content: "An error occurred while taking the screenshot.",
        ephemeral: true,
      });
    }
  },
};
