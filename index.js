const fetch = require('node-fetch');
const fs  = require('fs');
const open = require('open');
const process = require('process');
const { keys, flatten, uniq, values } = require('lodash');
const { authorsColor, categories, metroEmail, metroPassword, navigator, out_file } = require('./config.json');
const METRO_RETRO_URL = 'https://metroretro.io';
const TPL_FILE = `${__dirname}/out.html`;

let token;
let sig;

if (process.argv.length !== 3) {
    console.log('Usage: npm start METRO_RETRO_IDENTIFIER');
    process.exit();
}

const login = async () => {
    const params = new URLSearchParams();

    params.append('email', metroEmail);
    params.append('password', metroPassword);

    const result = await fetch(`${METRO_RETRO_URL}/login/email`, {
        method: 'post',
        body: params
    });

    const headers = result.headers.get('set-cookie');
    if (!headers) {
        console.error('Authentication failed');
        process.exit(-1);
    }

    const regex = new RegExp('metret\\.sess=([^;]+);.+metret\\.sess\\.sig=([^;]+);');
    const matches = regex.exec(JSON.stringify(headers));

    token = matches[1];
    sig = matches[2];
};

const metroQuery = async path => (await fetch(`${METRO_RETRO_URL}/${path}`, {
    headers: { cookie: `metret.sess=${token}; metret.sess.sig=${sig};` }
})).text();

login().then(async () => {
    const getNotesForAuthorAndCategory = (author, category) => '<ul>' + (content[category] || []).filter(i => i.author.name === author && !!i.content).map(i => `<li>${i.content}</li>`).join('') + '</ul>';
    const getAuthorNotes = author => '<tr>' + keys(categories).map(i => `<td>${getNotesForAuthorAndCategory(author, i)}</td>`).join('') + '</tr>';
    const getAuthorHeader = author => '<tr>' + keys(categories).map(() => `<td style="background-color: ${authorsColor}">${author}</td>`).join('') + '</tr>';

    const board = JSON.parse(await metroQuery('api/v1/boards')).find(b => b.ref === process.argv[2]);

    if (!board) {
        console.error("Board not found");
        process.exit(-1);
    }

    const content = JSON.parse(await metroQuery(`api/v1/boards/${board.id}/export?format=json&dl=1`));

    const authors = uniq(flatten(values(content)).map(i => i.author.name));
    const header = values(categories).reduce((previous, current) => previous + `<td style="background-color: ${current.color}"><h2>${current.title}</h2></td>`, '<table><tr>') + '</tr>';
    const body = authors.map(a => `${getAuthorHeader(a)}${getAuthorNotes(a)}`, '').join('') + '</table>';
    const out = fs.readFileSync(TPL_FILE, { encoding: 'utf8' }).replace('{{CONTENT}}', header + body);
    fs.writeFileSync(out_file, out);
    open(out_file, { app: navigator, wait: false });
});


