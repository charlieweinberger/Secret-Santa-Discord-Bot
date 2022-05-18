import { SlashCommandBuilder } from '@discordjs/builders';

const Bye = {

    data: new SlashCommandBuilder()
    .setName('bye')
    .setDescription('says goodbye!'),
    
    execute: async (interaction) => {
        interaction.reply({
            content: 'goodbye!'
        });
    }

}

export { Bye as default };