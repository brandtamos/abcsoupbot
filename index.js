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
const storage = require('node-persist');
let commandList = [];

const start = async function(){
    await storage.init({dir: 'storage'});

    //load commands into memory on app start
    let storedCommands = await storage.getItem("storedCommands");
    if (typeof storedCommands != 'undefined'){
        commandList = storedCommands;
    }
}
start();

//listen for messages
client.on("messageCreate", async msg => {

    //ignore messages from bots, including self
    if (msg.author.bot) return;

    //console.log(msg);
    const command = msg.content.split(" ")[0].toLowerCase();

    checkForCommand(msg, command);

    //hot dog
    if(msg.content == "hot dog" && msg.author.username != "abcsoupbot"){
      msg.channel.send("hot dog");
    }

    switch(command){
        case "!helpme":
            postHelp(msg);
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
        case "!addcommand":
            if(userCanAddCommands(msg)) await addCommand(msg);
            break;
        case "!removecommand":
            if(userCanAddCommands(msg)) await removeCommand(msg);
            break;
        default:
            break;

    }
});

function postHotdog(msg){
    let args = msg.content.split(" ");
    let hotDogUrl = "http://www.redkid.net/generator/hotdog/newsign.php?line1="
    if(args.length > 1){
        let words = msg.content.replace("!hotdog ", "");
        words = words.replaceAll(" ", "+");
        hotDogUrl = hotDogUrl + words;
    }
    else{
        hotDogUrl = hotDogUrl + msg.author.username
    }
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

function postHelp(msg){
    let response = '`!hotdog` - get a hot dog\n' +
        '`!word` - get a random word\n' +
        '`!rhyme [word]` - try to find a rhyme for a word\n' +
        '`!anagram [word]` - try to get an anagram of a word\n' +
        '`!adjective` `!adverb` `!noun` `!nouns` `!verb` `!verbed` `!pasttense` `!verbs` `!presenttense` - get a part of speech\n' +
        '`!addcommand [command name] [command description] | [command text]` - add a command to the bot\n'+
        '`!removecommand [command name]` - remove a command\n'
        ;

    //populate the rest of the help list from stored commands
    commandList.forEach((command) => {
        let newHelpLine = "`" + command.command + "` - " + command.description + "\n";
        response = response + newHelpLine;
    });
    msg.channel.send(response);
}

async function addCommand(msg){
    try{
        if(!msg.content.includes("|")){
            msg.reply("Sorry, I didn't understand that! Make sure your request is formatted in the form of:\n`!addcommand commmandName commandDescription | commandOutput`");
            return;
        }
        let splitMessage = msg.content.split(" ");
        let newCommand = splitMessage[1].toLowerCase();
        if(newCommand.charAt(0) != '!'){
            newCommand = "!" + newCommand;
        }

        //trim off commands to get just the text we need
        splitMessage.shift();
        splitMessage.shift();


        let rejoinedText = splitMessage.join(" ");
        let commandDescription = rejoinedText.split("|")[0];
        let commandText = rejoinedText.split("|")[1];
        let commandObject = {
            command: newCommand,
            description: commandDescription,
            commandText: commandText
        };

        let commandExists = commandList.some(command => command.command == newCommand);
        if(commandExists){
            msg.reply("Command `" + newCommand + "` already exists.");
        }
        else{
            commandList.push(commandObject);
            await storage.setItem("storedCommands", commandList);
            msg.reply("Command `" + newCommand + "` has been successfully added!");
        }
    }
    catch(error){
        msg.reply("I'm sorry, something went wrong trying to add a new command!");
    }
}

async function removeCommand(msg){
    let commandToRemove = msg.content.split(" ")[1].toLowerCase();
    if(commandToRemove.charAt(0) != '!'){
        commandToRemove = "!" + commandToRemove;
    }

    console.log(commandToRemove);

    let modifiedCommandList = commandList.filter(commandObj => commandObj.command != commandToRemove);
    commandList = modifiedCommandList;

    await storage.setItem("storedCommands", commandList);

    msg.reply("Command " + commandToRemove +  " has been removed!");
}

function checkForCommand(msg, command){
    let commandObject = commandList.find(commandObj => commandObj.command == command);
    if(commandObject){
        msg.channel.send(commandObject.commandText);
    }
}

function userCanAddCommands(msg){
    return msg.member.roles.cache.find(r => r.name === "Post-Mod Mod") || msg.member.roles.cache.find(r => r.name === "Command Adder")
}

client.login(process.env.BOT_TOKEN).catch(err => {
    console.error(err);
    process.exit();
  });

  process.on("exit",  () => {
    console.log('destroying bot client');
    client.destroy();
  });
