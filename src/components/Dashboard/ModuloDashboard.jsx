import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function ModuloDashboard({ cobrancas = [] }) { // -> Declara e exporta o componente mestre de inteligência analítica recebendo o array vivo do Firebase.

  // =========================================================================================
  // 📊 ENGINE MATEMÁTICA: Extração de Indicadores de Caixa em Tempo Real (NoSQL RAM)
  // =========================================================================================
  const carteiraTotalBruta = cobrancas.reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Soma o pipeline global vivo do escritório.
  
  // -> ISOLAMENTO DE CAIXA: Agrupa e soma os valores baseando-se nas categorias imutáveis que injetamos
  const totalRecuperado = cobrancas.filter(item => item.categoria === "final").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Dinheiro 100% quitado e limpo.
  const acordosAtivosPrice = cobrancas.filter(item => item.status === "cobranca").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Previsibilidade de caixa de parcelas Price.
  const amortizacaoContaCorrente = cobrancas.filter(item => item.status === "conta_corrente").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Dinheiro vivo flutuante de abatimentos avulsos.
  const emAtritoNegociacao = cobrancas.filter(item => item.categoria === "em_andamento").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Pipeline quente sob pressão comercial.

  const volumeTotalRecebimentos = acordosAtivosPrice + amortizacaoContaCorrente; // -> Consolida os dois regimes da categoria [Feito].
  const totalEmpresasAtivas = cobrancas.filter(item => !item.arquivado).length; // -> Conta quantos CNPJs estão trafegando nas raias sem contar o arquivo morto.

  // =========================================================================================
  // 📈 MOTOR DE PROPORÇÃO VOLUMÉTRICA (GRÁFICO DE BARRAS NATIVO)
  // =========================================================================================
  // -> Agrupa os valores exatos por cada uma das etapas do usuário para alimentar as colunas horizontais
  const dadosStatus = {
    novo: cobrancas.filter(item => (item.status || "novo") === "novo").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0),
    contato: cobrancas.filter(item => item.status === "contato").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0),
    negociacao: cobrancas.filter(item => item.status === "negociacao").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0),
    acordo: cobrancas.filter(item => item.status === "acordo").reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0),
    recebimento: volumeTotalRecebimentos,
    finalizado: totalRecuperado
  };

  // -> Descobre qual etapa tem o maior volume de dinheiro para servir de teto 100% na escala do gráfico
  const maiorValorEtapa = Math.max(dadosStatus.novo, dadosStatus.contato, dadosStatus.negociacao, dadosStatus.acordo, dadosStatus.recebimento, dadosStatus.finalizado, 1);

  // -> Função auxiliar que calcula o percentual de altura de cada barra para evitar estouros de layout
  const calcularAlturaBarra = (valor) => {
    return `${(valor / maiorValorEtapa) * 100}%`; // -> Retorna a string de porcentagem simétrica.
  };

  return ( // -> Inicia a renderização do painel analítico executivo do DOCULOC.
    <div style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 🏛️ SEÇÃO 1: OS BIG NUMBERS DE PRAXE (MÉTRICAS DE ALTA PERFORMANCE) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        
        {/* BIG NUMBER 1: TOTAL RECUPERADO */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #10b981" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>🎉 Total Recuperado (Quitado)</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#065f46", marginTop: "6px" }}>R$ {totalRecuperado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Canhotos baixados de forma definitiva.</div>
        </div>

        {/* BIG NUMBER 2: REGIME DE RECEBIMENTO */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #2563eb" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>📊 Em Regime de Recebimento</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#1e40af", marginTop: "6px" }}>R$ {volumeTotalRecebimentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Price: R$ {acordosAtivosPrice.toLocaleString("pt-BR")} | CC: R$ {amortizacaoContaCorrente.toLocaleString("pt-BR")}</div>
        </div>

        {/* BIG NUMBER 3: PIPELINE EM ATRITO */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #d97706" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>🤝 Pipeline em Negociação ACTIVE</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#b45309", marginTop: "6px" }}>R$ {emAtritoNegociacao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Capital sob pressão comercial nas colunas quentes.</div>
        </div>

        {/* BIG NUMBER 4: VOLUME TOTAL DE CARTEIRA */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #0f172a" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>💼 Custódia Total de Carteira</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "6px" }}>R$ {carteiraTotalBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Dividido em {totalEmpresasAtivas} CNPJs ativos monitorados.</div>
        </div>

      </div>

      {/* 📈 SEÇÃO 2: GRÁFICOS ESTRATÉGICOS DE VOLUMETRIA (MESA DE DECISÃO) */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", flexWrap: "wrap" }}>
        
        {/* GRÁFICO A: DISTRIBUIÇÃO CAPITAL FINANCEIRO POR ETAPA DO FUNIL */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>📊 Alocação de Capital por Etapa Comercial</h3>
          <p style={{ margin: "0 0 24px 0", fontSize: "12px", color: "#64748b" }}>Volume de dinheiro vivo retido em cada calha do funil.</p>
          
          {/* GRADE VISUAL DO GRÁFICO DE BARRAS VERTICAIS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "260px", borderBottom: "2px solid #cbd5e1", padding: "0 10px", gap: "12px" }}>
            
            {/* BARRA: A INICIAR */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "6px" }}>R$ {Math.round(dadosStatus.novo/1000)}k</div>
              <div style={{ width: "100%", maxWidth: "45px", height: calcularAlturaBarra(dadosStatus.novo), backgroundColor: "#94a3b8", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }}></div>
            </div>

            {/* BARRA: NOTIFICAÇÃO ENVIADA */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#6b21a8", marginBottom: "6px" }}>R$ {Math.round(dadosStatus.contato/1000)}k</div>
              <div style={{ width: "100%", maxWidth: "45px", height: calcularAlturaBarra(dadosStatus.contato), backgroundColor: "#c084fc", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }}></div>
            </div>

            {/* BARRA: EM NEGOCIAÇÃO */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#b45309", marginBottom: "6px" }}>R$ {Math.round(dadosStatus.negociacao/1000)}k</div>
              <div style={{ width: "100%", maxWidth: "45px", height: calcularAlturaBarra(dadosStatus.negociacao), backgroundColor: "#fbbf24", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }}></div>
            </div>

            {/* BARRA: TERMO EM ANDAMENTO */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#be185d", marginBottom: "6px" }}>R$ {Math.round(dadosStatus.acordo/1000)}k</div>
              <div style={{ width: "100%", maxWidth: "45px", height: calcularAlturaBarra(dadosStatus.acordo), backgroundColor: "#f472b6", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }}></div>
            </div>

            {/* BARRA: REGIME RECEBIMENTO */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#1e40af", marginBottom: "6px" }}>R$ {Math.round(dadosStatus.recebimento/1000)}k</div>
              <div style={{ width: "100%", maxWidth: "45px", height: calcularAlturaBarra(dadosStatus.recebimento), backgroundColor: "#60a5fa", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }}></div>
            </div>

            {/* BARRA: FINALIZADO */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#065f46", marginBottom: "6px" }}>R$ {Math.round(dadosStatus.finalizado/1000)}k</div>
              <div style={{ width: "100%", maxWidth: "45px", height: calcularAlturaBarra(dadosStatus.finalizado), backgroundColor: "#34d399", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }}></div>
            </div>

          </div>

          {/* LEGENDAS OPERACIONAIS DO EIXO HORIZONTAL */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "10px", fontWeight: "700", color: "#64748b", textAlign: "center" }}>
            <div style={{ flex: 1 }}>A INICIAR</div>
            <div style={{ flex: 1 }}>NOTIFICADO</div>
            <div style={{ flex: 1 }}>EM NEGOCIAÇÃO</div>
            <div style={{ flex: 1 }}>TERMO ANDAM.</div>
            <div style={{ flex: 1 }}>RECEBIMENTO</div>
            <div style={{ flex: 1, color: "#10b981" }}>FINALIZADO</div>
          </div>
        </div>

        {/* PANEL B: PERFORMANCE OPERACIONAL DA CARTEIRA */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>🎯 Índice de Conversão</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "12px", color: "#64748b" }}>Eficiência da mesa de conciliação.</p>
          </div>

          {/* BARRA HORIZONTAL DE PROPORÇÃO DE SUCESSO COBRADO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <span>Taxa de Recuperação Bruta</span>
                <span>{carteiraTotalBruta > 0 ? Math.round((totalRecuperado / carteiraTotalBruta) * 100) : 0}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "20px", overflow: "hidden" }}>
                <div style={{ width: carteiraTotalBruta > 0 ? `${(totalRecuperado / carteiraTotalBruta) * 100}%` : "0%", height: "100%", backgroundColor: "#10b981", borderRadius: "20px" }}></div>
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <span>Taxa de Previsibilidade (Acordos)</span>
                <span>{carteiraTotalBruta > 0 ? Math.round((volumeTotalRecebimentos / carteiraTotalBruta) * 100) : 0}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "20px", overflow: "hidden" }}>
                <div style={{ width: carteiraTotalBruta > 0 ? `${(volumeTotalRecebimentos / carteiraTotalBruta) * 100}%` : "0%", height: "100%", backgroundColor: "#2563eb", borderRadius: "20px" }}></div>
              </div>
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#64748b", marginTop: "16px", lineHeight: "1.4" }}>
            💡 <span style={{ fontWeight: "700", color: "#334155" }}>Diretriz Executiva:</span> O equilíbrio ideal de carteira jurídica dita que o volume somado de [Recebimentos + Finalizados] deve superar 40% do pipeline bruto.
          </div>
        </div>

      </div>

    </div>
  );
}