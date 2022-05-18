import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const rr = {

    data: new SlashCommandBuilder()
                .setName('rr')
                .setDescription('create a reaction role(s)')
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('The title of the reaction role embed.')
                    .setRequired(true))
                .addStringOption(option => option
                    .setName('description')
                    .setDescription('The description of the reaction role embed.')
                    .setRequired(true))
                .addRoleOption(option => option
                    .setName('role-1')
                    .setDescription('The first role to choose')
                    .setRequired(true))
                .addRoleOption(option => option
                    .setName('role-2')
                    .setDescription('The second role to choose')
                    .setRequired(false))
                .addRoleOption(option => option
                    .setName('role-3')
                    .setDescription('The third role to choose')
                    .setRequired(false))
                .addRoleOption(option => option
                    .setName('role-4')
                    .setDescription('The fourth role to choose')
                    .setRequired(false))
                .addRoleOption(option => option
                    .setName('role-5')
                    .setDescription('The fifth role to choose')
                    .setRequired(false))
                .addRoleOption(option => option
                    .setName('role-6')
                    .setDescription('The sixth role to choose')
                    .setRequired(false)),

    execute: async (interaction) => {
        
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        const roles = [
            interaction.options.getRole('role-1'),
            interaction.options.getRole('role-2'),
            interaction.options.getRole('role-3'),
            interaction.options.getRole('role-4'),
            interaction.options.getRole('role-5'),
            interaction.options.getRole('role-6')
        ]

        const buttons = [];
        for (let role of roles) {
            if (role) {
                buttons.push(
                    new MessageButton()
                            .setCustomId(`rr-${role.id}`)
                            .setLabel(role.name)
                            .setStyle('PRIMARY')
                );
            }
        }

        const rrEmbed = new MessageEmbed().setTitle(title).setDescription(description);
        const row = new MessageActionRow().addComponents(...buttons);

        await interaction.reply({
            embeds: [rrEmbed],
            components: [row]
        });

        }

}

export { rr as default };