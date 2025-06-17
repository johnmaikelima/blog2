// Script para criar um usuário administrador
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Verificar se as variáveis de ambiente necessárias estão definidas
if (!process.env.MONGODB_URI) {
  console.error('❌ Erro: A variável de ambiente MONGODB_URI não está definida no arquivo .env.local');
  process.exit(1);
}

// Definir o esquema do usuário
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'author'],
      default: 'author',
    },
  },
  {
    timestamps: true,
  }
);

// Criar o modelo de usuário
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Dados do usuário administrador
const adminUser = {
  name: 'Administrador',
  email: 'admin@exemplo.com',
  password: 'Admin@123',
  role: 'admin'
};

// Função para criar o usuário administrador
async function createAdminUser() {
  try {
    console.log('🔵 Conectando ao MongoDB...');
    console.log(`🔵 URI do MongoDB: ${process.env.MONGODB_URI}`);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB com sucesso!');
    
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: adminUser.email });
    
    if (existingUser) {
      console.log(`⚠️ O usuário com o email ${adminUser.email} já existe.`);
      process.exit(0);
    }
    
    // Criptografar a senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds);
    
    // Criar o usuário com a senha criptografada
    const newUser = new User({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role
    });
    
    await newUser.save();
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Senha: ${adminUser.password}`);
    console.log('🚨 IMPORTANTE: Altere esta senha após o primeiro login!');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
  } finally {
    // Fechar a conexão com o MongoDB
    await mongoose.disconnect();
    console.log('🔵 Conexão com o MongoDB encerrada.');
  }
}

// Executar a função
createAdminUser();
