const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");

const app = express();
const server = require('http').Server(app);//extrair o servidor HTTP de dentro do nosso express, e unir com um server WebSocket
const io = require("socket.io")(server);//o require retorna uma funcao, entao chama essa funcao passando o server

//armazena qual id de usario é qual id de socket na propria memoria do node
//não é a melhor maneira de se fazer isso pois o sevidor tem que ser STATELESS(se desligar e subir de novo, não pode acontecer nenhum problema na aplicacao)
//a melhor maneira seria utilizar um BD de Chave-Valor, como o MongoDB
const connectedUsers = {};

//toda vez que alguem conectar na aplicacao pelo protocolo WebSocket, recebe o socket
//ou seja, a conexao entre o frontend e o backend
io.on('connection', socket => {
    const { user } = socket.handshake.query; //pega o id do usuario logado vindo do frontend

    console.log(user, socket.id);
    connectedUsers[user] = socket.id;
}); 

//conetar no MongoDB Atlas
mongoose.connect("mongodb+srv://omnistack:omnistack@cluster0-jcxo6.mongodb.net/omnistack8?retryWrites=true&w=majority", {useNewUrlParser : true});

//passa as informacoes para o controller
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//permiter que a aplicação seja acessada por qualquer endereço, para que o React acessar a aplicação
app.use(cors());

//para dizer ao express que sempre estaremos utlizando um JSON
app.use(express.json());

//utiliza as rotas 
app.use(routes);

//determina a porta do localhost
server.listen(3333); 