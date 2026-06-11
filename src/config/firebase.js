import { initializeApp } from "firebase/app"; // -> Traz a ferramenta padrão do Firebase usada para ligar e iniciar o nosso aplicativo na nuvem.
import { getFirestore } from "firebase/firestore"; // -> Traz o conector oficial do Firestore para termos acesso às tabelas do banco de dados.
import { getAuth } from "firebase/auth"; // -> Traz a ferramenta nativa de controle de acessos e portaria de segurança da Google.

const firebaseConfig = { // -> Abre o bloco de configurações contendo as credenciais do seu projeto DOCULOC.
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // -> Busca de forma oculta e segura a chave secreta de acesso direto no arquivo .env do sistema.
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // -> Busca no arquivo secreto o endereço do domínio responsável pela autenticação do app.
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // -> Busca no arquivo secreto o identificador eletrônico exclusivo do nosso projeto na nuvem.
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // -> Busca no arquivo secreto o link da pasta digital destinada ao armazenamento de arquivos.
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // -> Busca no arquivo secreto o código numérico que gerencia as mensagens do servidor.
  appId: import.meta.env.VITE_FIREBASE_APP_ID // -> Busca no arquivo secreto a identidade digital exclusiva deste nosso aplicativo web específico.
}; // -> Fecha o bloco de configurações de credenciais de forma organizada.

const app = initializeApp(firebaseConfig); // -> Executa o comando de ativação oficial conectando o nosso CRM à nuvem com as chaves protegidas.

export const db = getFirestore(app); // -> Cria e exporta a variável 'db' para as telas conseguirem salvar e ler os devedores, segmentos, vínculos e funis no banco.
export const auth = getAuth(app); // -> Cria e exporta a variável de autenticação 'auth' para o sistema validar cadastros e logar operadores.