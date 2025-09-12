const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded ({extended: true }));
app.use(methodOverride('_method')); 

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'farmacia';
const collectionName = 'pacientes';
const collectionName1 = 'medicamentos';
const collectionName2 = 'vendas';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/cadastropaciente', (req, res) => {
    res.sendFile(__dirname + '/cadastropaciente.html');
});

app.post('/cadastropaciente', async (req, res) => {
    const novoPaciente = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(novoPaciente);
        console.log(`Paciente cadastrado com sucesso. ID: ${result.insertedId}`);

        res.redirect('/pacientes.html');
    } catch (err) {
        console.error('Erro ao cadastrar o paciente:', err);
        res.status(500).send('Erro ao cadastrar o paciente. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/atualizarpaciente', (req, res) => {
    res.sendFile(__dirname + '/atualizarpaciente.html');
});

app.post('/atualizarpaciente', async (req, res) => {
    const { id, nomeCompleto, dataNascimento, documentoId } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.updateOne(
            {_id: new ObjectId(id) },
            {
                $set: {nomeCompleto, dataNascimento, documentoId
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Paciente com ID: ${id} atualizado com sucesso.`);
            res.redirect('/pacientes.html');
        } else {
            res.status(404).send('Paciente não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao atualizar o paciente:', err);
        res.status(500).send('Erro ao atualizar o paciente. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/pacientes.html', (req, res) => {
    res.sendFile(__dirname + '/pacientes.html');
});

app.get('/paciente/:id', async (req, res) => {
    const {id} = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const paciente = await collection.findOne({ _id: new ObjectId(id) });

        if (!paciente) {
            return res.status(404).send('Paciente não encontrado');
        }

        res.json(paciente);
    } catch (err) {
        console.error('Erro ao buscar o paciente:', err);
        res.status(500).send('Erro ao buscar o paciente. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.post('/deletarpaciente', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {   
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Paciente com ID: ${id} deletado com sucesso.`);
            res.redirect('/pacientes.html'); 
        } else {
            res.status(404).send('Paciente não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar o paciente:', err);
        res.status(500).send('Erro ao deletar o paciente. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/pacientes', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const pacientes = await collection.find({}, { projection: { _id: 1, nomeCompleto: 1, dataNascimento: 1, documentoId: 1 } }).toArray();

        res.json(pacientes);
    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        res.status(500).send('Erro ao buscar pacientes. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/cadastromedicamento', (req, res) => {
    res.sendFile(__dirname + '/cadastromedicamento.html');
});

app.post('/cadastromedicamento', async (req, res) => {
    const novoMedicamento = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName1);

        const result = await collection.insertOne(novoMedicamento);
        console.log(`Medicamento cadastrado com sucesso. ID: ${result.insertedId}`);

        res.redirect('/medicamentos.html');
    } catch (err) {
        console.error('Erro ao cadastrar o medicamento:', err);
        res.status(500).send('Erro ao cadastrar o medicamento. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/atualizarmedicamento', (req, res) => {
    res.sendFile(__dirname + '/atualizarmedicamento.html');
});

app.post('/atualizarmedicamento', async (req, res) => {
    const { id, nomeMedicamento, codigoRegistro, dosagem } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName1);

        const result = await collection.updateOne(
            {_id: new ObjectId(id) },
            {
                $set: {nomeMedicamento, codigoRegistro, dosagem
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Medicamento com ID: ${id} atualizado com sucesso.`);
            res.redirect('/medicamentos.html');
        } else {
            res.status(404).send('Medicamento não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao atualizar o medicamento:', err);
        res.status(500).send('Erro ao atualizar o medicamento. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/medicamentos.html', (req, res) => {
    res.sendFile(__dirname + '/medicamentos.html');
});

app.get('/medicamento/:id', async (req, res) => {
    const {id} = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName1);

        const medicamento = await collection.findOne({ _id: new ObjectId(id) });

        if (!medicamento) {
            return res.status(404).send('Medicamento não encontrado');
        }

        res.json(medicamento);
    } catch (err) {
        console.error('Erro ao buscar o medicamento:', err);
        res.status(500).send('Erro ao buscar o medicamento. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.post('/deletarmedicamento', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {   
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName1);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Medicamento com ID: ${id} deletado com sucesso.`);
            res.redirect('/medicamentos.html'); 
        } else {
            res.status(404).send('Medicamento não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao deletar o medicamento:', err);
        res.status(500).send('Erro ao deletar o medicamento. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/medicamentos', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName1);

        const medicamentos = await collection.find({}, { projection: { _id: 1, nomeMedicamento: 1, codigoRegistro: 1, dosagem: 1 } }).toArray();

        res.json(medicamentos);
    } catch (err) {
        console.error('Erro ao buscar medicamentos:', err);
        res.status(500).send('Erro ao buscar medicamentos. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/cadastrovenda', (req, res) => {
    res.sendFile(__dirname + '/cadastrovenda.html');
});

app.post('/cadastrovenda', async (req, res) => {
    const novaVenda = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName2);

        const result = await collection.insertOne(novaVenda);
        console.log(`Venda cadastrada com sucesso. ID: ${result.insertedId}`);

        res.redirect('/vendas.html');
    } catch (err) {
        console.error('Erro ao cadastrar a venda:', err);
        res.status(500).send('Erro ao cadastrar a venda. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/atualizarvenda', (req, res) => {
    res.sendFile(__dirname + '/atualizarvenda.html');
});

app.post('/atualizarvenda', async (req, res) => {
    const { id, dataCompra, infoPaciente, infoMedicamento, quantMedicamento } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName2);

        const result = await collection.updateOne(
            {_id: new ObjectId(id) },
            {
                $set: {dataCompra, infoPaciente, infoMedicamento, quantMedicamento
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Venda com ID: ${id} atualizada com sucesso.`);
            res.redirect('/vendas.html');
        } else {
            res.status(404).send('Venda não encontrada.');
        }
    } catch (err) {
        console.error('Erro ao atualizar a venda:', err);
        res.status(500).send('Erro ao atualizar a venda. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/vendas.html', (req, res) => {
    res.sendFile(__dirname + '/vendas.html');
});

app.get('/venda/:id', async (req, res) => {
    const {id} = req.params;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName2);

        const venda = await collection.findOne({ _id: new ObjectId(id) });

        if (!venda) {
            return res.status(404).send('Venda não encontrada');
        }

        res.json(venda);
    } catch (err) {
        console.error('Erro ao buscar a venda:', err);
        res.status(500).send('Erro ao buscar a venda. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.post('/deletarvenda', async (req, res) => {
    const { id } = req.body;

    const client = new MongoClient(url);

    try {   
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName2);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            console.log(`Venda com ID: ${id} deletada com sucesso.`);
            res.redirect('/vendas.html'); 
        } else {
            res.status(404).send('Venda não encontrada.');
        }
    } catch (err) {
        console.error('Erro ao deletar a venda:', err);
        res.status(500).send('Erro ao deletar a venda. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/vendas', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName2);

        const vendas = await collection.find({}, { projection: { _id: 1, dataCompra: 1, infoPaciente: 1, infoMedicamento: 1, quantMedicamento: 1 } }).toArray();

        res.json(vendas);
    } catch (err) {
        console.error('Erro ao buscar vendas:', err);
        res.status(500).send('Erro ao buscar vendas. Por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor Node.js em execução em http://localhost:${port}`);
});