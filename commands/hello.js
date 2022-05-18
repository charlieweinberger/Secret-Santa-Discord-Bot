import { SlashCommandBuilder } from '@discordjs/builders';

const Hello = {

    data: new SlashCommandBuilder()
                .setName('hello')
                .setDescription('says hi!'),
    
    execute: async (interaction) => {
        interaction.reply({
            content: 'hi!'
        });
    }

}

export { Hello as default };