import React, { useState, useMemo } from "react"; // -> Traz a biblioteca mestre do React e os ganchos de estado e computação memorizada em RAM.
import { X, CheckCircle2, AlertTriangle, FolderMinus, Info, Layers, Coins, ChevronDown, ChevronRight, FileText, UserPlus, Phone, Mail, Link } from "lucide-react"; // -> Injeta a coleção de ícones lineares monocromáticos e sóbrios da Lucide para manter a estética corporativa.

export default function ModalConferenciaAging({ aberto, aoFechar, dadosProcessados = [], aoConfirmarProcessamento, carregando }) { // -> Declara a função do modal recebendo os dados minerados e os ganchos de gravação do motor.
  
  // 🧺 MEMÓRIA RAM DE SELEÇÃO ATÔMICA POR NF: Mapeia e rastreia o ID exclusivo de cada Nota Fiscal de forma desmarcada (false)
  const [itensSelecionados, setItensSelecionados] = useState(() => { // -> Inicializa o estado de flegagem cirúrgica por item no grid.
    const mapaInicial = {}; // -> Cria um rascunho de objeto vazio em RAM.
    dadosProcessados.forEach((reg) => { // -> Varre a esteira de empresas agrupadas.
      if (reg.titulosAReceber && reg.titulosAReceber.length > 0) { // -> Se o devedor possuir Notas Fiscais na sacola analítica:
        reg.titulosAReceber.forEach((nf) => { // -> Varre nota por nota de forma individual.
          const chaveNf = nf.idTemporario || `${reg.idTemporario}-${nf.referencia}`; // -> Consolida o ID único do item.
          mapaInicial[chaveNf] = false; // -> Inicia 100% das NFs em falso (desmarcadas) para forçar o flegado manual voluntário.
        });
      } else { // -> Caso seja um registro de título único ou resíduo do limbo:
        mapaInicial[reg.idTemporario] = false; // -> Inicia desmarcado.
      }
    });
    return mapaInicial; // -> Devolve o mapa de granularidade atômica configurado em RAM.
  }); // -> Fim da inicialização.

  // 🗺️ MEMÓRIA DE EXPANSÃO (ACORDEÃO): Monitora quais empresas estão abertas para ver e flegar as NFs internas
  const [linhasExpandidas, setLinhasExpandidas] = useState({}); // -> Cria o estado reativo de colapso visual.

  // Alterna o estado de aberto/fechado de uma empresa na prancha
  const alternarExpansao = (idx) => { // -> Gatilho acionado ao clicar nas setas da linha mestre.
    setLinhasExpandidas(anterior => ({ // -> Puxa o estado anterior.
      ...anterior, // -> Preserva as raias paralelas.
      [idx]: !anterior[idx] // -> Inverte o booleano de expansão da empresa clicada.
    }));
  };

  // -> CÁLCULO DE ACÚMULO REATIVO EM TEMPO REAL BASEADO NO VISTO DE CADA NOTA FISCAL
  const metricasLoteSelecionado = useMemo(() => { // -> Computa síncronamente os montantes flegados olhando para as NFs e não mais para o devedor cego.
    let totalDinheiroAcumulado = 0; // -> Inicializa o somador do bolo em dinheiro de reais.
    let contagemFaturasMarcadas = 0; // -> Inicializa o contador do volume físico de Notas Fiscais marcadas.

    dadosProcessados.forEach((reg) => { // -> Varre a esteira de empresas vindas da planilha.
      if (reg.titulosAReceber && reg.titulosAReceber.length > 0) { // -> Se for um grupo de Notas agrupadas:
        reg.titulosAReceber.forEach((nf) => { // -> Inspeciona faturamento por faturamento de dentro da sacola.
          const chaveNf = nf.idTemporario || `${reg.idTemporario}-${nf.referencia}`; // -> Captura a ID única da NF.
          if (itensSelecionados[chaveNf] === true) { // -> Se essa Nota Fiscal específica estiver flegada com true:
            totalDinheiroAcumulado += parseFloat(nf.valorNota) || 0; // -> Soma o valor centaval exato dessa nota no placar.
            contagemFaturasMarcadas += 1; // -> Incrementa o contador de canhotos ativos del lote.
          }
        });
      } else { // -> Caso seja um resíduo ou título isolado:
        if (itensSelecionados[reg.idTemporario] === true) { // -> Se o card mestre estiver flegado:
          totalDinheiroAcumulado += parseFloat(reg.montante || reg.valor || 0); // -> Soma o valor nominal.
          contagemFaturasMarcadas += 1; // -> Incrementa a contagem.
        }
      }
    });

    return { totalDinheiroAcumulado, contagemFaturasMarcadas }; // -> Exporta o payload de indicadores vivos de triagem para o visor verde.
  }, [dadosProcessados, itensSelecionados]); // -> Recalcula instantaneamente ao marcar ou desmarcar qualquer caixa de Nota Fiscal.

  if (!aberto) return null; // -> TRAVA DE SEGURANÇA: Se o controle disser que o modal deve ficar oculto, mata a renderização poupando processamento.

  // -> VALIDADOR DE SELEÇÃO MESTRE: Analisa se absolutamente todas as faturas individuais estão flegadas
  const totalNFsDisponiveis = useMemo(() => { // -> Calcula a volumetria total de títulos contidos no arquivo Excel.
    let total = 0; // -> Somador local.
    dadosProcessados.forEach((reg) => { total += reg.titulosAReceber ? reg.titulosAReceber.length : 1; }); // -> Soma as notas.
    return total; // -> Retorna o teto.
  }, [dadosProcessados]); // -> Trava na memória.

  const todosEstaoFlegados = totalNFsDisponiveis > 0 && metricasLoteSelecionado.contagemFaturasMarcadas === totalNFsDisponiveis; // -> Valida se o placar atingiu o teto das linhas.

  const lidarComSelecaoMestreLote = () => { // -> Função que gerencia o clique no checkbox do cabeçalho superior para marcar ou desmarcar tudo em massa.
    const mapaRascunho = {}; // -> Inicializa um balde de memória ram local vazio.
    dadosProcessados.forEach((reg) => { // -> Varre as empresas.
      if (reg.titulosAReceber && reg.titulosAReceber.length > 0) { // -> Varre as notas internas.
        reg.titulosAReceber.forEach((nf) => {
          const chaveNf = nf.idTemporario || `${reg.idTemporario}-${nf.referencia}`;
          mapaRascunho[chaveNf] = !todosEstaoFlegados; // -> Ativa ou desativa o visto baseado no estado mestre.
        });
      } else {
        mapaRascunho[reg.idTemporario] = !todosEstaoFlegados;
      }
    });
    setItensSelecionados(mapaRascunho); // -> Sincroniza a tela.
  };

  const lidarComSelecaoIndividualNF = (idChaveNf) => { // -> Acionado ao clicar na caixinha de visto de uma Nota Fiscal específica dentro da gaveta.
    setItensSelecionados(anterior => ({ // -> Puxa a esteira de estados de visto salvos.
      ...anterior, // -> Preserva os vistos das outras linhas paralelas.
      [idChaveNf]: !anterior[idChaveNf] // -> Inverte com precisão de agulha o booleano da nota clicada.
    }));
  };

  // -> Gerenciador para flegar/desflegar todas as NFs de um devedor específico de uma vez só
  const lidarComSelecaoLoteDevedor = (reg) => {
    if (!reg.titulosAReceber) return;
    
    // Descobre se todas as NFs deste devedor específico já estão flegadas agora
    const todasDesteDevedorMarcadas = reg.titulosAReceber.every(nf => {
      const chaveNf = nf.idTemporario || `${reg.idTemporario}-${nf.referencia}`;
      return itensSelecionados[chaveNf] === true;
    });

    setItensSelecionados(anterior => {
      const mapaRascunho = { ...anterior };
      reg.titulosAReceber.forEach(nf => {
        const chaveNf = nf.idTemporario || `${reg.idTemporario}-${nf.referencia}`;
        mapaRascunho[chaveNf] = !todasDesteDevedorMarcadas; // -> Chaveia de forma invertida o bloco.
      });
      return mapaRascunho;
    });
  };

  // 🛠️ RECALIBRAÇÃO DO DESPACHADOR FINAL: Varre os dados e remonta as sacolas NoSQL eliminando os alvos desmarcados e blindando o Firebase contra undefined
  const executarDisparoFinalDeCarga = () => { 
    const loteAprovadoFiltradoPorNFs = []; // -> Inicializa o array limpo de remessa.

    dadosProcessados.forEach((reg) => { // -> Varre a esteira original vinda do motor.
      if (reg.titulosAReceber && reg.titulosAReceber.length > 0) { // -> Se for um devedor com sacola de notas:
        // Separa e filtra estritamente as faturas cujo ID textual de flegagem foi marcado como true pelo operador
        const notasAprovadasDesteDevedor = reg.titulosAReceber.filter((nf) => {
          const chaveNf = nf.idTemporario || `${reg.idTemporario}-${nf.referencia}`;
          return itensSelecionados[chaveNf] === true; // -> Retém apenas as selecionadas de fato.
        });

        if (notasAprovadasDesteDevedor.length > 0) { // -> Se restou alguma nota marcada para este devedor específico:
          loteAprovadoFiltradoPorNFs.push({ // -> Envia o devedor remodelado contendo apenas as notas fiscais flegadas.
            ...reg, // -> Mantém SoldTo, Razão Social, CNPJ.
            titulosAReceber: notasAprovadasDesteDevedor // -> Substitui o bolo total pelas faturas intencionais da triagem.
          });
        }
      } else { // -> Caso seja um resíduo ou título isolado do limbo:
        if (itensSelecionados[reg.idTemporario] === true) {
          loteAprovadoFiltradoPorNFs.push(reg); // -> Despacha o objeto íntegro.
        }
      }
    });

    if (loteAprovadoFiltradoPorNFs.length === 0) { // -> Trava contra submissões vazias.
      alert("⚠️ AUTONOMIA DE LOTE:\n\nPor favor, marque ao menos uma Nota Fiscal na mesa de triagem para autorizar o envio ao Kanban.");
      return; // -> Aborta.
    }

    if (aoConfirmarProcessamento) { // -> Transmite a lista purificada para o orquestrador do pai.
      aoConfirmarProcessamento(loteAprovadoFiltradoPorNFs); // -> Sela o envio livre de NaN ou undefined.
    }
  };

  return ( // -> Desenha a interface estruturada de checkout de auditoria da planilha.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.6)", zIndex: 9000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", boxSizing: "border-box" }}>
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "1300px", maxHeight: "85vh", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box" }}>
        
        {/* TOPO DO MODAL */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Mesa de Triagem - Visão Granular por Nota Fiscal</h3>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "12px", lineHeight: "1.4" }}>As faturas foram aglutinadas por cliente para organização. Clique na linha da empresa para expandir e <b>flegar/desflegar individualmente as NFs</b> que vão compor o card.</p>
          </div>
          <button type="button" onClick={aoFechar} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#94a3b8", padding: "4px" }}>&times;</button>
        </div>

        {/* VISOR DE INDICADORES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}>
            <div style={{ background: "#eff6ff", color: "#1e40af", padding: "6px", borderRadius: "6px" }}><Layers size={16} /></div>
            <div>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Faturas Selecionadas para Criação</div>
              <div style={{ fontSize: "16px", fontWeight: "900", color: "#1e40af" }}>{metricasLoteSelecionado.contagemFaturasMarcadas} de {totalNFsDisponiveis} NFs Marcadas</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", textAlign: "left", justifyContent: "flex-end" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Saldo Acumulado das NFs Flegadas</div>
              <div style={{ fontSize: "18px", fontWeight: "900", color: "#16a34a" }}>R$ {metricasLoteSelecionado.totalDinheiroAcumulado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            </div>
            <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "6px", borderRadius: "6px" }}><Coins size={16} /></div>
          </div>
        </div>

        {/* GRADE PLANILHADA EXPANDE/COLAPSA MESTRE-DETALHE */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px", marginBottom: "16px", backgroundColor: "#ffffff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 }}>
                <th style={{ padding: "12px 8px", width: "30px", textAlign: "center" }}></th>
                <th style={{ padding: "12px 8px", width: "40px", textAlign: "center" }}><input type="checkbox" checked={todosEstaoFlegados} onChange={lidarComSelecaoMestreLote} style={{ cursor: "pointer" }} /></th>
                <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "700" }}>CONTA (SOLDTO)</th>
                <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "700" }}>EMPRESA / RAZÃO SOCIAL</th>
                <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "700" }}>CNPJ RESERVADO</th>
                <th style={{ padding: "12px 12px", color: "#475569", fontWeight: "700", textAlign: "center" }}>QTD NFs TOTAL</th>
                <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700", textAlign: "right", width: "160px" }}>MONTANTE BRUTO</th>
                <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "700" }}>EXECUTIVO</th>
              </tr>
            </thead>
            <tbody>
              {dadosProcessados.length === 0 ? (
                <tr><td colSpan="8" style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>Nenhum faturamento localizado.</td></tr>
              ) : (
                dadosProcessados.map((reg, idx) => {
                  const isExpandida = linhasExpandidas[idx] === true;
                  
                  const montanteConsolidado = reg.titulosAReceber
                    ? reg.titulosAReceber.reduce((acc, t) => acc + (parseFloat(t.valorNota) || 0), 0)
                    : (parseFloat(reg.montante || reg.valor || 0));

                  const qtdNfs = reg.titulosAReceber ? reg.titulosAReceber.length : 1;
                  const chaveEmpresa = `emp-${reg.soldTo || idx}-${idx}`;

                  let nfsMarcadasDesteDevedor = 0;
                  let todasDesteDevedorMarcadas = reg.titulosAReceber ? true : false;

                  if (reg.titulosAReceber) {
                    reg.titulosAReceber.forEach((nf) => {
                      const chaveNf = nf.idTemporario || `${reg.idTemporario}-${nf.referencia}`;
                      if (itensSelecionados[chaveNf] === true) {
                        nfsMarcadasDesteDevedor += 1;
                      } else {
                        todasDesteDevedorMarcadas = false;
                      }
                    });
                  } else {
                    if (itensSelecionados[reg.idTemporario] === true) {
                      nfsMarcadasDesteDevedor = 1;
                      todasDesteDevedorMarcadas = true;
                    }
                  }

                  return (
                    <React.Fragment key={chaveEmpresa}>
                      {/* LINHA MESTRE */}
                      <tr style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: nfsMarcadasDesteDevedor > 0 ? "rgba(22, 163, 74, 0.03)" : isExpandida ? "#f8fafc" : "transparent", cursor: "pointer" }}>
                        <td onClick={() => alternarExpansao(idx)} style={{ padding: "12px 8px", textAlign: "center", color: "#64748b" }}>
                          {isExpandida ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "center", verticalAlign: "middle" }}>
                          <input 
                            type="checkbox" 
                            checked={todasDesteDevedorMarcadas} 
                            onChange={() => lidarComSelecaoLoteDevedor(reg)} 
                            style={{ cursor: "pointer", width: "14px", height: "14px" }} 
                          />
                        </td>
                        <td style={{ padding: "12px", fontWeight: "700", color: "#0f172a" }}>#{reg.soldTo}</td>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#334155" }}>{reg.cliente}</td>
                        <td style={{ padding: "12px", fontFamily: "monospace", color: "#475569" }}>{reg.cnpj}</td>
                        <td style={{ padding: "12px", textAlign: "center", fontWeight: "700", color: "#0284c7" }}>
                          {nfsMarcadasDesteDevedor} / {qtdNfs} flegadas
                        </td>
                        <td style={{ padding: "12px 16px", fontWeight: "800", color: nfsMarcadasDesteDevedor > 0 ? "#16a34a" : "#475569", textAlign: "right" }}>R$ {montanteConsolidado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: "12px", color: "#475569" }}>{reg.executivo || "SISTEMA"}</td>
                      </tr>

                      {/* DETALHE EXPANSÍVEL */}
                      {isExpandida && (
                        <tr style={{ backgroundColor: "#f8fafc" }}>
                          <td colSpan="8" style={{ padding: "10px 24px 14px 44px" }}>
                            <div style={{ border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", backgroundColor: "#ffffff" }}>
                                <thead>
                                  <tr style={{ background: "#f1f5f9", color: "#475569", fontWeight: "800", borderBottom: "1px solid #cbd5e1" }}>
                                    <th style={{ padding: "8px", width: "40px", textAlign: "center" }}>FLEGAR</th>
                                    <th style={{ padding: "8px 10px" }}>Nº CONTRATO DOCUMENTO</th>
                                    <th style={{ padding: "8px 10px" }}>REFERÊNCIA (NOTA FISCAL)</th>
                                    <th style={{ padding: "8px 10px" }}>ATRIBUIÇÃO COMERCIAL</th>
                                    <th style={{ padding: "8px 10px" }}>DATA DOC (EMISSÃO)</th>
                                    <th style={{ padding: "8px 10px", color: "#2563eb" }}>VENCIMENTO LÍQUIDO</th>
                                    <th style={{ padding: "8px 16px", textAlign: "right", width: "140px" }}>MONTANTE TÍTULO</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {reg.titulosAReceber && reg.titulosAReceber.length > 0 ? (
                                    reg.titulosAReceber.map((nota, subIdx) => {
                                      const idChaveNfUnica = nota.idTemporario || `${reg.idTemporario}-${nota.referencia}`;
                                      const isNfFlegada = itensSelecionados[idChaveNfUnica] === true;

                                      return (
                                        <tr key={`nf-row-${subIdx}`} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: isNfFlegada ? "rgba(22, 163, 74, 0.05)" : "#ffffff" }}>
                                          <td style={{ padding: "8px", textAlign: "center", verticalAlign: "middle" }}>
                                            <input type="checkbox" checked={isNfFlegada} onChange={() => lidarComSelecaoIndividualNF(idChaveNfUnica)} style={{ cursor: "pointer", width: "13px", height: "13px" }} />
                                          </td>
                                          <td style={{ padding: "8px 10px", color: "#64748b" }}>#{nota.numDocumento}</td>
                                          <td style={{ padding: "8px 10px", color: "#0284c7", fontWeight: "700" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FileText size={11} /> {nota.referencia}</span>
                                          </td>
                                          <td style={{ padding: "8px 10px", color: "#64748b" }}>{nota.atribuicao || "-"}</td>
                                          <td style={{ padding: "8px 10px", color: "#475569" }}>{nota.dataDocumento}</td>
                                          <td style={{ padding: "8px 10px", color: "#2563eb", fontWeight: "700" }}>{nota.vencimentoLiquido}</td>
                                          <td style={{ padding: "8px 16px", fontWeight: "800", color: isNfFlegada ? "#16a34a" : "#0f172a", textAlign: "right" }}>R$ {nota.valorNota ? (parseFloat(nota.valorNota) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"}</td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr style={{ backgroundColor: itensSelecionados[reg.idTemporario] ? "rgba(22, 163, 74, 0.05)" : "#ffffff" }}>
                                      <td style={{ padding: "8px", textAlign: "center" }}>
                                        <input type="checkbox" checked={itensSelecionados[reg.idTemporario] === true} onChange={() => lidarComSelecaoIndividual(idx)} style={{ cursor: "pointer" }} />
                                      </td>
                                      <td style={{ padding: "8px 10px", color: "#64748b" }}>#{reg.numDocumento || "S/D"}</td>
                                      <td style={{ padding: "8px 10px", color: "#0284c7", fontWeight: "700" }}><span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FileText size={11} /> {reg.referencia || "Único"}</span></td>
                                      <td style={{ padding: "8px 10px", color: "#64748b" }}>{reg.atribuicao || "-"}</td>
                                      <td style={{ padding: "8px 10px", color: "#475569" }}>{reg.dataDoc || "-"}</td>
                                      <td style={{ padding: "8px 10px", color: "#2563eb", fontWeight: "700" }}>{reg.vencimento || "-"}</td>
                                      <td style={{ padding: "8px 16px", fontWeight: "800", color: "#0f172a", textAlign: "right" }}>R$ {(parseFloat(reg.montante || reg.valor || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* SUB-BLOCO B: CONTACTOS HUMANOS */}
                            {reg.contatosIdentificados && reg.contatosIdentificados.length > 0 && (
                              <div style={{ marginTop: "12px", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "12px", backgroundColor: "#ffffff" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", textTransform: "uppercase" }}>
                                  <UserPlus size={13} style={{ color: "#0284c7" }} />
                                  <span>Representantes de Faturamento Mapeados</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  {reg.contatosIdentificados.map((con, cIdx) => (
                                    <div key={`con-box-${cIdx}`} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", padding: "6px 10px", background: "#f8fafc", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#334155", minWidth: "120px" }}>👤 {con.nomeSugerido}</span>
                                      <span style={{ fontSize: "11px", color: "#0284c7", display: "inline-flex", alignItems: "center", gap: "4px" }}><Mail size={11} /> {con.email}</span>
                                      {(con.celularWhats || con.telefoneFixo) && (
                                        <span style={{ fontSize: "11px", color: "#16a34a", display: "inline-flex", alignItems: "center", gap: "4px" }}><Phone size={11} /> {con.celularWhats || con.telefoneFixo}</span>
                                      )}
                                      <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "10px", background: "#e0f2fe", color: "#0369a1", padding: "1px 6px", borderRadius: "4px", fontWeight: "800" }}>
                                        <Link size={9} /> {con.vinculoSugerido}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* COMPLIANCE FOOTER */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#64748b", marginBottom: "16px", textAlign: "left" }}>
          <Info size={13} style={{ color: "#0284c7", flexShrink: 0 }} />
          <span><b>Aviso de Governança de Lote:</b> Abra a empresa e marque estritamente as Notas Fiscais que deseja unificar na cobrança. Os títulos que você mantiver desmarcados ficarão salvos na esteira de retidos para auditoria de retaguarda.</span>
        </div>

        {/* RODAPÉ */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" disabled={carregando} onClick={aoFechar} style={{ padding: "8px 14px", backgroundColor: "#ffffff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: carregando ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "600" }}>Cancelar e Descartar</button>
          <button
            id="btn-confirmar-carga-final"
            type="button"
            disabled={carregando || metricasLoteSelecionado.contagemFaturasMarcadas === 0}
            onClick={executarDisparoFinalDeCarga}
            style={{ padding: "8px 18px", backgroundColor: (carregando || metricasLoteSelecionado.contagemFaturasMarcadas === 0) ? "#64748b" : "#16a34a", color: "#ffffff", border: "none", borderRadius: "6px", cursor: (carregando || metricasLoteSelecionado.contagemFaturasMarcadas === 0) ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
          >
            <CheckCircle2 size={13} strokeWidth={2.5} />
            <span>{carregando ? "Processando..." : `Confirmar Lote Selecionado (${metricasLoteSelecionado.contagemFaturasMarcadas} NFs)`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}