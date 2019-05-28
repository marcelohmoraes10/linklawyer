const Joi = require("joi"); // iniciando o joi
const express = require("express"); // iniciando o express
const app = express();  // instanciando o app

app.use(express.json());    // fazendo o express reconhecer JSON no código

const users = [ // criando um array de exemplo
    {id: 1, tipo: "Advogado", nome: "João"},
    {id: 2, tipo: "Advogado", nome: "Ana"},
    {id: 3, tipo: "Cliente", nome: "Pedro"}
];

app.get("/",(req,res) => {  // página inicial
    res.send("Bem-vindo ao LinkLawyer!");
});

app.get("/users",(req,res) => { // página com a lista de usuários
    res.send(users);
});

app.get("/users/:id",(req,res) => { // realizando uma consulta pelo id específico de um usuário
    const buscaUser = users.find(users => users.id === parseInt(req.params.id));    // comparando o id buscado com os ids presentes no array
    if (!buscaUser) res.status(404).send("(404) Usuário não encontrado!");  // retornando erro 404 caso não encontre o id buscado
    res.send(buscaUser);
});

app.post("/users",(req,res) => {    // adicionando um usuário
    const schema = {    // definindo as regras para adição de um novo usuário
        tipo: Joi.string().min(5).required(),
        nome: Joi.string().min(2).required()
    };
    const resultTipo = Joi.validate(req.body, schema);  // validando as entradas de tipo e de nome
    const resultNome = Joi.validate(req.body, schema);

    if (resultTipo.error || resultNome.error){  // mostrando erros de acordo com a validação das entradas
        res.status(400).send(resultTipo.error.details[0].message);
        res.status(400).send(resultNome.error.details[0].message);
        return;
    };
    const user = {  // definindo os atributos dos novos usuários
        id: users.length +1,
        tipo: req.body.tipo,
        nome: req.body.nome
    };
    users.push(user);
    res.send(user);
});

app.listen(3000);   // iniciando o servidor na porta 3000
console.log("Iniciado em http://localhost:3000");