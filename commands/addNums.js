import { Constants } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

// don't we still need to set the type of the input? number vs string vs bool

const AddNums = {

    data: new SlashCommandBuilder()
                .setName('add')
                .setDescription('adds numbers')
                .addStringOption(option => option
                    .setName('num-1')
                    .setDescription('The first number.')
                    .setRequired(true))
                .addStringOption(option => option
                    .setName('num-2')
                    .setDescription('The second number.')
                    .setRequired(true))
                .addStringOption(option => option
                    .setName('num-3')
                    .setDescription('The third number.')
                    .setRequired(false))
                .addStringOption(option => option
                    .setName('num-4')
                    .setDescription('The fourth number.')
                    .setRequired(false))
                .addStringOption(option => option
                    .setName('num-5')
                    .setDescription('The fifth number.')
                    .setRequired(false))
                .addStringOption(option => option
                    .setName('num-6')
                    .setDescription('The sixth number.')
                    .setRequired(false))
                .addStringOption(option => option
                    .setName('num-7')
                    .setDescription('The seventh number.')
                    .setRequired(false))
                .addStringOption(option => option
                    .setName('num-8')
                    .setDescription('The eigth number.')
                    .setRequired(false))
                .addStringOption(option => option
                    .setName('num-9')
                    .setDescription('The ninth number.')
                    .setRequired(false))
                .addStringOption(option => option
                    .setName('num-10')
                    .setDescription('The tenth number.')
                    .setRequired(false)),

    execute: async (interaction) => {
        
            const num1  = interaction.options.getNumber('num-1');
            const num2  = interaction.options.getNumber('num-2');
            const num3  = interaction.options.getNumber('num-3');
            const num4  = interaction.options.getNumber('num-4');
            const num5  = interaction.options.getNumber('num-5');
            const num6  = interaction.options.getNumber('num-6');
            const num7  = interaction.options.getNumber('num-7');
            const num8  = interaction.options.getNumber('num-8');
            const num9  = interaction.options.getNumber('num-9');
            const num10 = interaction.options.getNumber('num-10');

            interaction.reply({
                content: `The sum is ${num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10}!`
            });

        }

}

export { AddNums as default };