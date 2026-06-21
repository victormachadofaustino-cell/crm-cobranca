import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar as simulações matemáticas locais na RAM.
import { BadgePercent, Coins, Percent, Calendar, Activity, CheckCircle2 } from "lucide-react"; // -> Injeta as engines de ícones finos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function AbaProposta({ card, aoSalvarLocal, categoriaBloqueada }) { // -> Declara e exporta a sub-aba financeira recebendo as informações do card e as travas do Hub pai.

  // -> CÁLCULO DE HIGIENIZAÇÃO MONETÁRIA DE ENTRADA CONSOLIDADA
  const valorOriginalDívida = card.titulos && card.titulos.length > 0 
    ? card.titulos.reduce((acc, t) => acc + (parseFloat(t.valorNota) || 0), 0) 
    : (parseFloat(card.valorVencido) || 0); // -> SOMA DO BOLO NoSQL: Calcula a somatória real de todas as notas fiscais unificadas na sacola.

  // -> ESTADOS LOCAIS OPERACIONAIS DA CALCULADORA PRICE E ACORDOS COMERCIAIS
  const [propostaValor, setPropostaValor] = useState(card.proposta?.valorCobrado || valorOriginalDívida); // -> Monitora o valor negociado final pretendido para o acordo comercial.
  const [propostaParcelas, setPropostaParcelas] = useState(card.proposta?.qtdParcelas || 1); // -> Monitora a quantidade de parcelas fixas desejadas para a simulação.
  const [taxaJurosMensal, setTaxaJurosMensal] = useState(1.5); // -> INTERNA INTERATIVA: Inicializa a taxa de juros de mora padrão em 1.5% ao mês para o cálculo composto.
  const [formaPagto, setFormaPagto] = useState(card.proposta?.tipoPagamento || "Boleto"); // -> Captura a forma de liquidação escolhida pelo operador (Boleto/Pix).
  const [dataPrimeiroVenc, setDataPrimeiroVenc] = useState(card.proposta?.dataPrimeiroVencimento || "2026-06-11"); // -> Guarda o dia limite estipulado para a carência do primeiro pagamento.

  // -> ESTADOS DE BIFURCAÇÃO DE REGIME DE LIQUIDAÇÃO (ESTILO CLICKUP)
  const [regimeLiquidacao, setRegimeLiquidacao] = useState(card.status === "conta_corrente" || (card.planoParcelas && card.planoParcelas.length === 0) ? "conta_corrente" : "acordo"); // -> INTERRUPTOR DE REGIME: Define se a tela carrega a calculadora Price ou o Extrato de Amortização Livre.
  const [novoAbatimento, setNovoAbatimento] = useState(""); // -> CAIXA DE CRÉDITO: Captura o valor avulso de Pix/Dinheiro digitado para abater a dívida.
  const [dataAbatimento, setDataAbatimento] = useState("2026-06-11"); // -> CALENDÁRIO DE CRÉDITO: Monitora o dia em que o dinheiro avulso bateu no caixa.

  // -> MOTOR MATEMÁTICO DE JUROS COMPOSTOS INTEGRADO (FÓRMULA PRICE M = P * (1 + i)^n)
  const calcularMontanteComposto = () => { // -> Executa o cálculo financeiro real de taxa de juros acumulada por parcela.
    const principal = parseFloat(propostaValor) || 0; // -> Puxa o saldo base preenchido na simulação.
    const taxa = parseFloat(taxaJurosMensal) / 100; // -> Converte a porcentagem em valor decimal para a equação.
    const periodos = parseInt(propostaParcelas) || 1; // -> Puxa o número de meses da divisão.
    if (periodos <= 1) return principal; // -> Sem juros se o faturamento for à vista em parcela única.
    return principal * Math.pow(1 + taxa, periodos); // -> Retorna o Custo Efetivo Total (CET) corrigido pela curva de juros compostos.
  }; // -> Encerra o motor matemático.

  const totalComJuros = calcularMontanteComposto(); // -> Armazena em tempo real o montante final reajustado.
  const valorDaParcelaFixa = totalComJuros / (parseInt(propostaParcelas) || 1); // -> Divide o saldo corrigido simetricamente pela quantidade de meses.

  // -> COMANDO DE RE-SOLDA DE ESTRATÉGIA NO MAESTRO PAI
  const aplicarAcordoPriceLocal = () => {
    if (categoriaBloqueada) return; // -> TRAVA DE SEGURANÇA: Impede qualquer alteração se a comanda já estiver homologada com sucesso.

    let parcelasGeradas = []; // -> Inicializa a esteira estruturada vazia.
    const totalMeses = parseInt(propostaParcelas) || 1; // -> Puxa a volumetria de meses decidida.

    for (let i = 1; i <= totalMeses; i++) { // -> Roda o laço gerando parcela por parcela.
      const dataVenc = new Date(dataPrimeiroVenc + "T00:00:00"); // -> Instancia a data base de largada.
      dataVenc.setMonth(dataVenc.getMonth() + (i - 1)); // -> Adiciona saltos mensais sucessivos no calendário.
      parcelasGeradas.push({ // -> Empurra o objeto estruturado para o array do cofre.
        numero: i,
        valor: parseFloat(valorDaParcelaFixa.toFixed(2)), // -> Guarda o valor fixado real.
        vencimento: dataVenc.toISOString().split("T")[0], // -> Transforma em formato de texto limpo (AAAA-MM-DD).
        pago: false, // -> Seta inicial pendente fiscal.
        status: "a_vencer" // -> Tag de controle cronológico.
      });
    }

    const propostaConsolidada = { // -> Consolida os rascunhos em formato Price unificado.
      dataPrimeiroVencimento: dataPrimeiroVenc,
      tipoPagamento: formaPagto,
      qtdParcelas: totalMeses,
      valorCobrado: parseFloat(totalComJuros.toFixed(2)), // -> Saldo final corrigido pela curva de juros.
      parcelasSimuladas: parcelasGeradas
    };

    const payloadCobrancaAtualizado = { // -> Acopla os rascunhos Price mantendo o status na raia de acordos.
      ...card,
      status: "acordo", // -> Move o devedor automaticamente para a calha técnica de termos.
      planoParcelas: parcelasGeradas, // -> Injeta a matriz financeira.
      proposta: propostaConsolidada,
      valorVencido: valorOriginalDívida // -> Preserva o montante nominal original intacto.
    };

    aoSalvarLocal(payloadCobrancaAtualizado); // -> Repassa o pacote para o Hub ModalProntuario despachar.
    alert("⚙️ SIMULAÇÃO DE ACORDO GERADA!\n\nO plano de parcelas Price foi injetado na memória RAM. Clique em 'Salvar Prontuário' para gravar síncronamente no Firebase.");
  };

  // -> COMANDO DE AMORTIZAÇÃO EM CASCATA: Executa a baixa de Pix Avulso e abate o Saldo Devedor Vivo na hora
  const lidarLancarAbatimentoAvulso = () => {
    if (categoriaBloqueada) return; // -> TRAVA DE SEGURANÇA: Impede inserções de caixas se trancado.
    const valorAbatido = parseFloat(novoAbatimento) || 0; // -> Limpa a digitação numérica.
    if (valorAbatido <= 0) return; // -> Evita transações nulas.

    const novoSaldo = Math.max(0, valorOriginalDívida - valorAbatido); // -> Aplica a subtração matemática direta impedindo saldo negativo.

    const logAmortizacao = { // -> Prepara a ata de auditoria legível de caixa.
      conteudo: `ABATIMENTO EM CONTA CORRENTE: Recebido Pix avulso de R$ ${valorAbatido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} no dia ${dataAbatimento.split("-").reverse().join("/")}. Saldo anterior do lote: R$ ${valorOriginalDívida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ➔ Saldo atualizado: R$ ${novoSaldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`, 
      dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) 
    };

    // -> Abate proporcionalmente o saldo individual de cada Nota Fiscal dentro da sacola reativa para manter consistência linear
    const proporcaoAbatimento = novoSaldo / (valorOriginalDívida || 1);
    const sacolaTitulosAmortizada = (card.titulos || []).map(t => ({
      ...t,
      valorNota: parseFloat((t.valorNota * proporcaoAbatimento).toFixed(2))
    }));

    const payloadCobrancaAtualizado = {
      ...card,
      status: "conta_corrente", // -> Chaveia o card automaticamente para a calha técnica de amortização avulsa.
      valorVencido: novoSaldo, // -> Atualiza a variável reativa das raias com a redução do saldo.
      valor: novoSaldo,
      titulos: sacolaTitulosAmortizada, // -> Grava as notas com valores reduzidos.
      historicoNotas: [logAmortizacao, ...(card.historicoNotas || [])], // -> Injeta o rastro na ata.
      planoParcelas: [], // -> Limpa os parcelamentos Price legados já que o regime é Conta Corrente livre.
      proposta: {
        dataPrimeiroVencimento: dataAbatimento,
        tipoPagamento: "Pix / Avulso",
        qtdParcelas: 1,
        valorCobrado: novoSaldo,
        parcelasSimuladas: []
      }
    };

    aoSalvarLocal(payloadCobrancaAtualizado); // -> Repassa o pacote para gravação reativa imediata na nuvem.
    setNovoAbatimento(""); // -> Zera o input de moeda.
    alert(`🟩 BAIXA CONFIRMADA!\n\nAbatimento de R$ ${valorAbatido.toLocaleString("pt-BR")} computado no saldo consolidado. Clique em 'Salvar Prontuário' para gravar síncronamente na nuvem.`);
  };

  return ( // -> Desenha a interface reativa da calculadora e amortizações.
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
      
      {/* INTERRUPTOR SELETOR DE REGIME DO CLICKUP (MÉTODO GANGORRA SÓBRIO) */}
      <div style={{ background: "#f1f5f9", padding: "8px", borderRadius: "8px", display: "flex", gap: "8px", border: "1px solid #e2e8f0" }}>
        <button type="button" disabled={categoriaBloqueada} onClick={() => setRegimeLiquidacao("acordo")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", flex: 1, padding: "8px", border: "none", borderRadius: "6px", background: regimeLiquidacao === "acordo" ? "#0f172a" : "none", color: regimeLiquidacao === "acordo" ? "white" : "#475569", fontWeight: "700", fontSize: "12px", cursor: categoriaBloqueada ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
          <BadgePercent size={13} strokeWidth={2.5} />
          <span>Acordo Parcelado (Price)</span>
        </button>
        <button type="button" disabled={categoriaBloqueada} onClick={() => setRegimeLiquidacao("conta_corrente")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", flex: 1, padding: "8px", border: "none", borderRadius: "6px", background: regimeLiquidacao === "conta_corrente" ? "#0f172a" : "none", color: regimeLiquidacao === "conta_corrente" ? "white" : "#475569", fontWeight: "700", fontSize: "12px", cursor: categoriaBloqueada ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
          <Coins size={13} strokeWidth={2.5} />
          <span>Abatimento Livre (Conta Corrente)</span>
        </button>
      </div>

      {regimeLiquidacao === "acordo" ? (
        /* =========================================================================================
           INTERFACE A: MOTOR FINANCEIRO DA CALCULADORA DE ACORDOS PRICE COMPOUNED
           ========================================================================================= */
        <>
          <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0 0 0", fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
            <Coins size={13} strokeWidth={2} />
            <span>Mesa de Simulação de Faturamento de Acordos</span>
          </h5>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>VALOR NOMINAL DE ACORDO (R$)</label>
              <input type="number" disabled={categoriaBloqueada} value={propostaValor} onChange={(e) => setPropostaValor(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#2563eb", background: categoriaBloqueada ? "#e2e8f0" : "#ffffff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>DIVISÃO DE PARCELAS (MESES)</label>
              <input type="number" min="1" max="36" disabled={categoriaBloqueada} value={propostaParcelas} onChange={(e) => setPropostaParcelas(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: categoriaBloqueada ? "#e2e8f0" : "#ffffff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <Percent size={11} strokeWidth={2.5} />
                <span>JUROS DE MORA (% A.M.)</span>
              </label>
              <input type="number" step="0.1" disabled={categoriaBloqueada} value={taxaJurosMensal} onChange={(e) => setTaxaJurosMensal(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: categoriaBloqueada ? "#e2e8f0" : "#ffffff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>FORMA DE LIQUIDAÇÃO</label>
              <select disabled={categoriaBloqueada} value={formaPagto} onChange={(e) => setFormaPagto(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", background: "white", color: "#0f172a", cursor: "pointer" }}>
                <option value="Boleto">Boleto Bancário</option>
                <option value="Pix">Transferência Pix</option>
                <option value="A vista">Dinheiro / À Vista</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <Calendar size={11} strokeWidth={2.5} />
                <span>DATA DE CARÊNCIA DO PRIMEIRO VENCIMENTO</span>
              </label>
              <input type="date" disabled={categoriaBloqueada} value={dataPrimeiroVenc} onChange={(e) => setDataPrimeiroVenc(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: categoriaBloqueada ? "#e2e8f0" : "#ffffff" }} />
            </div>
            
            {!categoriaBloqueada && ( // -> Só acende o gatilho de injeção se o contrato não estiver trancado.
              <button type="button" onClick={aplicarAcordoPriceLocal} style={{ gridColumn: "1 / -1", background: "#0f172a", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", marginTop: "4px" }}>
                Injetar Cronograma Price no Lote
              </button>
            )}
          </div>

          {/* DEMONSTRATIVO DINÂMICO INTERATIVO (CUSTO EFETIVO TOTAL - CET) */}
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "6px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", color: "#1e40af", marginBottom: "4px" }}>
              <Activity size={12} strokeWidth={2.5} />
              <span>Demonstrativo do Custo Efetivo Total (CET):</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", color: "#1e3a8a", fontWeight: "600", textAlign: "left" }}>
              <div>Bolo Bruto Composto Corrigido: <b>R$ {totalComJuros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</b></div>
              <div>Mensalidades Fixas: <b>{propostaParcelas}x de R$ {valorDaParcelaFixa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</b></div>
            </div>
          </div>
        </>
      ) : (
        /* =========================================================================================
           INTERFACE B: COCKPIT DE BAIXAS EM CONTA CORRENTE E AMORTIZAÇÕES EM CASCATA
           ========================================================================================= */
        <>
          <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0 0 0", fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
            <Coins size={13} strokeWidth={2} />
            <span>Lançar Recebimento Avulso (Abatimento de Saldo Consolidado)</span>
          </h5>
          
          <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>VALOR DO PIX / CRÉDITO (R$) *</label>
              <input type="number" placeholder="0.00" disabled={categoriaBloqueada} value={novoAbatimento} onChange={(e) => setNovoAbatimento(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#16a34a", background: "#ffffff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <Calendar size={11} strokeWidth={2.5} />
                <span>DATA DO DEPÓSITO</span>
              </label>
              <input type="date" disabled={categoriaBloqueada} value={dataAbatimento} onChange={(e) => setDataAbatimento(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: "#ffffff" }} />
            </div>
            
            {!categoriaBloqueada && ( // -> Só acende o gatilho de abatimento se o lote não estiver travado na interface.
              <button type="button" onClick={lidarLancarAbatimentoAvulso} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", gridColumn: "1 / -1", background: "#16a34a", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#15803d"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}>
                <CheckCircle2 size={13} strokeWidth={2.5} />
                <span>Confirmar Abatimento e Recalcular Saldo Devedor</span>
              </button>
            )}
          </div>

          <div style={{ background: "#fff7ed", border: "1px solid #ffedd5", padding: "12px", borderRadius: "6px", fontSize: "11px", color: "#c2410c", fontWeight: "600" }}>
            💡 DIRETRIZ DE MERCADO: Os lançamentos avulsos aplicam abatimentos contínuos em cascata direto no saldo devedor principal de todas as Notas Fiscais sem compromisso de datas fixas no calendário.
          </div>
        </>
      )}

    </div> // -> Encerra o contêiner mestre da aba de propostas.
  );
}