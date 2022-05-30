const { SlashCommandBuilder } = require('@discordjs/builders');
const { owners } = require('./config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Kişi banlayın.')
        .addUserOption(
            option =>
                option
                    .setName('hedef')
                    .setDescription('Banlanacak kişiyi seçin.')
                    .require(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Ban sebebini girin.')
                .require(false)),
    async execute(interaction) {
        if (!interaction.message.member.hasPermission('BAN_MEMBERS')) return interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', empheral: true });
        if (!interaction.message.guild.me.hasPermission('BAN_MEMBERS')) return interaction.reply({ content: 'Hata! Bu komutu kullanmak için botun "BAN" yetkisi olması gerekiyor.', empheral: t });

        const reason = interaction.getOption('reason');
        const user = interaction.options.getUser('target');
        if (!user) return interaction.reply('Kişi seçmedin.');
        if (user.id === interaction.message.author.id) return interaction.reply('Kendini banlayamazsın.');
        if (user.id === interaction.client.user.id) return interaction.reply('Beni banlayamazsın.');

        owners.forEach(owner => {
            if (user.id === owner) return interaction.reply('Sahibimi banlayamazın.');
        });

        // Check if the user is already banned
        const bans = await interaction.client.database.bans.find({
            guild: interaction.message.guild.id,
            user: user.id
        });
        if (bans.length > 0) return interaction.reply('Kişi zaten banlı.');
        // Check if the user has a higher role than the bot
        if (user.roles.highest.position >= interaction.message.member.roles.highest.position) return interaction.reply('Kişi yetkiliyi yada daha yüksek bir rolü taşıyamazsın.');
        // Ban the user
        await interaction.message.guild.members.ban(user, {
            reason: reason
        });
    },
};
