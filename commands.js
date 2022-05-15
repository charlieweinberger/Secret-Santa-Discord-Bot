import DiscordJS from 'discord.js';

let sayHello = {
    name: 'hello',
    description: 'says hi!',
    do: (interaction, options) => {
        interaction.reply({
            content: 'hi'
        });
    }
}

let add = {
    name: 'add',
    description: 'adds numbers',
    options: [
        {
            name: 'num1',
            description: 'The first number.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }, {
            name: 'num2',
            description: 'The second number.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }, {
            name: 'num3',
            description: 'The third number.',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    do: (interaction, options) => {
        
        const num1 = options.getNumber('num1') || 0;
        const num2 = options.getNumber('num2') || 0;
        const num3 = options.getNumber('num3') || 0;

        interaction.reply({
            content: `The sum is ${num1 + num2 + num3}`
        });

    }
}

const allCommands = [sayHello, add];

export { allCommands };