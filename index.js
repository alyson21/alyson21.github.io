const app = require('express')();
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/favicon', (req, res) => {
  res.sendFile(__dirname + '/favicon.png');
});

io.on('connection', (socket) => {
  socket.on('chat historic', (msg) => {
    const allFileContents = fs.readFileSync('logMessage.txt', 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line => {
      io.emit('chat historic', line);
    });
    io.emit('chat historic', "end");

  });

  socket.on('chat message', (msg, nome) => {
    io.emit('chat message', msg, nome);
    fs.appendFile('logMessage.txt', "\n" + nome + ": " + msg, err => {
      if (err) {
        console.error(err);
      }
    });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at https://localhost:${port}/`);
});
