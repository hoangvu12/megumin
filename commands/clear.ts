import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

export default {
  data: new SlashCommandBuilder().setName("clear").setDescription(i18n.__("clear.description")),
  execute(interaction: ChatInputCommandInteraction) {
    const guildMemer = interaction.guild!.members.cache.get(interaction.user.id);

    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue)
      return interaction.reply({ content: i18n.__("clear.errorNotQueue"), ephemeral: true }).catch(console.error);

    if (!canModifyQueue(guildMemer!)) return i18n.__("common.errorNotChannel");

    queue.songs = [];

    queue.stop();

    interaction.reply({ content: i18n.__("clear.result") });
  }
};
