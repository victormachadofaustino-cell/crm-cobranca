import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para gerenciar os estados locais e telas na memória viva do navegador.
import { db } from "../../config/firebase"; // -> Importa a conexão configurada do banco de dados Firestore da nuvem do Google para comandos diretos.
import { collection, addDoc, doc, deleteDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore"; // -> Importa os comandos cirúrgicos NoSQL para criar, atualizar e decretar assinaturas cronológicas na nuvem de forma atômica.
import { Settings, FileSpreadsheet, Filter, ArrowLeft, Building2, User, Tag, Link2, Columns3, Plus, Trash2, MessageSquare } from "lucide-react"; // -> Importa os ícones visuais modernos, finos e sóbrios para ilustrar os botões da barra de ferramentas.
import TabelaEmpresas from "./TabelaEmpresas.jsx"; // -> Importa o componente filho especializado em desenhar a planilha de Pessoas Jurídicas (Empresas).
import TabelaContatos from "./TabelaContatos.jsx"; // -> Importa o componente filho especializado em desenhar a planilha de Pessoas Físicas (Contatos humanos).
import ModalNovaEmpresa from "./ModalNovaEmpresa.jsx"; // -> Importa o formulário flutuante blindado para cadastrar ou editar uma Empresa assistida.
import ModalNovoContato from "./ModalNovoContato.jsx"; // -> Importa o formulário flutuante blindado para cadastrar ou editar um Contato/Representante humano.
import GavetaFiltrosCadastro from "./GavetaFiltrosCadastro.jsx"; // -> Importa o painel lateral direito invisível que surge como uma cortina para buscas simultâneas.
import ModuloFunil from "./ModuloFunil.jsx"; // -> Importa o componente especialista na parametrização e ordenamento das raias Kanban do CRM.
import CadastrosHub from "./CadastrosHub.jsx"; // -> PEÇA 1 ACOPLADA: Importa o novo menu de cartões simétricos desmembrado para aliviar o peso da tela.
import GerenciadorSegmentos from "./GerenciadorSegmentos.jsx"; // -> PEÇA 2 ACOPLADA: Importa o gerenciador autônomo especialista em nichos de faturamento.
import GerenciadorVinculos from "./GerenciadorVinculos.jsx"; // -> PEÇA 3 ACOPLADA: Importa o gerenciador autônomo especialista em papéis contratuais civis.
import ModuloMensagens from "./ModuloMensagens.jsx"; // -> UNIÃO DE DUAS VIAS: Importa o componente reativo de réguas de mensagens para renderização embutida.

export default function ModuloCadastros({ empresasAtivasExternas = [], contatosAtivosExternos = [], aoAtualizarEmpresasExternas, segmentosExternos = [], vinculosExternos = [], etapasFunilExternas = [], itensSelecionadosExternos = {}, setItensSelecionadosExternos, aoExecutarExclusaoEmMassaExternas, aoExecutarEdicaoEmMassaExternas }) { // -> Declara a função principal do módulo de retaguarda recebendo o barramento de dados e funções do App.jsx.
  const empresas = empresasAtivasExternas; // -> Cria um atalho de leitura local para monitorar a lista viva de empresas em tempo real.
  const contatos = contatosAtivosExternos; // -> Cria um atalho de leitura local para monitorar a lista viva de contatos em tempo real.
  const segmentosBase = segmentosExternos; // -> Cria um atalho de leitura local para os ramos de mercado cadastrados.
  const vinculosBase = vinculosExternos; // -> Cria um atalho de leitura local para las categorias de papéis jurídicos cadastrados.
  const etapasFunilBase = etapasFunilExternas; // -> Cria um atalho de leitura local para mapear as raias ativas de Kanbans.

  // CONTROLADORES DE FLUXO VISUAL (ESTADOS DE LAYOUT): Gerenciam as telas dinâmicas e o surgimento dos novos modais sóbrios.
  const [visaoPainel, setVisaoPainel] = useState("hub"); // -> Estado maestro que define qual tela renderizar: "hub" (menu principal), "empresas", "contatos", "segmentos", "vinculos", "funil" ou "mensagens".
  const [modalEmpresaAberto, setModalEmpresaAberto] = useState(false); // -> Estado booleano que abre (true) ou oculta (false) o formulário flutuante de empresas.
  const [modalContatoAberto, setModalContatoAberto] = useState(false); // -> Estado booleano que abre (true) ou oculta (false) o formulário flutuante de contatos.
  const [gavetaFiltrosAberta, setGavetaFiltrosAberta] = useState(false); // -> Estado booleano que comanda o surgimento da cortina lateral de filtros avançados.

  // REGISTROS EM EDIÇÃO: Estados auxiliares técnicos para identificar se a operation atual é de alteração ou de inclusão nova.
  const [empresaEmEdicaoId, setEmpresaEmEdicaoId] = useState(null); // -> Armazena a ID da empresa em edição; caso seja nulo, o system sabe que é uma inserção inédita.
  const [contatoEmEdicaoId, setContatoEmEdicaoId] = useState(null); // -> Armazena a ID do contato em edição; caso seja nulo, o system sabe que é uma inserção inédita.

  // MEMÓRIA DE BUSCA COMBINADA RECALIBRADA: Expandida com todos os campos de cabeçalho para permitir buscas simultâneas estritas.
  const [filtrosEmpresa, setFiltrosEmpresa] = useState({ codigo: "", cliente: "", cnpj: "", tipo: "todos", segmento: "", endereco: "" }); // -> Objeto contendo os 6 filtros cruzados da planilha de PJs.
  const [filtrosContato, setFiltrosContato] = useState({ nome: "", cpf: "", telephone: "", email: "", tipoVinculo: "todos" }); // -> Objeto contendo os 5 filtros cruzados da planilha de PFs.

  // ESTADOS DE ORDENAÇÃO DINÂMICA: Memorizam qual coluna do cabeçalho está governando a fila e em qual direção.
  const [campoOrdenado, setCampoOrdenado] = useState(""); // -> Guarda a propriedade da coluna clicada para ordenar a grade (Ex: 'cliente', 'codigo').
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState("asc"); // -> Guarda o sentido de triagem da ordenação: 'asc' (A-Z) ou 'desc' (Z-A).

  // GAVETAS DE MONITORAMENTO DO FORMULÁRIO DE EMPRESAS (PESSOAS JURÍDICAS)
  const [empCodigo, setEmpCodigo] = useState(""); // -> Vincula o campo de texto do Código da conta ERP no modal.
  const [empNome, setEmpNome] = useState(""); // -> Vincula o campo de texto da Razão Social corporativa no modal.
  const [empCnpj, setEmpCnpj] = useState(""); // -> Vincula o campo de texto do documento de CNPJ de 14 dígitos no modal.
  const [empIsFilial, setEmpIsFilial] = useState(false); // -> Vincula a caixinha de marcação (checkbox) indicando se a empresa é uma Filial comercial.
  const [empSegmento, setEmpSegmento] = useState(""); // -> Vincula o menu suspenso de ramos de mercado selecionado para a empresa.
  const [empEndereco, setEmpEndereco] = useState(""); // -> Vincula o campo de texto do endereço físico municipal da empresa.
  const [empCep, setEmpCep] = useState(""); // -> Vincula o campo de texto do CEP de faturamento postal.

  // GAVETAS DE MONITORAMENTO DO FORMULÁRIO DE CONTATOS (PESSOAS HUMANAS)
  const [conNome, setConNome] = useState(""); // -> Vincula a caixa de digitação do Nome Completo do representative humano.
  const [conCpf, setConCpf] = useState(""); // -> Vincula a caixa de digitação do documento de CPF obrigatório.
  const [conTelefone, setConTelefone] = useState(""); // -> Vincula a caixa de digitação do telephone celular com DDD brasileiro.
  const [conEmail, setConEmail] = useState(""); // -> Vincula a caixa de digitação do e-mail eletrônico de cobrança.
  const [conTipo, setConTipo] = useState("responsavel"); // -> Vincula o dropdown de papel de vínculo civil do contato (padrão: 'responsavel').
  const [conEmpresaId, setConEmpresaId] = useState(""); // -> Vincula o menu relacional associando a qual devedor PJ este contato pertence profissionalmente.

  // -> NOVAS ESTADOS LOCAIS PARA A EDIÇÃO COLETIVA DE DUAS ETAPAS EM CADASTROS CADASTRADOS NA RAM EM TEMPO REAL:
  const [campoSelecionadoLote, setCampoSelecionadoLote] = useState(""); // -> Armazena qual coluna o operador escolheu para mutação em massa (Etapa 1).
  const [valorEdicaoMassa, setValorEdicaoMassa] = useState(""); // -> Armazena a string de texto ou ID que será gravada em bloco em todas as linhas marcadas (Etapa 2).

  // -> CONTAGEM EM MASSA LOCAL: Analisa de forma reativa quantas linhas o operador flegou nas tabelas de cadastros secundários.
  const contagemSelecionados = Object.keys(itensSelecionadosExternos).filter((id) => itensSelecionadosExternos[id] === true).length; // -> Calcula de forma reativa a volumetria de caixas marcadas com visto verdadeiro no Kanban.

  // MANIPULADOR DE GATILHO PARA ACIONAR A ORDENAÇÃO DINÂMICA
  const lidarComMudarOrdenacao = (campo) => { // -> Gerencia a ordenação alfabética ao clicar nas strings de cabeçalho das planilhas.
    if (campoOrdenado === campo) { // -> Se o usuário clicou na mesma coluna que já estava comandando a ordenação da grade:
      setDirecaoOrdenacao(direcaoOrdenacao === "asc" ? "desc" : "asc"); // -> Inverte o sentido: se era crescente (A-Z) vira decrescente (Z-A).
    } else { // -> Caso seja um coluna nova selecionada:
      setCampoOrdenado(campo); // -> Aloca essa nova coluna como a governante de fluxo.
      setDirecaoOrdenacao("asc"); // -> Inicializa o sentido no modo crescente padrão de fábrica.
    } // -> Fim da inversão.
  }; // -> Encerra o alternador de ordenação.

  // AUXILIAR MATEMÁTICO DE ORDENAÇÃO EM RAM
  const poolOrdenacaoArray = (arrayParaOrdenar, campo, direcao) => { // -> Executa a triagem e organização das linhas na memória RAM antes de desenhar na tela.
    if (!campo) return arrayParaOrdenar; // -> Se nenhuma ordenação de cabeçalho estiver activa, devolve a lista bruta sem mexer em nada.
    return [...arrayParaOrdenar].sort((a, b) => { // -> Duplica o array de registros e inicia o método sort comparativo.
      const valorA = String(a[campo] || "").toLowerCase(); // -> Puxa a string da propriedade do item A forçada em letras minúsculas.
      const valorB = String(b[campo] || "").toLowerCase(); // -> Puxa a string da propriedade do item B forçada em letras minúsculas.
      if (valorA < valorB) return direcao === "asc" ? -1 : 1; // -> Joga o item A para cima se for crescente ou para baixo se decrescente.
      if (valorA > valorB) return direcao === "asc" ? 1 : -1; // -> Joga o item A para baixo se for crescente ou para cima se decrescente.
      return 0; // -> Mantém na mesma linha caso os textos confrontados sejam perfeitamente idênticos.
    }); // -> Encerra o laço sort.
  }; // -> Encerra o assistente matemático de ordenação.

  // MECÂNICA DE EXPORTAÇÃO EXCEL EM .XLSX (CSV COMPATÍVEL DE ALTA PERFORMANCE)
  const exportarParaExcel = () => { // -> Transforma os dados visíveis em arquivo de planilha física para auditoria externa.
    let dadosParaExportar = []; // -> Declara o vetor vazio local que receberá os registros limpos.
    let cabecalhoColunas = ""; // -> Buffer que guardará os títulos das colunas delimitados por ponto e vírgula.
    let nomeArquivo = ""; // -> Buffer para selar o nome final do download do arquivo.

    if (visaoPainel === "empresas") { // -> Caso o operador esteja visualizando a planilha de Pessoas Jurídicas:
      dadosParaExportar = empresasFiltradas; // -> Aloca as empresas filtradas ativas da tela na esteira de downloads.
      cabecalhoColunas = "CONTA;RAZAO_SOCIAL;CNPJ;TIPO;SEGMENTO;ENDERECO_PRACA\n"; // -> Desenha a linha superior de títulos corporativos separados por ponto e vírgula.
      nomeArquivo = "base_assistidos_empresas.csv"; // -> Sela o nome do arquivo de empresas.
    } else if (visaoPainel === "contatos") { // -> Caso o operador esteja visualizando a planilha de Pessoas Físicas:
      dadosParaExportar = contatosFiltrados; // -> Aloca os representantes humanos filtrados ativas da tela.
      cabecalhoColunas = "NOME_REPRESENTANTE;CPF_JURIDICO;TELEFONE_CONTATO;EMAIL;PAPEL_VINCULO;EMPRESA_PAI\n"; // -> Desenha a linha superior de títulos humanos separados por ponto e vírgula.
      nomeArquivo = "representantes_financeiros.csv"; // -> Sela o nome do arquivo de contatos.
    } else { return; } // -> Se não estiver in nenhuma dessas telas, sabota e aborta a exportação por segurança.

    let corpoPlanilha = cabecalhoColunas; // -> Inicializa la montagem colando os cabeçalhos de colunas na primeira linha.
    dadosParaExportar.forEach((item) => { // -> Executa uma varredura limpando caracteres de quebra antes de concatenar.
      if (visaoPainel === "empresas") { // -> Se for montagem de dados de empresas.
        const codigo = String(item.codigo || "").replace(/;/g, " "); // -> Higieniza: substitui ponto e vírgulas textuais por espaço simples para não quebrar as colunas do Excel.
        const cliente = String(item.cliente || "").replace(/;/g, " "); // -> Limpa caracteres perigosos da Razão Social.
        const cnpj = String(item.cnpj || item.id || "").replace(/;/g, " "); // -> Resgata de duas vias o CNPJ higienizado de 14 dígitos puros.
        const tipo = String(item.tipo || "Matriz").replace(/;/g, " "); // -> Limpa caracteres do tipo (Matriz/Filial).
        const segmento = String(item.segmento || "Não Informado").replace(/;/g, " "); // -> Limpa caracteres do ramo de mercado.
        const endereco = String(item.endereco || "Não Informado").replace(/;/g, " "); // -> Limpa caracteres do endereço geográfico.
        corpoPlanilha += `${codigo};${cliente};${cnpj};${tipo};${segmento};${endereco}\n`; // -> Empilha a linha preenchida do devedor separada por ponto e vírgulas e pula a linha (`\n`).
      } else { // -> Se for montagem de dados de contatos humanos.
        const empresaPai = empresas.find((e) => e.id === item.empresaId); // -> Puxa da memória a ficha da empresa associada a este contato.
        const nomeEmpresa = empresaPai ? empresaPai.cliente : "Não Encontrada"; // -> Descobre o nome da empresa credora ou emite texto padrão de erro.
        const nome = String(item.nome || "").replace(/;/g, " "); // -> Limpa caracteres do nome do representante.
        const cpf = String(item.cpf || "").replace(/;/g, " "); // -> Limpa caracteres do CPF.
        const telephone = String(item.telephone || item.telefone || "").replace(/;/g, " "); // -> Limpa caracteres do celular.
        const email = String(item.email || "").replace(/;/g, " "); // -> Limpa caracteres do e-mail com @.
        const tipoVinculo = String(item.tipoVinculo || "").replace(/;/g, " "); // -> Limpa caracteres do papel de vínculo.
        const empresaLimpa = String(nomeEmpresa).replace(/;/g, " "); // -> Limpa caracteres do nome da empresa associada.
        corpoPlanilha += `${nome};${cpf};${telephone};${email};${tipoVinculo};${empresaLimpa}\n`; // -> Empilha a linha humana formatada e pula a linha.
      } // -> Fim da bifurcação.
    }); // -> Encerra a varredura das colunas.

    const blobDeDados = new Blob(["\uFEFF" + corpoPlanilha], { type: "text/csv;charset=utf-8;" }); // -> Converte toda a massa de texto em um bloco de dados binários brutos (Blob), injetando o código universal BOM (`\uFEFF`) para forçar o Excel a ler acentos e ç sem bugar caracteres.
    const linkInvisivel = document.createElement("a"); // -> Fabrica uma tag oculta de link fictício na memória do navegador.
    linkInvisivel.href = URL.createObjectURL(blobDeDados); // -> Transforma o bloco binário de dados da planilha no endereço de internet do link.
    linkInvisivel.setAttribute("download", nomeArquivo); // -> Configura o atributo de download fixando o nome regulamentar do arquivo CSV.
    document.body.appendChild(linkInvisivel); // -> Pendura o link invisível na árvore visível da página web por um milissegundo.
    linkInvisivel.click(); // -> Dispara um estalo de clique automático via código para abrir o gerenciador de downloads do computador.
    document.body.removeChild(linkInvisivel); // -> Desconecta e expurga o link invisível da memória RAM liberando espaço de processamento.
  }; // -> Encerra o exportador Excel.

  // ACIONADORES DE FORMULÁRIO POPULADO (GATILHOS DE EDIÇÃO)
  const prepararEdicaoEmpresa = (empresa) => { // -> Ativado ao clicar em uma linha de empresa: preenche o modal com as informações salvas do banco NoSQL para alteração.
    setEmpresaEmEdicaoId(empresa.id); // -> Armazena a ID da empresa mestre para travar o motor no modo de atualização parcial (`updateDoc`).
    setEmpCodigo(empresa.codigo || ""); // -> FLAG DE SEGURANÇA UX: Pré-preenche reativamente a caixinha do Código com o valor atual salvo.
    setEmpNome(empresa.cliente || empresa.razaoSocial || ""); // -> FLAG DE SEGURANÇA UX: Pré-preenche a Razão Social resgatando de duas vias para anular caixas zeradas.
    setEmpCnpj(empresa.cnpj || empresa.id || ""); // -> FLAG DE SEGURANÇA UX: Pré-preenche o CNPJ intacto de 14 dígitos numéricos extraído do nó mestre.
    setEmpIsFilial(empresa.tipo === "Filial"); // -> Ativa o visto do checkbox caso a empresa esteja gravada na nuvem como "Filial".
    setEmpSegmento(empresa.segmento || ""); // -> Tranca o dropdown de ramos de mercado na opção exata que a empresa pertence.
    setEmpEndereco(empresa.endereco || ""); // -> Aloca o texto do endereço completo municipal no input.
    setEmpCep(empresa.cep || ""); // -> Aloca a numeração de CEP correspondente no input.
    setModalEmpresaAberto(true); // -> Abre e projeta o formulário flutuante na tela com todos os dados preenchidos de fábrica.
  }; // -> Encerra o preparador de edição de PJ.

  const prepararEdicaoContato = (contato) => { // -> Ativado ao clicar em uma linha humana: preenche o modal com as informações reais para alteração.
    setContatoEmEdicaoId(contato.id); // -> Armazena a ID do representante humano para travar o motor no modo de atualização.
    setConNome(contato.nome || ""); // -> FLAG DE SEGURANÇA UX: Pré-preenche o Nome Completo do indivíduo na caixa de texto.
    setConCpf(contato.cpf || ""); // -> FLAG DE SEGURANÇA UX: Pré-preenche o documento de CPF correspondente no input.
    setConTelefone(contato.telefone || contato.telephone || ""); // -> FLAG DE SEGURANÇA UX: Pré-preenche o número telefônico celular no input.
    setConEmail(contato.email || ""); // -> FLAG DE SEGURANÇA UX: Pré-preenche a caixa de e-mail com arroba.
    setConTipo(contato.tipoVinculo || "responsavel"); // -> Tranca o dropdown de papel jurídico na opção contrata do banco.
    setConEmpresaId(contato.empresaId || ""); // -> Conecta o dropdown relacional marcando a Empresa-Pai legítima a qual o contato responde.
    setModalContatoAberto(true); // -> Abre e projeta o formulário flutuante humano na tela com todos os dados preenchidos de fábrica.
  }; // -> Encerra o preparador de edição humano.

  // -> DISPARADOR DO COMANDO COLETIVO ADMINISTRATIVE DE ALTERAÇÃO EM LOTE
  const lidarComAplicarEdicaoLoteCadastros = () => { // -> Varre quais cadastros receberam o flag de caixinha marcando e altera a coluna em bloco no Firebase.
    if (!campoSelecionadoLote) { // -> Barreira de segurança: impede o avanço se a Etapa 1 estiver em branco.
      alert("⚠️ COCKPIT DE CADASTROS:\nPor favor, escolha qual campo deseja alterar em massa."); // -> Alerta o erro.
      return; // -> Aborta.
    } // -> Fim.
    if (!valorEdicaoMassa.trim()) { // -> Barreira de segurança: impede a gravação se a caixa de texto da Etapa 2 vier nula.
      alert("⚠️ COCKPIT DE CADASTROS:\nDigite ou selecione o novo dado que será gravado em todas as linhas."); // -> Alerta o erro.
      return; // -> Aborta.
    } // -> Fim.
    if (aoExecutarEdicaoEmMassaExternas) { // -> Se o barramento de lote assíncrono vindo do App.js estiver plugado:
      aoExecutarEdicaoEmMassaExternas(campoSelecionadoLote, valorEdicaoMassa.trim()); // -> Dispara o foguete de atualização em massa enviando a coluna alvo e o novo valor bruto.
      setCampoSelecionadoLote(""); // -> Limpa a memória do seletor da Etapa 1.
      setValorEdicaoMassa(""); // -> Limpa a memória da caixa de entrada da Etapa 2.
    } // -> Fim da transmissão.
  }; // -> Encerra o aplicador de lote de cadastros.

  // -> MONITOR DE ALTERAÇÃO DE SELETOR DE CADASTRO COLETIVO
  const lidarComMudarCampoMassaCadastros = (novoCampo) => { // -> Reseta reativamente as gavetas de inputs quando o usuário altera a coluna alvo na Etapa 1.
    setCampoSelecionadoLote(novoCampo); // -> Grava o novo campo de destino.
    setValorEdicaoMassa(""); // -> Limpa o valor antigo digitado para não misturar dados de tabelas paralelas.
  }; // -> Encerra o monitor de lote.

  // RE-HOMOLOGAÇÃO DA FUNÇÃO TRATAR CADASTRO EMPRESA CONECTADA DIRETAMENTE AO CLOUD FIRESTORE
  const tratarCadastroEmpresa = async (e) => { // -> Salva ou atualiza uma empresa assistida no Firebase NoSQL de forma imediata.
    e.preventDefault(); // -> Bloqueia o navegador de recarregar e quebrar as variáveis da máquina.
    if (!empCodigo.trim() || !empNome.trim() || !empCnpj.trim()) { // -> Barreira mandatória: exige o preenchimento de Código, Razão Social e CNPJ.
      alert("⚠️ CAMPOS OBRIGATÓRIOS:\n\nPor favor, preencha o Código da Conta, a Razão Social e o CNPJ do assistido."); // -> Notifica o operador.
      return; // -> Aborta a injeção.
    } // -> Fim.

    const cnpjChaveHigienizada = String(empCnpj).replace(/[^0-9]/g, '').trim(); // -> ANTI-MÁSCARA: Expurga pontos, barras e traços coletando estritamente os 14 dígitos numéricos puros.

    const pacoteEmpresaNoSQL = { // -> Embala o payload NoSQL normalizado e higienizado livre de espaços vazios nas pontas.
      codigo: empCodigo.trim(), // -> Código de index ERP da conta de faturamento.
      cliente: empNome.trim().toUpperCase(), // -> Converte a Razão Social para letras maiúsculas oficiais de compliance e auditoria.
      cnpj: cnpjChaveHigienizada, // -> CNPJ limpo de 14 dígitos reais.
      tipo: empIsFilial ? "Filial" : "Matriz", // -> Determina a classificação societária baseado no flag booleano do checkbox.
      segmento: empSegmento || "Não Definido", // -> Ramo de mercado escolhido no dropdown de retaguarda.
      endereco: empEndereco.trim() || "Não informado", // -> Endereço urbano de praça.
      cep: empCep.trim() || "00000-000" // -> Numeração postal de faturamento.
    }; // -> Fim.

    try { // -> Abre escudo de proteção contra quedas de internet de operadoras.
      if (empresaEmEdicaoId) { // -> REGIME DE ATUALIZAÇÃO PARCIAL: Se a ID de edição estiver ativa no painel:
        const docRef = doc(db, "cadastros_empresas", empresaEmEdicaoId); // -> Captura a referência física fixa do documento desse devedor na nuvem.
        await updateDoc(docRef, { ...pacoteEmpresaNoSQL }); // -> Executa o método update paralisando mutações destrutivas e salvando os novos dados estruturais.
        alert("🏢 RE-HOMOLOGADO!\nOs dados estruturais do assistido foram salvos na nuvem."); // -> Avisa sucesso.
      } else { // -> REGIME DE INJEÇÃO INÉDITA COM CHAVE FIXA: Caso o ID seja nulo, cria o nó usando o CNPJ como nome do nó.
        const docRefCustom = doc(db, "cadastros_empresas", cnpjChaveHigienizada); // -> Sela o nome do nó NoSQL como o CNPJ puro de 14 dígitos, casando perfeitamente com a engrenagem do Importador.
        await setDoc(docRefCustom, { ...pacoteEmpresaNoSQL, criadoEm: serverTimestamp() }); // -> Dispara o setDoc persistindo a ficha corporativa na nuvem com a assinatura cronológica estável do Google.
        alert(`🏢 ASSISTIDO HOMOLOGADO!\n"${empNome.trim().toUpperCase()}" foi adicionado com sucesso.`); // -> Avisa sucesso em letras maiúsculas.
      } // -> Fim da bifurcação.
      setModalEmpresaAberto(false); // -> Fecha automaticamente o formulário flutuante della tela.
      setEmpresaEmEdicaoId(null); // -> Reseta e limpa a memória do ID de foco de edição.
      setEmpCodigo(""); setEmpNome(""); setEmpCnpj(""); setEmpIsFilial(false); setEmpSegmento(""); setEmpEndereco(""); setEmpCep(""); // -> Reseta as 7 caixas de entrada do modal para o próximo uso em folha limpa.
    } catch (err) {
      alert("Falha crítica de barramento ao persistir empresa no Firebase!"); // -> Protege o sistema contra panes de rede.
    } // -> Fim.
  }; // -> Encerra o cadastrador de empresas.

  // RE-SOLDA COMPLETA DO GRAVADOR ASSÍNCRONO DE CONTATOS DO FIRESTORE
  const tratarCadastroContato = async (e) => { // -> Salva ou atualiza um representante humano na base de dados NoSQL de forma síncrona.
    e.preventDefault(); // -> Bloqueia o recarregamento de página do navegador.
    if (!conNome.trim() || !conCpf.trim() || !conTelefone.trim() || !conEmpresaId) { // -> Barreira mandatória: exige Nome, CPF, Celular com DDD e ID da empresa controladora.
      alert("⚠️ CAMPOS OBRIGATÓRIOS:\n\nÉ obrigatório preencher o Nome Completo, CPF, Telefone e selecionar uma Empresa-PAI."); // -> Alerta o erro.
      return; // -> Aborta o salvamento.
    } // -> Fim.
    if (conEmail && !conEmail.includes("@")) { // -> SANEAMENTO CADASTRAL: Valida se a string de e-mail digitada manualmente possui o caractere de arroba mandatório.
      alert("⚠️ VALIDAÇÃO DE CADASTRO:\n\nO e-mail digitado é inválido. Insira um domínio válido com '@'."); // -> Alerta o erro.
      return; // -> Aborta.
    } // -> Fim.
    if (conTelefone.replace(/\D/g, "").length < 10) { // -> SANEAMENTO CADASTRAL: Limpa os caracteres de máscara e checa se há menos de 10 dígitos numéricos totais no celular.
      alert("⚠️ CONFIGURAÇÃO FISCAL:\n\nO telefone precisa conter entre 10 e 11 dígitos numéricos válidos com o DDD."); // -> Alerta o erro.
      return; // -> Aborta.
    } // -> Fim.

    const pacoteContatoNoSQL = { // -> 🛠️ CORREÇÃO CIRÚRGICA: Soldado o nome da variável sem espaços, removendo o caractere que causava o Erro 500 no Vite.
      nome: conNome.trim(), // -> Nome completo do contato humano de faturamento.
      cpf: conCpf.trim(), // -> Documento de CPF.
      telefone: conTelefone.trim(), // -> Número telefônico celular com DDD.
      email: conEmail.trim() || "Não informado", // -> Endereço eletrônico ou carimba valor padrão informativo estável.
      tipoVinculo: conTipo, // -> Categoria de papel societário selecionada no dropdown.
      empresaId: conEmpresaId // -> Código de amarração relacional guardando a ID do devedor PJ dono do contato.
    }; // -> Fim da embalagem.

    try { // -> Inicia bloco de proteção contra oscilações de Wi-Fi de operadoras.
      if (contatoEmEdicaoId) { // -> 🛠️ CORREÇÃO CIRÚRGICA: expurgada a variável órfã, chamando estritamente o estado reativo correto do topo do componente.
        const docRef = doc(db, "cadastros_contatos", contatoEmEdicaoId); // -> Captura a referência física desse documento na coleção.
        await updateDoc(docRef, { ...pacoteContatoNoSQL }); // -> Despacha a alteração parcial atualizando os dados cadastrais no Firestore.
        alert("👤 RE-HOMOLOGADO!\nOs dados do representante foram updated na nuvem."); // -> Notifica o operador.
      } else { // -> Caso seja uma inclusão de pessoa inédita na carteira:
        const colecaoRef = collection(db, "cadastros_contatos"); // -> Abre cabo de rede com a coleção geral "cadastros_contatos".
        await addDoc(colecaoRef, pacoteContatoNoSQL); // -> Executa o addDoc empilhando o registro e deixando o Firebase gerar a ID alfanumérica automática.
        alert(`👤 CONTATO HOMOLOGADO!\n"${conNome.trim()}" foi associado com sucesso.`); // -> Notifica sucesso exibindo o nome inserido.
      } // -> Fim da bifurcação.
      setModalContatoAberto(false); // -> Oculta e fecha o modal flutuante automaticamente.
      setContatoEmEdicaoId(null); // -> Limpa a ID de edição da memória RAM de rascunhos.
      setConNome(""); setConCpf(""); setConTelefone(""); setConEmail(""); setConTipo("responsavel"); setConEmpresaId(""); // -> Reseta completamente os 6 campos de texto do modal para o próximo uso em folha limpa.
    } catch (err) {
      alert("Falha crítica de barramento ao persistir contato no Firebase!"); // -> Alerta o operador protegendo a estabilidade.
    } // -> Fim do bloco catch.
  }; // -> Encerra o cadastrador de contatos.

  // BARREIRAS DE FILTRAGEM EXPANDIDAS E INTEGRADAS: Varrem e casam de forma híbrida as IDs e campos NoSQL das empresas importadas.
  const empresasFiltradas = empresas.filter((emp) => { // -> Filtra a lista bruta de empresas em tempo real cruzando os 6 critérios de busca ao mesmo tempo.
    const bateCodigo = !filtrosEmpresa.codigo || (emp.codigo && emp.codigo.toLowerCase().includes(filtrosEmpresa.codigo.toLowerCase())); // -> SELETOR COGNITIVO CORRIGIDO: Se a caixa superior de busca por código estiver totalmente vazia, concede passe livre. Caso contrário, confronta os caracteres, banindo o sumiço cego de PJs importadas sem código.
    const bateCliente = emp.cliente ? emp.cliente.toLowerCase().includes(filtrosEmpresa.cliente.toLowerCase()) : (emp.razaoSocial ? emp.razaoSocial.toLowerCase().includes(filtrosEmpresa.cliente.toLowerCase()) : false); // -> Cruzamento de duas vias de codificação: Varre reativamente pela chave 'cliente' ou pelo espelho de retaguarda 'razaoSocial' gerado pelo importador.
    
    // 🔥 CORREÇÃO REATIVA DE DUAS VIAS (ANTI-MÁSCARA): Expulsa pontuações do input digitado no filtro de busca para confrontar o CNPJ numérico puro de 14 dígitos guardado no id do documento.
    const termoCnpjFiltroLimpo = filtrosEmpresa.cnpj.replace(/\D/g, ''); // -> Limpa as strings digitadas no filtro tirando pontos e traços.
    const stringCnpjBancoAlvo = String(emp.cnpj || emp.id || "").replace(/\D/g, ''); // -> Resgata de forma elástica a propriedade cnpj ou a ID de identificação mestre NoSQL.
    const bateCnpj = stringCnpjBancoAlvo.includes(termoCnpjFiltroLimpo); // -> Cruza e confronta as duas cadeias numéricas puras na prancha, fazendo os registros importados aparecerem na tela.

    const bateTipo = filtrosEmpresa.tipo === "todos" || emp.tipo === filtrosEmpresa.tipo; // -> Confere se o tipo selecionado corresponde ou libera todas se for igual a "todos".
    const bateSegmento = !filtrosEmpresa.segmento || (emp.segmento && emp.segmento.toLowerCase().includes(filtrosEmpresa.segmento.toLowerCase())); // -> Confere reativamente se o segmento da empresa atende ao critério de filtro.
    const bateEndereco = !filtrosEmpresa.endereco || (emp.endereco && emp.endereco.toLowerCase().includes(filtrosEmpresa.endereco.toLowerCase())) || (emp.cep && emp.cep.includes(filtrosEmpresa.endereco)); // -> Confere se a busca se aplica ao endereço completo ou se casa com os números do CEP.
    return bateCodigo && bateCliente && bateCnpj && bateTipo && bateSegmento && bateEndereco; // -> Retorna verdadeiro se o registro passar com sucesso por todas as 6 barreiras de checagem.
  }); // -> Encerra a varredura filter de empresas.

  const contatosFiltrados = contatos.filter((con) => { // -> Filtra a lista de contatos em tempo real cruzando os 5 critérios de busca ao mesmo tempo.
    const bateNome = con.nome ? con.nome.toLowerCase().includes(filtrosContato.nome.toLowerCase()) : false; // -> Confere se o nome pesquisado coincide parcial ou totalmente com o nome do representante.
    const bateCpf = con.cpf ? con.cpf.toLowerCase().includes(filtrosContato.cpf.toLowerCase()) : false; // -> Confere se a numeração de CPF digitada bate com a linha da tabela.
    const bateTipo = filtrosContato.tipoVinculo === "todos" || con.tipoVinculo === filtrosContato.tipoVinculo; // -> Isola a categoria do papel de vínculo ou exibe todos na tela.
    const bateTelefone = !filtrosContato.telefone || (con.telefone && con.telefone.includes(filtrosContato.telefone)); // -> Filtra a tabela conferindo os algarismos do número telefônico digitados.
    const bateEmail = !filtrosContato.email || (con.email && con.email.toLowerCase().includes(filtrosContato.email.toLowerCase())); // -> Filtra a tabela batendo o texto pesquisado com o endereço eletrônico do contato.
    return bateNome && bateCpf && bateTipo && bateTelefone && bateEmail; // -> Retorna verdadeiro permitindo a exibição em tela se passar nos 5 testes casados.
  }); // -> Encerra a varredura filter humana.

  // APLICAÇÃO DA ORDENAÇÃO DINÂMICA ANTES DA RENDERIZAÇÃO FINAL
  const empresasOrdenadasVisor = poolOrdenacaoArray(empresasFiltradas, campoOrdenado, direcaoOrdenacao); // -> Entrega o lote de empresas filtradas organizadas na ordem alfabética ou numérica configurada.
  const contatosOrdenadosVisor = poolOrdenacaoArray(contatosFiltrados, campoOrdenado, direcaoOrdenacao); // -> Entrega o lote de contatos filtrados organizados na ordem alfabética ou numérica configurada.

  // 🔥 COCKPIT DE CÁLCULO DINÂMICO DE RODAPÉ
  const faturamentoTotalEsteira = empresasOrdenadasVisor.length; // -> Carrega reativamente o contador do rodapé para o volume bruto de PJs listadas.

  return ( // -> Inicia a renderização do bloco visual de interface construído em linguagem HTML com estilos inline seguros.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "24px auto", padding: "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}> {/* -> Container mestre absoluto da retaguarda delimitado em 1400px e alinhado à esquerda. */}
      
      {/* 🧭 CABEÇALHO DO MÓDULO E CONTROLES DE RETORNO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}> {/* -> Faixa horizontal superior dividindo o cabeçalho técnico do bloco de planilhas. */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> {/* -> Agrupador reativo do título esquerdo. */}
          <Settings size={22} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Renderiza o ícone de engrenagem fina na cor escura sóbria. */}
          <div> {/* -> Divisora interna de textos. */}
            <h2 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "800", margin: 0, letterSpacing: "0.5px", textTransform: "uppercase" }}>Central de Parametrização de Clientes</h2> {/* -> Título formal de controle técnico em caixa alta regulamentar. */}
            <p style={{ color: "#64748b", fontSize: "12px", margin: "4px 0 0 0" }}>Gerencie os dados institucionais sóbrios de assistidos e representantes jurídicos.</p> {/* -> Frase de apoio descrevendo a finalidade do cockpit. */}
          </div> {/* -> Fim. */}
        </div> {/* -> Fim. */}
        
        {/* BOTÕES DE CONTROLE SUPERIOR DIREITO REFORMULADOS CONTEXTUAIS OU CIRCUITO DE AÇÕES EM LOTE */}
        {visaoPainel !== "hub" && ( // -> Só exibe o painel de botões de controle e sub-ferramentas caso o operador tenha saído do Hub principal e entrado em alguma planilha.
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}> {/* -> Alinhador horizontal de botões de comanda. */}
            {contagemSelecionados > 0 ? ( // -> Abre barramento condicional de lote: se o contador reativo de linhas flegadas for maior que zero, substitui os botões comuns pelas ações em massa:
              // 🧺 CIRCUITO DE LOTE ATIVO PREMIUM EM CADASTROS: Renderiza as ações em massa avançadas inline de duas etapas.
              <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff1f2", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fecdd3", height: "34px", boxSizing: "border-box" }}> {/* -> Painel flutuante de lote colorido em tom rosado sutil de atenção B2B. */}
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{contagemSelecionados} Marcados</span> {/* -> Mostra de forma destacada o total de linhas selecionadas pelo cobrador. */}
                
                {/* 🛠️ ETAPA 1: SELETOR DE COLUNA ALVO EM CADASTROS */}
                <select
                  value={campoSelecionadoLote} // -> Associa o valor selecionado ao estado da Etapa 1.
                  onChange={(e) => lidarComMudarCampoMassaCadastros(e.target.value)} // -> Monitora o clique alterando o foco do campo alvo da operação em lote.
                  style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }} // -> Menu suspenso compacto flat.
                >
                  <option value="">-- Campo para Editar --</option> {/* -> Opção nula de instrução padrão do seletor. */}
                  {visaoPainel === "empresas" && ( // -> Só mostra os campos de alteração de empresas se estiver na tabela de empresas PJ.
                    <>
                      <option value="segmento">SEGMENTO DE MERCADO</option>
                      <option value="tipo">TIPO (MATRIZ / FILIAL)</option>
                    </>
                  )}
                  {visaoPainel === "contatos" && ( // -> Só mostra os campos de alteração de contatos se estiver na tabela de contatos humanos PF.
                    <>
                      <option value="tipoVinculo">VÍNCULO JURÍDICO / PAPEL</option>
                      <option value="empresaId">CLIENTE ASSOCIAÇÃO (EMPRESA)</option>
                    </>
                  )}
                </select> {/* -> Encerra o select da Etapa 1. */}

                {/* 🛠️ ETAPA 2: INPUT REATIVO DINÂMICO CONTEXTUALIZED COMPATÍVEL COM CADA COLUNA CHAVE */}
                {campoSelecionadoLote === "tipo" && ( // -> Caso tenha escolhido alterar o Tipo Societário, renderiza o dropdown fixo com Matriz e Filial.
                  <select
                    value={valorEdicaoMassa} // -> Vincula à gaveta de valor coletivo.
                    onChange={(e) => setValorEdicaoMassa(e.target.value)} // -> Atualiza a string na memória.
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
                  >
                    <option value="">-- Escolha o Tipo --</option>
                    <option value="Matriz">MATRIZ</option>
                    <option value="Filial">FILIAL</option>
                  </select>
                )}

                {campoSelecionadoLote === "tipoVinculo" && ( // -> Caso tenha escolhido alterar o papel civil humano, renderiza os opções de elos homologadas do Firebase.
                  <select
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
                  >
                    <option value="">-- Selecione o Papel --</option>
                    {vinculosBase.map(vin => ( // -> Mapeia os vínculos societários transformando em opções de clique.
                      <option key={vin.id} value={vin.label}>{vin.label.toUpperCase()}</option>
                    ))}
                  </select>
                )}

                {campoSelecionadoLote === "empresaId" && ( // -> Caso tenha escolhido re-associar a empresa controladora em massa, invoca a lista de devedores ativos.
                  <select
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#2563eb", backgroundColor: "#ffffff", cursor: "pointer", outline: "none", maxWidth: "180px" }}
                  >
                    <option value="">-- Selecione a Empresa-Pai --</option>
                    {empresas.map(emp => ( // -> Mapeia as PJs inserindo a ID no valor interno e a razão social maiúscula no rótulo visual.
                      <option key={emp.id} value={emp.id}>{(emp.cliente || emp.razaoSocial || "").toUpperCase()}</option>
                    ))}
                  </select>
                )}

                {campoSelecionadoLote === "segmento" && ( // -> Caso tenha escolhido alterar o ramo mercadológico das PJs, abre caixa livre de digitação de texto.
                  <input
                    type="text"
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)} // -> Salva a string digitada na RAM.
                    placeholder="Digitar novo segmento..."
                    style={{ padding: "2px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", color: "#0f172a", backgroundColor: "#ffffff", outline: "none", width: "150px", height: "20px" }}
                  />
                )}

                {campoSelecionadoLote && ( // -> REGRA DE INTERFACE: Só exibe fisicamente o botão preto de "Aplicar" caso o operador tenha completado a seleção da Etapa 1.
                  <button
                    type="button"
                    onClick={lidarComAplicarEdicaoLoteCadastros} // -> Dispara o motor de mutação coletiva em massa do App.js.
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", height: "20px", display: "flex", alignItems: "center" }}
                  >
                    <span>Aplicar</span>
                  </button> // -> Botão de comanda em massa.
                )}

                <div style={{ width: "1px", height: "16px", backgroundColor: "#fda4af" }}></div> {/* -> Friso separador vertical de segurança na cor rosa. */}

                <button // -> Fabrica o botão vermelho de exclusão em bloco de cadastros secundários.
                  type="button"
                  onClick={() => aoExecutarExclusaoEmMassaExternas(visaoPainel === "empresas" ? "cadastros_empresas" : "cadastros_contatos")} // -> Dispara o descarte em massa enviando a rota correta da coleção do Firebase (empresas ou contatos).
                  style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ef4444", border: "none", color: "white", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"} // -> Escurece o tom para vermelho sangue no mouseover.
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"} // -> Restaura a cor padrão de fábrica.
                >
                  <Trash2 size={11} strokeWidth={2.5} /> {/* -> Ícone de lixeira do Lucide. */}
                  <span>Excluir</span>
                </button>
              </div> // -> Encerra o circuito de lote.
            ) : ( // -> Caso contrário, se o operador não tiver flegado nenhuma caixinha nas tabelas, exibe a barra de comandos clássica estável:
              // 🧭 CIRCUITO COMUM DE BOTÕES: Renderiza as ações administrativas nativas se não houver flegagem.
              <>
                {(visaoPainel === "empresas" || visaoPainel === "contatos") && ( // -> Filtro de contexto: só renderiza o botão de download Excel se o operador estiver vendo alguma das planilhas.
                  <button 
                    type="button" 
                    onClick={exportarParaExcel} // -> Aciona o motor assíncrono de download estruturado de planilhas.
                    title="Exportar dados visíveis para planilha Excel" 
                    style={{ background: "#ffffff", color: "#16a34a", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                  >
                    <FileSpreadsheet size={14} strokeWidth={2.5} /> {/* -> Ícone vetorial de planilha eletrônica verde do Lucide. */}
                    <span>Exportar .XLSX</span>
                  </button>
                )}
                {(visaoPainel === "empresas" || visaoPainel === "contatos") && ( // -> Filtro de contexto: só exibe o botão de erguer a cortina de buscas simultâneas se estiver nas listagens.
                  <button 
                    type="button" 
                    onClick={() => setGavetaFiltrosAberta(true)} // -> Seta verdadeiro abrindo a gaveta lateral de filtros avançados.
                    style={{ background: "#ffffff", color: "#475569", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                  >
                    <Filter size={14} strokeWidth={2.5} /> {/* -> Ícone vetorial de funil. */}
                    <span>Filtrar Tabela</span>
                  </button>
                )}
                {visaoPainel === "empresas" && ( // -> Exibe o botão de adição de nova PJ exclusivamente na planilha de empresas.
                  <button 
                    type="button" 
                    onClick={() => { setEmpresaEmEdicaoId(null); setModalEmpresaAberto(true); }} // -> Limpa rascunhos antigos e abre o modal de inserção limpo.
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
                  >
                    <Plus size={14} strokeWidth={2.5} /> {/* -> Ícone vetorial de cruz. */}
                    <span>Novo Assistido</span>
                  </button>
                )}
                {visaoPainel === "contatos" && ( // -> Exibe o botão de adição de nova PF exclusivamente na planilha de contatos humanos.
                  <button 
                    type="button" 
                    onClick={() => { setContatoEmEdicaoId(null); setModalContatoAberto(true); }} // -> Limpa rascunhos antigos e abre o modal de inserção de pessoas limpo.
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>Novo Contato</span>
                  </button>
                )}
              </>
            )} {/* -> Encerra o barramento condicional de alternação de Toolbar de lote. */}
            
            <button 
              type="button" 
              onClick={() => { setVisaoPainel("hub"); setCampoOrdenado(""); }} // -> Retrocede a visualização trazendo o cobrador para o menu Hub principal e limpa critérios de ordenamento ativos.
              style={{ background: "#475569", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#475569"}
            >
              <ArrowLeft size={14} strokeWidth={2.5} /> {/* -> Ícone vetorial de seta para esquerda de retorno. */}
              <span>Voltar ao Painel</span>
            </button>
          </div>
        )} {/* -> Encerra o painel superior de botões de comanda. */}
      </div> {/* -> Encerra o cabeçalho completo do módulo de cadastros. */}

      {/* =========================================================================================
            LAYOUT LEVEL 1: HUB RECONFIGURADO - GRADE EXPANDIDA E REDIRECIONADA PARA O COMPONENTE FILHO DESMEMBRADO
         ========================================================================================= */}
      {visaoPainel === "hub" && ( // -> Chamada reativa: se o visor estiver setado em "hub", invoca o componente especialista leve.
        <CadastrosHub 
          setVisaoPainel={setVisaoPainel} // -> Envia a função de chaveamento de telas para os cliques dos cards funcionarem.
          totalEmpresas={empresas.length} // -> Repassa o total numérico de devedores PJ do Firebase.
          totalContatos={contatos.length} // -> Repassa o total numérico de contatos PF do Firebase.
          totalSegmentos={segmentosBase.length} // -> Repassa o total numérico de ramos de mercado cadastrados.
          totalVinculos={vinculosBase.length} // -> Repassa o total numérico de tipos de elos cadastrados.
          totalEtapas={etapasFunilBase.length} // -> Repassa o total numérico de raias Kanban cadastradas.
        /> // -> Fecha a invocação do componente filho leve CadastrosHub.jsx.
      )}

      {/* =========================================================================================
            LAYOUT LEVEL 2: RENDERIZAÇÃO DAS PLANILHAS EXECUTIVAS MODULARIZADAS WITH GATILHOS ATIVOS UNIFICADOS
         ========================================================================================= */}
      {visaoPainel === "empresas" && <TabelaEmpresas empresasFiltradas={empresasOrdenadasVisor} aoEditarEmpresa={prepararEdicaoEmpresa} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} itensSelecionadosExternos={itensSelecionadosExternos} setItensSelecionadosExternos={setItensSelecionadosExternos} />} {/* -> Desenha a tabela com dados ordenados de empresas PJ e injeta os seletores de lote se o visor for igual a "empresas". */}
      {visaoPainel === "contatos" && <TabelaContatos contatosFiltrados={contatosOrdenadosVisor} empresas={empresas} aoEditarContato={prepararEdicaoContato} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} itensSelecionadosExternos={itensSelecionadosExternos} setItensSelecionadosExternos={setItensSelecionadosExternos} />} {/* -> Desenha a tabela com dados ordenados de contatos humanos se o visor for igual a "contatos". */}

      {/* =========================================================================================
            ⚙️ RENDERIZAÇÃO MODULAR: INVOCAÇÃO DAS PEÇAS ESPECIALISTAS EXTRATADAS E TOTALMENTE DESMEMBRADAS
         ========================================================================================= */}
      {visaoPainel === "segmentos" && ( // -> 🛠️ INJEÇÃO DA PEÇA 2 DESMEMBRADA: Acopla o sub-módulo independente de ramos de mercado.
        <GerenciadorSegmentos segmentosBase={segmentosBase} /> // -> Passa a lista viva da coleção de setores do Firebase por propriedades.
      )}

      {visaoPainel === "vinculos" && ( // -> 🛠️ INJEÇÃO DA PEÇA 3 DESMEMBRADA: Acopla o sub-módulo independente de papéis e cargos civis.
        <GerenciadorVinculos vinculosBase={vinculosBase} /> // -> Passa a lista viva da coleção de elos contratuais do Firebase por propriedades.
      )}

      {/* =========================================================================================
            🛠️ RENDERIZAÇÃO INTERNA DINÂMICA: INJETADA A TELA ESPECIALISTA DE CONFIGURAÇÃO DE RAIAS NO FLUXO DO HUB
         ========================================================================================= */}
      {visaoPainel === "funil" && ( // -> Desenha a central dinâmica de parametrização de colunas se o usuário clicar no Card 5 do HUB.
        <ModuloFunil /> // -> Invoca o componente filho especialista sem necessidade de parâmetros complexos.
      )}

      {visaoPainel === "mensagens" && ( // -> 🛠️ EMBUTIMENTO REATIVO DA CENTRAL: Acende o painel de templates na mesma tela ao clicar no Card 6.
        <ModuloMensagens etapasFunilExternas={etapasFunilBase} /> // -> Acopla de forma embutida e corporativa com as raias síncronas de fábrica.
      )}

      {/* =========================================================================================
            ➕ LAYOUT LEVEL 3: CHAMADA CIRÚRGICA DOS MODAIS ISOLADOS E GAVETA DE FILTROS (TOTALMENTE SANADOS)
         ========================================================================================= */}
      <ModalNovaEmpresa aberto={modalEmpresaAberto} aoFechar={() => { setModalEmpresaAberto(false); setEmpresaEmEdicaoId(null); setEmpCodigo(""); setEmpNome(""); setEmpCnpj(""); setEmpIsFilial(false); setEmpSegmento(""); setEmpEndereco(""); setEmpCep(""); }} tratarCadastroEmpresa={tratarCadastroEmpresa} empCodigo={empCodigo} setEmpCodigo={setEmpCodigo} empNome={empNome} setEmpNome={setEmpNome} empCnpj={empCnpj} setEmpCnpj={setEmpCnpj} empIsFilial={empIsFilial} setEmpIsFilial={setEmpIsFilial} empSegmento={empSegmento} setEmpSegmento={setEmpSegmento} empEndereco={empEndereco} setEmpEndereco={setEmpEndereco} empCep={empCep} setEmpCep={setEmpCep} listaSegmentos={segmentosBase} /> {/* -> Mantém conectado o formulário flutuante de empresas enviando os 7 estados de controle de input, a lista de nichos e resetando os campos ao fechar. */}
      <ModalNovoContato aberto={modalContatoAberto} aoFechar={() => { setModalContatoAberto(false); setContatoEmEdicaoId(null); setConNome(""); setConCpf(""); setConTelefone(""); setConEmail(""); setConTipo("responsavel"); setConEmpresaId(""); }} tratarCadastroContato={tratarCadastroContato} empresas={empresas} conEmpresaId={conEmpresaId} setConEmpresaId={setConEmpresaId} conNome={conNome} setConNome={setConNome} conCpf={conCpf} setConCpf={conCpf} conTelefone={conTelefone} setConTelefone={setConTelefone} conEmail={conEmail} setConEmail={conEmail} conTipo={conTipo} setConTipo={setConTipo} listaVinculos={vinculosBase} /> {/* -> Mantém conectado o formulário flutuante de contatos humanos ligando as 6 gavetas de monitoramento locais e limpando a memória ao fechar. */}
      <GavetaFiltrosCadastro aberto={gavetaFiltrosAberta} aoFechar={() => setGavetaFiltrosAberta(false)} visaoPainel={visaoPainel} filtrosEmpresa={filtrosEmpresa} setFiltrosEmpresa={setFiltrosEmpresa} filtrosContato={filtrosContato} setFiltrosContato={setFiltrosContato} listaVinculos={vinculosBase} /> {/* -> Mantém conectada a cortina invisível lateral de buscas injetando os objetos combinados de refinamento de cabeçalhos. */}

    </div>
  );
}