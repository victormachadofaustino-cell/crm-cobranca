import { initializeApp } from "firebase/app"; // Importa a ferramenta padrão do Firebase para ligar e iniciar o nosso aplicativo na nuvem.
import { getFirestore } from "firebase/firestore"; // Importa o conector oficial do Firestore para termos acesso às tabelas do banco de dados.

// ADICIONADO IMPORT DE AUTENTICAÇÃO: Busca na biblioteca do Google o conector responsavel por gerenciar senhas e criar operadores.
import { getAuth } from "firebase/auth"; // Importa a ferramenta nativa de controle de acessos de segurança da portaria.

const firebaseConfig = { // Abre o bloco de configurações com as credenciais de segurança necessárias para o CRM se conectar ao servidor.
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Busca de forma oculta e segura a chave secreta de acesso direto no arquivo .env do sistema.
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // Busca no arquivo secreto o endereço do domínio responsável pela autenticação do app.
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // Busca no arquivo secreto o identificador eletrônico exclusivo do nosso projeto na nuvem.
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Busca no arquivo secreto o link da pasta digital destinada ao armazenamento de arquivos e imagens.
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Busca no arquivo secreto o código numérico que gerencia o envio de notificações e mensagens.
  appId: import.meta.env.VITE_FIREBASE_APP_ID // Busca no arquivo secreto a identidade digital exclusiva deste nosso aplicativo web específico.
}; // Fecha o bloco de configurações de credenciais de forma organizada.

const app = initializeApp(firebaseConfig); // Executa o comando de ativação oficial conectando o nosso CRM à nuvem com as chaves protegidas.

export const db = getFirestore(app); // Cria e exporta a variável 'db' para que todos os outros módulos do CRM consigam salvar e ler dados no banco.

// ADICIONADO INSTANCIAÇÃO DO MOTOR DE PORTARIA: Ativa o serviço de segurança usando as credenciais oficiais do seu projeto.
export const auth = getAuth(app); // Cria e exporta a variavel de autenticacao 'auth' para que as visoes consigam validar cadastros e logar operadores.