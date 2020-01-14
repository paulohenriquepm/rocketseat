const express = require('express');

const app = express();

app.use(express.json());

//Tipos de parametros:

//Query Params: request.query (Filtros, ordenação, paginação, etc)
//Route Params: request.params (Identificar um recurso na alteração ou remoção)
//Body: request.body (Dados para criação ou alteração de um registro)



app.listen(3333);