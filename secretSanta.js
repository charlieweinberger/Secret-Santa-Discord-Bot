import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const commandName = 'hello';
const participants = {};

let waitingForName = false;
let waitingForWishlist = false;

const secretSanta = {

    data: new SlashCommandBuilder()
                .setName('secret-santa')
                .setDescription('Start a game of Secret Santa!'),

    executeCommand: async (interaction) => {

        const ssEmbed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription("Play Secret Santa!");
        
        const ssComponents = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`${commandName}-join`)
                .setLabel('Join')
                .setStyle('PRIMARY')
        );

        await interaction.reply({
            embeds: [ssEmbed],
            components: [ssComponents]
        });

        const dmEmbed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription("You just started a game of Secret Santa. Tell your friends to click the blue button to join the game. To randomly assign everyone a partner, press the button below.");

        const dmComponents = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`${commandName}-assign`)
                .setLabel('Assign')
                .setStyle('PRIMARY')
        );

        await interaction.user.send({
            embeds: [dmEmbed],
            components: [dmComponents]
        });

    },

    executeButton: async (interaction) => {

        const { customId, user } = interaction;

        const customIdPrefix = customId.split('-')[0];
        const customIdId = customId.split('-').at(-1);

        if (customIdPrefix == commandName) {
            
            await interaction.deferUpdate();

            if (customIdId == 'join') {

                await user.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Secret Santa")
                            .setDescription("You just joined a game of secret santa. To play, please enter your name.")
                    ]
                });

                waitingForName = true;

                participants[user.discriminator] = {
                    'name': '',
                    'wishlist': []
                };

            } else if (customIdId == 'assign') {

                await user.send({
                    content: 'You just started assigning players to each other in a game of secret santa.'
                });

            } else if (customIdId == 'review wishlist') {

                waitingForWishlist = false;

                await user.send({
                    content: 'review wishlist: lol'
                });

            }

        }

    }

}

async function executeMessage(message) {
    
    console.log('executeMessage');

    const user = message.author;
    const participant = participants[user.discriminator];
    
    if (waitingForName) {

        console.log('waitingForName');

        participant['name'] = message.content;
        waitingForName = false;
        waitingForWishlist = true;

        const embed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription("Now, add any items you'd like to recieve to your wishlist. This will help your gifter decide what to get for you. Any message you send will be its own item. When you are finished, press the button below.");
        
        const button = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`${commandName}-end wishlist`)
                .setLabel('Review Wishlist')
                .setStyle('PRIMARY')
        );

        await user.send({
            embeds: [embed],
            components: [button]
        });

    }
    
    else if (waitingForWishlist) {

        console.log('waitingForWishlist');

        participant['wishlist'].push(message.content);

        const embed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription(`Added item to wishlist: ${message.content}`);

        const button = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`${commandName}-end wishlist`)
                .setLabel('Review Wishlist')
                .setStyle('PRIMARY')
        );

        await user.send({
            embeds: [embed],
            components: [button]
        });

    }

};

export { secretSanta, executeMessage };