import discord
import os
from keep_alive import keep_alive

# organize code between reaction role command, suggestion command, and future commands

client = discord.Client()

@client.event
async def on_ready():
    print('Bot is logged in.')

# variables

default_color = 0x00ff00
channel_id = 849914162871664662
bad_symbols = ' AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890`~!@#$%^&*()-_=+[{]}\|;:\'",<.>/?'

# helper functions

def change_char(string, index, new_char):
    string_list = list(string)
    string_list[index] = new_char
    return ''.join(string_list)

def embed_equals(embed1, embed2):
    same_title = embed1.title == embed2.title
    same_color = embed1.color == embed2.color
    same_description = embed1.description == embed2.description
    return same_title and same_color and same_description

def index_in_embeds(input_embed, embeds):
    truth_list = [embed_equals(embed, input_embed) for embed in embeds]
    return truth_list.index(True)

def get_emojis(message, intro_embed):
    
    embed = message.embeds[0]
    if not embed_equals(embed, intro_embed):

        if index_in_embeds(embed, embeds) == 0:
            arrows = ['➡']
        elif index_in_embeds(embed, embeds) == len(embeds) - 1:
            arrows = ['⬅']
        else:
            arrows = ['⬅', '➡']

        string = message.embeds[0].fields[0].value
        new_string = ''

        for char in string:
            if char not in bad_symbols:
                new_string += char

        emojis = arrows + new_string.split()
        return [] if emojis == None else emojis

##### Reaction Roles ###################################################################################

# embeds

intro_embed = discord.Embed(title="Class selection!", description="You will see a series of embeds like the one below. In each embed, click on the reaction below the message that corresponds with your class(es). Then, Press the arrow emojis to move between sections.", color=default_color)

embeds = [
    discord.Embed(title="Embed 1", description="Choose your first favorite color!" , color=default_color),
    discord.Embed(title="Embed 2", description="Choose your second favorite color!", color=default_color),
    discord.Embed(title="Embed 3", description="Choose your third favorite color!" , color=default_color)
]

embeds[0].add_field(name='Colors', value='🟦 : blue\n🟥 : red', inline=False)
embeds[1].add_field(name='Colors', value='🟩 : green\n🟫 : brown', inline=False)
embeds[2].add_field(name='Colors', value='🟨 : yellow\n🟪 : purple', inline=False)

reaction_to_role = {
    '🟦': "test 1",
    '🟥': "test 2",
    '🟩': "test 3",
    '🟫': "test 4",
    '🟨': "test 5",
    '🟪': "test 6"
}

# initial bot message

@client.event
async def on_message(message):

    user = message.author

    if message.content == 'ch!start':
        await message.channel.send(embed = intro_embed)
        await message.channel.send(embed = embeds[0])

    if user == client.user and message.embeds[0].title != 'Suggestion':
        for emoji in get_emojis(message, intro_embed):
            await message.add_reaction(emoji)

    ##### Suggestion Bot ###################################################################################

    if message.content.startswith('suggestion') or message.content.startswith('Suggestion'):

        message_content = message.content.replace('suggestion', '')
        message_content = message_content.replace('Suggestion', '')
        
        if len(message_content) > 1:

            if message_content[0] in [':', '-']:
                message_content = change_char(message_content, 0, '')
            if message_content[0] == ' ':
                message_content = change_char(message_content, 0, '')
            
            user_name = user.name + '#' + user.discriminator
            embed = discord.Embed(title='Suggestion', description=message_content, color=user.color)
            embed.set_footer(text='Suggested by ' + user_name, icon_url=f'{user.avatar_url}')

            bot_message = await message.channel.send(embed=embed)

            await bot_message.add_reaction('✅')
            await bot_message.add_reaction('❌')
            await bot_message.add_reaction('🤷‍♂️')
    
    ########################################################################################################

# editing messages

@client.event
async def on_raw_message_edit(payload):
    
    channel = client.get_channel(channel_id)
    message = await channel.fetch_message(payload.message_id)
    
    if message.author == client.user:
        for emoji in get_emojis(message, intro_embed):
            await message.add_reaction(emoji)

# adding/removing roles

@client.event
async def on_raw_reaction_add(payload):

    channel = client.get_channel(channel_id)
    message = await channel.fetch_message(payload.message_id)
    
    if message.embeds[0].title != 'Suggestion':

        if not payload.member.bot and payload.channel_id == channel_id:

            if payload.emoji.name not in ['⬅', '➡']:

                role_to_add_name = reaction_to_role[payload.emoji.name]
                role = discord.utils.get(channel.guild.roles, name=role_to_add_name)
                await payload.member.add_roles(role)
                
            else:
            
                embed_index = index_in_embeds(message.embeds[0], embeds)

                if payload.emoji.name == '⬅':
                    embed_index -= 1
                else:
                    embed_index += 1

                await message.edit(content=None, embed=embeds[embed_index], suppress=False)
                await message.clear_reactions()

# still have to finish this

@client.event
async def on_raw_reaction_remove(payload):
    
    channel = client.get_channel(channel_id)
    message = await channel.fetch_message(payload.message_id)

    if message.embeds[0].title != 'Suggestion':

        guild = client.get_guild(payload.guild_id)
        print("\nguild:", guild)
        print("guild.members:", guild.members)
        print("guild.members[0].guild:", guild.members[0].guild)

        members = guild.members[0].guild
        member = discord.utils.get(members, id=payload.user_id)

        for user in members:
            if user.id == payload.user_id:
                member = user
                break

        print("\nmember:", member)

        correct_event = payload.channel_id == channel_id and payload.event_type == 'REACTION_REMOVE'
        correct_emoji = payload.emoji.name not in ['⬅', '➡']

        if not member.bot and correct_event and correct_emoji:

            role_to_remove_name = reaction_to_role[payload.emoji.name]
            role = discord.utils.get(channel.guild.roles, name=role_to_remove_name)
            await member.remove_roles(role)

# running the bot

keep_alive()
token = os.environ.get("TOKEN")
client.run(token)