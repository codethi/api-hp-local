const express = require("express"); // Importação do módulo express
const app = express(); // Utilização do Express
const mongoose = require("mongoose");
const Character = require("./models/Character");
const cors = require("cors");

try {
  mongoose.connect(
    "mongodb+srv://root:admin@api-hp.doqyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("Banco de dados conectado!");
} catch (err) {
  console.log(`Erro ao conectar no banco de dados: ${err}`);
}

app.use(express.json()); // Permite que a minha API recebe JSON
const port = 3001;
app.use(cors());

// Rotas
app.get("/", (req, res) => {
  res.send({ message: "Hello Express" });
});

// CRUD - READ(GET)
app.get("/character/all", async (req, res) => {
  const characters = await Character.find();

  if (characters.length === 0) {
    return res
      .status(404)
      .send({ message: "Não existem personagens cadastrados!" });
  }

  res.send(characters.filter(Boolean));
});

// GET by ID - Detalhes
app.get("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ error: "Id Inválido" });
    return;
  }

  const character = await Character.findById(id);

  if (!character) {
    return res.status(404).send({ message: "Personagem não encontrado." });
  }

  res.send(character);
});

// CRUD - CREATE(POST)
app.post("/character/create", async (req, res) => {
  const { name, house, actor, image } = req.body;

  if (!name || !image || !house || !actor) {
    res.status(400).send({
      message: "Você não enviou todos os dados necessários para o cadastro",
    });
    return;
  }

  const newCharacter = await new Character({
    name,
    image,
    house,
    actor,
  });

  await newCharacter.save();
  res.send(newCharacter);
});

// CRUD - UPDATE (PUT)
app.put("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ error: "Id Inválido" });
    return;
  }

  const character = await Character.findById(id);

  if (!character) {
    return res.status(404).send({ message: "Personagem não encontrado." });
  }

  const { name, image, house, actor } = req.body;

  if (!name || !image || !house || !actor) {
    res.status(400).send({
      message: "Você não enviou todos os dados necessários para o cadastro",
    });
    return;
  }

  character.name = name;
  character.image = image;
  character.house = house;
  character.actor = actor;

  await character.save();
  res.send({ message: "Personagem alterado com sucesso!" });
});

// CRUD - DELETE (DELETE)
app.delete("/character/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).send({ error: "Id Inválido" });
    return;
  }

  const character = await Character.findById(id);

  await character.remove();

  res.send({ message: "Personagem removido com sucesso!" });
});

// Faz o nosso app ser executado
app.listen(port, () => {
  console.info(`App rodando em http://localhost:${port}`);
});
