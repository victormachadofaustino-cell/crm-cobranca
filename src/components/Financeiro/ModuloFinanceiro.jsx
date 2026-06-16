import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para gerenciar os filtros locais de tesouraria.
import { db } from "../../config/firebase"; // -> Injeta o conector físico db exportado do arquivo firebase.js para permitir comandos directos à nuvem.
import { doc, updateDoc } from "firebase/firestore"; // -> Puxa as ferramentas estáveis do SDK do Firestore para atualização parcial de documentos de banco de dados.
import { Wallet, AlertTriangle, TrendingUp, Percent, SlidersHorizontal, Search, FolderMinus, Undo2, Check } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export function ModuloFinanceiro({ cobrancas = [], aoMudarStatusDireto }) { // -> Declara e exporta o componente mestre recebendo as cobranças do Firebase e o gatilho de baixa do pai.
  // -> ESTADOS LOCAIS DE NAVEGAÇÃO INTERNA: Controla a pílula de filtro de situação financeira (Todos, Vencidos, A Vencer, Pagos).
  const [filtroSituacao, setFiltroSituacao] = useState("Todos"); // -> Inicializa exibindo a volumetria bruta de parcelas do mês.
  const [buscaEmpresa, setBuscaEmpresa] = useState(""); // -> BARRA DE BUSCA: Permite refinar o fluxo de caixa digitando o nome do devedor.

  // -> CONFIGURAÇÕES TÉCNICAS DE COBRANÇA JURÍDICA (DIRETRIZES DE MERCADO B2B)
  const ALIQUOTA_HONORARIOS = 0.20; // -> Taxa de êxito da assessoria fixada em 20% sobre o montante recuperado.
  const RETENCAO_IMPOSTO_HONORARIOS = 0.15; // -> Alíquota fiscal simulada de 15% de retenção de notas sobre o ganho do escritório.
  const DATA_HOJE_SISTEMA = new Date("2026-06-11T00:00:00"); // -> ÂNCORA CRONOLÓGICA: Data real de junho de 2026 para cálculo estrito de atrasos.

  // =========================================================================================
  // ⚙️ SUPER MOTOR DE EXTRAÇÃO: Unifica todas as parcelas Price da carteira em um único Pool
  // =========================================================================================
  const todasAsParcelasDaCarteira = cobrancas.flatMap((cliente) => { // -> Achata as matrizes NoSQL NoSQL geradas no CRM em uma fila de auditoria única.
    const parcelasInternas = cliente.planoParcelas || []; // -> Proteção contra campos nulos nas contas de Conta Corrente pura.
    
    return parcelasInternas.map((parcela) => { // -> Executa o mapeamento construindo a linha financeira de cada boleto individual.
      const dataVencimento = new Date(parcela.vencimento + "T00:00:00"); // -> Instancia a data limite salva no banco da Google.
      
      // -> ANÁLISE TEMPORAL DINÂMICA: Determina o real estado de risco del ativo cruzando com a âncora de 2026
      let situacaoCronologica = "a_vencer"; // -> Estado nativo padrão de faturas que estão no prazo de vencimento.
      if (parcela.pago) { // -> Verifica se o boleto já possui a marcação de recebimento efetuada no banco.
        situacaoCronologica = "pago"; // -> Se a flag for verdadeira, está liquidado e entra no caixa disponível.
      } else if (dataVencimento < DATA_HOJE_SISTEMA) { // -> Se o boleto passou da data âncora de junho de 2026 sem receber baixa.
        situacaoCronologica = "vencido"; // -> Se passou do dia atual de junho de 2026 sem Pix, é inadimplência real.
      } // -> Encerra a triagem cronológica da fatura.

      // -> CÁCULO DE SPLIT FINANCEIRO EM REAIS (CÁLCULO DE REPASSE)
      const valorBrutoParcela = parseFloat(parcela.valor) || 0; // -> Limpa o float numérico da célula para evitar bugs de vírgula.
      const honorariosEscritorio = valorBrutoParcela * ALIQUOTA_HONORARIOS; // -> Isola os 20% de ganho do DOCULOC.
      const impostoRetido = honorariosEscritorio * RETENCAO_IMPOSTO_HONORARIOS; // -> Calcula os 15% de imposto sobre o honorário.
      const repasseLiquidoCliente = valorBrutoParcela - honorariosEscritorio; // -> Sobra líquida que será devolvida para a empresa credora-pai.

      return { // -> Devolve o objeto estendido e calculado com todas as regras tributárias para a tabela.
        ...parcela, // -> Preserva o número e o vencimento original da parcela imutável.
        idUnicaCobranca: cliente.id, // -> Salva a ID física da cobrança raiz para permitir o updateDoc cirúrgico.
        razaoSocial: cliente.cliente, // -> Traz a Razão Social em caixa alta para a linha.
        codigoConta: cliente.codigo, // -> Traz o ID numérico da conta judicial.
        operadorMesa: cliente.responsavel || "Sem operador", // -> Traz o cobrador encarregado.
        situacaoReal: situacaoCronologica, // -> Injeta o veredito cronológico (pago, vencido, a_vencer).
        splitHonorarios: honorariosEscritorio, // -> Injeta o valor em reais pertencente ao escritório.
        splitRepasse: repasseLiquidoCliente, // -> Injeta o valor em reais pertencente ao credor.
        splitImposto: impostoRetido // -> Injeta a previsão de imposto de nota fiscal.
      }; // -> Encerra o retorno da linha calculada.
    }); // -> Encerra o laço interno das parcelas do devedor.
  }); // -> Encerra o esmagamento das matrizes NoSQL.

  // =========================================================================================
  // 🔍 FILTRAGEM DE TESOURARIA: Separa por Situação de Risco + Busca Textual
  // =========================================================================================
  const parcelasFiltradas = todasAsParcelasDaCarteira.filter((item) => { // -> Filtra as faturas unificadas na memória RAM da máquina.
    const bateSituacao = filtroSituacao === "Todos" || item.situacaoReal === filtroSituacao; // -> Corte 1: Verifica a pílula de risco ativa.
    const bateTexto = !buscaEmpresa.trim() || item.razaoSocial.toLowerCase().includes(buscaEmpresa.toLowerCase()) || String(item.codigoConta).includes(buscaEmpresa); // -> Corte 2: Procura por nome ou #ID.
    return bateSituacao && bateTexto; // -> Retorna verdadeiro se passar pelas duas travas simultaneamente.
  }); // -> Encerra a peneira de buscas da tesouraria.

  // =========================================================================================
  // 📈 TOTALIZADORES FISCAIS EM RAM: Alimentam os Big Numbers da Controladoria
  // =========================================================================================
  const caixaVencidoInadimplente = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "vencido").reduce((acc, p) => acc + p.valor, 0); // -> Dinheiro que sumiu do caixa (atrasos).
  const caixaAVencerFluxo = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "a_vencer").reduce((acc, p) => acc + p.valor, 0); // -> Previsibilidade de receita futura.
  const caixaPagoLiquidado = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").reduce((acc, p) => acc + p.valor, 0); // -> Dinheiro real que já entrou no banco.
  const honorariosBrutosAcumulados = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").reduce((acc, p) => acc + p.splitHonorarios, 0); // -> Commission bruta do escritório sobre os pagamentos confirmados.
  const impostosPrevisaoRetencao = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").reduce((acc, p) => acc + p.splitImposto, 0); // -> Lucro real antes do DARF fiscal.

  // =========================================================================================
  // ⚡ GATILHO DE BAIXA IMEDIATA: Executa a conciliação bancária direto no Firestore
  // =========================================================================================
  const lidarComConciliacaoParcela = async (idCobrancaRaiz, numeroParcela, acaoSucesso) => { // -> Declara o motor assíncrono de baixa rápida.
    const clienteAlvo = cobrancas.find(c => c.id === idCobrancaRaiz); // -> Captura o devedor na esteira viva.
    if (!clienteAlvo) return; // -> Proteção contra falhas de estouro de memória.

    const planoAtualizado = (clienteAlvo.planoParcelas || []).map((par) => { // -> Duplica e varre a tabela Price daquela empresa para alterar a parcela clicada.
      if (par.numero === numeroParcela) { // -> Encontra o número de parcela exato que recebeu o clique do operador.
        return { // -> Modifica as chaves internas da fatura de forma cirúrgica.
          ...par, // -> Preserva o vencimento e os valores originais da fatura.
          pago: acaoSucesso, // -> Vira true se clicou no verde (baixa) ou false se deu estorno.
          status: acaoSucesso ? "pago" : "a_vencer" // -> Altera a tag interna da célula NoSQL.
        }; // -> Encerra o pacote reajustado da linha.
      } // -> Fim da condição de ID.
      return par; // -> Mantém as outras parcelas intactas.
    }); // -> Encerra o laço de reajuste del plano.

    // -> Prepara o log cronológico para a linha do tempo da Controladoria
    const notaAuditoria = { // -> Prepara o pacote de texto inalterável de histórico de caixa.
      conteudo: `CONCILIAÇÃO TESOURARIA: Parcela #${numeroParcela} marcada como ${acaoSucesso ? "PAGA / LIQUIDADA" : "ESTORNADA / INADIMPLENTE"} via painel financeiro direto.`, // -> Texto descritivo.
      dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Tempo da comanda.
    }; // -> Encerra a ata.

    const pacoteParaFirestore = { // -> Prepara o espelho final do documento atualizado para arremessar na nuvem.
      ...clienteAlvo, // -> Clona os dados macros de nascimento da dívida.
      planoParcelas: planoAtualizado, // -> Injeta a tabela Price reajustada com a baixa.
      historicoNotas: [notaAuditoria, ...(clienteAlvo.historicoNotas || [])] // -> Registra o rastro indelével na ata.
    }; // -> Encerra a montagem do documento.

    if (aoMudarStatusDireto) { // -> Dispara o motor assíncrono que já ligamos no mestre App.jsx.
      await updateDoc(doc(db, "cobrancas", idCobrancaRaiz), pacoteParaFirestore); // -> Sobrescreve o lote completo direto no Firestore da Google.
      alert(`🟩 CONCILIAÇÃO BANCÁRIA PROCESSADA!\nParcela #${numeroParcela} de "${clienteAlvo.cliente}" atualizada em tempo real no Firestore.`); // -> Feedback visual de sucesso.
    } // -> Fim da barreira protetora.
  }; // -> Encerra o motor de baixas.

  return ( // -> Renderiza o painel executivo de Controladoria.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 🏛️ GRID SUPERIOR DE DESEMPENHO: BIG NUMBERS BRUTAIS DE TESOURARIA */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        
        {/* CARD 1: LIQUIDADO */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #10b981" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <Wallet size={12} strokeWidth={2.5} style={{ color: "#10b981" }} /> {/* -> Troca o visto antigo pelo componente carteira financeira fina do Lucide. */}
            <span>Dinheiro Líquido em Caixa</span>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#065f46", marginTop: "4px" }}>R$ {caixaPagoLiquidado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Sua comissão bruta: R$ {honorariosBrutosAcumulados.toLocaleString("pt-BR")}</div>
        </div>

        {/* CARD 2: VENCIDO */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #ef4444" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <AlertTriangle size={12} strokeWidth={2.5} style={{ color: "#ef4444" }} /> {/* -> Troca o alerta antigo pelo triângulo de atenção fino em vetor do Lucide. */}
            <span>Inadimplência Ativa (Vencidos)</span>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#991b1b", marginTop: "4px" }}>R$ {caixaVencidoInadimplente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px", fontWeight: "700" }}>Gargalo real: Alvo prioritário de ligações.</div>
        </div>

        {/* CARD 3: PREVISÃO DE ENTRADA */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #2563eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <TrendingUp size={12} strokeWidth={2.5} style={{ color: "#2563eb" }} /> {/* -> Troca o gráfico antigo pelo vetor fino de tendência em crescimento do Lucide. */}
            <span>Previsibilidade de Caixa (A Vencer)</span>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#1e40af", marginTop: "4px" }}>R$ {caixaAVencerFluxo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Capital escalonado nos meses futuros.</div>
        </div>

        {/* CARD 4: RETENÇÃO FISCAL SIMULADA */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #0f172a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <Percent size={12} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Troca o prédio antigo pelo ícone fino de porcentagem tributária do Lucide. */}
            <span>Provisão Fiscal (Impostos de Nota)</span>
          </div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>R$ {impostosPrevisaoRetencao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Calculado com alíquota mestre de 15%.</div>
        </div>

      </div>

      {/* 📑 TOOLBAR DA CONTROLADORIA (FILTROS DE RISCO DO CLICKUP) */}
      <div style={{ backgroundColor: "#ffffff", padding: "14px 20px", borderRadius: "10px 10px 0 0", border: "1px solid #e2e8f0", borderBottom: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        
        {/* PÍLULAS DE SITUAÇÃO DE RISCO (ALA ESQUERDA) */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", color: "#475569", paddingRight: "4px" }}>
            <SlidersHorizontal size={14} strokeWidth={2.5} /> {/* -> Injeta a engrenagem transversal fina del Lucide em substituição à prancheta anterior. */}
          </div>
          {["Todos", "vencido", "a_vencer", "pago"].map((tipo) => ( // -> Varre a lista estática desenhando os botões seletores de relatórios.
            <button
              key={tipo} // -> Chave identificadora única do React.
              type="button" // -> Tipo botão nativo contra eventos falsos de formulário.
              onClick={() => setFiltroSituacao(tipo)} // -> Limpa ou filtra o pool de parcelas Price na RAM.
              style={{
                backgroundColor: filtroSituacao === tipo ? "#0f172a" : "#f1f5f9", // -> Destaca em azul escuro a pílula clicada.
                color: filtroSituacao === tipo ? "#ffffff" : "#475569", // -> Texto branco para o ativo, cinza ardósia para o inativo.
                border: "none", // -> Remove contornos antigos.
                padding: "6px 14px", // -> Margem interna compacta.
                borderRadius: "6px", // -> Cantos arredondados padrão.
                fontSize: "12px", // -> Tamanho regular de texto.
                fontWeight: "700", // -> Força negrito destacado.
                cursor: "pointer", // -> Ponteiro indicador de clique ativo.
                transition: "all 0.2s ease" // -> Transição suave de preenchimento.
              }}
            >
              {tipo === "Todos" && `Todas as Promessas (${todasAsParcelasDaCarteira.length})`} {/* -> Higienizado de emojis rudimentares internos. */}
              {tipo === "vencido" && `Vencidas / Atrasadas (${todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "vencido").length})`} {/* -> Higienizado de emojis rudimentares internos. */}
              {tipo === "a_vencer" && `Fluxo Futuro A Vencer (${todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "a_vencer").length})`} {/* -> Higienizado de emojis rudimentares internos. */}
              {tipo === "pago" && `Pagas / Conciliadas (${todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").length})`} {/* -> Higienizado de emojis rudimentares internos. */}
            </button> // -> Encerra o botão individual de filtro de risco.
          ))}
        </div>

        {/* BARRA DE PESQUISA POR EMPRESA (ALA DIREITA) */}
        <div style={{ minWidth: "280px", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#ffffff", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", width: "100%", boxSizing: "border-box" }}>
            <Search size={13} strokeWidth={2.5} style={{ color: "#94a3b8", flexShrink: 0 }} /> {/* -> Injeta o componente sutil de busca vazado do Lucide removendo o caractere de lupa manual. */}
            <input
              type="text" // -> Tipo texto convencional.
              placeholder="Buscar por Razão Social ou Código Conta..." // -> Frase explicativa flutuante higienizada.
              value={buscaEmpresa} // -> Vincula o texto ao estado de memória ram.
              onChange={(e) => setBuscaEmpresa(e.target.value)} // -> Monitora caractere por caractere refinando o caixa.
              style={{ width: "100%", border: "none", background: "none", fontSize: "12px", color: "#0f172a", outline: "none", paddingLeft: "4px" }} // -> Input limpo inline integrado à caixa flexbox.
            />
          </div>
        </div>

      </div>

      {/* 📑 MESA DE LIQUIDAÇÃO: A SUPER TABELA DE CONTROLE DE PARCELAS */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0 0 12px 12px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
              <th style={{ padding: "14px 20px", width: "90px" }}>CONTA</th>
              <th style={{ padding: "14px 20px" }}>EMPRESA DEVEDORA (PLANO PRICE)</th>
              <th style={{ padding: "14px 20px", width: "110px" }}>Nº PARCELA</th>
              <th style={{ padding: "14px 20px", width: "140px" }}>VENCIMENTO</th>
              <th style={{ padding: "14px 20px", width: "130px" }}>RISCO CRONO</th>
              <th style={{ padding: "14px 20px", textAlign: "right", width: "150px" }}>VALOR BRUTO</th>
              <th style={{ padding: "14px 20px", textAlign: "right", width: "140px" }}>HONORÁRIOS (20%)</th>
              <th style={{ padding: "14px 20px", textAlign: "center", width: "120px" }}>CONCILIAR</th>
            </tr>
          </thead>

          <tbody style={{ color: "#0f172a", fontWeight: "600" }}>
            {parcelasFiltradas.length === 0 ? ( // -> Condicional de UX: se a grade de faturamento estiver deserta.
              <tr>
                <td colSpan="8" style={{ padding: "40px 20px", backgroundColor: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#64748b", fontSize: "12px", fontStyle: "italic" }}>
                    <FolderMinus size={14} strokeWidth={2} /> {/* -> Troca a caixa vazada antiga pela pasta de exclusão sutil do Lucide. */}
                    <span>Nenhuma promessa de pagamento em aberto ou registrada na situação selecionada.</span>
                  </div>
                </td>
              </tr>
            ) : ( // -> Caso existam boletos filtrados na esteira, inicia o mapa de linhas.
              parcelasFiltradas.map((parcela, index) => ( // 🛠️ CORREÇÃO CIRÚRGICA DE PERFORMANCE: Capturado o index nativo como segundo parâmetro do loop map.
                <tr
                  key={`${parcela.idUnicaCobranca}-${parcela.numero}-${index}`} // 🛠️ CORREÇÃO CIRÚRGICA DE PERFORMANCE: Soldada uma chave composta inviolável para expurgar o Warning de Keys e re-estabilizar os cliques.
                  style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff", transition: "background 0.2s" }} // -> Linha branca com divisória fina.
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f8fafc"; }} // -> Acende em cinza leve no mouseover.
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }} // -> Apaga a cor ao afastar o mouse.
                >
                  {/* CÉLULA: ID NUMÉRICO */}
                  <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "12px" }}>
                    #{parcela.codigoConta}
                  </td>

                  {/* CÉLULA: RAZÃO SOCIAL CAIXA ALTA */}
                  <td style={{ padding: "14px 20px", textTransform: "uppercase", color: "#0f172a" }}>
                    {parcela.razaoSocial}
                  </td>

                  {/* CÉLULA: NÚMERO DO MÊS */}
                  <td style={{ padding: "14px 20px", color: "#334155" }}>
                    {parcela.numero}ª Parcela
                  </td>

                  {/* CÉLULA: DATA DE VENCIMENTO FORMATADA BR */}
                  <td style={{ padding: "14px 20px", color: "#475569" }}>
                    {parcela.vencimento.split("-").reverse().join("/")} {/* -> Fatia e inverte a string americana para o formato nacional DD/MM/AAAA. */}
                  </td>

                  {/* CÉLULA: ETIQUETA CRONOLÓGICA SÓBRIA DE MERCADO */}
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        background: 
                          parcela.situacaoReal === "pago" ? "#d1fae5" : 
                          parcela.situacaoReal === "vencido" ? "#fee2e2" : "#dbeafe", // -> Selo verde para pago, vermelho para vencido, azul para prazo.
                        color: 
                          parcela.situacaoReal === "pago" ? "#065f46" : 
                          parcela.situacaoReal === "vencido" ? "#991b1b" : "#1e40af", // -> Semáforo industrial de fontes combinando.
                        padding: "4px 10px", // -> Padding oval.
                        borderRadius: "20px", // -> Formato arredondado.
                        fontSize: "11px", // -> Fonte densa.
                        fontWeight: "800", // -> Negrito de destaque.
                        textTransform: "uppercase" // -> Caixa alta rígida.
                      }}
                    >
                      {parcela.situacaoReal === "pago" && "Liquidado"} {/* -> Higienizado de emojis rudimentares internos. */}
                      {parcela.situacaoReal === "vencido" && "Atrasado"} {/* -> Higienizado de emojis rudimentares internos. */}
                      {parcela.situacaoReal === "a_vencer" && "No Prazo"} {/* -> Higienizado de emojis rudimentares internos. */}
                    </span>
                  </td>

                  {/* CÉLULA: VALOR MONETÁRIO BRUTO */}
                  <td style={{ padding: "14px 20px", textAlign: "right", color: "#0f172a", fontWeight: "800" }}>
                    R$ {parcela.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* -> Formata o preço bruto em reais reativamente. */}
                  </td>

                  {/* CÉLULA: SPLIT 20% DE HONORÁRIOS DO ESCRITÓRIO */}
                  <td style={{ padding: "14px 20px", textAlign: "right", color: "#2563eb", fontWeight: "700" }}>
                    R$ {parcela.splitHonorarios.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* -> Formata a comissão líquida em reais reativamente. */}
                  </td>

                  {/* CÉLULA INTERATIVA: BOTÕES CIRÚRGICOS DE CONCILIAÇÃO RÁPIDA (BAIXA DIRETA) */}
                  <td style={{ padding: "14px 20px", textAlign: "center" }}>
                    {parcela.pago ? ( // -> Abre a condição: se a fatura estiver paga, habilita o botão de desfazer.
                      <button
                        type="button" // -> Executa o estorno do Pix voltando o item a ser considerado inadimplente.
                        onClick={() => lidarComConciliacaoParcela(parcela.idUnicaCobranca, parcela.numero, false)} // -> Aciona o estorno síncrono.
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", padding: "4px 8px", transition: "opacity 0.15s" }} 
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 0.7}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                        title="Estornar recebimento e reabrir inadimplência" // -> Legenda técnica em português ao pairar o mouse.
                      >
                        <Undo2 size={11} strokeWidth={2.5} /> {/* -> Substitui o emoji de seta torta pelo vetor sutil de retorno técnico Undo2 do Lucide. */}
                        <span>Estornar</span>
                      </button>
                    ) : ( // -> Caso a parcela esteja em aberto, libera o gatilho verde de liquidação de caixa.
                      <button
                        type="button" // -> Executa a baixa e concilia o dinheiro na conta corrente jurídica.
                        onClick={() => lidarComConciliacaoParcela(parcela.idUnicaCobranca, parcela.numero, true)} // -> Aciona a baixa síncrona.
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#10b981", border: "none", color: "white", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }} // -> Botão sólido verde.
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f9f67"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
                        title="Confirmar entrada de Pix e dar baixa na parcela" // -> Legenda técnica em português ao pairar o mouse.
                      >
                        <Check size={11} strokeWidth={2.5} /> {/* -> Substitui a marca de visto emoji pelo componente de checação fino e vazado do Lucide. */}
                        <span>Baixar</span>
                      </button>
                    )}
                  </td>
                </tr> // -> Encerra a fileira individual da fatura.
              )) // -> Termina o laço do loop map.
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}