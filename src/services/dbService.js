import { db } from "../config/firebase"; // Conecta o cabo de rede principal com as chaves e permissões secretas do nosso banco de dados no Google Firebase. // Liga as chaves de acesso e credenciais secretas do banco Firebase.
import { collection, addDoc, onSnapshot, updateDoc, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore"; // Importa as ferramentas oficiais da Google para criar pastas, atualizar dados, escutar em tempo real e deletar registros. // Traz do pacote da Google os comandos de ler, escrever e apagar dados.

// ADICIONADO CONECTOR DE PORTARIA: Importa o gerenciador de autenticacao para o banco de dados saber quem esta enviando os dados. // Traz o conector de portaria eletrônica do Firebase Auth.
import { getAuth } from "firebase/auth"; // Importa o vigia de portaria da Google para inspecionar se o operador possui um crachá de acesso legítimo. // Ativa o inspetor de crachás digitais para saber quem está logado.

const cobrancasRef = collection(db, "cobrancas"); // Cria uma linha de mira permanente apontando para a nossa tabela principal de clientes devedores na nuvem. // Cria uma mira permanente apontando para a pasta de cobranças na nuvem.
const funilRef = doc(db, "config_funil", "padrao"); // Cria um endereço fixo e exclusivo na nuvem para armazenar o arranjo e os nomes das colunas do seu Kanban. // Cria um endereço fixo na nuvem para o esqueleto de colunas do Kanban.

export const dbService = { // Define e exporta o objeto centralizador de banco de dados para que o arquivo mestre app.js acione os comandos em lote. // Exporta a maleta de serviços do banco para o arquivo mestre acionar.
  
  async salvarCobranca(dadosCobranca) { // Função assíncrona (que roda em segundo plano) encarregada de pegar a ficha do novo devedor e arremessar na nuvem. // Roda em segundo plano para salvar uma nova ficha de dívida na nuvem.
    try { // Abre um escudo de proteção para testar a gravação e capturar falhas caso a internet do operador caia no milissegundo do clique. // Testa a gravação e protege o sistema se a internet oscilar no clique.
      const autenticacao = getAuth(); // Aciona a portaria do sistema para checar a identidade do operador que está trabalhando agora. // Aciona a portaria para colher as informações do funcionário ativo.
      const uidUsuario = autenticacao.currentUser ? autenticacao.currentUser.uid : null; // Descobre e isola o código de identificação único e secreto do funcionário logado. // Isola o ID criptografado exclusivo da conta do operador conectado.

      return await addDoc(cobrancasRef, { // Envia a ordem de escrita para o Firebase criar uma pasta nova de devedor dentro da tabela de cobranças. // Manda a ordem de criação de pasta preenchendo as chaves do devedor.
        ...dadosCobranca, // Usa o operador de espalhamento para clonar de uma vez todas as informações da ficha cadastral sem precisar digitar campo por campo. // Clona de uma vez só todos os campos cadastrados no formulário de tela.
        operadorId: uidUsuario, // Registra de forma inalterável a assinatura eletrônica do operador responsável pelo cadastro para fins de auditoria corporativa. // Assina inalteravelmente a ID do operador que fez a inclusão do lote.
        dataCriacao: new Date().toISOString() // Grava um carimbo eletrônico global com o ano, mês, dia e minuto exato em que a dívida nasceu no sistema. // Carimba eletronicamente o segundo exato do nascimento do lote.
      }); // Conclui e sela o envio do novo documento para os servidores da nuvem. // Sela e conclui o envio permanente dos dados para os servidores mundiais.
    } catch (error) { // Desvia o fluxo do software para cá caso ocorra queda de energia, bloqueio de segurança ou recusa dos servidores da Google. // Ativado se a nuvem do Google recusar a gravação por panes de rede.
      console.error("Erro no dbService (salvar):", error); // Registra a pane técnica detalhada e o relatório de engenharia no console oculto do programador. // Imprime o relatório técnico do erro no painel oculto do desenvolvedor.
      throw error; // Propaga o aviso de erro de rede adiante para que a tela principal do CRM tome conhecimento e alerte o operador na interface. // Arremessa a falha técnica para o arquivo mestre emitir os balões de avisos.
    } // Encerra o bloco de proteção e tratamento de erro de salvamento. // Fecha o bloco protetor de salvamentos comerciais.
  }, // Encerra a função operacional de salvar cobrança. // Fecha o bloco da função de salvar cobranças.

  async avancarStatus(id, statusAtual, listaEtapasCustomizadas) { // Função assíncrona que calcula o avanço de colunas de forma inteligente sem engessar posições fixas. // Avança o cartão do cliente de coluna de forma inteligente de calha em calha.
    const statusOrdem = listaEtapasCustomizadas || ['novo', 'contato', 'negociacao', 'acordo', 'finalizado']; // CORREÇÃO SÊNIOR: Ajustado o fallback padrão para usar 'finalizado' em vez do ID antigo incompleto. // Carrega a ordem de fases ou adota o arranjo padrão de fábrica unificado.
    const proximoIndex = statusOrdem.indexOf(statusAtual) + 1; // Descobre em qual coluna o cartão está estacionado hoje e soma 1 número para localizar a próxima raia à direita. // Localiza em qual coluna o card está e soma 1 para mirar a raia da direita.
    
    if (proximoIndex < statusOrdem.length) { // Trava de segurança: valida se o cartão já não está na última coluna do funil para o sistema não tentar andar para o vento. // Trava de segurança: impede o card de tentar andar se já estiver na última raia.
      const novoStatus = statusOrdem[proximoIndex]; // Isolou com sucesso o nome eletrônico da nova fase para onde o cliente inadimplente está migrando. // Isola a chave de texto eletrônica da nova coluna de destino.
      const docRef = doc(db, "cobrancas", id); // Constrói o endereço exato e cirúrgico da pasta eletrônica daquele cliente usando o código de identificação ID dele. // Localiza cirurgicamente a ID do cliente na tabela de devedores.
      return await updateDoc(docRef, { status: novoStatus }); // Dispara uma atualização rápida na nuvem substituindo apenas o campo de coluna para mover o card na tela. // Reescreve apenas o campo de status movendo o card de coluna reativamente.
    } // Encerra a barreira protetora de limite de trilho do Kanban. // Fecha a barreira de proteção de fim de curso de raias.
  }, // Encerra a função operacional de avançar status de forma linear. // Fecha o bloco da função de avanço linear de calhas.

  escutarCobrancas(callback) { // Função que funciona como um grampo telefônico permanente na nuvem, vigiando a tabela inteira sem precisar dar F5. // Liga o grampo eletrônico reativo que vigia os devedores sem precisar de F5.
    return onSnapshot(cobrancasRef, (snapshot) => { // Ativa a escuta reativa da Google que avisa o nosso front-end no exato milissegundo em que qualquer dado mudar no servidor. // Ativa o ouvinte em tempo real do Firebase avisando mudanças no segundo exato.
      const cobrancas = []; // Monta uma bandeja vazia na memória ram para organizar os dados higienizados que estão descendo da nuvem. // Cria uma bandeja local vazia para organizar as fichas que estão descendo.
      snapshot.forEach((doc) => { // Inicia uma varredura passando pasta por pasta de clientes devedores localizadas dentro do servidor do Firebase. // Varre pasta por pasta de clientes devedores gravados na nuvem.
        cobrancas.push({ id: doc.id, ...doc.data() }); // Pega o código identificador alfa-numérico da pasta junto com as informações de valores e joga na bandeja organizada. // Une a ID eletrônica com os saldos do devedor e coloca na bandeja.
      }); // Conclui a organização e empacotamento das fichas de devedores recebidas. // Fecha o lote de organização de fichas capturadas do servidor.
      callback(cobrancas); // Envia a bandeja de cobranças atualizada de volta para o maestro app.js ordenar o redesenho automático dos cartões premium. // Despacha a lista completa de devedores para o arquivo maestro redesenhar as raias.
    }); // Encerra o monitoramento em tempo real da tabela de cobranças. // Fecha o monitoramento eletrônico vivo de devedores.
  }, // Encerra a função especialista de escuta de cobranças. // Fecha o bloco da função de escuta reativa de devedores.

  async salvarEstruturaFunil(arrayDeEtapas) { // Função assíncrona encarregada de salvar os novos nomes e a quantidade de raias configuradas na engrenagem. // Salva os novos nomes e quantidades de colunas configuradas na engrenagem.
    try { // Abre o bloco de proteção contra quedas de sinal ou falta de privilégios de escrita nos servidores centrais. // Abre o escudo de proteção para gravação do esqueleto de colunas.
      return await setDoc(funilRef, { etapas: arrayDeEtapas }); // Grava ou substitui permanentemente a lista ordenada de colunas do Kanban dentro do documento padrão de configuração. // Grava e substitui de vez a lista ordenada de colunas do Kanban.
    } catch (error) { // Intercepta panes ou travamentos de rede ocorridos durante a tentativa de salvamento do funil. // Ativado se o servidor do Google recusar a alteração de colunas.
      console.error("Erro ao salvar estrutura do funil:", error); // Escreve o relatório detalhado da falha de engenharia na console oculta do desenvolvedor. // Imprime as panes de rede de alteração de colunas no painel oculto.
      throw error; // Arremessa a falha técnica para que a interface de configurações saiba que o processo falhou e emita o aviso. // Arremessa o erro técnico para o painel de configurações avisar na tela.
    } // Encerra o tratamento de erros do funil. // Fecha o bloco protetor de gravação de parametrizações de raias.
  }, // Encerra a função operacional de salvar estrutura do funil customizado. // Fecha o bloco da função de salvamento do funil.

  escutarEstruturaFunil(callback) { // Função que monitora em tempo real se você ou sua equipe criaram, mudaram o nome ou apagaram alguma coluna do Kanban. // Monitora em tempo real se o Victor mudou ou criou colunas na engrenagem.
    return onSnapshot(funilRef, (docSnap) => { // Liga o vigia eletrônico em cima do documento central que armazena o esqueleto do nosso pipeline. // Liga o vigia eletrônico em cima do arquivo mestre de formato de colunas.
      if (docSnap.exists()) { // Condicional: se o arquivo de configuração de colunas customizadas for localizado perfeitamente no servidor da nuvem. // Se o arquivo de esqueleto de colunas for achado com sucesso na nuvem.
        callback(docSnap.data().etapas); // Devolve para o maestro do sistema o array exato de colunas para as raias se ajustarem de forma elástica na tela. // Entrega a lista de colunas para as raias do Kanban se esticarem na tela.
      } else { // Caso o documento ainda não exista na nuvem (primeiro acesso da história do seu CRM com o banco de dados zerado). // Se o banco for novo e iniciar totalmente zerado sem configurações de raias.
        callback(null); // Retorna um sinal nulo avisando o mestre de que o sistema precisa acionar o motor de inicialização de fábrica. // Manda sinal nulo instruindo o maestro a acionar as cargas de fábrica.
      } // Encerra o fluxo de checagem de existência do arquivo de raias. // Fecha a checagem de existência do esqueleto de colunas.
    }); // Encerra o monitoramento em tempo real da estrutura de colunas. // Fecha o monitoramento vivo de formato de colunas do Kanban.
  }, // Encerra a função especialista de escuta do funil. // Fecha o bloco da função de escuta de formato de colunas.

  async inicializarFunilSeVazio() { // Função de segurança acionada apenas no primeiro acesso para criar os degraus iniciais do seu processo automaticamente. // Provisiona as 5 raias essenciais iniciais caso o banco inicie zerado.
    try { // Inicia o bloco de proteção para escrita inicial de diretrizes no cofre do banco de dados. // Abre o escudo de gravação para a carga inicial de colunas de fábrica.
      // CORREÇÃO SÊNIOR: Removido 'font: 500' fantasma e alinhado os dois últimos IDs para 'acordo' e 'finalizado' blindando o sistema contra quebras.
      const structure = { etapas: [ { id: 'novo', nome: 'A Iniciar' }, { id: 'contato', nome: 'Notificação Enviada' }, { id: 'negociacao', nome: 'Em Negociação' }, { id: 'acordo', nome: 'Termo em Andamento' }, { id: 'finalizado', nome: 'Finalizado' } ] }; // Monta a maquete padrão com as 5 fases essenciais baseadas na sua planilha de controle original. // Fabrica o modelo com as 5 fases alinhadas com os IDs rígidos do seu front-end.
      return await setDoc(funilRef, structure); // Grava a maquete de fábrica na nuvem para garantir que o seu CRM nasça funcionando redondo no primeiro clique. // Grava the maquete de fábrica na nuvem garantindo o funcionamento imediato.
    } catch (error) { // Captura eventuais panes de permissão ou escrita durante o provisionamento inicial de fábrica. // Ativado se o provisionamento de fábrica falhar por bloqueios.
      console.error("Erro ao inicializar funil de fabrica:", error); // Escreve o log técnico da falha no painel secreto de desenvolvimento. // Imprime as falhas de provisionamento no diário secreto do desenvolvedor.
    } // Encerra o bloco de proteção da maquete inicial. // Fecha o bloco protetor de provisionamento inicial de raias.
  }, // Encerra a função de inicialização de fábrica do pipeline. // Fecha o bloco da função de inicialização de fábrica do funil.

  async atualizarCamposCobranca(id, novosDados) { // Função poderosa que updates qualquer informação do cliente de uma só vez (valores, propostas, notas, contatos). // Mescla e atualiza qualquer dado do devedor de uma vez só no banco.
    try { // Abre o escudo de monitoramento contra instabilidades de conexão ou picos de lentidão na rede do operador. // Abre o escudo protetor contra quedas ou lentidão na internet do operador.
      const docRef = doc(db, "cobrancas", id); // Localiza com precisão cirúrgica a pasta eletrônica do devedor dentro da tabela através do ID exclusivo dele. // Localiza cirurgicamente a pasta do devedor na nuvem através do ID único.
      return await updateDoc(docRef, novosDados); // Executa a mesclagem e gravação de todos os campos modificados, eternizando o novo histórico no Firestore. // Mescla e grava os novos campos editados salvando the alterações no Firestore.
    } catch (error) { // Ativado caso o servidor do Firebase recuse a mesclagem por falta de internet estável ou quebra de privilégios. // Ativado se a nuvem recusar as edições por falhas ou falta de sinal.
      console.error("Erro no dbService ao atualizar campos da cobranca:", error); // Expõe a linha do erro e a causa da falha no console de diagnóstico interno. // Expõe a falha e as causas no console de diagnósticos oculto da tela.
      throw error; // Propaga a falha adiante para o arquivo maestro alertar o operador com o balão de aviso na interface. // Propaga o erro técnico para o arquivo maestro alertar o operador na tela.
    } // Encerra o bloco de proteção de mesclagem de dados. // Fecha o bloco protetor de atualizações de dados cadastrais.
  }, // Encerra a função de atualização de múltiplos campos cadastrais. // Fecha o bloco da função de atualização de múltiplos campos.

  async deletarCobranca(id) { // Função assíncrona encarregada de triturar e apagar permanentemente a pasta do cliente quando ordenado no modal. // Tritura e apaga para sempre a pasta do devedor na nuvem de forma irreversível.
    try { // Abre o bloco de monitoramento seguro para comunicação direta com os servidores de exclusão da Google Cloud. // Abre o monitoramento de comunicação direta com as centrais de descarte da Google.
      const docRef = doc(db, "cobrancas", id); // Localiza o endereço físico e a calha exata onde o devedor está registrado na nuvem. // Encontra o endereço físico exato da pasta do devedor na tabela remota.
      return await deleteDoc(docRef); // Dispara o comando de destruição definitiva, varrendo o registro e todos os seus históricos do banco de dados. // Dispara o comando de destruição apagando the históricos e parcelas do banco.
    } catch (error) { // Intercepta problemas operacionais ou bloqueios críticos ocorridos durante a execução do protocolo de descarte. // Ativado se o comando de exclusão for negado pelas travas de rede.
      console.error("Erro no dbService ao deletar a cobranca:", error); // Cospe o relatório com o código do erro técnico na tela secreta do programador. // Cospe o relatório do erro técnico de deleção na tela secreta de códigos.
      throw error; // Dispara a notificação de pane de exclusão para o front-end tomar conhecimento. // Avisa o front-end de que a deleção falhou impedindo o sumiço visual do card.
    } // Encerra o tratamento de erros críticos de exclusão. // Fecha o bloco protetor de protocolos de destruição de devedores.
  }, // Encerra a função operacional de deleção definitiva. // Fecha o bloco da função de deleção de registros de cobrança.

  async salvarDocumentoGenerico(nomeColecao, dadosDocumento) { // Plugue assíncrono universal criado para gravar dados em qualquer tabela nova de forma dinâmica (melhorias, logs). // Plugue universal que grava dados em qualquer pasta nova do banco de dados.
    try { // Abre o escudo protetor contra instabilidades de sinal de internet ou bloqueios secundários de conexões. // Abre o escudo de segurança contra oscilações de sinal de rede de internet.
      const autenticacao = getAuth(); // Captura a chave de sessão ativa e o passaporte do operador logado na Google. // Puxa the passaporte eletrônico e chaves de identificação do operador ativo.
      const uidUsuario = autenticacao.currentUser ? autenticacao.currentUser.uid : null; // Isola o código UID único do autor que está enviando o formulário. // Captura the código UID secreto do operador autor do preenchimento da tela.

      const colecaoAlvoRef = collection(db, nomeColecao); // Cria uma linha de comunicação apontando dinamicamente para a tabela solicitada via texto (Ex: "melhorias"). // Aponta a linha de comunicação direto para a pasta dinâmica escolhida por texto.
      return await addDoc(colecaoAlvoRef, { // Manda a ordem de criação anexando os dados do formulário e o passaporte do funcionário. // Grava o documento adicionando os dados da tela e a assinatura do autor.
        ...dadosDocumento, // Copia e expande de forma íntegra os textos e descrições do chamado protocolado pela equipe. // Expande os campos e textos capturados do formulário de ouvidoria de melhorias.
        autorId: uidUsuario // Anexa a ID criptografada do funcionário autor do chamado para cruzar com as travas de privacidade da visão. // Anexa de forma permanente the ID do funcionário para travas de privacidade SaaS.
      }); // Conclui a gravação do registro genérico na nuvem, retornando o carimbo de sucesso gerado pela Google. // Sela a escrita genérica na nuvem devolvendo as chaves de confirmação de sucesso.
    } catch (error) { // Captura e isola falhas operacionais do servidor ou queda abrupta de sinal de rede. // Captura panes operacionais se a gravação genérica for rejeitada pela Google.
      console.error(`Erro no dbService ao salvar na colecao ${nomeColecao}:`, error); // Imprime o relatório técnico com o nome da coleção corrompida no painel do programador. // Imprime as panes técnicas de tabelas genéricas no painel de diagnósticos.
      throw error; // Arremessa a falha para a visão correspondente emitir o alerta na tela do usuário. // Arremessa o erro para a tela correspondente emitir os balões de avisos.
    } // Encerra o bloco de suporte e tratamento de erro de tabelas genéricas. // Fecha o bloco protetor de salvamentos dinâmicos genéricos.
  }, // Encerra a função plugue universal de salvamento de documentos genéricos. // Fecha a função operacional de salvamento genérico de tabelas.

  async escutarColecaoGenerica(nomeColecao, callback) { // Plugue reativo universal criado para deixar um grampo ouvindo qualquer tabela genérica de forma dinâmica. // Grampo reativo que vigia alterações em qualquer pasta genérica do banco de dados.
    const colecaoAlvoRef = collection(db, nomeColecao); // Estabelece a mira eletrônica cirúrgica em cima da tabela indicada por parâmetro de texto. // Fixa a mira eletrônica na tabela indicada via parâmetro de texto da chamada.
    return onSnapshot(colecaoAlvoRef, (snapshot) => { // Ativa o monitor permanente da Google que fica vigiando as alterações daquela pasta específica. // Liga a escuta permanente do Firebase que avisa mudanças sem precisar de F5.
      const listaDocumentosLimpas = []; // Monta uma bandeja limpa na memória ram do computador para organizar as ideias ou chamados que vão descer da nuvem. // Cria uma bandeja local vazia para acomodar as melhorias que estão descendo.
      snapshot.forEach((documento) => { // Inicia a varredura passando registro por registro de chamado protocolado pela equipe no servidor. // Varre chamado por chamado cadastrado pela equipe na tabela remota da nuvem.
        listaDocumentosLimpas.push({ id: documento.id, ...documento.data() }); // Funde o ID alfa-numérico da nuvem com os textos internos do chamado e coloca na bandeja. // Une a ID da nuvem com as descrições da melhoria e joga na bandeja.
      }); // Conclui a varredura de registros genéricos. // Conclui a organização do lote de registros genéricos recebidos.
      callback(listaDocumentosLimpas); // Despacha a bandeja de dados limpos para o controlador reativar o redesenho dos blocos coloridos de forma instantânea. // Envia a lista unificada de melhorias de volta para a tela se re-renderizar na hora.
    }); // Encerra o monitoramento em tempo real de tabelas genéricas. // Fecha o monitor reativo dinâmico de coleções genéricas da nuvem.
  } // Encerra o plugue reativo universal de escuta de coleções genéricas. // Fecha a função plugue de escuta genérica de tabelas.
}; // Encerra a exportação do objeto de controle de serviços do banco de dados dbService. // Encerra e fecha por completo a maleta de serviços do banco de dados.