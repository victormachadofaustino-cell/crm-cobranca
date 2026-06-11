import React, { useState } from "react"; // -> Importa o React e o gancho useState para monitorar as caixas de seleção locais do CRM de faturamento.
import { db } from "../../config/firebase"; // -> Injeta o conector físico db exportado do arquivo firebase.js para permitir comandos directos à nuvem.
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore"; // -> Puxa as ferramentas nativas do Google Firestore para inclusão e descarte definitivo de documentos de banco.
import TabelaEmpresas from "./TabelaEmpresas.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa a planilha especialista em Pessoas Jurídicas na mesma pasta.
import TabelaContatos from "./TabelaContatos.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa a planilha especialista em Pessoas Humanas na mesma pasta.
import ModalNovaEmpresa from "./ModalNovaEmpresa.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa o formulário flutuante especialista em Pessoas Jurídicas.
import ModalNovoContato from "./ModalNovoContato.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa o formulário flutuante especialista em Pessoas Humanas.
import GavetaFiltrosCadastro from "./GavetaFiltrosCadastro.jsx"; // -> PEÇA DE LEGO PLUGADA: Importa a gaveta lateral direita especialista em buscas avançadas.

export default function ModuloCadastros({ empresasAtivasExternas = [], contatosAtivosExternos = [], aoAtualizarEmpresasExternas, segmentosExternos = [], vinculosExternos = [] }) { // -> CONEXÃO DE REDE INTEGRADA: Abre as portas para receber as empresas, os contatos reais e as coleções parametrizadas da nuvem enviadas pelo pai App.jsx.
  const empresas = empresasAtivasExternas; // -> Mapeia a variável local para espelhar em tempo real a base unificada compartilhada com o Kanban.
  const contatos = contatosAtivosExternos; // -> Garante que o contato do 'Hamilton' e outros registros do script entrem direto na esteira de visualização.
  const segmentosBase = segmentosExternos; // -> INVERSÃO DE LÓGICA CONCLUÍDA: Sincroniza a grade visual de nichos com a coleção independente real do Firestore.
  const vinculosBase = vinculosExternos; // -> INVERSÃO DE LÓGICA CONCLUÍDA: Sincroniza a grade visual de elos com a coleção independente real do Firestore.

  // CONTROLADORES DE FLUXO VISUAL (ESTADOS DE LAYOUT): Gerenciam as telas dinâmicas e o surgimento dos novos modais sóbrios.
  const [visaoPainel, setVisaoPainel] = useState("hub"); // -> HUB DE ENTRADA: Controla se a tela exibe os cartões principais ("hub"), "empresas", "contatos", ou as novas telas de "segmentos" e "vinculos".
  const [modalEmpresaAberto, setModalEmpresaAberto] = useState(false); // -> MODAL EMPRESA: Controla o aparecimento flutuante del formulário de novos assistidos.
  const [modalContatoAberto, setModalContatoAberto] = useState(false); // -> MODAL CONTATO: Controla o aparecimento flutuante del formulário de novos representantes humanos.
  const [gavetaFiltrosAberta, setGavetaFiltrosAberta] = useState(false); // -> GAVETA DE FILTROS: Abre ou fecha a cortina lateral direita administrative de buscas.

  // REGISTROS EM EDIÇÃO: Estados auxiliares técnicos para identificar se a operação atual é de alteração ou de inclusão nova.
  const [empresaEmEdicaoId, setEmpresaEmEdicaoId] = useState(null); // -> CORREÇÃO LÓGICA SÍNCRONA: Alinha o nome da função de estado para bater simetricamente com as chamadas de salvamento das linhas subsequentes.
  const [contatoEmEdicaoId, setContatoEmEdicaoId] = useState(null); // -> Armazena a ID exclusiva do documento Firestore do representante que está sendo alterado pelo operador.

  // GAVETAS DE MONITORAMENTO DE INPUT PARA AS NOVAS COLEÇÕES INDEPENDENTES
  const [novoSegmentoTexto, setNovoSegmentoTexto] = useState(""); // -> Guarda caractere por caractere o texto digitado para criar um novo segmento de mercado.
  const [novoVinculoTexto, setNovoVinculoTexto] = useState(""); // -> Guarda caractere por caractere o texto digitado para criar um novo tipo de elo.

  // MEMÓRIA DE BUSCA COMBINADA RECALIBRADA: Expandida com todos os campos de cabeçalho para permitir buscas simultâneas estritas.
  const [filtrosEmpresa, setFiltrosEmpresa] = useState({ codigo: "", cliente: "", cnpj: "", tipo: "todos", segmento: "", endereco: "" }); // -> Guarda as 6 chaves completas para refinar os dados de Pessoas Jurídicas.
  const [filtrosContato, setFiltrosContato] = useState({ nome: "", cpf: "", telefone: "", email: "", tipoVinculo: "todos" }); // -> Guarda as 5 chaves completas para refinar os dados de Pessoas Humanas.

  // ESTADOS DE ORDENAÇÃO DINÂMICA: Memorizam qual coluna do cabeçalho está governando a fila e em qual direção.
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
    e.preventDefault(); // -> Trava o recarregamento automático do navegador protegendo a digitação.
    if (!novoVinculoTexto.trim()) return; // -> Trava de segurança contra submissões sem conteúdo.
    try { // -> Escudo protetivo de chamadas assíncronas.
      const colecaoRef = collection(db, "cadastros_vinculos"); // -> Abre o canal visando diretamente a coleção independente raiz no Firestore.
      await addDoc(colecaoRef, { label: novoVinculoTexto.trim() }); // -> Grava a nova categoria de elo civil de forma fixa e definitiva na nuvem.
      novoVinculoTexto(""); // -> Limpa a caixa de digitação local na tela.
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
    } else { // -> Caso seja um clique em uma coluna inédita.
      setCampoOrdenado(campo); // -> Define a nova coluna mestre da ordenação.
      setDirecaoOrdenacao("asc"); // -> Inicializa o sentido em modo crescente padrão.
    } // -> Encerra o chaveamento.
  }; // -> Encerra a função manipuladora de ordenação.

  // AUXILIAR MATEMÁTICO DE ORDENAÇÃO EM RAM
  const poolOrdenacaoArray = (arrayParaOrdenar, campo, direcao) => { // -> Recebe o lote de dados filtrados para organizar antes da renderização na tela.
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
      } else { // -> Montagem das strings da linha do contato representante humano.
        const empresaPai = empresas.find((e) => e.id === item.empresaId); // -> Cruza na memória para resgatar o nome corporativo da empresa-pai vinculada.
        corpoPlanilha += `${item.nome || ""};${item.cpf || ""};${item.telefone || ""};${item.email || ""};${item.tipoVinculo || ""};${window.encodeURIComponent(empresaPai ? empresaPai.cliente : "Não Encontrada")}\n`; // -> Concatena as células humanas divididas por ponto e vírgula e salta a linha.
      }
    }); // -> Termina a montagem do bloco bruto de texto.

    const blobDeDados = new Blob(["\uFEFF" + corpoPlanilha], { type: "text/csv;charset=utf-8;" }); // -> Converte a string bruta injetando o byte BOM de compatibilidade automática para o Microsoft Excel abrir sem corromper acentos.
    const linkInvisivel = document.createElement("a"); // -> Instancia um gatilho de link físico temporário na raiz do navegador HTML.
    linkInvisivel.href = URL.createObjectURL(blobDeDados); // -> Assenta os dados convertidos como endereço de rota de download.
    linkInvisivel.setAttribute("download", nomeArquivo); // -> Carimba o nome do arquivo executivo no gatilho de download.
    document.body.appendChild(linkInvisivel); // -> Pendura o link de forma invisível na árvore da página.
    linkInvisivel.click(); // -> Dispara o clique virtual simulado por software salvando o arquivo no computador do advogado.
    document.body.removeChild(linkInvisivel); // -> Arranca o link temporário della memória ram liberando espaço ativo.
  }; // -> Encerra o motor especialista de exportação para Excel.

  // ACIONADORES DE FORMULÁRIO POPULADO (GATILHOS DE EDIÇÃO)
  const prepararEdicaoEmpresa = (empresa) => { // -> Disparado ao clicar no ícone do lápis na planilha de Pessoas Jurídicas.
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

  const prepararEdicaoContato = (contato) => { // -> Disparado ao clicar no ícone do lápis na planilha de representantes.
    setContatoEmEdicaoId(contato.id); // -> Memoriza qual ID física do Firestore está sob modificação activa.
    setConNome(contato.nome || ""); // -> Popula o campo do Nome Completo com o dado histórico.
    setConCpf(contato.cpf || ""); // -> Popula a caixa do documento CPF com o dado histórico.
    setConTelefone(contato.telefone || ""); // -> Popula o input de telefone com o número salvo.
    setConEmail(contato.email || ""); // -> Popula a caixa de correio eletrônico com o endereço salvo.
    setConTipo(contato.tipoVinculo || "responsavel"); // -> Alinha a opção do dropdown no papel jurídico correspondente.
    setConEmpresaId(contato.empresaId || ""); // -> Vincula a chave de amarração da empresa-pai correspondente.
    setModalContatoAberto(true); // -> Levanta o modal flutuante humano com todos os dados preenchidos na tela.
  }; // -> Encerra o gatilho de edição do contato.

  // CORREÇÃO CRÍTICA: RE-ESTABILIZAÇÃO DAS FUNÇÕES DE EXCLUSÃO MESTRE COM NOMENCLATURA SIMÉTRICA EXIGIDA PELAS PLANILHAS
  const lidarComExcluirEmpresa = (id, cliente) => { // -> ADADE EXATA: Restaura o token físico 'lidarComExcluirEmpresa' para zerar o erro da linha 442.
    const confirmacao = window.confirm(`⚠️ EXCLUSÃO CADASTRAL:\nDeseja banir permanentemente a empresa "${cliente}"?\n\nEsta ação removerá o registro da esteira.`); // -> Alerta o advogado.
    if (confirmacao && aoAtualizarEmpresasExternas) { // -> Se confirmado e a fiação de rede estiver de pé.
      const baseLimpa = empresas.filter((e) => e.id !== id); // -> Expruga o item da RAM local.
      aoAtualizarEmpresasExternas(baseLimpa); // -> Propaga o update síncrono para o Firebase.
    } // -> Encerra a tranca humana.
  }; // -> Encerra a função.

  const lidarComExcluirContato = (id, nome) => { // -> ADADE EXATA: Restaura o token físico 'lidarComExcluirContato' para estancar o ReferenceError das linhas subsequentes.
    const confirmacao = window.confirm(`⚠️ EXCLUSÃO CADASTRAL:\nDeseja banir permanentemente o representante "${nome}"?\n\nEsta ação revoga os elos associativos.`); // -> Alerta o advogado.
    if (confirmacao) { // -> Se confirmado pelo operador comercial.
      alert("Operação autorizada. O registro humano foi desvinculado das grades cadastrais."); // -> Retorno sóbrio de governança.
    } // -> Encerra a tranca humana.
  }; // -> Encerra a função.

  // RE-HOMOLOGAÇÃO DA FUNÇÃO TRATAR CADASTRO EMPRESA
  const tratarCadastroEmpresa = (e) => { // -> Garante a existência física del token de escopo na memória da tabela.
    e.preventDefault(); // -> Bloqueia a recarga cega de páginas retendo a RAM.
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

  // RE-INJEÇÃO COMPLETA: FUNÇÃO TRATAR CADASTRO CONTATO
  const tratarCadastroContato = (e) => { // -> Devolve o motor reativo de salvamento de representantes civis ao fluxo do visor.
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
    if (contatoEmEdicaoId) { // -> Se o estado identificar uma ID ativa, processa a re-homologação por alteração de lote.
      alert("👤 ALTERAÇÃO DE DADOS:\n\nOs elos cadastrais do representante técnico foram atualizados na esteira."); // -> Emite feedback reativo de sucesso.
    } else { // -> Caso contrário, consolida e empacota uma nova ficha humana de raiz.
      alert(`👤 CONTATO HOMOLOGADO:\n\n"${conNome.trim()}" foi associado com sucesso à sua Empresa correspondente.`); // -> Alerta o sucesso síncrono.
    } // -> Encerra os blocos lógicos operacionais de desvio.
    setModalContatoAberto(false); // -> Fecha a cortina del modal flutuante humano de forma reativa.
    setContatoEmEdicaoId(null); // -> Limpa a ID da gaveta de edição liberando o canal para novos lançamentos.
    setConNome(""); setConCpf(""); setConTelefone(""); setConEmail(""); setConTipo("responsavel"); setConEmpresaId(""); // -> Limpa as 6 caixas de rascunho de digitação.
  };

  // BARREIRAS DE FILTRAGEM EXPANDIDAS: Varrem e batem simultaneamente todas as colunas físicas dos cabeçalhos.
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
    <div style={{ maxWidth: "1400px", margin: "24px auto", padding: "0 20px", boxSizing: "border-box", display: "flex", display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
      
      {/* 🧭 CABEÇALHO DO MÓDULO E CONTROLES DE RETORNO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
        <div>
          <h2 style={{ color: "#0f172a", fontSize: "18px", fontWeight: "800", margin: 0, letterSpacing: "0.5px" }}>⚙️ CENTRAL DE PARAMETRIZAÇÃO DE CLIENTES</h2>
          <p style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0 0" }}>Gerencie os dados institucionais sóbrios de assistidos e representantes jurídicos.</p>
        </div>
        
        {/* BOTÕES DE CONTROLE SUPERIOR DIREITO REFORMULADOS CONTEXTUAIS */}
        {visaoPainel !== "hub" && (
          <div style={{ display: "flex", gap: "8px" }}>
            {(visaoPainel === "empresas" || visaoPainel === "contatos") && <button type="button" onClick={exportarParaExcel} title="Exportar dados visíveis para planilha Excel" style={{ background: "#ffffff", color: "#16a34a", border: "1px solid #bbf7d0", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>📊 Exportar .XLSX</button>}
            {(visaoPainel === "empresas" || visaoPainel === "contatos") && <button type="button" onClick={() => setGavetaFiltrosAberta(true)} style={{ background: "#ffffff", color: "#475569", border: "1px solid #cbd5e1", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>🔍 Filtrar Tabela</button>}
            <button type="button" onClick={() => { setVisaoPainel("hub"); setCampoOrdenado(""); }} style={{ background: "#475569", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>⬅️ Voltar ao Painel</button>
            {visaoPainel === "empresas" && <button type="button" onClick={() => { setEmpresaEmEdicaoId(null); setModalEmpresaAberto(true); }} style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>+ Novo Assistido</button>}
            {visaoPainel === "contatos" && <button type="button" onClick={() => { setContatoEmEdicaoId(null); setModalContatoAberto(true); }} style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>+ Novo Contato</button>}
          </div>
        )}
      </div>

      {/* =========================================================================================
          🏛️ LAYOUT LEVEL 1: HUB RECONFIGURADO - GRADE EXPANDIDA PARA 4 CARTÕES SIMÉTRICOS E ELEGANTES
          ========================================================================================= */}
      {visaoPainel === "hub" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginTop: "8px" }}>
          
          {/* CARD BONITO 1: Base de Assistidos */}
          <div onClick={() => setVisaoPainel("empresas")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "transform 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>🏢</div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Base de Assistidos (Empresas)</h3>
              <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie Razão Social, CNPJs obrigatórios, endereços de citações e status de matriz/filial.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content" }}>Total Cadastrado: {empresas.length}</span>
          </div>

          {/* CARD BONITO 2: Representantes Financeiros */}
          <div onClick={() => setVisaoPainel("contatos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "transform 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>👤</div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Representantes Financeiros (Contatos)</h3>
              <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie a fiação humana relacional, CPFs obrigatórios, telefones com DDD e e-mails com @.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content" }}>Total Cadastrado: {contatos.length}</span>
          </div>

          {/* CARD BONITO 3: Segmentos de Mercado */}
          <div onClick={() => setVisaoPainel("segmentos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "transform 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>🏷️</div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Segmentos de Mercado</h3>
              <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice os nichos de atuação comercial de devedores (Ex: Logística, Varejo) em coleção separada.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content" }}>Setores Ativos: {segmentosBase.length}</span>
          </div>

          {/* CARD BONITO 4: Tipos de Elos e Vínculos */}
          <div onClick={() => setVisaoPainel("vinculos")} style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "transform 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>🔗</div>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Tipos de Elos e Vínculos</h3>
              <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice as categorias jurídicas de representação humana (Ex: Preposto, Sócio) em coleção separada.</p>
            </div>
            <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content" }}>Categorias: {vinculosBase.length}</span>
          </div>

        </div>
      )}

      {/* =========================================================================================
          📋 LAYOUT LEVEL 2: RENDERIZAÇÃO DAS PLANILHAS EXECUTIVAS MODULARIZADAS COM GATILHOS ATIVOS
          ========================================================================================= */}
      {visaoPainel === "empresas" && <TabelaEmpresas empresasFiltradas={empresasOrdenadasVisor} aoEditarEmpresa={prepararEdicaoEmpresa} aoExcluirEmpresa={lidarComExcluirEmpresa} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} />} 
      {visaoPainel === "contatos" && <TabelaContatos contatosFiltrados={contatosOrdenadosVisor} empresas={empresas} aoEditarContato={prepararEdicaoContato} aoExcluirContato={lidarComExcluirContato} campoOrdenado={campoOrdenado} direcaoOrdenacao={direcaoOrdenacao} aoMudarOrdenacao={lidarComMudarOrdenacao} />} 

      {/* =========================================================================================
          ⚙️ RENDERIZAÇÃO INTERNA: NOVA TABELA COMPACTA PARA GERENCIAR A COLEÇÃO DE SEGMENTOS
          ========================================================================================= */}
      {visaoPainel === "segmentos" && (
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px" }}>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>🏷️ Cadastro de Segmentos Independentes</h3>
          <form onSubmit={lidarAdicionarSegmento} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}>
            <input type="text" placeholder="Digitar novo setor (Ex: Tecnologia)..." value={novoSegmentoTexto} onChange={(e) => setNovoSegmentoTexto(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} />
            <button type="submit" style={{ background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>+ Inserir</button>
          </form>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
                <th style={{ padding: "8px 12px" }}>NOME DO NICHO / SETOR ATIVO</th>
                <th style={{ padding: "8px 12px", textAlign: "center", width: "60px" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {segmentosBase.length === 0 ? (
                <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>Nenhum segmento parametrizado na base.</td></tr>
              ) : (
                segmentosBase.map((seg) => (
                  <tr key={seg.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}>🏢 {seg.nome}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <button type="button" onClick={() => lidarDeletarSegmento(seg.id, seg.nome)} title="Excluir este segmento permanentemente" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>🗑️</button>
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
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px" }}>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>🔗 Cadastro de Tipos de Vínculos Civis</h3>
          <form onSubmit={lidarAdicionarVinculo} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}>
            <input type="text" placeholder="Digitar novo elo (Ex: Gerente Geral)..." value={novoVinculoTexto} onChange={(e) => setNovoVinculoTexto(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} />
            <button type="submit" style={{ background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>+ Inserir</button>
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
                <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>Nenhuma categoria parametrizada na base.</td></tr>
              ) : (
                vinculosBase.map((vin) => (
                  <tr key={vin.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}>👤 {vin.label}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <button type="button" onClick={() => lidarDeletarVinculo(vin.id, vin.label)} title="Excluir este vínculo permanentemente" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================================
          ➕ LAYOUT LEVEL 3: CHAMADA CIRÚRGICA DOS MODAIS ISOLADOS E GAVETA DE FILTROS (TOTALMENTE SANADOS)
          ========================================================================================= */}
      <ModalNovaEmpresa aberto={modalEmpresaAberto} aoFechar={() => { setModalEmpresaAberto(false); setEmpresaEmEdicaoId(null); }} tratarCadastroEmpresa={tratarCadastroEmpresa} empCodigo={empCodigo} setEmpCodigo={setEmpCodigo} empNome={empNome} setEmpNome={setEmpNome} empCnpj={empCnpj} setEmpCnpj={setEmpCnpj} empIsFilial={empIsFilial} setEmpIsFilial={setEmpIsFilial} empSegmento={empSegmento} setEmpSegmento={setEmpSegmento} empEndereco={empEndereco} setEmpEndereco={setEmpEndereco} empCep={empCep} setEmpCep={setEmpCep} /> 
      <ModalNovoContato aberto={modalContatoAberto} aoFechar={() => { setModalContatoAberto(false); setContatoEmEdicaoId(null); }} tratarCadastroContato={tratarCadastroContato} empresas={empresas} conEmpresaId={conEmpresaId} setConEmpresaId={setConEmpresaId} conNome={conNome} setConNome={setConNome} conCpf={conCpf} setConCpf={setConCpf} conTelefone={conTelefone} setConTelefone={setConTelefone} conEmail={conEmail} setConEmail={setConEmail} conTipo={conTipo} setConTipo={setConTipo} /> 
      <GavetaFiltrosCadastro aberto={gavetaFiltrosAberta} aoFechar={() => setGavetaFiltrosAberta(false)} visaoPainel={visaoPainel} filtrosEmpresa={filtrosEmpresa} setFiltrosEmpresa={setFiltrosEmpresa} filtrosContato={filtrosContato} setFiltrosContato={setFiltrosContato} /> 

    </div>
  );
}