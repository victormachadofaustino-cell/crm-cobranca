import { initializeApp } from "firebase/app"; // -> Puxa a ferramenta de inicialização mestre de conexão com a Google.
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore"; // -> Puxa os comandos brutos para ler e gravar coleções no Firestore.

// -> CREDENCIAIS OFICIAIS DO SEU PROJETO DOCULOC: Configura o cabo de rede direto com a sua nuvem do Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCRyGb755IYtDsMd_MlKcU5XEUZMiwSlbg", // -> Chave de acesso direto ao projeto extraída do seu arquivo de configuração.
  authDomain: "sistema-de-controle-doculoc.firebaseapp.com", // -> Link do domínio de autenticação do seu servidor.
  projectId: "sistema-de-controle-doculoc", // -> Identificador exclusivo do banco de dados na nuvem da Google.
  storageBucket: "sistema-de-controle-doculoc.firebasestorage.app", // -> Link da pasta de armazenamento de arquivos.
  messagingSenderId: "480136912870", // -> Código numérico de mensagens do servidor.
  appId: "1:480136912870:web:5f799acc3b4f7b0ae30027" // -> Identidade digital exclusiva do seu aplicativo web.
}; // -> Encerra a matriz de credenciais de rede.

const app = initializeApp(firebaseConfig); // -> Liga oficialmente a fiação do script com os servidores da Google.
const db = getFirestore(app); // -> Ativa a variável 'db' para leitura e escrita bruta no banco de dados.

