import React, { useState } from "react"; // -> Importa o núcleo do React e o gancho useState para gerenciar estados locais na tela.
import { db } from "../../config/firebase"; // -> Importa a conexão configurada do banco de dados Firestore da nuvem do Google.
import { collection, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; // -> Importa os comandos oficiais do Firestore para adicionar, referenciar, deletar e atualizar dados.
import { Settings, FileSpreadsheet, Filter, ArrowLeft, Building2, User, Tag, Link2, Columns3, Plus, Trash2, MessageSquare } from "lucide-react"; // -> Importa os ícones visuais modernos e leves para ilustrar os botões e painéis (adicionado MessageSquare para o 6º botão).
import TabelaEmpresas from "./TabelaEmpresas.jsx"; // -> Importa o componente filho que desenha a tabela especialista em Empresas.
import TabelaContatos from "./TabelaContatos.jsx"; // -> Importa o componente filho que desenha a tabela especialista em Contatos humanos.
import ModalNovaEmpresa from "./ModalNovaEmpresa.jsx"; // -> Importa o formulário flutuante para cadastrar ou editar uma Empresa.
import ModalNovoContato from "./ModalNovoContato.jsx"; // -> Importa o formulário flutuante para cadastrar ou editar um Contato humano.
import GavetaFiltrosCadastro from "./GavetaFiltrosCadastro.jsx"; // -> Importa o painel lateral que surge para realizar buscas avançadas nas tabelas.
import ModuloFunil from "./ModuloFunil.jsx"; // -> Importa o painel especialista na configuração e parametrização das colunas do funil Kanban.

export default function ModuloCadastros({ empresasAtivasExternas = [], contatosAtivosExternos = [], aoAtualizarEmpresasExternas, segmentosExternos = [], vinculosExternos = [], etapasFunilExternas = [], itensSelecionadosExternos = {}, setItensSelecionadosExternos, aoExecutarExclusaoEmMassaExternas, aoExecutarEdicaoEmMassaExternas }) { // -> Declara a função principal recebendo todos os dados e funções enviados pelo componente pai (App.jsx).
  const empresas = empresasAtivasExternas; // -> Cria um atalho local para ler a lista de empresas recebida de fora em tempo real.
  const contatos = contatosAtivosExternos; // -> Cria um atalho local para ler a lista de contatos recebida de fora em tempo real.
  const segmentosBase = segmentosExternos; // -> Cria um atalho local para ler a lista de segmentos cadastrados na nuvem.
  const vinculosBase = vinculosExternos; // -> Cria um atalho local para ler a lista de tipos de vínculos cadastrados na nuvem.
  const etapasFunilBase = etapasFunilExternas; // -> Cria um atalho local para ler as colunas ativas do funil Kanban do banco de dados.

  // CONTROLADORES DE FLUXO VISUAL (ESTADOS DE LAYOUT): Gerenciam as telas dinâmicas e o surgimento dos novos modais sóbrios.
  const [visaoPainel, setVisaoPainel] = useState("hub"); // -> Estado que define qual tela exibir: "hub" (menu principal), "empresas", "contatos", "segmentos", "vinculos", "funil" ou "mensagens".
  const [modalEmpresaAberto, setModalEmpresaAberto] = useState(false); // -> Estado booleano que abre (true) ou fecha (false) o formulário flutuante de empresas.
  const [modalContatoAberto, setModalContatoAberto] = useState(false); // -> Estado booleano que abre (true) ou fecha (false) o formulário flutuante de contatos.
  const [gavetaFiltrosAberta, setGavetaFiltrosAberta] = useState(false); // -> Estado booleano que abre ou fecha a cortina lateral de filtros de busca.

  // REGISTROS EM EDIÇÃO: Estados auxiliares técnicos para identificar se a operation atual é de alteração ou de inclusão nova.
  const [empresaEmEdicaoId, setEmpresaEmEdicaoId] = useState(null); // -> Guarda o ID da empresa que está sendo editada no momento; se for null, significa que é um novo cadastro.
  const [contatoEmEdicaoId, setContatoEmEdicaoId] = useState(null); // -> Guarda o ID do contato que está sendo editada no momento; se for null, significa que é um novo cadastro.

  // GAVETAS DE MONITORAMENTO DE INPUT PARA AS NOVAS COLEÇÕES INDEPENDENTES
  const [novoSegmentoTexto, setNovoSegmentoTexto] = useState(""); // -> Controla o texto digitado na caixinha para criar um novo segmento de mercado.
  const [novoVinculoTexto, setNovoVinculoTexto] = useState(""); // -> Controla o texto digitado na caixinha para criar um novo tipo de vínculo.

  // MEMÓRIA DE BUSCA COMBINADA RECALIBRADA: Expandida com todos os campos de cabeçalho para permitir buscas simultâneas estritas.
  const [filtrosEmpresa, setFiltrosEmpresa] = useState({ codigo: "", cliente: "", cnpj: "", tipo: "todos", segmento: "", endereco: "" }); // -> Objeto contendo os 6 filtros simultâneos da tabela de empresas.
  const [filtrosContato, setFiltrosContato] = useState({ nome: "", cpf: "", telefone: "", email: "", tipoVinculo: "todos" }); // -> Objeto contendo os 5 filtros simultâneos da tabela de contatos.

  // ESTADOS DE ORDENAÇÃO DINÂMICA: Memorizam qual coluna do cabeçalho está governando a fila e in qual direção.
  const [campoOrdenado, setCampoOrdenado] = useState(""); // -> Memoriza qual coluna foi clicada para ordenar os dados (ex: 'cliente', 'codigo').
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState("asc"); // -> Memoriza a direção da ordenação: 'asc' para crescente ou 'desc' para decrescente.

  // GAVETAS DE MONITORATION DO FORMULÁRIO DE EMPRESAS (PESSOAS JURÍDICAS)
  const [empCodigo, setEmpCodigo] = useState(""); // -> Controla o campo de texto do Código da conta da empresa no formulário.
  const [empNome, setEmpNome] = useState(""); // -> Controla o campo de texto da Razão Social da empresa no formulário.
  const [empCnpj, setEmpCnpj] = useState(""); // -> Controla o campo de texto do CNPJ da empresa no formulário.
  const [empIsFilial, setEmpIsFilial] = useState(false); // -> Controla a caixinha de marcação (checkbox) indicando se a empresa é uma Filial.
  const [empSegmento, setEmpSegmento] = useState(""); // -> Controla o segmento de mercado selecionado para a empresa no formulário.
  const [empEndereco, setEmpEndereco] = useState(""); // -> Controla o campo de texto do endereço da empresa no formulário.
  const [empCep, setEmpCep] = useState(""); // -> Controla o campo de texto do CEP da empresa no formulário.

  // GAVETAS DE MONITORATION DO FORMULÁRIO DE CONTACTOS (PESSOAS HUMANAS)
  const [conNome, setConNome] = useState(""); // -> Controla o campo de texto do Nome Completo do contato no formulário.
  const [conCpf, setConCpf] = useState(""); // -> Controla o campo de texto do CPF do contato no formulário.
  const [conTelefone, setConTelefone] = useState(""); // -> Controla o campo de texto do Telefone do contato no formulário.
  const [conEmail, setConEmail] = useState(""); // -> Controla o campo de texto do E-mail do contato no formulário.
  const [conTipo, setConTipo] = useState("responsavel"); // -> Controla a seleção do tipo de vínculo do contato (padrão: 'responsavel').
  const [conEmpresaId, setConEmpresaId] = useState(""); // -> Controla a Empresa-Pai selecionada à qual este contato pertence profissionalmente.

  // -> NOVOS ESTADOS LOCAIS PARA A EDICAO COLETIVA DE DUAS ETAPAS EM CADASTROS CADASTRADOS NA RAM EM TEMPO REAL:
  const [campoSelecionadoLote, setCampoSelecionadoLote] = useState(""); // -> Guarda qual campo o usuário escolheu para atualizar em massa (Etapa 1).
  const [valorEdicaoMassa, setValorEdicaoMassa] = useState(""); // -> Guarda o valor que será gravado em massa em todas as linhas selecionadas (Etapa 2).

  // -> CONTAGEM EM MASSA LOCAL: Analisa de forma reativa quantas linhas o operador flegou nas tabelas de cadastros secundários.
  const contagemSelecionados = Object.keys(itensSelecionadosExternos).filter((id) => itensSelecionadosExternos[id] === true).length; // -> Calcula quantas caixas de seleção estão marcadas como verdadeiras na tabela.

  // MANIPULADORES ASSÍNCRONOS DE BANCO DE DADOS: Gravam e deletam direto no Google Firestore de forma independente.
  const lidarAdicionarSegmento = async (e) => { // -> Função assíncrona executada ao enviar o formulário de novo segmento.
    e.preventDefault(); // -> Impede a página de recarregar com o envio do formulário.
    if (!novoSegmentoTexto.trim()) return; // -> Se o campo estiver em branco ou cheio de espaços vazios, cancela a operação.
    try { // -> Inicia um bloco de proteção contra erros de conexão com a internet.
      const colecaoRef = collection(db, "cadastros_segmentos"); // -> Conecta à tabela/coleção "cadastros_segmentos" no banco Firestore.
      await addDoc(colecaoRef, { nome: novoSegmentoTexto.trim() }); // -> Grava o novo documento com o nome do segmento na nuvem.
      setNovoSegmentoTexto(""); // -> Limpa o campo de texto da tela após salvar com sucesso.
    } catch (err) { alert("Erro de rede ao salvar segmento no Firebase!"); } // -> Exibe um aviso caso ocorra falha na conexão.
  };

  const lidarDeletarSegmento = async (id, nome) => { // -> Função assíncrona para excluir um segmento pelo ID único.
    const confirmar = window.confirm(`⚠️ EXCLUSÃO DE METADADOS:\nDeseja banir o segmento "${nome}" permanentemente do Firebase?`); // -> Exibe uma janela de confirmação de segurança para o usuário.
    if (confirmar) { // -> Se o usuário clicar em "OK".
      try { // -> Tenta realizar a exclusão de forma segura.
        const documentoRef = doc(db, "cadastros_segmentos", id); // -> Localiza o documento específico do segmento através do ID.
        await deleteDoc(documentoRef); // -> Deleta o documento permanentemente da nuvem do Google.
      } catch (err) { alert("Falha na autorização de descarte!"); } // -> Alerta se o usuário não tiver permissão ou houver erro de rede.
    }
  };

  const lidarAdicionarVinculo = async (e) => { // -> Função assíncrona executada ao enviar o formulário de novo vínculo jurídico.
    e.preventDefault(); // -> Impede a página de recarregar e perder as informações da tela.
    if (!novoVinculoTexto.trim()) return; // -> Trava o envio se o campo estiver vazio.
    try { // -> Tenta realizar a gravação no banco de dados remoto.
      const colecaoRef = collection(db, "cadastros_vinculos"); // -> Conecta à coleção "cadastros_vinculos" no Firestore.
      await addDoc(colecaoRef, { label: novoVinculoTexto.trim() }); // -> Grava o novo vínculo usando o padrão 'label'.
      setNovoVinculoTexto(""); // -> Limpa o campo de texto na tela.
    } catch (err) { alert("Erro de rede ao salvar vínculo no Firebase!"); } // -> Trata possíveis falhas de internet.
  };

  const lidarDeletarVinculo = async (id, label) => { // -> Função assíncrona para remover um vínculo pelo ID.
    const confirmar = window.confirm(`⚠️ EXCLUSÃO DE METADADOS:\nDeseja banir o vínculo "${label}" permanentemente do Firebase?`); // -> Pede confirmação ao usuário antes de apagar permanentemente.
    if (confirmar) { // -> Se confirmado o descarte.
      try { // -> Executa a tentativa de remoção.
        const documentoRef = doc(db, "cadastros_vinculos", id); // -> Localiza a referência exata do vínculo no Firestore.
        await deleteDoc(documentoRef); // -> Apaga o documento da base de dados na nuvem.
      } catch (err) { alert("Falha na autorização de descarte!"); } // -> Alerta o usuário em caso de erro no processo.
    }
  };

  // MANIPULADOR DE GATILHO PARA ACIONAR A ORDENAÇÃO DINÂMICA
  const lidarComMudarOrdenacao = (campo) => { // -> Função que gerencia o clique nos cabeçalhos das tabelas para ordenação.
    if (campoOrdenado === campo) { // -> Se a tabela já estava ordenada por este mesmo campo.
      setDirecaoOrdenacao(direcaoOrdenacao === "asc" ? "desc" : "asc"); // -> Inverte a direção: se era crescente vira decrescente e vice-versa.
    } else { // -> Se for um campo novo que não estava ordenando.
      setCampoOrdenado(campo); // -> Define este novo campo como o critério principal de ordenação.
      setDirecaoOrdenacao("asc"); // -> Reinicia a direção no modo crescente padrão.
    }
  };

  // AUXILIAR MATEMÁTICO DE ORDENAÇÃO EM RAM
  const poolOrdenacaoArray = (arrayParaOrdenar, campo, direcao) => { // -> Organiza a lista na memória antes de exibir na tela.
    if (!campo) return arrayParaOrdenar; // -> Se nenhum campo foi selecionado para ordenação, retorna a lista original intocada.
    return [...arrayParaOrdenar].sort((a, b) => { // -> Clona a lista e inicia o processo de comparação item por item.
      const valorA = String(a[campo] || "").toLowerCase(); // -> Puxa o valor do item A convertido em texto minúsculo para comparação justa.
      const valorB = String(b[campo] || "").toLowerCase(); // -> Puxa o valor do item B convertido em texto minúsculo para comparação justa.
      if (valorA < valorB) return direcao === "asc" ? -1 : 1; // -> Coloca o item A antes se a ordem for crescente, ou depois se for decrescente.
      if (valorA > valorB) return direcao === "asc" ? 1 : -1; // -> Coloca o item A depois se a ordem for crescente, ou antes se for decrescente.
      return 0; // -> Mantém na mesma posição se os valores forem perfeitamente iguais.
    });
  };

  // MECÂNICA DE EXPORTAÇÃO EXCEL EM .XLSX (CSV COMPATÍVEL DE ALTA PERFORMANCE)
  const exportarParaExcel = () => { // -> Função que gera o arquivo de planilha para download.
    let dadosParaExportar = []; // -> Declara a variável que receberá a lista de linhas filtradas.
    let cabecalhoColunas = ""; // -> Declara a primeira linha contendo os títulos das colunas do arquivo Excel.
    let nomeArquivo = ""; // -> Declara o nome com o qual o arquivo será salvo no computador.

    if (visaoPainel === "empresas") { // -> Se o usuário estiver na tela de listagem de Empresas.
      dadosParaExportar = empresasFiltradas; // -> Seleciona as empresas que estão aparecendo na tela após os filtros.
      cabecalhoColunas = "CONTA;RAZAO_SOCIAL;CNPJ;TIPO;SEGMENTO;ENDERECO_PRACA\n"; // -> Estrutura o cabeçalho das empresas separado por ponto e vírgula.
      nomeArquivo = "base_assistidos_empresas.csv"; // -> Define o nome do arquivo para o download das empresas.
    } else if (visaoPainel === "contatos") { // -> Se o usuário estiver na tela de listagem de Contatos.
      dadosParaExportar = contatosFiltrados; // -> Seleciona os contatos filtrados ativos da tela.
      cabecalhoColunas = "NOME_REPRESENTANTE;CPF_JURIDICO;TELEFONE_CONTATO;EMAIL;PAPEL_VINCULO;EMPRESA_PAI\n"; // -> Estrutura o cabeçalho dos contatos separado por ponto e vírgula.
      nomeArquivo = "representantes_financeiros.csv"; // -> Define o nome do arquivo para o download dos contatos.
    } else { return; } // -> Se não estiver em nenhuma dessas telas, cancela a exportação imediatamente.

    let corpoPlanilha = cabecalhoColunas; // -> Inicializa o texto completo da planilha inserindo a linha de cabeçalhos.
    dadosParaExportar.forEach((item) => { // -> Percorre cada registro da lista limpa para construir as linhas de texto.
      if (visaoPainel === "empresas") { // -> Se for montagem de dados de empresas.
        // PRESERVAÇÃO E HIGIENIZAÇÃO: Remove pontos e vírgulas para não quebrar a estrutura de colunas do Excel.
        const codigo = String(item.codigo || "").replace(/;/g, " "); // -> Limpa caracteres perigosos do campo código.
        const cliente = String(item.cliente || "").replace(/;/g, " "); // -> Limpa caracteres perigosos do campo Razão Social.
        const cnpj = String(item.cnpj || "").replace(/;/g, " "); // -> Limpa caracteres perigosos do campo CNPJ.
        const tipo = String(item.tipo || "").replace(/;/g, " "); // -> Limpa caracteres perigosos do campo Tipo.
        const segmento = String(item.segmento || "").replace(/;/g, " "); // -> Limpa caracteres perigosos do campo Segmento.
        const endereco = String(item.endereco || "").replace(/;/g, " "); // -> Limpa caracteres perigosos do campo Endereço.
        corpoPlanilha += `${codigo};${cliente};${cnpj};${tipo};${segmento};${endereco}\n`; // -> Concatena a linha da empresa separada por ponto e vírgula e pula a linha.
      } else { // -> Se for montagem de dados de contatos.
        const empresaPai = empresas.find((e) => e.id === item.empresaId); // -> Procura a empresa correspondente na memória através do ID relacional.
        const nomeEmpresa = empresaPai ? empresaPai.cliente : "Não Encontrada"; // -> Define o nome da empresa encontrada ou aplica um texto padrão se não achar.
        
        // PRESERVAÇÃO E HIGIENIZAÇÃO: Remove pontos e vírgulas dos textos dos contatos e do nome da empresa para exibição perfeita no Excel.
        const nome = String(item.nome || "").replace(/;/g, " "); // -> Limpa caracteres do nome do representante.
        const cpf = String(item.cpf || "").replace(/;/g, " "); // -> Limpa caracteres do CPF.
        const telefone = String(item.telefone || "").replace(/;/g, " "); // -> Limpa caracteres do telefone.
        const email = String(item.email || "").replace(/;/g, " "); // -> Limpa caracteres do e-mail.
        const tipoVinculo = String(item.tipoVinculo || "").replace(/;/g, " "); // -> Limpa caracteres do tipo de vínculo.
        const empresaLimpa = String(nomeEmpresa).replace(/;/g, " "); // -> Limpa caracteres do nome da empresa pai.
        corpoPlanilha += `${nome};${cpf};${telefone};${email};${tipoVinculo};${empresaLimpa}\n`; // -> Concatena os dados do contato limpando o encodeURIComponent bugado.
      }
    });

    const blobDeDados = new Blob(["\uFEFF" + corpoPlanilha], { type: "text/csv;charset=utf-8;" }); // -> Converte todo o texto gerado em um bloco binário de dados e aplica o código BOM do Excel para manter os acentos corretos.
    const linkInvisivel = document.createElement("a"); // -> Cria um elemento de link "<a>" fictício na memória do navegador.
    linkInvisivel.href = URL.createObjectURL(blobDeDados); // -> Associa o bloco de dados binários como o endereço de internet deste link.
    linkInvisivel.setAttribute("download", nomeArquivo); // -> Configura o atributo de download informando o nome correto do arquivo.
    document.body.appendChild(linkInvisivel); // -> Adiciona temporariamente o link oculto na estrutura visual da página.
    linkInvisivel.click(); // -> Simula um clique do mouse via código para iniciar o download automaticamente.
    document.body.removeChild(linkInvisivel); // -> Remove o link invisível da página para liberar espaço na memória RAM do computador.
  };

  // ACIONADORES DE FORMULÁRIO POPULADO (GATILHOS DE EDIÇÃO)
  const prepararEdicaoEmpresa = (empresa) => { // -> Prepara o formulário com dados antigos ao clicar para editar uma empresa.
    setEmpresaEmEdicaoId(empresa.id); // -> Grava o ID da empresa em edição para saber que faremos uma atualização e não uma criação nova.
    setEmpCodigo(empresa.codigo || ""); // -> Preenche o campo de Código com o valor atual vindo do banco de dados.
    setEmpNome(empresa.cliente || ""); // -> Preenche o campo de Nome/Razão Social com o valor armazenado.
    setEmpCnpj(empresa.cnpj || ""); // -> Preenche o campo de CNPJ com o valor armazenado.
    setEmpIsFilial(empresa.tipo === "Filial"); // -> Marca o checkbox se a empresa estiver registrada como "Filial".
    setEmpSegmento(empresa.segmento || ""); // -> Seleciona o segmento de mercado correto da empresa no formulário.
    setEmpEndereco(empresa.endereco || ""); // -> Preenche o endereço cadastrado da empresa no formulário.
    setEmpCep(empresa.cep || ""); // -> Preenche o CEP cadastrado da empresa no formulário.
    setModalEmpresaAberto(true); // -> Abre visualmente o modal de empresas contendo todos esses campos preenchidos.
  };

  const prepararEdicaoContato = (contato) => { // -> Prepara o formulário com dados antigos ao clicar para editar um contato.
    setContatoEmEdicaoId(contato.id); // -> Grava o ID do contato para executar atualização parcial no banco.
    setConNome(contato.nome || ""); // -> Preenche o campo de Nome do contato com o valor atual do banco.
    setConCpf(contato.cpf || ""); // -> Preenche o campo de CPF com o valor armazenado.
    setConTelefone(contato.telefone || ""); // -> Preenche o campo de Telefone com o valor armazenado.
    setConEmail(contato.email || ""); // -> Preenche o campo de E-mail com o valor armazenado.
    setConTipo(contato.tipoVinculo || "responsavel"); // -> Preenche a opção de vínculo com o papel jurídico correto.
    setConEmpresaId(contato.empresaId || ""); // -> Associa a Empresa-Pai correta selecionando-a no menu do formulário.
    setModalContatoAberto(true); // -> Abre visualmente o modal de contatos humanos na tela com os dados prontos.
  };

  // -> DISPARADOR DO COMANDO COLETIVO ADMINISTRATIVE DE ALTERAÇÃO EM LOTE
  const lidarComAplicarEdicaoLoteCadastros = () => { // -> Função acionada ao clicar para aplicar alterações em massa nas linhas marcadas.
    if (!campoSelecionadoLote) { // -> Se o usuário não escolheu qual coluna quer alterar.
      alert("⚠️ COCKPIT DE CADASTROS:\nPor favor, escolha qual campo deseja alterar em massa."); // -> Dispara um aviso na tela.
      return; // -> Para a execução do código.
    }
    if (!valorEdicaoMassa.trim()) { // -> Se a caixinha com a nova informação estiver vazia.
      alert("⚠️ COCKPIT DE CADASTROS:\nDigite ou selecione o novo dado que será gravado em todas as linhas."); // -> Dispara um aviso na tela.
      return; // -> Para a execução do código.
    }
    if (aoExecutarEdicaoEmMassaExternas) { // -> Se a função de lote vinda do App.jsx estiver disponível e conectada.
      aoExecutarEdicaoEmMassaExternas(campoSelecionadoLote, valorEdicaoMassa.trim()); // -> Envia o campo alvo e o novo valor para atualização em massa no banco.
      setCampoSelecionadoLote(""); // -> Reseta o seletor da Etapa 1 limpando a memória.
      setValorEdicaoMassa(""); // -> Reseta o campo de texto da Etapa 2 limpando a memória.
    }
  };

  // -> MONITOR DE ALTERAÇÃO DE SELETOR DE CADASTRO COLETIVO
  const lidarComMudarCampoMassaCadastros = (novoCampo) => { // -> Reseta o valor digitado quando o usuário muda a coluna selecionada no lote.
    setCampoSelecionadoLote(novoCampo); // -> Grava o novo campo escolhido pelo usuário.
    setValorEdicaoMassa(""); // -> Zera o campo de valor para evitar misturar dados antigos com a nova coluna.
  };

  // RE-HOMOLOGAÇÃO DA FUNÇÃO TRATAR CADASTRO EMPRESA CONECTADA DIRETAMENTE AO CLOUD FIRESTORE
  const tratarCadastroEmpresa = async (e) => { // -> Função assíncrona que salva ou atualiza uma empresa no Firebase.
    e.preventDefault(); // -> Bloqueia o navegador de recarregar e apagar o progresso atual do operador.
    if (!empCodigo.trim() || !empNome.trim() || !empCnpj.trim()) { // -> Valida se os três campos essenciais de texto foram preenchidos.
      alert("⚠️ CAMPOS OBRIGATÓRIOS:\n\nPor favor, preencha o Código da Conta, a Razão Social e o CNPJ do assistido."); // -> Alerta o usuário sobre a obrigatoriedade.
      return; // -> Interrompe o salvamento se faltar algum dado essencial.
    }

    const pacoteEmpresaNoSQL = { // -> Cria um objeto estruturado contendo as informações limpas prontas para envio à nuvem.
      codigo: empCodigo.trim(), // -> Remove espaços extras e adiciona o código da conta corporativa.
      cliente: empNome.trim().toUpperCase(), // -> Converte o nome da empresa para letras maiúsculas padronizadas de sistema.
      cnpj: empCnpj.trim(), // -> Adiciona o CNPJ livre de espaços nas pontas.
      tipo: empIsFilial ? "Filial" : "Matriz", // -> Define o tipo da empresa analisando o estado do checkbox.
      segmento: empSegmento || "Não Definido", // -> Envia o segmento ou adiciona um texto padrão de segurança caso esteja nulo.
      endereco: empEndereco.trim() || "Não informado", // -> Envia o endereço limpo ou texto informativo padrão.
      cep: empCep.trim() || "00000-000" // -> Envia o CEP formatado ou valor padrão de segurança de banco de dados.
    };

    try { // -> Tenta realizar as operações assíncronas de gravação de rede.
      if (empresaEmEdicaoId) { // -> Se houver um ID ativo guardado no estado de edição.
        const docRef = doc(db, "cadastros_empresas", empresaEmEdicaoId); // -> Cria uma referência apontando diretamente para aquele documento específico da empresa na nuvem.
        await updateDoc(docRef, { ...pacoteEmpresaNoSQL }); // -> Executa a alteração parcial atualizando os dados desse documento no Firestore.
        alert("🏢 RE-HOMOLOGADO!\nOs dados estruturais do assistido foram salvos na nuvem."); // -> Dá retorno de sucesso.
      } else { // -> Caso o ID seja nulo, significa que é um cadastro inédito de raiz.
        const colecaoRef = collection(db, "cadastros_empresas"); // -> Cria uma referência apontando para a coleção geral de empresas.
        await addDoc(colecaoRef, pacoteEmpresaNoSQL); // -> Insere um novo documento gerando automaticamente um ID exclusivo na nuvem da Google.
        alert(`🏢 ASSISTIDO HOMOLOGADO!\n"${empNome.trim().toUpperCase()}" foi adicionado com sucesso.`); // -> Dá retorno de sucesso exibindo o nome em maiúsculas.
      }
      setModalEmpresaAberto(false); // -> Fecha a janela flutuante do formulário automaticamente.
      setEmpresaEmEdicaoId(null); // -> Libera a memória limpando o ID de edição de foco.
      setEmpCodigo(""); setEmpNome(""); setEmpCnpj(""); setEmpIsFilial(false); setEmpSegmento(""); setEmpEndereco(""); setEmpCep(""); // -> Reseta completamente os 7 campos do formulário para o próximo uso.
    } catch (err) { // -> Se capturar qualquer erro crítico de falta de internet ou permissões.
      alert("Falha crítica de barramento ao persistir empresa no Firebase!"); // -> Mostra um aviso técnico preventivo ao operador.
    }
  };

  // RE-SOLDA COMPLETA DO GRAVADOR ASSÍNCRONO DE CONTATOS DO FIRESTORE
  const tratarCadastroContato = async (e) => { // -> Função assíncrona que salva ou atualiza um contato no Firebase.
    e.preventDefault(); // -> Cancela o comportamento padrão de recarregamento de página do HTML.
    if (!conNome.trim() || !conCpf.trim() || !conTelefone.trim() || !conEmpresaId) { // -> Valida os 4 campos considerados estritamente mandatórios para representantes humanos.
      alert("⚠️ CAMPOS OBRIGATÓRIOS:\n\nÉ obrigatório preencher o Nome Completo, CPF, Telefone e selecionar uma Empresa-Pai."); // -> Dispara aviso técnico em tela.
      return; // -> Aborta e trava o salvamento.
    }
    if (conEmail && !conEmail.includes("@")) { // -> Checa se o usuário digitou um e-mail sem o caractere arroba obrigatório.
      alert("⚠️ VALIDAÇÃO DE CADASTRO:\n\nO e-mail digitado é inválido. Insira um domínio válido com '@'."); // -> Avisa o operador na tela.
      return; // -> Aborta o salvamento.
    }
    if (conTelefone.replace(/\D/g, "").length < 10) { // -> Limpa parênteses e traços e conta se há menos de 10 dígitos numéricos no telefone.
      alert("⚠️ CONFIGURAÇÃO FISCAL:\n\nO telefone precisa conter entre 10 e 11 dígitos numéricos válidos com o DDD."); // -> Avisa o operador.
      return; // -> Aborta o salvamento.
    }

    const pacoteContatoNoSQL = { // -> Organiza as gavetas de dados limpando espaços vazios das pontas de texto.
      nome: conNome.trim(), // -> Nome limpo do representante jurídico.
      cpf: conCpf.trim(), // -> Número de CPF sem espaços nas pontas.
      telefone: conTelefone.trim(), // -> Número de telefone formatado.
      email: conEmail.trim() || "Não informado", // -> Grava o e-mail digitado ou carimba uma string padrão caso esteja em branco.
      tipoVinculo: conTipo, // -> Adiciona o papel civil do contato selecionado no dropdown.
      empresaId: conEmpresaId // -> Adiciona a amarração física guardando o ID da empresa a qual pertence.
    };

    try { // -> Executa o bloco de segurança assíncrono de rede.
      if (contatoEmEdicaoId) { // -> Se o estado de foco possuir o ID de um contato antigo.
        const docRef = doc(db, "cadastros_contatos", contatoEmEdicaoId); // -> Cria a rota exata de localização daquele documento na nuvem.
        await updateDoc(docRef, { ...pacoteContatoNoSQL }); // -> Aplica a alteração parcial instantânea gravando no Firestore.
        alert("👤 RE-HOMOLOGADO!\nOs dados do representante foram atualizados na nuvem."); // -> Notifica sucesso.
      } else { // -> Caso o ID seja nulo, realiza um empilhamento inédito.
        const colecaoRef = collection(db, "cadastros_contatos"); // -> Aponta o canal para a coleção geral de contatos.
        await addDoc(colecaoRef, pacoteContatoNoSQL); // -> Envia o pacote criando uma chave auto-gerada pela Google.
        alert(`👤 CONTATO HOMOLOGADO!\n"${conNome.trim()}" foi associado com sucesso.`); // -> Notifica o sucesso exibindo o nome inserido.
      }
      setModalContatoAberto(false); // -> Fecha a tela flutuante do formulário humano.
      setContatoEmEdicaoId(null); // -> Reseta o ID de edição limpando os registros de rascunhos.
      setConNome(""); setConCpf(""); setConTelefone(""); setConEmail(""); setConTipo("responsavel"); setConEmpresaId(""); // -> Limpa as 6 caixinhas de entrada do formulário de contato.
    } catch (err) {
      alert("Falha crítica de barramento ao persistir contato no Firebase!"); // -> Protege o aplicativo exibindo aviso de falha de conexão.
    }
  };

  // BARREIRAS DE FILTRAGEM EXPANDIDAS: Varrem e batem simultaneamente todas as colunas físicas dos cabeçalhos.
  const empresasFiltradas = empresas.filter((emp) => { // -> Filtra a lista bruta de empresas em tempo real cruzando os 6 critérios de busca ao mesmo tempo.
    const bateCodigo = emp.codigo ? emp.codigo.toLowerCase().includes(filtrosEmpresa.codigo.toLowerCase()) : false; // -> Confere se o código digitado bate com o banco ignorando letras maiúsculas ou minúsculas.
    const bateCliente = emp.cliente ? emp.cliente.toLowerCase().includes(filtrosEmpresa.cliente.toLowerCase()) : false; // -> Confere se a Razão Social da empresa contém o texto digitado na busca.
    const bateCnpj = emp.cnpj ? emp.cnpj.toLowerCase().includes(filtrosEmpresa.cnpj.toLowerCase()) : false; // -> Confere se o CNPJ digitado está contido no documento salvo.
    const bateTipo = filtrosEmpresa.tipo === "todos" || emp.tipo === filtrosEmpresa.tipo; // -> Confere se o tipo selecionado corresponde ou libera todas se for igual a "todos".
    const bateSegmento = !filtrosEmpresa.segmento || (emp.segmento && emp.segmento.toLowerCase().includes(filtrosEmpresa.segmento.toLowerCase())); // -> Confere reativamente se o segmento da empresa atende ao critério de filtro.
    const bateEndereco = !filtrosEmpresa.endereco || (emp.endereco && emp.endereco.toLowerCase().includes(filtrosEmpresa.endereco.toLowerCase())) || (emp.cep && emp.cep.includes(filtrosEmpresa.endereco)); // -> Confere se a busca se aplica ao endereço completo ou se casa com os números do CEP.
    return bateCodigo && bateCliente && bateCnpj && bateTipo && bateSegmento && bateEndereco; // -> Retorna verdadeiro se o registro passar com sucesso por todas as 6 barreiras de checagem.
  });

  const contatosFiltrados = contatos.filter((con) => { // -> Filtra a lista de contatos em tempo real cruzando os 5 critérios de busca ao mesmo tempo.
    const bateNome = con.nome ? con.nome.toLowerCase().includes(filtrosContato.nome.toLowerCase()) : false; // -> Confere se o nome pesquisado coincide parcial ou totalmente com o nome do representante.
    const bateCpf = con.cpf ? con.cpf.toLowerCase().includes(filtrosContato.cpf.toLowerCase()) : false; // -> Confere se a numeração de CPF digitada bate com a linha da tabela.
    const bateTipo = filtrosContato.tipoVinculo === "todos" || con.tipoVinculo === filtrosContato.tipoVinculo; // -> Isola a categoria do papel de vínculo ou exibe todos na tela.
    const bateTelefone = !filtrosContato.telefone || (con.telefone && con.telefone.includes(filtrosContato.telefone)); // -> Filtra a tabela conferindo os algarismos do número telefônico digitados.
    const bateEmail = !filtrosContato.email || (con.email && con.email.toLowerCase().includes(filtrosContato.email.toLowerCase())); // -> Filtra a tabela batendo o texto pesquisado com o endereço eletrônico do contato.
    return bateNome && bateCpf && bateTipo && bateTelefone && bateEmail; // -> Retorna verdadeiro permitindo a exibição em tela se passar nos 5 testes casados.
  });

  // APLICAÇÃO DA ORDENAÇÃO DINÂMICA ANTES DA RENDERIZAÇÃO FINAL
  const empresasOrdenadasVisor = poolOrdenacaoArray(empresasFiltradas, campoOrdenado, direcaoOrdenacao); // -> Entrega o lote de empresas filtradas organizadas na ordem alfabética ou numérica configurada.
  const contatosOrdenadosVisor = poolOrdenacaoArray(contatosFiltrados, campoOrdenado, direcaoOrdenacao); // -> Entrega o lote de contatos filtrados organizados na ordem alfabética ou numérica configurada.

  return ( // -> Inicia a renderização do bloco visual de interface construído em linguagem HTML com estilos inline seguros.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "24px auto", padding: "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
      
      {/* 🧭 CABEÇALHO DO MÓDULO E CONTROLES DE RETORNO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Settings size={22} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Renderiza o ícone de engrenagem fina na cor escura sóbria. */}
          <div>
            <h2 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "800", margin: 0, letterSpacing: "0.5px", textTransform: "uppercase" }}>Central de Parametrização de Clientes</h2> {/* -> Título formal de controle técnico em caixa alta. */}
            <p style={{ color: "#64748b", fontSize: "12px", margin: "4px 0 0 0" }}>Gerencie os dados institucionais sóbrios de assistidos e representantes jurídicos.</p> {/* -> Descrição resumida da finalidade da tela. */}
          </div>
        </div>
        
        {/* BOTÕES DE CONTROLE SUPERIOR DIREITO REFORMULADOS CONTEXTUAIS OU CIRCUITO DE AÇÕES EM LOTE */}
        {visaoPainel !== "hub" && ( // -> Só exibe o painel de botões de controle se o usuário tiver saído do HUB principal.
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {contagemSelecionados > 0 ? ( // -> Verifica se há itens marcados; se houver, exibe o painel especial de lote.
              // 🧺 CIRCUITO DE LOTE ATIVO PREMIUM EM CADASTROS: Renderiza as ações em massa avançadas inline de duas etapas.
              <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff1f2", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fecdd3", height: "34px", boxSizing: "border-box" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{contagemSelecionados} Marcados</span> {/* -> Mostra de forma destacada o total de linhas selecionadas. */}
                
                {/* 🛠️ ETAPA 1: SELETOR DE COLUNA ALVO EM CADASTROS */}
                <select
                  value={campoSelecionadoLote} // -> Associa o valor selecionado ao estado da Etapa 1.
                  onChange={(e) => lidarComMudarCampoMassaCadastros(e.target.value)} // -> Monitora o clique alterando o foco do campo alvo da operação em lote.
                  style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
                >
                  <option value="">-- Campo para Editar --</option> {/* -> Opção nula de instrução padrão. */}
                  {visaoPainel === "empresas" && ( // -> Só mostra os campos de alteração de empresas se estiver na tabela de empresas.
                    <>
                      <option value="segmento">SEGMENTO DE MERCADO</option>
                      <option value="tipo">TIPO (MATRIZ / FILIAL)</option>
                    </>
                  )}
                  {visaoPainel === "contatos" && ( // -> Só mostra os campos de alteração de contatos se estiver na tabela de contatos humanos.
                    <>
                      <option value="tipoVinculo">VÍNCULO JURÍDICO / PAPEL</option>
                      <option value="empresaId">CLIENTE ASSOCIAÇÃO (EMPRESA)</option>
                    </>
                  )}
                </select>

                {/* 🛠️ ETAPA 2: INPUT REATIVO DINÂMICO CONTEXTUALIZADO */}
                {campoSelecionadoLote === "tipo" && ( // -> Se escolheu alterar o Tipo, renderiza um menu com Matriz e Filial.
                  <select
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
                  >
                    <option value="">-- Selecione o Tipo --</option>
                    <option value="Matriz">MATRIZ</option>
                    <option value="Filial">FILIAL</option>
                  </select>
                )}

                {campoSelecionadoLote === "tipoVinculo" && ( // -> Se escolheu alterar o papel jurídico, renderiza os vínculos cadastrados no banco.
                  <select
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
                  >
                    <option value="">-- Selecione o Papel --</option>
                    {vinculosBase.map(vin => ( // -> Percorre a lista de vínculos mapeando em opções do menu.
                      <option key={vin.id} value={vin.label}>{vin.label.toUpperCase()}</option> // -> Exibe o nome da categoria convertido em letras maiúsculas.
                    ))}
                  </select>
                )}

                {campoSelecionadoLote === "empresaId" && ( // -> Se escolheu re-associar a empresa pai, renderiza as empresas ativas do sistema.
                  <select
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#2563eb", backgroundColor: "#ffffff", cursor: "pointer", outline: "none", maxWidth: "180px" }}
                  >
                    <option value="">-- Selecione a Empresa-Pai --</option>
                    {empresas.map(emp => ( // -> Percorre a lista viva de empresas injetando-as no dropdown.
                      <option key={emp.id} value={emp.id}>{emp.cliente.toUpperCase()}</option> // -> Guarda o ID físico na opção e mostra a Razão Social em maiúsculas.
                    ))}
                  </select>
                )}

                {campoSelecionadoLote === "segmento" && ( // -> Se for segmento de mercado de empresas, abre caixa livre de digitação.
                  <input
                    type="text"
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    placeholder="Digitar novo segmento..."
                    style={{ padding: "2px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", color: "#0f172a", backgroundColor: "#ffffff", outline: "none", width: "150px", height: "20px" }}
                  />
                )}

                {campoSelecionadoLote && ( // -> Só renderiza o botão "Aplicar" se a Etapa 1 tiver um campo alvo selecionado pelo usuário.
                  <button
                    type="button"
                    onClick={lidarComAplicarEdicaoLoteCadastros} // -> Dispara a atualização em lote assíncrona ao clicar.
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", height: "20px", display: "flex", alignItems: "center" }}
                  >
                    Aplicar
                  </button>
                )}

                <div style={{ width: "1px", height: "16px", backgroundColor: "#fda4af" }}></div> {/* -> Linha vertical sutil divisora de botões in tom rosado. */}

                <button
                  type="button"
                  onClick={() => aoExecutarExclusaoEmMassaExternas(visaoPainel === "empresas" ? "cadastros_empresas" : "cadastros_contatos")} // -> Aciona a função de remoção coletiva passando o nome da coleção correspondente.
                  style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ef4444", border: "none", color: "white", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"} // -> Efeito visual escurecedor ao passar o ponteiro do mouse por cima.
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"} // -> Restaura a cor vermelha padrão ao retirar o ponteiro do mouse.
                >
                  <Trash2 size={11} strokeWidth={2.5} /> {/* -> Ícone de lixeira fina do Lucide. */}
                  <span>Excluir</span>
                </button>
              </div>
            ) : (
              // 🧭 CIRCUITO COMUM DE BOTÕES: Renderiza as ações administrativas nativas se não houver flegagem.
              <>
                {(visaoPainel === "empresas" || visaoPainel === "contatos") && ( // -> Só exibe o botão de exportar excel se estiver em uma das planilhas de listagem.
                  <button 
                    type="button" 
                    onClick={exportarParaExcel} // -> Aciona o motor de download Excel ao clicar.
                    title="Exportar dados visíveis para planilha Excel" 
                    style={{ background: "#ffffff", color: "#16a34a", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"} // -> Aplica fundo verde claro ao passar o mouse.
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"} // -> Restaura fundo branco padrão ao sair o mouse.
                  >
                    <FileSpreadsheet size={14} strokeWidth={2.5} /> {/* -> Ícone de documento de planilha excel. */}
                    <span>Exportar .XLSX</span>
                  </button>
                )}
                {(visaoPainel === "empresas" || visaoPainel === "contatos") && ( // -> Só exibe o acionador da cortina de filtros nas telas de tabelas de dados.
                  <button 
                    type="button" 
                    onClick={() => setGavetaFiltrosAberta(true)} // -> Levanta a gaveta de filtros lateral direita setando true.
                    style={{ background: "#ffffff", color: "#475569", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                  >
                    <Filter size={14} strokeWidth={2.5} /> {/* -> Ícone de funil indicador de filtragem. */}
                    <span>Filtrar Tabela</span>
                  </button>
                )}
                {visaoPainel === "empresas" && ( // -> Se estiver vendo as empresas, exibe o botão especializado de nova empresa.
                  <button 
                    type="button" 
                    onClick={() => { setEmpresaEmEdicaoId(null); setModalEmpresaAberto(true); }} // -> Limpa IDs antigos e abre o formulário limpo para novas inclusões corporativas.
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
                  >
                    <Plus size={14} strokeWidth={2.5} /> {/* -> Ícone de cruz indicativa de soma/adição. */}
                    <span>Novo Assistido</span>
                  </button>
                )}
                {visaoPainel === "contatos" && ( // -> Se estiver vendo os contatos, exibe o botão especializado de novo contato humano.
                  <button 
                    type="button" 
                    onClick={() => { setContatoEmEdicaoId(null); setModalContatoAberto(true); }} // -> Limpa IDs de foco antigos e abre o formulário de novos contatos humanos.
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>Novo Contato</span>
                  </button>
                )}
              </>
            )}
            <button 
              type="button" 
              onClick={() => { setVisaoPainel("hub"); setCampoOrdenado(""); }} // -> Altera a visualização para o menu principal do HUB e limpa ordenações ativas.
              style={{ background: "#475569", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#475569"}
            >
              <ArrowLeft size={14} strokeWidth={2.5} /> {/* -> Ícone vetorial de seta apontando para a esquerda de retorno. */}
              <span>Voltar ao Painel</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================================
      			 LAYOUT LEVEL 1: HUB RECONFIGURADO - GRADE EXPANDIDA PARA 6 CARTÕES SIMÉTRICOS E ELEGANTES (3x2 / 3x3)
      	 ========================================================================================= */}
      {visaoPainel === "hub" && ( // -> Renderiza o painel principal de cartões seletores se o estado ativo for igual a "hub".
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginTop: "8px" }}>
          
          {/* CARD BONITO 1: Base de Assistidos */}
          <div onClick={() => setVisaoPainel("empresas")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Building2 size={24} strokeWidth={2} /> {/* -> Ícone grande ilustrativo de Prédio Corporativo. */}
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Base de Assistidos (Empresas)</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie Razão Social, CNPJs obrigatórios, endereços de citações e status de matriz/filial.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Total Cadastrado: {empresas.length}</span> {/* -> Exibe o total acumulado reativo de empresas salvas no Firebase. */}
          </div>

          {/* CARD BONITO 2: Representantes Financeiros */}
          <div onClick={() => setVisaoPainel("contatos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <User size={24} strokeWidth={2} /> {/* -> Ícone grande ilustrativo de Perfil de Usuário Humano. */}
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Representantes Financeiros (Contatos)</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie a fiação humana relacional, CPFs obrigatórios, telefones com DDD e e-mails com @.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Total Cadastrado: {contatos.length}</span> {/* -> Exibe o total acumulado reativo de contatos salvos no Firebase. */}
          </div>

          {/* CARD BONITO 3: Segmentos de Mercado */}
          <div onClick={() => setVisaoPainel("segmentos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Tag size={24} strokeWidth={2} /> {/* -> Ícone grande de etiqueta indicativa de categorias ou nichos. */}
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Segmentos de Mercado</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice os nichos de atuação comercial de devedores (Ex: Logística, Varejo) in coleção separada.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Setores Ativos: {segmentosBase.length}</span> {/* -> Exibe a contagem em tempo real de setores parametrizados ativos. */}
          </div>

          {/* CARD BONITO 4: Tipos de Elos e Vínculos */}
          <div onClick={() => setVisaoPainel("vinculos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Link2 size={24} strokeWidth={2} /> {/* -> Ícone grande vetorial de elo de corrente representando ligações civis. */}
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Tipos de Elos e Vínculos</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice as categorias jurídicas de representation humana (Ex: Preposto, Sócio) in coleção separada.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Categorias: {vinculosBase.length}</span> {/* -> Exibe o total de tipos de vínculos cadastrados de forma independente. */}
          </div>

          {/* CARD BONITO 5: Central de Gerenciamento do Funil NoSQL Parametrizável */}
          <div onClick={() => setVisaoPainel("funil")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Columns3 size={24} strokeWidth={2} /> {/* -> Ícone grande vetorial simbolizando 3 colunas paralelas verticais do Kanban. */}
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Gerenciamento do Funil (CRM)</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Adicione, renomeie ou remova colunas vivas do Kanban ligando-as à máquina de estados Core.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Etapas do Banco: {etapasFunilBase.length}</span> {/* -> Exibe o número de raias registradas na engrenagem principal. */}
          </div>

          {/* CARD BONITO 6: Central de Parametrização de Mensagens (O NOVO BOTÃO) */}
          <div onClick={() => setVisaoPainel("mensagens")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <MessageSquare size={24} strokeWidth={2} /> {/* -> Ícone grande de balão de mensagem para simbolizar o cockpit de notificações. */}
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Central de Mensagens</h3> {/* -> Título da nova parametrização. */}
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Configure os modelos, réguas e templates padrão de mensagens automáticas disparadas pelo ecossistema.</p> {/* -> Explicação resumida da funcionalidade do novo botão. */}
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Status: Ativo</span> {/* -> Indicador padrão de funcionamento do módulo secundário. */}
          </div>

        </div>
      )}

      {/* =========================================================================================
      			 LAYOUT LEVEL 2: RENDERIZAÇÃO DAS PLANILHAS EXECUTIVAS MODULARIZADAS WITH GATILHOS ATIVOS UNIFICADOS
      	 ========================================================================================= */}
      {visaoPainel === "empresas" && <TabelaEmpresas empresasFiltradas={empresasOrdenadasVisor} aoEditarEmpresa={prepararEdicaoEmpresa} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} itensSelecionadosExternos={itensSelecionadosExternos} setItensSelecionadosExternos={setItensSelecionadosExternos} />} {/* -> Desenha a tabela com dados ordenados de empresas e injeta os seletores de lote se o visor for igual a "empresas". */}
      {visaoPainel === "contatos" && <TabelaContatos contatosFiltrados={contatosOrdenadosVisor} empresas={empresas} aoEditarContato={prepararEdicaoContato} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} itensSelecionadosExternos={itensSelecionadosExternos} setItensSelecionadosExternos={setItensSelecionadosExternos} />} {/* -> Desenha a tabela com dados ordenados de contatos humanos se o visor for igual a "contatos". */}

      {/* =========================================================================================
      			 ⚙️ RENDERIZAÇÃO INTERNA: NOVA TABELA COMPACTA PARA GERENCIAR A COLEÇÃO DE SEGMENTOS
      	 ========================================================================================= */}
      {visaoPainel === "segmentos" && ( // -> Renderiza o gerenciador autônomo de nichos caso o estado da tela ativa seja "segmentos".
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
            <Tag size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} />
            <span>Cadastro de Segmentos Independentes</span>
          </h3>
          <form onSubmit={lidarAdicionarSegmento} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}> {/* -> Formulário inline com gatilho assíncrono acionado no botão de envio. */}
            <input type="text" placeholder="Digitar novo setor (Ex: Tecnologia)..." value={novoSegmentoTexto} onChange={(e) => setNovoSegmentoTexto(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", background: "#f8fafc" }} /> {/* -> Campo monitorado para digitação de novos nichos pelo usuário. */}
            <button type="submit" style={{ display: "flex", alignItems: "center", gap: "4px", background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>
              <Plus size={14} strokeWidth={2.5} />
              <span>Inserir</span>
            </button>
          </form>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}> {/* -> Estrutura de listagem compacta em formato de tabela de dados. */}
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
                <th style={{ padding: "8px 12px" }}>NOME DO NICHO / SETOR ATIVO</th>
                <th style={{ padding: "8px 12px", textAlign: "center", width: "60px" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {!segmentosBase || segmentosBase.length === 0 ? ( // -> Se a lista retornada da nuvem estiver vazia, renderiza uma fileira contendo texto informativo.
                <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>Nenhum segmento parametrizado na base.</td></tr>
              ) : (
                segmentosBase.map((seg) => ( // -> Havendo dados, percorre um a um criando linhas físicas reais na grade.
                  <tr key={seg.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>
                    <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Building2 size={13} strokeWidth={2} style={{ color: "#64748b" }} />
                        <span>{seg.nome}</span> {/* -> Mostra o nome textual do segmento de mercado gravado. */}
                      </div>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <button type="button" onClick={() => lidarDeletarSegmento(seg.id, seg.nome)} title="Excluir este segmento permanentemente" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                        <Trash2 size={14} strokeWidth={2} /> {/* -> Ícone de lixeira que dispara exclusão ao receber o clique do mouse. */}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================================
      			 ⚙️ RENDERIZAÇÃO INTERNA: NOVA TABELA COMPACTA PARA GERENCIAR A COLEÇÃO DE VÍNCULOS
      	 ========================================================================================= */}
      {visaoPainel === "vinculos" && ( // -> Renderiza o gerenciador autônomo de papéis contratuais caso o estado seja "vinculos".
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
            <Link2 size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} />
            <span>Cadastro de Tipos de Vínculos Civis</span>
          </h3>
          <form onSubmit={lidarAdicionarVinculo} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}> {/* -> Formulário inline com gatilho assíncrono para novos elos. */}
            <input type="text" placeholder="Digitar novo elo (Ex: Gerente Geral)..." value={novoVinculoTexto} onChange={(e) => setNovoVinculoTexto(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", background: "#f8fafc" }} /> {/* -> Campo monitorado para digitação de novos elos contratuais pelo usuário. */}
            <button type="submit" style={{ display: "flex", alignItems: "center", gap: "4px", background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>
              <Plus size={14} strokeWidth={2.5} />
              <span>Inserir</span>
            </button>
          </form>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
                <th style={{ padding: "8px 12px" }}>CATEGORIA / PAPEL INSTITUCIONAL</th>
                <th style={{ padding: "8px 12px", textAlign: "center", width: "60px" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {vinculosBase.length === 0 ? ( // -> Se a lista vinda de fora estiver vazia, cria uma linha informando indisponibilidade.
                <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>Nenhuma categoria parametrizada na base.</td></tr>
              ) : (
                vinculosBase.map((vin) => ( // -> Havendo itens na coleção, itera montando as fileiras físicas na grade.
                  <tr key={vin.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>
                    <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={13} strokeWidth={2} style={{ color: "#64748b" }} />
                        <span>{vin.label}</span> {/* -> Exibe o título textual do elo gravado no banco de dados. */}
                      </div>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <button type="button" onClick={() => lidarDeletarVinculo(vin.id, vin.label)} title="Excluir este vínculo permanentemente" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                        <Trash2 size={14} strokeWidth={2} /> {/* -> Dispara a rotina assíncrona de trituração física na nuvem do Google. */}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================================
      			 🛠️ RENDERIZAÇÃO INTERNA DINÂMICA: INJETADA A TELA ESPECIALISTA DE CONFIGURAÇÃO DE RAIAS NO FLUXO DO HUB
      	 ========================================================================================= */}
      {visaoPainel === "funil" && ( // -> Desenha a central dinâmica de parametrização de colunas se o usuário clicar no Card 5 do HUB.
        <ModuloFunil /> // -> Invoca o componente filho especialista sem necessidade de parâmetros complexos.
      )}

      {/* =========================================================================================
      			 ➕ LAYOUT LEVEL 3: CHAMADA CIRÚRGICA DOS MODAIS ISOLADOS E GAVETA DE FILTROS (TOTALMENTE SANADOS)
      	 ========================================================================================= */}
      <ModalNovaEmpresa aberto={modalEmpresaAberto} aoFechar={() => { setModalEmpresaAberto(false); setEmpresaEmEdicaoId(null); setEmpCodigo(""); setEmpNome(""); setEmpCnpj(""); setEmpIsFilial(false); setEmpSegmento(""); setEmpEndereco(""); setEmpCep(""); }} tratarCadastroEmpresa={tratarCadastroEmpresa} empCodigo={empCodigo} setEmpCodigo={setEmpCodigo} empNome={empNome} setEmpNome={setEmpNome} empCnpj={empCnpj} setEmpCnpj={setEmpCnpj} empIsFilial={empIsFilial} setEmpIsFilial={setEmpIsFilial} empSegmento={empSegmento} setEmpSegmento={setEmpSegmento} empEndereco={empEndereco} setEmpEndereco={setEmpEndereco} empCep={empCep} setEmpCep={setEmpCep} listaSegmentos={segmentosBase} /> {/* -> Mantém conectado o formulário flutuante de empresas enviando os 7 estados de controle de input, a lista de nichos e resetando os campos ao fechar. */}
      <ModalNovoContato aberto={modalContatoAberto} aoFechar={() => { setModalContatoAberto(false); setContatoEmEdicaoId(null); setConNome(""); setConCpf(""); setConTelefone(""); setConEmail(""); setConTipo("responsavel"); setConEmpresaId(""); }} tratarCadastroContato={tratarCadastroContato} empresas={empresas} conEmpresaId={conEmpresaId} setConEmpresaId={setConEmpresaId} conNome={conNome} setConNome={setConNome} conCpf={conCpf} setConCpf={setConCpf} conTelefone={conTelefone} setConTelefone={setConTelefone} conEmail={conEmail} setConEmail={setConEmail} conTipo={conTipo} setConTipo={setConTipo} listaVinculos={vinculosBase} /> {/* -> Mantém conectado o formulário flutuante de contatos humanos ligando as 6 gavetas de monitoramento locais e limpando a memória ao fechar. */}
      <GavetaFiltrosCadastro aberto={gavetaFiltrosAberta} aoFechar={() => setGavetaFiltrosAberta(false)} visaoPainel={visaoPainel} filtrosEmpresa={filtrosEmpresa} setFiltrosEmpresa={setFiltrosEmpresa} filtrosContato={filtrosContato} setFiltrosContato={setFiltrosContato} /> {/* -> Mantém conectada a cortina invisível lateral de buscas injetando os objetos combinados de refinamento de cabeçalhos. */}

    </div>
  );
}