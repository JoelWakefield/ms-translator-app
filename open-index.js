const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');

const content = require('./content.json');

const key = "<OPENAI-KEY>";

let resultsFile = "open-translations.json";
fs.writeFileSync(resultsFile, '[');

const configuration = new Configuration({
  apiKey: key,
});
const openai = new OpenAIApi(configuration);

content.forEach(async (piece) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Translate this into { fr-CA: , es-MX: }: ${piece.text}`,
    temperature: 0.3,
    max_tokens: 500,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  const text = response.data.choices[0].text;
  console.log(text);
  const french = text.split('fr-CA: ')[1].split('es-MX: ')[0].replace('\n\n','');
  const spanish = text.split('es-MX: ')[1];
  
  const result = [
    {
      text: piece.text,
      from: 'en-US'
    },
    {
      text: french,
      to: "fr-CA" 
    },
    {
      text: spanish,
      to: "es-MX"
    }
  ];

  fs.appendFileSync(
    resultsFile,
    JSON.stringify(result) + ',\n'
  );
});
