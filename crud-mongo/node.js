const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

//middleware para processar dados JSON e formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); //middleware para suportar metodos HTTP alternativos

//configuração da URL de conexão com o MongoDB
const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'livraria';
const collectionName = 'livros';

//rota para exibir a pagina inicial
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//rota para exibir o formulario de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

//rota para lidar com a submissão do formulario de cadastro
app.post('/cadastro', async (req,res) => {
    const novoLivro = req.body; //dados do livro enviados pelo formulario

    //conectar ao Mongodb
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //inserir o novo livro no banco de dados
        const result = await collection.insertOne(novoLivro);
        console.log(`Livro cadastrado com sucesso. ID: ${result.insertedId}`);

        //redirecionar para a pagina inicial após o cadastro
        res.redirect('/');
    }   catch (err) {
        console.error('Erro ao cadastrar livro:', err);
        res.status(500).send('Erro ao cadastrar o livro. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

//rota para exibir o formulario de atualizações
app.get('/atualizar', (req, res) => {
    res.sendFile(__dirname + '/atualizar.html');
});

//rota para lidar com a submissão do formulario de atualização
app.post('/atualizar', async (req, res) => {
    const {id, titulo, autor, ano_publicacao, genero, editora, paginas, idiona, ISBN, disponivel } = req.body;

    const client = new MongoClient(url);

    try{
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //atualizar o livro no banco de dados
        const result = await collection.updateOne(
            {_id: new ObjectId(id) }, //utilize o objectId importado
            {
                $set: {titulo, autor, ano_publicacao, genero, editora, paginas, idiona, ISBN, disponivel: disponivel === 'true'
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Livro com ID: ${id} atualizado com sucesso.`);
            res.sendrect('/');
        } else {
            res.status(404).send('Livro não encontrado');
        }
    } catch (err) {
        console.error('Erro ao atualizar o livro:', err);
        res.status(500).send('Erro ao atualizar o livro. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/livro/:id', async (req, res) => {
    const {id} = req.params;

    const client = new MongoClient(url);

    try{
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //encontrar o livro pelo ID
        const livro = await collection.findOne({_id: new ObjectId(id)});

        if (!livro) {
            return res.status(404).send('Livro não encontrado');
        }

        res.json(livro);
    } catch (err) {
        console.error('Erro ao buscar o livro:', err);
        res.status(500).send('Erro ao buscar o livro. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

//rota para lidar com a submissão do formulario de deleção
app.post('/deletar', async (req,res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //deletar o livro no banco de dados
        const result = await collection.deleteOne({_id: new ObjectId(id) });
        
        if(result.deletedCount > 0) {
            console.log(`Livro com ID: ${id} deletado com sucesso.`);
            res.redirect('/'); //redirecionando para a pagina inicial após a exclusão
        } else {
            res.status(404).send('Livro não encontrado.');
        }
    }   catch (err) {
        console.error('Erro ao deletar livro:', err);
        res.status(500).send('Erro ao deletar o livro. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.post('/livros', async (req,res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
                                                        //ao colocar o 1 vai aparecer e se colocar 0 ele nao vai aparecer
        const livros = await collection.find({}, { projection: { _id: 1, titulo: 1, autor: 1, editora: 1}}).toArray();
        
        res.json(livros);
    }   catch (err) {
        console.error('Erro ao buscar livro:', err);
        res.status(500).send('Erro ao buscar o livro. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor Node.js em execução em https://localhost:${port}`);
});
