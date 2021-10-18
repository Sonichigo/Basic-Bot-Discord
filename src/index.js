const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const Levels = require('discord-xp')
const path = require('path')
require('dotenv').config()

Levels.setURL(process.env.mongoPath)

const dotenv = require('dotenv')

dotenv.config({
  path: path.join(__dirname, '..', '.env')
})

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commands = [];

const commandFiles = fs
  .readdirSync('./src/commands')
  .map(folder =>
    fs
      .readdirSync(`./src/commands/${folder}`)
      .filter(file => file.endsWith('.js'))
      .map(file => `./src/commands/${folder}/${file}`)
  )
  .flat();

for (const file of commandFiles) {
  const command = require(`${file}`);
  if (Object.keys(command).length === 0) continue;
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(client_id), {
      body: commands
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();


client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('message', async (message) => {
  if (message.author.bot) return
  if (message.channel.type === 'dm') return
  const randomXp = Math.floor(Math.random() * 10) + 10
  const hasLevelUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp)
  
  if (hasLevelUp) {
    message.reply(`Congrats! You've leveled up to level: ${(await Levels.fetch(message.author.id, message.guild.id)).level}`)
  }
})

client.login(process.env.BOT_TOKEN)

