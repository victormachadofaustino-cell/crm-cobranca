import React, { useState, useEffect } from "react"; // -> Traz a biblioteca mestre do React e os ganchos de monitoramento de memória RAM de forma nativa.
import { auth, db } from "./config/firebase"; // -> Conecta o acesso direto e as chaves de segurança criadas na engrenagem de configuração do Firebase.
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"; // -> Puxa os comandos reais do Google Auth para gerenciamento de login e novos cadastros corporativos.
import { collection, onSnapshot, updateDoc, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore"; // -> Puxa as ferramentas estáveis do SDK do Firestore para criar, ler, atualizar e deletar documentos de forma atômica.
import Header from "./components/Layout/Header"; // -> PEÇA DE LEGO PLUGADA: Importa o componente especialista de navigation global do topo corporativo.
import { Toolbar } from "./components/CRM/Toolbar"; // -> PRESERVAÇÃO ESTRITA: Mantém a importação com chaves calibrada para sincronizar as visões com o disco.
import TabelaCobranca from "./components/CRM/TabelaCobranca"; // -> PEÇA DE LEGO PLUGADA: Importa o componente especialista de tabela comercial executiva.
import ModalCadastro from "./components/CRM/ModalCadastro"; // -> PEÇA DE LEGO PLUGADA: Importa o componente especialista de cadastro isolado de nova dívida.
import CardCobranca from "./components/CRM/CardCobranca"; // -> PEÇA DE LEGO PLUGADA: Importa o componente isolado especialista do card branco de devedor.
import FilterDrawer from "./components/CRM/FilterDrawer"; // -> PEÇA DE LEGO PLUGADA: Importa a nova gaveta lateral direita especialista em filtros simultâneos.
import ModuloCadastros from "./components/Cadastros/ModuloCadastros"; // -> PEÇA DE LEGO PLUGADA: Importa a central de parametrização bruta e mesa de cobradores.
import ModalProntuario from "./components/CRM/ModalProntuario"; // -> PEÇA DE LEGO PLUGADA INÉDITA: Acopla o super-painel tridimensional espelhado de negociações e desfechos.
import ModuloTarefas from "./components/Tarefas/ModuloTarefas"; // -> INJEÇÃO DE LINHA MANDATÓRIA: Importa a central de controle operacional de agendamentos futuros.
import ModuloDashboard from "./components/Dashboard/ModuloDashboard"; // -> INJEÇÃO DE LINHA FINAL: Importa o cérebro estatístico de Big Numbers e gráficos nativos do funil.
import { ModuloFinanceiro } from "./components/Financeiro/ModuloFinanceiro"; // -> INJEÇÃO DA CONTROLADORIA FINTECH: Conecta o painel especialista em fluxos de caixa, splits e liquidação Price.
import ModuloMensagens from "./components/Cadastros/ModuloMensagens"; // -> NOVA INJEÇÃO MODULAR: Conecta o painel especialista em réguas de cobrança e automações de mensagens por etapas.
import { ImportadorAging } from "./components/Importador/Importador"; // -> NOVA INJEÇÃO COMPATÍVEL: Puxa o motor inteligente de processamento em lote da planilha Aging do Victor.

export default function App() { // -> Define e exporta a função mestre que gerencia todo o componente visual da aplicação.
  const [user, setUser] = useState(null); // -> Guarda o crachá do operador logado ou mantém nulo se deslogado no sistema.
  const [cobrancas, setCobrancas] = useState([]); // -> Armazena a lista viva de empresas devedoras vinda em tempo real do Firebase.
  const [email, setEmail] = useState(""); // -> Monitora o texto digitado caractere por caractere na caixinha de e-mail de login.
  const [senha, setSenha] = useState(""); // -> Monitora o texto digitado caractere por caractere na caixinha de senha de login.
  const [modoAuth, setModoAuth] = useState("login"); // -> Controla se exibe o painel de "login" ou muda para o de "cadastro".
  const [modalAberto, setModalAberto] = useState(false); // -> Controla o sumiço ou aparecimento do modal de inserção de Nova Cobrança.
  const [abaAtiva, setAbaAtiva] = useState("crm"); // -> GAVETA DE NAVEGAÇÃO: Controla eletronicamente qual módulo principal do topo está ativo.
  const [visaoCrm, setVisaoCrm] = useState("kanban"); // -> GAVETA DE LAYOUT DO CRM: Define se exibe os cards em formato "kanban" or a grade em "tabela".
  const [gavetaFiltrosAberta, setGavetaFiltrosAberta] = useState(false); // -> GAVETA DE FILTROS: Controla se a gaveta de filtros lateral direita aparece ou some.
  
  // -> ESTADOS LOCAIS ADICIONADOS PARA A FIAÇÃO DO SUPER MODAL PRONTUÁRIO
  const [modalProntuarioAberto, setModalProntuarioAberto] = useState(false); // -> GAVETA DE VISÃO DO PRONTUÁRIO: Abre ou fecha a cortina do super-painel tridimensional.
  const [cardSelecionadoProntuario, setCardSelecionadoProntuario] = useState(null); // -> DEVEDOR EM FOCO: Memoriza na RAM o objeto completo do devedor clicado para expandir seus dados.

  // -> NOVO ESTADO ADICIONADO PARA O LIMBO DE ARQUIVADOS DO CLICKUP
  const [exibirArquivados, setExibirArquivados] = useState(false); // -> INTERRUPTOR GLOBAL: Controla se a tela exibe a esteira activa de faturamento ou o arquivo de itens arquivados.

  // MEMÓRIA DE BUSCA COMBINADA EXPANDIDA DO CRM: Inicializa o objeto com todas as chaves de cabeçalho solicitadas para filtrar simultaneamente.
  const [filtrosAtivos, setFiltrosAtivos] = useState({ codigo: "", cliente: "", responsavel: "", status: "todos", operadorValor: ">=", valorLimite: "" }); // -> RECALIBRACIÓN COMPLETA: Agrega travas lógicas e numéricas de saldo para raias e planilhas.
  
  // -> CONFIGURAÇÕES DE ORDENAÇÃO DO CRM FINANCEIRO: Armazena qual coluna rege a planilha e in qual sentido de triagem.
  const [campoOrdenadoCrm, setCampoOrdenadoCrm] = useState(""); // -> Memoriza a string della coluna de devedores clicada (Ex: 'codigo', 'cliente', 'valorVencido').
  const [direcaoOrdenacaoCrm, setDirecaoOrdenacaoCrm] = useState("asc"); // -> Chaveia o fluxo entre ordem alfabética/numérica crescente ('asc') ou decrescente ('desc').

  // -> FIÇÃO CENTRAL RELACIONAL: Gaveta mestre que centraliza todas as empresas homologadas para abastecer o Kanban e o Cadastro juntos.
  const [empresasBase, setEmpresasBase] = useState([]); // -> Inicializa la bandeja vazia para receber os dados limpos da nuvem via snapshot.
  
  // -> FIÇÃO CENTRAL DE CONTACTOS HUMANOS: Guarda na memória a lista real de representantes vindos da coleção cadastros_contatos del Firebase.
  const [contatosBase, setContatosBase] = useState([]); // -> Inicializa o estado reativo global de contatos para sincronismo de tabelas.

  // -> NOVAS FIÇÕES DE BANCO: Bandejas de memória ram destinadas a receber e reter os dados das coleções independentes da nuvem.
  const [segmentosBase, setSegmentosBase] = useState([]); // -> MONITORIA DE BANCO: Escuta os nichos de mercado vindos do banco de dados de forma assíncrona.
  const [vinculosBase, setVinculosBase] = useState([]); // -> MONITORIA DE BANCO: Escuta as categorias de elo humano vindas do banco de dados de forma assíncrona.

  // 🛠️ RECALIBRAÇÃO DO MÓDULO FUNIL DINÂMICO: Transmutado em estado reativo para carregar o array NoSQL del cofre da nuvem.
  const [colunasFunil, setColunasFunil] = useState([]); // -> Substitui a matriz travada no código por um listener dinâmico em tempo real.

  // 🧺 NOVO ESTADO DE SELEÇÃO EM MASSA: Guarda as seleções de caixas de checkbox do usuário.
  const [itensSelecionados, setItensSelecionados] = useState({}); // -> Guarda um mapa de booleanos reativos chaveados pelo ID físico de cada documento.

  useEffect(() => { // -> Ativa um gancho de efeito para rodar a escuta de chaves assim que o app liga.
    const monitorarAuth = onAuthStateChanged(auth, (usuarioLogado) => { // -> Vigia silenciosamente se o operador está com o login salvo no navegador.
      setUser(usuarioLogado); // -> Atualiza o crachá do operador com a sessão de credenciais encontrada.
    }); // -> Encerra o monitoring de estado de login.
    return () => monitorarAuth(); // -> Desliga a escuta quando o componente fecha para poupar memória RAM activa della máquina.
  }, []); // -> Indica que o efeito só roda uma vez na inicialização primária.

  useEffect(() => { // -> Ativa o gancho de efeito para leer a tabela de devedores no banco.
    if (!user) return; // -> Trava de segurança: Só puxa dados do Firebase si o operador estiver logado de verdade.

    const cobrancasRef = collection(db, "cobrancas"); // -> Mira os cabos de rede na tabela mestre de cobranças del Firestore.
    const monitorarBanco = onSnapshot(cobrancasRef, (snapshot) => { // -> Grampeia a tabela na nuvem trazendo modificações em tempo real.
      const listaTemporaria = []; // -> Cria uma bandeja limpa de rascunho na memória ram para organize os dados.
      snapshot.forEach((doc) => { // -> Varre pasta por pasta de clientes devedores no servidor da Google.
        listaTemporaria.push({ id: doc.id, ...doc.data() }); // -> Joga o ID exclusivo e as informações na bandeja organizada.
      }); // -> Termina a leitura do bloco de documentos del banco.
      setCobrancas(listaTemporaria); // -> Guarda na gaveta reativa e updates os cartões brancos no visor da tela.
    }); // -> Encerra o onSnapshot viva do banco.

    return () => monitorarBanco(); // -> Desliga o grampo do banco de dados ao fechar o CRM para evitar consumo de dados.
  }, [user]); // -> Recarrega esse efeito caso o operador logado mude de crachá.

  // -> CORDÃO DE REDE 1: Escuta ativa della nova coleção de empresas gerada pelo seu script de migração direta.
  useEffect(() => { // -> Ativa o gancho para ler a tabela estável de pessoas jurídicas na nuvem.
    if (!user) return; // -> Trava de segurança: impede o acesso se a sessão do operador estiver derrubada.
    const empresasRef = collection(db, "cadastros_empresas"); // -> Aponta a mira do leitor para a pasta oficial cadastros_empresas.
    const monitorarEmpresas = onSnapshot(empresasRef, (snapshot) => { // -> Grampeia em tempo real a coleção trazendo as empresas como a B2 IND E COM.
      const listaEmp = []; // -> Cria la bandeja em branco local.
      snapshot.forEach((doc) => { listaEmp.push({ id: doc.id, ...doc.data() }); }); // -> Despeja a ID física e os dados cadastrais higienizados.
      setEmpresasBase(listaEmp); // -> Aloca na memória ram global reativa do sistema.
    }); // -> Encerra a escuta.
    return () => monitorarEmpresas(); // -> Desliga o grampo ao sair do sistema para preservar a conexão.
  }, [user]); // -> Reinicia se o usuário de login for modificado.

  // -> CORDÃO DE REDE 2: Escuta ativa della nova coleção de contatos vinculados gerada pelo seu script de migração direta.
  useEffect(() => { // -> Ativa o gancho para ler a tabela estável de representantes humanos na nuvem.
    if (!user) return; // -> Trava de segurança contra acessos anônimos do banco.
    const contatosRef = collection(db, "cadastros_contatos"); // -> Aponta a mira do leitor para a pasta oficial cadastros_contatos.
    const monitorarContatos = onSnapshot(contatosRef, (snapshot) => { // -> Grampeia a coleção trazendo os contatos reais como o Hamilton.
      const listaCon = []; // -> Cria la bandeja em branco local.
      snapshot.forEach((doc) => { listaCon.push({ id: doc.id, ...doc.data() }); }); // -> Despeja a ID e o elo empresaId del banco.
      setContatosBase(listaCon); // -> Aloca na gaveta mestre para descida imediata nas propriedades.
    }); // -> Encerra a escuta de contatos.
    return () => monitorarContatos(); // -> Desliga a escuta de proteção de porta.
  }, [user]); // -> Reinicia se o usuário logado mudar o turno.

  // -> NOVO CORDÃO DE REDE 3: Escuta em tempo real della coleção inédita de Segmentos independentes na nuvem do Firestore.
  useEffect(() => { // -> Ativa o gancho de escuta técnica paralela para sincronismo imediato.
    if (!user) return; // -> Trava de barreira contra conexões fantasma.
    const segmentosRef = collection(db, "cadastros_segmentos"); // -> Intercepta os cabos mirados na rota limpa da coleção raiz cadastros_segmentos.
    const monitorarSegmentos = onSnapshot(segmentosRef, (snapshot) => { // -> Cria the snapshot vivo que ouve adições ou remoções de nichos.
      const listaSeg = []; // -> Inicializa o balde de alocação de RAM temporário.
      snapshot.forEach((doc) => { listaSeg.push({ id: doc.id, ...doc.data() }); }); // -> Empilha os documentos organized com suas IDs estruturadas.
      setSegmentosBase(listaSeg); // -> Despeja o lote na gaveta reativa de monitoramento mestre.
    }); // -> Termina o monitoramento síncrono.
    return () => monitorarSegmentos(); // -> Remove o canal de rede ao desligar o CRM para poupar tráfego de dados.
  }, [user]); // -> Recarrega se o operador de turno mudar o acesso.

  // -> NOVO CORDÃO DE REDE 4: Escuta em tempo real della coleção inédita de Vínculos civis na nuvem do Firestore.
  useEffect(() => { // -> Ativa o gancho de escuta técnica paralela para sincronismo imediato.
    if (!user) return; // -> Trava de barreira contra conexões fantasma.
    const vinculosRef = collection(db, "cadastros_vinculos"); // -> Intercepta os cabos mirados na rota limpa della coleção raiz cadastros_vinculos.
    const monitorarVinculos = onSnapshot(vinculosRef, (snapshot) => { // -> Cria o snapshot vivo que ouve adições ou remoções de papéis humanos.
      const listaVin = []; // -> Inicializa o balde de alocação de RAM temporário.
      snapshot.forEach((doc) => { listaVin.push({ id: doc.id, ...doc.data() }); }); // -> Empilha os documentos organized com suas IDs estruturadas.
      setVinculosBase(listaVin); // -> Despeja o lote na gaveta reativa de monitoramento mestre.
    }); // -> Termina o monitoramento síncrono.
    return () => monitorarVinculos(); // -> Remove o canal de rede ao desligar o CRM para poupar tráfego de dados.
  }, [user]); // -> Recarrega se o operador de turno mudar o acesso.

  // 🛠️ NOVO CORDÃO DE REDE 5 (NÓ DO FUNIL PAREADO): Conecta a escuta viva do esqueleto dinâmico de raias parametrizadas no Firebase
  useEffect(() => { // -> Sincroniza em tempo real as cabeceiras e selects do CRM.
    if (!user) return; // -> Barreira protetora contra leituras deslogadas.
    const funilDocRef = doc(db, "config_funil", "padrao"); // -> Aponta a mira fixa na rota de customização de colunas.
    const monitorarConfigFunil = onSnapshot(funilDocRef, (snapshot) => { // -> Abre a escuta viva NoSQL.
      if (snapshot.exists()) { // -> Checa a integridade física do documento.
        const configuracao = snapshot.data(); // -> Puxa os dados brutos.
        setColunasFunil(configuracao.etapas || []); // -> Aloca as colunas reais dinâmicas substituindo a matriz antiga.
      }
    });
    return () => monitorarConfigFunil(); // -> Desliga a fiação elástica ao sair.
  }, [user]);

  // =========================================================================================
  // ⚡ INSTANCIAÇÃO RECALIBRADA DO MOTOR CENTRAL DO IMPORTADOR AGING (SOLUÇÃO DE DUAS VIAS):
  // Inicializa a classe injetando o gatilho reativo direto na ID da Toolbar oficial da página
  // =========================================================================================
  useEffect(() => {
    if (!user || abaAtiva !== "crm") return; // -> Só inicializa o motor de carga se o cobrador estiver autenticado na aba operacional do CRM.
    
    // Configura um timer de retaguarda para garantir que a Toolbar já foi desenhada no HTML
    const timerInjecao = setTimeout(() => {
      const motorImportador = new ImportadorAging(() => {
        // Função executada reativamente assim que o processamento do lote conclui com sucesso
        setItensSelecionados({}); // -> Reseta marcações antigas limpando a RAM de fantasmas.
      });
      // ALINHAMENTO DO VÍNCULO VISUAL: Injeta o botão diretamente no local reservado na barra de ferramentas
      motorImportador.renderizarBotaoUpload("container-importador-toolbar-id"); 
    }, 150); // -> Aguarda 150 milissegundos para estabilização de carregamento da árvore de visualização.

    return () => clearTimeout(timerInjecao); // -> Desliga o timer ao desmontar a tela para preservar a máquina.
  }, [user, abaAtiva]); // -> Reinicia o acoplamento caso mude o turno ou mude de aba no menu superior.

  // 🧼 RESETADOR DE MARCAÇÃO EM LOTE: Limpa a gaveta de checkboxes ao trocar de aba ou de visão para evitar ghosts na RAM.
  useEffect(() => {
    setItensSelecionados({}); // -> Esvazia o mapa de seleções síncronamente.
  }, [abaAtiva, visaoCrm, exibirArquivados]);

  const manipularAutenticacao = async (e) => { // -> Função assíncrona que treats o envio del formulário de e-mail e senha.
    e.preventDefault(); // -> Bloqueia o recarregamento padrão da página para não receber os dados digitados.
    if (!email || !senha) return; // -> Trava de segurança: impede o envio se os campos estiverem vazios.

    try { // -> Escudo de proteção para disparar a chamada de rede internacional da Google.
      if (modoAuth === "login") { // -> Verifica se o operador selecionou o modo para apenas entrar no sistema.
        await signInWithEmailAndPassword(auth, email, senha); // -> Valida chaves contra o banco Firebase Auth.
      } else { // -> Caso o operador queira cadastrar uma credencial nova no CRM.
        await createUserWithEmailAndPassword(auth, email, senha); // -> Cadastra operador novo na nuvem de segurança.
        alert("Conta comercial cadastrada!"); // -> Alerta o sucesso humano na tela.
      } // -> Fecha o desvio de modo de autenticação.
    } catch (error) { // -> Captura erros de senha ou e-mail na rede de dados.
      let msg = "Falha no acesso! Verifique suas credenciais."; // -> Meragem genérica padrão de erro.
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") msg = "⚠️ Senha de segurança incorreta ou e-mail inválido!"; // -> Detalha erro de senha errada.
      else if (error.code === "auth/email-already-in-use") msg = "⚠️ Este e-mail já está em uso por outro operador!"; // -> Detalha erro de e-mail duplicado.
      else if (error.code === "auth/weak-password") msg = "⚠️ Senha fraca! Digite ao menos 6 dígitos."; 
      alert(msg); // -> Dispara o balão na tela com a mensagem amigável traduzida para o operador.
    } // -> Fecha o bloco de erro de portaria.
  }; // -> Fecha o manipulador mestre de acessos.

  const efetuarLogoutTurno = () => { // -> Função de desligamento seguro del terminal de faturamento.
    const confirmarSaida = confirm("🚪 FECHAMENTO DE TURNO:\nDeseja encerrar sua sessão e bloquear esta mesa de cobrança com segurança?"); // -> Pede confirmação humana antes de deslogar.
    if (confirmarSaida) { // -> Se o usuário aceitar o risco de sair da mesa.
      signOut(auth).then(() => { // -> Desconecta os tokens activos nos servidores da Google.
        localStorage.clear(); // -> Limpa os rastros de cache e lixo locais da máquina.
      }); // -> Encerra o encadeamento de limpeza.
    } // -> Encerra a checagem humana.
  }; // -> Fecha a função especialista de logout.

  // 🧳 NOVO MOTOR DE GRAVAÇÃO CONSOLIDADA (SACOLA DE NOTAS NoSQL): Intercepta a gravação manual, valida existência por CNPJ e agrupa os títulos sem duplicar cards
  const cadastrarNovaDividaDoModal = async (pacoteRecebidoDoModal) => { 
    // 🔥 CORREÇÃO CIRÚRGICA DE ENGENHARIA NoSQL: Limpa pontos, traços e barras da string recebida do modal para banir o erro de 3 segmentos que travava a interface.
    const cnpjChaveAlvo = pacoteRecebidoDoModal.cnpj ? String(pacoteRecebidoDoModal.cnpj).replace(/[^0-9]/g, '').trim() : ""; 
    
    // -> TRAVA DE SEGURANÇA OPERACIONAL: Aborta o disparo assíncrono caso o documento fiscal venha corrompido ou fantasma.
    if (!cnpjChaveAlvo) {
      alert("⚠️ ERRO DE COMPILAÇÃO NoSQL:\n\nO CNPJ do Cliente devedor veio indefinido ou em branco. O Firestore recusou o caminho de gravação.");
      return;
    }

    const cobrancaDocRef = doc(db, "cobrancas", cnpjChaveAlvo); // -> Define a rota física fixa: o ID de documento na nuvem passa a ser o próprio CNPJ numérico puro.

    try { 
      const snapshotCobranca = await getDoc(cobrancaDocRef); // -> Faz a leitura preventiva na nuvem para analisar se a sacola do devedor já existe.
      
      // Nova estrutura de Nota Fiscal individual extraída do modal manual
      const novaNotaFiscalObjeto = {
        numDocumento: pacoteRecebidoDoModal.numDocumento,
        referencia: pacoteRecebidoDoModal.referencia,
        atribuicao: pacoteRecebidoDoModal.atribuicao,
        dataDocumento: pacoteRecebidoDoModal.dataDocumento,
        vencimentoLiquido: pacoteRecebidoDoModal.vencimentoLiquido,
        valorNota: pacoteRecebidoDoModal.valorVencido, // -> O valor nominal individual deste título.
        executivoVendas: pacoteRecebidoDoModal.executivoVendas
      };

      if (snapshotCobranca.exists()) { 
        // CENÁRIO A: O devedor já possui uma sacola de cobrança viva no Kanban. Faz o Merge e acumula os saldos.
        const dadosExistentes = snapshotCobranca.data();
        const listaNotasAtualizada = [...(dadosExistentes.titulos || []), novaNotaFiscalObjeto]; // -> Anexa a nova nota fiscal na esteira de array sem apagar o histórico.
        
        // Calcula a soma real acumulada de todas as notas fiscais da sacola para atualizar a prancha
        const novoSaldoConsolidado = listaNotasAtualizada.reduce((acc, nota) => acc + (parseFloat(nota.valorNota) || 0), 0);

        await updateDoc(cobrancaDocRef, {
          titulos: listaNotasAtualizada, // -> Grava a sacola atualizada com a nova nota inserida.
          valorVencido: novoSaldoConsolidado, // -> Updates a variável reativa das raias com a somatória total.
          valor: novoSaldoConsolidado, // -> Sincroniza os contadores de topo.
          proposta: { valorCobrado: novoSaldoConsolidado, qtdParcelas: 1 } // -> Reseta o rascunho Price para recalcular com base no bolo bruto.
        });
        alert(`🟩 NOTA VINCULADA!\nA Nota Fiscal foi anexada com sucesso ao devedor unificado "${pacoteRecebidoDoModal.cliente}". Novo saldo total: R$ ${novoSaldoConsolidado.toLocaleString("pt-BR")}`);
      } else {
        // CENÁRIO B: Devedor inédito na esteira. Inicializa o card do zero com o primeiro item dentro da sacola.
        await setDoc(cobrancaDocRef, {
          codigo: pacoteRecebidoDoModal.codigo,
          cliente: pacoteRecebidoDoModal.cliente,
          cnpj: cnpjChaveAlvo, // -> Injeta o documento numérico limpo para travar caminhos de rede pares.
          responsavel: pacoteRecebidoDoModal.responsavel,
          status: "novo",
          statusInicial: "novo",
          categoria: "inicio",
          arquivado: false,
          valorVencido: pacoteRecebidoDoModal.valorVencido, // -> Inicia com o valor do primeiro título.
          valor: pacoteRecebidoDoModal.valorVencido,
          valorAVencer: 0,
          subStatus: "",
          observacao: pacoteRecebidoDoModal.observacao || "",
          tarefas: [],
          historicoNotas: [
            {
              conteudo: `Lote de cobrança unificado iniciado manualmente para o devedor. Primeira NF inserida: ${pacoteRecebidoDoModal.referencia}`,
              dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            }
          ],
          titulos: [novaNotaFiscalObjeto], // -> Inicializa la sacola com a primeira Nota Fiscal contida na planilha/modal.
          proposta: { valorCobrado: pacoteRecebidoDoModal.valorVencido, qtdParcelas: 1 }
        });
        alert(`🏢 CARD CRIADO!\nO devedor "${pacoteRecebidoDoModal.cliente}" foi inserido no Kanban com o primeiro título fiscal.`);
      }
      setModalAberto(false); // -> Fecha a cortina visual reativamente.
    } catch (err) { 
      alert("Erro crítico de barramento NoSQL ao consolidar sacola de notas!"); 
    } 
  }; // -> Encerra o controlador do faturamento consolidado del formulário.

  // 🛠️ RECALIBRAÇÃO INTEGRAL: Transforma o comando em Chave Gangorra (Arquivar / Desarquivar) com suporte ao Limbo do ClickUp
  const arquivarCobrancaNoLimbo = async (id, cliente) => { 
    const itemAlvo = cobrancas.find(c => c.id === id); // -> Busca na lista RAM o status booleano atual do item clicado para descobrir a intenção do operador.
    const estaArquivadoAtualmente = itemAlvo?.arquivado === true; // -> Extrai a flag verdadeira de arquivo morto.

    const messageConfirmacao = estaArquivadoAtualmente 
      ? `📤 DESARQUIVAMENTO DE CARD:\nDeseja resgatar a empresa "${cliente}" tirando-a do Limbo e mandando-a de volta para o fluxo de cobrança ativo?`
      : `📦 ARQUIVAMENTO DE CARD (ESTILO CLICKUP):\nDeseja Ocultar a empresa "${cliente}" enviando-a para o Limbo de Arquivados?\n\nO... registro sairá do visor mas seus logs históricos continuum salvos.`;

    const confirmacao = confirm(messageConfirmacao); // -> Dispara o balão de segurança humana.
    if (confirmacao) { 
      const docRef = doc(db, "cobrancas", id); // -> Localiza the endereço físico fixo do card de devedor.
      await updateDoc(docRef, { arquivado: !estaArquivadoAtualmente }); // -> INVERSÃO OPERACIONAL DE FLUXO: Se for true vira false, se for false vira true, chaveando o nó síncronamente.
      
      if (cardSelecionadoProntuario && cardSelecionadoProntuario.id === id) { // -> Ajuste fino de memória RAM: Se o prontuário estiver expandido, atualiza o foco para refletir a nova flag na mesma hora.
        setCardSelecionadoProntuario(prev => ({ ...prev, arquivado: !estaArquivadoAtualmente })); // -> Sincroniza la gaveta interna.
      }
    } 
  }; 

  // 🗑️ NOVO COMANDO NoSQL MANDATÓRIO: Executa o expurgo e deleção física irreversível do nó de cobrança direta no cofre do Firestore
  const excluirCobrancaDefinitivamente = async (id, cliente) => {
    const confirmacao = confirm(`🚨 EXCLUSÃO DEFINITIVA NoSQL:\nDeseja triturar e apagar permanentemente o registro de cobrança da empresa "${cliente}" do banco de dados?\n\nEsta ação é irreversível e apagará todas as parcelas Price vinculadas.`); // -> Pop-up nativo de barreira contra desastres.
    if (confirmacao) {
      try {
        const docRef = doc(db, "cobrancas", id); // -> Localiza a ID física do nó.
        await deleteDoc(docRef); // -> Invoca o método de trituração física NoSQL.
        setModalProntuarioAberto(false); // -> Fecha o prontuário se ele estiver aberto por salvaguarda.
        setCardSelecionadoProntuario(null); // -> Limpa a memória ram de foco.
      } catch (err) {
        alert("Falha de privilégio ou queda de rede ao apagar cobrança!"); // -> Escudo de proteção.
      }
    }
  };

  // 🧺 NOVO MOTOR ASSÍNCRONO DE EXECUÇÃO EM MASSA FIXADO: Corrigida a grafia interna de 'ejecutar' para 'executarExclusaoEmMassa' batendo com a Toolbar.
  const copiarExclusaoEmMassa = async (tipoColecao) => {
    const idsParaBanir = Object.keys(itensSelecionados).filter(id => itensSelecionados[id]); // -> Filtra o mapa de RAM separando apenas os IDs marcados com flag true.
    if (idsParaBanir.length === 0 || !confirm(`🚨 CONTROLADORIA EM LOTE (EM MASSA):\nDeseja apagar permanentemente os ${idsParaBanir.length} itens marcados de uma só vez do Firebase?\n\nEsta operação triturará os dados em massa e não poderá ser desfeita!`)) return; // -> Aborta se houver recusa voluntária ou lote zerado.

    try {
      await Promise.all(idsParaBanir.map(id => deleteDoc(doc(db, tipoColecao, id)))); // -> Dispara o bombardeio síncrono limpando todas as IDs marcadas ao mesmo tempo na nuvem Google.
      setItensSelecionados({}); // -> Reseta completamente o mapa de checkboxes no visor.
    } catch (err) {
      alert("Falha de comunicação ou privilégio insuficiente para exclusão em lote!"); // -> Escudo de queda de sinal.
    }
  };

  // 🛠️ NOVO MOTOR REATIVO DE EDIÇÃO EM MASSA DE DUAS ETAPAS (CORE NoSQL): Varre as IDs flegadas e aplica a mutação exata escolhida na Toolbar
  const executarEdicaoEmMassa = async (campoAlvo, novoValor) => {
    const idsParaEditar = Object.keys(itensSelecionados).filter(id => itensSelecionados[id]); // -> Coleta do mapa de RAM apenas os registros que possuem flag booleana true.
    if (idsParaEditar.length === 0 || !confirm(`⚙️ OPERAÇÃO EM LOTE REATIVA:\nDeseja reconfigurar e alterar o campo "${campoAlvo.toUpperCase()}" para o valor "${novoValor.toUpperCase()}" em todos os ${idsParaEditar.length} registros selecionados de uma vez só?`)) return; // -> Trava contra cliques fantasmas.

    let colecao = abaAtiva === "cadastros" ? (campoAlvo === "segmento" || campoAlvo === "tipo" ? "cadastros_empresas" : "cadastros_contatos") : "cobrancas"; 

    try {
      await Promise.all(idsParaEditar.map(id => {
        let pacote = { [campoAlvo]: campoAlvo === "cliente" || campoAlvo === "segmento" ? novoValor.toUpperCase() : novoValor };
        if (campoAlvo === "status") {
          pacote.categoria = colunasFunil.find(c => c.id === novoValor)?.categoria || "em_andamento";
        }
        return updateDoc(doc(db, colecao, id), pacote);
      }));
      setItensSelecionados({}); // -> Esvazia reativamente o mapa de checkboxes limpando as planilhas da tela de uma vez só.
    } catch (err) {
      alert("Falha de barramento ou falta de privilégio NoSQL ao rodar atualização em lote!"); // -> Escudo ao cair rede de dados.
    }
  };

  const aoIniciarArrastoCard = (e, idCard, statusOrigem) => { // -> Disparado no instante em que você pinça o card ou a linha da tabela com o mouse.
    e.dataTransfer.setData("text/plain", idCard); // -> Amarra o ID della cobrança na memória invisível do ponteiro.
    e.dataTransfer.setData("origem-status", statusOrigem); // -> Amarra a raia cinza de onde o item está decolando.
  }; // -> Fecha o dragstart nativo.

  // 🛠️ CORREÇÃO DE PROPRIEDADE NOS CANAIS DO FUNIL: Alterado de 'category' para 'categoria' para reflectir estritamente as regras NoSQL mapeadas.
  const aoSoltarCardNaRaia = async (e, statusDestino) => { // -> Disparado quando você solta o clique em cima de uma raia ou indicador de fase.
    e.preventDefault(); // -> Bloqueia ações e recargas espúrias del navegador.
    const idCard = e.dataTransfer.getData("text/plain"); // -> Resgata o ID do cliente escondido no ponteiro do mouse.
    const statusOrigem = e.dataTransfer.getData("origem-status"); // -> Resgata de qual coluna ele voou.

    if (idCard && statusOrigem !== statusDestino) { // -> Valida se ele aterrissou in uma raia diferente da de largada.
      const catMae = colunasFunil.find(c => c.id === statusDestino)?.categoria || "em_andamento"; // -> Descobre a categoria mãe estável do esqueleto.
      await updateDoc(doc(db, "cobrancas", idCard), { status: statusDestino, categoria: catMae }); 
    } // -> Encerra a validação física.
  }; // -> Fecha o drop nativo.

  // 🛠️ CORREÇÃO DE PROPRIEDADE EM LOTE LINHA: Ajustado dropdown de 'category' para 'categoria' para manter o espelho retrocompatível do banco livre de cartões ghosts.
  const mudarStatusCobrancaDireto = async (idCard, novoStatusDestino) => { // -> Acionado pelo select dropdown de dentro de qualquer linha da tabela.
    try {
      const catMae = colunasFunil.find(c => c.id === novoStatusDestino)?.categoria || "em_andamento"; // -> Descobre a macro-categoria mãe imutável do sistema.
      await updateDoc(doc(db, "cobrancas", idCard), { status: novoStatusDestino, categoria: catMae }); // -> Mantém o espelho retrocompatível do banco.
    } catch (err) { 
      alert("Falha crítica de barramento de rede ao mover status in linha!"); // -> Alerta em caso de queda de sinal de internet.
    }
  };

  const lidarComCliqueFichaDEvedor = (card) => { // -> Disparado quando clica na área interna ou na linha de dados da tabela.
    setCardSelecionadoProntuario(card); // -> Popula a memória de foco with o objeto completo do devedor.
    setModalProntuarioAberto(true); // -> Rompe o isolamento visual e levanta a janela espelhada na tela do cobrador.
  };

  const atualizarDadosProntuarioDoBanco = async (idCard, pacote) => { // -> Acionado pelo botão de salvar ou pelos desfechos de sucesso/insucesso.
    try {
      await updateDoc(doc(db, "cobrancas", idCard), { 
        observacao: pacote.observacao || "",
        subStatus: pacote.subStatus || "", 
        proposta: { ...pacote.proposta }, 
        historicoNotas: pacote.historicoNotas || [], 
        tarefas: pacote.tarefas || [],
        valorVencido: pacote.valorVencido || card.valorVencido, // -> Preserva a integridade do saldo do devedor consolidado.
        titulos: pacote.titulos || card.titulos // -> CORRIGIDO: Removido o caractere de interrogação órfão que causava o erro 500 de barramento remoto.
      });
      setModalProntuarioAberto(false); // -> Fecha a cortina visual na tela reativamente.
      setCardSelecionadoProntuario(null); // -> Libera a fiação limpando o foco della RAM.
    } catch (err) { alert("Erro ao salvar prontuário."); }
  };

  const lidarComMudarOrdenacaoCrm = (campo) => { // -> Gerencia a alternância de A-Z ou Z-A na esteira financeira.
    if (campoOrdenadoCrm === campo) { // -> Se o operador clicou no mesmo cabeçalho ativo.
      setDirecaoOrdenacaoCrm(direcaoOrdenacaoCrm === "asc" ? "desc" : "asc"); // -> Inverte a direção del fluxo alternando entre crescente e decrescente.
    } else { // -> Caso seja um clique inédito.
      setCampoOrdenadoCrm(campo); // -> Define a nova coluna de ordenação.
      setDirecaoOrdenacaoCrm("asc"); // -> Retorna ao sentido crescente nativo.
    }
  }; // -> Encerra o chaveamento de ordenação.

  // =========================================================================================
  // ⚡ SUPER MOTOR DE CRUZAMENTO RELACIONAL (ESTRATÉGIA A):
  // Varre a esteira e injeta na RAM o contato correspondente antes de desenhar a tela
  // =========================================================================================
  const cobrancasComContatosVinculados = cobrancas.map((item) => {
    const vinculo = contatosBase.find((con) => con.empresaId === item.id || con.empresaId === item.empresaId) || 
                    contatosBase.find((con) => con.nome?.trim().toUpperCase() === item.cliente?.trim().toUpperCase()); 
    return vinculo ? { ...item, contato: { nome: vinculo.nome, telephone: vinculo.telefone || vinculo.telephone, email: vinculo.email, vinculo: vinculo.tipoVinculo || "proprio" } } : item;
  });

  const cobrancasFiltradas = cobrancasComContatosVinculados.filter((item) => { // -> Executa a varredura reativa baseada nas chaves de cabeçalho e regras matemáticas de corte.
    if (exibirArquivados ? !item.arquivado : item.arquivado) return false; 
    const bateCodigo = !filtrosAtivos.codigo || String(item.codigo).toLowerCase().includes(filtrosAtivos.codigo.toLowerCase()); 
    const bateCliente = !filtrosAtivos.cliente || item.cliente?.toLowerCase().includes(filtrosAtivos.cliente.toLowerCase()); 
    const bateResponsavel = !filtrosAtivos.responsavel || item.responsavel?.toLowerCase().includes(filtrosAtivos.responsavel.toLowerCase()); 
    const bateStatus = filtrosAtivos.status === "todos" || item.status === filtrosAtivos.status; 

    let bateValor = true; 
    if (filtrosAtivos.valorLimite !== "") { 
      const valorItem = parseFloat(item.valorVencido) || 0; 
      const limite = parseFloat(filtrosAtivos.valorLimite); 
      if (filtrosAtivos.operadorValor === "<=") bateValor = valorItem <= limite; 
      else if (filtrosAtivos.operadorValor === "<") bateValor = valorItem < limite; 
      else if (filtrosAtivos.operadorValor === ">") bateValor = valorItem > limite; 
      else if (filtrosAtivos.operadorValor === ">=") bateValor = valorItem >= limite; 
    }
    return bateCodigo && bateCliente && bateResponsavel && bateStatus && bateValor;
  }); 

  const totalFiltrosCombinados = (filtrosAtivos.codigo ? 1 : 0) + (filtrosAtivos.cliente ? 1 : 0) + (filtrosAtivos.responsavel ? 1 : 0) + (filtrosAtivos.status !== "todos" ? 1 : 0) + (filtrosAtivos.valorLimite !== "" ? 1 : 0); 

  const cobrancasOrdenadasCrm = [...cobrancasFiltradas].sort((a, b) => { 
    if (!campoOrdenadoCrm) return 0; 
    let vA = campoOrdenadoCrm === "valorVencido" ? (parseFloat(a[campoOrdenadoCrm]) || 0) : String(a[campoOrdenadoCrm] || "").toLowerCase();
    let vB = campoOrdenadoCrm === "valorVencido" ? (parseFloat(b[campoOrdenadoCrm]) || 0) : String(b[campoOrdenadoCrm] || "").toLowerCase();
    return vA < vB ? (direcaoOrdenacaoCrm === "asc" ? -1 : 1) : vA > vB ? (direcaoOrdenacaoCrm === "asc" ? 1 : -1) : 0;
  }); 

  if (!user) { // -> Abre a condition de portaria de segurança caso o crachá esteja em branco.
    return ( // -> Renderiza o HTML della tela dividida escura de login.
      <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ background: "white", padding: "35px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", textAlign: "center" }}>
            {modoAuth === "login" ? "Acesso ao CRM" : "Criar Conta Nova"}
          </h2>
          <form onSubmit={manipularAutenticacao} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
            <input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
            <input type="password" required placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
            <button type="submit" style={{ background: "#0f172a", color: "white", padding: "12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Entrar</button>
            <div style={{ textAlign: "center" }}><a href="#" onClick={() => setModoAuth(modoAuth === "login" ? "cadastro" : "login")} style={{ fontSize: "12px", color: "#0f172a" }}>Alternar Modo</a></div>
          </form>
        </div>
      </div>
    ); 
  }

  return ( // -> Renderiza as barras e raias comerciais integradas em tempo real com suporte a mutações em massa.
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f8fafc", paddingBottom: "60px" }}>
      <Header abaAtiva={abaAtiva} aoMudarAba={setAbaAtiva} aoLogof={efetuarLogoutTurno} />

      {abaAtiva === "crm" && ( 
        <>
          <Toolbar 
            visaoAtual={visaoCrm} aoMudarVisao={setVisaoCrm} 
            aoAbrirModalCadastro={() => setModalAberto(true)} aoAbrirGavetaFiltros={() => setGavetaFiltrosAberta(true)} 
            totalFiltrosAtivos={totalFiltrosCombinados} exibirArquivados={exibirArquivados} aoAlternarArquivados={setExibirArquivados} 
            itensSelecionados={itensSelecionados} aoExecutarExclusaoEmMassa={() => copiarExclusaoEmMassa("cobrancas")} 
            aoExecutarEdicaoEmMassa={executarEdicaoEmMassa} etapasFunilExternas={colunasFunil} abaAtivaAtual={abaAtiva} 
          />

          {visaoCrm === "kanban" && ( 
            <main style={{ maxWidth: "1400px", margin: "20px auto 0 auto", padding: "0 20px", display: "flex", gap: "20px", overflowX: "auto" }}>
              {colunasFunil.map((coluna) => { 
                const cardsDaColuna = cobrancasFiltradas.filter((c) => (c.status || "novo") === coluna.id); 
                const totalRaia = cardsDaColuna.reduce((acc, c) => acc + (parseFloat(c.valorVencido) || 0), 0); 
                if (filtrosAtivos.status !== "todos" && filtrosAtivos.status !== coluna.id) return null; 

                return ( 
                  <div key={coluna.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => aoSoltarCardNaRaia(e, coluna.id)} style={{ backgroundColor: "#f1f5f9", padding: "16px", borderRadius: "12px", minWidth: "280px", flex: 1 }}>
                    <h2 style={{ fontSize: "12px", fontWeight: "700", display: "flex", justifyRef: "space-between", justifyContent: "space-between" }}>
                      <span>{coluna.nome}</span>
                      <span>{cardsDaColuna.length} • R$ {totalRaia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}> 
                      {cardsDaColuna.map((card) => ( 
                        <CardCobranca key={card.id} card={card} colunaId={coluna.id} aoIniciarArrasto={aoIniciarArrastoCard} aoDeletar={arquivarCobrancaNoLimbo} aoClicarCard={lidarComCliqueFichaDEvedor} exibirArquivados={exibirArquivados} />
                      ))}
                    </div>
                  </div>
                ); 
              })} 
            </main> 
          )}

          {visaoCrm === "tabela" && ( 
            <TabelaCobranca cobrancasFiltradas={cobrancasFiltradas} cobrancas={cobrancasOrdenadasCrm} aoClicarLinha={lidarComCliqueFichaDEvedor} aoDeletar={arquivarCobrancaNoLimbo} campoOrdenado={campoOrdenadoCrm} direcaoOrdenacao={direcaoOrdenacaoCrm} aoMudarOrdenacao={lidarComMudarOrdenacaoCrm} aoMudarStatusDireto={mudarStatusCobrancaDireto} exibirArquivados={exibirArquivados} itensSelecionados={itensSelecionados} setItensSelecionados={setItensSelecionados} aoIniciarArrastoLinha={aoIniciarArrastoCard} aoSoltarLinhaNaEtapa={aoSoltarCardNaRaia} />
          )}
        </>
      )}

      {abaAtiva === "dashboard" && <ModuloDashboard cobrancas={cobrancas} etapasFunilExternas={colunasFunil} />}
      {abaAtiva === "financeiro" && <ModuloFinanceiro cobrancas={cobrancas} aoMudarStatusDireto={mudarStatusCobrancaDireto} />}
      {abaAtiva === "tarefas" && <ModuloTarefas cobrancas={cobrancas} />}
      
      {abaAtiva === "cadastros" && ( 
        <ModuloCadastros 
          empresasAtivasExternas={empresasBase} 
          aoAtualizarEmpresasExternas={setEmpresasBase} // -> AMARRAÇÃO COMPLETA: Injetada a trigger NoSQL mestre para retroalimentação síncrona.
          contatosAtivosExternos={contatosBase} 
          segmentosExternos={segmentosBase} 
          vinculosExternos={vinculosBase} 
          etapasFunilExternas={colunasFunil} 
          itensSelecionadosExternos={itensSelecionados} 
          setItensSelecionadosExternos={setItensSelecionados} 
          aoExecutarExclusaoEmMassaExternas={copiarExclusaoEmMassa} 
          aoExecutarEdicaoEmMassaExternas={executarEdicaoEmMassa} 
        /> 
      )}

      {(abaAtiva === "messages" || abaAtiva === "mensagens") && <ModuloMensagens etapasFunilExternas={colunasFunil} />}

      {/* Atalho Flutuante para Mensagens */}
      <div style={{ position: "fixed", bottom: "15px", right: "15px", zIndex: 9999, display: "flex", gap: "8px", background: "rgba(15, 23, 42, 0.95)", padding: "8px 12px", borderRadius: "30px" }}>
        <button onClick={() => setAbaAtiva("mensagens")} style={{ background: abaAtiva === "mensagens" ? "#3b82f6" : "#334155", color: "white", border: "none", padding: "5px 12px", borderRadius: "20px", cursor: "pointer" }}>💬 Mensagens</button>
        {abaAtiva !== "crm" && <button onClick={() => setAbaAtiva("crm")} style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "5px 12px", borderRadius: "20px", cursor: "pointer" }}>Voltar</button>}
      </div>

      <ModalCadastro aberto={modalAberto} aoFechar={() => setModalAberto(false)} aoSalvar={cadastrarNovaDividaDoModal} empresas={empresasBase} listaSegmentos={segmentosBase} />
      <FilterDrawer aberto={gavetaFiltrosAberta} aoFechar={() => setGavetaFiltrosAberta(false)} aoAplicarFiltros={(f) => { setFiltrosAtivos(f); setGavetaFiltrosAberta(false); }} />
      
      <ModalProntuario 
        aberto={modalProntuarioAberto} aoFechar={() => { setModalProntuarioAberto(false); setCardSelecionadoProntuario(null); }} 
        card={cardSelecionadoProntuario}
        colunaId={cardSelecionadoProntuario?.status || "novo"} contatosBase={contatosBase} listaVinculos={vinculosBase} 
        aoSalvarProntuário={atualizarDadosProntuarioDoBanco} exibirArquivados={exibirArquivados} aoAlternarArquivamentoNoModal={arquivarCobrancaNoLimbo} aoExcluirCardNoModal={excluirCobrancaDefinitivamente} 
      />
    </div>
  ); 
}