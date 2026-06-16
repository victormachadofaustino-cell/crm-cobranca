import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar as caixas locais do CRM de faturamento.
import { FileText, X, ArchiveRestore, Archive, ShieldAlert, Activity, User, Phone, Mail, Link, CheckCircle2, XCircle, ListTodo, History, BadgePercent, Coins, Plus, Calendar, Percent, FolderMinus, Info, Trash2 } from "lucide-react"; // -> CORREÇÃO CIRÚRGICA: Adicionado 'FolderMinus' e 'Trash2' na fiação de importações do topo para estancar travamentos e permitir a deleção física.

export default function ModalProntuario({ aberto, aoFechar, card, colunaId, contatosBase = [], aoSalvarProntuário, exibirArquivados = false, aoAlternarArquivamentoNoModal, aoExcluirCardNoModal }) { // -> RECALIBRADA PREMIUM: Recebe a nova trigger assíncrona 'aoExcluirCardNoModal' vinda diretamente do barramento mestre do App.jsx.
  if (!aberto || !card) return null; // -> TRAVA DE SEGURANÇA: Se o maestro disser que o modal não deve aparecer, retorna nulo e não consome processamento.

  // -> CÁLCULO DE HIGIENIZAÇÃO MONETÁRIA DE ENTRADA
  const valorOriginalDívida = parseFloat(card.valorVencido) || 0; // -> Limpa o valor bruto vindo da nuvem para os cálculos da calculadora.

  // -> ESTADOS LOCAIS OPERACIONAIS DA CALCULADORA PRICE E METADADOS DO DOCUMENTO NO SCALE (EBSE)
  const [propostaValor, setPropostaValor] = useState(card.proposta?.valorCobrado || valorOriginalDívida); // -> Monitora o valor negociado final pretendido para o acordo comercial.
  const [propostaParcelas, setPropostaParcelas] = useState(card.proposta?.qtdParcelas || 1); // -> Monitora a quantidade de parcelas fixas desejadas para a simulação.
  const [taxaJurosMensal, setTaxaJurosMensal] = useState(1.5); // -> INTERNA INTERATIVA: Inicializa a taxa de juros de mora padrão em 1.5% ao mês para o cálculo composto.
  const [formaPagto, setFormaPagto] = useState(card.proposta?.tipoPagamento || "Boleto"); // -> Captura a forma de liquidação escolhida pelo operador (Boleto/Pix).
  const [dataPrimeiroVenc, setDataPrimeiroVenc] = useState(card.proposta?.dataPrimeiroVencimento || "2026-06-11"); // -> Guarda o dia limite estipulado para a carência do primeiro pagamento.

  // -> NOVOS ESTADOS ADICIONADOS PARA A BIFURCAÇÃO DE REGIME DE LIQUIDAÇÃO (ESTILO CLICKUP)
  const [regimeLiquidacao, setRegimeLiquidacao] = useState(card.status === "conta_corrente" || (card.planoParcelas && card.planoParcelas.length === 0) ? "conta_corrente" : "acordo"); // -> INTERRUPTOR DE REGIME: Define se a tela carrega a calculadora Price ou o Extrato de Amortização Livre.
  const [novoAbatimento, setNovoAbatimento] = useState(""); // -> CAIXA DE CRÉDITO: Captura o valor avulso de Pix/Dinheiro digitado para abater a dívida.
  const [dataAbatimento, setDataAbatimento] = useState("2026-06-11"); // -> CALENDÁRIO DE CRÉDITO: Monitora o dia em que o dinheiro avulso bateu no caixa.

  // -> ESTADOS DE CONTROLE DE TAREFAS MULTIFUNCIONAIS E OCORRÊNCIAS
  const [tipoTarefa, setTipoTarefa] = useState("Ligação"); // -> Seleciona a categoria operacional (Mensagem, Ligação, Reunião, Lembrete).
  const [textoTarefa, setTextoTarefa] = useState(""); // -> Monitora a string descritiva da ação que será delegada na esteira.

  // -> CONTROLADOR DE NAVEGAÇÃO INTERNA DA ALA DIREITA (ABAS OPERACIONAIS)
  const [abaAtiva, setAbaAtiva] = useState("tarefas"); // -> NATIVA POR PADRÃO: Inicializa a visualização focada no painel imediato de Tarefas.

  // -> FILTRO RELACIONAL EM TEMPO REAL: Cruza os dados e isola APENAS os contatos humanos que pertencem a este devedor específico.
  const contatosDesteDevedor = contatosBase.filter((con) => con.empresaId === card.id); // -> Varre a base e monta o mini-grid telefônico do assistido.

  // -> MOTOR MATEMÁTICO DE JUROS COMPOSTOS INTEGRADO (FÓRMULA M = P * (1 + i)^n)
  const calcularMontanteComposto = () => { // -> Executa o cálculo financeiro real de taxa de juros acumulada por parcela.
    const principal = parseFloat(propostaValor) || 0; // -> Puxa o saldo base preenchido.
    const taxa = parseFloat(taxaJurosMensal) / 100; // -> Converte a porcentagem em valor decimal para a equação.
    const periodos = parseInt(propostaParcelas) || 1; // -> Puxa o número de meses da divisão.
    if (periodos <= 1) return principal; // -> Sem juros se o pagamento for à vista in parcela única.
    return principal * Math.pow(1 + taxa, periodos); // -> Retorna o Custo Efetivo Total (CET) corrigido pela curva de juros compostos.
  }; // -> Encerra o motor matemático.

  const totalComJuros = calcularMontanteComposto(); // -> Armazena em tempo real o montante final reajustado.
  const valorDaParcelaFixa = totalComJuros / (parseInt(propostaParcelas) || 1); // -> Divide o saldo corrigido simetricamente pela quantidade de meses.

  // -> INTERCEPTADOR DO SALVAMENTO DE ALTERAÇÕES EM LOTE PARA O FIRESTORE
  const tratarSalvarDados = (subStatusForçado = "") => { // -> Consolida os blocos da calculadora, notas e tarefas para despachar ao Firestore.
    let parcelasGeradas = []; // -> Inicializa a esteira estruturada vazia.
    let propostaConsolidada = {}; // -> Inicializa o mapa técnico.

    if (regimeLiquidacao === "acordo") { // -> SE ESTIVER NO MODO RESTRITO: Dispara a montagem clássica das datas futuras da Price.
      const totalMeses = parseInt(propostaParcelas) || 1; // -> Puxa a volumetria de meses.
      for (let i = 1; i <= totalMeses; i++) { // -> Roda o laço gerando parcela por parcela.
        const dataVenc = new Date(dataPrimeiroVenc + "T00:00:00"); // -> Instancia a data base de largada.
        dataVenc.setMonth(dataVenc.getMonth() + (i - 1)); // -> Adiciona saltos mensais sucessivos.
        parcelasGeradas.push({ // -> Empurra o objeto estruturado para o array.
          numero: i, // -> Guarda o número de controle.
          valor: parseFloat(valorDaParcelaFixa.toFixed(2)), // -> Guarda o valor fixado.
          vencimento: dataVenc.toISOString().split("T")[0], // -> Transforma em texto de data limpo.
          pago: false, // -> Seta inicial pendente.
          status: "a_vencer" // -> Tag de controle.
        });
      }
      propostaConsolidada = { // -> Consolida os rascunhos em formato Price.
        dataPrimeiroVencimento: dataPrimeiroVenc, // -> Guarda a data de carência.
        tipoPagamento: formaPagto, // -> Guarda o meio de liquidação.
        qtdParcelas: totalMeses, // -> Número de divisões.
        valorCobrado: parseFloat(totalComJuros.toFixed(2)), // -> Saldo final com juros compostos.
        parcelasSimuladas: parcelasGeradas // -> Coleção de boletos.
      };
    } else { // -> SE ESTIVER NO MODO FLEXÍVEL: Anula as tabelas Price e trava os mapas no formato de Conta Corrente livre.
      propostaConsolidada = { // -> Cria o mapa de conta corrente limpo.
        dataPrimeiroVencimento: dataPrimeiroVenc, // -> Data base.
        tipoPagamento: "Pix / Avulso", // -> Força identificador avulso.
        qtdParcelas: 1, // -> Parcela única de teto.
        valorCobrado: valorOriginalDívida, // -> O saldo cobrado caminha junto com o teto de amortização.
        parcelasSimuladas: [] // -> Limpa as simulações para não poluir o NoSQL.
      };
      parcelasGeradas = card.planoParcelas || []; // -> Mantém o histórico existente de faturas intacto.
    }

    const pacoteAtualizado = { // -> Cria o novo objeto unificado de dados modificados.
      ...card, // -> Preserva os dados imutáveis de nascimento do cartão de cobrança.
      subStatus: subStatusForçado || card.subStatus, // -> Carimba o veredito comercial (sucesso/insucesso) se houver encerramento de lote.
      planoParcelas: parcelasGeradas, // -> Injeta a matriz financeira decidida pelo operador.
      proposta: propostaConsolidada // -> Acopla o sub-objeto Price ou de Conta Corrente correspondente.
    };

    if (subStatusForçado) { // -> Se houver fechamento definitivo de lote da carteira.
      const logDesfecho = { // -> Prepara o log histórico indelével.
        conteudo: `Encantamento de lote finalizado com status de: ${subStatusForçado.toUpperCase()}`, // -> Grava o texto descritivo.
        dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Minutagem oficial.
      };
      pacoteAtualizado.historicoNotas = [logDesfecho, ...(card.historicoNotas || [])]; // -> Anexa no cabeçalho das notas.
    }

    aoSalvarProntuário(card.id, pacoteAtualizado); // -> Dispara o comando transmissor enviando o documento consolidado para o App.jsx gravar no Firebase.
    setTextoTarefa(""); // -> Reseta o rascunho de digitação.
  };

  // -> COMANDO DE AMORTIZAÇÃO EM CASCATA: Executa a baixa de Pix Avulso e abate o Saldo Devedor Vivo na hora
  const lidarLancarAbatimentoAvulso = () => { // -> Disparado pelo botão verde de conta corrente.
    const valorAbatido = parseFloat(novoAbatimento) || 0; // -> Limpa a digitação numérica do Pix recebido.
    if (valorAbatido <= 0) return; // -> Evita lançamentos nulos ou negativos na esteira.

    const novoSaldo = Math.max(0, valorOriginalDívida - valorAbatido); // -> Aplica a subtração matemática direta impedindo saldo negativo.
    card.valorVencido = novoSaldo; // -> Reconfigura reativamente o Saldo Devedor mestre na memória activa.

    // -> Injeta o rastro indelével de crédito na Linha do Tempo Analítica (Ata)
    const logAmortizacao = { // -> Cria o pacote descritivo de caixa.
      conteudo: `ABATIMENTO EM CONTA CORRENTE: Recebido Pix avulso de R$ ${valorAbatido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} no dia ${dataAbatimento.split("-").reverse().join("/")}. Saldo anterior: R$ ${valorOriginalDívida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ➔ Saldo atualizado: R$ ${novoSaldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`, // -> Monta o texto legível.
      dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Carimba o relógio.
    };
    card.historicoNotas = [logAmortizacao, ...(card.historicoNotas || [])]; // -> Joga no topo da pirâmide de auditoria.

    setNovoAbatimento(""); // -> Zera a caixinha do Pix.
    alert(`🟩 BAIXA CONFIRMADA!\nAbatimento de R$ ${valorAbatido.toLocaleString("pt-BR")} computado no saldo. Clique em 'Salvar Prontuário' para gravar síncronamente na nuvem.`); // -> Feedback visual síncrono.
  };

  // -> MINI CONTROLADOR PARA INSERÇÃO IMEDIATA DE TAREFAS NA TELA
  const lidarAdicionarTarefaLocal = () => { // -> Prepara e anexa a tarefa estruturada diretamente no array do card em RAM.
    if (!textoTarefa.trim()) return; // -> Trava antiqueda contra cliques acidentais vazios.
    const novaTarefaEstruturada = { // -> Monta a peça mestre da tarefa baseada no documento NoSQL.
      texto: `[${tipoTarefa}] ${textoTarefa.trim()}`, // -> Concatena o tipo (Ligação, Reunião) com a instrução do operador.
      criadoPor: card.responsavel || "Lucas Vieira", // -> Identifica o cobrador logado da mesa.
      data: new Date().toISOString().split("T")[0], // -> Grava o dia atual da ocorrência.
      dataCriacao: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Minutagem del agendamento.
    };
    card.tarefas = [novaTarefaEstruturada, ...(card.tarefas || [])]; // -> Anexa no topo do array histórico sem limpar os dados paralelos.
    
    const logTarefaAuto = { // -> Prepara a ata automática.
      conteudo: `Agendada nova tarefa: ${novaTarefaEstruturada.texto}`, // -> Descrição da ação.
      dataHora: novaTarefaEstruturada.dataCriacao // -> Carimba o tempo.
    };
    card.historicoNotas = [logTarefaAuto, ...(card.historicoNotas || [])]; // -> Registra o rastro na linha do tempo.
    
    setTextoTarefa(""); // -> Limpa a caixa de entrada da aba.
    alert("📌 Ação registrada na esteira! Clique em 'Salvar Prontuário' para sincronizar com a nuvem."); // -> Feedback sóbrio.
  };

  return ( // -> Renderiza o super-painel tridimensional espelhado na tela.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.5)", zIndex: 6500, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", boxSizing: "border-box" }}>
      <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "1150px", height: "90vh", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box" }}>
        
        {/* TOPO DO PAINEL: DADOS DA CONTA JURÍDICA E ETIQUETA DE ESTADO */}
        <div style={{ padding: "16px 24px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "10px", background: "#0f172a", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <FileText size={10} strokeWidth={2.5} />
              <span>CONTA ESPELHO #{card.codigo}</span>
            </span>
            <h2 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0 0 0", fontSize: "16px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
              <span>{card.cliente}</span>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {card.subStatus && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", background: card.subStatus === "sucesso" ? "#d1fae5" : "#fee2e2", color: card.subStatus === "sucesso" ? "#065f46" : "#991b1b", padding: "4px 10px", borderRadius: "4px", fontWeight: "800", textTransform: "uppercase" }}>
                <ShieldAlert size={12} strokeWidth={2.5} />
                <span>FIM DE LINHA: {card.subStatus}</span>
              </span>
            )}
            <span style={{ fontSize: "11px", background: "#dbeafe", color: "#1e40af", padding: "4px 12px", borderRadius: "20px", fontWeight: "700", textTransform: "uppercase" }}>Raia CRM: {colunaId}</span>
            
            {/* 🛠️ GRID DE BOTÕES DE COMANDO DO HEAD: Unifica os gatilhos de Excluir NoSQL e de Arquivar Limbo na ala superior */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {/* 🗑️ NOVO BOTÃO DE EXCLUSÃO REAL SÔBRIO: Posicionado perfeitamente na ala interna do Prontuário para banir o registro da base */}
              {aoExcluirCardNoModal && (
                <button
                  type="button" // -> Especifica o elemento como botão padrão comercial plano.
                  onClick={() => aoExcluirCardNoModal(card.id, card.cliente)} // -> Dispara a trituração física NoSQL irreversível criada no App.jsx.
                  style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "16px", cursor: "pointer", padding: "4px 8px", display: "flex", alignItems: "center", transition: "color 0.15s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                  title="Excluir esta cobrança definitivamente do banco NoSQL" // -> Tooltip explicativa.
                >
                  <Trash2 size={16} strokeWidth={2.5} /> {/* -> Injeta o ícone da lixeira sutil do Lucide. */}
                </button>
              )}

              {aoAlternarArquivamentoNoModal && (
                <button
                  type="button" // -> Especifica o elemento como botão neutro nativo.
                  onClick={() => aoAlternarArquivamentoNoModal(card.id, card.cliente)} // -> Aciona a inversão da flag síncronamente no mestre App.jsx.
                  style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "16px", cursor: "pointer", padding: "4px 8px", display: "flex", alignItems: "center", transition: "color 0.15s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0f172a"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                  title={exibirArquivados ? "Desarquivar este card e mandar de volta para o fluxo ativo" : "Arquivar este card e mandar para o Limbo"} // -> Tooltip explicativa dinâmica baseada na tela aberta.
                >
                  {exibirArquivados ? <ArchiveRestore size={16} strokeWidth={2.5} style={{ color: "#2563eb" }} /> : <Archive size={16} strokeWidth={2.5} />}
                </button>
              )}
            </div>

            <button 
              type="button" 
              onClick={aoFechar} 
              style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", padding: "4px", transition: "color 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#0f172a"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* CORPO CENTRAL DO PRONTUÁRIO: ARQUITETURA ESPELHADA LADO A LADO */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "380px 1fr", overflow: "hidden", boxSizing: "border-box" }}>
          
          {/* =========================================================================================
              ⬅️ ALA ESQUERDA FIXA: O RAIO-X DO INADIMPLENTE E A FIAÇÃO DE CONTACTOS DA BASE
              ========================================================================================= */}
          <div style={{ padding: "20px", borderRight: "1px solid #e2e8f0", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", boxSizing: "border-box", background: "#f8fafc" }}>
            
            {/* BLOCO 1: DETALHES CADASTRAIS DA PJ */}
            <div style={{ textAlign: "left" }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <Activity size={13} strokeWidth={2.5} style={{ color: "#475569" }} />
                <span>Ficha do Devedor Ativo</span>
              </h4>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px"} }><span style={{ color: "#64748b" }}>Mesa / Gestor:</span> <User size={12} strokeWidth={2} style={{ color: "#64748b" }} /> <span>{card.responsavel || "Lucas Vieira"}</span></div>
                <div><span style={{ color: "#64748b" }}>Saldo Devedor Vivo:</span> <span style={{ color: "#ef4444", fontWeight: "800" }}>R$ {valorOriginalDívida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></div>
                {card.proposta?.valorCobrado && card.status === "cobranca" && (
                  <div><span style={{ color: "#16a34a" }}>Último Acordo Price:</span> R$ {card.proposta.valorCobrado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({card.proposta.qtdParcelas}x)</div>
                )}
              </div>
            </div>

            {/* BLOCO 2: MINI-GRID DE CONTACTOS HUMANOS DA BASE */}
            <div style={{ textAlign: "left" }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <Phone size={13} strokeWidth={2.5} style={{ color: "#475569" }} />
                <span>Canais de Acionamento Imediato</span>
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {card.contato && (
                  <div style={{ padding: "8px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", borderLeft: "3px solid #0f172a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", color: "#0f172a" }}><User size={12} strokeWidth={2} /> <span>{card.contato.nome} (Principal)</span></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Link size={10} strokeWidth={2} /> <span>Vínculo Fiscal: {card.contato.vinculo || "proprio"}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={10} strokeWidth={2} /> <span>{card.contato.email}</span></div>
                    </div>
                    <div style={{ marginTop: "6px", fontWeight: "800", color: "#2563eb", display: "flex", alignItems: "center", gap: "4px" }}><Phone size={11} strokeWidth={2.5} /> <span>{card.contato.telefone}</span></div>
                  </div>
                )}
                {contatosDesteDevedor.map((con) => (
                  <div key={con.id} style={{ padding: "8px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "11px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", color: "#334155" }}><User size={11} strokeWidth={2} /> <span>{con.nome}</span></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", color: "#64748b", marginTop: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Link size={10} strokeWidth={2} /> <span>Papel: {con.tipoVinculo}</span></div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#2563eb", fontWeight: "bold" }}><Phone size={10} strokeWidth={2} /> <span>{con.telefone}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* =========================================================================================
              ➡️ ALA DIREITA: SISTEMA DE NAVEGAÇÃO MULTIFUNCIONAL POR ABAS OPERACIONAIS
              ========================================================================================= */}
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            
            {/* 📑 NAVEGADOR DE ABAS SUPERIOR (ESTILO SÓBRIO DO ESCRITÓRIO) */}
            <div style={{ display: "flex", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", padding: "0 12px" }}>
              <button type="button" onClick={() => setAbaAtiva("tarefas")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "12px 16px", border: "none", background: abaAtiva === "tarefas" ? "#ffffff" : "none", borderBottom: abaAtiva === "tarefas" ? "2px solid #0f172a" : "none", color: "#0f172a", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase" }}>
                <ListTodo size={13} strokeWidth={2.5} />
                <span>Ocorrências e Tarefas</span>
              </button>
              <button type="button" onClick={() => setAbaAtiva("historico")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "12px 16px", border: "none", background: abaAtiva === "historico" ? "#ffffff" : "none", borderBottom: abaAtiva === "historico" ? "2px solid #0f172a" : "none", color: "#0f172a", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase" }}>
                <History size={13} strokeWidth={2.5} />
                <span>Histórico Analítico</span>
              </button>
              <button type="button" onClick={() => setAbaAtiva("proposta")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "12px 16px", border: "none", background: abaAtiva === "proposta" ? "#ffffff" : "none", borderBottom: abaAtiva === "proposta" ? "2px solid #0f172a" : "none", color: "#0f172a", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase" }}>
                <BadgePercent size={13} strokeWidth={2.5} />
                <span>Estratégia de Quitação</span>
              </button>
            </div>

            {/* PAINEL DINÂMICO CONTEXTUAL DAS ABAS DE TRABALHO */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", boxSizing: "border-box" }}>
              
              {/* ABA A: PAINEL DE OCORRÊNCIAS E GATILHOS DE TAREFAS */}
              {abaAtiva === "tarefas" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                    <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 8px 0", fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>
                      <Plus size={13} strokeWidth={2.5} />
                      <span>Agendar Novo Alerta / Retorno na Esteira</span>
                    </h5>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <select value={tipoTarefa} onChange={(e) => setTipoTarefa(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", background: "white", color: "#0f172a", cursor: "pointer" }}>
                        <option value="Ligação">Ligação Telefônica</option>
                        <option value="Mensagem">WhatsApp / SMS</option>
                        <option value="Reunião">Reunião Conciliação</option>
                        <option value="Lembrete">Lembrete Sistema</option>
                      </select>
                      <input type="text" placeholder="Digitar instrução operacional técnica da tarefa..." value={textoTarefa} onChange={(e) => setTextoTarefa(e.target.value)} style={{ flex: 1, padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff" }} />
                      <button type="button" onClick={lidarAdicionarTarefaLocal} style={{ background: "#0f172a", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>Anexar</button>
                    </div>
                  </div>

                  <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "8px 0 0 0", fontSize: "12px", fontWeight: "800", color: "#475569" }}>
                    <ListTodo size={13} strokeWidth={2} style={{ color: "#475569" }} />
                    <span>Fila de Ações Programadas</span>
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {(card.tarefas || []).length === 0 ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", padding: "12px", background: "#f8fafc", borderRadius: "6px", fontStyle: "italic" }}>
                        <FolderMinus size={13} strokeWidth={2} /> {/* -> Sincronizado reativamente na RAM. */}
                        <span>Nenhuma ação pendente fixada na carcaça deste devedor.</span>
                      </div>
                    ) : (
                      card.tarefas.map((tar, idx) => (
                        <div key={idx} style={{ padding: "10px 12px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", gap: "10px" }}>
                          <span style={{ fontWeight: "600", color: "#0f172a", textAlign: "left" }}>{tar.texto || tar.descricao}</span>
                          <span style={{ fontSize: "10px", color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>Por: {tar.criadoPor || "Operador"} em {tar.dataCriacaoFormatada || tar.data}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ABA B: HISTÓRICO ANALÍTICO INDELÉVEL DO CASO */}
              {abaAtiva === "historico" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                  <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 4px 0", fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>
                    <History size={13} strokeWidth={2} />
                    <span>Linha do Tempo e Logs de Gravação de Lote</span>
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {(card.historicoNotas || []).length === 0 ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", padding: "16px", fontStyle: "italic" }}>
                        <FolderMinus size={13} strokeWidth={2} />
                        <span>Nenhum histórico estruturado de minutas na fiação da conta.</span>
                      </div>
                    ) : (
                      card.historicoNotas.map((nota, index) => (
                        <div key={index} style={{ padding: "10px", background: "#f8fafc", borderRadius: "6px", borderLeft: "3px solid #475569", fontSize: "12px", boxSizing: "border-box" }}>
                          <div style={{ color: "#1e293b", fontWeight: "600", lineHeight: "1.4" }}>{nota.conteudo}</div>
                          <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "4px", fontWeight: "700" }}>🔒 Autenticado em: {nota.dataHora}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ABA C RECONFIGURADA: CALCULADORA PRICE VS PAINEL DE ABATIMENTO EM CONTA CORRENTE */}
              {abaAtiva === "proposta" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
                  
                  {/* INTERRUPTOR SELETOR DE REGIME DO CLICKUP */}
                  <div style={{ background: "#f1f5f9", padding: "8px", borderRadius: "8px", display: "flex", gap: "8px", border: "1px solid #cbd5e1" }}>
                    <button type="button" onClick={() => setRegimeLiquidacao("acordo")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", flex: 1, padding: "8px", border: "none", borderRadius: "6px", background: regimeLiquidacao === "acordo" ? "#0f172a" : "none", color: regimeLiquidacao === "acordo" ? "white" : "#475569", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                      <BadgePercent size={13} strokeWidth={2.5} />
                      <span>Acordo Parcelado (Price)</span>
                    </button>
                    <button type="button" onClick={() => setRegimeLiquidacao("conta_corrente")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", flex: 1, padding: "8px", border: "none", borderRadius: "6px", background: regimeLiquidacao === "conta_corrente" ? "#0f172a" : "none", color: regimeLiquidacao === "conta_corrente" ? "white" : "#475569", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                      <Coins size={13} strokeWidth={2.5} />
                      <span>Abatimento Livre (Conta Corrente)</span>
                    </button>
                  </div>

                  {regimeLiquidacao === "acordo" ? (
                    /* INTERFACE A: MOTOR FINANCEIRO PRICE */
                    <>
                      <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0 0 0", fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>
                        <Coins size={13} strokeWidth={2} />
                        <span>Mesa de Simulação de Faturamento de Acordos</span>
                      </h5>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>VALOR NOMINAL ACORDADO (R$)</label>
                          <input type="number" value={propostaValor} onChange={(e) => setPropostaValor(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#2563eb", background: "#ffffff" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>DIVISÃO DE PARCELAS EXPANDIDA</label>
                          <input type="number" min="1" max="36" value={propostaParcelas} onChange={(e) => setPropostaParcelas(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: "#ffffff" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                            <Percent size={11} strokeWidth={2.5} />
                            <span>TAXA DE JUROS DE MORA (% A.M.)</span>
                          </label>
                          <input type="number" step="0.1" value={taxaJurosMensal} onChange={(e) => setTaxaJurosMensal(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: "#ffffff" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>FORMA DE LIQUIDAÇÃO</label>
                          <select value={formaPagto} onChange={(e) => setFormaPagto(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", background: "white", color: "#0f172a", cursor: "pointer" }}>
                            <option value="Boleto">Boleto Bancário</option>
                            <option value="Pix">Transferência Pix</option>
                            <option value="A vista">Dinheiro / À Vista</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gridColumn: "1 / -1" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                            <Calendar size={11} strokeWidth={2.5} />
                            <span>DATA DE CARÊNCIA DO PRIMEIRO VENCIMENTO</span>
                          </label>
                          <input type="date" value={dataPrimeiroVenc} onChange={(e) => setDataPrimeiroVenc(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: "#ffffff" }} />
                        </div>
                      </div>

                      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "6px", fontSize: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", color: "#1e40af", marginBottom: "4px" }}>
                          <Activity size={12} strokeWidth={2.5} />
                          <span>Demonstrativo do Custo Efetivo Total (CET):</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", color: "#1e3a8a", fontWeight: "600" }}>
                          <div>Montante Bruto Corrigido: R$ {totalComJuros.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                          <div>Valor da Parcela Mensal: {propostaParcelas}x de R$ {valorDaParcelaFixa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* INTERFACE B INÉDITA: AMORTIZAÇÃO EM CONTA CORRENTE LIVRE */
                    <>
                      <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0 0 0", fontSize: "12px", fontWeight: "800", color: "#0f172a" }}>
                        <Coins size={13} strokeWidth={2} />
                        <span>Lançar Recebimento Avulso (Abatimento de Saldo)</span>
                      </h5>
                      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>VALOR DO PIX / CRÉDITO (R$)</label>
                          <input type="number" placeholder="0.00" value={novoAbatimento} onChange={(e) => setNovoAbatimento(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#16a34a", background: "#ffffff" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                            <Calendar size={11} strokeWidth={2.5} />
                            <span>DATA DO DEPÓSITO</span>
                          </label>
                          <input type="date" value={dataAbatimento} onChange={(e) => setDataAbatimento(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#0f172a", background: "#ffffff" }} />
                        </div>
                        <button type="button" onClick={lidarLancarAbatimentoAvulso} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", gridColumn: "1 / -1", background: "#16a34a", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#15803d"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}>
                          <CheckCircle2 size={13} strokeWidth={2.5} />
                          <span>Confirmar Abatimento e Recalcular Saldo Devedor</span>
                        </button>
                      </div>

                      <div style={{ background: "#fff7ed", border: "1px solid #ffedd5", padding: "12px", borderRadius: "6px", fontSize: "11px", color: "#c2410c", fontWeight: "600" }}>
                        💡 DIRETRIZ DE MERCADO COBRANÇA: Os lançamentos avulsos aplicam abatimentos contínuos em cascata direto no saldo devedor principal sem compromisso de datas fixas no calendário.
                      </div>
                    </>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>

        {/* =========================================================================================
            🚦 BASE DO MODAL MUTÁVEL: DECISÃO DE VEREDITO DE GOVERNANÇA COMERCIAL SANADO
            ========================================================================================= */}
        <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
          {colunaId === "finalizado" ? (
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "800", color: "#ef4444" }}>
                <ShieldAlert size={14} strokeWidth={2.5} />
                <span>CONCLUSÃO MANDATÓRIA DE CARTEIRA:</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => tratarSalvarDados("sucesso")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#10b981", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f9f67"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10b981"}>
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  <span>Sucesso (Acordo Quitado)</span>
                </button>
                <button type="button" onClick={() => tratarSalvarDados("insucesso")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ef4444", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}>
                  <XCircle size={13} strokeWidth={2.5} />
                  <span>Insucesso (Contencioso)</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <button type="button" onClick={aoFechar} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#475569", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}>Sair sem Salvar</button>
              <button type="button" onClick={() => tratarSalvarDados("")} style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 18px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>Salvar Prontuário</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}