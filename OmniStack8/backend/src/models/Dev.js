const { Schema, model } = require("mongoose"); //destructing

//criando o schema do banco
const DevSchema = new Schema({ 
    name:{
        type: String,
        required: true,
    },
    user:{
        type: String,
        required: true,
    },
    bio: String,
    avatar: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId, //id que vem do github Ex: 5d49f144640c021760010dca e referencia a tabela de Dev
        ref: "Dev", 
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: "Dev",
    }],
},{
    timestamps: true, //cria coluna createAt (data de criaçao), updateAt(data da ultima alteracao)
});

module.exports = model("Dev", DevSchema);
