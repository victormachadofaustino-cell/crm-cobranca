import React, { useState, useEffect } from "react"; // -> Traz a biblioteca mestre do React e os ganchos de estado e efeito para monitorar o ciclo de vida e abas ativas do painel.
import { X, ShieldAlert, Landmark, FileText, ListTodo, History, BadgePercent, CheckCircle2, XCircle, Archive, ArchiveRestore, Trash2 } from "lucide-react"; // -> Mantém a coleção de ícones lineares corporativos da Lucide rigorosamente preservada no topo, agora incluindo os ícones de arquivar e lixeira.

// -> IMPORTAÇÃO DOS FILHOS ESPECIALISTAS GARANTINDO O VÍNCULO DA EXTENSÃO DENTRO DA MESMA PASTA
import FichaDevedorPainel from "./Prontuario/FichaDevedorPainel"; // -> Conecta o painel esquerdo dedicado que cuida do cadastro, contatos e da sacola de Notas Fiscais.
import AbaOcorrencias from "./Prontuario/AbaOcorrencias"; // -> Conecta o componente especialista na fila de ações programadas e novas tarefas.
import AbaHistorico from "./Prontuario/AbaHistorico"; // -> Conecta o componente especialista na linha do tempo analítica e logs indeléveis de auditoria.
import AbaProposta from "./Prontuario/AbaProposta"; // -> Conecta o componente especialista na calculadora Price e abatimentos de Conta Corrente.

