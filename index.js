const express = require("express"); // Importação do módulo express
const app = express(); // Utilização do Express
const mongoose = require("mongoose");

try {
  mongoose.connect("mongodb+srv://root:admin@cluster0.xwlfi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Banco de dados conectado!')
} catch (err) {
  console.log(`Erro ao conectar no banco de dados: ${err}`)
}


app.use(express.json()); // Permite que a minha API recebe JSON
const port = 3000;

// Rotas
app.get("/", (req, res) => {
  res.send({ message: "Hello Express" });
});

// CRUD - READ(GET)
app.get("/characters", (req, res) => {
  res.send(characters.filter(Boolean));
});

// CRUD - CREATE(POST)
app.post("/character", (req, res) => {
  const character = req.body;

  character.id = characters.length + 1;
  characters.push(character);

  res.send({ message: "Personagem inserido com sucesso!" });
});

// GET by ID - Detalhes
app.get("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.filter(Boolean).find((c) => c.id === id);

  if (!character) {
    res.send({ message: "Personagem não encontrado!" });
    return;
  }

  res.send(character);
});

// CRUD - UPDATE (PUT)
app.put("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.filter(Boolean).find((c) => c.id === id);

  if (!character) {
    res.send({ message: "Personagem não encontrado!" });
    return;
  }

  const { name, species, house, actor } = req.body;

  character.name = name;
  character.species = species;
  character.house = house;
  character.actor = actor;

  res.send(character);
});

// CRUD - DELETE (DELETE)
app.delete("/character/:id", (req, res) => {
  const id = +req.params.id;
  const character = characters.filter(Boolean).find((c) => c.id === id);

  if (!character) {
    res.send({ message: "Personagem não encontrado!" });
    return;
  }

  const index = characters.indexOf(character)
  delete characters[index]

  res.send({ message: "Personagem apagado com sucesso!" });

});

// Faz o nosso app ser executado
app.listen(port, () => {
  console.info(`App rodando em http://localhost:${port}`);
});
