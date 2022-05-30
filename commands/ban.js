const { SlashCommandBuilder } = require('@discordjs/builders');
const { owners } = require('./../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Kişi banlar.')
        .addUserOption(
            option =>
                option
                    .setName('hedef')
                    .setDescription('Banlanacak kişiyi seçin.')
                    .setRequired(true))
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Ban sebebini girin.')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.message.member.hasPermission('BAN_MEMBERS')) return interaction.reply({ content: 'Bu komutu kullanmak için yetkin yok.', empheral: true });
        if (!interaction.message.guild.me.hasPermission('BAN_MEMBERS')) return interaction.reply({ content: 'Hata! Bu komutu kullanmak için botun "BAN" yetkisi olması gerekiyor.', empheral: t });

        const sebep = interaction.getOption('sebep');
        if (isNaN(sebep)) sebep = 'Sebep girilmedi';
        sebep = sebep.replace(/\n/g, ' ');
        sebep = `${sebep} | ${interaction.message.author.tag}`;
        const user = interaction.options.getUser('hedef');
        if (!user) return interaction.reply('Kişi seçmedin.');
        if (user.id === interaction.message.author.id) return interaction.reply({ content: 'Kendini banlayamazsın.', empheral: true });
        if (user.id === interaction.client.user.id) return interaction.reply({ content: 'Beni banlayamazsın.', empheral: true });

        owners.forEach(owner => {
            if (user.id === owner) return interaction.reply({ content: 'Sahibimi banlayamazın.', empheral: true });
        });

        // Check if the user is already banned
        const bans = await interaction.client.database.bans.find({
            guild: interaction.message.guild.id,
            user: user.id
        });
        if (bans.length > 0) return interaction.reply({ content: 'Kişi zaten banlı.', empheral: true });
        // Check if the user has a higher role than the bot
        if (user.roles.highest.position >= interaction.message.member.roles.highest.position) return interaction.reply({ content: 'Kişi yetkiliyi yada daha yüksek bir rolü taşıyamazsın.', empheral: true });
        // Ban the user
        await interaction.message.guild.members.ban(user, {
            reason: sebep
        });
        // Make the confirmation embed
        const embed = interaction.client.embeds.createEmbed()
            .setTitle('Ban')
            .setDescription(`${user.tag} banlandı.`)
            .setColor(interaction.client.colors.red)
            .setFooter(`${interaction.message.author.tag} tarafından banlandı.`);
        // Send the confirmation embed
        interaction.reply({ embed });
    },
};
