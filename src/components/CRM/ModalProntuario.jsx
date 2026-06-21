import React, { useState } from "react"; // -> Importa a biblioteca mestre do React e o gancho useState para monitorar as abas ativas do painel da direita.
import { X, ShieldAlert, Landmark, FileText, ListTodo, History, BadgePercent, CheckCircle2, XCircle } from "lucide-react"; // -> CORREÇÃO CIRÚRGICA DE DUAS VIAS: Soldado 'ListTodo', 'History' e 'BadgePercent' na fiação para corrigir o erro de referência nos desfechos de lote.

// -> IMPORTAÇÃO DAS 4 PEÇAS DE LEGO INDEPENDENTES (OS COMPONENTES FILHOS QUE DESMEMBRAMOS)
import FichaDevedorPainel from "./Prontuario/FichaDevedorPainel"; // -> Conecta o painel esquerdo dedicado que cuida do cadastro, contatos e da sacola de Notas Fiscais.
import AbaOcorrencias from "./Prontuario/AbaOcorrencias"; // -> Conecta o componente especialista na fila de ações programadas e novas tarefas.
import AbaHistorico from "./Prontuario/AbaHistorico"; // -> Conecta o componente especialista na linha do tempo analítica e logs indeléveis de auditoria.
import AbaProposta from "./Prontuario/AbaProposta"; // -> Conecta o componente especialista na calculadora Price e abatimentos de Conta Corrente.

export default function ModalProntuario({ aberto, aoFechar, card, colunaId, contatosBase = [], aoSalvarProntuário, exibirArquivados = false, aoAlternarArquivamentoNoModal, aoExcluirCardNoModal }) { // -> Declara o Hub recebendo as triggers e bases do maestro mestre App.jsx.
  
  // -> TRAVA DE SEGURANÇA IMEDIATA: Se o App dizer que o prontuário está fechado ou não houver devedor selecionado, anula a renderização na hora.
  if (!aberto || !card) return null; // -> Retorna nulo para não injetar HTML desnecessário na árvore do navegador.

  // -> CONFIGURAÇÃO DE TRAVA DE SEGURANÇA CRÍTICA CONFORME DIRETRIZ DO VICTOR: Junção de [feito] e [finalizado] para blindar mutações.
  const categoriaBloqueada = colunaId === "acordo" || colunaId === "finalizado" || card.categoria === "feito" || card.categoria === "finalizado"; // -> Se for verdadeiro, congela a possibilidade de adicionar ou remover títulos fiscais.

  // -> CONTROLADOR DE NAVEGAÇÃO INTERNA DA ALA DIREITA (ABAS OPERACIONAIS EXCLUSIVAS)
  const [abaAtiva, setAbaAtiva] = useState("tarefas"); // -> NATIVA POR PADRÃO: Inicializa a visualização focada no painel imediato de Ocorrências e Tarefas.

  // -> COMANDO INTEGRADOR EM RAM: Intercepta e centraliza as atualizações das sub-abas repassando-as direto para a nuvem do Firebase.
  const salvarMutacaoProntuario = (pacoteModificado) => {
    aoSalvarProntuário(card.id, pacoteModificado); // -> Despacha o documento reestruturado contendo a sacola de títulos ou desfechos para o Firestore.
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
                Sacola Ativa: {card.titulos ? card.titulos.length : 1} NFs
              </span>
              {categoriaBloqueada && ( // -> Alerta visual de segurança: Avisa o operador em tempo real que o lote está em regime de imutabilidade.
                <span style={{ fontSize: "10px", background: "#ffedd5", color: "#c2410c", padding: "2px 6px", borderRadius: "4px", fontWeight: "800", border: "1px solid #fed7aa", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <Landmark size={10} /> <span>🔒 LOTE DE ACORDO TRANCADO (IMUTÁVEL)</span>
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
              {card.cliente}
            </h2>
          </div>

          {/* CONTROLES DE FECHAMENTO E GATILHOS RÁPIDOS DA ACENÇÃO SUPERIOR */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", background: "#dbeafe", color: "#1e40af", padding: "4px 12px", borderRadius: "20px", fontWeight: "700", textTransform: "uppercase" }}>Raia CRM: {colunaId}</span>
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
          
          {/* ⬅️ 1. PAINEL ESQUERDO DEDICADO */}
          <FichaDevedorPainel 
            card={card} 
            colunaId={colunaId} 
            contatosBase={contatosBase} 
            categoriaBloqueada={categoriaBloqueada} 
            aoSalvarLocal={salvarMutacaoProntuario}
            aoAlternarArquivamentoNoModal={aoAlternarArquivamentoNoModal}
            aoExcluirCardNoModal={aoExcluirCardNoModal}
            exibirArquivados={exibirArquivados}
          />

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
                <span>Estratégia de Quitação</span>
              </button>
            </div>

            {/* AREA EXCLUSIVA DE CONTEÚDO DAS ABAS */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", boxSizing: "border-box" }}>
              {abaAtiva === "tarefas" && (
                <AbaOcorrencias card={card} aoSalvarLocal={salvarMutacaoProntuario} categoriaBloqueada={categoriaBloqueada} />
              )}
              {abaAtiva === "historico" && (
                <AbaHistorico card={card} />
              )}
              {abaAtiva === "proposta" && (
                <AbaProposta card={card} aoSalvarLocal={salvarMutacaoProntuario} categoriaBloqueada={categoriaBloqueada} />
              )}
            </div>

          </div>
        </div>

        {/* =========================================================================================
            🚦 BASE DO MODAL MUTÁVEL (CORRIGIDO PARA EXECUTAR O BARRAMENTO CENTRAL DE DADOS)
            ========================================================================================= */}
        <div style={{ padding: "14px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
          {colunaId === "finalizado" ? (
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "800", color: "#ef4444" }}>
                <ShieldAlert size={14} strokeWidth={2.5} />
                <span>CONCLUSÃO MANDATÓRIA DE CARTEIRA:</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {/* RE-ALINHADO: Troca da chamada local antiga 'tratarSalvarDados' pelo barramento ativo 'salvarMutacaoProntuario' */}
                <button type="button" onClick={() => salvarMutacaoProntuario({ ...card, subStatus: "sucesso" })} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#10b981", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0f9f67"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10b981"}>
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  <span>Sucesso (Acordo Quitado)</span>
                </button>
                <button type="button" onClick={() => salvarMutacaoProntuario({ ...card, subStatus: "insucesso" })} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ef4444", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}>
                  <XCircle size={13} strokeWidth={2.5} />
                  <span>Insucesso (Contencioso)</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <button type="button" onClick={aoFechar} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#475569", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}>Sair Sem Salvar</button>
              <button type="button" onClick={() => salvarMutacaoProntuario(card)} style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 18px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>Salvar Prontuário</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}