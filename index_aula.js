// inicia o joi no arquivo index.js
// joi foi descontinuado, mas é possível utilizar também o express-validator

const Joi = require("joi");

// inicia o express no arquivo index.js

const express = require("express");
const app = express();

// ativando recurso JSON no express

app.use(express.json());

// definindo uma matriz (array) de usuários

const users = [
    {id: 1, tipo: "Advogado", nome: "João"},
    {id: 2, tipo: "Advogado", nome: "Ana"},
    {id: 3, tipo: "Cliente", nome: "Pedro"},
];

// métodos http facilmente acessíveis via express

/*
 * app.get()
 * app.post()
 * app.put()
 * app.delete()
 */

// cada método utiliza 2 argumentos: uma url e uma função

// cada método get define uma rota

app.get("/", (req, res) => {    // "/" representa a raíz do site, req e res são dois argumentos
                                // que serão utilizados quando acessada a raíz site
    res.send("Olá Mundo");      // exibe a mensagem "Olá Mundo"
});

// rota utilizada para apresentar uma lista com os usuários (exemplo)

app.get("/users", (req, res) => {
    res.send(users)
});

// rota utilizada para retornar o parâmetro informado "id" do usuário (exemplo)
// é possível ter mais de um parâmetro em uma rota

app.get("/users/:tipo/:id", (req, res) => { 
    // res.send(req.params); -> req.params.id lê o parãmetro (id) informado na url
    res.send(req.params);
});

// implementando uma rota para obter informações sobre um único usuário

app.get("/users/:id", (req, res) => { 
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) res.status(404).send("Usuário não encontrado!");  // se não for encontrado um usuário com o "id" informado, será retornada uma resposta com o status 404
    res.send(user); // se for encontrado, mostra suas informações normalmente
});

// método find pertente a qualquer matriz em JavaScript

// é necessário passar como argumento uma função, que servirá para encontrar um usuário
// que possua o critério definido no parâmetro informado (id)

// para isso, é comparado o atributo "id" da matriz "users" com o parâmetro informado na url

// req.params.id retorna uma String, que seve ser convertida para "Int" para que possa ser comparada
// com o atributo "id" que é do tipo "Int"

// métodos post utilizam os mesmos 2 argumentos dos métodos get

app.post("/users", (req,res) => {
    const schema = {    // o esquema (schema) deve conter o modelo de como os dados devem estar presentes no "body" da página em JSON
        nome: Joi.string().min(3).required() // aplica as regras necessárias para a entrada da String "nome"
    };
    const result = Joi.validate(req.body, schema); // armazena o resultado do método "validate" do joi

    // pode-se utilizar um "if" para retornar o erro ao usuário, caso este não envie um valor válido

    /*
    if (!req.body.nome || req.body.nome < 3){       // é sempre importante validar a entrada do usuário
        res.status(400).send("(400) O nome é obrigatório e deve ter no mínimo 3 caracteres");
        return;
    }
    */
    
    // ou utilizar o joi (ou express-validator) para realizar a mesma função

    if (result.error){
        res.status(400).send(result.error.details[0].message);  // mostrando ao usuário qual o motivo do erro
        return;
    }
    const user = {
        id: users.length + 1,     // o usuário a ser inserido receberá id com 1 valor maior que o id do usuário anterior
        tipo: "Cliente",
        nome: req.body.nome         // além disso, ele receberá o nome presente no "body" (corpo) da página em JSON, de acordo com o atributo informado (nome)
    };
    users.push(user);   // adicionando a constante "user" na matriz "users"
    res.send(user);     // quando adicionado um novo objeto por meio do método post, este será mostrado na página      
});

// hospeda o projeto em uma determinada prota
// opcionalmente, é possível passar uma função
// a função utilizada abaixo servirá somente para avisar a posta em que o projeto está hospedado

app.listen(3000, () => console.log("Listening on port 3000...")); // localhost:3000