import React, { useState, useEffect } from "react"; // -> Traz a biblioteca mestre do React e os ganchos useState e useEffect para gerenciar estados locais e buscas síncronas.
import { Activity, User, Phone, Mail, Link, Trash2, Send, Plus, X, Hash, ArchiveRestore, Archive, Copy, Check, Search } from "lucide-react"; // -> Injeta a coleção de ícones vetoriais do Lucide calibrada para as novas ferramentas visuais do prontuário.
import { collection, query, where, onSnapshot } from "firebase/firestore"; // -> Puxa os métodos de escuta relacional em tempo real e filtros avançados do ecossistema Google Firebase.
import { db } from "../../../config/firebase"; // -> Conecta o barramento central de credenciais do banco NoSQL ativo do CRM DOCULOC.

export default function FichaDevedorPainel({ card, colunaId, categoriaBloqueada, aoSalvarLocal, aoAlternarArquivamentoNoModal, aoExcluirCardNoModal, exibirArquivados }) { // -> Declara o componente da ala esquerda recebendo as propriedades estruturais do Hub pai.
  
  // -> ESTADOS LOCAIS PARA RESOLVER O SUMIÇO DOS DADOS (BUSCA RELACIONAL AUTOMÁTICA)
  const [dadosEmpresaFirebase, setDadosEmpresaFirebase] = useState(null); // -> Cofre local para guardar os dados ricos (CNPJ, Tipo, Cidade) vindos da coleção de empresas.
  const [listaContatosFirebase, setListaContatosFirebase] = useState([]); // -> Fila local para agrupar todos os contatos humanos vinculados a esta PJ na nuvem.

  // -> ESTADO DA LUPA DE BUSCA INTERNA DE NOTAS FISCAIS
  const [filtroPesquisa, setFiltroPesquisa] = useState(""); // -> Monitora caractere por caractere o texto digitado na nova barra de pesquisa da tabela.

  // -> ESTADOS LOCAIS PARA O SUB-MODAL FLUTUANTE DE LANÇAMENTO E EDIÇÃO DE NOTAS FISCAIS
  const [subModalNfAberto, setSubModalNfAberto] = useState(false); // -> Controla se a janelinha flutuante de inserção ou edição de Notas Fiscais fica aberta ou fechada.
  const [modoSubModal, setModoSubModal] = useState("adicionar"); // -> CHAVE DE REGIME: Define se o formulário do sub-modal serve para adicionar um novo título ou editar um existente.
  const [indexNotaSendoEditada, setIndexNotaSendoEditada] = useState(null); // -> PONTEIRO DE SELEÇÃO: Guarda o índice exato do array que o operador está alterando.

  // -> ESTADOS DOS INPUTS DO FORMULÁRIO INTERNO DO SUB-MODAL DE NOTAS FISCAIS
  const [nfDocumento, setNfDocumento] = useState(""); // -> Monitora o campo do número do contrato digitado pelo operador.
  const [nfReferencia, setNfReferencia] = useState(""); // -> Monitora o número de referência da Nota Fiscal preenchido.
  const [nfAtribuicao, setNfAtribuicao] = useState(""); // -> Monitora a natureza comercial ou tipo de venda do título.
  const [nfDataDoc, setNfDataDoc] = useState(""); // -> Monitora a data de emissão fiscal selecionada no calendário.
  const [nfVencimento, setNfVencimento] = useState(""); // -> Monitora a data de vencimento líquido limite do título.
  const [nfValor, setNfValor] = useState(""); // -> Monitora o valor financeiro nominal preenchido para a Nota Fiscal.
  const [nfVendedor, setNfVendedor] = useState(""); // -> Monitora o nome do executivo de vendas responsável por fechar o contrato.

  // -> ESTADO DE SELEÇÃO EM MASSA (MECÂNICA CLICKUP PARA EXCLUSÃO DE NFs COM FLAG)
  const [notasSelecionadas, setNotasSelecionadas] = useState({}); // -> Guarda um mapa de chaves booleanas (true/false) para rastrear quais linhas receberam o visto do operador.

  // -> ESTADOS PARA MENUS DE ACIONAMENTO TELEFÔNICO E DISPARO DE MENSAGENS
  const [menuWhatsAberto, setMenuWhatsAberto] = useState(null); // -> Rastreia se o pop-up de opções do WhatsApp de um contato específico está aceso.
  const [menuEmailAberto, setMenuEmailAberto] = useState(null); // -> Rastreia se o pop-up de opções de e-mail de um contato específico está aceso.
  const [copiado, setCopiado] = useState(false); // -> CONTROLADOR GANGORRA: Muda temporariamente o ícone de cópia para um visto verde de sucesso.

  // =========================================================================================
  // ⚡ GATILHO REATIVO 1: RECALIBRADO PARA FILTRAR O CNPJ TEXTUAL SEM DEPENDER DA ID HASH
  // =========================================================================================
  useEffect(() => {
    const cnpjAlvo = card.cnpj ? String(card.cnpj).trim() : ""; // -> Isola o CNPJ limpo contido na raiz do card de cobrança ativa.
    if (!cnpjAlvo) return; // -> Aborta o circuito se o cartão vier sem documento para evitar processamentos em branco.

    const colecaoEmpresasRef = collection(db, "cadastros_empresas"); // -> Mira na coleção mestre de empresas informada no seu JSON.
    const consultaPorCnpj = query(colecaoEmpresasRef, where("cnpj", "==", cnpjAlvo)); // -> Monta o filtro reativo buscando o documento que possua o CNPJ correspondente.
    
    const cancelarEscutaCnpj = onSnapshot(consultaPorCnpj, (snapshot) => { // -> Conecta o sensor de escuta em tempo real no banco.
      if (!snapshot.empty) { // -> Testa se localizou a empresa correspondente dentro do banco NoSQL.
        const docEmpresa = snapshot.docs[0]; // -> Captura a primeira empresa localizada na varredura.
        setDadosEmpresaFirebase({ idDocumento: docEmpresa.id, ...docEmpresa.data() }); // -> Injeta os dados ricos incluindo a Hash aleatória necessária para os contatos.
      } else {
        setDadosEmpresaFirebase(null); // -> Reseta o estado local se a empresa não constar na coleção de cadastros.
      }
    });

    return () => cancelarEscutaCnpj(); // -> Corta a fiação de escuta ao fechar a tela para preservar a máquina.
  }, [card.id, card.cnpj]); // -> Recarrega o circuito caso o operador mude de devedor.

  // =========================================================================================
  // ⚡ GATILHO REATIVO 2: BUSCA OS CONTATOS USANDO A ID HASH DESCOBERTA NO GATILHO 1
  // =========================================================================================
  useEffect(() => {
    const empresaIdRealHash = dadosEmpresaFirebase?.idDocumento; // -> Captura a Hash aleatória (ex: 52l0F1S5ZFQplSoV77W4) descoberta em tempo real no sensor acima.
    if (!empresaIdRealHash) {
      setListaContatosFirebase([]); // -> Zera a agenda visual se a empresa mãe ainda não foi localizada.
      return;
    }

    const colecaoContatosRef = collection(db, "cadastros_contatos"); // -> Aponta a fiação diretamente para a rota NoSQL de contatos humanos.
    const consultaFiltrada = query(colecaoContatosRef, where("empresaId", "==", empresaIdRealHash)); // -> Modifica o garimpo para filtrar usando a Hash relacional correta.
    
    const cancelarEscutaContatos = onSnapshot(consultaFiltrada, (snapshot) => { // -> Ativa a escuta viva com o servidor da nuvem.
      const listaTemporaria = []; // -> Fabrica o vetor temporário limpo.
      snapshot.forEach((documento) => {
        listaTemporaria.push({ id: documento.id, ...documento.data() }); // -> Enfileira o contato localizado (como o Victor Faustino).
      });
      setListaContatosFirebase(listaTemporaria); // -> Jorra os contatos telefônicos na tela reativamente sem atrasos.
    });

    return () => cancelarEscutaContatos(); // -> Corta a fiação de escuta ao encerrar o modal do prontuário.
  }, [dadosEmpresaFirebase?.idDocumento]); // -> Dispara o circuito assim que o gatilho 1 desvendar o ID Hash real do devedor.

  // -> MÁSCARA SEMÂNTICA DE CNPJ INJETADA PARA CANCELAR EXCEPTION DO CONSOLE
  const formatarCnpj = (cnpjBruto) => { // -> Transforma números secos no formato padrão nacional XX.XXX.XXX/XXXX-XX.
    const limpo = String(cnpjBruto).replace(/\D/g, ""); // -> Expulsa caracteres especiais salvando números puros.
    if (limpo.length !== 14) return cnpjBruto; // -> Aborta a máscara se o tamanho for irregular.
    return limpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"); // -> Monta os pontos e traços correspondentes.
  };

  // -> NORMALIZAÇÃO DE VARIÁVEIS SEGURAS VINDAS DA BUSCA NA NUVEM
  const cnpjExibido = dadosEmpresaFirebase?.cnpj || card.cnpj || "Não Cadastrado"; // -> Dá preferência para o CNPJ rico localizado na rota certa.
  const tipoInscricao = dadosEmpresaFirebase?.tipo || card.tipo || "Matriz"; // -> Resgata a tag real de Matriz ou Filial vinda do banco.
  
  // Extrai amigavelmente a Cidade e Estado de dentro do campo de endereço ou chaves avulsas
  const extrairCidadeEstado = () => {
    if (dadosEmpresaFirebase?.endereco) {
      const trecho = String(dadosEmpresaFirebase.endereco);
      if (trecho.includes("(") && trecho.includes(")")) {
        return trecho.substring(trecho.lastIndexOf("(") + 1, trecho.lastIndexOf(")")); // -> Isola o trecho (CAMPINAS/SP) de forma inteligente.
      }
    }
    return `${card.cidade || "Campinas"} / ${card.uf || "SP"}`; // -> Linha de contingência caso venha zerado na nuvem.
  };
  const localidadeFormatada = extrairCidadeEstado(); // -> Armazena a string geográfica limpa.

  // -> UNIFICAÇÃO DA SACOLA DE NOTAS FISCAIS
  const listaTitulosLocal = card.titulos && card.titulos.length > 0
    ? card.titulos
    : [
        {
          numDocumento: card.numDocumento || 0,
          referencia: card.referencia || "025070-A",
          atribuicao: card.atribuicao || "Não Especificada",
          dataDocumento: card.dataDocumento || "2026-06-11",
          vencimentoLiquido: card.vencimentoLiquido || "2026-06-11",
          valorNota: parseFloat(card.valorVencido) || 0,
          executivoVendas: card.executivoVendas || "Não Informado"
        }
      ];

  const valorOriginalDivida = listaTitulosLocal.reduce((acc, t) => acc + (parseFloat(t.valorNota) || 0), 0); // -> Soma reativamente o valor de todas as notas fiscais do lote.

  // -> EXECUTOR DO BOTÃO COPIAR (COPIA A MÍDIA COMPLETA DA EMPRESA NUM CLIQUE)
  const executarCopiaFichaClipboard = () => {
    const textoMontado = `Empresa: ${card.cliente}\nCNPJ: ${formatarCnpj(cnpjExibido)}\nTipo: ${tipoInscricao}\nLocalidade: ${localidadeFormatada}\nOperador: ${card.responsavel || "Lucas Vieira"}\nSaldo Devedor: R$ ${valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(textoMontado); // -> Transmite os caracteres textuais limpos para a área de transferência do Windows/Mac.
    setCopiado(true); // -> Chaveia para o ícone de visto verde.
    setTimeout(() => setCopiado(false), 2000); // -> Devolve o ícone original de prancheta após 2 segundos de carência.
  };

  // -> ADICIONADO PARA CORREÇÃO REATIVA SOLDADA: Função mestre que acende o modal flutuante em modo de inclusão limpa.
  const abrirAdicaoNotaFiscal = () => {
    setModoSubModal("adicionar"); // -> Configura o sub-modal para o regime de inclusão limpa.
    setIndexNotaSendoEditada(null); // -> Zera ponteiros remanescentes.
    setNfDocumento(""); setNfReferencia(""); setNfAtribuicao(""); setNfDataDoc(""); setNfVencimento(""); setNfValor(""); setNfVendedor(""); // -> Limpa os buffers textuais.
    setSubModalNfAberto(true); // -> Acende o sub-modal flutuante.
  };

  // -> ABRE O FORMULÁRIO DO SUB-MODAL EM MODO DE EDIÇÃO COPIANDO OS DADOS DA NOTA FISCAL SELECIONADA
  const abrirEdicaoNotaFiscal = (tituloObjeto, index) => {
    if (categoriaBloqueada) return; // -> TRAVA DE SEGURANÇA.
    setModoSubModal("editar"); // -> Vira a chave do sub-modal para o regime de alteração de dados.
    setIndexNotaSendoEditada(index); // -> Anota o índice da linha.
    
    setNfDocumento(tituloObjeto.numDocumento || "");
    setNfReferencia(tituloObjeto.referencia || "");
    setNfAtribuicao(tituloObjeto.atribuicao || "");
    setNfDataDoc(tituloObjeto.dataDocumento || "");
    setNfVencimento(tituloObjeto.vencimentoLiquido || "");
    setNfValor(tituloObjeto.valorNota || "");
    setNfVendedor(tituloObjeto.executivoVendas || "");
    
    setSubModalNfAberto(true); // -> Abre a caixinha flutuante na tela.
  };

  // -> PROCESSADOR GERAL DE SALVAMENTO DE COMPROMISSOS FISCAIS NA SACOLA REATIVA
  const processarSalvarNotaFiscalSacola = (e, fecharAoTerminar = false) => {
    if (e) e.preventDefault(); // -> Bloqueia o comportamento cego de recarga do navegador.
    if (categoriaBloqueada) return; // -> TRAVA DE SEGURANÇA.

    if (!nfDocumento || !nfReferencia.trim() || !nfValor || !nfVencimento) {
      alert("⚠️ VALIDAÇÃO: Contrato, Nota Fiscal, Vencimento e Valor são rigidamente obrigatórios!");
      return;
    }

    const notaEstruturada = {
      numDocumento: parseInt(nfDocumento) || 0,
      referencia: nfReferencia.trim().toUpperCase(),
      atribuicao: nfAtribuicao.trim() || "Não Especificada",
      dataDocumento: nfDataDoc || "2026-06-11",
      vencimentoLiquido: nfVencimento,
      valorNota: parseFloat(nfValor) || 0,
      executivoVendas: nfVendedor.trim() || "Não Informado"
    };

    let listaNotasAtualizada = [...listaTitulosLocal]; // -> Clona a sacola de títulos locais de RAM.

    if (modoSubModal === "editar" && indexNotaSendoEditada !== null) {
      listaNotasAtualizada[indexNotaSendoEditada] = notaEstruturada; // -> Substitui cirurgicamente os dados da nota corrigida.
    } else {
      listaNotasAtualizada.push(notaEstruturada); // -> Dá o push adicionando uma nova linha.
    }

    const novaSomaBrutaAcumulada = listaNotasAtualizada.reduce((acc, n) => acc + n.valorNota, 0); // -> Soma o novo bolo financeiro.

    const primeiroTitulo = listaNotasAtualizada[0] || {};
    const payloadCobrancaAtualizado = {
      ...card,
      titulos: listaNotasAtualizada,
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

    aoSalvarLocal(payloadCobrancaAtualizado); // -> Despacha o documento reestruturado para gravação contínua na nuvem.

    setNfDocumento(""); setNfReferencia(""); setNfAtribuicao(""); setNfDataDoc(""); setNfVencimento(""); setNfValor(""); setNfVendedor(""); // -> Reseta o formulário local.

    if (fecharAoTerminar || modoSubModal === "editar") {
      setSubModalNfAberto(false); // -> Fecha a cortina do sub-modal.
    } else {
      alert("🟩 SUCESSO!\nTítulo encaixado na memória RAM.");
    }
  };

  // -> EXCLUSÃO EM BLOCO OPERADA REATIVAMENTE PELOS SELETORES DE SELEÇÃO (FLAGS)
  const CakeSelecExclusaoEmMassa = () => {
    if (categoriaBloqueada) return; // -> TRAVA OPERACIONAL.
    const indexesParaRemover = Object.keys(notasSelecionadas).filter(idx => notasSelecionadas[idx]).map(Number); // -> Separa quem está com flag true.
    
    if (indexesParaRemover.length === 0) {
      alert("Atenção Operador: Marque os quadradinhos das flags na linha das NFs que deseja excluir de uma vez só.");
      return;
    }

    if (indexesParaRemover.length === listaTitulosLocal.length) {
      alert("⚠️ INTEGRALIDADE PROTEGIDA: A sacola não pode ficar 100% vazia. Se deseja banir a dívida inteira, use a lixeira principal do topo.");
      return;
    }

    const confirmacao = confirm(`🚨 CONFIRMAÇÃO:\nDeseja apagar permanentemente as ${indexesParaRemover.length} Notas Fiscais marcadas com flag? O saldo será recalculado.`);
    if (!confirmacao) return;

    const listaNotasFiltrada = listaTitulosLocal.filter((_, idx) => !indexesParaRemover.includes(idx)); // -> Filtra e expurga os índices flegados.
    const novaSomaBrutaAcumulada = listaNotasFiltrada.reduce((acc, n) => acc + n.valorNota, 0);

    const primeiroTitulo = listaNotasFiltrada[0] || {};
    const payloadCobrancaAtualizado = {
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

    aoSalvarLocal(payloadCobrancaAtualizado); // -> Atualiza e redistribui os saldos em tempo real.
    setNotasSelecionadas({}); // -> Reseta os quadradinhos de visto deixando-os em branco.
  };

  const lidarMarcarTodasAsNotas = (e) => { // -> Controla o checkbox mestre do cabeçalho da tabela.
    if (categoriaBloqueada) return;
    const marcado = e.target.checked;
    const novoMapa = {};
    if (marcado) {
      listaTitulosFiltrada.forEach((_, idx) => { novoMapa[idx] = true; }); // -> Flag em massa ligada.
    }
    setNotasSelecionadas(novoMapa);
  };

  // -> FILTRAGEM INTELIGENTE DA LUPA
  const listaTitulosFiltrada = listaTitulosLocal.filter((titulo) => {
    if (!filtroPesquisa.trim()) return true; // -> Se a lupa estiver vazia, renderiza o lote completo.
    const termo = filtroPesquisa.toLowerCase();
    return (
      String(titulo.referencia).toLowerCase().includes(termo) ||
      String(titulo.numDocumento).toLowerCase().includes(termo) ||
      String(titulo.dataDocumento).toLowerCase().includes(termo) ||
      String(titulo.vencimentoLiquido).toLowerCase().includes(termo) ||
      String(titulo.valorNota).toLowerCase().includes(termo) ||
      String(titulo.executivoVendas).toLowerCase().includes(termo)
    );
  });

  const dispararWhatsAppLocal = (nome, fone) => {
    const foneLimpo = String(fone).replace(/\D/g, ""); 
    const foneFormatado = foneLimpo.startsWith("55") ? foneLimpo : `55${foneLimpo}`; 
    const listaNFs = listaTitulosLocal.map(t => t.referencia).join(", ");
    const textoWhats = `Olá, ${nome}! Extrato em aberto de R$ ${valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} da empresa ${card.cliente}. NFs: ${listaNFs}`;
    window.open(`https://web.whatsapp.com/send?phone=${foneFormatado}&text=${encodeURIComponent(textoWhats)}`, "_blank");
    setMenuWhatsAberto(null);
  };

  const dispararEmailLocal = (emailDest, nome, provedor) => {
    const listaNFs = listaTitulosLocal.map(t => t.referencia).join(", ");
    const assunto = `Extrato de Débito Extrajudicial - Lote ${card.codigo}`;
    const corpo = `Prezado(a) ${nome},\n\nPendência de R$ ${valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} vinculada às NFs: ${listaNFs} da empresa ${card.cliente}.`;
    
    if (provedor === "gmail") window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailDest}&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`, "_blank");
    else if (provedor === "outlook_web") window.open(`https://outlook.live.com/default.aspx?rru=compose&to=${emailDest}&subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`, "_blank");
    setMenuEmailAberto(null);
  };

  return (
    <div style={{ padding: "20px", borderRight: "1px solid #e2e8f0", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", boxSizing: "border-box", width: "500px", minWidth: "500px", background: "#f8fafc" }}>
      
      {/* =========================================================================================
          🧾 BLOCO A: FICHA CADASTRAL DO DEVEDOR (DESIGN E ALINHAMENTO DO VICTOR HOMOLOGADO)
          ========================================================================================= */}
      <div style={{ textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <Activity size={13} strokeWidth={2.5} style={{ color: "#475569" }} />
            <span>Ficha Cadastral do Devedor</span>
          </h4>
          
          <div style={{ display: "flex", gap: "4px" }}>
            {aoAlternarArquivamentoNoModal && (
              <button type="button" onClick={() => aoAlternarArquivamentoNoModal(card.id, card.cliente)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center" }}>
                {exibirArquivados ? <ArchiveRestore size={14} style={{ color: "#2563eb" }} /> : <Archive size={14} />}
              </button>
            )}
            {aoExcluirCardNoModal && (
              <button type="button" onClick={() => aoExcluirCardNoModal(card.id, card.cliente)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Trash2 size={14} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"} />
              </button>
            )}
          </div>
        </div>
        
        <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>
          {/* LINHA 1 DA DIRETRIZ: Nome da Empresa na esquerda e Botão de Copiar na extrema direita no mesmo alinhamento */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "420px" }}><span style={{ color: "#64748b" }}>Nome da Empresa:</span> <b style={{ color: "#0f172a" }}>{card.cliente}</b></span>
            <button type="button" onClick={executarCopiaFichaClipboard} style={{ background: "none", border: "none", color: copiado ? "#16a34a" : "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px" }} title="Copiar bloco cadastral">
              {copiado ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
            </button>
          </div>
          
          {/* LINHA 2 DA DIRETRIZ: CNPJ com formatação na esquerda e o Badge Matriz/Filial no canto direito alinhado */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span><span style={{ color: "#64748b" }}>CNPJ:</span> <span style={{ fontFamily: "monospace", color: "#0f172a" }}>{formatarCnpj(cnpjExibido)}</span></span>
            <span style={{ fontSize: "10px", background: "#f0f9ff", padding: "2px 8px", borderRadius: "4px", border: "1px solid #bae6fd", color: "#0369a1", fontWeight: "700" }}>
              {tipoInscricao}
            </span>
          </div>

          <div><span style={{ color: "#64748b" }}>Cidade/UF:</span> <span style={{ color: "#475569" }}>{localidadeFormatada}</span></div>
          <div><span style={{ color: "#64748b" }}>Operador de Cobrança:</span> <span>{card.responsavel || "Lucas Vieira"}</span></div>
          <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "4px", marginTop: "2px" }}><span style={{ color: "#64748b" }}>Dívida Acumulada Total:</span> <span style={{ color: "#ef4444", fontWeight: "800", fontSize: "13px" }}>R$ {valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></div>
        </div>
      </div>

      {/* =========================================================================================
          📞 BLOCO B: AGENDA CONTATOS (SUBIU NA HIERARQUIA VISUAL DA CENTRAL - ACIMA DAS NFs)
          ========================================================================================= */}
      <div style={{ textAlign: "left" }}>
        <h4 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <Phone size={13} strokeWidth={2.5} style={{ color: "#475569" }} />
          <span>Agenda Contatos</span>
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {listaContatosFirebase.map((con) => (
            <div key={con.id} style={{ padding: "8px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", borderLeft: "3px solid #0f172a", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", color: "#0f172a" }}><User size={12} strokeWidth={2} /> <span>{con.nome}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Link size={10} strokeWidth={2} /> <span>Vinculo: {con.tipoVinculo || "Responsável Legal"}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={10} strokeWidth={2} /> <span>{con.email}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#2563eb", fontWeight: "bold", marginTop: "2px" }}><Phone size={10} strokeWidth={2} /> <span>{con.telephone || con.telefone}</span></div>
              </div>
              <div style={{ display: "flex", gap: "6px", marginTop: "8px", borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
                <button type="button" onClick={() => dispararWhatsAppLocal(con.nome, (con.telephone || con.telefone))} style={{ flex: 1, background: "#25d366", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>WhatsApp</button>
                {con.email && <button type="button" onClick={() => dispararEmailLocal(con.email, con.nome, "gmail")} style={{ flex: 1, background: "#2563eb", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>E-mail</button>}
              </div>
            </div>
          ))}
          {listaContatosFirebase.length === 0 && (
            <div style={{ padding: "10px", background: "#ffffff", border: "1px dashed #cbd5e1", borderRadius: "6px", fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>Nenhum contato localizado para este CNPJ na base NoSQL.</div>
          )}
        </div>
      </div>

      {/* =========================================================================================
          🧳 BLOCO C: NOTAS FISCAIS VINCULADAS (DIMENSIONAMENTO FIEL DE COLUNAS POR PORCENTAGEM)
          ========================================================================================= */}
      <div style={{ textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "4px", margin: 0, fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <Hash size={13} strokeWidth={2.5} style={{ color: "#475569" }} />
            <span>Notas Fiscais ({listaTitulosFiltrada.length})</span>
          </h4>
          
          {!categoriaBloqueada && (
            <div style={{ display: "flex", gap: "6px" }}>
              <button type="button" onClick={CakeSelecExclusaoEmMassa} style={{ display: "inline-flex", alignItems: "center", gap: "3px", border: "1px solid #ef4444", background: "#fef2f2", color: "#ef4444", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
                <Trash2 size={10} /> <span>Excluir Notas</span>
              </button>
              <button type="button" onClick={abrirAdicaoNotaFiscal} style={{ display: "inline-flex", alignItems: "center", gap: "3px", border: "1px solid #2563eb", background: "#f0f9ff", color: "#2563eb", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
                <Plus size={10} strokeWidth={3} /> <span>Adicionar Título</span>
              </button>
            </div>
          )}
        </div>

        {/* BARRA DE PESQUISA DA LUPA INTELIGENTE INSTALADA NO TOPO */}
        <div style={{ display: "flex", alignItems: "center", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", marginBottom: "8px", gap: "4px" }}>
          <Search size={12} strokeWidth={3} style={{ color: "#94a3b8" }} />
          <input type="text" placeholder="Pesquisar por NF, contrato, emissão, vencimento..." value={filtroPesquisa} onChange={(e) => setFiltroPesquisa(e.target.value)} style={{ width: "100%", border: "none", background: "none", fontSize: "11px", color: "#0f172a", outline: "none" }} />
          {filtroPesquisa && <X size={12} style={{ color: "#94a3b8", cursor: "pointer" }} onClick={() => setFiltroPesquisa("")} />}
        </div>

        {/* GRADE FISCAL COM LARGURA EM PORCENTAGEM COMPACTA FIXA */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "6px", overflowX: "auto", background: "#ffffff" }}>
          <table style={{ width: "100%", minWidth: "750px", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "800" }}>
                <th style={{ padding: "6px 8px", width: "4%", textAlign: "center" }}>
                  <input type="checkbox" disabled={categoriaBloqueada} checked={listaTitulosFiltrada.length > 0 && Object.keys(notasSelecionadas).length === listaTitulosFiltrada.length} onChange={lidarMarcarTodasAsNotas} style={{ cursor: 'pointer' }} />
                </th>
                <th style={{ padding: "6px 8px", width: "14%", textAlign: "left" }}>NF (Ref)</th>
                <th style={{ padding: "6px 8px", width: "14%", textAlign: "left" }}>Contrato</th>
                <th style={{ padding: "6px 8px", width: "11%", textAlign: "left" }}>Emissão</th>
                <th style={{ padding: "6px 8px", width: "14%", textAlign: "left" }}>Vencimento</th>
                <th style={{ padding: "6px 8px", width: "18%", textAlign: "right" }}>Valor</th>
                <th style={{ padding: "6px 8px", width: "25%", textAlign: "left", paddingLeft: "12px" }}>Executivo de Vendas</th>
              </tr>
            </thead>
            <tbody>
              {listaTitulosFiltrada.map((titulo, tIdx) => (
                <tr key={tIdx} style={{ borderBottom: "1px solid #f1f5f9", background: notasSelecionadas[tIdx] ? "#f0f9ff" : "transparent" }}>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>
                    <input type="checkbox" disabled={categoriaBloqueada} checked={!!notasSelecionadas[tIdx]} onChange={(e) => { setNotasSelecionadas(prev => ({ ...prev, [tIdx]: e.target.checked })); }} style={{ cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: "6px 8px", fontWeight: "700", color: "#0284c7", cursor: "pointer", textDecoration: "underline" }} onClick={() => abrirEdicaoNotaFiscal(titulo, tIdx)}>
                    {titulo.referencia}
                  </td>
                  <td style={{ padding: "6px 8px", color: "#475569", fontFamily: "monospace" }}>#{titulo.numDocumento}</td>
                  <td style={{ padding: "6px 8px", color: "#64748b" }}>{titulo.dataDocumento ? titulo.dataDocumento.split("-").reverse().join("/") : "S/D"}</td>
                  <td style={{ padding: "6px 8px", color: "#dc2626", fontWeight: "600" }}>{titulo.vencimentoLiquido ? titulo.vencimentoLiquido.split("-").reverse().join("/") : "S/D"}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", color: "#0f172a", fontWeight: "700", whiteSpace: "nowrap" }}>R$ {titulo.valorNota.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "6px 8px", paddingLeft: "12px", color: "#475569", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "130px" }}>{titulo.executivoVendas || "Não Informado"}</td>
                </tr>
              ))}
              {listaTitulosFiltrada.length === 0 && (
                <tr><td colSpan="7" style={{ padding: "14px", color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>Nenhum título fiscal localizado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================================
          🎭 SUB-MODAL FLUTUANTE DE LANÇAMENTO E EDIÇÃO DE NOTAS FISCAIS
          ========================================================================================= */}
      {subModalNfAberto && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", zIndex: 8000, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #cbd5e1", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                {modoSubModal === "editar" ? <Activity size={14} /> : <Plus size={14} strokeWidth={2.5} />} 
                <span>{modoSubModal === "editar" ? "Modificar Dados do Título" : "Lançar Título no Lote"}</span>
              </h5>
              <button type="button" onClick={() => setSubModalNfAberto(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button>
            </div>

            <form onSubmit={processarSalvarNotaFiscalSacola} style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>Nº CONTRATO PROPOSTA *</label>
                <input type="number" required placeholder="Ex: 87546516" value={nfDocumento} onChange={(e) => setNfDocumento(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>NOTA FISCAL (REFERÊNCIA) *</label>
                <input type="text" required placeholder="Ex: 025070-A" value={nfReferencia} onChange={(e) => setNfReferencia(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>ATRIBUIÇÃO (TIPO DE VENDA)</label>
                <input type="text" placeholder="Ex: Rentals T" value={nfAtribuicao} onChange={(e) => setNfAtribuicao(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>DATA EMISSÃO</label>
                  <input type="date" value={nfDataDoc} onChange={(e) => setNfDataDoc(e.target.value)} style={{ padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>VENCIMENTO REAL *</label>
                  <input type="date" required value={nfVencimento} onChange={(e) => setNfVencimento(e.target.value)} style={{ padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>MONTANTE EM MOEDA INTERNA (R$) *</label>
                <input type="number" step="0.01" required placeholder="0.00" value={nfValor} onChange={(e) => setNfValor(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", textAlign: "right" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>EXECUTIVO DE VENDAS</label>
                <input type="text" placeholder="Nome do vendedor" value={nfVendedor} onChange={(e) => setNfVendedor(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} />
              </div>

              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                {modoSubModal === "adicionar" ? (
                  <>
                    <button type="button" onClick={(e) => processarSalvarNotaFiscalSacola(e, false)} style={{ flex: 1, background: "#16a34a", color: "white", border: "none", padding: "8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>🔄 Salvar e Seguir</button>
                    <button type="button" onClick={(e) => processarSalvarNotaFiscalSacola(e, true)} style={{ background: "#0f172a", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Concluir</button>
                  </>
                ) : (
                  <button type="submit" style={{ flex: 1, background: "#2563eb", color: "white", border: "none", padding: "8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase" }}>Confirmar Alterações</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}