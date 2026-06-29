import React, { useState, useEffect } from "react"; // -> Traz a biblioteca mestre do React e os ganchos de estado e efeito para monitorar o ciclo de vida e abas ativas do painel.
import { Landmark, Scale, FileText } from "lucide-react"; // -> Carrega os ícones lineares corporativos da Lucide para manter a identidade visual executiva do sistema.

// -> IMPORTAÇÃO DOS FILHOS ESPECIALISTAS GARANTINDO O VÍNCULO DA EXTENSÃO DENTRO DA MESMA PASTA
import CalculadoraPrice from "./CalculadoraPrice.jsx"; // -> Injeta o submódulo especialista em parcelamentos e juros compostos.
import AmortizacaoAvulsa from "./AmortizacaoAvulsa.jsx"; // -> Injeta o submódulo cockpit especialista em baixas diretas de Pix e extrato de conta corrente.

export default function AbaProposta({ card, aoSalvarLocal }) { // -> Declara a função do componente Maestro recebendo o card reativo do devedor e a função de salvamento.
  
  // -> CONFIGURAÇÕES E PARÂMETROS FISCAIS DE ENTRADA DO DEVEDOR
  const valorOriginalDívida = parseFloat(card?.valorVencido) || parseFloat(card?.valor) || 0; // -> Captura com precisão o saldo devedor nominal atualizado do lote no Firebase.
  
  // -> RIGOR JURÍDICO AMARRADO: Se o lote estiver pago, com promessa paga ou se a raia mestre do CRM já for "feito" ou "finalizado", tranca tudo na hora
  const categoryBloqueada = card?.status === "pago" || card?.status === "promessa_paga" || card?.status === "finalizado" || card?.categoria === "feito" || card?.categoria === "finalizado"; // -> Se verdadeiro, congela toda e qualquer mutação na calculadora filho.

  // -> CHAVE SELETORA UNIFICADA DE REGIME FINANCEIRO (price vs conta_corrente)
  const [regimeAcordo, setRegimeAcordo] = useState(card?.status === "conta_corrente" ? "conta_corrente" : "price"); // -> Aloca o estado inicial da aba a ser aberta em tela.

  // -> TRAVA DINÂMICA COMPONENTIZADA EXPANDIDA: Identifica se o lote já possui amarração jurídica activa para bloquear a transição de abas do topo
  const regimeJaDefinidoNoBanco = card?.status === "acordo" || card?.status === "conta_corrente" || card?.categoria === "feito"; // -> Inclui o carimbo da etapa 'feito' para impedir desvios operacionais.

  // 🛠️ FIX DE REATIVIDADE CRÍTICA: Escuta síncronamente as atualizações de status vindas do Firebase para ajustar as chaves seletoras na tela na hora
  useEffect(() => { // -> Abre ponto de escuta no ciclo de vida do componente.
    if (card?.status === "conta_corrente") { // -> Se a nuvem acusar regime de conta corrente.
      setRegimeAcordo("conta_corrente"); // -> Comuta a chave da interface para a amortização avulsa.
    } else { // -> Caso contrário.
      setRegimeAcordo("price"); // -> Retorna o visor focado na esteira Price.
    }
  }, [card?.status]); // -> Monitora exclusivamente a flutuação do status do lote.

  // 🛠️ CAPTURA INTERCEPTADORA DE RESET DE DUAS VIAS: Zera o planoParcelas local na hora de propagar o reset della Calculadora para o App.js
  const interceptarSalvamentoEAvaliarReset = (pacoteAtualizado) => { // -> Cria a função de segurança para higienizar o pacote antes de mandar para o banco.
    if (!pacoteAtualizado.proposta || !pacoteAtualizado.proposta.parcelasSimuladas || pacoteAtualizado.proposta.parcelasSimuladas.length === 0) { // -> Checa se o pacote veio de um comando de Reset (proposta vazia ou nula).
      pacoteAtualizado.planoParcelas = []; // -> CORREÇÃO CIRÚRGICA: Esvazia o array oficial de faturas na mesma hora, impedindo que as parcelas antigas persistam na RAM.
    } // -> Conclui a checagem protetiva.
    if (aoSalvarLocal) aoSalvarLocal(pacoteAtualizado); // -> Repassa o pacote limpo com segurança para a rotina de salvamento mestre do App.js.
  }; // -> Encerra o interceptador.

  return ( // -> Inicia la renderização estrutural da aba de propostas dentro do prontuário.
    <div style={{ display: "flex", flexDirection: "column", gap: "0px", marginTop: "-10px" }}>
      
      {/* COMPONENTE DE ABAS INTERNAS FIXADO NO TOPO ABSOLUTO DA ABA (POLÍTICA ANTI-CONFLITO GANGORRA) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", gap: "4px" }}>
          
          {/* BOTÃO MODALIDADE A: PARCELAMENTO PRICE */}
          <button
            type="button"
            disabled={categoryBloqueada || (regimeJaDefinidoNoBanco && regimeAcordo !== "price")} // -> Desativa o clique se o banco já tiver escolhido a modalidade oposta.
            onClick={() => setRegimeAcordo("price")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px",
              fontSize: "12px",
              fontWeight: "800",
              cursor: (categoryBloqueada || (regimeJaDefinidoNoBanco && regimeAcordo !== "price")) ? "not-allowed" : "pointer",
              border: "none",
              borderBottom: regimeAcordo === "price" ? "3px solid #2563eb" : "3px solid transparent",
              background: regimeAcordo === "price" ? "#eff6ff" : "transparent",
              color: regimeAcordo === "price" ? "#2563eb" : "#64748b",
              opacity: (regimeJaDefinidoNoBanco && regimeAcordo !== "price") ? 0.4 : 1, // -> Deixa o botão opaco se o outro regime estiver operando.
              pointerEvents: (regimeJaDefinidoNoBanco && regimeAcordo !== "price") ? "none" : "auto", // -> Bloqueia ações de mouse para impedir o conflito.
              transition: "all 0.15s"
            }}
          >
            <Landmark size={14} />
            <span>Parcelamento (Acordo Price)</span>
          </button>

          {/* BOTÃO MODALIDADE B: COBRANÇA CONTA CORRENTE */}
          <button
            type="button"
            disabled={categoryBloqueada || (regimeJaDefinidoNoBanco && regimeAcordo !== "conta_corrente")} // -> Desativa o clique se o banco já tiver escolhido a modalidade oposta.
            onClick={() => setRegimeAcordo("conta_corrente")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px",
              fontSize: "12px",
              fontWeight: "800",
              cursor: (categoryBloqueada || (regimeJaDefinidoNoBanco && regimeAcordo !== "conta_corrente")) ? "not-allowed" : "pointer",
              border: "none",
              borderBottom: regimeAcordo === "conta_corrente" ? "3px solid #16a34a" : "3px solid transparent",
              background: regimeAcordo === "conta_corrente" ? "#f0fdf4" : "transparent",
              color: regimeAcordo === "conta_corrente" ? "#16a34a" : "#64748b",
              opacity: (regimeJaDefinidoNoBanco && regimeAcordo !== "conta_corrente") ? 0.4 : 1, // -> Deixa o botão opaco se o outro regime estiver operando.
              pointerEvents: (regimeJaDefinidoNoBanco && regimeAcordo !== "conta_corrente") ? "none" : "auto", // -> Bloqueia ações de mouse para impedir o conflito.
              transition: "all 0.15s"
            }}
          >
            <Scale size={14} />
            <span>Cobrança (Conta Corrente)</span>
          </button>
        </div>

        {/* LABEL INFORMATIVO DE TRAVA DO CLICKUP */}
        {regimeJaDefinidoNoBanco && !categoryBloqueada && (
          <div style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic", textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
            <span>🔒 Modalidade travada por transação ativa na nuvem.</span>
          </div>
        )}
      </div>

      {/* RENDERIZAÇÃO EXCLUSIVA E COMPONENTIZADA: EXIBE APENAS A MODALIDADE ATIVA PARA AJUSTES */}
      <div style={{ marginTop: "4px" }}>
        {regimeAcordo === "price" ? (
          <CalculadoraPrice
            card={card}
            valorOriginalDívida={valorOriginalDívida}
            categoriaBloqueada={categoryBloqueada}
            aoSalvarLocal={interceptarSalvamentoEAvaliarReset} // -> PRESERVAÇÃO INTEGRAL: Mantém conectado ao interceptador da esteira Price para apoiar a limpeza de faturas futuras se houver reset.
          />
        ) : (
          <AmortizacaoAvulsa
            card={card}
            valorOriginalDívida={valorOriginalDívida}
            categoryBloqueada={categoryBloqueada} // -> Propaga com segurança o status de congelamento se a conta estiver liquidada.
            aoSalvarLocal={aoSalvarLocal} // -> 🛠️ FIAÇÃO CORRIGIDA: Conecta diretamente ao gatilho mestre para despachar as baixas individuais por NF e logs do extrato sem travas.
          />
        )}
      </div>

      {/* PAINEL INFORMATIVO DO CRONOGRAMA VIVO SALVO NO BANCO DE DADOS */}
      {card?.planoParcelas && card.planoParcelas.length > 0 && (
        <div style={{ marginTop: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ background: "#0f172a", color: "white", padding: "8px 12px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
            <FileText size={13} />
            <span>Cronograma Ativo Armazenado no Firebase ({card.planoParcelas.length} Faturas)</span>
          </div>
          
          <div style={{ maxHeight: "160px", overflowY: "auto", background: "white" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1", color: "#475569" }}>
                  <th style={{ padding: "6px 12px", fontWeight: "700" }}>PARCELA</th>
                  <th style={{ padding: "6px 12px", fontWeight: "700" }}>VENCIMENTO</th>
                  <th style={{ padding: "6px 12px", fontWeight: "700" }}>VALOR REAJUSTADO</th>
                  <th style={{ padding: "6px 12px", fontWeight: "700", textAlign: "center" }}>STATUS FISCAL</th>
                </tr>
              </thead>
              <tbody>
                {card.planoParcelas.map((parcela, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #f1f5f9", background: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                    <th style={{ padding: "6px 12px", fontWeight: "600", color: "#0f172a" }}>Nº {parcela.numero || index + 1}</th>
                    <td style={{ padding: "6px 12px", fontWeight: "700", color: "#475569" }}>{parcela.vencimento?.split("-").reverse().join("/")}</td>
                    <td style={{ padding: "6px 12px", fontWeight: "800", color: "#2563eb" }}>R$ {parseFloat(parcela.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: "6px 12px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "9px",
                        fontWeight: "800",
                        textTransform: "uppercase",
                        background: parcela.pago ? "#dcfce7" : "#fef9c3",
                        color: parcela.pago ? "#16a34a" : "#713f12",
                        border: parcela.pago ? "1px solid #bbf7d0" : "1px solid #fef08a"
                      }}>
                        {parcela.pago ? "Liquidada" : "Em Aberto"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  ); // -> Encerra o escopo de renderização do componente principal.
} // -> Encerra a declaração e fiação do arquivo AbaProposta.jsx.