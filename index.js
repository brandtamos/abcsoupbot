//, GatewayIntentBits.EMBED_LINKS, GatewayIntentBits.VIEW_CHANNEL
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers] });

require('dotenv').config();
const {RiTa} = require("rita");
const thesaurus = require("thesaurus");
const anagramSolver = require("anagram-solver");

//listen for messages
client.on("messageCreate", async msg => {
    //console.log(msg);
    const command = msg.content.split(" ")[0].toLowerCase();

    switch(command){
        case "test":
            msg.reply("who am i");
            break;
        case "!hotdog":
            postHotdog(msg);
            break;
        case "!anagram":
            findAnagram(msg);
            break;
        case "!word":
            getRandomWord(msg);
            break;
        case "!rhyme":
            getRhyme(msg);
            break;
        case "!adjective":
        case "!adverb":
        case "!noun":
        case "!nouns":
        case "!verb":
        case "!verbed":
        case "!pasttense":
        case "!verbs":
        case "!presenttense":
            getPartOfSpeech(msg);
            break;
        default:
            break;

    }
});

function postHotdog(msg){
    let hotDogUrl = "http://www.redkid.net/generator/hotdog/newsign.php?line1=" + msg.author.username;
    msg.channel.send(hotDogUrl);
}

function getRandomWord(msg) {
    let word = RiTa.randomWord();
    msg.channel.send(word);
  }

function getPartOfSpeech(msg) {
    let pos = msg.content.replace("!", "").trim().toLowerCase();
    let ritaPos = getRitaPosMapping(pos);
    let word = RiTa.randomWord({ pos: ritaPos });
    msg.channel.send(word);
  }
  
  function getRitaPosMapping(pos) {
    switch (pos) {
      case "adjective":
        return "jj";
      case "adverb":
        return "rb";
      case "noun":
        return "nn";
      case "nouns":
        return "nns";
      case "verb":
        return "vb";
      case "verbed":
      case "pasttense":
        return "vbd";
      case "verbs":
      case "presenttense":
        return "vbz";
      default:
        return "";
    }
  }

  async function findAnagram(msg) {
    let letters = msg.content.replace("!anagram ", "");
    letters = letters.replace(" ", "");
    let anagrams = await anagramSolver(letters);
  
    if (anagrams.length > 0) {
      let index = Math.floor(Math.random() * anagrams.length);
      let word = anagrams[index];
      msg.channel.send(word);
    } else msg.channel.send("No anagrams found :(");
}

async function getRhyme(msg) {
    let args = msg.content.split(" ");
    let word = args[1];
    let rhymes = await RiTa.rhymes(word, { limit: 100 });

    if (rhymes.length == 0){
        msg.channel.send("No rhymes found :(");
    }

    var index = Math.floor(Math.random() * rhymes.length);
    console.log(rhymes);
    let rhymeWord = rhymes[index];
    msg.channel.send(rhymeWord);
}

client.login(process.env.BOT_TOKEN).catch(err => {
    console.error(err);
    process.exit();
  });

  process.on("exit",  () => {
    console.log('destroying bot client');
    client.destroy();
  });