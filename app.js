const { App } = require('@slack/bolt');
const request = require('request-promise');
const cheerio = require('cheerio');

const OmnyChangelogUrl = 'https://help.omnystudio.com/en/articles/3740417-api-changelog';

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('!changelog', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await searchChangelog(message, say);
});

async function searchChangelog(message, say) {
    const response = await request(OmnyChangelogUrl);
    const $ = cheerio.load(response);
    const article = $('article').text();

    say(`Oi <@${message.user}>, segue os logs da Triton: ${article}`);
}

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();   