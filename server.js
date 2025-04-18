const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
       console.log("Novo socket conectado!");

       socket.on('join room', ({ username, room }) => {
              socket.username = username;
              socket.room = room;
              socket.join(room);
              console.log(`👤 ${username} entrou na sala ${room}`);

              socket.to(room).emit('chat message', {
                     user: 'Sistema',
                     msg: `${username} entrou na sala.`
              })
       });

       socket.on('chat message', ({ user, msg }) => {
              io.to(socket.room).emit('chat message', { user, msg});
       })
       socket.on('typing', (username) => {
              socket.to(socket.room).emit('typing', username);
       })
       socket.on('disconnect', () => {
              if (socket.username && socket.room) {
                     socket.to(socket.room).emit('chat message', {
                     user: 'Sistema',
                     msg: `${socket.username} saiu da sala.`,
                     });
              }
       });
});

http.listen(3000, () => {
       console.log('🔥 Servidor rodando em http://localhost:3000');
});
     