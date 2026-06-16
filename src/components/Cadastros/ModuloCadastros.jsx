import React, { useState } from "react"; // -> Importa a biblioteca mestre do React e o gancho useState para monitorar as caixas de seleção locais do CRM de faturamento.
import { db } from "../../config/firebase"; // -> Injeta o conector físico db exportado do arquivo firebase.js para permitir comandos directos à nuvem.
import { collection, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; // -> Puxa as ferramentas nativas do Google Firestore para inclusão, update parcial e descarte definitivo de documentos de banco.
import { Settings, FileSpreadsheet, Filter, ArrowLeft, Building2, User, Tag, Link2, Columns3, Plus, Trash2, SlidersHorizontal } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.
import TabelaEmpresas from "./TabelaEmpresas.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa a planilha especialista em Pessoas Jurídicas na mesma pasta.
import TabelaContatos from "./TabelaContatos.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa a planilha especialista em Pessoas Humanas na mesma pasta.
import ModalNovaEmpresa from "./ModalNovaEmpresa.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa o formulário flutuante especialista em Pessoas Jurídicas.
import ModalNovoContato from "./ModalNovoContato.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa o formulário flutuante especialista em Pessoas Humanas.
import GavetaFiltrosCadastro from "./GavetaFiltrosCadastro.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa a gaveta lateral direita especialista em buscas avançadas.
import ModuloFunil from "./ModuloFunil.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa a nova central especialista em criação e parametrização de etapas dinâmicas.

export default function ModuloCadastros({ empresasAtivasExternas = [], contatosAtivosExternos = [], aoAtualizarEmpresasExternas, segmentosExternos = [], vinculosExternos = [], etapasFunilExternas = [], itensSelecionadosExternos = {}, setItensSelecionadosExternos, aoExecutarExclusaoEmMassaExternas, aoExecutarEdicaoEmMassaExternas }) { // -> RECALIBRAÇÃO EM MASSA: Puxa o cabo assíncrono aoExecutarEdicaoEmMassaExternas direto do maestro mestre do App.jsx.
  const empresas = empresasAtivasExternas; // -> Mapeia a variável local para espelhar em tempo real a base unificada compartilhada com o Kanban.
  const contatos = contatosAtivosExternos; // -> Limpada a fiação cenográfica residual para ler única e estritamente a bandeja viva da nuvem.
  const segmentosBase = segmentosExternos; // -> INVERSÃO DE LÓGICA CONCLUÍDA: Sincroniza a grade visual de nichos com a coleção independente real do Firestore.
  const vinculosBase = vinculosExternos; // -> INVERSÃO DE LÓGICA CONCLUÍDA: Sincroniza a grade visual de elos com a coleção independente real do Firestore.
  const etapasFunilBase = etapasFunilExternas; // -> Declara simetricamente o espelho de RAM local para extinguir de vez o ReferenceError da linha 364.

  // CONTROLADORES DE FLUXO VISUAL (ESTADOS DE LAYOUT): Gerenciam as telas dinâmicas e o surgimento dos novos modais sóbrios.
  const [visaoPainel, setVisaoPainel] = useState("hub"); // -> HUB EVOLUÍDO: Controla se exibe os cartões ("hub"), "empresas", "contatos", "segmentos", "vinculos" ou o novo gerenciador "funil".
  const [modalEmpresaAberto, setModalEmpresaAberto] = useState(false); // -> MODAL EMPRESA: Controla o aparecimento flutuante del formulário de novos assistidos.
  const [modalContatoAberto, setModalContatoAberto] = useState(false); // -> MODAL CONTATO: Controla o aparecimento flutuante del formulário de novos representantes humanos.
  const [gavetaFiltrosAberta, setGavetaFiltrosAberta] = useState(false); // -> GAVETA DE FILTROS: Abre ou fecha a cortina lateral direita administrative de buscas.

  // REGISTROS EM EDIÇÃO: Estados auxiliares técnicos para identificar se a operation atual é de alteração ou de inclusão nova.
  const [empresaEmEdicaoId, setEmpresaEmEdicaoId] = useState(null); // -> CORREÇÃO LÓGICA SÍNCRONA: Alinha o nome da função de estado para bater simetricamente com as chamadas de salvamento das linhas subsequentes.
  const [contatoEmEdicaoId, setContatoEmEdicaoId] = useState(null); // -> Armazena a ID exclusiva do documento Firestore do representative que está sendo alterado pelo operador.

  // GAVETAS DE MONITORAMENTO DE INPUT PARA AS NOVAS COLEÇÕES INDEPENDENTES
  const [novoSegmentoTexto, setNovoSegmentoTexto] = useState(""); // -> Guarda caractere por caractere o texto digitado para criar um novo segmento de mercado.
  const [novoVinculoTexto, setNovoVinculoTexto] = useState(""); // -> Guarda caractere por caractere o texto digitado para criar um novo tipo de elo.

  // MEMÓRIA DE BUSCA COMBINADA RECALIBRADA: Expandida com todos os campos de cabeçalho para permitir buscas simultâneas estritas.
  const [filtrosEmpresa, setFiltrosEmpresa] = useState({ codigo: "", cliente: "", cnpj: "", tipo: "todos", segmento: "", endereco: "" }); // -> Guarda as 6 chaves completas para refinar os dados de Pessoas Jurídicas.
  const [filtrosContato, setFiltrosContato] = useState({ nome: "", cpf: "", telefone: "", email: "", tipoVinculo: "todos" }); // -> Guarda as 5 chaves completas para refinar os dados de Pessoas Humanas.

  // ESTADOS DE ORDENAÇÃO DINÂMICA: Memorizam qual coluna do cabeçalho está governando a fila e in qual direção.
  const [campoOrdenado, setCampoOrdenado] = useState(""); // -> Guarda a string da chave da coluna ativa (Ex: 'codigo', 'cliente', 'nome').
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState("asc"); // -> Guarda o sentido do alinhamento, alternando entre crescente ('asc') e decrescente ('desc').

  // GAVETAS DE MONITORAÇÃO DO FORMULÁRIO DE EMPRESAS (PESSOAS JURÍDICAS)
  const [empCodigo, setEmpCodigo] = useState(""); // -> Guarda o texto do código da conta corporativa.
  const [empNome, setEmpNome] = useState(""); // -> Guarda a Razão Social da empresa cliente.
  const [empCnpj, setEmpCnpj] = useState(""); // -> Guarda o CNPJ institucional da empresa.
  const [empIsFilial, setEmpIsFilial] = useState(false); // -> Guarda o booleano (verdadeiro/falso) se o registro é uma filial.
  const [empSegmento, setEmpSegmento] = useState(""); // -> Guarda a área ou segmento de atuação del cliente.
  const [empEndereco, setEmpEndereco] = useState(""); // -> Guarda o logradouro completo com número e bairro.
  const [empCep, setEmpCep] = useState(""); // -> Guarda o código postal CEP de localização.

  // GAVETAS DE MONITORAÇÃO DO FORMULÁRIO DE CONTACTOS (PESSOAS HUMANAS)
  const [conNome, setConNome] = useState(""); // -> Guarda o nome completo do representative legal.
  const [conCpf, setConCpf] = useState(""); // -> Guarda o CPF do contacto para assinaturas de contratos.
  const [conTelefone, setConTelefone] = useState(""); // -> Guarda o número de telefone móvel ou fixo com DDD.
  const [conEmail, setConEmail] = useState(""); // -> Guarda o e-mail corporativo de notificações processuais.
  const [conTipo, setConTipo] = useState("responsavel"); // -> Guarda a categoria do vínculo do contacto (padrão: responsável).
  const [conEmpresaId, setConEmpresaId] = useState(""); // -> CHAVE DE ARMAZENAMENTO RELACIONAL: Memoriza a qual Empresa-Pai este contacto pertence.

  // -> NOVOS ESTADOS LOCAIS PARA A EDICAO COLETIVA DE DUAS ETAPAS EM CADASTROS CADASTRADOS NA RAM EM TEMPO REAL:
  const [campoSelecionadoLote, setCampoSelecionadoLote] = useState(""); // -> ETAPA 1: Guarda qual coluna do banco o operador quer atualizar (segmento, tipo, empresaId, tipoVinculo).
  const [valorEdicaoMassa, setValorEdicaoMassa] = useState(""); // -> ETAPA 2: Armazena o novo valor digitado ou selecionado para sobrescrever as linhas flegadas.

  // -> CONTAGEM EM MASSA LOCAL: Analisa de forma reativa quantas linhas o operador flegou nas tabelas de cadastros secundários.
  const contagemSelecionados = Object.keys(itensSelecionadosExternos).filter((id) => itensSelecionadosExternos[id] === true).length; // -> Retorna a soma de booleanos marcados.

  // MANIPULADORES ASSÍNCRONOS DE BANCO DE DADOS: Gravam e deletam direto no Google Firestore de forma independente.
  const lidarAdicionarSegmento = async (e) => { // -> Transmutada em assíncrona para disparar pacotes de rede para a nuvem.
    e.preventDefault(); // -> Trava o recarregamento automático do navegador protegendo a digitação.
    if (!novoSegmentoTexto.trim()) return; // -> Trava de segurança contra submissões sem conteúdo.
    try { // -> Escudo protetivo de chamadas assíncronas.
      const colecaoRef = collection(db, "cadastros_segmentos"); // -> Aponta a esteira para a nova coleção isolada de raiz cadastros_segmentos.
      await addDoc(colecaoRef, { nome: novoSegmentoTexto.trim() }); // -> Dispara o salvamento do documento fixo com chave estruturada.
      setNovoSegmentoTexto(""); // -> Reseta o campo de texto visual.
    } catch (err) { alert("Erro de rede ao salvar segmento no Firebase!"); }
  };

  const lidarDeletarSegmento = async (id, nome) => { // -> Transmutada em assíncrona para triturar canhotos de metadados na nuvem.
    const confirmar = window.confirm(`⚠️ EXCLUSÃO DE METADADOS:\nDeseja banir o segmento "${nome}" permanentemente do Firebase?`); // -> Pop-up nativo de barreira humana prévia.
    if (confirmar) { // -> Se o usuário acenar como positivo.
      try { // -> Tenta a remoção física no Firestore.
        const documentoRef = doc(db, "cadastros_segmentos", id); // -> Localiza o ID do documento exato de nichos dentro da nuvem.
        await deleteDoc(documentoRef); // -> Tritura o documento e limpa os dropdowns instantaneamente por reflexo reativo.
      } catch (err) { alert("Falha na autorização de descarte!"); }
    }
  };

  const lidarAdicionarVinculo = async (e) => { // -> Transmutada em assíncrona para disparar pacotes de rede para a nuvem.
    e.preventDefault(); // -> Trava o recarregamento automático del navegador protegendo a digitação.
    if (!novoVinculoTexto.trim()) return; // -> Trava de segurança contra submissões sem conteúdo.
    try { // -> Escudo protetivo de chamadas assíncronas.
      const colecaoRef = collection(db, "cadastros_vinculos"); // -> Abre o canal visando diretamente a coleção independente raiz no Firestore.
      await addDoc(colecaoRef, { label: novoVinculoTexto.trim() }); // -> Grava a nova categoria de elo civil de forma fixa e definitiva na nuvem.
      setNovoVinculoTexto(""); // -> CORREÇÃO DE MODIFICADOR: Ajustado para usar setNovoVinculoTexto impedindo estouros de compilação no terminal.
    } catch (err) { alert("Erro de rede ao salvar vínculo no Firebase!"); }
  };

  const lidarDeletarVinculo = async (id, label) => { // -> Transmutada em assíncrona para triturar canhotos de metadados humanos na nuvem.
    const confirmar = window.confirm(`⚠️ EXCLUSÃO DE METADADOS:\nDeseja banir o vínculo "${label}" permanentemente do Firebase?`); // -> Pop-up nativo de barreira humana prévia.
    if (confirmar) { // -> Se o usuário acenar como positivo.
      try { // -> Tenta a remoção física no Firestore.
        const documentoRef = doc(db, "cadastros_vinculos", id); // -> Localiza o ID do documento exato de elos dentro da nuvem.
        await deleteDoc(documentoRef); // -> Tritura o documento e limpa os dropdowns instantaneamente por reflexo reativo.
      } catch (err) { alert("Falha na autorização de descarte!"); }
    }
  };

  // MANIPULADOR DE GATILHO PARA ACIONAR A ORDENAÇÃO DINÂMICA
  const lidarComMudarOrdenacao = (campo) => { // -> Recebe a string da coluna clicada pelo operador no cabeçalho.
    if (campoOrdenado === campo) { // -> Se o operador clicou na mesma coluna que já estava filtrando.
      setDirecaoOrdenacao(direcaoOrdenacao === "asc" ? "desc" : "asc"); // -> Inverte a direção do fluxo alternando entre crescente e decrescente.
    } else { // -> Caso seja um clique in uma coluna inédita.
      setCampoOrdenado(campo); // -> Define a nova coluna mestre da ordenação.
      setDirecaoOrdenacao("asc"); // -> Inicializa o sentido em modo crescente padrão.
    } // -> Encerra o chaveamento.
  }; // -> Encerra a função manipuladora de ordenação.

  // AUXILIAR MATEMÁTICO DE ORDENAÇÃO EM RAM
  const poolOrdenacaoArray = (arrayParaOrdenar, campo, direcao) => { // -> Recebe o lote de dados filtrados para organize antes da renderização na tela.
    if (!campo) return arrayParaOrdenar; // -> Trava antiqueda: Se nenhuma coluna foi clicada, Devolve o lote no formato original de fábrica.
    return [...arrayParaOrdenar].sort((a, b) => { // -> Abre a ordenação comparando item por item.
      const valorA = String(a[campo] || "").toLowerCase(); // -> Extrai a propriedade do item A forçando formato de texto minúsculo para ordenação limpa.
      const valorB = String(b[campo] || "").toLowerCase(); // -> Extrai a propriedade do item B forçando formato de texto minúsculo para ordenação limpa.
      if (valorA < valorB) return direcao === "asc" ? -1 : 1; // -> Se o valor A vem antes na ordem alfabética e for crescente, joga para cima.
      if (valorA > valorB) return direcao === "asc" ? 1 : -1; // -> Se o valor A vem depois na ordem alfabética e for crescente, joga para baixo.
      return 0; // -> Mantém inalterado se os valores forem idênticos.
    }); // -> Encerra o sort em memória RAM.
  };

  // MECÂNICA DE EXPORTAÇÃO EXCEL EM .XLSX (CSV COMPATÍVEL DE ALTA PERFORMANCE)
  const exportarParaExcel = () => { // -> Acionado pelo botão de download superior.
    let dadosParaExportar = []; // -> Inicializa o balde vazio que vai acomodar os registros higienizados.
    let cabecalhoColunas = ""; // -> Inicializa a string que montará a primeira linha de títulos da planilha.
    let nomeArquivo = ""; // -> Inicializa a variável do título do arquivo de download.

    if (visaoPainel === "empresas") { // -> Se o advogado estiver auditando a tela de Pessoas Jurídicas.
      dadosParaExportar = empresasFiltradas; // -> Captura exatamente as linhas que passaram pelas barreiras de busca de empresas.
      cabecalhoColunas = "CONTA;RAZAO_SOCIAL;CNPJ;TIPO;SEGMENTO;ENDERECO_PRACA\n"; // -> Monta os títulos simétricos das colunas separados por ponto e vírgula.
      nomeArquivo = "base_assistidos_empresas.csv"; // -> Define o nome final do arquivo físico.
    } else if (visaoPainel === "contatos") { // -> Se o advogado estiver auditando a tela de Pessoas Humanas.
      dadosParaExportar = contatosFiltrados; // -> Captura exatamente as linhas que passaram pelas barreiras de busca de contatos.
      cabecalhoColunas = "NOME_REPRESENTANTE;CPF_JURIDICO;TELEFONE_CONTATO;EMAIL;PAPEL_VINCULO;EMPRESA_PAI\n"; // -> Monta os títulos simétricos das colunas separados por ponto e vírgula.
      nomeArquivo = "representantes_financeiros.csv"; // -> Define o nome final do arquivo físico.
    } else { return; } // -> Trava de escape caso seja acionado no HUB.

    let corpoPlanilha = cabecalhoColunas; // -> Insere o cabeçalho de colunas como a primeira fileira de texto del arquivo.
    dadosParaExportar.forEach((item) => { // -> Percorre registro por registro higienizando as quebras para o Excel ler sem distorções.
      if (visaoPainel === "empresas") { // -> Montagem das strings da linha da empresa assistida.
        corpoPlanilha += `${item.codigo || ""};${item.cliente || ""};${item.cnpj || ""};${item.tipo || ""};${item.segmento || ""};${item.endereco || ""}\n`; // -> Concatena as células divididas por ponto e vírgula e salta a linha.
      } else { // -> Montagem das strings da linha do contato representative humano.
        const empresaPai = empresas.find((e) => e.id === item.empresaId); // -> Cruza na memória para resgatar o nome corporativo da empresa-pai vinculada.
        corpoPlanilha += `${item.nome || ""};${item.cpf || ""};${item.telefone || ""};${item.email || ""};${item.tipoVinculo || ""};${window.encodeURIComponent(empresaPai ? empresaPai.cliente : "Não Encontrada")}\n`; // -> Concatena as células humanas divididas por ponto e vírgula e salta a linha.
      }
    }); // -> Termina a montagem del bloco bruto de texto.

    const blobDeDados = new Blob(["\uFEFF" + corpoPlanilha], { type: "text/csv;charset=utf-8;" }); // -> Converte a string bruta injetando o byte BOM de compatibilidade automática para o Microsoft Excel abrir sem corromper acentos.
    const linkInvisivel = document.createElement("a"); // -> Instancia um gatilho de link físico temporário na raiz do navegador HTML.
    linkInvisivel.href = URL.createObjectURL(blobDeDados); // -> Assenta os dados convertidos como endereço de rota de download.
    linkInvisivel.setAttribute("download", nomeArquivo); // -> Carimba o nome do arquivo executivo no gatilho de download.
    document.body.appendChild(linkInvisivel); // -> Pendura o link de forma invisível na árvore da página.
    linkInvisivel.click(); // -> Dispara o clique virtual simulado por software salvando o arquivo no computador do advogado.
    document.body.removeChild(linkInvisivel); // -> Arranca o link temporário della memória ram liberando espaço ativo.
  }; // -> Encerra o motor especialista de exportação para Excel.

  // ACIONADORES DE FORMULÁRIO POPULADO (GATILHOS DE EDIÇÃO)
  const prepararEdicaoEmpresa = (empresa) => { // -> Disparado ao clicar no corpo da linha na planilha de Pessoas Jurídicas.
    setEmpresaEmEdicaoId(empresa.id); // -> Memoriza qual ID física do Firestore está sob modificação activa.
    setEmpCodigo(empresa.codigo || ""); // -> Popula o campo do Código Conta com o dado histórico.
    setEmpNome(empresa.cliente || ""); // -> Popula a caixa da Razão Social com o dado histórico.
    setEmpCnpj(empresa.cnpj || ""); // -> Popula a caixa do CNPJ com o dado histórico.
    setEmpIsFilial(empresa.tipo === "Filial"); // -> Chaveia o booleano do checkbox baseado na string salva.
    setEmpSegmento(empresa.segmento || ""); // -> Popula a caixa do segmento com o dado histórico.
    setEmpEndereco(empresa.endereco || ""); // -> Popula o input de localização com o dado histórico.
    setEmpCep(empresa.cep || ""); // -> Popula o input de CEP com o dado histórico.
    setModalEmpresaAberto(true); // -> Levanta o modal flutuante com todos os dados montados nas caixas de digitação.
  }; // -> Encerra o gatilho de edição da empresa.

  const prepararEdicaoContato = (contato) => { // -> Disparado ao clicar no corpo da linha na planilha de representantes.
    setContatoEmEdicaoId(contato.id); // -> Memoriza qual ID física do Firestore está sob modificação activa.
    setConNome(contato.nome || ""); // -> Popula o campo do Nome Completo com o dado histórico.
    setConCpf(contato.cpf || ""); // -> Popula a caixa do documento CPF com o dado histórico.
    setConTelefone(contato.telefone || ""); // -> Popula o input de telefone com o número salvo.
    setConEmail(contato.email || ""); // -> Popula a caixa de correio eletrônico com o endereço salvo.
    setConTipo(contato.tipoVinculo || "responsavel"); // -> Alinha a opção do dropdown no papel jurídico correspondente.
    setConEmpresaId(contato.empresaId || ""); // -> Vincula a chave de amarração da empresa-pai correspondente.
    setModalContatoAberto(true); // -> Levanta o modal flutuante humano com todos os dados preenchidos na tela.
  }; // -> Encerra o gatilho de edição do contato.

  // -> DISPARADOR DO COMANDO COLETIVO ADMINISTRATIVE DE ALTERAÇÃO EM LOTE
  const lidarComAplicarEdicaoLoteCadastros = () => { // -> Acionado ao clicar no botão "Aplicar".
    if (!campoSelecionadoLote) { // -> Trava contra disparos sem seleção de campo alvo.
      alert("⚠️ COCKPIT DE CADASTROS:\nPor favor, escolha qual campo deseja alterar em massa."); // -> Alerta o advogado.
      return; // -> Suspende a operação.
    }
    if (!valorEdicaoMassa.trim()) { // -> Trava se a caixinha da nova informação estiver em branco.
      alert("⚠️ COCKPIT DE CADASTROS:\nDigite ou selecione o novo dado que será gravado em todas as linhas."); // -> Alerta o advogado.
      return; // -> Suspende a operação.
    }
    if (aoExecutarEdicaoEmMassaExternas) { // -> Se o barramento com o App.jsx estiver de pé.
      aoExecutarEdicaoEmMassaExternas(campoSelecionadoLote, valorEdicaoMassa.trim()); // -> Envia as duas etapas (Coluna Alvo + Nova Informação) para gravação assíncrona.
      setCampoSelecionadoLote(""); // -> Limpa a caixa da Etapa 1 na memória RAM.
      setValorEdicaoMassa(""); // -> Limpa o input da Etapa 2 na memória RAM.
    }
  };

  // -> MONITOR DE ALTERAÇÃO DE SELETOR DE CADASTRO COLETIVO
  const lidarComMudarCampoMassaCadastros = (novoCampo) => { // -> Evita o cruzamento de metadados antigos ao mudar o foco do select.
    setCampoSelecionadoLote(novoCampo); // -> Seta a nova propriedade.
    setValorEdicaoMassa(""); // -> Zera a Etapa 2 imediatamente para reconfigurar os inputs na tela.
  };

  // RE-HOMOLOGAÇÃO DA FUNÇÃO TRATAR CADASTRO EMPRESA
  const tratarCadastroEmpresa = (e) => { // -> Garante a existência física del token de escopo na memória da tabela.
    e.preventDefault(); // -> Bloqueia o recarga cega de páginas retendo a RAM.
    if (!empCodigo.trim() || !empNome.trim() || !empCnpj.trim()) { // -> Valida chaves mandatórias.
      alert("⚠️ CAMPOS OBRIGATÓRIOS:\n\nPor favor, preencha o Código da Conta, a Razão Social e o CNPJ do assistido."); // -> Alerta técnico.
      return; // -> Trava a descida.
    }
    if (empresaEmEdicaoId) { // -> Trata fluxo de modificação.
      const baseModificada = empresas.map((emp) => {
        if (emp.id === empresaEmEdicaoId) {
          return { ...emp, codigo: empCodigo, cliente: empNome.toUpperCase(), cnpj: empCnpj, tipo: empIsFilial ? "Filial" : "Matriz", segmento: empSegmento || "Não Definido", endereco: empEndereco || "Não informado", cep: empCep || "00000-000" };
        } return emp;
      });
      if (aoAtualizarEmpresasExternas) aoAtualizarEmpresasExternas(baseModificada);
    } else { // -> Trata fluxo de inclusão nova de raiz.
      const novaEmpresa = { id: Date.now().toString(), codigo: empCodigo, cliente: empNome.toUpperCase(), cnpj: empCnpj, tipo: empIsFilial ? "Filial" : "Matriz", segmento: empSegmento || "Não Definido", endereco: empEndereco || "Não informado", cep: empCep || "00000-000" };
      if (aoAtualizarEmpresasExternas) aoAtualizarEmpresasExternas([...empresas, novaEmpresa]);
    }
    setModalEmpresaAberto(false); setEmpresaEmEdicaoId(null);
    setEmpCodigo(""); setEmpNome(""); setEmpCnpj(""); setEmpIsFilial(false); setEmpSegmento(""); setEmpEndereco(""); setEmpCep("");
  };

  // RE-SOLDA COMPLETA DO GRAVADOR ASSÍNCRONO DE CONTATOS DO FIRESTORE
  const tratarCadastroContato = async (e) => { // -> Conecta o salvamento e a alteração parcial síncrona diretamente ao banco da Google.
    e.preventDefault(); // -> Bloqueia o recarregamento del navegador para proteger os inputs armazenados na memória RAM.
    if (!conNome.trim() || !conCpf.trim() || !conTelefone.trim() || !conEmpresaId) { // -> Validação de preenchimento rígido obrigatório.
      alert("⚠️ CAMPOS OBRIGATÓRIOS:\n\nÉ obrigatório preencher o Nome Completo, CPF, Telefone e selecionar uma Empresa-Pai."); // -> Emite o aviso.
      return; // -> Suspende a execução da função imediatamente.
    }
    if (conEmail && !conEmail.includes("@")) { // -> Checa se a caixa de correio eletrônico contém o caractere de domínio comercial.
      alert("⚠️ VALIDAÇÃO DE CADASTRO:\n\nO e-mail digitado é inválido. Insira um domínio válido com '@'."); // -> Avisa o operador.
      return; // -> Aborta a descida.
    }
    if (conTelefone.replace(/\D/g, "").length < 10) { // -> Executa a higienização de strings limpando caracteres e letras.
      alert("⚠️ CONFIGURAÇÃO FISCAL:\n\nO telefone precisa conter entre 10 e 11 dígitos numéricos válidos com o DDD."); // -> Avisa o operador.
      return; // -> Aborta a descida.
    }

    const pacoteContatoNoSQL = { // -> Prepara o mapa limpo e higienizado para arremessar na nuvem do Firestore.
      nome: conNome.trim(), // -> Nome do representante.
      cpf: conCpf.trim(), // -> Documento CPF.
      telefone: conTelefone.trim(), // -> Linha telefônica.
      email: conEmail.trim() || "Não informado", // -> E-mail ou contingência.
      tipoVinculo: conTipo, // -> Papel associativo (Ex: Sócio, Advogado).
      empresaId: conEmpresaId // -> ID relacional da empresa-pai.
    };

    try {
      if (contatoEmEdicaoId) { // -> Caso possua uma ID em rascunho de foco, dispara a modificação parcial do nó existente.
        const docRef = doc(db, "cadastros_contatos", contatoEmEdicaoId); // -> Endereço fixo do registro.
        await updateDoc(docRef, { ...pacoteContatoNoSQL }); // -> Executa o updateDoc cirúrgico na nuvem.
        alert("👤 RE-HOMOLOGADO!\nOs dados do representante foram atualizados na nuvem."); // -> Feedback visual.
      } else { // -> Caso contrário, processa o empilhamento de um novo documento inédito de raiz.
        const colecaoRef = collection(db, "cadastros_contatos"); // -> Mira na coleção mestre.
        await addDoc(colecaoRef, pacoteContatoNoSQL); // -> Cria a nova ID NoSQL e salva.
        alert(`👤 CONTATO HOMOLOGADO!\n"${conNome.trim()}" foi associado com sucesso.`); // -> Alerta de sucesso.
      }
      setModalContatoAberto(false); // -> Encerra visualmente o modal de inserções.
      setContatoEmEdicaoId(null); // -> Zera a memória de rascunhos.
      setConNome(""); setConCpf(""); setConTelefone(""); setConEmail(""); setConTipo("responsavel"); setConEmpresaId(""); // -> Limpa as 6 gavetas de inputs locais.
    } catch (err) {
      alert("Falha crítica de barramento ao persistir contato no Firebase!"); // -> Escudo antiqueda.
    }
  };

  // BARREIRAS DE FILTRAGEM EXPANDIDAS: Varrem e batem simultaneamente todas as colunas físicas dos cabeçalhos.
  // 🧼 HIGIENIZAÇÃO CONCLUÍDA: Removidos com sucesso os dois caracteres Unicode '\u200B' invisíveis que estavam quebrando a compilação HMR do Vite e gerando Erro 500 no console.
  const empresasFiltradas = empresas.filter((emp) => { // -> FILTRO DE EMPRESAS: Varre a planilha de Pessoas Jurídicas.
    const bateCodigo = emp.codigo ? emp.codigo.toLowerCase().includes(filtrosEmpresa.codigo.toLowerCase()) : false; // -> Testa com segurança o Código Conta.
    const bateCliente = emp.cliente ? emp.cliente.toLowerCase().includes(filtrosEmpresa.cliente.toLowerCase()) : false; // -> Testa com segurança a Razão Social.
    const bateCnpj = emp.cnpj ? emp.cnpj.toLowerCase().includes(filtrosEmpresa.cnpj.toLowerCase()) : false; // -> Testa com segurança a numeração de CNPJ.
    const bateTipo = filtrosEmpresa.tipo === "todos" || emp.tipo === filtrosEmpresa.tipo; // -> Separa Matriz de Filial.
    const bateSegmento = !filtrosEmpresa.segmento || (emp.segmento && emp.segmento.toLowerCase().includes(filtrosEmpresa.segmento.toLowerCase())); // -> NOVO FILTRO ATIVO: Confere reativamente a coluna de Segmentos della tabela.
    const bateEndereco = !filtrosEmpresa.endereco || (emp.endereco && emp.endereco.toLowerCase().includes(filtrosEmpresa.endereco.toLowerCase())) || (emp.cep && emp.cep.includes(filtrosEmpresa.endereco)); // -> NOVO FILTRO ATIVO: Confere reativamente a praça ou numeração postal do CEP.
    return bateCodigo && bateCliente && bateCnpj && bateTipo && bateSegmento && bateEndereco; // -> Retorna verdadeiro se passar em todos os testes simultâneos de colunas.
  });

  const contatosFiltrados = contatos.filter((con) => { // -> FILTRO DE CONTATOS: Varre a planilha de Pessoas Humanas.
    const bateNome = con.nome ? con.nome.toLowerCase().includes(filtrosContato.nome.toLowerCase()) : false; // -> Testa com segurança o Nome do Representante.
    const bateCpf = con.cpf ? con.cpf.toLowerCase().includes(filtrosContato.cpf.toLowerCase()) : false; // -> Testa com segurança a numeração de CPF.
    const bateTipo = filtrosContato.tipoVinculo === "todos" || con.tipoVinculo === filtrosContato.tipoVinculo; // -> Isola a categoria do vínculo.
    const bateTelefone = !filtrosContato.telefone || (con.telefone && con.telefone.includes(filtrosContato.telefone)); // -> NOVO FILTRO ATIVO: Confere os algarismos gravados na coluna de Telefone.
    const bateEmail = !filtrosContato.email || (con.email && con.email.toLowerCase().includes(filtrosContato.email.toLowerCase())); // -> NOVO FILTRO ATIVO: Confere o domínio institucional gravado na coluna de Correio Eletrônico.
    return bateNome && bateCpf && bateTipo && bateTelefone && bateEmail; // -> Retorna verdadeiro se for compatível com a busca combinada em tempo real.
  });

  // APLICAÇÃO DA ORDENAÇÃO DINÂMICA ANTES DA RENDERIZAÇÃO FINAL
  const empresasOrdenadasVisor = poolOrdenacaoArray(empresasFiltradas, campoOrdenado, direcaoOrdenacao); // -> Transpassa o lote de Pessoas Jurídicas pelo classificador do cabeçalho.
  const contatosOrdenadosVisor = poolOrdenacaoArray(contatosFiltrados, campoOrdenado, direcaoOrdenacao); // -> Transpassa o lote de representantes humanos pelo classificador del cabeçalho.

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "24px auto", padding: "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
      
      {/* 🧭 CABEÇALHO DO MÓDULO E CONTROLES DE RETORNO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Settings size={22} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Injeta o componente vetorial de engrenagem do Lucide. */}
          <div>
            <h2 style={{ color: "#0f172a", fontSize: "16px", fontWeight: "800", margin: 0, letterSpacing: "0.5px", textTransform: "uppercase" }}>Central de Parametrização de Clientes</h2> {/* -> Título limpo e formalizado por extenso em caixa alta. */}
            <p style={{ color: "#64748b", fontSize: "12px", margin: "4px 0 0 0" }}>Gerencie os dados institucionais sóbrios de assistidos e representantes jurídicos.</p>
          </div>
        </div>
        
        {/* BOTÕES DE CONTROLE SUPERIOR DIREITO REFORMULADOS CONTEXTUAIS OU CIRCUITO DE AÇÕES EM LOTE */}
        {visaoPainel !== "hub" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {contagemSelecionados > 0 ? (
              // 🧺 CIRCUITO DE LOTE ATIVO PREMIUM EM CADASTROS: Renderiza as ações em massa avançadas inline de duas etapas.
              <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff1f2", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fecdd3", height: "34px", boxSizing: "border-box" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{contagemSelecionados} Marcados</span>
                
                {/* 🛠️ ETAPA 1: SELETOR DE COLUNA ALVO EM CADASTROS */}
                <select
                  value={campoSelecionadoLote}
                  onChange={(e) => lidarComMudarCampoMassaCadastros(e.target.value)}
                  style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
                >
                  <option value="">-- Campo para Editar --</option>
                  {visaoPainel === "empresas" && (
                    <>
                      <option value="segmento">SEGMENTO DE MERCADO</option>
                      <option value="tipo">TIPO (MATRIZ / FILIAL)</option>
                    </>
                  )}
                  {visaoPainel === "contatos" && (
                    <>
                      <option value="tipoVinculo">VÍNCULO JURÍDICO / PAPEL</option>
                      <option value="empresaId">CLIENTE ASSOCIAÇÃO (EMPRESA)</option>
                    </>
                  )}
                </select>

                {/* 🛠️ ETAPA 2: INPUT REATIVO DINÂMICO CONTEXTUALIZADO */}
                {campoSelecionadoLote === "tipo" && (
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

                {campoSelecionadoLote === "tipoVinculo" && (
                  <select
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
                  >
                    <option value="">-- Selecione o Papel --</option>
                    {vinculosBase.map(vin => (
                      <option key={vin.id} value={vin.label}>{vin.label.toUpperCase()}</option>
                    ))}
                  </select>
                )}

                {campoSelecionadoLote === "empresaId" && (
                  <select
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#2563eb", backgroundColor: "#ffffff", cursor: "pointer", outline: "none", maxWidth: "180px" }}
                  >
                    <option value="">-- Selecione a Empresa-Pai --</option>
                    {empresas.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.cliente.toUpperCase()}</option>
                    ))}
                  </select>
                )}

                {campoSelecionadoLote === "segmento" && (
                  <input
                    type="text"
                    value={valorEdicaoMassa}
                    onChange={(e) => setValorEdicaoMassa(e.target.value)}
                    placeholder="Digitar novo segmento..."
                    style={{ padding: "2px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", color: "#0f172a", backgroundColor: "#ffffff", outline: "none", width: "150px", height: "20px" }}
                  />
                )}

                {campoSelecionadoLote && (
                  <button
                    type="button"
                    onClick={lidarComAplicarEdicaoLoteCadastros}
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", height: "20px", display: "flex", alignItems: "center" }}
                  >
                    Aplicar
                  </button>
                )}

                <div style={{ width: "1px", height: "16px", backgroundColor: "#fda4af" }}></div>

                <button
                  type="button"
                  onClick={() => aoExecutarExclusaoEmMassaExternas(visaoPainel === "empresas" ? "cadastros_empresas" : "cadastros_contatos")}
                  style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ef4444", border: "none", color: "white", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b91c1c"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
                >
                  <Trash2 size={11} strokeWidth={2.5} />
                  <span>Excluir</span>
                </button>
              </div>
            ) : (
              // 🧭 CIRCUITO COMUM DE BOTÕES: Renderiza as ações administrativas nativas se não houver flegagem.
              <>
                {(visaoPainel === "empresas" || visaoPainel === "contatos") && (
                  <button 
                    type="button" 
                    onClick={exportarParaExcel} 
                    title="Exportar dados visíveis para planilha Excel" 
                    style={{ background: "#ffffff", color: "#16a34a", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                  >
                    <FileSpreadsheet size={14} strokeWidth={2.5} />
                    <span>Exportar .XLSX</span>
                  </button>
                )}
                {(visaoPainel === "empresas" || visaoPainel === "contatos") && (
                  <button 
                    type="button" 
                    onClick={() => setGavetaFiltrosAberta(true)} 
                    style={{ background: "#ffffff", color: "#475569", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                  >
                    <Filter size={14} strokeWidth={2.5} />
                    <span>Filtrar Tabela</span>
                  </button>
                )}
                {visaoPainel === "empresas" && (
                  <button 
                    type="button" 
                    onClick={() => { setEmpresaEmEdicaoId(null); setModalEmpresaAberto(true); }} 
                    style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>Novo Assistido</span>
                  </button>
                )}
                {visaoPainel === "contatos" && (
                  <button 
                    type="button" 
                    onClick={() => { setContatoEmEdicaoId(null); setModalContatoAberto(true); }} 
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
              onClick={() => { setVisaoPainel("hub"); setCampoOrdenado(""); }} 
              style={{ background: "#475569", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "background 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#334155"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#475569"}
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Voltar ao Painel</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================================
          🏛️ LAYOUT LEVEL 1: HUB RECONFIGURADO - GRADE EXPANDIDA PARA 5 CARTÕES SIMÉTRICOS E ELEGANTES
          ========================================================================================= */}
      {visaoPainel === "hub" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginTop: "8px" }}>
          
          {/* CARD BONITO 1: Base de Assistidos */}
          <div onClick={() => setVisaoPainel("empresas")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Building2 size={24} strokeWidth={2} />
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Base de Assistidos (Empresas)</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie Razão Social, CNPJs obrigatórios, endereços de citações e status de matriz/filial.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Total Cadastrado: {empresas.length}</span>
          </div>

          {/* CARD BONITO 2: Representantes Financeiros */}
          <div onClick={() => setVisaoPainel("contatos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <User size={24} strokeWidth={2} />
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Representantes Financeiros (Contatos)</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie a fiação humana relacional, CPFs obrigatórios, telefones com DDD e e-mails com @.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Total Cadastrado: {contatos.length}</span>
          </div>

          {/* CARD BONITO 3: Segmentos de Mercado */}
          <div onClick={() => setVisaoPainel("segmentos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Tag size={24} strokeWidth={2} />
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Segmentos de Mercado</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice os nichos de atuação comercial de devedores (Ex: Logística, Varejo) em coleção separada.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Setores Ativos: {segmentosBase.length}</span>
          </div>

          {/* CARD BONITO 4: Tipos de Elos e Vínculos */}
          <div onClick={() => setVisaoPainel("vinculos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Link2 size={24} strokeWidth={2} />
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Tipos de Elos e Vínculos</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice as categorias jurídicas de representation humana (Ex: Preposto, Sócio) em coleção separada.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Categorias: {vinculosBase.length}</span>
          </div>

          {/* CARD BONITO 5: Central de Gerenciamento do Funil NoSQL Parametrizável */}
          <div onClick={() => setVisaoPainel("funil")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
            <div>
              <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <Columns3 size={24} strokeWidth={2} />
              </div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Gerenciamento do Funil (CRM)</h3>
              <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Adicione, renomeie ou remova colunas vivas do Kanban ligando-as à máquina de estados Core.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Etapas do Banco: {etapasFunilBase.length}</span>
          </div>

        </div>
      )}

      {/* =========================================================================================
          📋 LAYOUT LEVEL 2: RENDERIZAÇÃO DAS PLANILHAS EXECUTIVAS MODULARIZADAS COM GATILHOS ATIVOS UNIFICADOS
          ========================================================================================= */}
      {visaoPainel === "empresas" && <TabelaEmpresas empresasFiltradas={empresasOrdenadasVisor} aoEditarEmpresa={prepararEdicaoEmpresa} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} itensSelecionadosExternos={itensSelecionadosExternos} setItensSelecionadosExternos={setItensSelecionadosExternos} />} 
      {visaoPainel === "contatos" && <TabelaContatos contatosFiltrados={contatosOrdenadosVisor} empresas={empresas} aoEditarContato={prepararEdicaoContato} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} itensSelecionadosExternos={itensSelecionadosExternos} setItensSelecionadosExternos={setItensSelecionadosExternos} />} 

      {/* =========================================================================================
          ⚙️ RENDERIZAÇÃO INTERNA: NOVA TABELA COMPACTA PARA GERENCIAR A COLEÇÃO DE SEGMENTOS
          ========================================================================================= */}
      {visaoPainel === "segmentos" && (
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
            <Tag size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} />
            <span>Cadastro de Segmentos Independentes</span>
          </h3>
          <form onSubmit={lidarAdicionarSegmento} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}>
            <input type="text" placeholder="Digitar novo setor (Ex: Tecnologia)..." value={novoSegmentoTexto} onChange={(e) => setNovoSegmentoTexto(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", background: "#f8fafc" }} />
            <button type="submit" style={{ display: "flex", alignItems: "center", gap: "4px", background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>
              <Plus size={14} strokeWidth={2.5} />
              <span>Inserir</span>
            </button>
          </form>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
                <th style={{ padding: "8px 12px" }}>NOME DO NICHO / SETOR ATIVO</th>
                <th style={{ padding: "8px 12px", textAlign: "center", width: "60px" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {!segmentosBase || segmentosBase.length === 0 ? (
                <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>Nenhum segmento parametrizado na base.</td></tr>
              ) : (
                segmentosBase.map((seg) => (
                  <tr key={seg.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>
                    <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Building2 size={13} strokeWidth={2} style={{ color: "#64748b" }} />
                        <span>{seg.nome}</span>
                      </div>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <button type="button" onClick={() => lidarDeletarSegmento(seg.id, seg.nome)} title="Excluir este segmento permanentemente" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                        <Trash2 size={14} strokeWidth={2} />
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
      {visaoPainel === "vinculos" && (
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
            <Link2 size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} />
            <span>Cadastro de Tipos de Vínculos Civis</span>
          </h3>
          <form onSubmit={lidarAdicionarVinculo} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}>
            <input type="text" placeholder="Digitar novo elo (Ex: Gerente Geral)..." value={novoVinculoTexto} onChange={(e) => setNovoVinculoTexto(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", background: "#f8fafc" }} />
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
              {vinculosBase.length === 0 ? (
                <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>Nenhuma categoria parametrizada na base.</td></tr>
              ) : (
                vinculosBase.map((vin) => (
                  <tr key={vin.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>
                    <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={13} strokeWidth={2} style={{ color: "#64748b" }} />
                        <span>{vin.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <button type="button" onClick={() => lidarDeletarVinculo(vin.id, vin.label)} title="Excluir este vínculo permanentemente" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                        <Trash2 size={14} strokeWidth={2} />
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
      {visaoPainel === "funil" && (
        <ModuloFunil /> // -> Desenha a planilha executiva de criação assíncrona de colunas do cofre da Google.
      )}

      {/* =========================================================================================
          ➕ LAYOUT LEVEL 3: CHAMADA CIRÚRGICA DOS MODAIS ISOLADOS E GAVETA DE FILTROS (TOTALMENTE SANADOS)
          ========================================================================================= */}
      <ModalNovaEmpresa aberto={modalEmpresaAberto} aoFechar={() => { setModalEmpresaAberto(false); setEmpresaEmEdicaoId(null); }} tratarCadastroEmpresa={tratarCadastroEmpresa} empCodigo={empCodigo} setEmpCodigo={setEmpCodigo} empNome={empNome} setEmpNome={setEmpNome} empCnpj={empCnpj} setEmpCnpj={setEmpCnpj} empIsFilial={empIsFilial} setEmpIsFilial={setEmpIsFilial} empSegmento={empSegmento} setEmpSegmento={setEmpSegmento} empEndereco={empEndereco} setEmpEndereco={setEmpEndereco} empCep={empCep} setEmpCep={setEmpCep} listaSegmentos={segmentosBase} /> 
      <ModalNovoContato aberto={modalContatoAberto} aoFechar={() => { setModalContatoAberto(false); setContatoEmEdicaoId(null); }} tratarCadastroContato={tratarCadastroContato} empresas={empresas} conEmpresaId={conEmpresaId} setConEmpresaId={setConEmpresaId} conNome={conNome} setConNome={setConNome} conCpf={conCpf} setConCpf={setConCpf} conTelefone={conTelefone} setConTelefone={setConTelefone} conEmail={conEmail} setConEmail={setConEmail} conTipo={conTipo} setConTipo={setConTipo} listaVinculos={vinculosBase} /> 
      <GavetaFiltrosCadastro aberto={gavetaFiltrosAberta} aoFechar={() => setGavetaFiltrosAberta(false)} visaoPainel={visaoPainel} filtrosEmpresa={filtrosEmpresa} setFiltrosEmpresa={setFiltrosEmpresa} filtrosContato={filtrosContato} setFiltrosContato={setFiltrosContato} /> 

    </div>
  );
}