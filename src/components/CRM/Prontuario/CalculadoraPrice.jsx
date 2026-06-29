import React, { useState, useEffect, useMemo } from "react"; // -> Traz a biblioteca mestre do React e os ganchos de estado, efeito e memorização para gerenciar a memória RAM local da calculadora de forma otimizada.
import { Coins, Percent, Calendar, LayoutGrid, Filter, Unlock, RefreshCw, Maximize2, X, Trash2 } from "lucide-react"; // -> Injeta a coleção de ícones vetoriais do Lucide calibrada para as ferramentas visuais financeiras.

export default function CalculadoraPrice({ card, valorOriginalDívida, categoriaBloqueada, aoSalvarLocal }) { // -> Declara a função do componente especialista recebendo os ganchos e dados do pai.
  
  // -> 1. PARAMETROS GERAIS DO TOPO (INTERAGEM COM A TABELA EM CASCATA REATIVA)
  const [multaGeral, setMultaGeral] = useState(card?.proposta?.parametrosAplicados?.multaGeral !== undefined ? card.proposta.parametrosAplicados.multaGeral : 0.00); // -> Inicializa com a multa gravada no Firebase ou zero por padrão.
  const [jurosGeral, setJurosGeral] = useState(card?.proposta?.parametrosAplicados?.jurosGeral !== undefined ? card.proposta.parametrosAplicados.jurosGeral : 2.00); // -> Inicializa com os juros gravados no Firebase ou dois por cento por padrão.
  const [dataAtualizacao, setDataAtualizacao] = useState(card?.proposta?.parametrosAplicados?.dataCorte || "2026-06-25"); // -> Inicializa com a data de corte gravada na nuvem ou o dia de hoje por padrão.

  // -> 2. PARÂMETROS DA ESTEIRA DE SELEÇÃO E SIMULAÇÃO DE PARCELAMENTO FUTURO
  const [propostaParcelas, setPropostaParcelas] = useState(card?.proposta?.qtdParcelas || 1); // -> Monitora a quantidade de parcelas fixas desejadas para a simulação.
  const [formaPagto, setFormaPagto] = useState(card?.proposta?.tipoPagamento || "Boleto"); // -> Captura a forma de faturamento escolhida pelo operador (Boleto/Pix).
  const [dataPrimeiroVenc, setDataPrimeiroVenc] = useState(card?.proposta?.dataPrimeiroVencimento || "2026-07-05"); // -> Guarda a data de carência estipulada para o primeiro pagamento.
  const [frequenciaCiclo, setFrequenciaCiclo] = useState("30"); // -> Controla o intervalo de dias entre parcelas (30 dias, 15 dias ou 7 dias).

  // -> 3. SHADOW STATE: Array clonado in RAM que carrega a tabela fiscal interativa e as customizações individuais por linha
  const [titulosSimulados, setTitulosSimulados] = useState([]);

  // -> 4. ESTADOS COMPLEMENTARES DE GOVERNANÇA, TRAVAS, DETECÇÃO DE ABAS E MODAL INTEGRADO
  const [mesaTravada, setMesaTravada] = useState(card?.status === "acordo"); // -> Monitora se a simulação atual já foi injetada no lote para bloquear alterações acidentais.
  const [menuFunilAberto, setMenuFunilAberto] = useState(false); // -> Controla a abertura da caixinha flutuante do funil de ocultação de colunas.
  const [modalTabelaAberto, setModalTabelaAberto] = useState(false); // -> CONTROLADOR DE VIEWPORT: Abre a tela cheia expansível para edições sem scroll.
  
  // -> COOKIE DE MEMÓRIA DE VIEWPORT DO OPERADOR: Carrega as preferências globais do LocalStorage ou define o padrão estrito pedido por ti
  const [colunasVisiveis, setColunasVisiveis] = useState(() => {
    const layoutSalvo = localStorage.getItem("doculoc_preferencia_colunas_price"); // -> Busca preferência guardada na máquina do cobrador.
    if (layoutSalvo) { // -> Se o layout existir localmente.
      try { return JSON.parse(layoutSalvo); } catch (e) { /* Fallback seguro */ } // -> Transpila a string em objeto estruturado.
    }
    return { // -> Visão limpa nativa pedida por ti para banir o scroll horizontal.
      contrato: false, nf: true, emissao: false, vencimento: true, valor: true,
      dias: false, jurosRs: true, jurosPct: false, multaRs: true, multaPct: false,
      custas: true, total: true, obs: false
    };
  });

  // -> CONFIGURAÇÃO DE SEGURANÇA FISCAL: Captura o saldo nominal estático original da dívida do card para travar o contador esquerdo de forma vitalícia
  const dividaAcumuladaBrutaFixa = useMemo(() => {
    return parseFloat(card?.valorVencido) || parseFloat(card?.valor) || 0; // -> Extrai matematicamente o principal bruto intocado.
  }, [card?.id]); // -> Vincula estritamente ao ID único do card para não flutuar com re-renderizações de propostas.

  // -> FUNÇÃO RESET EXPURGADOR CORRIGIDA: Limpa os parâmetros locais e devolve o card sem travas
  const lidarComZerarMesaProposta = () => {
    setMultaGeral(0.00); // -> Zera a multa geral na interface.
    setJurosGeral(2.00); // -> Restaura os juros gerais para dois por cento.
    setDataAtualizacao("2026-06-25"); // -> Retorna o calendário mestre para a data-base de hoje.
    setPropostaParcelas(1); // -> Restaura o plano para parcela única.
    setFrequenciaCiclo("30"); // -> Redefine o ciclo de cobrança para mensal.
    setDataPrimeiroVenc("2026-07-05"); // -> CORREÇÃO DAS DATAS: Vinculado corretamente a função de estado original para banir o erro e o bug do NaN.
    
    let faturasLimpas = []; // -> Declara array de buffer.
    if (card?.titulos) { // -> Se houver notas fiscais indexadas no devedor.
      faturasLimpas = card.titulos.map(t => ({ // -> Limpa os inputs por fatura individual.
        ...t,
        jurosPercentualIndividual: 2.00,
        multaPercentualIndividual: 0.00,
        custasProtestoIndividual: 0.00,
        observacaoIndividual: "",
        editadoManualmente: false
      }));
      setTitulosSimulados(faturasLimpas); // -> Alimenta a planilha local limpa.
    }

    const payloadResetCompleto = { // -> Monta o pacote NoSQL purificado para o Firestore.
      ...card,
      status: "atendimento", // -> Limpa a raia CRM removendo a tag acordo do lote instantaneamente.
      proposta: null, // -> Deleta o sub-objeto de parcelamentos Price.
      planoParcelas: [], // -> Expuga as faturas futuras agendadas.
      titulos: faturasLimpas // -> Conecta o array de notas sem acréscimos.
    };

    aoSalvarLocal(payloadResetCompleto); // -> Despacha as modificações de limpeza de tags para o prontuário.
    setMesaTravada(false); // -> Desbloqueia as travas de inputs da tela síncronamente no reset.
    alert("🔄 PROPOSTA EXPURGADA DO LOTE!\n\nAs travas foram removidas e a tag de acordo foi desfeita. Clique em 'Salvar Prontuário' para efetivar a remoção no Firebase.");
  };

  // -> GATILHO REATIVO DE INICIALIZAÇÃO E CARGA DO CARTÃO NO COFRE LOCAL (BLINDADO CONTRA OVERWRITES)
  useEffect(() => { // -> Sincroniza a esteira quando o operador opens o prontuário.
    const deParaSacola = card?.titulos && card.titulos.length > 0 
      ? card.titulos 
      : [{
          numDocumento: card?.numDocumento || 0,
          referencia: card?.referencia || "025070-A",
          atribuicao: card?.atribuicao || "Não Especificada",
          dataDocumento: card?.dataDocumento || "2026-02-28",
          vencimentoLiquido: card?.vencimentoLiquido || "2026-03-25",
          valorNota: parseFloat(card?.valorVencido) || 0,
          executivoVendas: card?.executivoVendas || "Não Informado"
        }];

    const sacolaMapeada = deParaSacola.map((t) => { // -> Injeta as colunas dinâmicas editáveis e calculadas em cada linha.
      const jaExisteJuros = t.jurosPercentualIndividual !== undefined; // -> Verifica se o título já carrega histórico.
      return {
        ...t, 
        jurosPercentualIndividual: jaExisteJuros ? parseFloat(t.jurosPercentualIndividual) : jurosGeral, 
        multaPercentualIndividual: t.multaPercentualIndividual !== undefined ? parseFloat(t.multaPercentualIndividual) : multaGeral, 
        custasProtestoIndividual: parseFloat(t.custasProtestoIndividual) || 0.00, 
        observacaoIndividual: t.observacaoIndividual || "", 
        editadoManualmente: t.editadoManualmente || false 
      };
    });
    setTitulosSimulados(sacolaMapeada); 
    
    // ANCORAGEM COMPACTA: Se o card carregado já possuir proposta homologada ativa na nuvem, trava os campos com os valores históricos salvos
    if (card?.proposta) {
      setMultaGeral(card.proposta.parametrosAplicados?.multaGeral || 0.00);
      setJurosGeral(card.proposta.parametrosAplicados?.jurosGeral || 2.00);
      setDataAtualizacao(card.proposta.parametrosAplicados?.dataCorte || "2026-06-25");
      setPropostaParcelas(card.proposta.qtdParcelas || 1);
      setFormaPagto(card.proposta.tipoPagamento || "Boleto");
      setDataPrimeiroVenc(card.proposta.dataPrimeiroVencimento || "2026-07-05");
    } else { // -> CASO CONTRÁRIO (SE VIER APÓS UM RESET EXECUTADO COM SUCESSO NO BANCO):
      setMultaGeral(0.00); // -> Desaloca o lixo da memória e reseta o input de multa para zero.
      setJurosGeral(2.00); // -> Desaloca o lixo da memória e retorna o juros padrão para dois por cento.
      setPropostaParcelas(1); // -> Reseta a quantidade de parcelas no visor para uma única fatura.
      setDataPrimeiroVenc("2026-07-05"); // -> Restaura a data de carência original padrão do sistema.
    }
    setMesaTravada(card?.status === "acordo"); // -> Sincroniza rigidamente o travamento dos botões.
  }, [card?.id, card?.proposta]); // -> RECALIBRADO: Vigia também a exclusão do nó de proposta para limpar os inputs no mesmo segundo.

  // -> GATILHO DE RE-CALCULO EM CASCATA QUANDO OS PARÂMETROS DO TOPO COMUTAM
  useEffect(() => { 
    if (mesaTravada) return; // -> Impede o re-cálculo automático em cascata se a proposta já estiver fechada e travada.
    setTitulosSimulados(prev => 
      prev.map(t => t.editadoManualmente ? t : { 
        ...t,
        jurosPercentualIndividual: jurosGeral,
        multaPercentualIndividual: multaGeral
      })
    );
  }, [jurosGeral, multaGeral, mesaTravada]); 

  // 🧮 MOTOR DE CÁLCULO CRONOLÓGICO BLINDADO CONTRA DESVIOS DE FUSO HORÁRIO (CORREÇÃO DE DIAS E MORA)
  const processarLinhaPlanilha = (t) => { // -> Faz a apuração fiscal por título.
    const valorReal = parseFloat(t.valorNota) || 0; // -> Captura a nota pura em formato numérico.
    
    let diasAtraso = 0; // -> Inicializa o contador cronológico de dias.
    if (dataAtualizacao && t.vencimentoLiquido) { // -> Se ambas as datas estiverem preenchidas em formato de texto.
      const pCorte = dataAtualizacao.split("-"); // -> Quebra a string da data de corte do topo pelos hifens padrão.
      
      // 🛡️ TRATAMENTO DINÂMICO DE FORMATO DE DATA BRASILEIRO (BARRAS) VS INTERNACIONAL (HIFENS):
      let pVenc; // -> Declara a caixinha vazia que guardará as partes do vencimento divididas de forma limpa.
      if (t.vencimentoLiquido.includes("/")) { // -> Se a data do banco vier com barras ("19/04/2026") do Excel.
        const partesBr = t.vencimentoLiquido.split("/"); // -> Desmembra o texto quebrando pelas barras em dia, mês e ano.
        pVenc = [partesBr[2], partesBr[1], partesBr[0]]; // -> Reorganiza a fila colocando o Ano na primeira posição, o Mês na segunda e o Dia na terceira para alinhar com o javascript.
      } else { // -> Se a data já vier com hifens padrão ("2026-04-19").
        pVenc = t.vencimentoLiquido.split("-"); // -> Executa a quebra tradicional pelos hifens normalmente.
      }
      
      // 🛠️ FIX REATIVO DE FUSO HORÁRIO: Instancia os objetos de data forçando o relógio fixado ao meio-dia (12h), destruindo qualquer bug de fuso horário regional do navegador
      const dCorteLimpa = new Date(parseInt(pCorte[0]), parseInt(pCorte[1]) - 1, parseInt(pCorte[2]), 12, 0, 0); // -> Monta a data de corte controlada com ajuste de mês corrigido de base zero.
      const dVencLimpa = new Date(parseInt(pVenc[0]), parseInt(pVenc[1]) - 1, parseInt(pVenc[2]), 12, 0, 0); // -> Monta a data de vencimento da fatura controlada com ajuste de mês corrigido de base zero.
      
      const diferencaTempo = dCorteLimpa.getTime() - dVencLimpa.getTime(); // -> Extrai a distância absoluta convertida em milissegundos.
      diasAtraso = Math.max(0, Math.floor(diferencaTempo / (1000 * 60 * 60 * 24))); // -> Converte milissegundos para dias puros inteiros através de truncamento matemático seguro.
    }

    const taxaJurosDecimal = (parseFloat(t.jurosPercentualIndividual) || 0) / 100; // -> Transforma a taxa mensal de mora individual em número decimal puro.
    const jurosRsRaw = diasAtraso > 0 ? (diasAtraso * taxaJurosDecimal / 30) * valorReal : 0; // -> Aplica a fórmula pro-rata die real baseada nos dias exatos de atraso calculados sobre o valor principal.
    const jurosRs = parseFloat(jurosRsRaw.toFixed(2)); // -> Fixa a saída de juros em duas casas de centavos.

    const taxaMultaDecimal = (parseFloat(t.multaPercentualIndividual) || 0) / 100; // -> Transforma a taxa de multa em decimal.
    const multaRsRaw = diasAtraso > 0 ? valorReal * taxaMultaDecimal : 0; // -> Aplica a multa punitiva se houver ao menos um dia de quebra de contrato.
    const multaRs = parseFloat(multaRsRaw.toFixed(2)); // -> Trava centavos da multa.

    const custasReal = parseFloat(parseFloat(t.custasProtestoIndividual || 0).toFixed(2)); // -> Força precisão flutuante nas despesas cartorárias.
    const totalNegociadoLinha = parseFloat((valorReal + jurosRs + multaRs + custasReal).toFixed(2)); // -> Consolida a linha numa soma limpa com duas casas decimals.

    return { diasAtraso, jurosRs, multaRs, custasReal, totalNegociadoLinha }; // -> Libera os resultados formatados para as colunas da planilha.
  };

  const lidarMudancaInputTabela = (index, chave, valor) => { // -> Monitora mutações individuais de linha.
    if (mesaTravada) return; // -> Bloqueia mutações se travada.
    setTitulosSimulados(prev => prev.map((t, idx) => idx !== index ? t : {
      ...t,
      [chave]: valor,
      editadoManualmente: true 
    }));
  };

  const totalizadoresPlanilha = useMemo(() => { // -> Consolida os somatórios horizontais.
    let somaValor = 0; let somaJuros = 0; let somaMulta = 0; let somaCustas = 0; let somaTotal = 0;
    titulosSimulados.forEach(t => {
      const { jurosRs, multaRs, custasReal, totalNegociadoLinha } = processarLinhaPlanilha(t);
      somaValor += parseFloat(t.valorNota) || 0;
      somaJuros += jurosRs;
      somaMulta += multaRs;
      somaCustas += custasReal;
      somaTotal += totalNegociadoLinha;
    });
    return { // -> Libera os totais blindados e fixados.
      somaValor: parseFloat(somaValor.toFixed(2)), 
      somaJuros: parseFloat(somaJuros.toFixed(2)), 
      somaMulta: parseFloat(somaMulta.toFixed(2)), 
      somaCustas: parseFloat(somaCustas.toFixed(2)), 
      somaTotal: parseFloat(somaTotal.toFixed(2)) 
    };
  }, [titulosSimulados, dataAtualizacao]); // -> Atualiza as somas apenas se a sacola flutuar.

  const totalGeralAcordoAcumulado = totalizadoresPlanilha.somaTotal; // -> Abastece o saldo negociado com a soma real.
  const totalMesesParcelas = parseInt(propostaParcelas) || 1; 
  const valorDaParcelaFixaSimulada = parseFloat((totalGeralAcordoAcumulado / totalMesesParcelas).toFixed(2)); // -> Parcela fixada rigidamente em duas casas decimais.

  const gerarPreviewParcelasEstreia = () => { // -> Monta a esteira reativa do futuro.
    if (!dataPrimeiroVenc || isNaN(new Date(dataPrimeiroVenc + "T00:00:00").getTime())) {
      return []; 
    }
    let rascunho = []; 
    const intervaloDias = parseInt(frequenciaCiclo) || 30; 
    const dataMestreLargada = new Date(dataPrimeiroVenc + "T00:00:00");

    for (let i = 1; i <= totalMesesParcelas; i++) { 
      const dataCopiaLinha = new Date(dataMestreLargada.getTime()); 
      dataCopiaLinha.setDate(dataCopiaLinha.getDate() + ((i - 1) * intervaloDias)); 
      rascunho.push({ 
        numero: i,
        vencimento: dataCopiaLinha.getFullYear() + "-" + String(dataCopiaLinha.getMonth() + 1).padStart(2, "0") + "-" + String(dataCopiaLinha.getDate()).padStart(2, "0"), 
        valor: valorDaParcelaFixaSimulada
      });
    }
    return rascunho; 
  };
  const previewParcelasFila = gerarPreviewParcelasEstreia(); 

  const executingGravacaoPriceFirebase = () => { // -> Executa a injeção do faturamento.
    if (categoriaBloqueada) return; 

    const parcelasFinaisMapeadas = previewParcelasFila.map(p => ({ 
      numero: p.numero,
      valor: p.valor,
      vencimento: p.vencimento,
      pago: false,
      status: "a_vencer"
    }));

    const propuestaConsolidadaNoSQL = { 
      dataPrimeiroVencimento: dataPrimeiroVenc,
      tipoPagamento: formaPagto,
      qtdParcelas: totalMesesParcelas,
      valorCobrado: totalGeralAcordoAcumulado, 
      parcelasSimuladas: parcelasFinaisMapeadas,
      parametrosAplicados: { jurosGeral: parseFloat(jurosGeral.toFixed(2)), multaGeral: parseFloat(multaGeral.toFixed(2)), dataCorte: dataAtualizacao } 
    };

    const payloadCobrancaAtualizado = { 
      ...card,
      status: "acordo", 
      planoParcelas: parcelasFinaisMapeadas, 
      proposta: propuestaConsolidadaNoSQL, 
      titulos: titulosSimulados
    };

    aoSalvarLocal(payloadCobrancaAtualizado); // -> Empurra pro modal mestre.
    setMesaTravada(true); // -> Tranca os inputs em tela.
    alert("🟩 ACORDO INJETADO COM SUCESSO!\n\nAs informações foram anexadas ao buffer. Lembre-se de clicar em 'Salvar Prontuário' no rodapé mestre para persistir os dados no Firebase.");
  };

  const alternarVisibilidadeColuna = (coluna) => { 
    const novoLayout = { ...colunasVisiveis, [coluna]: !colunasVisiveis[coluna] };
    setColunasVisiveis(novoLayout);
    localStorage.setItem("doculoc_preferencia_colunas_price", JSON.stringify(novoLayout)); 
  };

  const renderizarEstruturaPlanilhaBase = (modoModalFreescroll = false) => { // -> Desenha as células HTML.
    return (
      <table style={{ width: "100%", minWidth: modoModalFreescroll ? "1300px" : "100%", borderCollapse: "collapse", fontSize: "11px", fontFamily: "monospace" }}>
        <thead style={{ background: "#64748b", color: "#ffffff" }}>
          <tr style={{ fontWeight: "800", borderBottom: "1px solid #475569" }}>
            {(colunasVisiveis.contrato || modoModalFreescroll) && <th style={{ padding: "6px 8px", textAlign: "left" }}>CONTRATO</th>}
            {(colunasVisiveis.nf || modoModalFreescroll) && (
              <th style={{ padding: "6px 8px", textAlign: "center", position: "relative" }}>
                {!modoModalFreescroll && (
                  <button type="button" onClick={() => setModalTabelaAberto(true)} style={{ position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }} title="Expandir planilha plena">
                    <Maximize2 size={11} />
                  </button>
                )}
                <span style={{ marginLeft: !modoModalFreescroll ? "14px" : 0 }}>NF</span>
              </th>
            )}
            {(colunasVisiveis.emissao || modoModalFreescroll) && <th style={{ padding: "6px 8px", textAlign: "center" }}>EMISSÃO</th>}
            {(colunasVisiveis.vencimento || modoModalFreescroll) && <th style={{ padding: "6px 8px", textAlign: "center" }}>VENCIMENTO</th>}
            {(colunasVisiveis.valor || modoModalFreescroll) && <th style={{ padding: "6px 8px", textAlign: "center" }}>VALOR R$</th>}
            {(colunasVisiveis.dias || modoModalFreescroll) && <th style={{ padding: "6px 8px", background: "#475569", textAlign: "center" }}>DIAS ATRASO</th>}
            {(colunasVisiveis.jurosRs || modoModalFreescroll) && <th style={{ padding: "6px 8px", textAlign: "center", color: "#feca1d" }}>JUROS R$</th>}
            {(colunasVisiveis.jurosPct || modoModalFreescroll) && <th style={{ padding: "4px 6px", width: "65px", textAlign: "center" }}>JUROS %</th>}
            {(colunasVisiveis.multaRs || modoModalFreescroll) && <th style={{ padding: "6px 8px", textAlign: "right" }}>MULTA R$</th>}
            {(colunasVisiveis.multaPct || modoModalFreescroll) && <th style={{ padding: "4px 6px", width: "65px", textAlign: "center" }}>MULTA %</th>}
            {(colunasVisiveis.custas || modoModalFreescroll) && <th style={{ padding: "4px 6px", width: "75px", textAlign: "center" }}>CUSTAS PROTESTO</th>}
            {(colunasVisiveis.total || modoModalFreescroll) && <th style={{ padding: "6px 8px", textAlign: "center", background: "#334155" }}>TOTAL R$</th>}
            {(colunasVisiveis.obs || modoModalFreescroll) && <th style={{ padding: "4px 6px" }}>OBS.</th>}
          </tr>
        </thead>
        <tbody>
          {titulosSimulados.map((t, idx) => {
            const { diasAtraso, jurosRs, multaRs, custasReal, totalNegociadoLinha } = processarLinhaPlanilha(t); 
            return (
              <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "#ffffff" : "#f8fafc", opacity: mesaTravada ? 0.8 : 1 }}>
                {(colunasVisiveis.contrato || modoModalFreescroll) && <td style={{ padding: "6px 8px", color: "#475569" }}>#{t.numDocumento}</td>}
                {(colunasVisiveis.nf || modoModalFreescroll) && <td style={{ padding: "6px 8px", fontWeight: "700", color: "#0f172a", textAlign: "center" }}>{t.referencia}</td>}
                {(colunasVisiveis.emissao || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center", color: "#64748b" }}>{t.dataDocumento?.includes("-") ? t.dataDocumento.split("-").reverse().join("/") : t.dataDocumento}</td>}
                {(colunasVisiveis.vencimento || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center", color: "#dc2626", fontWeight: "700" }}>{t.vencimentoLiquido?.includes("-") ? t.vencimentoLiquido.split("-").reverse().join("/") : t.vencimentoLiquido}</td>}
                {(colunasVisiveis.valor || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: "700" }}>R$ {parseFloat(t.valorNota).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
                {(colunasVisiveis.dias || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: "800", color: diasAtraso > 0 ? "#dc2626" : "#16a34a", background: "#f1f5f9" }}>{diasAtraso} d</td>}
                {(colunasVisiveis.jurosRs || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: "700", color: "#b45309" }}>R$ {jurosRs.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
                {(colunasVisiveis.jurosPct || modoModalFreescroll) && (
                  <td style={{ padding: "2px" }}>
                    <input type="number" step="0.01" disabled={categoriaBloqueada || mesaTravada} value={t.jurosPercentualIndividual} onChange={(e) => lidarMudancaInputTabela(idx, "jurosPercentualIndividual", parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.00)} style={{ width: "100%", padding: "2px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", textAlign: "center" }} />
                  </td>
                )}
                {(colunasVisiveis.multaRs || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: "700", color: "#b45309" }}>R$ {multaRs.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
                {(colunasVisiveis.multaPct || modoModalFreescroll) && (
                  <td style={{ padding: "2px" }}>
                    <input type="number" step="0.01" disabled={categoriaBloqueada || mesaTravada} value={t.multaPercentualIndividual} onChange={(e) => lidarMudancaInputTabela(idx, "multaPercentualIndividual", parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.00)} style={{ width: "100%", padding: "2px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", textAlign: "center" }} />
                  </td>
                )}
                {(colunasVisiveis.custas || modoModalFreescroll) && (
                  <td style={{ padding: "2px" }}>
                    <input type="number" step="0.01" placeholder="0.00" disabled={categoriaBloqueada || mesaTravada} value={t.custasProtestoIndividual || ""} onChange={(e) => lidarMudancaInputTabela(idx, "custasProtestoIndividual", parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.00)} style={{ width: "100%", padding: "2px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", textAlign: "right", color: "#2563eb" }} />
                  </td>
                )}
                {(colunasVisiveis.total || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: "800", color: "#2563eb", background: "#f8fafc" }}>R$ {totalNegociadoLinha.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
                {(colunasVisiveis.obs || modoModalFreescroll) && (
                  <td style={{ padding: "2px" }}>
                    <input type="text" placeholder="Nota..." disabled={categoriaBloqueada || mesaTravada} value={t.observacaoIndividual} onChange={(e) => lidarMudancaInputTabela(idx, "observacaoIndividual", e.target.value)} style={{ width: "100%", padding: "2px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px" }} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot style={{ background: "#334155", color: "#ffffff", fontWeight: "800" }}>
          <tr style={{ borderTop: "2px solid #0f172a" }}>
            {(colunasVisiveis.contrato || modoModalFreescroll) && <td style={{ padding: "6px 8px" }}>TOTAIS</td>}
            {(colunasVisiveis.nf || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center" }}>-</td>}
            {(colunasVisiveis.emissao || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center" }}>-</td>}
            {(colunasVisiveis.vencimento || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center" }}>-</td>}
            {(colunasVisiveis.valor || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right" }}>R$ {totalizadoresPlanilha.somaValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
            {(colunasVisiveis.dias || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center" }}>-</td>}
            {(colunasVisiveis.jurosRs || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right" }}>R$ {totalizadoresPlanilha.somaJuros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
            {(colunasVisiveis.jurosPct || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center" }}>-</td>}
            {(colunasVisiveis.multaRs || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right", color: "#feca1d" }}>R$ {totalizadoresPlanilha.somaMulta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
            {(colunasVisiveis.multaPct || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "center" }}>-</td>}
            {(colunasVisiveis.custas || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right", color: "#bae6fd" }}>R$ {totalizadoresPlanilha.somaCustas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
            {(colunasVisiveis.total || modoModalFreescroll) && <td style={{ padding: "6px 8px", textAlign: "right", color: "#22c55e", background: "#1e293b", fontWeight: "900" }}>R$ {totalizadoresPlanilha.somaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>}
            {(colunasVisiveis.obs || modoModalFreescroll) && <td style={{ padding: "6px 8px" }}>-</td>}
          </tr>
        </tfoot>
      </table>
    );
  };

  return ( 
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block" }}>Dívida Acumulada Total</span>
          <span style={{ fontSize: "20px", fontWeight: "900", color: "#ef4444" }}>
            R$ {dividaAcumuladaBrutaFixa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div style={{ textAlign: "center", borderLeft: "2px solid #cbd5e1", paddingLeft: "12px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", display: "block" }}>Dívida Negociada Total</span>
          <span style={{ fontSize: "20px", fontWeight: "900", color: "#16a34a" }}>
            R$ {totalGeralAcordoAcumulado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", alignItems: "center", width: "100%" }}>
        <div style={{ background: "#ffffff", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", flex: 1, opacity: mesaTravada ? 0.6 : 1 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "9px", fontWeight: "800", color: "#475569", marginBottom: "2px" }}>MULTA %</label>
            <input type="number" step="0.01" disabled={categoriaBloqueada || mesaTravada} value={multaGeral} onChange={(e) => setMultaGeral(parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.00)} style={{ padding: "4px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "9px", fontWeight: "800", color: "#475569", marginBottom: "2px" }}>JUROS MORA % a.m.</label>
            <input type="number" step="0.01" disabled={categoriaBloqueada || mesaTravada} value={jurosGeral} onChange={(e) => setJurosGeral(parseFloat(parseFloat(e.target.value).toFixed(2)) || 0.00)} style={{ padding: "4px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: "9px", fontWeight: "800", color: "#475569", marginBottom: "2px" }}>DATA ATUALIZAÇÃO</label>
            <input type="date" disabled={categoriaBloqueada || mesaTravada} value={dataAtualizacao} onChange={(e) => setDataAtualizacao(e.target.value)} style={{ padding: "4px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#2563eb", background: "#ffffff" }} />
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <button type="button" onClick={() => setMenuFunilAberto(!menuFunilAberto)} style={{ background: "#0f172a", color: "white", border: "none", width: "44px", height: "44px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} title="Configurar colunas visíveis">
            <Filter size={14} />
          </button>
          
          {menuFunilAberto && ( 
            <div style={{ position: "absolute", top: "48px", right: 0, background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "8px", zIndex: 110, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: "260px" }}>
              {Object.keys(colunasVisiveis).map(col => (
                <label key={col} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", fontWeight: "700", color: "#334155", cursor: "pointer", textTransform: "uppercase" }}>
                  <input type="checkbox" checked={colunasVisiveis[col]} onChange={() => alternarVisibilidadeColuna(col)} style={{ cursor: "pointer" }} />
                  <span>{col}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ border: "1px solid #cbd5e1", borderRadius: "6px", overflowX: "auto", background: "#ffffff" }}>
        {renderizarEstruturaPlanilhaBase(false)}
      </div>

      {modalTabelaAberto && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "40px", boxSizing: "border-box" }}>
          <div style={{ background: "#ffffff", width: "100%", maxHeight: "90vh", borderRadius: "8px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ background: "#0f172a", color: "white", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>🖥️ Central Expansível de Faturamento e Atualizações Monetárias (Visão Plena)</span>
              <button type="button" onClick={() => setModalTabelaAberto(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }} onMouseEnter={(e) => e.currentTarget.style.color = "white"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: "20px", overflowX: "auto", overflowY: "auto", flex: 1 }}>
              {renderizarEstruturaPlanilhaBase(true)} 
            </div>
            <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "12px 20px", display: "flex", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setModalTabelaAberto(false)} style={{ background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Fechar Central Plena</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "4px", opacity: mesaTravada ? 0.6 : 1 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "3px" }}>PARCELAS</label>
          <input type="number" min="1" max="36" disabled={categoriaBloqueada || mesaTravada} value={propostaParcelas} onChange={(e) => setPropostaParcelas(parseInt(e.target.value) || 1)} style={{ padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "3px" }}>FREQUÊNCIA</label>
          <select disabled={categoriaBloqueada || mesaTravada} value={frequenciaCiclo} onChange={(e) => setFrequenciaCiclo(e.target.value)} style={{ padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: "white", cursor: "pointer" }}>
            <option value="30">Mensal (De 30 em 30 dias)</option>
            <option value="15">Quinzenal (De 15 em 15 dias)</option>
            <option value="7">Semanal (De 7 em 7 dias)</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "3px" }}>DATA DO PRIMEIRO VENCIMENTO</label>
          <input type="date" disabled={categoriaBloqueada || mesaTravada} value={dataPrimeiroVenc} onChange={(e) => setDataPrimeiroVenc(e.target.value)} style={{ padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "11px", fontWeight: "700", color: "#0f172a" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "3px" }}>FORMA DE PAGAMENTO</label>
          <select disabled={categoriaBloqueada || mesaTravada} value={formaPagto} onChange={(e) => setFormaPagto(e.target.value)} style={{ padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "11px", fontWeight: "700", background: "white", cursor: "pointer" }}>
            <option value="Boleto">Boleto Bancário</option>
            <option value="Pix">Transferência Pix</option>
            <option value="A vista">Dinheiro / À Vista</option>
          </select>
        </div>

        <div style={{ gridColumn: "span 2", display: "flex", alignItems: "flex-end", gap: "8px" }}>
          {!categoriaBloqueada && !mesaTravada ? (
            <>
              <button type="button" onClick={executingGravacaoPriceFirebase} style={{ flex: 7, background: "#16a34a", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase" }}>
                <span>Aplicar Proposta</span>
              </button>
              <button type="button" onClick={lidarComZerarMesaProposta} style={{ flex: 3, background: "#ea580c", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }} title="Limpar e recomeçar do zero">
                <Trash2 size={12} /> <span>Resetar</span>
              </button>
            </>
          ) : !categoriaBloqueada && (
            <button type="button" onClick={() => setMesaTravada(false)} style={{ width: "100%", background: "#2563eb", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <RefreshCw size={12} /> <span>Reabrir Proposta</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px", borderRadius: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "800", color: "#16a34a", fontSize: "11px", textTransform: "uppercase", marginBottom: "6px" }}>
          <LayoutGrid size={12} strokeWidth={2.5} />
          <span>Simulação Prévia da Esteira (Total Lote: R$ {totalGeralAcordoAcumulado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})</span>
        </div>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {previewParcelasFila.map((p, pIdx) => ( 
            <div key={pIdx} style={{ background: "#ffffff", border: "1px solid #bbf7d0", borderRadius: "6px", padding: "6px 10px", minWidth: "125px", fontSize: "10px", textAlign: "left" }}>
              <div style={{ fontWeight: "800", color: "#14532d" }}>PARCELA 0{p.numero}</div>
              <div style={{ color: "#475569", margin: "2px 0", fontWeight: "700" }}>📅 {p.vencimento.split("-").reverse().join("/")}</div>
              <div style={{ fontWeight: "800", color: "#16a34a", fontSize: "11px" }}>R$ {p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}