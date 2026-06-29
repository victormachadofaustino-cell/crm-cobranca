import React, { useState, useEffect, useMemo } from "react"; // -> Importa a biblioteca mestre do React e os ganchos de estado e efeito para monitorar o ciclo de vida e abas ativas do painel.
import { FileText, CheckCircle, Clock, Eye, ShieldCheck, AlertCircle, Percent, Coins, X, Landmark, Undo2 } from "lucide-react"; // -> Injeta as engines de ícones lineares e corporativos do ecossistema DOCULOC, adicionando o Undo2 para o estorno.

export default function AmortizacaoAvulsa({ card, aoSalvarLocal, categoriaBloqueada }) { // -> Define o componente especialista recebendo o prontuário vivo e os ganchos do pai.
  
  // -> 1. ESTADOS PARA GESTÃO DA INTERFACE E MODAIS CENTRAIS
  const [modalExtratoAberto, setModalExtratoAberto] = useState(false); // -> CONTROLADOR: Abre ou fecha o modal de extrato bancário cronológico no centro della tela.
  const [modalLiquidarAberto, setModalLiquidarAberto] = useState(false); // -> CONTROLADOR: Abre ou fecha o modal de baixa individual de Nota Fiscal.
  const [nfFoco, setNfParaLiquidar] = useState(null); // -> PONTE DE RAM: Memoriza qual objeto de Nota Fiscal foi selecionado para sofrer a liquidação.
  const [idxFoco, setIdxParaLiquidar] = useState(null); // -> INDEX DE REDE: Guarda a posição exata da nota fiscal dentro do array para mutação cirúrgica.

  // -> 2. ESTADOS INTERNOS DO FORMULÁRIO DO MODAL DE LIQUIDAÇÃO
  const [modoCalculo, setModoCalculo] = useState("%"); // -> CHAVE GANGORRA: Chaveia entre cálculo em valor real ("R$") ou percentual ("%").
  const [inputValorPago, setValorePago] = useState(""); // -> INPUT FINANCEIRO: Captura o dinheiro real que entrou na conta corrente.
  const [inputJuros, setJurosInjetados] = useState(""); // -> INPUT ACESSÓRIOS: Captura a taxa mensal base de juros informada pelo cobrador ou gerada via fórmula.
  const [inputMulta, setMultaInjetada] = useState(""); // -> INPUT PUNITIVO: Captura o valor de multa contratual por atraso negociado.
  const [inputCustas, setCustasInjetadas] = useState(""); // -> INPUT CARTÓRIO: Captura as despesas de protesto de títulos.
  const [dataLiquidacao, setDataLiquidacao] = useState("2026-06-26"); // -> CALENDÁRIO: Registra a data marco da conciliação corrente (ancorado em 2026).

  // -> 3. CÁLCULO DE DIAS DE ATRASO BLINDADO ANTI-FUSO HORÁRIO
  const calcularDiasAtraso = (dataVencimentoStr) => { // -> Calculates a distância temporal de vencimento da faturamento.
    if (!dataVencimentoStr) return 0; // -> Aborts o processamento se a string de data vier vazia.
    try { // -> Escudo contra erros de formatação ou parsing.
      const parts = dataVencimentoStr.includes("/") ? dataVencimentoStr.split("/") : dataVencimentoStr.split("-"); // -> Identifica se o separador cronológico é por barras ou hifens.
      let dataVenc = dataVencimentoStr.includes("/") ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`) : new Date(`${parts[0]}-${parts[1]}-${parts[2]}T12:00:00`); // -> Força a leitura do horário ao meio-dia para neutralizar fusos.
      const dataCorteHoje = new Date(`${dataLiquidacao}T12:00:00`); // -> Sincroniza o tempo de confrontação com o calendário do modal.
      const diferencaMilissegundos = dataCorteHoje - dataVenc; // -> Extrai a distância dos tempos em milissegundos brutos.
      const diasCalculados = Math.floor(diferencaMilissegundos / (1000 * 60 * 60 * 24)); // -> Converte os milissegundos em dias inteiros comerciais de calendário.
      return diasCalculados > 0 ? diasCalculados : 0; // -> Devolve os dias acumulados em inadimplência ou zera se estiver no prazo.
    } catch (e) { return 0; } // -> Proteção contra falhas de estouro de string de calendário.
  }; // -> Encerra o calculador.

  // -> 4. ACUMULADORES DE INDICADORES DE TOPO RE-CALIBRADOS (PLACAR DE COCKPIT UNIFICADO)
  const metricasTopo = useMemo(() => { // -> Memoriza em RAM os somatórios estatísticos da conta corrente de duas vias.
    const totalOriginal = (card?.titulos || []).reduce((acc, t) => acc + (parseFloat(t.valorNotaOriginal || t.valorNota) || 0), 0); // -> Soma os valores de faturamento de nascimento de todas as NFs.
    const totalRecuperadoComEncargos = (card?.titulosLiquidados || []).reduce((acc, t) => acc + (parseFloat(t.valorEfetivamentePago) || 0) + (parseFloat(t.jurosAplicados || 0) + parseFloat(t.multaAplicada || 0) + parseFloat(t.custasAplicadas || 0)), 0); // -> Agrupa o bolo bruto de caixa recuperado com encargos.
    const totalJurosIsolados = (card?.titulosLiquidados || []).reduce((acc, t) => acc + (parseFloat(t.jurosAplicados || 0) + parseFloat(t.multaAplicada || 0) + parseFloat(t.custasAplicadas || 0)), 0); // -> Agrupa exclusivamente os encargos adicionais faturados.
    const totalNominalAmortizado = (card?.titulosLiquidados || []).reduce((acc, t) => acc + (parseFloat(t.valorEfetivamentePago) || 0), 0); // -> Calcula a amortização pura sem taxas extras.
    const saldoDividaRestante = Math.max(0, totalOriginal - totalNominalAmortizado); // -> Executa a dedução do saldo devedor puro restante.
    return { totalOriginal, totalRecuperadoComEncargos, totalJurosIsolado: totalJurosIsolados, saldoRestante: saldoDividaRestante }; // -> Devolve as variáveis calculadas de forma segura.
  }, [card?.titulos, card?.titulosLiquidados]); // -> Recalcula automaticamente se as sacolas do Firebase sofrerem mutação.

  // -> 5. GATILHO INTERCEPTADOR DA CENTRAL DE LIQUIDAÇÃO CENTRALIZADA (TAXA DE JUROS PADRÃO DE 2%)
  const abrirModalLiquidar = (index, titulo) => { // -> Preenche os estados locais e ergue a janela flutuante da NF.
    if (categoriaBloqueada) return; // -> Trava contra alterações se o prontuário estiver trancado de fábrica por acordo.
    setIdxParaLiquidar(index); // -> Grava o index físico posicional da faturamento na sacola.
    setNfParaLiquidar(titulo); // -> Grava o objeto della Nota Fiscal na memória RAM local.
    setValorePago(titulo.valorNota || ""); // -> Pré-preenche reativamente o input com o saldo devedor atual que resta na nota.
    setJurosInjetados("2"); // -> Injeta o valor inicial 2 de forma passiva no input de juros.
    setMultaInjetada(""); setCustasInjetadas(""); // -> Reseta os demais campos extras de encargos para folha em branco.
    setModalLiquidarAberto(true); // -> Projeta e levanta o modal bem no centro della tela.
  }; // -> Encerra a abertura.

  // -> 🛠️ VISOR REATIVO DO VALOR TOTAL CALCULADO COM ACRÉSCIMOS NO MODAL
  const totalCalculadoComAcrescimos = useMemo(() => { // -> Calcula em tempo real o valor final esperado da nota.
    if (!nfFoco) return 0; // -> Aborta se não houver NF em foco.
    const baseNominal = parseFloat(nfFoco.valorNota) || 0; // -> Captura o saldo nominal atual da nota.
    const diasAtraso = calcularDiasAtraso(nfFoco.vencimentoLiquido); // -> Captura os dias de atraso baseado no vencimento.
    let taxaJurosDigitada = parseFloat(inputJuros) || 0; // -> Lê o valor passivo do input de juros.
    let multaCalculada = parseFloat(inputMulta) || 0; // -> Inicializa multa temporária.
    const custasCalculadas = parseFloat(inputCustas) || 0; // -> Captura as custas fixas.
    
    let jurosCalculados = 0; // -> Inicializa a variável que guardará os juros em moeda real.
    
    if (modoCalculo === "%") { // -> Se o regime estiver chaveado em porcentagem.
      multaCalculada = (baseNominal * multaCalculada) / 100; // -> Porcentagem da multa sobre o valor nominal.
      if (diasAtraso > 0) { // -> Se houver atraso real elegível.
        jurosCalculados = ((diasAtraso * taxaJurosDigitada) / 30 / 100) * baseNominal; // -> Prospecção pró-rata: (Dias * Input / 30 / 100) * Valor.
      }
    } else { // -> Se estiver sob o regime de valor real R$.
      jurosCalculados = taxaJurosDigitada; // -> Assume o valor digitado diretamente.
    }
    
    return parseFloat((baseNominal + jurosCalculados + multaCalculada + custasCalculadas).toFixed(2)); // -> Retorna o somatório total consolidado.
  }, [nfFoco, inputJuros, inputMulta, inputCustas, modoCalculo, dataLiquidacao]); // -> Recalcula síncronamente ao modificar os acréscimos.

  // -> 6. EXECUTOR DA BAIXA CIRÚRGICA DO SEU LIVRO CAIXA LEDGER (CONCILIAÇÃO B2B)
  const confirmarBaixaParcela = () => { // -> Executa a dedução do saldo e emite as notas do extrato.
    const vPago = parseFloat(inputValorPago) || 0; // -> Captura o dinheiro líquido digitado.
    const baseNominal = parseFloat(nfFoco.valorNota) || 0; // -> Isola o saldo nominal antigo do título.
    const diasAtraso = calcularDiasAtraso(nfFoco.vencimentoLiquido); // -> Captura os dias de atraso.
    
    let jMor = parseFloat(inputJuros) || 0; // -> Captura os juros informados.
    let mUla = parseFloat(inputMulta) || 0; // -> Captura a multa informada.
    const cUst = parseFloat(inputCustas) || 0; // -> Captura as despesas de cartório.

    if (vPago <= 0) { // -> Impede lançamentos nulos.
      alert("⚠️ Digite o valor efetivamente pago para computar a baixa."); // -> Notifica o operador.
      return; // -> Aborta a baixa.
    } // -> Fim do bloqueio.

    const valorNominalAnterior = parseFloat(nfFoco.valorNota) || 0; // -> Resgata o saldo antigo do título.

    if (modoCalculo === "%") { // -> Se estiver no modo percentual (%), converte em R$ calculando em cima do valor nominal da nota.
      mUla = parseFloat(((valorNominalAnterior * mUla) / 100).toFixed(2)); // -> Transforma multa de % em moeda real.
      jMor = diasAtraso > 0 ? parseFloat((((diasAtraso * jMor) / 30 / 100) * baseNominal).toFixed(2)) : 0; // -> Transforma juros pró-rata em moeda real para logs.
    }

    let novaSacolaTitulos = [...(card.titulos || [])]; // -> Duplica o array ativo de Notas Fiscais para merge.
    const novoSaldoTituloCalculado = Math.max(0, valorNominalAnterior - vPago); // -> Deduz o pagamento gerando a amortização real.

    novaSacolaTitulos[idxFoco] = { // -> Atualiza a linha da NF específica com o novo saldo devedor que restou.
      ...nfFoco, // -> Mantém as propriedades de origem da faturamento.
      valorNota: parseFloat(novoSaldoTituloCalculado.toFixed(2)) // -> Injeta o novo saldo deduzido.
    }; // -> Fim do ajuste.

    let novasLiquidadas = [...(card.titulosLiquidados || [])]; // -> Duplica a esteira de recebidos históricos.
    novasLiquidadas.push({ // -> Adicionada a propriedade 'documentoBaixado' para bater 100% com o buscador do lado direito.
      referencia: nfFoco.referencia, // -> Vincula a Nota Fiscal de referência.
      numDocumento: nfFoco.numDocumento, // -> Vincula o número do contrato.
      documentoBaixado: nfFoco.numDocumento, // -> Duplicada a chave sob a propriedade certa de cross-check do visor.
      vencimentoOriginal: nfFoco.vencimentoLiquido, // -> Salva a data histórica natal.
      valorOriginalNaBaixa: valorNominalAnterior, // -> Salva o saldo que existia no momento da operação.
      valorEfetivamentePago: vPago, // -> Registra a entrada nominal de caixa.
      jurosAplicados: jMor, // -> Registra o split de juros faturado.
      multaAplicada: mUla, // -> Registra o split de multa faturado.
      custasAplicadas: cUst, // -> Registra as custas pagas.
      dataLiquidacao: dataLiquidacao, // -> Registra a data de conciliação.
      jurosPercentual: modoCalculo === "%" ? parseFloat(inputJuros) || 0 : parseFloat(((jMor / (valorNominalAnterior || 1)) * 100).toFixed(2)), // -> Guarda o log percentual de juros.
      multaPercentual: modoCalculo === "%" ? parseFloat(inputMulta) || 0 : parseFloat(((mUla / (valorNominalAnterior || 1)) * 100).toFixed(2)) // -> Guarda o log percentual de multa.
    }); // -> Encerra o push.

    const novoLogExtrato = { // -> Cria a linha cronológica de extrato bancário comercial para a timeline.
      conteudo: `BAIXA CONTA CORRENTE: NF Ref ${nfFoco.referencia} (Doc: #${nfFoco.numDocumento}). Recebido R$ ${vPago.toLocaleString("pt-BR")} | Encargos: R$ ${(jMor + mUla + cUst).toLocaleString("pt-BR")}. Novo saldo da fatura: R$ ${novoSaldoTituloCalculado.toLocaleString("pt-BR")}.`, // -> Descritivo técnico sem emojis.
      dataHora: new Date(`${dataLiquidacao}T12:00:00`).toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), // -> Estampa de auditoria.
      tipo: "PAGAMENTO", // -> Carimba a categoria de fluxo.
      valorMovimento: vPago, // -> Impacto de caixa.
      documentoVinculado: nfFoco.numDocumento // -> Vínculo de contrato.
    }; // -> Fim.

    const novoSaldoGlobalCard = novaSacolaTitulos.reduce((acc, t) => acc + (parseFloat(t.valorNota) || 0), 0); // -> Recalcula o saldo total somando as faturas vivas da sacola.

    const payloadAtualizado = { // -> Embala o payload NoSQL purificado para o Firestore.
      ...card, // -> Herda dados textuais nativos imutáveis.
      status: "conta_corrente", // -> Trava o card fixamente na raia de conta corrente.
      valorVencido: novoSaldoGlobalCard, // -> Envia o novo saldo global.
      valor: novoSaldoGlobalCard, // -> Atualiza os contadores numéricos de cabeçalho.
      titulos: novaSacolaTitulos, // -> Injeta o array de faturas com a amortização calculada.
      titulosLiquidados: novasLiquidadas, // -> Injeta a lista de recibos contendo o novo item conciliado.
      planoParcelas: [], // -> Expurga cronogramas Price antigos.
      historicoNotas: [novoLogExtrato, ...(card.historicoNotas || [])], // -> Empilha o log no topo da timeline.
      proposta: { // -> Pasta Price.
        valorCobrado: novoSaldoGlobalCard, // -> Atualiza saldo de simulação.
        tipoPagamento: "Conta Corrente (Extrato)", // -> Registra a modalidade.
        qtdParcelas: 1, // -> Parcela única de abatimento contínuo.
        parcelasSimuladas: [] // -> Limpa a prancha Price.
      } // -> Fim.
    }; // -> Fim.

    aoSalvarLocal(payloadAtualizado); // -> Propaga reativamente para a nuvem.
    setModalLiquidarAberto(false); // -> Fecha o modal de liquidação central.
    setNfParaLiquidar(null); setIdxParaLiquidar(null); // -> Libera os ponteiros de foco da RAM local.
  }; // -> Encerra a baixa.

  // -> 🛠️ MOTOR DE ESTORNO JURÍDICO: Remove o recibo conciliado e reverte o capital para a nota ativa na nuvem
  const reverterConciliacaoParcela = (reciboClicado) => { // -> Executa o rollback reativo na tesouraria de retaguarda.
    const confirmar = window.confirm(`🚨 ESTORNO DE CONTA CORRENTE:\nDeseja estornar o recebimento da NF "${reciboClicado.referencia}" no valor de R$ ${reciboClicado.valorEfetivamentePago.toLocaleString("pt-BR")}?\n\nO saldo retornará para a sacola ativa e o registro será removido do extrato.`); // -> Barreira de pop-up humana.
    if (!confirmar) return; // -> Aborta em caso de desistência do operador.

    let sacolaTitulosRevertida = [...(card.titulos || [])]; // -> Duplica o array de faturas ativas.
    const idxEncontrado = sacolaTitulosRevertida.findIndex(t => t.referencia === reciboClicado.referencia && t.numDocumento === reciboClicado.numDocumento); // -> Localiza a faturamento de origem pelo ID do contrato.

    if (idxEncontrado !== -1) { // -> Se localizou a nota correspondente na sacola ativa.
      const saldoAtualNota = parseFloat(sacolaTitulosRevertida[idxEncontrado].valorNota) || 0; // -> Resgata o saldo residual amortizado.
      sacolaTitulosRevertida[idxEncontrado] = { // -> Devolve o capital amortizado somando o recibo estornado.
        ...sacolaTitulosRevertida[idxEncontrado],
        valorNota: parseFloat((saldoAtualNota + reciboClicado.valorEfetivamentePago).toFixed(2))
      };
    } // -> Fim do ajuste de sacola.

    let listaLiquidadasFiltrada = (card.titulosLiquidados || []).filter(l => !(l.referencia === reciboClicado.referencia && l.numDocumento === reciboClicado.numDocumento)); // -> Expurga o recibo da esteira de quitados.

    const logEstorno = { // -> Elabora a contrapartida cronológica técnica de estorno no extrato.
      conteudo: `🚨 ESTORNO TESOURARIA: Reversão manual realizada na NF Ref ${reciboClicado.referencia}. Valor de R$ ${reciboClicado.valorEfetivamentePago.toLocaleString("pt-BR")} devolvido ao saldo em aberto.`, // -> Mensagem formal descritiva.
      dataHora: new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), // -> Carimbo de momento.
      tipo: "ESTORNO", // -> Carimba a categoria de reversão.
      valorMovimento: reciboClicado.valorEfetivamentePago, // -> Volume revertido.
      documentoVinculado: reciboClicado.numDocumento // -> Código de amarração.
    };

    const novoSaldoGlobalRevertido = sacolaTitulosRevertida.reduce((acc, t) => acc + (parseFloat(t.valorNota) || 0), 0); // -> Recalcula o saldo total geral da carteira.

    const payloadRevertidoNoSQL = { // -> Consolida o payload NoSQL para despacho imediato.
      ...card,
      valorVencido: novoSaldoGlobalRevertido,
      valor: novoSaldoGlobalRevertido,
      titulos: sacolaTitulosRevertida,
      titulosLiquidados: listaLiquidadasFiltrada,
      historicoNotas: [logEstorno, ...(card.historicoNotas || [])],
      proposta: {
        valorCobrado: novoSaldoGlobalRevertido,
        tipoPagamento: "Conta Corrente (Extrato)",
        qtdParcelas: 1,
        parcelasSimuladas: []
      }
    };

    aoSalvarLocal(payloadRevertidoNoSQL); // -> Despacha o estorno e atualiza o Kanban e planilhas de forma imediata!
  }; // -> Encerra o estornador.

  // -> 7. CONSTRUTOR DO LIVRO CAIXA LINEAR CRONOLÓGICO (🛠️ FIX ANTI-INVALID-DATE: Exibe a string direta da NF sem forçar heranças de objetos nulos)
  const linesExtratoCalculadora = useMemo(() => { // -> Compila a malha de débitos e créditos sequenciais na RAM.
    let linhas = []; // -> Balde local.
    (card?.titulos || []).forEach(t => { // -> Enfileira os faturamentos originais como lançamentos de Débito (+).
      // 🛠️ RE-ESTRUTURAÇÃO TEXTUAL: Removido o termo '📥 Carga de Faturamento:' para enxugar a tabela conforme alinhado
      linhas.push({
        dataOrdenacao: t.dataDocumento || t.dataEmissao || "2026-01-01", // -> Chave de ordenação.
        labelData: t.dataDocumento || "01/01/2026", // -> 🟩 SOLUÇÃO DO INVALID DATE: Exibe a string pura tratada da nota, banindo a conversão de fuso horário que causava a quebra visual.
        descricao: `NF Ref: ${t.referencia || "NF"} (Doc: #${t.numDocumento || ""})`, // -> Texto descritivo unificado e higienizado.
        tipo: "DEBITO", // -> Débito.
        valor: parseFloat(t.valorNotaOriginal || t.valorNota || 0) // -> Preço original.
      });
    });
    (card?.titulosLiquidados || []).forEach(liq => { // -> Enfileira as amortizações recebidas como Crédito Amortizador (-).
      linhas.push({
        dataOrdenacao: liq.dataLiquidacao || "2026-06-26", // -> Data de corte.
        labelData: liq.dataLiquidacao ? liq.dataLiquidacao.split("-").reverse().join("/") : "26/06/2026", // -> Inverte a string americana de recebimento para visualização BR.
        descricao: `💸 Amortização Recebida: NF Ref ${liq.referencia} (+R$ ${liq.jurosAplicados?.toLocaleString("pt-BR")} juros / +R$ ${liq.multaAplicada?.toLocaleString("pt-BR")} multa)`, // -> Log com split explicativo.
        tipo: "CREDITO", // -> Crédito amortizador.
        valor: liq.valorEfetivamentePago // -> Entrada líquida.
      });
    });
    return linhas.sort((a, b) => new Date(a.dataOrdenacao) - new Date(b.dataOrdenacao)); // -> Ordena por data crescente montando a esteira cronológica contínua.
  }, [card?.titulos, card?.titulosLiquidados]); // -> Patenteia a atualização da malha.

  return ( // -> Desenha a prancha da controladoria de conta corrente em estilos inline seguros.
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", boxSizing: "border-box", height: "100%" }}>
      
      {/* 🛠️ PAINEL CONGELADO SUPERIOR: Trava as métricas e o botão de extrato no topo fixo da aba */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#ffffff", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9", zIndex: 20 }}>
        
        {/* SEÇÃO 1: PLACAR DE INDICADORES EXECUTIVOS (🛠️ RE-CÁLCULO DOS 3 BIG NUMBERS FINTECH) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", borderLeft: "4px solid #0f172a", textAlign: "left" }}>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Dívida Acumulada Total</span>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", marginTop: "2px" }}>R$ {metricasTopo.totalOriginal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          </div>
          
          {/* CARD 2 RECALIBRADO: Total recuperado bruto com juros embutidos e detalhamento de encargos no canto inferior direito */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", borderLeft: "4px solid #10b981", textAlign: "left", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Total Recuperado</span>
              <div style={{ fontSize: "18px", fontWeight: "900", color: "#065f46", marginTop: "2px" }}>R$ {metricasTopo.totalRecuperadoComEncargos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            </div>
            <span style={{ fontSize: "9px", color: "#2563eb", fontWeight: "800", alignSelf: "flex-end", background: "#eff6ff", padding: "1px 4px", borderRadius: "4px", border: "1px solid #bfdbfe", marginTop: "2px" }}>
              (Encargos: R$ {metricasTopo.totalJurosIsolado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})
            </span> {/* -> Injetado o visto menor do juros em pílula azul sutil no canto direito do placar. */}
          </div>

          {/* CARD 3 RECALIBRADO: Saldo residual da dívida acumulada deduzindo apenas as amortizações nominais */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", borderLeft: "4px solid #ef4444", textAlign: "left" }}>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Saldo da Dívida Acumulada</span>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#b91c1c", marginTop: "2px" }}>R$ {metricasTopo.saldoRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* SEÇÃO 2: BOTÃO CENTRALIZADOR RE-BATIZADO DE EXTRATO NO TOPO DIREITO */}
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <button type="button" onClick={() => setModalExtratoAberto(true)} style={{ padding: "6px 14px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase" }}>
            <Eye size={13} strokeWidth={2.5} />
            <span>Extrato de Movimentação</span> {/* -> ADEQUADO: Nome simplificado conforme exigido pelo protocolo comercial. */}
          </button>
        </div>

      </div>

      {/* SEÇÃO 3: THE WORKSPACE - COCKPIT COM SCROLL INDEPENDENTE (GAVETA ISOLADA) */}
      <div style={{ maxHeight: "calc(92vh - 210px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "4px" }}> {/* -> APLICADO: Altura máxima calculada com rolagem vertical exclusiva, impedindo que os Big Numbers sumam da prancha. */}
        {(card?.titulos || []).map((nota, idx) => {
          const isOpacoLiquido = (parseFloat(nota.valorNota) || 0) <= 0; // -> Checa se o saldo daquela faturamento zerou.
          const diasAtraso = calcularDiasAtraso(nota.vencimentoLiquido); // -> Calcula o atraso temporal de comarca.
          const correspondentePago = (card?.titulosLiquidados || []).find(l => l.referencia === nota.referencia && l.documentoBaixado === nota.numDocumento); // -> Encontra o par de quitação.

          return (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%", alignItems: "stretch" }}>
              
              {/* MINI CARD DA ESQUERDA: COBRANÇA ATIVA ENXUTA (MUTAÇÃO DE COR VERMELHA LEVE) */}
              <div style={{ background: isOpacoLiquido ? "rgba(239, 68, 68, 0.05)" : "#fffbfa", padding: "10px", borderRadius: "6px", border: isOpacoLiquido ? "1px dashed #fca5a5" : "1px solid #fca5a5", opacity: isOpacoLiquido ? 0.45 : 1, transition: "opacity 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>NF: {nota.referencia}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Vencimento: <b style={{ color: "#2563eb" }}>{nota.vencimentoLiquido}</b></div>
                  {!isOpacoLiquido && diasAtraso > 0 && <span style={{ fontSize: "10px", color: "#dc2626", fontWeight: "800", background: "#fee2e2", padding: "1px 4px", borderRadius: "4px", marginTop: "4px", display: "inline-block" }}>⚠️ {diasAtraso} dias em atraso</span>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "900", color: isOpacoLiquido ? "#b91c1c" : "#b91c1c" }}>R$ {(parseFloat(nota.valorNota) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  {!isOpacoLiquido && (
                    <button type="button" onClick={() => abrirModalLiquidar(idx, nota)} style={{ padding: "4px 10px", background: "#dc2626", color: "white", border: "none", borderRadius: "4px", fontSize: "10px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase" }}>Liquidar</button>
                  )}
                </div>
              </div>

              {/* MINI CARD DA DIREITA: COMPROVANTE PARCEIRO CORRESPONDENTE DE BAIXA WITH GATILHO DE REVERSÃO */}
              <div style={{ display: "flex", width: "100%" }}>
                {correspondentePago ? (
                  <div style={{ background: "#f0fdf4", padding: "10px", borderRadius: "6px", border: "1px solid #bbf7d0", display: "flex", flexDirection: "column", gap: "2px", textAlign: "left", width: "100%", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a", background: "#dcfce7", padding: "1px 6px", borderRadius: "4px" }}>🟩 CONCILIADO</span>
                        <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>📅 Data: {correspondentePago.dataLiquidacao?.split("-").reverse().join("/")}</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#1e293b", fontWeight: "700", marginTop: "3px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                        <span>Nominal Pago: <b style={{ color: "#065f46" }}>R$ {correspondentePago.valorEfetivamentePago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</b></span>
                        <span>Juros: <b style={{ color: "#1d4ed8" }}>R$ {correspondentePago.jurosAplicados.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({correspondentePago.jurosPercentual}%)</b></span>
                        <span>Multa: <b style={{ color: "#b45309" }}>R$ {correspondentePago.multaAplicada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({correspondentePago.multaPercentual}%)</b></span>
                        <span>Custas: <b style={{ color: "#7c3aed" }}>R$ {correspondentePago.custasAplicadas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</b></span>
                      </div>
                    </div>
                    {/* BOTÃO SUTIL DE REVERSÃO DE CONCILIAÇÃO (ESTORNO DE COMPROVANTE) */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px", borderTop: "1px solid #bbf7d0", paddingTop: "4px" }}> 
                      <button 
                        type="button" 
                        disabled={categoriaBloqueada}
                        onClick={() => reverterConciliacaoParcela(correspondentePago)} // -> 🛠️ FIX REATIVO DE MARCAÇÃO: Corrigido o ReferenceError substituindo o termo antigo pela variável unificada 'correspondentePago'.
                        style={{ background: "none", border: "none", color: "#dc2626", fontSize: "10px", fontWeight: "800", cursor: categoriaBloqueada ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "3px", textTransform: "uppercase", padding: "2px 4px", opacity: categoriaBloqueada ? 0.3 : 1 }}
                      >
                        <Undo2 size={11} strokeWidth={2.5} /> 
                        <span>Estornar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, border: "1px dashed #e2e8f0", borderRadius: "6px", background: "transparent" }}></div> // -> Retém a célula vazada invisível para travar o alinhamento horizontal em par.
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ================= MODAL CENTRAL 1: FORMULÁRIO DE BAIXA PREMIUM COM ABAS DE REGIME (R$ / %) ================= */}
      {modalLiquidarAberto && nfFoco && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px", boxSizing: "border-box" }}>
          <div style={{ background: "#ffffff", width: "100%", maxWidth: "440px", borderRadius: "8px", padding: "20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
            
            {/* Cabeçalho do Modal */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase" }}>Liquidar NF Ref: {nfFoco.referencia}</h3>
              <button type="button" onClick={() => setModalLiquidarAberto(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button>
            </div>

            {/* Chave Gangorra Unificada de Entrada de Moeda (R$ / %) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#475569" }}>MECÂNICA DE CÁLCULO DE ENCARGOS:</span>
              <div style={{ display: "flex", gap: "2px", background: "#cbd5e1", padding: "2px", borderRadius: "4px" }}>
                <button type="button" onClick={() => setModoCalculo("R$")} style={{ border: "none", padding: "3px 8px", fontSize: "10px", fontWeight: "800", borderRadius: "3px", cursor: "pointer", background: modoCalculo === "R$" ? "#0f172a" : "transparent", color: modoCalculo === "R$" ? "white" : "#475569" }}>R$ VALOR</button>
                <button type="button" onClick={() => setModoCalculo("%")} style={{ border: "none", padding: "3px 8px", fontSize: "10px", fontWeight: "800", borderRadius: "3px", cursor: "pointer", background: modoCalculo === "%" ? "#0f172a" : "transparent", color: modoCalculo === "%" ? "white" : "#475569" }}><Percent size={10} /> TAXA</button>
              </div>
            </div>

            {/* Inputs do Formulário de Liquidação */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>VALOR EFETIVAMENTE PAGO (R$) *</label>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "bold" }}>Saldo devedor NF: R$ {parseFloat(nfFoco.valorNota).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <input type="number" step="0.01" value={inputValorPago} onChange={(e) => setValorePago(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "800", color: "#16a34a", outline: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>JUROS DE MORA ({modoCalculo})</label>
                  <input type="number" step="0.01" placeholder="0.00" value={inputJuros} onChange={(e) => setJurosInjetados(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>MULTA CONTRATUAL ({modoCalculo})</label>
                  <input type="number" step="0.01" placeholder="0.00" value={inputMulta} onChange={(e) => setMultaInjetada(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", outline: "none" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>CUSTAS PROTESTO (R$)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={inputCustas} onChange={(e) => setCustasInjetadas(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#2563eb", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "3px" }}>DATA DA LIQUIDACÃO</label>
                  <input type="date" value={dataLiquidacao} onChange={(e) => setDataLiquidacao(e.target.value)} style={{ padding: "5px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", outline: "none" }} />
                </div>
              </div>
            </div>

            {/* VISOR DO VALOR TOTAL CALCULADO COM OS ACRÉSCIMOS */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: "6px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                <Landmark size={12} />
                <span>VALOR TOTAL COM ENCARGOS:</span>
              </span> 
              <span style={{ fontSize: "14px", fontWeight: "900", color: "#16a34a" }}>R$ {totalCalculadoComAcrescimos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> 
            </div> 

            {/* Ações de Rodapé */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "10px", marginTop: "4px" }}>
              <button type="button" onClick={() => setModalLiquidarAberto(false)} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "700", color: "#475569" }}>Cancelar</button>
              <button type="submit" onClick={confirmarBaixaParcela} style={{ background: "#16a34a", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", fontSize: "12px" }}>Liquidar</button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL CENTRAL 2: VISÃO DE EXTRATO BANCÁRIO CRONOLÓGICO INDISCUTÍVEL ================= */}
      {modalExtratoAberto && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "40px", boxSizing: "border-box" }}>
          <div style={{ background: "#ffffff", width: "100%", maxWidth: "640px", borderRadius: "8px", padding: "20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "10px", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>🖥️ Extrato Cronológico de Conta Corrente (Linha do Tempo)</h3>
              <button type="button" onClick={() => setModalExtratoAberto(false)} style={{ background: "none", border: "none", font_size: "24px", cursor: "pointer", color: "#94a3b8", font_weight: "bold" }}>&times;</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 140px", background: "#0f172a", color: "#ffffff", padding: "8px 12px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>
                <span>Data Mov.</span>
                <span>Descrição / Ocorrência de Fluxo</span>
                <span style={{ textAlign: "right" }}>Impacto Caixa</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", maxHeight: "260px", overflowY: "auto" }}>
                {linesExtratoCalculadora.map((linha, indexL) => {
                  const IsCredito = linha.tipo === "CREDITO";
                  return (
                    <div key={indexL} style={{ display: "grid", gridTemplateColumns: "100px 1fr 140px", padding: "10px 12px", fontSize: "12px", borderBottom: "1px solid #e2e8f0", background: IsCredito ? "#f0fdf4" : "#ffffff", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", color: "#64748b" }}>{linha.labelData}</span>
                      <span style={{ color: "#1e293b", fontSize: "11px", paddingRight: "10px", textAlign: "left" }}>{linha.descricao}</span>
                      <span style={{ textAlign: "right", fontWeight: "800", color: IsCredito ? "#16a34a" : "#b91c1c" }}>{IsCredito ? "- " : "+ "}R$ {linha.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button type="button" onClick={() => setModalExtratoAberto(false)} style={{ background: "#0f172a", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Fechar Extrato</button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLIANCE FOOTER */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "11px", color: "#475569", textAlign: "left" }}>
        <AlertCircle size={14} style={{ color: "#475569", flexShrink: 0, marginTop: "1px" }} />
        <span>
          <b>Mesa de Conciliação em Pares:</b> Clique em "Liquidar" para abrir o painel centralizado de encargos. Uma vez liquidadas, as faturas ganham opacidade reativa à esquerda e geram o par preenchido simétrico com destaque em caixas separadas de reajuste à direita.
        </span>
      </div>

    </div>
  );
}