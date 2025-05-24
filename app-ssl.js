const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Game = require('./game');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const rummy = new Game(wss);

// Serve static files
app.use(express.static('public'));

// Ignore WebSocket errors
wss.on('error', () => console.log('* WebSocket error *'));
wss.on('close', () => console.log('* WebSocket closed *'));

/*----------------------ENDPOINTS----------------------*/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/join/:lobby', (req, res) => {
  const code = req.params.lobby;
  if (rummy.addLobby(code)) {
    res.redirect('/game/' + code + '/' + rummy.lobbys[code].token);
  } else {
    res.redirect('/');
  }
});

app.get('/joincpu/:lobby', (req, res) => {
  const code = req.params.lobby;
  if (rummy.addLobby(code, true)) {
    res.redirect('/game/' + code + '/' + rummy.lobbys[code].token);
  } else {
    res.redirect('/');
  }
});

app.get('/game/:lobby/:token', (req, res) => {
  const code = req.params.lobby;
  const token = req.params.token;
  if (rummy.lobbys[code] && rummy.lobbys[code].token === token) {
    res.sendFile(__dirname + '/public/game.html');
  } else {
    res.redirect('/');
  }
});
/*-----------------------------------------------------*/

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}...`);
});
