// Script para criar um usuário administrador inicial
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configurações do MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin';
const dbName = 'blog-admin';

async function createAdminUser() {
  // Dados do usuário administrador
  const adminUser = {
    name: 'Administrador',
    email: 'admin@exemplo.com',
    password: await bcrypt.hash('senha123', 10), // Altere esta senha em produção!
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  let client;
  try {
    // Conectar ao MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Verificar se já existe um administrador
    const existingAdmin = await usersCollection.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Um usuário administrador com este email já existe.');
      return;
    }

    // Inserir o usuário administrador
    const result = await usersCollection.insertOne(adminUser);
    console.log(`Usuário administrador criado com sucesso. ID: ${result.insertedId}`);
    console.log('Email: admin@exemplo.com');
    console.log('Senha: senha123');
    console.log('IMPORTANTE: Altere esta senha após o primeiro login!');

  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Conexão com o MongoDB fechada');
    }
  }
}

// Executar a função
createAdminUser()
  .then(() => console.log('Script concluído'))
  .catch(console.error);
