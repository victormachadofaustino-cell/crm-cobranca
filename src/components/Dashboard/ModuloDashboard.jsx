import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import { CheckCircle2, BarChart3, Handshake, Briefcase, Activity, Target, Lightbulb } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function ModuloDashboard({ cobrancas = [], etapasFunilExternas = [] }) { // 🛠️ RECALIBRAÇÃO ANALÍTICA: Abre o barramento para receber a lista viva de etapas customizadas vindas do cofre da nuvem.

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
  // 📈 MOTOR DE PROPORÇÃO VOLUMÉTRICA PARMETRIZÁVEL (GRÁFICO DE BARRAS DINÂMICO)
  // =========================================================================================
  // 🛠️ EVOLUÇÃO DE SAAS COM MAP INTERNO: Mapeia o array vivo de etapas da nuvem calculando a volumetria financeira exata de forma elástica.
  const etapasDinamicasProcessadas = etapasFunilExternas.map((coluna) => { // -> Percorre etapa por etapa parametrizada pelo usuário.
    const saldoFinanceiroRaia = cobrancas // -> Inicia a triagem de devedores associados a esta calha específica.
      .filter((item) => (item.status || "novo") === coluna.id) // -> Filtra se a fase do card bate simetricamente com a ID da etapa.
      .reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Agrupa e soma os saldos vencidos em float numérico.
    
    return {
      id: coluna.id, // -> Chave identificadora técnica.
      nome: coluna.nome.toUpperCase(), // -> Força o nome invisível a ficar em caixa alta nas legendas.
      valor: saldoFinanceiroRaia // -> Atribui o montante em dinheiro acumulado.
    };
  });

  // -> Garimpa o teto monetário máximo do array dinâmico para servir de escala 100% calibrada de altura.
  const maiorValorEtapa = Math.max(...etapasDinamicasProcessadas.map(e => e.valor), 1); // -> Evita divisão por zero estabelecendo teto padrão de 1.

  // -> Função auxiliar que calcula o percentual de altura de cada barra para evitar estouros de layout
  const calcularAlturaBarra = (valor) => {
    return `${(valor / maiorValorEtapa) * 100}%`; // -> Retorna a string de porcentagem simétrica.
  };

  return ( // -> Inicia a renderização del painel analítico executivo do DOCULOC.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 🏛️ SEÇÃO 1: OS BIG NUMBERS DE PRAXE (MÉTRICAS DE ALTA PERFORMANCE) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        
        {/* BIG NUMBER 1: TOTAL RECUPERADO */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #10b981" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <CheckCircle2 size={13} strokeWidth={2.5} style={{ color: "#10b981" }} /> {/* -> Troca o emoji de festa pelo componente sutil de visto regular do Lucide. */}
            <span>Total Recuperado (Quitado)</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#065f46", marginTop: "6px" }}>R$ {totalRecuperado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Canhotos baixados de forma definitiva.</div>
        </div>

        {/* BIG NUMBER 2: REGIME DE RECEBIMENTO */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #2563eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <BarChart3 size={13} strokeWidth={2.5} style={{ color: "#2563eb" }} /> {/* -> Troca o emoji de barras pelo componente fino de barras em linhas vetoriais. */}
            <span>Em Regime de Recebimento</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#1e40af", marginTop: "6px" }}>R$ {volumeTotalRecebimentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Price: R$ {acordosAtivosPrice.toLocaleString("pt-BR")} | CC: R$ {amortizacaoContaCorrente.toLocaleString("pt-BR")}</div>
        </div>

        {/* BIG NUMBER 3: PIPELINE EM ATRITO */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #d97706" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <Handshake size={13} strokeWidth={2} style={{ color: "#d97706" }} /> {/* -> Troca o emoji de aperto de mãos pelo componente estilizado do Lucide em vetor. */}
            <span>Pipeline em Negociação ACTIVE</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#b45309", marginTop: "6px" }}>R$ {emAtritoNegociacao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Capital sob pressão comercial nas colunas quentes.</div>
        </div>

        {/* BIG NUMBER 4: VOLUME TOTAL DE CARTEIRA */}
        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "5px solid #0f172a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <Briefcase size={13} strokeWidth={2} style={{ color: "#0f172a" }} /> {/* -> Troca o emoji de maleta pelo componente fino outline de pasta executiva do Lucide. */}
            <span>Custodia Total de Carteira</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "6px" }}>R$ {carteiraTotalBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Dividido em {totalEmpresasAtivas} CNPJs ativos monitorados.</div>
        </div>

      </div>

      {/* 📈 SEÇÃO 2: GRÁFICOS ESTRATÉGICOS DE VOLUMETRIA (MESA DE DECISÃO) */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", flexWrap: "wrap" }}>
        
        {/* GRÁFICO A: DISTRIBUIÇÃO CAPITAL FINANCEIRO POR ETAPA DO FUNIL DINÂMICA */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <Activity size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Troca o emoji de gráfico de barras pelo vetor fino de monitoração de atividades. */}
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Alocação de Capital por Etapa Comercial</h3>
          </div>
          <p style={{ margin: "0 0 24px 0", fontSize: "12px", color: "#64748b" }}>Volume de dinheiro vivo retido em cada calha parametrizada do funil.</p>
          
          {/* GRADE VISUAL DO GRÁFICO DE BARRAS VERTICAIS AUTOMATIZADO */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "260px", borderBottom: "2px solid #cbd5e1", padding: "0 10px", gap: "12px" }}>
            {etapasDinamicasProcessadas.length === 0 ? ( // -> UX de contingência: se não existirem raias criadas no Firebase.
              <div style={{ width: "100%", textAlign: "center", fontSize: "12px", color: "#94a3b8", paddingBottom: "100px" }}>Aguardando conexão com as raias dinâmicas...</div>
            ) : ( // -> Havendo colunas salvas, monta o gráfico elástico de forma responsiva.
              etapasDinamicasProcessadas.map((item) => ( // -> Varre a lista processada desenhando o componente de barra simétrico.
                <div key={item.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ fontSize: "10px", fontWeight: "800", color: item.id === "finalizado" ? "#065f46" : "#475569", marginBottom: "6px" }}>R$ {Math.round(item.valor/1000)}k</div> {/* -> Exibe o indicador em Milhares (K) escalonado. */}
                  <div style={{ width: "100%", maxWidth: "45px", height: calcularAlturaBarra(item.valor), backgroundColor: item.id === "finalizado" ? "#34d399" : item.id === "negociacao" ? "#fbbf24" : "#94a3b8", borderRadius: "4px 4px 0 0", transition: "height 0.3s ease" }}></div> {/* -> Desenha a coluna sólida reativa. */}
                </div>
              ))
            )}
          </div>

          {/* LEGENDAS OPERACIONAIS DINÂMICAS DO EIXO HORIZONTAL */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "9px", fontWeight: "700", color: "#64748b", textAlign: "center", gap: "12px" }}>
            {etapasDinamicasProcessadas.map((item) => ( // -> Varre a mesma fila imprimindo as legendas alinhadas em flexbox na base.
              <div key={item.id} style={{ flex: 1, color: item.id === "finalizado" ? "#10b981" : "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.nome}>
                {item.nome}
              </div>
            ))}
          </div>
        </div>

        {/* PANEL B: PERFORMANCE OPERACIONAL DA CARTEIRA */}
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <Target size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Troca o antigo emoji de alvo pelo componente alvo em linhas finas do Lucide. */}
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Índice de Conversão</h3>
          </div>
          <p style={{ margin: "0 0 20px 0", fontSize: "12px", color: "#64748b" }}>Eficiência da mesa de conciliação.</p>

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

          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#64748b", marginTop: "16px", lineHeight: "1.4" }}>
            <Lightbulb size={14} strokeWidth={2} style={{ color: "#b45309", marginTop: "1px", flexShrink: 0 }} /> {/* -> Troca o antigo emoji de lâmpada pelo componente sutil vazado do Lucide. */}
            <div>
              <span style={{ fontWeight: "700", color: "#334155" }}>Diretriz Executiva:</span> O equilíbrio ideal de carteira jurídica dita que o volume somado de [Recebimentos + Finalizados] deve superar 40% do pipeline bruto.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}