const Discord = require("discord.js");
const client = new Discord.Client();
const { prefix, token } = require("./config.json");
// const request = require('request');
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/local", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// define schema
let topicSchema = new mongoose.Schema({
  title: String,
  votes: Number
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.on("open", function() {
  console.log("Connected");
});

client.on("ready", () => {
  console.log(`Logged ${client.user.tag}`);
});

client.on("message", msg => {
  if (msg.content === `${prefix}ping`) {
    msg.reply("Pong!");
  } else if (msg.content === `${prefix}server`) {
    msg.channel.send(`Info del server: ${msg.guild.name}`);
  } else if (msg.content === `${prefix}led`) {
    msg.reply("Esto se prendera!");
  } else if (msg.content === `${prefix}topics`) {
    let Topic = mongoose.model("Topic", topicSchema);

    Topic.find(function(error, topics) {
      if (error) return console.error(error);
      msg.reply(topics.join());
      return;
    });
  } else if (msg.content.startsWith(`${prefix}add`)) {
    let title = msg.content.slice(5);

    let Topic = mongoose.model("Topic", topicSchema);

    let topic = new Topic({
      title: title,
      votes: 0
    });

    topic.save(function(error, item) {
      if (error) return console.error(error);
      msg.reply(item);
    });
  }
});

client.login(token);
