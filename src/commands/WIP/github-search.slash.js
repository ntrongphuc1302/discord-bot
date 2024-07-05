const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const puppeteer = require("puppeteer");
const { embedBotColor } = require("../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wip-github-search")
    .setDescription("Search for a GitHub repository.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query to search for.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const query = options.getString("query");
    await interaction.deferReply();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    var url = `https://github.com/search?q=${query}&type=repositories`;
    await page.goto(url);

    const data = await page.evaluate(() => {
      const results = [];
      const dataElements = document.querySelectorAll(
        '[data-testid="results-list"] > .Box-sc-g0xbh4-0.kXssRI'
      );

      dataElements.forEach((dataElement) => {
        const titleElement = dataElement.querySelector(
          ".Box-sc-g0xbh4-0.bBwPjs search-title"
        );
        const languageElement = dataElement.querySelector(
          ".Box-sc-g0xbh4-0.DUrqY .gPDEWA"
        );

        if (titleElement) {
          const dataObj = {
            title: titleElement.textContent.trim(),
            link: titleElement.href,
            language: languageElement
              ? languageElement.textContent.trim()
              : "N/A",
          };
          results.push(dataObj);
        }
      });

      return results;
    });

    await browser.close();

    if (data.length <= 0) {
      return await interaction.editReply({
        content: `Nothing matching with query: \`${query}\`! Please try again after a few seconds.`,
        ephemeral: true,
      });
    }

    const format = data.map(
      (item) => `[${item.title}](${item.link}); Language: ${item.language}`
    );

    var fixedUrl = url.replace(/ /g, "%");
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("View All")
        .setURL(fixedUrl)
        .setStyle(ButtonStyle.Link)
    );

    const embed = new EmbedBuilder()
      .setColor(embedBotColor)
      .setTitle(`GitHub Repository Matching: \`${query}\``)
      .setDescription(format.join("\n"))
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      components: [button],
    });
  },
};
