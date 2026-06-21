import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para gerenciar os filtros e ordenações locais de tesouraria de forma reativa.
import { db } from "../../config/firebase"; // -> Injeta o conector físico db exportado do arquivo firebase.js para permitir comandos diretos de gravação e leitura na nuvem da Google.
import { doc, updateDoc } from "firebase/firestore"; // -> Puxa as ferramentas estáveis do SDK do Firestore para executar a gravação e atualização parcial de documentos de banco de dados.
import { Wallet, AlertTriangle, TrendingUp, Percent, SlidersHorizontal, Search, FolderMinus, Undo2, Check, ChevronUp, ChevronDown } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide, incluindo as setas de ordenação de colunas.

export function ModuloFinanceiro({ cobrancas = [], aoMudarStatusDireto }) { // -> Declara e exporta a função mestre do componente recebendo as cobranças em tempo real do Firebase e as triggers do pai.
  // -> ESTADOS LOCAIS DE NAVEGAÇÃO INTERNA: Controla a pílula de filtro de situação financeira (Todos, Vencidos, A Vencer, Pagos). -> Comentário orientativo do desenvolvedor.
  const [filtroSituacao, setFiltroSituacao] = useState("Todos"); // -> Inicializa a variável de estado controlando qual pílula de risco está ativa na tela (padrão: Todos).
  const [buscaEmpresa, setBuscaEmpresa] = useState(""); // -> Inicializa a variável da barra de busca por digitação para filtrar os devedores por nome ou ID de conta.

  // 🛠️ NOVOS ESTADOS DE CONTROLE DE ORDENAÇÃO EXECUTIVA (MESA DE DECISÃO B2B)
  const [campoOrdenado, setCampoOrdenado] = useState("vencimento"); // -> REQUISITO ESTREITO: Inicializa a tabela programada para organizar os dados por data de vencimento como padrão de fábrica.
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState("asc"); // -> REQUISITO ESTREITO: Configura a direção padrão em modo crescente, empurrando as faturas mais antigas e vencidas para o topo do visor.

  // -> CONFIGURAÇÕES TÉCNICAS DE COBRANÇA JURÍDICA (DIRETRIZES DE MERCADO B2B) -> Comentário orientativo do desenvolvedor.
  const RETENCAO_IMPOSTO_HONORARIOS = 0.15; // -> Define a constante fiscal de simulação contendo a taxa de 15% de retenção de notas de serviços do escritório.
  const DATA_HOJE_SISTEMA = new Date("2026-06-11T00:00:00"); // -> ÂNCORA CRONOLÓGICA: Fixa a data de junho de 2026 como o dia atual para cálculo real de faturas em atraso.

  // =========================================================================================
  // ⚙️ SUPER MOTOR DE EXTRAÇÃO: Unifica todas as parcelas Price da carteira em um único Pool
  // ========================================================================================= -> Divisora estrutural do motor.
  const todasAsParcelasDaCarteira = cobrancas.flatMap((cliente) => { // -> Achata os múltiplos sub-arrays de parcelas pulverizados em vários clientes em uma única fila reta de RAM para a planilha.
    const parcelasInternas = cliente.planoParcelas || (cliente.proposta && cliente.proposta.parcelasSimuladas) || []; // -> Tenta ler a gaveta principal de caixa; se estiver ausente, herda automaticamente as parcelas simuladas no prontuário, impedindo linhas invisíveis.
    
    return parcelasInternas.map((parcela) => { // -> Executa um laço de mapeamento enriquecendo cada parcela com as informações cadastrais do cliente dono do título.
      const dataVencimento = new Date(parcela.vencimento + "T00:00:00"); // -> Instancia o formato de data internacional interpretando a string de vencimento salva no banco.
      
      // -> ANÁLISE TEMPORAL DINÂMICA: Determina o real estado de risco do ativo cruzando com a âncora de 2026 -> Comentário técnico.
      let situacaoCronologica = "a_vencer"; // -> Define por padrão que o boleto está com o prazo em dia (a vencer).
      if (parcela.pago) { // -> Abre a checagem booleana: se a flag pago da parcela estiver marcada como verdadeira no cofre do Firestore:
        situacaoCronologica = "pago"; // -> Altera o veredito cronológico da fatura para liquidada (pago).
      } else if (dataVencimento < DATA_HOJE_SISTEMA) { // -> Caso contrário, se o dia de vencimento for menor que a data âncora corrente de junho de 2026:
        situacaoCronologica = "vencido"; // -> Altera o veredito cronológico carimbando a fatura como inadimplência activa (vencido).
      } // -> Encerra a triagem cronológica da fatura.

      // 🛠️ RE-CALIBRAÇÃO HERANÇA PARMETRIZÁVEL: Extrai a taxa de juros real combinada com o cliente no prontuário do Kanban
      const taxaJurosAcordo = cliente.proposta?.taxaJuros || cliente.proposta?.juros || 20; // -> Resgata a porcentagem de juros da proposta salvando o cálculo em float, aplicando 20% como margem de segurança caso esteja vazia.
      const aliquotaCalculo = taxaJurosAcordo / 100; // -> Transforma o número inteiro da porcentagem em multiplicador decimal (Ex: 20 vira 0.20) para o motor processar.

      // -> CÁCULO DE SPLIT FINANCEIRO EM REAIS (CÁLCULO DE REPASSE) -> Comentário orientativo do desenvolvedor.
      const valorBrutoParcela = parseFloat(parcela.valor) || 0; // -> Limpa o valor numérico da parcela convertendo em ponto flutuante real para afastar bugs centavais.
      const honorariosEscritorio = valorBrutoParcela * aliquotaCalculo; // -> MUTAÇÃO DINÂMICA: Multiplica o valor da parcela pela taxa de juros herdada do acordo, individualizando o split de honorários.
      const impostoRetido = honorariosEscritorio * RETENCAO_IMPOSTO_HONORARIOS; // -> Calcula o desconto tributário de 15% em cima da fatura de honorários.
      const repasseLiquidoCliente = valorBrutoParcela - honorariosEscritorio; // -> Realiza a subtração definindo a quantia líquida que será repassada via Pix para o cliente credor-pai.

      return { // -> Devolve o objeto da parcela reestruturado e munido with todos os splits de controladoria calculados em memória RAM.
        ...parcela, // -> Faz a cópia por espalhamento de todos os campos nativos de nascimento da parcela (número, vencimento original).
        idUnicaCobranca: cliente.id, // -> Injeta o ID único (CNPJ) da cobrança raiz para permitir que o botão saiba exatamente qual documento atualizar no Firebase.
        razaoSocial: cliente.cliente, // -> Anexa a Razão Social corporativa do devedor em caixa alta para estampar na linha correspondente.
        codigoConta: cliente.codigo, // -> Anexa o identificador de código numérico da conta judicial para exibição na grade.
        operadorMesa: cliente.responsavel || "Sem operador", // -> Transmite o nome do cobrador encarregado pelo monitoramento da carteira de cobrança.
        situacaoReal: situacaoCronologica, // -> Injeta o veredito de risco calculado (pago, vencido ou a vencer).
        splitHonorarios: honorariosEscritorio, // -> Injeta o montante financeiro líquido de juros pertencente ao balanço interno do escritório.
        splitRepasse: repasseLiquidoCliente, // -> Injeta o montante financeiro líquido pertencente ao cliente assistido.
        splitImposto: impostoRetido // -> Injeta o valor simulado do imposto de nota fiscal retido na fonte.
      }; // -> Encerra a formatação estrutural da linha de parcela.
    }); // -> Encerra o laço interno das parcelas do cliente correspondente.
  }); // -> Encerra o esmagamento das matrizes NoSQL.

  // =========================================================================================
  // 🔍 FILTRAGEM DE TESOURARIA: Separa por Situação de Risco + Busca Textual
  // ========================================================================================= -> Divisora estrutural do motor de filtros.
  const parcelasFiltradas = todasAsParcelasDaCarteira.filter((item) => { // -> Inicia a varredura na fila unificada aplicando as travas de busca simultâneas da Toolbar.
    const bateSituacao = filtroSituacao === "Todos" || item.situacaoReal === filtroSituacao; // -> Filtro 1: Valida se a situação real da parcela casa com a pílula de risco ativa.
    const bateTexto = !buscaEmpresa.trim() || item.razaoSocial.toLowerCase().includes(buscaEmpresa.toLowerCase()) || String(item.codigoConta).includes(buscaEmpresa); // -> Filtro 2: Valida se o texto digitado coincide com o nome da empresa ou o ID numérico da conta.
    return bateSituacao && bateTexto; // -> Retorna verdadeiro permitindo a exibição física na planilha apenas se o registro passar pelos dois testes.
  }); // -> Encerra a peneira de buscas de faturamento.

  // 🛠️ MOTOR DE CHAVEAMENTO DE CABEÇALHO DA RE-ORDENAÇÃO DINÂMICA
  const lidarComMudarOrdenacao = (colunaAlvo) => { // -> Gerencia reativamente o comportamento do clique do mouse nos títulos superiores da planilha.
    if (campoOrdenado === colunaAlvo) { // -> Se o operador clicou na mesma coluna que já está ordenando a grade ativa.
      setDirecaoOrdenacao(direcaoOrdenacao === "asc" ? "desc" : "asc"); // -> Inverte o fluxo alternando síncronamente entre ordem crescente (asc) ou decrescente (desc).
    } else { // -> Caso seja um clique inédito em uma coluna paralela:
      setCampoOrdenado(colunaAlvo); // -> Aloca a nova string de cabeçalho na memória de prioridade de triagem.
      setDirecaoOrdenacao("asc"); // -> Reseta o sentido iniciando no modo crescente de fábrica.
    } // -> Encerra o chaveamento.
  }; // -> Encerra o manipulador de ordenação livre.

  // 🛠️ PROCESSO DE TRIAGEM AVANÇADO EM MEMÓRIA RAM ANTES DA EXIBIÇÃO
  const parcelasOrdenadasVisor = [...parcelasFiltradas].sort((itemA, itemB) => { // -> Duplica o array filtrado para rodar a organização matemática sem gerar travamentos de concorrência.
    let valorA = itemA[campoOrdenado]; // -> Isola o valor do campo alvo do item A.
    let valorB = itemB[campoOrdenado]; // -> Isola o valor do campo alvo do item B.
    
    if (campoOrdenado === "valor" || campoOrdenado === "splitHonorarios" || campoOrdenado === "numero") { // -> Se for uma coluna monetária ou numérica inteira:
      return direcaoOrdenacao === "asc" ? valorA - valorB : valorB - valorA; // -> Executa a subtração matemática direta para ordenar os números.
    } // -> Fim da checagem numérica.

    return direcaoOrdenacao === "asc" // -> Se for coluna de string textual ou string de data padrão:
      ? String(valorA).localeCompare(String(valorB)) // -> Compara as strings de A para B de forma alfabética crescente.
      : String(valorB).localeCompare(String(valorA)); // -> Compara as strings de B para A de forma alfabética decrescente.
  }); // -> Conclui a ordenação na prancha de visualização.

  // 🔥 COCKPIT DE CÁLCULO DINÂMICO DE RODAPÉ: Soma apenas os valores das parcelas que estão passando pelo filtro ativo
  const faturamentoTotalEsteira = parcelasOrdenadasVisor.reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0); // -> Cria a variável síncrona que calcula o bolo financeiro exato exibido nas linhas ativas da prancha.

  // =========================================================================================
  // 📈 TOTALIZADORES FISCAIS EM RAM: Alimentam os Big Numbers da Controladoria
  // ========================================================================================= -> Divisora estrutural de cálculos estatísticos.
  const caixaVencidoInadimplente = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "vencido").reduce((acc, p) => acc + p.valor, 0); // -> Filtra e calcula a soma monetária de todas as parcelas em atraso da esteira (gargalo de inadimplência).
  const caixaAVencerFluxo = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "a_vencer").reduce((acc, p) => acc + p.valor, 0); // -> Filtra e calcula a soma monetária de faturas dentro do prazo (previsibilidade de caixa futura).
  const caixaPagoLiquidado = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").reduce((acc, p) => acc + p.valor, 0); // -> Filtra e calcula a soma monetária de boletos dados baixa (dinheiro real em conta).
  const honorariosBrutosAcumulados = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").reduce((acc, p) => acc + p.splitHonorarios, 0); // -> Calcula a somatória real de juros faturados pela DOCULOC em cima dos valores recebidos com sucesso.
  const impostosPrevisaoRetencao = todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").reduce((acc, p) => acc + p.splitImposto, 0); // -> Calcula a somatória dos impostos simulados para provisionamento fiscal.

  // =========================================================================================
  // ⚡ GATILHO DE BAIXA IMEDIATA: Executa a conciliação bancária direto no Firestore
  // ========================================================================================= -> Divisora estrutural das triggers de gravação remota.
  const lidarComConciliacaoParcela = async (idCobrancaRaiz, numeroParcela, acaoSucesso) => { // -> Declara a função assíncrona responsável por intervir e conciliar boletos na nuvem.
    const clienteAlvo = cobrancas.find(c => c.id === idCobrancaRaiz); // -> Caça o devedor dentro da lista viva do Kanban comparando a ID recebida.
    if (!clienteAlvo) return; // -> Trava protetora: aborta síncronamente o fluxo se o devedor tiver sumido da RAM por oscilação.

    const planoAtualizado = (clienteAlvo.planoParcelas || clienteAlvo.proposta?.parcelasSimuladas || []).map((par) => { // -> Duplica o array de parcelas da empresa interceptando o alvo do clique do operador.
      if (par.numero === numeroParcela) { // -> Encontra o número exato da parcela Price clicada na tabela de liquidação.
        return { // -> Modifica as chaves internas da fatura de forma cirúrgica.
          ...par, // -> Preserva o vencimento e os valores originais da fatura.
          pago: acaoSucesso, // -> Modifica a flag booleana para verdadeiro (se clicou em baixar) ou falso (se clicou em estornar).
          status: acaoSucesso ? "pago" : "a_vencer" // -> Sincroniza a string identificadora de célula NoSQL.
        }; // -> Conclui a montagem da parcela modificada.
      } // -> Encerra a condição de ID.
      return par; // -> Mantém as parcelas dos outros meses intocadas e protegidas.
    }); // -> Encerra o laço de reajuste do plano de parcelas.

    // -> Prepara o log cronológico para a linha do tempo da Controladoria -> Comentário orientativo do desenvolvedor.
    const notaAuditoria = { // -> Constrói o objeto de ata inalterável contendo os rastros da baixa manual da tesouraria.
      conteudo: `CONCILIAÇÃO TESOURARIA: Parcela #${numeroParcela} marcada como ${acaoSucesso ? "PAGA / LIQUIDADA" : "ESTORNADA / INADIMPLENTE"} via painel financeiro direto.`, // -> Mensagem descritiva explicitando o desfecho da parcela.
      dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Carimba o momento exato do clique com data e hora.
    }; // -> Encerra o objeto de log.

    const pacoteParaFirestore = { // -> Consolida o espelho perfeito do documento com as duas gavetas sincronizadas.
      ...clienteAlvo, // -> Clona os metadados textuais originais (Código, Razão Social, CNPJ).
      planoParcelas: planoAtualizado, // -> Injeta a tabela Price reajustada com a baixa no barramento da tesouraria.
      proposta: { // -> SINCRONISMO BI-DIRECIONAL NoSQL: Abre a pasta de propostas para espelhar a alteration.
        ...(clienteAlvo.proposta || {}), // -> Preserva os dados de parcelamento contratuais estáveis da Price (vendedor, total negociado).
        parcelasSimuladas: planoAtualizado // -> Grava as parcelas com a baixa também dentro do prontuário, blindando a visão do cobrador!
      }, // -> Fecha o sub-objeto de propostas.
      historicoNotas: [notaAuditoria, ...(clienteAlvo.historicoNotas || [])] // -> Injeta o rastro de auditoria no topo do array histórico sem apagar os anteriores.
    }; // -> Encerra a montagem do payload NoSQL final.

    if (aoMudarStatusDireto) { // -> Se o cabo de rede com a trigger do App.jsx estiver conectado e funcional:
      await updateDoc(doc(db, "cobrancas", idCobrancaRaiz), pacoteParaFirestore); // -> Dispara o comando update gravando as modificações em tempo real no cofre da Google.
      alert(`🟩 CONCILIAÇÃO BANCÁRIA PROCESSADA!\nParcela #${numeroParcela} de "${clienteAlvo.cliente}" updated em tempo real no Firestore.`); // -> Emite o balão de vitória operacional na tela.
    } // -> Encerra a trava protetora.
  }; // -> Encerra o motor de conciliações bancárias.

  return ( // -> Renderiza o painel executivo de Controladoria construído com estilos inline sóbrios.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box", textAlign: "left" }}> {/* -> Container mestre da controladoria alinhado à esquerda com limite de 1400px. */}
      
      {/* 🏛️ GRID SUPERIOR DE DESEMPENHO: BIG NUMBERS BRUTAIS DE TESOURARIA */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}> {/* -> Grade responsiva que organiza os quatro cartões de cabeçalho financeiro simetricamente. */}
        
        {/* CARD 1: LIQUIDADO */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #10b981" }}> {/* -> Bloco branco com friso lateral verde esmeralda representando o caixa limpo. */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}> {/* -> Alinhador horizontal do título interno do card. */}
            <Wallet size={12} strokeWidth={2.5} style={{ color: "#10b981" }} /> {/* -> Desenha o componente vetorial de carteira financeira fina do Lucide em verde. */}
            <span>Dinheiro Líquido em Caixa</span> {/* -> Texto do rótulo identificador do card. */}
          </div> {/* -> Encerra o alinhador do rótulo. */}
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#065f46", marginTop: "4px" }}>R$ {caixaPagoLiquidado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div> {/* -> Exibe o montante de dinheiro liquidado em formato monetário de alta legibilidade. */}
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Sua comissão bruta: R$ {honorariosBrutosAcumulados.toLocaleString("pt-BR")}</div> {/* -> Detalha em letras reduzidas a comissão de juros faturada pelo escritório. */}
        </div> {/* -> Encerra o Card 1. */}

        {/* CARD 2: VENCIDO */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #ef4444" }}> {/* -> Bloco branco com friso lateral vermelho representando prejuízo/atrasos. */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}> {/* -> Alinhador horizontal do título do card. */}
            <AlertTriangle size={12} strokeWidth={2.5} style={{ color: "#ef4444" }} /> {/* -> Desenha o componente vetorial de triângulo de atenção fino em vermelho. */}
            <span>Inadimplência Ativa (Vencidos)</span> {/* -> Texto de identificação. */}
          </div> {/* -> Encerra o alinhador. */}
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#991b1b", marginTop: "4px" }}>R$ {caixaVencidoInadimplente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div> {/* -> Exibe em vermelho escuro o bolo de dinheiro que está travado na rua em atraso. */}
          <div style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px", fontWeight: "700" }}>Gargalo real: Alvo prioritário de ligações.</div> {/* -> text de instrução cobrando acionamento telefônico urgente. */}
        </div> {/* -> Encerra o Card 2. */}

        {/* CARD 3: PREVISÃO DE ENTRADA */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #2563eb" }}> {/* -> Bloco branco com friso lateral azul representativo de receita futura planejada. */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}> {/* -> Alinhador horizontal. */}
            <TrendingUp size={12} strokeWidth={2.5} style={{ color: "#2563eb" }} /> {/* -> Desenha o componente vetorial de tendência em crescimento do Lucide em azul. */}
            <span>Previsibilidade de Caixa (A Vencer)</span> {/* -> Texto de identificação. */}
          </div> {/* -> Encerra o alinhador. */}
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#1e40af", marginTop: "4px" }}>R$ {caixaAVencerFluxo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div> {/* -> Exibe o montante de dinheiro com vencimentos futuros programados em formato real BR. */}
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Capital escalonado nos meses futuros.</div> {/* -> Legenda de acompanhamento de fluxo de caixa futuro. */}
        </div> {/* -> Encerra o Card 3. */}

        {/* CARD 4: RETENÇÃO FISCAL SIMULADA */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #0f172a" }}> {/* -> Bloco branco com friso preto dedicado a previsões tributárias de notas emitidas. */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}> {/* -> Alinhador horizontal. */}
            <Percent size={12} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Desenha o componente de porcentagem fino em vetor escuro sóbrio. */}
            <span>Provisão Fiscal (Impostos de Nota)</span> {/* -> Texto de identificação. */}
          </div> {/* -> Encerra o alinhador. */}
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>R$ {impostosPrevisaoRetencao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div> {/* -> Exibe a somatória centaval dos impostos retidos calculados em float. */}
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Calculado com alíquota mestre de 15%.</div> {/* -> Legenda carimbando a regra tributária de 15% de imposto utilizada. */}
        </div> {/* -> Encerra o Card 4. */}

      </div> {/* -> Encerra o grid completo de Big Numbers de topo. */}

      {/* 📑 TOOLBAR DA CONTROLADORIA (FILTROS DE RISCO DO CLICKUP) */}
      <div style={{ backgroundColor: "#ffffff", padding: "14px 20px", borderRadius: "10px 10px 0 0", border: "1px solid #e2e8f0", borderBottom: "none", display: "flex", justifyRef: "space-between", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}> {/* -> Barra horizontal de ferramentas superior da tesouraria com cantos superiores suavizados. */}
        
        {/* PÍLULAS DE SITUAÇÃO DE RISCO (ALA ESQUERDA) */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}> {/* -> Contêiner flexbox alinhando horizontalmente os botões seletores de relatórios contidos naToolbar. */}
          <div style={{ display: "flex", alignItems: "center", color: "#475569", paddingRight: "4px" }}> {/* -> Isola o vetor deslizante de controles manuais daToolbar. */}
            <SlidersHorizontal size={14} strokeWidth={2.5} /> {/* -> Desenha o componente transversal de controles de filtros finos vazados do Lucide. */}
          </div> {/* -> Encerra o isolador. */}
          {["Todos", "vencido", "a_vencer", "pago"].map((tipo) => ( // -> Roda o loop map varrendo a lista estática para criar os quatro botões seletores dinamicamente.
            <button // -> Fabrica o elemento de botão interativo para a pílula da vez.
              key={tipo} // -> Chave única exigida pelo React baseada no termo de triagem textual (Todos, vencido, pago).
              type="button" // -> Configura o tipo fixo como botão clássico impedindo rebates espúrios de envio de formulários.
              onClick={() => setFiltroSituacao(tipo)} // -> Grampeia o clique alterando reativamente o estado da variável para remodelar as parcelas filtradas na RAM.
              style={{
                backgroundColor: filtroSituacao === tipo ? "#0f172a" : "#f1f5f9", // -> Destaca em Azul Escuro Profundo caso a pílula seja a selecionada ou aplica cinza suave se inativa.
                color: filtroSituacao === tipo ? "#ffffff" : "#475569", // -> Texto branco para o ativo, cinza ardósia para o inativo.
                border: "none", // -> Extingue contornos e bordas antigas para manter o design flat minimalista.
                padding: "6px 14px", // -> Define margens internas compactas e enxutas confortáveis para o clique.
                borderRadius: "6px", // -> Suaviza os cantos em 6px padrão fintech.
                fontSize: "12px", // -> Tamanho de letra calibrado em 12px de alta densidade de leitura.
                fontWeight: "700", // -> Peso de fonte em negrito destacado estruturado.
                cursor: "pointer", // -> Transforma a seta do mouse em ponteiro de mãozinha clicável.
                transition: "all 0.2s ease" // -> Injeta efeito de transição suave ao chavear as cores.
              }} // -> Fecha a folha de estilo.
            > {/* -> Fecha as especificações da tag button. */}
              {tipo === "Todos" && `Todas as Promessas (${todasAsParcelasDaCarteira.length})`} {/* -> Rótulo da pílula mestre exibindo a contagem bruta total de parcelas do cofre. */}
              {tipo === "vencido" && `Vencidas / Atrasadas (${todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "vencido").length})`} {/* -> Rótulo da pílula de perigo computando os inadimplentes em tempo real. */}
              {tipo === "a_vencer" && `Fluxo Futuro A Vencer (${todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "a_vencer").length})`} {/* -> Rótulo da pílula de planejamento calculando as faturas no prazo. */}
              {tipo === "pago" && `Pagas / Conciliadas (${todasAsParcelasDaCarteira.filter(p => p.situacaoReal === "pago").length})`} {/* -> Rótulo da pílula de liquidação computando os Pix dados baixa. */}
            </button> // -> Encerra o botão individual de filtro de risco.
          ))} {/* -> Encerra o loop mapeador das pílulas. */}
        </div> {/* -> Fecha o contêiner da ala esquerda de ferramentas. */}

        {/* BARRA DE PESQUISA POR EMPRESA (ALA DIREITA) */}
        <div style={{ minWidth: "280px", display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Contêiner flexbox da ala direita focado em reter a caixa de pesquisa. */}
          <div style={{ display: "flex", alignItems: "center", background: "#ffffff", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", width: "100%", boxSizing: "border-box" }}> {/* -> Moldura branca do input com bordas cinza claro. */}
            <Search size={13} strokeWidth={2.5} style={{ color: "#94a3b8", flexShrink: 0 }} /> {/* -> Injeta o componente sutil de lupa de busca vazado do Lucide removendo o caractere de lupa manual. */}
            <input // -> Abre a tag estrutural do campo de digitação in linha.
              type="text" // -> Define o tipo de entrada como string de texto convencional.
              placeholder="Buscar por Razão Social ou Código Conta..." // -> Frase explicativa flutuante de instrução para o cobrador.
              value={buscaEmpresa} // -> Vincula o texto exibido em tempo real ao estado de memória ram buscaEmpresa.
              onChange={(e) => setBuscaEmpresa(e.target.value)} // -> Monitora caractere por caractere refinando o caixa.
              style={{ width: "100%", border: "none", background: "none", fontSize: "12px", color: "#0f172a", outline: "none", paddingLeft: "4px" }} // -> Input limpo inline totalmente integrado à caixa flexbox com remoção de contornos ativos.
            /> {/* -> Fecha a tag input. */}
          </div> {/* -> Fecha a caixa de contorno branca do buscador. */}
        </div> {/* -> Fecha a ala direita de ferramentas. */}

      </div> {/* -> Encerra aToolbar completa da controladoria. */}

      {/* 📑 MESA DE LIQUIDAÇÃO: A SUPER TABELA DE CONTROLE DE PARCELAS */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0 0 12px 12px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden", border: "1px solid #e2e8f0" }}> {/* -> Bloco branco inferior da planilha com cantos inferiores arredondados em 12px acoplando a prancha física. */}
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}> {/* -> Tag semântica de tabela colapsando as linhas internas e travando a fonte em 13px corporativos. */}
          
          <thead> {/* -> Inicia a cabeceira superior de títulos fixos da planilha financeira. */}
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700" }}> {/* -> Fileira cinza claro com linha demarcadora inferior fina. */}
              <th onClick={() => lidarComMudarOrdenacao("codigoConta")} style={{ padding: "14px 20px", width: "90px", cursor: "pointer", userSelect: "none" }}> {/* -> LIBERADO: Título da coluna 1 (clicável para reordenar por conta). */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>CONTA</span>
                  {campoOrdenado === "codigoConta" && (direcaoOrdenacao === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th onClick={() => lidarComMudarOrdenacao("razaoSocial")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}> {/* -> LIBERADO: Título da coluna 2 (clicável para reordenar por nome). */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>EMPRESA DEVEDORA (PLANO PRICE)</span>
                  {campoOrdenado === "razaoSocial" && (direcaoOrdenacao === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th onClick={() => lidarComMudarOrdenacao("numero")} style={{ padding: "14px 20px", width: "110px", cursor: "pointer", userSelect: "none" }}> {/* -> LIBERADO: Título da coluna 3 (clicável para reordenar por número do mês). */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>Nº PARCELA</span>
                  {campoOrdenado === "numero" && (direcaoOrdenacao === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th onClick={() => lidarComMudarOrdenacao("vencimento")} style={{ padding: "14px 20px", width: "140px", cursor: "pointer", userSelect: "none" }}> {/* -> LIBERADO: Título da coluna 4 (clicável para reordenar por data). */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>VENCIMENTO</span>
                  {campoOrdenado === "vencimento" && (direcaoOrdenacao === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th onClick={() => lidarComMudarOrdenacao("situacaoReal")} style={{ padding: "14px 20px", width: "130px", cursor: "pointer", userSelect: "none" }}> {/* -> LIBERADO: Título da coluna 5 (clicável para reordenar por risco). */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>RISCO CRONO</span>
                  {campoOrdenado === "situacaoReal" && (direcaoOrdenacao === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th onClick={() => lidarComMudarOrdenacao("valor")} style={{ padding: "14px 20px", textAlign: "right", width: "150px", cursor: "pointer", userSelect: "none" }}> {/* -> LIBERADO: Título da coluna 6 (clicável para reordenar por valor bruto). */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                  <span>VALOR BRUTO</span>
                  {campoOrdenado === "valor" && (direcaoOrdenacao === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th onClick={() => lidarComMudarOrdenacao("splitHonorarios")} style={{ padding: "14px 20px", textAlign: "right", width: "140px", cursor: "pointer", userSelect: "none" }}> {/* -> LIBERADO: Título da coluna 7 (clicável para reordenar por juros faturados). */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                  <span>HONORÁRIOS (JUROS)</span>
                  {campoOrdenado === "splitHonorarios" && (direcaoOrdenacao === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th style={{ padding: "14px 20px", textAlign: "center", width: "120px" }}>CONCILIAR</th> {/* -> Título da coluna 8: centraliza os gatilhos manuais de dar baixa. */}
            </tr> {/* -> Encerra a fileira de cabeçalhos de títulos. */}
          </thead> {/* -> Encerra a cabeceira. */}

          <tbody style={{ color: "#0f172a", fontWeight: "600" }}> {/* -> Abre o corpo dinâmico para preenchimento das fileiras de promessas ativas. */}
            {parcelasOrdenadasVisor.length === 0 ? ( // -> Condicional de UX: se a grade de faturamento estiver deserta.
              <tr>
                <td colSpan="8" style={{ padding: "40px 20px", backgroundColor: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyRef: "center", justifyContent: "center", gap: "6px", color: "#64748b", fontSize: "12px", fontStyle: "italic" }}>
                    <FolderMinus size={14} strokeWidth={2} /> {/* -> Troca a caixa vazada antiga pela pasta de exclusão sutil do Lucide. */}
                    <span>Nenhuma promessa de pagamento em aberto ou registrada na situação selecionada.</span>
                  </div>
                </td>
              </tr>
            ) : ( // -> Caso existam boletos filtrados na esteira, inicia o mapa de linhas.
              parcelasOrdenadasVisor.map((parcela, index) => ( // 🛠️ CADÊNCIA CRONOLÓGICA: Varre o array ordenado por data de vencimento como padrão, listando do mais urgente para o mais distante.
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

                  {/* CÉLULA: SPLIT DE HONORÁRIOS DE JUROS DINÂMICOS */}
                  <td style={{ padding: "14px 20px", textAlign: "right", color: "#2563eb", fontWeight: "700" }}>
                    R$ {parcela.splitHonorarios.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* -> MUTAÇÃO DINÂMICA: Cospe o split de comissão calculado de forma maleável com base nos juros da comanda da proposta! */}
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
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* 📊 BARRA CONSOLIDADA DE SOMA DE PIPELINE FINANCEIRO NO RODAPÉ */}
      <div 
        style={{ // -> Abre as regras de estilo inline do painel de sumário inferior.
          backgroundColor: "#f8fafc", // -> Fundo cinza claro idêntico ao cabeçalho da planilha.
          padding: "16px 20px", // -> Espaçamento interno largo de conforto visual.
          borderTop: "1px solid #e2e8f0", // -> Linha superior cinza claro de divisão de blocos.
          display: "flex", // -> Ativa o alinhamento flexbox horizontal.
          justifyContent: "space-between", // -> Alinha o rótulo de texto na esquerda e a somatória final na direita.
          alignItems: "center", // -> Centraliza de forma absoluta os elementos na linha vertical.
          fontSize: "14px", // -> Tamanho de letra calibrado em 14px.
          fontWeight: "bold", // -> Peso de fonte em negrito estruturado.
          color: "#1e293b" // -> Cor de fonte escura sóbria ardósia Slate.
        }} // -> Fecha as regras de estilo.
      > {/* -> Fecha as especificações do rodapé. */}
        <span>TOTAL DE CARTEIRA FILTRADA ATIVA COBRADA:</span> {/* -> Rótulo formal do balanço geral em caixa alta. */}
        <span style={{ color: "#2563eb", fontSize: "16px", fontWeight: "800" }}> {/* -> Abre a célula de valor em azul de destaque. */}
          R$ {faturamentoTotalEsteira.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* -> CÁLCULO SEGURO: Exibe síncronamente o caixa líquido das linhas visíveis sem quebras de objetos. */}
        </span> {/* -> Encerra o texto do montante consolidado. */}
      </div> {/* -> Encerra a barra de somatório de rodapé. */}

    </div> // -> Encerra o container mestre absoluto do módulo financeiro fintech.
  );
}