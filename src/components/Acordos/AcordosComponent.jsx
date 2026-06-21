// [Dev Sênior] Componente de Controladoria de Caixa encarregado de simular parcelamentos Price, projetar fluxos de caixa e liquidar títulos. -> Inicia o arquivo trazendo as ferramentas visuais do React.
import React, { useState, useEffect } from "react"; // -> Importa o núcleo do React e os ganchos de memória viva (useState) e monitoramento de arranque (useEffect).
import { db } from "../../config/firebase"; // -> Conecta o componente direto com o barramento de rede e chaves do banco de dados na nuvem da DOCULOC.
import { doc, updateDoc, arrayUnion } from "firebase/firestore"; // -> Puxa os comandos cirúrgicos do Firebase para atualizar documentos e anexar itens em arrays de forma atômica.
import { Calculator, CheckCircle2, TrendingUp, AlertCircle, FileText, Landmark, ShieldCheck, X } from "lucide-react"; // -> Injeta os ícones monocromáticos finos e sóbrios da biblioteca Lucide para manter a estética executiva.

export function AcordosComponent({ card, aoSalvarProntuário }) { // -> Declara e exporta o componente de acordos recebendo o devedor em foco (card) e a função de salvamento do mestre.
  // === Estados Reativos de Simulação Financeira === -> Comentário do sênior demarcando a área de cálculo reativo em RAM.
  const [qtdParcelas, setQtdParcelas] = useState(1); // -> Guarda na memória o número de meses digitado pelo operador para fatiar a dívida (padrão: 1 parcela).
  const [tipoPagamento, setTipoPagamento] = useState("Boleto"); // -> Monitora o meio de pagamento selecionado no dropdown (Boleto, Pix ou Cartão).
  const [parcelasSimuladas, setParcelasSimuladas] = useState([]); // -> Armazena o array de parcelas calculadas matematicamente com datas de vencimento futuras.
  const [valorTotalAcordo, setValorTotalAcordo] = useState(0); // -> Guarda o somatório bruto de todas as Notas Fiscais ativas contidas dentro da sacola do devedor.

  // === Flag de Segurança: Efeito de Carga de Dados e Pré-preenchimento === -> Garante o cumprimento estrito da regra de campos preenchidos.
  useEffect(() => { // -> Roda um monitor automático sempre que o devedor em foco (card) for aberto ou modificado pelo cobrador.
    if (card && card.titulos) { // -> Trava de segurança: checa se o objeto do devedor existe e possui uma sacola de Notas Fiscais legítima.
      const somaNotas = card.titulos.reduce((acc, nota) => acc + (parseFloat(nota.valorNota) || 0), 0); // -> Varre a sacola de Notas Fiscais somando o valor de cada uma em formato numérico Double real.
      setValorTotalAcordo(somaNotas); // -> Atualiza o estado reativo com a soma real acumulada de todos os títulos em aberto.
      
      // Pré-preenchimento estrito de dados salvos anteriormente no banco NoSQL -> Evita perda de progresso do operador.
      if (card.proposta) { // -> Verifica se esse cliente já possui um rascunho de acordo salvo previamente no Firestore.
        setQtdParcelas(card.proposta.qtdParcelas || 1); // -> Resgata e pré-preenche a quantidade de parcelas que o operador já havia negociado.
        setTipoPagamento(card.proposta.tipoPagamento || "Boleto"); // -> Configura o dropdown com o meio de pagamento exato que foi acordado.
        setParcelasSimuladas(card.proposta.parcelasSimuladas || []); // -> Aloca as parcelas físicas com seus respectivos status de pagamento na tela.
      } else { // -> Caso seja um devedor inédito sem nenhuma negociação iniciada:
        setParcelasSimuladas([]); // -> Reseta a prancha limpando simulações fantasmas de outros clientes.
      }
    } // -> Encerra a trava de checagem física do devedor.
  }, [card]); // -> Indica que este efeito é disparado novamente de forma reativa toda vez que o card em foco mudar.

  // === Motor Matemático: Cálculo de Parcelamento Simples / Price === -> Realiza os cálculos de fatiamento de saldo na memória RAM.
  const simularParcelasMesa = () => { // -> Declara a função acionada pelo botão de simulação para gerar a tabela de projeção de caixa.
    if (valorTotalAcordo <= 0 || qtdParcelas <= 0) return; // -> Barreira de segurança: aborta se a dívida for zero ou o número de meses for inválido.

    const listaParcelas = []; // -> Cria uma esteira temporária em branco para organizar os meses calculados.
    const valorCadaParcela = (valorTotalAcordo / qtdParcelas); // -> Aplica a divisão matemática básica dividindo o bolo total pelo número de parcelas.
    const dataBaseHoje = new Date(); // -> Captura o calendário e a data corrente do sistema para projetar os vencimentos.

    for (let i = 1; i <= qtdParcelas; i++) { // -> Abre um laço de repetição (loop) para fabricar mês a mês cada parcela do acordo.
      const dataVencimentoParcela = new Date(); // -> Instancia um novo objeto de calendário para a parcela específica.
      dataVencimentoParcela.setMonth(dataBaseHoje.getMonth() + i); // -> Empurra o vencimento para frente adicionando "i" meses de carência (30, 60, 90 dias).
      
      listaParcelas.push({ // -> Aloca o objeto estruturado da parcela com suas flags de governança fiscal.
        numero: i, // -> Índice identificador da parcela (Ex: Parcela 1, Parcela 2).
        valor: parseFloat(valorCadaParcela.toFixed(2)), // -> Trava o valor monetário com precisão decimal estrita de duas casas centavais.
        vencimento: dataVencimentoParcela.toLocaleDateString("pt-BR"), // -> Transforma o calendário em string de formato brasileiro legível (DD/MM/AAAA).
        pago: false, // -> Inicializa a flag de quitação como falsa (pendente fiscal).
        status: "a_vencer" // -> Carimba o status inicial estável da parcela na esteira.
      }); // -> Encerra o empilhamento da parcela.
    } // -> Termina a fabricação das parcelas em lote na memória.
    setParcelasSimuladas(listaParcelas); // -> Despeja a esteira calculada no estado visual para desenhar a grade de fluxos de caixa imediatamente.
  }; // -> Encerra o motor matemático.

  // === Baixa Atômica de Títulos Individuais (Saneamento de Planilha) === -> Executa a liquidação cirúrgica de uma nota fiscal interna.
  const darBaixaIndividualTitulo = async (notaFiscalClicada) => { // -> Declara a rotina assíncrona responsável por intervir e dar baixa em uma NF específica.
    const confirmacao = window.confirm(`🚨 CONTROLADORIA DE CAIXA:\nDeseja dar baixa e liquidar permanentemente a Nota Fiscal/Referência "${notaFiscalClicada.referencia}" no valor de R$ ${notaFiscalClicada.valorNota.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}?`); // -> Pop-up nativo de barreira humana para evitar cliques acidentais de operadores.
    if (!confirmacao) return; // -> Aborta o processo imediatamente caso o operador clique em cancelar.

    try { // -> Escudo de proteção de rede para monitorar a transação assíncrona com os servidores do Google.
      const devedorDocRef = doc(db, "cobrancas", card.id); // -> Localiza a rota física exata da sacola de cobrança desse cliente no Firestore através do ID (CNPJ)[cite: 2].
      
      // Filtra e remove a nota fiscal liquidada da sacola antiga em tempo real -> Executa o expurgo em memória.
      const listaNotasFiscaisAtualizada = card.titulos.filter(nota => nota.referencia !== notaFiscalClicada.referencia); // -> Cria um novo array excluindo estritamente a nota fiscal que recebeu a baixa.
      const novoSaldoDívidaConsolidado = listaNotasFiscaisAtualizada.reduce((acc, nota) => acc + (parseFloat(nota.valorNota) || 0), 0); // -> Recalcula o saldo total restante da sacola com os títulos remanescentes.

      // Prepara o carimbo imutável de auditoria cronológica para a timeline -> Proteção jurídica contra fraudes.
      const notaAuditoria = { // -> Cria o payload de histórico de auditoria técnica.
        conteudo: `Liquidação de Título: A Nota Fiscal ${notaFiscalClicada.referencia} de R$ ${notaFiscalClicada.valorNota.toLocaleString("pt-BR")} foi baixada manualmente no módulo de acordos.`, // -> Mensagem descritiva clara contendo o valor abatido.
        dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Carimba o momento exato da baixa do boleto.
      }; // -> Fim do objeto de auditoria.

      // Atualiza o banco de dados remoto com o novo bolo financeiro recalculado -> Sincronismo instantâneo NoSQL.
      await updateDoc(devedorDocRef, { // -> Dispara o comando update parcial para o Firestore unificar as carteiras.
        titulos: listaNotasFiscaisAtualizada, // -> Substitui a sacola antiga pela nova lista higienizada livre da nota paga.
        valorVencido: novoSaldoDívidaConsolidado, // -> Atualiza a variável reativa de saldo para recalcular as cabeceiras de topo.
        valor: novoSaldoDívidaConsolidado, // -> Sincroniza os contadores numéricos globais do Kanban.
        historicoNotas: arrayUnion(notaAuditoria) // -> Anexa o log de auditoria de forma atômica no final do array histórico sem apagar os anteriores.
      }); // -> Fim da operação de rede.

      alert("🟩 TÍTULO LIQUIDADO!\n\nO saldo foi abatido do devedor com sucesso e registrado nos logs de auditoria."); // -> Fornece feedback humano amigável de conclusão.
      
      if (aoSalvarProntuário) { // -> Se o maestro repassou o gatilho reativo de fechamento de cortina:
        // Atualiza a memória de visualização do prontuário para refletir a baixa em tempo real na tela do operador sem F5.
        aoSalvarProntuário(card.id, { ...card, titulos: listaNotasFiscaisAtualizada, valorVencido: novoSaldoDívidaConsolidado, valor: novoSaldoDívidaConsolidado });
      }
    } catch (err) { // -> Captura falhas se a internet cair no momento do disparo.
      alert("Erro crítico de barramento NoSQL ao liquidar Nota Fiscal!"); // -> Notifica o erro técnico preventivo.
    } // -> Fim do bloco de segurança.
  }; // -> Encerra a função de baixa atômica.

  // === Gravação Consolidada do Acordo no Firestore === -> Conclui a negociação e sela as parcelas Price no cofre.
  const consolidarAcordoNoBanco = async () => { // -> Função que pega os rascunhos de parcelas calculadas e joga na nuvem.
    if (parcelasSimuladas.length === 0) { // -> Trava de segurança: impede salvar o acordo se o operador não clicou em calcular antes.
      alert("⚠️ MESA DE NEGOCIAÇÃO:\n\nPor favor, clique no botão 'Calcular Parcelas' antes de gravar o acordo."); // -> Alerta a instrução na tela.
      return; // -> Aborta o salvamento.
    } // -> Fim da barreira.

    try { // -> Escudo de proteção de rede.
      const devedorDocRef = doc(db, "cobrancas", card.id); // -> Conecta com a rota física fixa do documento do devedor[cite: 2].
      
      const pacotePropostaPrice = { // -> Prepara o sub-objeto de acordo Price mapeado nas diretrizes estáveis do CRM.
        dataPrimeiroVencimento: parcelasSimuladas[0]?.vencimento || "2026-06-11", // -> Sincroniza a data inicial com o primeiro vencimento projetado.
        tipoPagamento: tipoPagamento, // -> Salva o meio de faturamento escolhido (Boleto/Pix).
        qtdParcelas: parseInt(qtdParcelas) || 1, // -> Força a conversão do número de meses em inteiro numérico puro.
        valorCobrado: valorTotalAcordo, // -> Persiste o saldo nominal total negociado.
        parcelasSimuladas: parcelasSimuladas // -> Acopla o array completo de meses calculados com flags de visto falso para acompanhamento.
      }; // -> Fim da montagem.

      const notaAuditoriaAcordo = { // -> Cria o payload de log de alteração de fase.
        conteudo: `Acordo Comercial Formalizado: Dívida total de R$ ${valorTotalAcordo.toLocaleString("pt-BR")} parcelada em ${qtdParcelas}x via ${tipoPagamento}. Card movido para esteira de acordos.`, // -> Mensagem clara detalhando o parcelamento para fins de compliance.
        dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Carimba data e hora.
      }; // -> Fim do log.

      // Executa a mutação protetora no Firebase mudando a fase e blindando contra novas cargas de planilhas -> Core NoSQL.
      await updateDoc(devedorDocRef, { // -> Invoca o método update (parcial) que altera propriedades sem destruir os dados de nascimento.
        proposta: pacotePropostaPrice, // -> Acopla o sub-objeto Price normalizado na gaveta do devedor.
        status: "acordo", // -> Altera a raia do funil Kanban de forma fixa para a calha estável "acordo", protegendo o card contra resets semanais.
        categoria: "em_andamento", // -> Mantém a classificação gerencial de esteira ativa.
        historicoNotas: arrayUnion(notaAuditoriaAcordo) // -> Injeta o log no array histórico atômico do Firebase.
      }); // -> Fim da gravação de rede.

      alert(`🟩 ACORDO CONSOLIDADO!\n\nO plano de recebíveis do cliente "${card.cliente || "Devedor"}" foi gravado na nuvem. O card foi movido para a raia de Acordos.`); // -> Exibe aviso de vitória operacional.
      
      if (aoSalvarProntuário) { // -> Se o maestro enviou o gatilho reativo:
        // Sincroniza a memória interna do prontuário tridimensional de forma imediata na tela do cobrador.
        aoSalvarProntuário(card.id, { ...card, status: "acordo", categoria: "em_andamento", proposta: pacotePropostaPrice });
      }
    } catch (err) { // -> Trata quedas de conexão ou indisponibilidade do Firebase.
      alert("Falha crítica de barramento ao consolidar acordo comercial!"); // -> Notifica o operador.
    } // -> Fim do bloco catch.
  }; // -> Encerra o consolidador de acordos.

  return ( // -> Dispara o desenho da interface da controladoria financeira com estilos inline seguros em tons de azul escuro e cinza.
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", fontFamily: "sans-serif" }}> {/* -> Empilhador vertical denso de alta performance visual. */}
      
      {/* SEÇÃO 1: SACRE DE NOTAS FISCAIS (EXIBIÇÃO E BAIXA INDIVIDUAL) */}
      <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}> {/* -> Bloco cinza claro para destacar a sacola de faturas em aberto. */}
        <h4 style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
          <FileText size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Ícone vetorial de documento do Lucide. */}
          <span>Títulos Vinculados na Sacola (Aba Analítica)</span>
        </h4> {/* -> Título técnico limpo livre de emojis infantis. */}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "160px", overflowY: "auto", paddingRight: "4px" }}> {/* -> Contêiner com rolagem vertical caso o cliente possua dezenas de Notas Fiscais no ERP. */}
          {!card.titulos || card.titulos.length === 0 ? ( // -> Se a sacola NoSQL de Notas Fiscais vier vazia ou zerada:
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontStyle: "italic", textAlign: "center", padding: "10px" }}>Nenhum título fiscal em aberto localizado para esta conta.</p> // -> Renderiza o texto informativo padrão de erro de carga.
          ) : ( // -> Havendo Notas Fiscais válidas ativas na sacola:
            card.titulos.map((nota, idx) => ( // -> Mapeia a listagem fabricando linhas de faturamento individuais organizadas.
              <div key={idx} style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}> {/* -> Cartão branco individual da Nota Fiscal com alinhamento flexbox horizontal. */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}> {/* -> Agrupador de textos fiscais alinhados à esquerda. */}
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>Ref/NF: {nota.referencia || "Sem Ref"}</span> {/* -> Exibe o código de referência da Nota Fiscal extraído do Excel. */}
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Vencimento original: <b style={{ color: "#2563eb" }}>{nota.vencimentoLiquido || "S/D"}</b> • Doc: #{nota.numDocumento}</span> {/* -> Detalha a data de vencimento e número do contrato comercial. */}
                </div> {/* -> Fim do agrupador de textos. */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}> {/* -> Agrupador do valor monetário e botão de intervenção à direita. */}
                  <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>R$ {(parseFloat(nota.valorNota) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> {/* -> Formata o valor bruto da nota para a moeda real brasileira. */}
                  <button 
                    type="button" 
                    onClick={() => darBaixaIndividualTitulo(nota)} // -> Ouve o clique do mouse e dispara o gatilho assíncrono de baixa atômica no Firestore.
                    title="Dar baixa e liquidar este título individual da conta" 
                    style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fca5a5"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                  >
                    Liquidar
                  </button> {/* -> Botão sóbrio vermelho de baixa individual. */}
                </div> {/* -> Fim do agrupador de ações. */}
              </div> // -> Encerra o cartão da Nota Fiscal.
            )) // -> Encerra o mapeamento map.
          )} {/* -> Encerra a árvore de decisão condicional. */}
        </div> {/* -> Fecha o contêiner com rolagem. */}

        {/* EXIBIÇÃO DO SALDO DEVEDOR CONSOLIDADO DA SACOLA */}
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}> {/* -> Divisora horizontal sutil inferior de somatórios. */}
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>DÍVIDA TOTAL ACUMULADA:</span> {/* -> Rótulo formal em caixa alta. */}
          <span style={{ fontSize: "15px", fontWeight: "900", color: "#dc2626" }}>R$ {valorTotalAcordo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> {/* -> Exibe o valor do bolo financeiro consolidado em vermelho de destaque. */}
        </div> {/* -> Fim da linha de saldo. */}
      </div> {/* -> Encerra a Seção 1 de faturamentos. */}

      {/* SEÇÃO 2: COCKPIT DE SIMULAÇÃO DE PARCELAMENTO (ESTRATÉGIA PRICE) */}
      <div style={{ background: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}> {/* -> Bloco branco estrutural para simulação de planos de recebíveis. */}
        <h4 style={{ margin: "0 0 14px 0", fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
          <Calculator size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Ícone vetorial de calculadora fina do Lucide. */}
          <span>Simulador de Acordos e Plano de Recebíveis</span>
        </h4> {/* -> Título em caixa alta no padrão corporativo. */}

        {/* FORMULÁRIO DE SIMULAÇÃO: INPUTS LADO A LADO */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}> {/* -> Alinhador flexbox responsivo horizontal para os campos de fatiamento. */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: "120px", textAlign: "left" }}> {/* -> Coluna dedicada à digitação da quantidade de meses. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>NÚMERO DE PARCELAS</label> {/* -> Rótulo descritivo. */}
            <input type="number" min="1" max="48" value={qtdParcelas} onChange={(e) => setQtdParcelas(Math.max(1, parseInt(e.target.value) || i))} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", outline: "none", background: "#f8fafc" }} /> {/* -> Caixa numérica monitorada pelo estado reativo com trava mínima de 1 parcela. */}
          </div> {/* -> Fim da coluna de número de parcelas. */}

          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: "140px", textAlign: "left" }}> {/* -> Coluna dedicada ao meio de liquidação física. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>FORMA DE LIQUIDAÇÃO</label> {/* -> Rótulo descritivo. */}
            <select value={tipoPagamento} onChange={(e) => setTipoPagamento(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff", fontWeight: "700", cursor: "pointer", outline: "none" }}> {/* -> Menu suspenso reconfigurado em 12px densos. */}
              <option value="Boleto">Boleto Bancário Unificado</option> {/* -> Opção de cobrança via boleto. */}
              <option value="Pix">Chave Pix (Transferência Instantânea)</option> {/* -> Opção de cobrança via Pix. */}
              <option value="Cartão">Link de Cartão de Crédito</option> {/* -> Opção de cobrança via link de pagamento. */}
            </select> {/* -> Encerra o elemento select. */}
          </div> {/* -> Fim da coluna de meio de pagamento. */}

          {/* BOTÃO INTEGRADO DE DISPARO MATEMÁTICO */}
          <button 
            type="button" 
            onClick={simularParcelasMesa} // -> Ouve o clique do mouse e aciona o motor matemático de fatiamento simples na RAM.
            style={{ alignSelf: "flex-end", height: "30px", padding: "0 14px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", transition: "background 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
          >
            <TrendingUp size={13} strokeWidth={2.5} /> {/* -> Ícone vetorial de gráfico de crescimento do Lucide. */}
            <span>Calcular Parcelas</span>
          </button> {/* -> Botão sólido Azul Escuro Profundo da DOCULOC. */}
        </div> {/* -> Encerra a linha do formulário. */}

        {/* GRADE VISUAL: LISTAGEM DO FLUXO DE CAIXA PROJETADO (A GRADE DE PARCELAS) */}
        {parcelasSimuladas.length > 0 && ( // -> REGRA DE FLUXO: Só desenha a grade se houver pelo menos uma parcela calculada na memória RAM.
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "14px", borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}> {/* -> Empilhador vertical das fileiras de parcelas simuladas. */}
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.3px", textAlign: "left", marginBottom: "4px" }}>Projeção Cronológica de Recebíveis</span> {/* -> Rótulo formal de cabeçalho da grade. */}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto", paddingRight: "2px" }}> {/* -> Gaveta com rolagem interna para não estourar os limites verticais da janela do prontuário. */}
              {parcelasSimuladas.map((par) => ( // -> Percorre a lista de parcelas geradas pelo laço matemático desenhando as linhas na tela.
                <div key={par.numero} style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center" }}> {/* -> Fileira cinza claro individual da parcela com alinhamento flexbox horizontal. */}
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Parcela {par.numero} de {qtdParcelas}</span> {/* -> Identifica o número do mês correspondente (Ex: Parcela 1 de 3). */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> {/* -> Agrupador de data de vencimento e valor da parcela à direita. */}
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Vence em: <b style={{ color: "#0f172a" }}>{par.vencimento}</b></span> {/* -> Exibe a data de vencimento calculada para 30, 60 ou 90 dias à frente. */}
                    <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "4px", fontFamily: "monospace" }}>R$ {par.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> {/* -> Pílula azul claro destacando o valor centaval exato de cada parcela. */}
                  </div> {/* -> Fim do agrupador de dados da direita. */}
                </div> // -> Encerra a fileira da parcela.
              ))} {/* -> Encerra o loop map das parcelas. */}
            </div> {/* -> Fecha o contêiner com rolagem interna. */}

            {/* SEÇÃO FINAL: BOTÃO SOLIDO DE CRIAÇÃO DO ACORDO COM CHAVE DE TRAVA NO FIRESTORE */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}> {/* -> Alinhador horizontal direito com traço separador sutil. */}
              <button
                type="button"
                onClick={consolidarAcordoNoBanco} // -> Ouve o clique do mouse e dispara o método assíncrono mestre que grava as parcelas e trava o card na raia de Acordos da nuvem.
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "#16a34a", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#15803d"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
              >
                <ShieldCheck size={14} strokeWidth={2.5} /> {/* -> Ícone vetorial de escudo de proteção aprovado do Lucide. */}
                <span>Gravar e Selar Acordo Comercial</span>
              </button> {/* -> Botão sólido Verde de confirmação e salvaguarda de governança de dados. */}
            </div> {/* -> Fim do alinhador do rodapé. */}

          </div> // -> Encerra o bloco condicional da grade de fluxos de caixa.
        )} {/* -> Encerra a trava lógica da prancha de parcelas. */}
      </div> {/* -> Encerra a Seção 2 de simulação Price. */}

    </div> // -> Encerra o contêiner flexbox mestre absoluto do componente de acordos.
  );
}