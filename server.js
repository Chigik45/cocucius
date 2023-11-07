const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'user1',
  host: 'db',
  database: 'my5db',
  password: 'example',
  port: 5432,
});
const starter = ["Вы и ваши родители гуляли по городу и увидели ", 
"В городской таверне активно обсуждают ", 
"Идя по лесу, вы увидели "];
const noun = ["группу людей ", "вашего отца ", "металичесткую трубу "];
const joke = ["примерно вашего возраста ", "называющую себя телепаты ", 
"который, к слову, живёт по соседству ", "", ""];
const verb = ["которая падает на вашего двоюродного брата", "который истекает кровью", 
"который самостоятельно выбирает работу по дому"];
const ending = [". ",". ",". ", ". Вы в ярости. ", ". Судя по тому, сколько крови вы потеряли, долго вам не протянуть. "];
const globalending = ["Как вы поступите?", "Что вы будете делать? ", "Что вы на это скажете? "];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

function generateJoke() {
  let result = "Прекрасный летний день. ";
  for (let i = 0; i < 3; i++) {
    result += (starter[getRandomInt(0,starter.length)]+noun[getRandomInt(0,noun.length)]+
    joke[getRandomInt(0,joke.length)]+verb[getRandomInt(0,verb.length)]+
    ending[getRandomInt(0,ending.length)]);
  }
  return result + globalending[getRandomInt(0,3)];
}

app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM phrase');
    const results = { 'results': (result) ? result.rows : null};
    res.send(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

async function addRow(texty) {
    try {
      const client = await pool.connect();
      const text = 'INSERT INTO phrase(text_field) VALUES($1)';
      const values = [texty];
      await client.query(text, values);
      console.log('Row added');
      client.release();
    } catch (err) {
      console.error(err);
    }
  }
  

app.get('/add', async (req, res) => {
  try {
    const client = await pool.connect();
    addRow(generateJoke())
    res.send('Row added');
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
