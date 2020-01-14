const Dev = require("../models/Dev");

//o async é utlizado quando algo no código demora um pouco para 
//ser executado(por exemplo uma requisição), devendo então utilizar o await

module.exports = {
    async store(req, res){
        console.log(req.io, req.connectedUsers);

        const { devId } = req.params;
        const { user } = req.headers;
    
        //guardam a instancia do usuário
        const loggedDev = await Dev.findById(user);
        const targedDev = await Dev.findById(devId);

        //verifica se o usuario que esta recebendo o like existe
        if(!targedDev){
            return res.status(400).json({ error: "Dev not exists" }); //badrequest
        }

        //verifica se aconteceu um match, procurando o ID de quem está curtindo
        //dentro do array de likes de quem recebeu o like
        if (targedDev.likes.includes(loggedDev._id)){
            const loggedSocket = req.connectedUsers[user];
            const targedSocket = req.connectedUsers[devId];
            
            if(loggedSocket){
                req.io.to(loggedSocket).emit('match', targedDev);
            }

            if(targedSocket){
                req.io.to(targedSocket).emit('match', loggedDev);
            }
        }
        loggedDev.likes.push(targedDev._id); //_id é a maneira que o API do github retorna o ID do user

        await loggedDev.save();

        return res.json(loggedDev);
    }
};