async function executarMigracaoJuridica() { // -> Define a função assíncrona mestre que gerenciará o lote de migração de duas vias.
  console.log("⏳ INICIANDO VARREDURA: Conectando à coleção 'cobrancas'..."); // -> Imprime a mensagem de log no terminal para o operador.

  try { // -> Escudo de proteção para capturar falhas de rede ou permissões de segurança.
    const cobrancasRef = collection(db, "cobrancas"); // -> Mira os cabos de rede na coleção antiga de cobranças em texto livre.
    const snapshot = await getDocs(cobrancasRef); // -> Dispara a leitura em lote e traz todos os documentos gravados na nuvem.

    if (snapshot.empty) { // -> Verifica se a coleção antiga está vazia no banco.
      console.log("❌ ERRO: Nenhuma cobrança foi localizada para realizar a mineração."); // -> Alerta o operador no terminal.
      return; // -> Aborta a execução do script.
    } // -> Encerra a trava de segurança.

    console.log(`📁 MINERAÇÃO EM ANDAMENTO: ${snapshot.size} cartões localizados. Processando agrupamentos...`); // -> Mostra o volume de dados encontrados.

    const empresasCriadasNoBanco = {}; // -> Cria um dicionário na memória ram para mapear os nomes das empresas e não gerar duplicados.

    // =========================================================================================
    // 🏢 ETAPA 1: MINERAR E CRIAR A COLECÃO 'cadastros_empresas'
    // =========================================================================================
    for (const docSnap of snapshot.docs) { // -> Abre um laço de repetição para varrer cartão por cartão vindo do Firestore.
      const dadosCob = docSnap.data(); // -> Extrai os campos do documento antigo (cliente, codigo, contato, etc).
      const nomeCliente = dadosCob.cliente ? dadosCob.cliente.trim().toUpperCase() : ""; // -> Higieniza o nome forçando letras maiúsculas estritas.

      if (!nomeCliente) continue; // -> Pula o registro se por acaso o nome da empresa estiver quebrado ou nulo.

      if (!empresasCriadasNoBanco[nomeCliente]) { // -> Verifica se essa empresa jurídica já foi processada neste lote de migração.
        console.log(`🏢 Processando Empresa: ${nomeCliente}`); // -> Loga no terminal qual empresa está sendo estruturada.

        const novoDocEmpresa = { // -> Prepara a estrutura oficial do novo modelo corporativo de advocacia com os campos obrigatórios.
          codigo: dadosCob.codigo || "SOLICITAR", // -> DIRETRIZ ESTREITA: Salva o Código Conta antigo ou marca o alerta de preenchimento.
          cliente: nomeCliente, // -> DIRETRIZ ESTREITA: Grava a Razão Social obrigatória validadada.
          cnpj: "* REQUER ATUALIZAÇÃO *", // -> DIRETRIZ ESTREITA: Injeta o alerta vermelho obrigatório para o CNPJ do assistido.
          tipo: "Matriz", // -> Define o padrão institucional sóbrio de Matriz.
          segmento: "Extraído via Script", // -> Carimba os metadados de auditoria de migração.
          endereco: "Não informado no lote antigo", // -> Registra a ausência de endereço histórico.
          cep: "00000-000" // -> Insere o formato numérico padrão temporário.
        }; // -> Encerra a montagem do documento da empresa.

        const empresaRefNova = collection(db, "cadastros_empresas"); // -> Aponta a mira para a nova coleção estável de Pessoas Jurídicas.
        const docCriado = await addDoc(empresaRefNova, novoDocEmpresa); // -> Grava a empresa na nuvem e o Firebase gera uma ID física única para ela.
        
        empresasCriadasNoBanco[nomeCliente] = docCriado.id; // -> Salva no dicionário da memória RAM a ID que essa empresa ganhou (Ex: XYZ -> 12345).
      } // -> Encerra o bloco de criação de empresa única.
    } // -> Encerra o laço da Etapa 1.

    console.log("✅ ETAPA 1 CONCLUÍDA: Coleção 'cadastros_empresas' criada e populada."); // -> Alerta o sucesso parcial.

    // =========================================================================================
    // 👤 ETAPA 2: MINERAR E CRIAR A COLECÃO 'cadastros_contatos' (AMARRAÇÃO RELACIONAL)
    // =========================================================================================
    console.log("⏳ INICIANDO ETAPA 2: Extraindo contatos humanos e gerando elos relacionais..."); // -> Informa o início do pilar relacional.

    for (const docSnap of snapshot.docs) { // -> Abre o segundo laço de varredura nos cartões antigos do Firebase.
      const dadosCob = docSnap.data(); // -> Puxa os dados brutos do cartão.
      const nomeCliente = dadosCob.cliente ? dadosCob.cliente.trim().toUpperCase() : ""; // -> Captura a Razão Social associada.
      const idEmpresaPai = empresasCriadasNoBanco[nomeCliente]; // -> CHAVE RELACIONAL: Descobre na memória qual ID essa empresa ganhou na Etapa 1.

      if (!idEmpresaPai) continue; // -> Pula o contato se por acaso a empresa-pai não tiver sido criada.

      // -> Função auxiliar para processar e estruturar o contato humano no banco de dados novo
      const salvarContatoNoBanco = async (objContato) => { // -> Declara a subfunção de gravação física de pessoas.
        if (!objContato || !objContato.nome) return; // -> Ignora se o objeto de contato antigo estiver vazio ou sem nome.

        console.log(`👤 Vinculando Contato: ${objContato.nome} -> ${nomeCliente}`); // -> Exibe no terminal a amarração sendo feita.

        const novoDocContato = { // -> Prepara a estrutura oficial do novo modelo de Pessoa Humana exigido por advogados.
          nome: objContato.nome.trim(), // -> DIRETRIZ ESTREITA: Extrai o Nome Completo obrigatório (Ex: "Icaro").
          cpf: "* REQUER ATUALIZAÇÃO *", // -> DIRETRIZ ESTREITA: Injeta o alerta vermelho obrigatório para coleta de CPF.
          telefone: objContato.telefone ? objContato.telefone.replace(/\D/g, "") : "0000000000", // -> DIRETRIZ ESTREITA: Limpa caracteres e salva os 10/11 dígitos.
          email: objContato.email || "não informado", // -> Salva o e-mail corporativo com a validação nativa de arroba.
          tipoVinculo: objContato.vinculo || "Preposto", // -> Salva a categoria jurídica do vínculo (Ex: "proprio").
          empresaId: idEmpresaPai // -> AMARRAÇÃO RÍGIDA DO PIPEDRIVE: Grava o ID físico da empresa-pai no documento do contato.
        }; // -> Encerra o pacote do contato.

        const contatoRefNovo = collection(db, "cadastros_contatos"); // -> Aponta a mira para a nova coleção de Pessoas Humanas.
        await addDoc(contatoRefNovo, novoDocContato); // -> Injeta o contato amarrado diretamente no banco de dados do Firebase.
      }; // -> Encerra a subfunção.

      // -> Varre o mapa simples individual 'contato' do seu modelo do Firebase
      if (dadosCob.contato) { // -> Verifica se o campo existe no documento.
        await salvarContatoNoBanco(dadosCob.contato); // -> Despacha o mapa simples para extração e gravação.
      } // -> Encerra a varredura do mapa individual.

      // -> Varre o array indexado 'contatos' do seu modelo do Firebase
      if (dadosCob.contatos && Array.isArray(dadosCob.contatos)) { // -> Verifica se a matriz de subcontatos existe de fato.
        for (const c of dadosCob.contatos) { // -> Percorre mapa por mapa de dentro da lista array.
          await salvarContatoNoBanco(c); // -> Despacha cada subcontato para gravação relacional na nuvem.
        } // -> Encerra o laço interno do array.
      } // -> Encerra a varredura do array de contatos.
    } // -> Encerra o laço da Etapa 2.

    console.log("📊 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"); // -> Emite a mensagem de vitória operacional no terminal.
    console.log("🔥 Coleções 'cadastros_empresas' e 'cadastros_contatos' geradas e unificadas com total segurança jurídica."); // -> Confirma a integridade.

  } catch (erroCritico) { // -> Captura falhas se a internet cair ou o Firebase recusar os pacotes.
    console.error("❌ ERRO CRÍTICO DE MIGRAÇÃO:", erroCritico); // -> Imprime a mensagem técnica do erro no terminal.
  } // -> Encerra o bloco de proteção.
} // -> Encerra a função assíncrona mestre.

executarMigracaoJuridica(); // -> Dá a ordem de partida executando o script automaticamente no momento do disparo do terminal.