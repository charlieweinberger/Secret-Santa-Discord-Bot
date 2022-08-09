import { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});
client.commands = new Collection();

const participants = {};

let state = "";

new SlashCommandBuilder()
    .setName('secret-santa')
    .setDescription('Start a game of Secret Santa!');

client.once('ready', () => console.log('Bot is ready!'));

client.on('interactionCreate', async (interaction) => {

    if (interaction.isCommand()) {
        
        const ssEmbed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription("Play Secret Santa!");
        
        const ssComponents = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`join`)
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
                .setCustomId(`assign`)
                .setLabel('Assign')
                .setStyle('PRIMARY')
        );

        await interaction.user.send({
            embeds: [dmEmbed],
            components: [dmComponents]
        });

    }
	
    if (interaction.isButton()) {

        const { customId, user } = interaction;
            
        await interaction.deferUpdate();

        if (customId == 'join') {

            await user.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Secret Santa")
                        .setDescription("You just joined a game of secret santa. To play, please enter your name.")
                ]
            });

            state = "create name";

            participants[user.discriminator] = {
                'name': '',
                'wishlist': []
            };

        } else if (customId == 'review info') {

            const components = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`edit name`)
                    .setLabel('Edit Name')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`add item to wishlist`)
                    .setLabel('Add Item To Wishlist')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`remove item from wishlist`)
                    .setLabel('Remove Item From Wishlist')
                    .setStyle('PRIMARY')
            );

            let wishlistString = "";
            for (const item of participants[user.discriminator]["wishlist"]) {
                wishlistString += item + "\n";
            }

            await user.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Your Name & Wishlist")
                        .setDescription("Here is a list of everything you have added to your wishlist. To edit your name or wishlist, click the buttons below. You can edit your wishlist at any time up until you are assigned to another person.")
                        .addFields([
                            {
                                name: "Name",
                                value: participants[user.discriminator]["name"],
                                inline: true
                            },
                            {
                                name: "Wishlist",
                                value: wishlistString,
                                inline: true
                            }
                        ])
                ],
                components: [components]
            });

            state = "";

        } else if (customId == 'edit name') {
            
            await user.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Secret Santa")
                        .setDescription("Please enter your new name below.")
                ]
            });

            state = "edit name";

        } else if (customId == 'add item to wishlist') {
            
            const embed = new MessageEmbed()
                .setTitle("Secret Santa")
                .setDescription("Add any items you'd like to recieve to your wishlist. When you are finished, press the button below.");

            const components = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`review info`)
                    .setLabel('Review Info')
                    .setStyle('PRIMARY')
            );

            await user.send({
                embeds: [embed],
                components: [components]
            });

            state = "add to wishlist";

        } else if (customId == 'remove item from wishlist') {
            
            const embed = new MessageEmbed()
                .setTitle("Secret Santa")
                .setDescription("To remove an item from your wishlist, type the name of the item. Make sure the spelling matches up exactly. When you are finished, press the button below.");

            const components = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('review info')
                    .setLabel('Review Info')
                    .setStyle('PRIMARY')
            );

            await user.send({
                embeds: [embed],
                components: [components]
            });

            state = "remove from wishlist";

        } else if (customId == 'assign') {

            // work on assigning part

            await user.send({
                content: 'You just started assigning players to each other in a game of secret santa.'
            });

        }

    }

});

client.on('messageCreate', async (message) => {
    
    if (message.author.bot) return;
    
    const user = message.author;
    const participant = participants[user.discriminator];

    if (state == "create name") {

        participant['name'] = message.content;

        const embed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription("Now, add any items you'd like to recieve to your wishlist. This will help your gifter decide what to get for you. Any message you send will be its own item. When you are finished, press the button below.");

        const components = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`review info`)
                .setLabel('Review Info')
                .setStyle('PRIMARY')
        );

        await user.send({
            embeds: [embed],
            components: [components]
        });

        state = "add to wishlist";

    } else if (state == "add to wishlist") {

        participant['wishlist'].push(message.content);

        const embed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription(`Added item to wishlist: ${message.content}. \n When you are finished, press the button below.`);

        const components = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`review info`)
                .setLabel('Review Info')
                .setStyle('PRIMARY')
        );

        await user.send({
            embeds: [embed],
            components: [components]
        });

    } else if (state == "edit name") {

        participant['name'] = message.content;

        const embed = new MessageEmbed()
            .setTitle("Secret Santa")
            .setDescription("You have successfully changed your name. To finish, press the button below.");

        const components = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`review info`)
                .setLabel('Review Info')
                .setStyle('PRIMARY')
        );

        await user.send({
            embeds: [embed],
            components: [components]
        });

    } else if (state == "remove from wishlist") {

        if (!participant['wishlist'].includes(message.content)) {

            const embed = new MessageEmbed()
                .setTitle("Secret Santa")
                .setDescription("That item is currently not on your wishlist. Please try again.");

            await user.send({
                embeds: [embed]
            });

        } else {

            participant['wishlist'] = participant['wishlist'].filter(item => item !== message.content);

            const embed = new MessageEmbed()
                .setTitle("Secret Santa")
                .setDescription(`Removed item to wishlist: ${message.content}. \n When you are finished, press the button below.`);

            const components = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`review info`)
                    .setLabel('Review Info')
                    .setStyle('PRIMARY')
            );

            await user.send({
                embeds: [embed],
                components: [components]
            });

        }

    }

});

client.login(process.env.TOKEN);

/*

Secret Santa

    - gives info about secret santa
    - DMs whoever started the game with a button to start the shuffle
    - has a button to join the game
    
    - if you press the button, you get a DM that:
        1. asks for your name
        2. asks for what you want
        3. gives you a button to edit your wish list

Minor Things to do

    - redo embeds and components so that each embed and component is only defined once, globally (as opposed to multiple times locally)
    - work on assigning part

*/