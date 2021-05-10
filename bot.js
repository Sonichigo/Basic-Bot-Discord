const Discord = require('discord.js');
const client = new Discord.Client();
const configuration = require("./configuration.json");

client.login(configuration.token);

client.on("ready", () => {
  client.user.setStatus("available");
  client.user.setActivity("tetris poorly"); });

client.on("message", (message) => {
  if(message.content[0] !== configuration.prefix){return;}

  message.content = message.content.substring(1).toLocaleLowerCase();

    if(configuration.commands[message.content]){message.reply(configuration.commands[message.content]);}

    if(message.content === "name"){message.reply("Your username is " + message.author.username);}
    if(message.content === "help"){
      let reply = "\nThe commands are: \n";
      for(command in configuration.commands){reply += command + "\n";}
      message.reply(reply);} });