export default function ModalProntuario({ aberto, aoFechar, card, colunaId, contatosBase = [], aoSalvarProntuário, exibirArquivados = false, aoAlternarArquivamentoNoModal, aoExcluirCardNoModal }) { // -> Declara a função do componente Maestro recebendo os ganchos e dados do pai.
  
  const [abaAtiva, setAbaAtiva] = useState("tarefas"); // -> CONTROLADOR DE NAVEGAÇÃO: Inicializa a visualização focada no painel imediato de Ocorrências e Tarefas.

  // 🛠️ INJEÇÃO DO HUB BUFFER REATIVO TOTALMENTE PROTEGIDO CONTRA SINAIS NULOS DO FIREBASE
  const [cardModificado, setCardModificado] = useState(() => card || {}); // -> Cria o estado de buffer inicializando com o devedor ativo ou um objeto vazio de contingência.

  // -> GATILHO REATIVO DE ANTICRASH: Força o buffer de RAM a recarregar e espelhar as informações do novo devedor assim que ele muda no CRM.
  useEffect(() => { // -> Sincroniza o estado toda vez que o card mestre lá no App.jsx comuta.
    if (card) { // -> Verifica se o objeto do devedor é válido e existente.
      setCardModificado(card); // -> Sobrescreve o buffer com os dados updated e limpos vindos do banco de dados.
    }
  }, [card]); // -> Escuta rigorosamente o gatilho de transição do ID do card devedor.

  // -> TRAVA DE SEGURANÇA IMEDIATA ANTI-ESTOURO DE MEMÓRIA DO NAVEGADOR
  if (!aberto || !card) return null; // -> Se o modal estiver fechado, mata a renderização imediatamente para não poluir o navegador.

  // -> CONFIGURAÇÃO DE TRAVA DE SEGURANÇA CRÍTICA CONFORME DIRETRIZ: Junção de [feito] e [finalizado] para blindar mutações fiscais.
  const categoriaBloqueada = colunaId === "acordo" || colunaId === "finalizado" || card?.categoria === "feito" || card?.categoria === "finalizado"; // -> Se for verdadeiro, congela a possibilidade de adicionar ou remover títulos fiscais.

  // -> INTERCEPTADOR DE SUB-ABAS (BUFFER REATIVO IN RAM): Escuta as alterações feitas dentro da calculadora Price e guarda no balde local.
  const lidarMutacaoLocalDasSubAbas = (pacoteModificado) => { // -> Recebe a carga útil de faturamento e parcelas recalculadas.
    setCardModificado(pacoteModificado); // -> Sincroniza a memória RAM do modal mestre com os cálculos novos do Excel.
  };

  return ( // -> Desenha a moldura tridimensional mestre do prontuário na tela do cobrador.
    // 🎭 CORTINA TRASEIRA TRANSLÚCIDA: Dá profundidade visual e foca a atenção do operador estritamente nas negociações.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.5)", zIndex: 6500, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", boxSizing: "border-box" }}>
      
      {/* 📦 CONTÊINER MAESTRO BRANCO (MOLDURA ULTRA-LARGA PARA OS DOIS PAINÉIS LADO A LADO) */}
      <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "1250px", height: "92vh", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box" }}>
        
        {/* =========================================================================================
            🏛️ TOPO DO PAINEL GERAL: DADOS DE IDENTIFICAÇÃO E BANDEIRAS DE GOVERNANÇA DE LOTE
            ========================================================================================= */}
        <div style={{ padding: "16px 24px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "10px", background: "#0f172a", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <FileText size={10} strokeWidth={2.5} />
                <span>DEVEDOR HOMOLOGADO NoSQL INADIMPLÊNCIA</span>
              </span>
              <span style={{ fontSize: "10px", background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px", fontWeight: "800", border: "1px solid #bae6fd" }}>
                {/* 🔒 PROTEÇÃO DE ENCADEAMENTO OPCIONAL APLICADA: Impede o erro 'Cannot read properties of null reading titulos' */}
                Sacola Ativa: {cardModificado?.titulos ? cardModificado.titulos.length : 0} NFs
              </span>
              {categoriaBloqueada && ( 
                <span style={{ fontSize: "10px", background: "#ffedd5", color: "#c2410c", padding: "2px 6px", borderRadius: "4px", fontWeight: "800", border: "1px solid #fed7aa", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <Landmark size={10} /> <span>🔒 LOTE DE ACORDO TRANCADO (IMUTÁVEL)</span>
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
              {/* 🔒 PROTEÇÃO CONTRA NULOS: Garante exibição de fallback textual caso o estado desmonte de forma abrupta */}
              {cardModificado?.cliente || "Carregando..."}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", background: "#dbeafe", color: "#1e40af", padding: "4px 12px", borderRadius: "20px", fontWeight: "700", textTransform: "uppercase" }}>Raia CRM: {colunaId}</span>
            
            {/* 🛠️ BOTÃO DE ARQUIVAMENTO REATIVO DO MODAL (PONTO VERMELHO SUPERIOR) */}
            <button
              type="button"
              onClick={() => {
                aoAlternarArquivamentoNoModal(card.id, card.cliente); // -> Dispara a rota do limbo trocando a flag booleana.
                aoFechar(); // -> Fecha o prontuário imediatamente após a ação preventiva para atualizar a grade do CRM.
              }}
              style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", padding: "4px", transition: "color 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = exibirArquivados ? "#2563eb" : "#eab308"} // -> Muda para azul se estiver desarquivando ou amarelo se for arquivar ao passar o mouse.
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"} // -> Retorna à cor cinza neutra original quando o mouse sai.
              title={exibirArquivados ? "Desarquivar este card" : "Arquivar este card"} // -> Mostra o texto explicativo contextual flutuando ao passar o mouse.
            >
              {exibirArquivados ? <ArchiveRestore size={18} strokeWidth={2.5} /> : <Archive size={18} strokeWidth={2.5} />} {/* -> Alterna o ícone de caixa aberta ou fechada conforme o fluxo ativo. */}
            </button>

            {/* 🛠️ BOTÃO DE EXCLUSÃO DEFINITIVA DO MODAL (PONTO VERMELHO SUPERIOR) */}
            <button
              type="button"
              onClick={() => {
                if (confirm(`⚠️ ALERTA DE DESTRUIÇÃO NO FIREBASE:\n\nTem certeza absoluta de que deseja triturar permanentemente o prontuário de "${card.cliente}"?\n\nEsta ação apagará todos os dados NoSQL para sempre e não pode ser desfeita.`)) { // -> Exibe o aviso clássico de barreira jurídica de segurança.
                  aoExcluirCardNoModal(card.id, card.cliente); // -> Executa o triturador do Firestore apagando o nó permanentemente.
                  aoFechar(); // -> Encerra o modal ativo após sumir com o registro das coleções.
                }
              }}
              style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", padding: "4px", transition: "color 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} // -> Acende em vermelho vivo de perigo ao posicionar o cursor.
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"} // -> Retorna à cor padrão de segurança cinza.
              title="Excluir cobrança definitivamente" // -> Rótulo explicativo para o advogado operador.
            >
              <Trash2 size={18} strokeWidth={2.5} /> {/* -> Desenha o ícone linear da lixeira de eliminação absoluta. */}
            </button>

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

        {/* =========================================================================================
            分 CORPO CENTRAL DIVIDIDO: PAINEL ESQUERDO FIXO vs SISTEMA DE ABAS DA DIREITA
            ========================================================================================= */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "500px 1fr", overflow: "hidden", boxSizing: "border-box" }}>
          
          {/* ⬅️ 1. PAINEL ESQUERDO DEDICADO COBERTO POR GATILHO COMPACTADO CONTRA OBJETOS NULOS */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            {cardModificado && cardModificado.id && ( // -> Renderiza o bloco apenas se houver ID válido ativo na memória RAM.
              <FichaDevedorPainel 
                card={cardModificado} 
                colunaId={colunaId} 
                contatosBase={contatosBase} 
                categoriaBloqueada={categoriaBloqueada} 
                aoSalvarLocal={lidarMutacaoLocalDasSubAbas}
                aoAlternarArquivamentoNoModal={aoAlternarArquivamentoNoModal}
                aoExcluirCardNoModal={aoExcluirCardNoModal}
                exibirArquivados={exibirArquivados}
              />
            )}
          </div>

          {/* ➡️ 2. ALA DIREITA DINÂMICA */}
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            
            {/* BARRA DE NAVEGAÇÃO DAS ABAS DA DIREITA */}
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
                <span>Proposta de Acordo</span>
              </button>
            </div>

            {/* AREA EXCLUSIVA DE CONTEÚDO DAS ABAS INJETANDO O REDIRECIONADOR DE BUFFER LOCAL WITH TRAVAS VITAIS */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", boxSizing: "border-box" }}>
              {abaAtiva === "tarefas" && cardModificado && cardModificado.id && ( // -> Garante que o componente de ocorrências só monte com ID verificado.
                <AbaOcorrencias card={cardModificado} aoSalvarLocal={lidarMutacaoLocalDasSubAbas} categoryBloqueada={categoriaBloqueada} />
              )}
              {abaAtiva === "historico" && cardModificado && cardModificado.id && ( // -> Garante que a linha do tempo só monte com ID verificado.
                <AbaHistorico card={cardModificado} />
              )}
              {abaAtiva === "proposta" && cardModificado && cardModificado.id && ( // -> Garante que a calculadora Price só monte com ID verificado.
                <AbaProposta card={cardModificado} aoSalvarLocal={lidarMutacaoLocalDasSubAbas} categoriaBloqueada={categoriaBloqueada} />
              )}
            </div>

          </div>
        </div>

        {/* =========================================================================================
            🚦 BASE DO MODAL MUTÁVEL (CORRIGIDO CRITICAMENTE PARA EXECUTAR O BARRAMENTO COMPACTADO)
            ========================================================================================= */}
        <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
          {colunaId === "finalizado" ? (
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "800", color: "#ef4444" }}>
                <ShieldAlert size={14} strokeWidth={2.5} />
                <span>CONCLUSÃO MANDATÓRIA DE CARTEIRA:</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => aoSalvarProntuário(card.id, { ...cardModificado, subStatus: "sucesso" })} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#10b981", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f9f67"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10b981"}>
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  <span>Sucesso (Acordo Quitado)</span>
                </button>
                <button type="button" onClick={() => aoSalvarProntuário(card.id, { ...cardModificado, subStatus: "insucesso" })} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ef4444", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}>
                  <XCircle size={13} strokeWidth={2.5} />
                  <span>Insucesso (Contencioso)</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <button type="button" onClick={aoFechar} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#475569", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                Anular Modificações
              </button>
              
              {/* 🛠️ FIÇÃO CORRIGIDA CONTRA O B.O. DE RESET: Se a proposta em RAM for nula/vazia (sinal de reset completo), força o status a voltar para "atendimento" de forma limpa, quebrando o loop fantasma. */}
              <button 
                type="button" 
                onClick={() => { 
                  const statusFinalCalculado = cardModificado?.proposta ? "acordo" : "atendimento"; // -> 🛠️ SELETOR DE CONFORMIDADE: Se a proposta em RAM foi limpa no reset, força o status a voltar para atendimento síncronamente.
                  const pacoteFinalParaGravar = { // -> Constrói a carga útil unificada de dados.
                    ...cardModificado, // -> Puxa todas as notas fiscais e parcelamentos computados do shadow state local.
                    status: cardModificado?.proposta ? "acordo" : (cardModificado?.status === "acordo" ? "atendimento" : (cardModificado?.status || "atendimento")) // -> 🛠️ TRITURADOR DE BOLETOS FANTASMA: Se o status era acordo mas a proposta sumiu na calculadora, redefine para atendimento quebrando a trava de persistence.
                  };
                  aoSalvarProntuário(card.id, pacoteFinalParaGravar); // -> Despacha o pacote estruturado diretamente para o Firebase.
                  alert("🚀 PROPOSTA PERSISTIDA WITH SUCESSO!\n\nAs amarrações fiscais foram consolidadas e trancadas no Firebase."); // -> Notifica o advogado operador.
                  aoFechar(); // -> Encerra a exibição da viewport do modal de atendimento.
                }} 
                style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 18px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "background 0.15s" }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
              >
                Salvar Prontuário
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}