const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const content = require('./content.json');

let endpoint = "https://api.cognitive.microsofttranslator.com";
let key = "0b322d0de71f4eb995e3883f0b041172";
let location = "centralus";

let resultsFile = "translations.json";
fs.writeFileSync(resultsFile, '[');

content.forEach((piece) => axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'from': 'en-US',
            'to': ['fr-CA', 'es-MX']
        },
        data: [piece],
        responseType: 'json'
    }).then((response) => {
        const results = [
            {
                text: piece.text,
                from: 'en-US',
            },
            ...response.data[0].translations,
        ];
        fs.appendFileSync(
            resultsFile, 
            JSON.stringify(results) + ',\n'
        );
    }),
);