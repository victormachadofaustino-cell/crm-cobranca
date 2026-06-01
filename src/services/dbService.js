import { db } from "../config/firebase"; // Conecta o cabo de rede principal com as chaves e permissões secretas do nosso banco de dados no Google Firebase.
import { collection, addDoc, onSnapshot, updateDoc, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore"; // Importa as ferramentas oficiais da Google para criar pastas, atualizar dados, escutar em tempo real e deletar registros.

// ADICIONADO CONECTOR DE PORTARIA: Importa o gerenciador de autenticacao para o banco de dados saber quem esta enviando os dados.
import { getAuth } from "firebase/auth"; // Importa o vigia de portaria da Google para inspecionar se o operador possui um crachá de acesso legítimo.

const cobrancasRef = collection(db, "cobrancas"); // Cria uma linha de mira permanente apontando para a nossa tabela principal de clientes devedores na nuvem.
const funilRef = doc(db, "config_funil", "padrao"); // Cria um endereço fixo e exclusivo na nuvem para armazenar o arranjo e os nomes das colunas do seu Kanban.

export const dbService = { // Define e exporta o objeto centralizador de banco de dados para que o arquivo mestre app.js acione os comandos em lote.
  
  async salvarCobranca(dadosCobranca) { // Função assíncrona (que roda em segundo plano) encarregada de pegar a ficha do novo devedor e arremessar na nuvem.
    try { // Abre um escudo de proteção para testar a gravação e capturar falhas caso a internet do operador caia no milissegundo do clique.
      const autenticacao = getAuth(); // Aciona a portaria do sistema para checar a identidade do operador que está trabalhando agora.
      const uidUsuario = autenticacao.currentUser ? autenticacao.currentUser.uid : null; // Descobre e isola o código de identificação único e secreto do funcionário logado.

      return await addDoc(cobrancasRef, { // Envia a ordem de escrita para o Firebase criar uma pasta nova de devedor dentro da tabela de cobranças.
        ...dadosCobranca, // Usa o operador de espalhamento para clonar de uma vez todas as informações da ficha cadastral sem precisar digitar campo por campo.
        operadorId: uidUsuario, // Registra de forma inalterável a assinatura eletrônica do operador responsável pelo cadastro para fins de auditoria corporativa.
        dataCriacao: new Date().toISOString() // Grava um carimbo eletrônico global com o ano, mês, dia e minuto exato em que a dívida nasceu no sistema.
      }); // Conclui e sela o envio do novo documento para os servidores da nuvem.
    } catch (error) { // Desvia o fluxo do software para cá caso ocorra queda de energia, bloqueio de segurança ou recusa dos servidores da Google.
      console.error("Erro no dbService (salvar):", error); // Registra a pane técnica detalhada e o relatório de engenharia no console oculto do programador.
      throw error; // Propaga o aviso de erro de rede adiante para que a tela principal do CRM tome conhecimento e alerte o operador na interface.
    } // Encerra o bloco de proteção e tratamento de erro de salvamento.
  }, // Encerra a função operacional de salvar cobrança.

  async avancarStatus(id, statusAtual, listaEtapasCustomizadas) { // Função assíncrona que calcula o avanço de colunas de forma inteligente sem engessar posições fixas.
    const statusOrdem = listaEtapasCustomizadas || ['novo', 'contato', 'negociacao', 'acordo', 'insucesso']; // Captura a ordem de raias da engrenagem do banco ou adota a sequência padrão de segurança caso esteja vazio.
    const proximoIndex = statusOrdem.indexOf(statusAtual) + 1; // Descobre em qual coluna o cartão está estacionado hoje e soma 1 número para localizar a próxima raia à direita.
    
    if (proximoIndex < statusOrdem.length) { // Trava de segurança: valida se o cartão já não está na última coluna do funil para o sistema não tentar andar para o vento.
      const novoStatus = statusOrdem[proximoIndex]; // Isolou com sucesso o nome eletrônico da nova fase para onde o cliente inadimplente está migrando.
      const docRef = doc(db, "cobrancas", id); // Constrói o endereço exato e cirúrgico da pasta eletrônica daquele cliente usando o código de identificação ID dele.
      return await updateDoc(docRef, { status: novoStatus }); // Dispara uma atualização rápida na nuvem substituindo apenas o campo de coluna para mover o card na tela.
    } // Encerra a barreira protetora de limite de trilho do Kanban.
  }, // Encerra a função operacional de avançar status de forma linear.

  escutarCobrancas(callback) { // Função que funciona como um grampo telefônico permanente na nuvem, vigiando a tabela inteira sem precisar dar F5.
    return onSnapshot(cobrancasRef, (snapshot) => { // Ativa a escuta reativa da Google que avisa o nosso front-end no exato milissegundo em que qualquer dado mudar no servidor.
      const cobrancas = []; // Monta uma bandeja vazia na memória ram para organizar os dados higienizados que estão descendo da nuvem.
      snapshot.forEach((doc) => { // Inicia uma varredura passando pasta por pasta de clientes devedores localizadas dentro do servidor do Firebase.
        cobrancas.push({ id: doc.id, ...doc.data() }); // Pega o código identificador alfa-numérico da pasta junto com as informações de valores e joga na bandeja organizada.
      }); // Conclui a organização e empacotamento das fichas de devedores recebidas.
      callback(cobrancas); // Envia a bandeja de cobranças atualizada de volta para o maestro app.js ordenar o redesenho automático dos cartões premium.
    }); // Encerra o monitoramento em tempo real da tabela de cobranças.
  }, // Encerra a função especialista de escuta de cobranças.

  async salvarEstruturaFunil(arrayDeEtapas) { // Função assíncrona encarregada de salvar os novos nomes e a quantidade de raias configuradas na engrenagem.
    try { // Abre o bloco de proteção contra quedas de sinal ou falta de privilégios de escrita nos servidores centrais.
      return await setDoc(funilRef, { etapas: arrayDeEtapas }); // Grava ou substitui permanentemente a lista ordenada de colunas do Kanban dentro do documento padrão de configuração.
    } catch (error) { // Intercepta panes ou travamentos de rede ocorridos durante a tentativa de salvamento do funil.
      console.error("Erro ao salvar estrutura do funil:", error); // Escreve o relatório detalhado da falha de engenharia na console oculta do desenvolvedor.
      throw error; // Arremessa a falha técnica para que a interface de configurações saiba que o processo falhou e emita o aviso.
    } // Encerra o tratamento de erros do funil.
  }, // Encerra a função operacional de salvar estrutura do funil customizado.

  escutarEstruturaFunil(callback) { // Função que monitora em tempo real se você ou sua equipe criaram, mudaram o nome ou apagaram alguma coluna do Kanban.
    return onSnapshot(funilRef, (docSnap) => { // Liga o vigia eletrônico em cima do documento central que armazena o esqueleto do nosso pipeline.
      if (docSnap.exists()) { // Condicional: se o arquivo de configuração de colunas customizadas for localizado perfeitamente no servidor da nuvem.
        callback(docSnap.data().etapas); // Devolve para o maestro do sistema o array exato de colunas para as raias se ajustarem de forma elástica na tela.
      } else { // Caso o documento ainda não exista na nuvem (primeiro acesso da história do seu CRM com o banco de dados zerado).
        callback(null); // Retorna um sinal nulo avisando o mestre de que o sistema precisa acionar o motor de inicialização de fábrica.
      } // Encerra o fluxo de checagem de existência do arquivo de raias.
    }); // Encerra o monitoramento em tempo real da estrutura de colunas.
  }, // Encerra a função especialista de escuta do funil.

  async inicializarFunilSeVazio() { // Função de segurança acionada apenas no primeiro acesso para criar os degraus iniciais do seu processo automaticamente.
    try { // Inicia o bloco de proteção para escrita inicial de diretrizes no cofre do banco de dados.
      const structure = { etapas: [ { id: 'novo', nome: 'A Iniciar' }, { id: 'contato', nome: 'Primeiro Contato' }, { id: 'negociacao', font: '500', nome: 'Em Negociacao' }, { id: 'acordo', nome: 'Acordo Fechado' }, { id: 'insucesso', nome: 'Insucesso' } ] }; // Monta a maquete padrão com as 5 fases essenciais baseadas na sua planilha de controle original.
      return await setDoc(funilRef, structure); // Grava a maquete de fábrica na nuvem para garantir que o seu CRM nasça funcionando redondo no primeiro clique.
    } catch (error) { // Captura eventuais panes de permissão ou escrita durante o provisionamento inicial de fábrica.
      console.error("Erro ao inicializar funil de fabrica:", error); // Escreve o log técnico da falha no painel secreto de desenvolvimento.
    } // Encerra o bloco de proteção da maquete inicial.
  }, // Encerra a função de inicialização de fábrica do pipeline.

  async atualizarCamposCobranca(id, novosDados) { // Função poderosa que atualiza qualquer informação do cliente de uma só vez (valores, propostas, notas, contatos).
    try { // Abre o escudo de monitoramento contra instabilidades de conexão ou picos de lentidão na rede do operador.
      const docRef = doc(db, "cobrancas", id); // Localiza com precisão cirúrgica a pasta eletrônica do devedor dentro da tabela através do ID exclusivo dele.
      return await updateDoc(docRef, novosDados); // Executa a mesclagem e gravação de todos os campos modificados, eternizando o novo histórico no Firestore.
    } catch (error) { // Ativado caso o servidor do Firebase recuse a mesclagem por falta de internet estável ou quebra de privilégios.
      console.error("Erro no dbService ao atualizar campos da cobranca:", error); // Expõe a linha do erro e a causa da falha no console de diagnóstico interno.
      throw error; // Propaga a falha adiante para o arquivo maestro alertar o operador com o balão de aviso na interface.
    } // Encerra o bloco de proteção de mesclagem de dados.
  }, // Encerra a função de atualização de múltiplos campos cadastrais.

  async deletarCobranca(id) { // Função assíncrona encarregada de triturar e apagar permanentemente a pasta do cliente quando ordenado no modal.
    try { // Abre o bloco de monitoramento seguro para comunicação direta com os servidores de exclusão da Google Cloud.
      const docRef = doc(db, "cobrancas", id); // Localiza o endereço físico e a calha exata onde o devedor está registrado na nuvem.
      return await deleteDoc(docRef); // Dispara o comando de destruição definitiva, varrendo o registro e todos os seus históricos do banco de dados.
    } catch (error) { // Intercepta problemas operacionais ou bloqueios críticos ocorridos durante a execução do protocolo de descarte.
      console.error("Erro no dbService ao deletar a cobranca:", error); // Cospe o relatório com o código do erro técnico na tela secreta do programador.
      throw error; // Dispara a notificação de pane de exclusão para o front-end tomar conhecimento.
    } // Encerra o tratamento de erros críticos de exclusão.
  }, // Encerra a função operacional de deleção definitiva.

  async salvarDocumentoGenerico(nomeColecao, dadosDocumento) { // Plugue assíncrono universal criado para gravar dados em qualquer tabela nova de forma dinâmica (melhorias, logs).
    try { // Abre o escudo protetor contra instabilidades de sinal de internet ou bloqueios secundários de conexões.
      const autenticacao = getAuth(); // Captura a chave de sessão ativa e o passaporte do operador logado na Google.
      const uidUsuario = autenticacao.currentUser ? autenticacao.currentUser.uid : null; // Isola o código UID único do autor que está enviando o formulário.

      const colecaoAlvoRef = collection(db, nomeColecao); // Cria uma linha de comunicação apontando dinamicamente para a tabela solicitada via texto (Ex: "melhorias").
      return await addDoc(colecaoAlvoRef, { // Manda a ordem de criação anexando os dados do formulário e o passaporte do funcionário.
        ...dadosDocumento, // Copia e expande de forma íntegra os textos e descrições do chamado protocolado pela equipe.
        autorId: uidUsuario // Anexa a ID criptografada do funcionário autor do chamado para cruzar com as travas de privacidade da visão.
      }); // Conclui a gravação do registro genérico na nuvem, retornando o carimbo de sucesso gerado pela Google.
    } catch (error) { // Captura e isola falhas operacionais do servidor ou queda abrupta de sinal de rede.
      console.error(`Erro no dbService ao salvar na colecao ${nomeColecao}:`, error); // Imprime o relatório técnico com o nome da coleção corrompida no painel do programador.
      throw error; // Arremessa a falha para a visão correspondente emitir o alerta na tela do usuário.
    } // Encerra o bloco de suporte e tratamento de erro de tabelas genéricas.
  }, // Encerra o plugue universal de salvamento de documentos genéricos.

  async escutarColecaoGenerica(nomeColecao, callback) { // Plugue reativo universal criado para deixar um grampo ouvindo qualquer tabela genérica de forma dinâmica.
    const colecaoAlvoRef = collection(db, nomeColecao); // Estabelece a mira eletrônica cirúrgica em cima da tabela indicada por parâmetro de texto.
    return onSnapshot(colecaoAlvoRef, (snapshot) => { // Ativa o monitor permanente da Google que fica vigiando as alterações daquela pasta específica.
      const listaDocumentosLimpas = []; // Monta uma bandeja limpa na memória ram do computador para organizar as ideias ou chamados que vão descer da nuvem.
      snapshot.forEach((documento) => { // Inicia a varredura passando registro por registro de chamado protocolado pela equipe no servidor.
        listaDocumentosLimpas.push({ id: documento.id, ...documento.data() }); // Funde o ID alfa-numérico da nuvem com os textos internos do chamado e coloca na bandeja.
      }); // Conclui a varredura de registros genéricos.
      callback(listaDocumentosLimpas); // Despacha a bandeja de dados limpos para o controlador reativar o redesenho dos blocos coloridos de forma instantânea.
    }); // Encerra o monitoramento em tempo real de tabelas genéricas.
  } // Encerra o plugue reativo universal de escuta de coleções genéricas.
}; // Encerra a exportação do objeto de controle de serviços do banco de dados dbService.