const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("askbot")
    .setDescription("Ask the bot a question.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to ask the bot.")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: false });

      const { options } = interaction;
      const prompt = options.getString("prompt");

      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto("https://chat-app-f2d296.zapier.app/");

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await page.waitForSelector('textarea[placeholder="automate"]');
      await page.focus('textarea[placeholder="automate"]');
      await page.keyboard.type(prompt);
      await page.keyboard.press("Enter");

      await new Promise((resolve) => setTimeout(resolve, 30000));

      await page.waitForSelector('[data-testid="bot-message"] p');

      var value = await page.$$eval(
        '[data-testid="bot-message"]',
        async (elements) => {
          return elements.map((element) => element.textContent);
        }
      );

      // setTimeout(async () => {
      //   if (value.length == 0) {
      //     await interaction.editReply({
      //       content: "An error occurred while asking the bot.",
      //       ephemeral: true,
      //     });
      //     return;
      //   }
      // });
      await browser.close();

      value.shift();

      const embed = new EmbedBuilder()
        .setColor("#591bfe")
        .setTitle("Bot Response:")
        // .setDescription(`\`\`\`${value.join("\n\n\n\n")}\`\`\``)
        .setDescription(`${value.join("\n")}`)
        .setFooter({
          text: `Requested by ${interaction.user.displayName}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while processing your request.",
        ephemeral: false,
      });
    }
  },
};
