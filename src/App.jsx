import React, { useState, useEffect } from "react"; // -> Traz a biblioteca mestre do React e os ganchos de monitoramento de memória RAM de forma nativa.
import { auth, db } from "./config/firebase"; // -> Conecta o acesso direto e as chaves de segurança criadas na engrenagem de configuração do Firebase.
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"; // -> Puxa os comandos reais do Google Auth para gerenciamento de login e novos cadastros corporativos.
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore"; // -> Puxa as ferramentas estáveis do SDK do Firestore para criar, ler, atualizar e deletar documentos.
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

export default function App() { // -> Define e exporta a função mestre que gerencia todo o componente visual da aplicação.
  const [user, setUser] = useState(null); // -> Guarda o crachá do operador logado ou mantém nulo se deslogado no sistema.
  const [cobrancas, setCobrancas] = useState([]); // -> Armazena a lista viva de empresas devedoras vinda em tempo real do Firebase.
  const [email, setEmail] = useState(""); // -> Monitora o texto digitado caractere por caractere na caixinha de e-mail de login.
  const [senha, setSenha] = useState(""); // -> Monitora o texto digitado caractere por caractere na caixinha de senha de login.
  const [modoAuth, setModoAuth] = useState("login"); // -> Controla se exibe o painel de "login" ou muda para o de "cadastro".
  const [modalAberto, setModalAberto] = useState(false); // -> Controla o sumiço ou aparecimento do modal de inserção de Nova Cobrança.
  const [abaAtiva, setAbaAtiva] = useState("crm"); // -> GAVETA DE NAVEGAÇÃO: Controla eletronicamente qual módulo principal do topo está ativo.
  const [visaoCrm, setVisaoCrm] = useState("kanban"); // -> GAVETA DE LAYOUT DO CRM: Define se exibe o funil em formato "kanban" ou "tabela".
  const [gavetaFiltrosAberta, setGavetaFiltrosAberta] = useState(false); // -> GAVETA DE FILTROS: Controla se a gaveta de filtros lateral direita aparece ou some.
  
  // -> ESTADOS LOCAIS ADICIONADOS PARA A FIAÇÃO DO SUPER MODAL PRONTUÁRIO
  const [modalProntuarioAberto, setModalProntuarioAberto] = useState(false); // -> GAVETA DE VISÃO DO PRONTUÁRIO: Abre ou fecha a cortina do super-painel tridimensional.
  const [cardSelecionadoProntuario, setCardSelecionadoProntuario] = useState(null); // -> DEVEDOR EM FOCO: Memoriza na RAM o objeto completo do devedor clicado para expandir seus dados.

  // -> NOVO ESTADO ADICIONADO PARA O LIMBO DE ARQUIVADOS DO CLICKUP
  const [exibirArquivados, setExibirArquivados] = useState(false); // -> INTERRUPTOR GLOBAL: Controla se a tela exibe a esteira ativa de faturamento ou o arquivo de itens arquivados.

  // MEMÓRIA DE BUSCA COMBINADA EXPANDIDA DO CRM: Inicializa o objeto com todas as chaves de cabeçalho solicitadas para filtrar simultaneamente.
  const [filtrosAtivos, setFiltrosAtivos] = useState({ codigo: "", cliente: "", responsavel: "", status: "todos", operadorValor: ">=", valorLimite: "" }); // -> RECALIBRAÇÃO COMPLETA: Agrega travas lógicas e numéricas de saldo para raias e planilhas.
  
  // -> CONFIGURAÇÕES DE ORDENAÇÃO DO CRM FINANCEIRO: Armazena qual coluna rege a planilha e em qual sentido de triagem.
  const [campoOrdenadoCrm, setCampoOrdenadoCrm] = useState(""); // -> Memoriza a string da coluna de devedores clicada (Ex: 'codigo', 'cliente', 'valorVencido').
  const [direcaoOrdenacaoCrm, setDirecaoOrdenacaoCrm] = useState("asc"); // -> Chaveia o fluxo entre ordem alfabética/numérica crescente ('asc') ou decrescente ('desc').

  // -> FIÇÃO CENTRAL RELACIONAL: Gaveta mestre que centraliza todas as empresas homologadas para abastecer o Kanban e o Cadastro juntos.
  const [empresasBase, setEmpresasBase] = useState([]); // -> Inicializa a bandeja vazia para receber os dados limpos da nuvem via snapshot.
  
  // -> FIÇÃO CENTRAL DE CONTACTOS HUMANOS: Guarda na memória a lista real de representantes vindos da coleção cadastros_contatos del Firebase.
  const [contatosBase, setContatosBase] = useState([]); // -> Inicializa o estado reativo global de contatos para sincronismo de tabelas.

  // -> NOVAS FIÇÕES DE BANCO: Bandejas de memória ram destinadas a receber e reter os dados das coleções independentes da nuvem.
  const [segmentosBase, setSegmentosBase] = useState([]); // -> MONITORIA DE BANCO: Escuta os nichos de mercado vindos do banco de dados de forma assíncrona.
  const [vinculosBase, setVinculosBase] = useState([]); // -> MONITORIA DE BANCO: Escuta as categorias de elo humano vindas do banco de dados de forma assíncrona.

  // 🛠️ RECALIBRAÇÃO DO MÓDULO FUNIL DINÂMICO: Transmutado em estado reativo para carregar o array NoSQL do cofre da nuvem.
  const [colunasFunil, setColunasFunil] = useState([]); // -> Substitui a matriz travada no código por um listener dinâmico em tempo real.

  useEffect(() => { // -> Ativa um gancho de efeito para rodar a escuta de chaves assim que o app liga.
    const monitorarAuth = onAuthStateChanged(auth, (usuarioLogado) => { // -> Vigia silenciosamente se o operador está com o login salvo no navegador.
      setUser(usuarioLogado); // -> Atualiza o crachá do operador com a sessão de credenciais encontrada.
    }); // -> Encerra o monitoramento de estado de login.
    return () => monitorarAuth(); // -> Desliga a escuta quando o componente fecha para poupar memória RAM activa della máquina.
  }, []); // -> Indica que o efeito só roda uma vez na inicialização primária.

  useEffect(() => { // -> Ativa o gancho de efeito para ler a tabela de devedores no banco.
    if (!user) return; // -> Trava de segurança: Só puxa dados do Firebase se o operador estiver logado de verdade.

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
      const listaEmp = []; // -> Cria a bandeja em branco local.
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
      const listaCon = []; // -> Cria a bandeja em branco local.
      snapshot.forEach((doc) => { listaCon.push({ id: doc.id, ...doc.data() }); }); // -> Despeja a ID e o elo empresaId do banco.
      setContatosBase(listaCon); // -> Aloca na gaveta mestre para descida imediata nas propriedades.
    }); // -> Encerra a escuta de contatos.
    return () => monitorarContatos(); // -> Desliga a escuta de proteção de porta.
  }, [user]); // -> Reinicia se o usuário logado mudar o turno.

  // -> NOVO CORDÃO DE REDE 3: Escuta em tempo real della coleção inédita de Segmentos independentes na nuvem do Firestore.
  useEffect(() => { // -> Ativa o gancho de escuta técnica paralela para sincronismo imediato.
    if (!user) return; // -> Trava de barreira contra conexões fantasma.
    const segmentosRef = collection(db, "cadastros_segmentos"); // -> Intercepta os cabos mirados na rota limpa da coleção raiz cadastros_segmentos.
    const monitorarSegmentos = onSnapshot(segmentosRef, (snapshot) => { // -> Cria o snapshot vivo que ouve adições ou remoções de nichos.
      const listaSeg = []; // -> Inicializa o balde de alocação de RAM temporário.
      snapshot.forEach((doc) => { listaSeg.push({ id: doc.id, ...doc.data() }); }); // -> Empilha os documentos organizados com suas IDs estruturadas.
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
      snapshot.forEach((doc) => { listaVin.push({ id: doc.id, ...doc.data() }); }); // -> Empilha os documentos organizados com suas IDs estruturadas.
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

  const manipularAutenticacao = async (e) => { // -> Função assíncrona que trata o envio del formulário de e-mail e senha.
    e.preventDefault(); // -> Bloqueia o recarregamento padrão da página para não perder os dados digitados.
    if (!email || !senha) return; // -> Trava de segurança: impede o envio se os campos estiverem vazios.

    try { // -> Escudo de proteção para disparar a chamada de rede internacional da Google.
      if (modoAuth === "login") { // -> Verifica se o operador selecionou o modo para apenas entrar no sistema.
        await signInWithEmailAndPassword(auth, email, senha); // -> Valida chaves contra o banco Firebase Auth.
      } else { // -> Caso o operador queira cadastrar uma credencial nova no CRM.
        await createUserWithEmailAndPassword(auth, email, senha); // -> Cadastra operador novo na nuvem de segurança.
        alert("Conta comercial cadastrada! Entrando no painel..."); // -> Alerta o sucesso humano na tela.
      } // -> Fecha o desvio de modo de autenticação.
    } catch (error) { // -> Captura erros de senha ou e-mail na rede de dados.
      let msg = "Falha no acesso! Verifique suas credenciais."; // -> Meragem genérica padrão de erro.
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") msg = "⚠️ Senha de segurança incorreta ou e-mail inválido!"; // -> Detalha erro de senha errada.
      else if (error.code === "auth/email-already-in-use") msg = "⚠️ Este e-mail já está em uso por outro operador!"; // -> Detalha erro de e-mail duplicado.
      else if (error.code === "auth/weak-password") msg = "⚠️ Senha fraca! Digite ao menos 6 dígitos." 
      alert(msg); // -> Dispara o balão na tela com a mensagem amigável traduzida para o operador.
    } // -> Fecha o bloco de erro de portaria.
  }; // -> Fecha o manipulador mestre de acessos.

  const efetuarLogoutTurno = () => { // -> Função de desligamento seguro del terminal de faturamento.
    const confirmarSaida = confirm("🚪 FECHAMENTO DE TURNO:\nDeseja encerrar sua sessão e bloquear esta mesa de cobrança com segurança?"); // -> Pede confirmação humana antes de deslogar.
    if (confirmarSaida) { // -> Se o usuário aceitar o risco de sair da mesa.
      signOut(auth).then(() => { // -> Desconecta os tokens ativos nos servidores da Google.
        localStorage.clear(); // -> Limpa os rastros de cache e lixo locais da máquina.
      }); // -> Encerra o encadeamento de limpeza.
    } // -> Encerra a checagem humana.
  }; // -> Fecha a função especialista de logout.

  const cadastrarNovaDividaDoModal = async (pacoteRecebidoDoModal) => { // -> Função assíncrona receptora que recebe o pacote estruturado direto del modal.
    try { // -> Tenta salvar na nuvem do Google Firestore.
      const cobrancasRef = collection(db, "cobrancas"); // -> Cria a linha mestre de mira na tabela de faturamento.
      // -> ADAPTAÇÃO NO FUNIL: Configura o card nascente apontando para o status de largada e injeta a chave imutável da categoria inicial.
      await addDoc(cobrancasRef, { 
        ...pacoteRecebidoDoModal, 
        status: colunasFunil[0]?.id || "novo", // -> Aponta para a ID da primeira raia viva configurada pelo usuário.
        categoria: colunasFunil[0]?.categoria || "inicio", // -> Injeta dinamicamente a categoria Core correspondente.
        arquivado: false, 
        historicoNotas: [], 
        tarefas: [], 
        proposta: { valorCobrado: parseFloat(pacoteRecebidoDoModal.valorVencido) || 0, qtdParcelas: 1 } // -> Configura o mapa Price inicial padrão.
      }); 
      setModalAberto(false); // -> Fecha reativamente a cortina flutuante na tela del CRM.
    } catch (err) { // -> Captura falhas se a internet cair.
      alert("Erro crítico de rede ao salvar cobrança!"); // -> Alerta o operador logado sobre a recusa del banco.
    } // -> Encerra o bloco de proteção de erros.
  }; // -> Encerra o controlador do faturamento do formulário.

  // 🛠️ RECALIBRAÇÃO INTEGRAL: Transforma o comando em Chave Gangorra (Arquivar / Desarquivar) com suporte ao Limbo do ClickUp
  const arquivarCobrancaNoLimbo = async (id, cliente) => { 
    // -> Busca na lista ram o status booleano atual do item clicado para descobrir a intenção do operador.
    const itemAlvo = cobrancas.find(c => c.id === id);
    const estaArquivadoAtualmente = itemAlvo?.arquivado === true;

    // -> Muta dinamicamente o texto do pop-up de confirmação baseado na realidade da tela.
    const mensagemConfirmacao = estaArquivadoAtualmente 
      ? `📤 DESARQUIVAMENTO DE CARD:\nDeseja resgatar a empresa "${cliente}" tirando-a do Limbo e mandando-a de volta para o fluxo de cobrança ativo?`
      : `📦 ARQUIVAMENTO DE CARD (ESTILO CLICKUP):\nDeseja ocultar a empresa "${cliente}" enviando-a para o Limbo de Arquivados?\n\nO registro sairá do visor mas seus logs históricos continuarão salvos.`;

    const confirmacao = confirm(mensagemConfirmacao); // -> Dispara o balão de segurança humana.
    if (confirmacao) { 
      const docRef = doc(db, "cobrancas", id); // -> Localiza o endereço físico fixo do card de devedor.
      await updateDoc(docRef, { arquivado: !estaArquivadoAtualmente }); // -> INVERSÃO OPERACIONAL DE FLUXO: Se for true vira false, se for false vira true, chaveando o nó síncronamente.
      
      // -> Ajuste fino de memória RAM: Se o prontuário estiver expandido, atualiza o foco para refletir a nova flag na mesma hora.
      if (cardSelecionadoProntuario && cardSelecionadoProntuario.id === id) {
        setCardSelecionadoProntuario(prev => ({ ...prev, arquivado: !estaArquivadoAtualmente }));
      }
    } 
  }; 

  const aoIniciarArrastoCard = (e, idCard, statusOrigem) => { // -> Disparado no instante em que você pinça o card com o clique do mouse.
    e.dataTransfer.setData("text/plain", idCard); // -> Amarra o ID della cobrança na memória invisível do ponteiro.
    e.dataTransfer.setData("origem-status", statusOrigem); // -> Amarra a raia cinza de onde o card está decolando.
  }; // -> Fecha o dragstart nativo.

  const aoSoltarCardNaRaia = async (e, statusDestino) => { // -> Disparado quando você solta o clique em cima de uma raia cinza.
    e.preventDefault(); // -> Bloqueia ações e recargas espúrias del navegador.
    const idCard = e.dataTransfer.getData("text/plain"); // -> Resgata o ID do cliente escondido no ponteiro do mouse.
    const statusOrigem = e.dataTransfer.getData("origem-status"); // -> Resgata de qual coluna ele voou.

    if (idCard && statusOrigem !== statusDestino) { // -> Valida se ele aterrissou in uma raia diferente da de largada.
      const docRef = doc(db, "cobrancas", idCard); // -> Cria a rota exata da pasta do cliente devedor.
      
      // -> SUPORTE DINÂMICO CLICKUP: Garimpa reativamente o nó correspondente na calha viva extraída do Firebase.
      const mapeamentoColuna = colunasFunil.find((c) => c.id === statusDestino); // -> Garimpa as categorias fixas pareadas na nuvem.
      const novaCategoriaMae = mapeamentoColuna ? mapeamentoColuna.categoria : "em_andamento"; // -> Descobre a categoria mãe estável do esqueleto.

      await updateDoc(docRef, { 
        status: statusDestino, // -> Altera a raia cinza do devedor direto no Google Firestore.
        categoria: novaCategoriaMae // -> Grava síncronamente a categoria imutável do sistema correspondente à ação.
      }); 
    } // -> Encerra a validação física.
  }; // -> Fecha o drop nativo.

  // -> MOTOR INÉDITO DE TRANSIÇÃO EM LINHA: Conecta a mudança de status direta da tabela ao Firestore da Google
  const mudarStatusCobrancaDireto = async (idCard, novoStatusDestino) => { // -> Acionado pelo select dropdown de dentro de qualquer linha da tabela.
    try {
      const docRef = doc(db, "cobrancas", idCard); // -> Localiza a rota física estável da pasta do devedor na nuvem.
      const mapeamentoColuna = colunasFunil.find((c) => c.id === novoStatusDestino); // -> SUPORTE DINÂMICO CLICKUP: Garimpa as categorias pareadas na nuvem viva.
      const novaCategoriaMae = mapeamentoColuna ? mapeamentoColuna.categoria : "em_andamento"; // -> Descobre a macro-categoria mãe imutável do sistema.

      await updateDoc(docRef, { 
        status: novoStatusDestino, // -> Grava a nova raia do funil direto no Firestore.
        categoria: novaCategoriaMae // -> Alinha o metadado inteligência do sistema para acionar as travas matemáticas.
      });
    } catch (err) { 
      alert("Falha crítica de barramento de rede ao mover status in linha!"); // -> Alerta em caso de queda de sinal de internet.
    }
  };

  // -> INVERSÃO DE LÓGICA DO CLIQUE: ACIONADOR DINÂMICA DO SUPER MODAL PRONTUÁRIO EXPANDIDO
  const lidarComCliqueFichaDEvedor = (card) => { // -> Disparado quando clica na área branca do card do cliente ou na linha da tabela.
    setCardSelecionadoProntuario(card); // -> Popula a memória de foco com o objeto completo do devedor.
    setModalProntuarioAberto(true); // -> Rompe o isolamento visual e levanta a janela espelhada na tela do cobrador.
  };

  // -> NOVO MOTOR ASSÍNCRONO DE REDE: CONSOLIDAÇÃO E CONEXÃO DO PRONTUÁRIO DIRETO COM O FIRESTORE
  const atualizarDadosProntuarioDoBanco = async (idCard, pacoteAtualizadoDoModal) => { // -> Acionado pelo botão de salvar ou pelos desfechos de sucesso/insucesso.
    try {
      const docRef = doc(db, "cobrancas", idCard); // -> Cria a rota de endereço fixo da pasta deste devedor na nuvem.
      await updateDoc(docRef, { // -> Executa o comando cirúrgico de atualização parcial dos campos de negociação.
        observacao: pacoteAtualizadoDoModal.observacao || "",
        subStatus: pacoteAtualizadoDoModal.subStatus || "", // -> Grava o veredito permanente (sucesso/insucesso) se houver.
        proposta: pacoteAtualizadoDoModal.proposta || {}, // -> Grava o rascunho de parcelas e valores da Price.
        historicoNotas: pacoteAtualizadoDoModal.historicoNotas || [], // -> Grava os carimbos cronológicos da linha do tempo.
        tarefas: pacoteAtualizadoDoModal.tarefas || [] // -> Grava a esteira de agendamentos pendentes.
      });
      setModalProntuarioAberto(false); // -> Fecha a cortina visual na tela reativamente.
      setCardSelecionadoProntuario(null); // -> Libera a fiação limpando o foco da RAM.
    } catch (err) { alert("Falha crítica de comunicação de rede ao gravar prontuário!"); }
  };

  // -> MANIPULADOR DO DISPARO DE ORDENAÇÃO DA TABELA DE COBRANÇA
  const lidarComMudarOrdenacaoCrm = (campo) => { // -> Gerencia a alternância de A-Z ou Z-A na esteira financeira.
    if (campoOrdenadoCrm === campo) { // -> Se o operador clicou no mesmo cabeçalho ativo.
      setDirecaoOrdenacaoCrm(direcaoOrdenacaoCrm === "asc" ? "desc" : "asc"); // -> Inverte a direção do fluxo alternando entre crescente e decrescente.
    } else { // -> Caso seja um clique inédito.
      setCampoOrdenadoCrm(campo); // -> Define a nova coluna de ordenação.
      setDirecaoOrdenacaoCrm("asc"); // -> Retorna ao sentido crescente nativo.
    }
  }; // -> Encerra o chaveamento de ordenação.

  // -> SUPER MOTOR DE FILTRAGEM SIMULTÂNEA COMPLETA E INVERSÃO DO LIMBO DE ARQUIVADOS
  const cobrancasFiltradas = cobrancas.filter((item) => { // -> Executa a varredura reativa baseada nas chaves de cabeçalho e regras matemáticas de corte.
    // -> LOGICA DE INVERSÃO EM RAM DO CLICKUP: Se o olho estiver desativado, oculta os arquivados. Se estiver ativado, exibe EXCLUSIVAMENTE o limbo.
    if (exibirArquivados) {
      if (item.arquivado !== true) return false; // -> No modo limbo, ignora as contas ativas comuns.
    } else {
      if (item.arquivado === true) return false; // -> No modo de trabalho comum, joga os itens com flag true nas sombras.
    }

    const bateCodigo = !filtrosAtivos.codigo || (item.codigo && String(item.codigo).toLowerCase().includes(filtrosAtivos.codigo.toLowerCase())); // -> Filtra de forma simétrica a coluna Código Conta.
    const bateCliente = !filtrosAtivos.cliente || (item.cliente && item.cliente.toLowerCase().includes(filtrosAtivos.cliente.toLowerCase())); // -> Filtra de forma simétrica a coluna Empresa / Razão Social.
    const bateResponsavel = !filtrosAtivos.responsavel || (item.responsavel && item.responsavel.toLowerCase().includes(filtrosAtivos.responsavel.toLowerCase())); // -> Filtra de forma simétrica a coluna Operador Responsável.
    const bateStatus = filtrosAtivos.status === "todos" || item.status === filtrosAtivos.status; // -> Filtra de forma simétrica a Fase do Funil.

    // -> BLOCO DE VALIDAÇÃO OPERACIONAL DA MATEMÁTICA DE VALORES COBRADOS
    let bateValor = true; // -> Inicializa a porteira financeira aberta por padrão.
    if (filtrosAtivos.valorLimite !== "") { // -> Se o advogado tiver digitado um valor numérico na caixa de corte de pipeline.
      const valorItem = parseFloat(item.valorVencido) || 0; // -> Limpa o saldo do documento ativo para comparação monetária.
      const limite = parseFloat(filtrosAtivos.valorLimite); // -> Puxa a régua numérica de corte.
      switch (filtrosAtivos.operadorValor) { // -> Chaveia o token lógico selecionado no FilterDrawer.
        case "<=": bateValor = valorItem <= limite; break; // -> Executa teste: Menor ou Igual.
        case "<": bateValor = valorItem < limite; break; // -> Executa teste: Menor Puro.
        case ">": bateValor = valorItem > limite; break; // -> Executa teste: Maior Puro.
        case ">=": bateValor = valorItem >= limite; break; // -> Executa teste: Maior ou Igual.
        default: bateValor = true; // -> Contingência neutra.
      }
    }
    return Array.isArray(cobrancas) ? (bateCodigo && bateCliente && bateResponsavel && bateStatus && bateValor) : false; // -> Carimba a exibição do devedor se ele passar ileso pelas 5 barreiras do cabeçalho simultaneamente.
  }); // -> Encerra o filtro de esteira.

  // -> SOMA DE CONTAGEM DE PÍLULA VERMELHA RECALIBRADA PARA AS 5 NOVAS VARIÁVEIS ATIVAS
  const totalFiltrosCombinados = (filtrosAtivos.codigo ? 1 : 0) + (filtrosAtivos.cliente ? 1 : 0) + (filtrosAtivos.responsavel ? 1 : 0) + (filtrosAtivos.status !== "todos" ? 1 : 0) + (filtrosAtivos.valorLimite !== "" ? 1 : 0); // -> Consolida os indicators para o badge.

  // -> MOTOR DE ORDENAÇÃO DINÂMICA DA TABELA DO CRM COM ANÁLISE COMPATÍVEL DE NÚMEROS E STRINGS
  const cobrancasOrdenadasCrm = [...cobrancasFiltradas].sort((a, b) => { // -> Duplica o array filtrado evitando mutações cegas e inicia a triagem.
    if (!campoOrdenadoCrm) return 0; // -> Trava antiqueda: se nenhum cabeçalho foi acionado, preserva a fila original.
    let valorA = a[campoOrdenadoCrm]; // -> Puxa o dado do nó A.
    let valorB = b[campoOrdenadoCrm]; // -> Puxa o dado do nó B.
    if (campoOrdenadoCrm === "valorVencido") { // -> Caso a coluna clicada seja de moeda corrente.
      valorA = parseFloat(valorA) || 0; // -> Força a conversão estrita em float numérico.
      valorB = parseFloat(valorB) || 0; // -> Força a conversão estrita em float numérico.
    } else { // -> Caso sejam colunas alfabéticas convencionais.
      valorA = String(valorA || "").toLowerCase(); // -> Converte em string higienizada de caixa baixa.
      valorB = String(valorB || "").toLowerCase(); // -> Converte em string higienizada de caixa baixa.
    }
    if (valorA < valorB) return direcaoOrdenacaoCrm === "asc" ? -1 : 1; // -> Despacha o item para cima na ordenação ascendente.
    if (valorA > valorB) return direcaoOrdenacaoCrm === "asc" ? 1 : -1; // -> Despacha o item para baixo na ordenação ascendente.
    return 0; // -> Mantém estável se empatado.
  }); // -> Encerra o motor de ordenação do CRM.

  if (!user) { // -> Abre a condition de portaria de segurança caso o crachá esteja em branco.
    return ( // -> Renderiza o HTML da tela dividida escura de login.
      <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding: 0 }}>
        <div style={{ background: "white", padding: "35px", borderRadius: "12px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", borderTop: "5px solid #0f172a", boxSizing: "border-box" }}>
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px 0" }}>
              {modoAuth === "login" ? "Acesso ao CRM" : "Criar Conta Nova"}
            </h2>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Insira suas credenciais para entrar na mesa de cobrança</p>
          </div>
          <form onSubmit={manipularAutenticacao} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "5px" }}>E-mail Corporativo</label>
              <input type="email" required placeholder="seuemail@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "5px" }}>Senha de Segurança</label>
              <input type="password" required placeholder="Digite sua senha" minLength="6" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px" }} />
            </div>
            <button type="submit" style={{ background: "#0f172a", color: "white", border: "none", padding: "12px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {modoAuth === "login" ? "Entrar no Sistema" : "Concluir Cadastro"}
            </button>
            <div style={{ textAlign: "center", marginTop: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setModoAuth(modoAuth === "login" ? "cadastro" : "login"); }} style={{ fontSize: "12px", color: "#0f172a", fontWeight: "600", textDecoration: "none" }}>
                {modoAuth === "login" ? "Não tem conta? Cadastre-se aqui" : "Já tem conta? Faça o login aqui"}
              </a>
            </div>
          </form>
        </div>
      </div>
    ); // -> Encerra o HTML de login.
  }

  return ( // -> Renderiza las barras e raias comerciais integradas em tempo real.
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f8fafc", boxSizing: "border-box" }}>
      
      <Header // -> INJEÇÃO DA PEÇA DE LEGO: Renderiza o cabeçalho mestre superior fixo.
        abaAtiva={abaAtiva} // -> Repassa qual aba principal está selecionada para pintar o botão de azul.
        aoMudarAba={setAbaAtiva} // -> Fornece a função gatilho para chavear as telas globais do CRM.
        aoLogof={efetuarLogoutTurno} // -> Conecta o botão do avatar redondo ao encerramento seguro do Node.
      />

      {abaAtiva === "crm" && ( // -> REGRA DE VISÃO: Só desenha os elements do CRM se a aba ativa for rigorosamente igual a crm.
        <>
          <Toolbar // -> INJEÇÃO DA PEÇA DE LEGO: Monta a barra de ferramentas interativa interna do CRM devedor.
            visaoAtual={visaoCrm} // -> Entrega se o layout ativo na memória ram é kanban ou tabela comercial.
            aoMudarVisao={setVisaoCrm} // -> Fornece o controle reativo para mudar as visões na hora del clique.
            aoAbrirModalCadastro={() => setModalAberto(true)} // -> Passa a função que levanta o pop-up de inclusões de canhotos.
            aoAbrirGavetaFiltros={() => setGavetaFiltrosAberta(true)} // -> Passa a função que acionará a abertura da gaveta lateral.
            totalFiltrosAtivos={totalFiltrosCombinados} // -> Passa reativamente o número da pílula vermelha de contagem de filtros ativos.
            exibirArquivados={exibirArquivados} // -> PASSO PLUGADO: Envia o estado booleano para colorir ou apagar o botão do olho.
            aoAlternarArquivados={setExibirArquivados} // -> PASSO PLUGADO: Passa o gatilho reativo que inverte as visões do limbo.
          />

          {visaoCrm === "kanban" && ( // -> FILTRO DE VISÃO INTERNO: Se o layout for kanban, monta as colunas verticais clássicas.
            <main style={{ maxWidth: "1400px", margin: "20px auto 0 auto", padding: "0 20px", display: "flex", gap: "20px", overflowX: "auto", alignItems: "flex-start", boxSizing: "border-box", minHeight: "70vh" }}>
              {colunasFunil.map((coluna) => { // -> Inicia la varredura e mapeamento das colunas extraídas assíncronamente da nuvem.
                const cardsDaColuna = cobrancasFiltradas.filter((c) => (c.status || "novo") === coluna.id); // -> Separa os devedores que pertencem a esta raia.
                const totalDinheiroRaia = cardsDaColuna.reduce((acc, c) => acc + (parseFloat(c.valorVencido) || 0), 0); // -> Soma o caixa bruto da coluna.

                if (filtrosAtivos.status !== "todos" && filtrosAtivos.status !== coluna.id) return null; // -> Oculta as outras colunas se o operador filtrou uma específica.

                return ( // -> Renderiza visualmente cada raia cinza receptora.
                  <div key={coluna.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => aoSoltarCardNaRaia(e, coluna.id)} style={{ backgroundColor: "#f1f5f9", padding: "16px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "12px", minWidth: "280px", maxWidth: "320px", flex: 1, boxSizing: "border-box", border: "1px solid #e2e8f0", height: "calc(100vh - 180px)" }}>
                    
                    {/* ENCABEÇAMENTO DA COLUNA DO CLICKUP */}
                    <h2 style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", fontWeight: "700", color: "#334155", margin: 0, textTransform: "uppercase", textAlign: "left" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <span>{coluna.nome}</span> 
                        <span style={{ fontSize: "10px", background: "#ffffff", color: "#475569", padding: "4px 10px", borderRadius: "20px", whiteSpace: "nowrap", fontWeight: "bold", border: "1px solid #cbd5e1" }}>
                          {cardsDaColuna.length} • R$ {totalDinheiroRaia.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} 
                        </span>
                      </div>
                      {/* 📁 CORE TEXT REMOVIDO EM DEFINITIVO CONFORME DIRETRIZ VISUAL */}
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1, height: "100%", overflowY: "auto" }}> 
                      {cardsDaColuna.map((card) => ( 
                        <CardCobranca 
                          key={card.id} 
                          card={card} 
                          colunaId={coluna.id} 
                          aoIniciarArrasto={aoIniciarArrastoCard} 
                          aoDeletar={arquivarCobrancaNoLimbo} // -> REDIRECIONAMENTO COMPLETO: Agora o clique do botão dispara a inversão síncrona (Arquivar/Desarquivar) baseada no contexto.
                          aoClicarCard={lidarComCliqueFichaDEvedor} 
                          exibirArquivados={exibirArquivados} // -> FIAÇÃO INJETADA: Passa a flag de controle global da Toolbar para o card decidir qual ícone mostrar.
                        />
                      ))}
                    </div>
                  </div>
                ); 
              })} 
            </main> 
          )}

          {visaoCrm === "tabela" && ( // -> FILTRO DE VISÃO INTERNO: Se o layout for tabela, aciona a planilha executiva modular com os dados ordenados.
            <TabelaCobranca 
              cobrancas={cobrancasOrdenadasCrm} // -> PASSO ADAPTADO: Repassa o lote ordenado reativamente pelo motor de cabeçalho.
              aoClicarLinha={lidarComCliqueFichaDEvedor} 
              aoDeletar={arquivarCobrancaNoLimbo} // -> REDIRECIONAMENTO COMPLETO: Transmite a função inteligente de inversão do limbo para a planilha.
              campoOrdenado={campoOrdenadoCrm} // -> Repassa the indicador della coluna ativa.
              direcaoOrdenacao={direcaoOrdenacaoCrm} // -> Repassa a direção da seta.
              aoMudarOrdenacao={lidarComMudarOrdenacaoCrm} // -> Conecta o clique do título à engine do pai.
              aoMudarStatusDireto={mudarStatusCobrancaDireto} // -> PASSO INÉDITO CONECTADO: Solda o cabo do seletor dropdown direto à planilha agrupada por etapas.
              exibirArquivados={exibirArquivados} // -> PASSO ADAPTADO: Sincroniza as ações de arquivo com a planilha comercial.
            />
          )}
        </>
      )}

      {abaAtiva === "dashboard" && ( // -> SINCRO MÓDULO INÉDITO: Injeta a central de inteligência analítica mandando o lote reativo completo vindo da nuvem.
        <ModuloDashboard 
          cobrancas={cobrancas} // -> Envia o array de devedores para o cálculo instantâneo dos Big Numbers e gráficos nativos.
          etapasFunilExternas={colunasFunil} // 🛠️ FIÇÃO CONECTADA: Passa as colunas dinâmicas para o motor estatístico processar o gráfico parametrizável sem engasgos.
        /> 
      )}

      {abaAtiva === "financeiro" && ( // -> REGRA DE VISÃO DE CONTROLADORIA: Se a aba selecionada for financeiro, monta o grande livro de tesouraria de parcelas Price.
        <ModuloFinanceiro 
          cobrancas={cobrancas} // -> Repassa o array de faturamento NoSQL higienizado direto para o pool de extração de RAM.
          aoMudarStatusDireto={mudarStatusCobrancaDireto} // -> Conecta o gatilho assíncrono de baixa instantânea e estorno ao Firestore.
        /> 
      )}

      {abaAtiva === "tarefas" && ( // -> CONEXÃO HISTÓRICA COMPLETA: Acopla o novo componente de esteira analítica substituindo a tag antiga em texto plano.
        <ModuloTarefas 
          cobrancas={cobrancas} // -> Envia o array bruto NoSQL vindo diretamente da escuta ativa onSnapshot do Firestore.
        /> 
      )}

      {abaAtiva === "cadastros" && ( // -> SINCRO RELACIONAL COMPLETA: Passa as duas bases lidas em tempo real do Firebase para alimentar o painel de controle.
        <ModuloCadastros 
          empresasAtivasExternas={empresasBase} // -> Envia o array de Pessoas Jurídicas (B2 IND E COM) do banco para exibição.
          contatosAtivosExternos={contatosBase} // -> Envia a lista de contatos do banco para exibição.
          aoAtualizarEmpresasExternas={(novasEmpresas) => setEmpresasBase(novasEmpresas)} // -> CORREÇÃO DE ESCOPO: Envelopa a atualização de estado em uma função anônima limpa para evitar conflitos de mutação em lote.
          segmentosExternos={segmentosBase} // -> PROPRIEDADE DINÂMICA: Sincroniza a coleção de segmentos do banco com a tela de metadados.
          vinculosExternos={vinculosBase} // -> PROPRIEDADE DINÂMICA: Sincroniza a coleção de vínculos do banco com a tela de metadados.
          etapasFunilExternas={colunasFunil} // -> Despacha as colunas vivas extraídas da nuvem para preencher os badges contadores do Hub.
        /> 
      )}

      <ModalCadastro 
        aberto={modalAberto} 
        aoFechar={() => setModalAberto(false)} 
        aoSalvar={cadastrarNovaDividaDoModal} 
        empresas={empresasBase} // -> CONEXÃO DO CABO RELACIONAL: Alimenta o select do modal com os clientes estáveis cadastrados.
        listaSegmentos={segmentosBase} // -> FIAÇÃO REATIVA INJETADA: Transmite os setores vivos do Firebase (Ex: "Saúde") para a interface interna.
      />

      {/* ➕ CONEXÃO DA GAVETA RECONFIGURADA PASSANDO O RECEPTOR DE FILTROS AVANÇADOS. */}
      <FilterDrawer 
        aberto={gavetaFiltrosAberta} 
        aoFechar={() => setGavetaFiltrosAberta(false)} 
        aoAplicarFiltros={(filtros) => {
          setFiltrosAtivos(filtros); // -> Injeta reativamente as 6 chaves combinadas no estado mestre para o refino instantâneo do visor.
          setGavetaFiltrosAberta(false); // -> Encerra o positioning visual recolhendo a gaveta lateral.
        }} 
      />

      {/* ⚡ INJEÇÃO DA PEÇA DE LEGO DO SUPER MODAL PRONTUÁRIO INDEPENDENTE. */}
      {/* 🛠️ CORREÇÃO CIRÚRGICA: Soldado o barramento 'exibirArquivados' e 'aoDeletar' para dar super-poderes de Arquivar/Desarquivar de dentro do prontuário */}
      <ModalProntuario 
        aberto={modalProntuarioAberto} // -> Informa se a interface tridimensional deve subir ou ficar invisível.
        aoFechar={() => { setModalProntuarioAberto(false); setCardSelecionadoProntuario(null); }} // -> Gatilho síncrono que fecha a cortina e limpa a RAM.
        card={cardSelecionadoProntuario} // -> Envia o objeto inteiro do devedor focado para a ala esquerda de visualização.
        colunaId={cardSelecionadoProntuario?.status || "novo"} // -> Envia a calha atual do funil para checar se há encerramento forçado de carteira.
        contatosBase={contatosBase} // -> CABO RELACIONAL HUMANO: Passa a lista completa de representantes para o cruzamento de IDs telefônicas.
        listaVinculos={vinculosBase} // -> FIAÇÃO REATIVA INJETADA: Transmite as categorias reais do banco (Ex: "Sócio") para o menu interno do prontuário.
        aoSalvarProntuário={atualizarDadosProntuarioDoBanco} // -> Conecta o botão de gravação direta ao motor assíncrono updateDoc do Firestore.
        exibirArquivados={exibirArquivados} // -> BARRAMENTO PLUGADO: Envia o modo ativo da Toolbar para o prontuário calibrar seu cabeçalho.
        aoAlternarArquivamentoNoModal={arquivarCobrancaNoLimbo} // -> BARRAMENTO PLUGADO: Passa a função mestre que inverte as flags de arquivo direto de dentro do prontuário.
      />
    </div>
  ); 
}