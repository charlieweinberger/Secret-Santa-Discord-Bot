import { SlashCommandBuilder } from '@discordjs/builders';

const AddNums = {

    data: new SlashCommandBuilder()
                .setName('add')
                .setDescription('adds numbers')
                .addNumberOption(option => option
                    .setName('num-1')
                    .setDescription('The first number.')
                    .setRequired(true))
                .addNumberOption(option => option
                    .setName('num-2')
                    .setDescription('The second number.')
                    .setRequired(true))
                .addNumberOption(option => option
                    .setName('num-3')
                    .setDescription('The third number.')
                    .setRequired(false))
                .addNumberOption(option => option
                    .setName('num-4')
                    .setDescription('The fourth number.')
                    .setRequired(false))
                .addNumberOption(option => option
                    .setName('num-5')
                    .setDescription('The fifth number.')
                    .setRequired(false))
                .addNumberOption(option => option
                    .setName('num-6')
                    .setDescription('The sixth number.')
                    .setRequired(false))
                .addNumberOption(option => option
                    .setName('num-7')
                    .setDescription('The seventh number.')
                    .setRequired(false))
                .addNumberOption(option => option
                    .setName('num-8')
                    .setDescription('The eigth number.')
                    .setRequired(false))
                .addNumberOption(option => option
                    .setName('num-9')
                    .setDescription('The ninth number.')
                    .setRequired(false))
                .addNumberOption(option => option
                    .setName('num-10')
                    .setDescription('The tenth number.')
                    .setRequired(false)),

    execute: async (interaction) => {
        
            const nums = [
                interaction.options.getNumber('num-1'),
                interaction.options.getNumber('num-2'),
                interaction.options.getNumber('num-3'),
                interaction.options.getNumber('num-4'),
                interaction.options.getNumber('num-5'),
                interaction.options.getNumber('num-6'),
                interaction.options.getNumber('num-7'),
                interaction.options.getNumber('num-8'),
                interaction.options.getNumber('num-9'),
                interaction.options.getNumber('num-10')
            ];

            await interaction.reply({
                content: `The sum is ${nums.reduce((a, b) => a + b)}`
            });

        }

}

export { AddNums as default };