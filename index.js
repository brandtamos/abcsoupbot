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

    //hot dog
    if(msg.content == "hot dog" && msg.author.username != "abcsoupbot"){
      msg.channel.send("hot dog");
    }

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
        case "!alright":
            postAlright(msg);
            break;
        case "!sunshine":
            postSunshine(msg);
            break;
        case "!pinus":
            postPinus(msg);
            break;
        case "!wednesday":
          postWednesday(msg);
          break;
        case "!jueves":
          postJueves(msg);
          break;
        case "!treetime":
          postTreeTime(msg);
          break;
        case "!vonsimon":
          postVonSimon(msg);
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

function postAlright(msg){
  msg.channel.send("https://tenor.com/view/alright-buffet-gif-20748305");
}

function postSunshine(msg){
  msg.channel.send("https://cdn.discordapp.com/attachments/818563872763674666/1219701513006481570/WalkinOnSunshine.mp4?ex=663fad0d&is=663e5b8d&hm=d9f9f4c54a7bea684ae77f280ac9f577305d51fbd99b390bef4955613016bb49&");
}

function postPinus(msg){
  msg.channel.send("https://cdn.discordapp.com/attachments/823258416197533766/1238605400107122780/pinus.mov?ex=663fe4ab&is=663e932b&hm=d1a6ca0ead47a9cb3db1d3e94e7a7eb612d582c5df517e89a9a13c34f0d217e7&");
}

function postWednesday(msg){
  msg.channel.send("https://cdn.discordapp.com/attachments/818563872763674666/1250451162549850233/wednesday.mp4?ex=666afce5&is=6669ab65&hm=f790b73661bbe0b835b751dcb524f1049ce2169c2e6c9ec0b2a6a1d544a5e59f&");
}

function postJueves(msg){
  msg.channel.send("https://cdn.discordapp.com/attachments/641743928445632547/1250812377440452608/cachedVideo.mov?ex=667587cd&is=6674364d&hm=6b6971b01fff58376322787fd3a948fd64156a7104e0cda117c05a80e086bded&");
}

function postTreeTime(msg){
  msg.channel.send("https://cdn.discordapp.com/attachments/818563872763674666/1329490626034663485/TREE_TIME.mp4?ex=678a8821&is=678936a1&hm=797704b6e69743956464e05e1de7e05d44a96c85f8c1fb009e87610baa0cbcbd&");
}

function postVonSimon(msg){
  msg.channel.send("https://cdn.discordapp.com/attachments/918543015381962772/1332497108175028275/1e42eb7912a14ba285387d253062902c.mov?ex=679620e3&is=6794cf63&hm=2a93d045b95311679132f4f45ee42b120cefb8be490334516af762b5c0a28f61&");
}
client.login(process.env.BOT_TOKEN).catch(err => {
    console.error(err);
    process.exit();
  });

  process.on("exit",  () => {
    console.log('destroying bot client');
    client.destroy();
  });