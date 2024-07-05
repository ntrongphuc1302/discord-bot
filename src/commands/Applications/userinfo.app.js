const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const { embedBotColor } = require("../../config");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("View Info")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    try {
      const user = interaction.targetUser;
      const member = await interaction.guild.members.fetch(user.id);

      // Fetch roles sorted by position (highest to lowest)
      const roles =
        member.roles.cache
          .filter((role) => role.id !== interaction.guild.id) // Remove @everyone role
          .sort((a, b) => b.position - a.position)
          .map((role) => role.name)
          .join(", ") || "No roles";

      const botMember = await interaction.guild.members.fetch(
        interaction.client.user.id
      );
      const botColor = botMember.roles.highest.color || embedBotColor;

      const isBoosting = member.premiumSince ? "Yes" : "No";
      const joinDate = member.joinedAt
        ? formatDate(member.joinedAt)
        : "Unknown";
      const creationDate = user.createdAt
        ? formatDate(user.createdAt)
        : "Unknown";

      let globalPermissions = "Standard User";

      // Check specific roles for special permissions
      if (member.roles.cache.has("1087611688020365352")) {
        globalPermissions = "Queen";
      } else if (member.roles.cache.has("1087456448872722534")) {
        globalPermissions = "Moderator";
      } else if (member.roles.cache.has("1087459750758854747")) {
        globalPermissions = "Bot";
      }

      // Check if the user is the server owner
      if (user.id === "358614972223193089") {
        globalPermissions = "👑 Server Owner";
      }

      const rolesCount = member.roles.cache.filter(
        (role) => role.id !== interaction.guild.id
      ).size;
      const rolesList =
        roles.length > 1024
          ? `${roles.slice(0, 1021)}...`
          : `\`\`\`${roles}\`\`\``;

      const embed = new EmbedBuilder()
        .setTitle(`${user.displayName}'s Information`)
        // .setTitle(`${member.user}'s Information`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 4096 }))
        .setColor(botColor)
        .addFields(
          {
            name: "Username",
            value: `\`\`\`${user.username}\`\`\``,
            inline: true,
          },
          {
            name: "User ID",
            value: `\`\`\`${user.id}\`\`\``,
          },
          {
            name: "Global permissions",
            value: `\`\`\`${globalPermissions}\`\`\``,
          },
          {
            name: `Roles [ ${rolesCount} ]`,
            value: rolesList,
          },
          {
            name: "Nickname",
            value: `\`\`\`${member.nickname || "No nickname"}\`\`\``,
            inline: true,
          },
          {
            name: "Is boosting",
            value: `\`\`\`${isBoosting}\`\`\``,
            inline: true,
          },
          {
            name: "Joined server on",
            value: `\`\`\`${joinDate}\`\`\``,
          },
          {
            name: "Account created on",
            value: `\`\`\`${creationDate}\`\`\``,
          }
        )
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: false,
      });
    } catch (error) {
      console.error("Error executing context menu command:", error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};

function formatDate(date) {
  const now = new Date();
  const diff = now - date;

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (years > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${years} ${years === 1 ? "year" : "years"} ago)`;
  } else if (months > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${months} ${months === 1 ? "month" : "months"} ago)`;
  } else if (days > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${days} ${days === 1 ? "day" : "days"} ago)`;
  } else if (hours > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${hours} ${hours === 1 ? "hour" : "hours"} ago)`;
  } else if (minutes > 0) {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (${minutes} ${minutes === 1 ? "minute" : "minutes"} ago)`;
  } else {
    return `${date.toLocaleString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })} (just now)`;
  }
}
