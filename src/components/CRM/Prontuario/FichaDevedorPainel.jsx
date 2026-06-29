import React, { useState, useEffect } from "react"; // -> Traz a biblioteca mestre do React e os ganchos useState e useEffect para gerenciar estados locais e buscas síncronas.
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore"; // -> Puxa os métodos de escuta relacional em tempo real e filtros avançados do ecossistema Google Firebase, incluindo os comandos de gravação direta.
import { db } from "../../../config/firebase"; // -> Conecta o barramento central de credenciais do banco NoSQL ativo do CRM DOCULOC.

// -> IMPORTAÇÃO DAS TRÊS PEÇAS DE LEGO ESPECIALISTAS TOTALMENTE COMPONENTIZADAS
import FichaDevedorCard from "./FichaDevedorCard"; // -> Conecta o componente filho que cuida estritamente dos dados cadastrais e financeiros do devedor.
import AgendaContatos from "./AgendaContatos"; // -> Conecta o componente filho que cuida da esteira relacional de múltiplos representantes.
import TabelaNotasFiscais from "./TabelaNotasFiscais"; // -> Conecta o componente filho que cuida da planilha por porcentagem e do sub-modal de faturamento.

export default function FichaDevedorPainel({ card, colunaId, categoriaBloqueada, aoSalvarLocal, aoAlternarArquivamentoNoModal, aoExcluirCardNoModal, exibirArquivados }) { // -> Declara o componente da ala esquerda recebendo as propriedades estruturais do Hub pai.
  
  // -> 1. GAVETAS DE MEMÓRIA RAM LOCAIS (ESTADOS REATIVOS PRINCIPAIS)
  const [dadosEmpresaFirebase, setDadosEmpresaFirebase] = useState(null); // -> Cofre local para guardar os dados ricos (CNPJ, Tipo, Cidade) vindos da coleção de empresas.
  const [listaContatosFirebase, setListaContatosFirebase] = useState([]); // -> Fila local para agrupar todos os contatos humanos vinculados a esta PJ na nuvem.
  const [filtroPesquisa, setFiltroPesquisa] = useState(""); // -> Monitora caractere por caractere o texto digitado na nova barra de pesquisa da tabela.

  // -> 2. ESTADOS LOCAIS PARA O SUB-MODAL FLUTUANTE DE LANÇAMENTO E EDIÇÃO DE NOTAS FISCAIS
  const [subModalNfAberto, setSubModalNfAberto] = useState(false); // -> Controla se a janelinha flutuante de inserção ou edição de Notas Fiscais fica aberta ou fechada.
  const [modoSubModal, setModoSubModal] = useState("adicionar"); // -> CHAVE DE REGIME: Define se o formulário do sub-modal serve para adicionar um novo título ou editar um existente.
  const [indexNotaSendoEditada, setIndexNotaSendoEditada] = useState(null); // -> PONTEIRO DE SELEÇÃO: Guarda o índice exato do array que o operador está alterando.

  // -> 3. ESTADOS DOS INPUTS DO FORMULÁRIO INTERNO DO SUB-MODAL DE NOTAS FISCAIS
  const [nfDocumento, setNfDocumento] = useState(""); // -> Monitora o campo do número do contrato digitado pelo operador.
  const [nfReferencia, setNfReferencia] = useState(""); // -> Monitora o número de referência da Nota Fiscal preenchido.
  const [nfAtribuicao, setNfAtribuicao] = useState(""); // -> Monitora a natureza comercial ou tipo de venda do título.
  const [nfDataDoc, setNfDataDoc] = useState(""); // -> Monitora a data de emissão fiscal selecionada no calendário.
  const [nfVencimento, setNfVencimento] = useState(""); // -> Monitora a data de vencimento líquido limite do título.
  const [nfValor, setNfValor] = useState(""); // -> Monitora o valor financeiro nominal preenchido para a Nota Fiscal.
  const [nfVendedor, setNfVendedor] = useState(""); // -> Monitora o nome do executivo de vendas responsável por fechar o contrato.

  // -> 4. ESTADO DE SELEÇÃO EM MASSA (MECÂNICA CLICKUP PARA EXCLUSÃO DE NFs COM FLAG)
  const [notasSelecionadas, setNotasSelecionadas] = useState({}); // -> Guarda um mapa de chaves booleanas (true/false) para rastrear quais linhas receberam o visto do operador.

  // =========================================================================================
  // ⚡ GATILHO REATIVO 1: RECALIBRADO PARA FILTRAR O CNPJ TEXTUAL SEM DEPENDER DA ID HASH
  // =========================================================================================
  useEffect(() => { // -> Abre o efeito que escuta as atualizações da empresa de forma automática.
    const cnpjAlvo = card.cnpj ? String(card.cnpj).trim() : ""; // -> Isola o CNPJ limpo contido na raiz do card de cobrança ativa.
    if (!cnpjAlvo) return; // -> Aborta o circuito se o cartão vier sem documento para evitar processamentos em branco.

    const colecaoEmpresasRef = collection(db, "cadastros_empresas"); // -> Mira na coleção mestre de empresas informada no seu JSON.
    const consultaPorCnpj = query(colecaoEmpresasRef, where("cnpj", "==", cnpjAlvo)); // -> Monta o filtro reativo buscando o documento que possua o CNPJ correspondente.
    
    const cancelarEscutaCnpj = onSnapshot(consultaPorCnpj, (snapshot) => { // -> Conecta o sensor de escuta em tempo real no banco.
      if (!snapshot.empty) { // -> Testa se localizou a empresa correspondente dentro do banco NoSQL.
        const docEmpresa = snapshot.docs[0]; // -> Captura a primeira empresa localizada na varredura.
        setDadosEmpresaFirebase({ idDocumento: docEmpresa.id, ...docEmpresa.data() }); // -> Injeta os dados ricos incluindo a Hash aleatória necessária para os contatos.
      } else { // -> Caso não ache o registro.
        setDadosEmpresaFirebase(null); // -> Reseta o estado local se a empresa não constar na coleção de cadastros.
      } // -> Encerra desvio condicional.
    }); // -> Encerra o ouvinte.

    return () => cancelarEscutaCnpj(); // -> Corta a fiação de escuta ao fechar a tela para preservar a máquina.
  }, [card.id, card.cnpj]); // -> Recarrega o circuito caso o operador mude de devedor.

  // =========================================================================================
  // ⚡ GATILHO REATIVO 2: BUSCA OS CONTATOS USANDO A ID HASH DESCOBERTA NO GATILHO 1
  // =========================================================================================
  useEffect(() => { // -> Abre o ouvinte secundário focado em capturar os representantes humanos.
    const empresaIdRealHash = dadosEmpresaFirebase?.idDocumento; // -> Captura a Hash aleatória descoberta em tempo real no sensor acima.
    if (!empresaIdRealHash) { // -> Se a hash mestre não estiver disponível ainda.
      setListaContatosFirebase([]); // -> Zera a agenda visual se a empresa mãe ainda não foi localizada.
      return; // -> Aborta e aguarda o carregamento.
    } // -> Fim do bloco de proteção.

    const colecaoContatosRef = collection(db, "cadastros_contatos"); // -> Aponta a fiação diretamente para a rota NoSQL de contatos humanos.
    const consultaFiltrada = query(colecaoContatosRef, where("empresaId", "==", empresaIdRealHash)); // -> Modifica o garimpo para filtrar usando a Hash relacional correta.
    
    const cancelarEscutaContatos = onSnapshot(consultaFiltrada, (snapshot) => { // -> Ativa a escuta viva com o servidor da nuvem.
      const listaTemporaria = []; // -> Fabrica o vetor temporário limpo.
      snapshot.forEach((documento) => { // -> Varre os contatos humanos localizados.
        listaTemporaria.push({ id: documento.id, ...documento.data() }); // -> Enfileira o contato localizado (como o Victor Faustino).
      }); // -> Fim do loop.
      setListaContatosFirebase(listaTemporaria); // -> Jorra os contatos telefônicos na tela reativamente sem atrasos.
    }); // -> Encerra o snapshot.

    return () => cancelarEscutaContatos(); // -> Corta a fiação de escuta ao encerrar o modal do prontuário.
  }, [dadosEmpresaFirebase?.idDocumento]); // -> Dispara o circuito assim que o gatilito 1 desvendar o ID Hash real do devedor.

  // =========================================================================================
  // 📊 MÓDULO DE RECONSTITUIÇÃO FINANCEIRA E CRUX EM MEMÓRIA RAM (EVITA REFERECE-ERRORS)
  // =========================================================================================
  const listaTitulosLocal = card.titulos && card.titulos.length > 0 // -> Checa se o devedor possui notas registradas.
    ? card.titulos // -> Se possuir, consome a esteira real NoSQL de faturas.
    : [ // -> Fallback de retaguarda antiqueda caso o devedor legado possua dados apenas na raiz:
        { // -> Inicializa o primeiro mapa simétrico de segurança.
          numDocumento: card.numDocumento || 0, // -> Puxa o contrato.
          referencia: card.referencia || "025070-A", // -> Puxa a NF mestre.
          atribuicao: card.atribuicao || "Não Especificada", // -> Puxa a atribuição.
          dataDocumento: card.dataDocumento || "2026-06-11", // -> Puxa a emissão.
          vencimentoLiquido: card.vencimentoLiquido || "2026-06-11", // -> Puxa o vencimento.
          valorNota: parseFloat(card.valorVencido) || 0, // -> Converte o preço em Double real.
          executivoVendas: card.executivoVendas || "Não Informado" // -> Puxa o vendedor.
        } // -> Encerra molde de fallback.
      ]; // -> Encerra o array unificado.

  const listaTitulosFiltrada = listaTitulosLocal.filter((titulo) => { // -> SOLUÇÃO DO CRASH: Inicializa a filtragem da lupa APÓS a criação estável de 'listaTitulosLocal'.
    if (!filtroPesquisa.trim()) return true; // -> Se a barra de buscas estiver vazia, concede passe livre para todas as faturas.
    const termo = filtroPesquisa.toLowerCase().trim(); // -> Converte o termo pesquisado para letras minúsculas limpas.
    return ( // -> Faz o cruzamento de caracteres com as colunas-chave na memória RAM.
      String(titulo.referencia).toLowerCase().includes(termo) || // -> Varre por Nota Fiscal.
      String(titulo.numDocumento).toLowerCase().includes(termo) || // -> Varre por número de Contrato.
      String(titulo.executivoVendas).toLowerCase().includes(termo) // -> Varre por nome do Vendedor da pasta.
    ); // -> Fim do retorno booleano.
  }); // -> Fim da filtragem da lupa.

  const valorOriginalDivida = listaTitulosLocal.reduce((acc, t) => acc + (parseFloat(t.valorNota) || 0), 0); // -> Soma reativamente o valor de todas as notas fiscais do lote para o topo.
  const cnpjExibido = dadosEmpresaFirebase?.cnpj || card.cnpj || "Não Cadastrado"; // -> Dá preferência para o CNPJ rico localizado na rota certa.
  const tipoInscricao = dadosEmpresaFirebase?.tipo || card.tipo || "Matriz"; // -> Resgata a tag real de Matriz ou Filial vinda do banco.
  
  const formatarCnpj = (cnpjBruto) => { // -> Transforma números secos no formato padrão nacional XX.XXX.XXX/XXXX-XX.
    const limpo = String(cnpjBruto).replace(/\D/g, ""); // -> Expulsa caracteres especiais salvando números puros.
    if (limpo.length !== 14) return cnpjBruto; // -> Aborta a máscara se o tamanho for irregular.
    return limpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"); // -> Monta os pontos e traços correspondentes.
  }; // -> Fim da máscara.

  const extrairCidadeEstado = () => { // -> Função isoladora de geolocalização de praças de cobrança.
    if (dadosEmpresaFirebase?.endereco) { // -> Se o endereço rico da receita federal existir.
      const trecho = String(dadosEmpresaFirebase.endereco); // -> Converte em string executiva.
      if (trecho.includes("(") && trecho.includes(")")) { // -> Checa se possui delimitadores de parênteses de comarca.
        return trecho.substring(trecho.lastIndexOf("(") + 1, trecho.lastIndexOf(")")); // -> Isola o trecho (CAMPINAS/SP) de forma inteligente.
      } // -> Fim do desvio.
    } // -> Fim da checagem.
    return `${card.cidade || "Campinas"} / ${card.uf || "SP"}`; // -> Linha de contingência caso venha zerado na nuvem.
  }; // -> Fim do extrator geográfico.
  const localidadeFormatada = extrairCidadeEstado(); // -> Armazena a string geográfica limpa.

  // =========================================================================================
  // ⚙️ GATILHOS DE CONTROLE OPERACIONAIS (HANDLERS NoSQL DIRETOS)
  // =========================================================================================
  const abrirAdicaoNotaFiscal = () => { // -> Aciona a inclusão manual de faturas.
    setModoSubModal("adicionar"); // -> Configura o sub-modal para o regime de inclusão limpa.
    setIndexNotaSendoEditada(null); // -> Zera ponteiros remanescentes.
    setNfDocumento(""); setNfReferencia(""); setNfAtribuicao(""); setNfDataDoc(""); setNfVencimento(""); setNfValor(""); setNfVendedor(""); // -> Limpa os buffers textuais.
    setSubModalNfAberto(true); // -> Acende o sub-modal flutuante.
  }; // -> Fim.

  const abrirEdicaoNotaFiscal = (tituloObjeto, index) => { // -> Aciona a alteração de faturas.
    if (categoriaBloqueada) return; // -> TRAVA DE SEGURANÇA JURÍDICA.
    setModoSubModal("editar"); // -> Vira a chave do sub-modal para o regime de alteração de dados.
    setIndexNotaSendoEditada(index); // -> Anota o índice da linha na RAM.
    setNfDocumento(tituloObjeto.numDocumento || ""); // -> Pré-preenche o input do contrato.
    setNfReferencia(tituloObjeto.referencia || ""); // -> Pré-preenche o input da NF.
    setNfAtribuicao(tituloObjeto.atribuicao || ""); // -> Pré-preenche o input da atribuição.
    setNfDataDoc(tituloObjeto.dataDocumento || ""); // -> Pré-preenche o input da emissão.
    setNfVencimento(tituloObjeto.vencimentoLiquido || ""); // -> Pré-preenche o input do vencimento.
    setNfValor(tituloObjeto.valorNota || ""); // -> Pré-preenche o input do preço.
    setNfVendedor(tituloObjeto.executivoVendas || ""); // -> Pré-preenche o input do vendedor.
    setSubModalNfAberto(true); // -> Abre a caixinha flutuante na tela.
  }; // -> Fim.

  const processarSalvarNotaFiscalSacola = async (e, fecharAoTerminar = false) => { // -> Salva ou altera faturas disparando comandos na nuvem.
    if (e) e.preventDefault(); // -> Bloqueia a recarga do navegador.
    if (categoriaBloqueada) return; // -> TRAVA DE SEGURANÇA JURÍDICA.

    if (!nfDocumento || !nfReferencia.trim() || !nfValor || !nfVencimento) { // -> Checa campos mandatórios.
      alert("⚠️ VALIDAÇÃO: Contrato, Nota Fiscal, Vencimento e Valor são rigidamente obrigatórios!"); // -> Avisa o operador.
      return; // -> Aborta.
    } // -> Fim.

    const notaEstruturada = { // -> Embala a NF no layout correto NoSQL.
      numDocumento: parseInt(nfDocumento) || 0, // -> Contrato.
      referencia: nfReferencia.trim().toUpperCase(), // -> NF em caixa alta.
      atribuicao: nfAtribuicao.trim() || "Não Especificada", // -> Atribuição.
      dataDocumento: nfDataDoc || "2026-06-11", // -> Emissão.
      vencimentoLiquido: nfVencimento, // -> Vencimento.
      valorNota: parseFloat(nfValor) || 0, // -> Preço real Double.
      executivoVendas: nfVendedor.trim() || "Não Informado" // -> Vendedor.
    }; // -> Fim.

    let listaNotasAtualizada = [...listaTitulosLocal]; // -> Clona a sacola mestre de RAM.

    if (modoSubModal === "editar" && indexNotaSendoEditada !== null) { // -> Regime Edição.
      listaNotasAtualizada[indexNotaSendoEditada] = notaEstruturada; // -> Substitui cirurgicamente a linha.
    } else { // -> Regime Inclusão.
      listaNotasAtualizada.push(notaEstruturada); // -> Dá o push de faturamento.
    } // -> Fim.

    const novaSomaBrutaAcumulada = listaNotasAtualizada.reduce((acc, n) => acc + n.valorNota, 0); // -> Recalcula somas de carteira.
    const primeiroTitulo = listaNotasAtualizada[0] || {}; // -> Captura cabeceira de de-para.
    const payloadCobrancaAtualizado = { // -> Junta os metadados cadastrais com o novo array.
      ...card, // -> Preserva históricos de nascimento do devedor.
      titulos: listaNotasAtualizada, // -> Injeta o array de NFs modificado.
      valorVencido: novaSomaBrutaAcumulada, // -> Atualiza saldo atrasado do topo.
      valor: novaSomaBrutaAcumulada, // -> Sincroniza top-counters do Kanban.
      proposta: { valorCobrado: novaSomaBrutaAcumulada, qtdParcelas: 1 }, // -> Nivela calculadora Price.
      numDocumento: primeiroTitulo.numDocumento || card.numDocumento || 0, // -> Ajuste de espelho.
      referencia: primeiroTitulo.referencia || card.referencia || "", // -> Ajuste de espelho.
      atribuicao: primeiroTitulo.atribuicao || card.atribuicao || "", // -> Ajuste de espelho.
      dataDocumento: primeiroTitulo.dataDocumento || card.dataDocumento || "", // -> Ajuste de emissão.
      vencimentoLiquido: primeiroTitulo.vencimentoLiquido || card.vencimentoLiquido || "", // -> Ajuste de vencimento.
      executivoVendas: primeiroTitulo.executivoVendas || card.executivoVendas || "" // -> Ajuste de vendedor.
    };

    try { // -> Dispara transação assíncrona contra a nuvem da Google.
      const devedorDocRef = doc(db, "cobrancas", card.id); // -> Endereço físico do card.
      await updateDoc(devedorDocRef, payloadCobrancaAtualizado); // -> Gravação direta de retaguarda síncrona.
      setNfDocumento(""); setNfReferencia(""); setNfAtribuicao(""); setNfDataDoc(""); setNfVencimento(""); setNfValor(""); setNfVendedor(""); // -> Reseta buffers locais.
      if (fecharAoTerminar || modoSubModal === "editar") { // -> Se clicou em concluir ou era alteração.
        setSubModalNfAberto(false); // -> Fecha cortina interna flutuante.
      } else { // -> Se clicou em salvar e seguir.
        alert("🟩 SUCESSO!\nTítulo lançado e gravado na nuvem. Insira a próxima Nota Fiscal."); // -> Retém o modal aberto e lança aviso de folha limpa.
      } // -> Fim.
    } catch (err) { alert("Erro de rede ao salvar faturas."); } // -> Proteção de barramento.
  }; // -> Fim.

  const CakeSelecExclusaoEmMassa = async () => { // -> Executa deleção de NFs em lote via visto booleano.
    if (categoriaBloqueada) return; // -> TRAVA DE SEGURANÇA JURÍDICA.
    const indexesParaRemover = Object.keys(notasSelecionadas).filter(idx => notasSelecionadas[idx]).map(Number); // -> Coleta flags true.
    if (indexesParaRemover.length === 0) { // -> Trava contra disparos zerados.
      alert("Atenção Operador: Marque os quadradinhos das flags na linha das NFs que deseja excluir de uma vez só."); // -> Notifica o usuário.
      return; // -> Aborta.
    } // -> Fim.

    if (indexesParaRemover.length === listaTitulosLocal.length) { // -> Proteção contra expurgos de sacola cheia.
      alert("⚠️ INTEGRALIDADE PROTEGIDA: A sacola não pode ficar 100% vazia. Se deseja banir a dívida inteira, use a lixeira principal do topo."); // -> Alerta a regra de faturamento.
      return; // -> Aborta.
    } // -> Fim.

    const confirmacao = confirm(`🚨 CONFIRMAÇÃO:\nDeseja apagar permanentemente as ${indexesParaRemover.length} Notas Fiscais marcadas com flag? O saldo será recalculado.`); // -> Pop-up nativo de barreira humana.
    if (!confirmacao) return; // -> Aborta se recusado.

    const listaNotasFiltrada = listaTitulosLocal.filter((_, idx) => !indexesParaRemover.includes(idx)); // -> Filtra tirando os marcados.
    const novaSomaBrutaAcumulada = listaNotasFiltrada.reduce((acc, n) => acc + n.valorNota, 0); // -> Recalcula somas centavais.
    const primeiroTitulo = listaNotasFiltrada[0] || {}; // -> Sincroniza espelhos de de-para.

    const payloadCobrancaAtualizado = { // -> Embala payload limpo das NFs descartadas.
      ...card,
      titulos: listaNotasFiltrada,
      valorVencido: novaSomaBrutaAcumulada,
      valor: novaSomaBrutaAcumulada,
      proposta: { valorCobrado: novaSomaBrutaAcumulada, qtdParcelas: 1 },
      numDocumento: primeiroTitulo.numDocumento || card.numDocumento || 0,
      referencia: primeiroTitulo.referencia || card.referencia || "",
      atribuicao: primeiroTitulo.atribuicao || card.atribuicao || "",
      dataDocumento: primeiroTitulo.dataDocumento || card.dataDocumento || "",
      vencimentoLiquido: primeiroTitulo.vencimentoLiquido || card.vencimentoLiquido || "",
      executivoVendas: primeiroTitulo.executivoVendas || card.executivoVendas || ""
    };

    try { // -> Grava o lote higienizado de faturas na nuvem.
      const devedorDocRef = doc(db, "cobrancas", card.id); // -> Rota física NoSQL.
      await updateDoc(devedorDocRef, payloadCobrancaAtualizado); // -> Dispara comando.
      setNotasSelecionadas({}); // -> Reseta quadradinhos em branco na RAM.
      alert("🟩 EXPURGO CONCLUÍDO!\nA(s) fatura(s) marcada(s) foram deletada(s) e o saldo recalculado."); // -> Feedback.
    } catch (err) { alert("Erro ao descartar títulos em lote."); } // -> Proteção de barramento.
  }; // -> Fim.

  const lidarMarcarTodasAsNotas = (e) => { // -> Checkbox mestre do cabeçalho de NFs.
    if (categoriaBloqueada) return; // -> Trava contra acertos.
    const marcado = e.target.checked; // -> Captura booleano do virada.
    const novoMapa = {}; // -> Balde temporário.
    if (marcado) { // -> Se flegado true.
      listaTitulosFiltrada.forEach((_, idx) => { novoMapa[idx] = true; }); // -> Crava vistos ativos em massa.
    } // -> Fim.
    setNotasSelecionadas(novoMapa); // -> Sincroniza na RAM.
  }; // -> Fim.

  const dispararWhatsAppLocal = (nome, fone) => { // -> Disparador de mensagens instantâneas.
    const foneLimpo = String(fone).replace(/\D/g, ""); // -> Limpa a string tirando parênteses e traços.
    const foneFormatado = foneLimpo.startsWith("55") ? foneLimpo : `55${foneLimpo}`; // -> Injeta o código do país DDI Brasil se faltar.
    const listaNFs = listaTitulosLocal.map(t => t.referencia).join(", "); // -> Tricota as referências de faturas separadas por vírgula.
    const textoWhats = `Olá, ${nome}! Extrato em aberto de R$ ${valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} da empresa ${card.cliente}. NFs: ${listaNFs}`; // -> Monta a comanda descritiva clara.
    window.open(`https://web.whatsapp.com/send?phone=${foneFormatado}&text=${encodeURIComponent(textoWhats)}`, "_blank"); // -> Abre o rádio do WhatsApp Web em nova aba.
  }; // -> Fim.

  const dispararEmailLocal = (emailDest, nome, provedor) => { // -> Disparador de e-mails corporativos.
    const listaNFs = listaTitulosLocal.map(t => t.referencia).join(", "); // -> Junta as NFs.
    const assunto = `Extrato de Débito Extrajudicial - Lote ${card.codigo}`; // -> Define o assunto padrão.
    const corpo = `Prezado(a) ${nome},\n\nPendência de R$ ${valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} vinculada às NFs: ${listaNFs} da empresa ${card.cliente}.`; // -> Corpo da mensagem.
    if (provedor === "gmail") window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailDest}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`, "_blank"); // -> Despacha via link de comando do Google Mail.
    else if (provedor === "outlook_web") window.open(`https://outlook.live.com/default.aspx?rru=compose&to=${emailDest}&subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`, "_blank"); // -> Fallback para Microsoft Outlook.
  }; // -> Fim.

  // =========================================================================================
  // 🧱 RETORNO DA INTERFACE DO COMPONENTE MAESTRO RE-LIGADO COM AS PEÇAS DE LEGO INDEPENDENTES
  // =========================================================================================
  return (
    <div style={{ padding: "20px", borderRight: "1px solid #e2e8f0", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", boxSizing: "border-box", width: "500px", minWidth: "500px", background: "#f8fafc" }}>
      
      {/* 🧾 INJEÇÃO COMPONENTE 1: FICHA CADASTRAL DA PJ ASSISTIDA */}
      <FichaDevedorCard 
        card={card} 
        cnpjExibido={cnpjExibido} 
        tipoInscricao={tipoInscricao} 
        localidadeFormatada={localidadeFormatada} 
        valorOriginalDivida={valorOriginalDivida} 
        formatarCnpj={formatarCnpj} 
      />

      {/* 📞 INJEÇÃO COMPONENTE 2: AGENDA DE CONTATOS DA GAVETA HUMANA NoSQL */}
      <AgendaContatos 
        listaContatosFirebase={listaContatosFirebase} 
        valorOriginalDivida={valorOriginalDivida} 
        card={card} 
        dispararWhatsAppLocal={dispararWhatsAppLocal} 
        dispararEmailLocal={dispararEmailLocal} 
      />

      {/* 🧳 INJEÇÃO COMPONENTE 3: PLANILHA DE NOTAS FISCAIS E CONTROLES DE SUB-MODAL */}
      <TabelaNotasFiscais 
        categoriaBloqueada={categoriaBloqueada} 
        listaTitulosFiltrada={listaTitulosFiltrada} 
        notasSelecionadas={notasSelecionadas} 
        setNotasSelecionadas={setNotasSelecionadas} 
        filtroPesquisa={filtroPesquisa} 
        setFiltroPesquisa={setFiltroPesquisa} 
        abrirAdicaoNotaFiscal={abrirAdicaoNotaFiscal} 
        abrirEdicaoNotaFiscal={abrirEdicaoNotaFiscal} 
        CakeSelecExclusaoEmMassa={CakeSelecExclusaoEmMassa} 
        lidarMarcarTodasAsNotas={lidarMarcarTodasAsNotas} 
        subModalNfAberto={subModalNfAberto} 
        setSubModalNfAberto={setSubModalNfAberto} 
        modoSubModal={modoSubModal} 
        processarSalvarNotaFiscalSacola={processarSalvarNotaFiscalSacola} 
        nfDocumento={nfDocumento} 
        setNfDocumento={setNfDocumento} 
        nfReferencia={nfReferencia} 
        setNfReferencia={setNfReferencia} 
        atribuicao={nfAtribuicao} 
        setNfAtribuicao={setNfAtribuicao} 
        nfDataDoc={nfDataDoc} 
        setNfDataDoc={setNfDataDoc} 
        nfVencimento={nfVencimento} 
        setNfVencimento={setNfVencimento} 
        nfValor={nfValor} 
        setNfValor={setNfValor} 
        nfVendedor={nfVendedor} 
        setNfVendedor={setNfVendedor} 
      />

    </div>
  );
}