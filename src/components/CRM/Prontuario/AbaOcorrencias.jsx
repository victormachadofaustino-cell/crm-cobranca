import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar as caixas de digitação de novas tarefas na RAM.
import { Plus, ListTodo, FolderMinus } from "lucide-react"; // -> Injeta os componentes vetoriais geométricos e finos do Lucide para ilustrar a linha do tempo de afazeres.

export default function AbaOcorrencias({ card, aoSalvarLocal, categoriaBloqueada }) { // -> Declara e exporta o componente especialista recebendo os dados do card e os gatilhos do Hub pai.
  
  // -> ESTADOS LOCAIS E ISOLADOS PARA O FORMULÁRIO DE TAREFAS (NÃO PESAM NO APP.JS)
  const [tipoTarefa, setTipoTarefa] = useState("Ligação"); // -> Monitora localmente a categoria selecionada no dropdown (Ligação, Mensagem, Reunião, Lembrete).
  const [textoTarefa, setTextoTarefa] = useState(""); // -> Monitora caractere por caractere o texto descritivo da instrução operacional digitada.

  // -> MOTOR OPERACIONAL DE ADIÇÃO DE TAREFAS NA ESTEIRA REATIVA
  const lidarAdicionarTarefaLocal = () => { // -> Prepara e anexa a nova tarefa estruturada diretamente no array do card em memória RAM.
    if (!textoTarefa.trim()) return; // -> Trava de segurança antiqueda: impede o avanço ou o consumo de memória com campos vazios.

    const dataHoraAtualFormatada = new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); // -> Captura com precisão o momento exato do relógio para fins de compliance.

    const novaTarefaEstruturada = { // -> Constrói a peça mestre da tarefa baseada na anatomia do documento NoSQL padrão do sistema.
      texto: `[${tipoTarefa}] ${textoTarefa.trim()}`, // -> Concatena de forma organizada a categoria da ação com a instrução do operador.
      criadoPor: card.responsavel || "Victor Faustino", // -> Identifica de forma segura o cobrador encarregado logado na mesa.
      data: new Date().toISOString().split("T")[0], // -> Grava a data americana limpa (AAAA-MM-DD) para indexação interna de filtros.
      dataCriacao: dataHoraAtualFormatada // -> Memoriza a string formatada em português para exibição fluida na tela.
    };

    // -> Constrói o histórico de logs automáticos (Ata de Auditoria) para registrar o nascimento da ação
    const logTarefaAuto = { 
      conteudo: `Agendada nova tarefa: ${novaTarefaEstruturada.texto}`, // -> Descrição técnica indelével.
      dataHora: dataHoraAtualFormatada // -> Carimba o tempo exato do servidor local.
    };

    // -> Despacha as atualizações para o array acumulador preservando os dados paralelos intactos
    const payloadCobrancaAtualizado = {
      ...card, // -> Clona o objeto com os dados macros originais da cobrança.
      tarefas: [novaTarefaEstruturada, ...(card.tarefas || [])], // -> Empurra a nova tarefa para o topo da lista reativa della máquina.
      historicoNotas: [logTarefaAuto, ...(card.historicoNotas || [])] // -> Registra o rastro automático na pirâmide de auditoria das notas.
    };

    aoSalvarLocal(payloadCobrancaAtualizado); // -> Dispara o comando transmissor repassando os dados prontos para o Hub ModalProntuario gerenciar.
    setTextoTarefa(""); // -> Limpa a caixa de entrada de texto, deixando o formulário virgem para o próximo uso.
    alert("📌 Ação registrada na esteira! Clique em 'Salvar Prontuário' no rodapé para sincronizar com a nuvem."); // -> Feedback visual em português sóbrio.
  };

  return ( // -> Renderiza o layout da aba operacional de ocorrências e tarefas.
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
      
      {/* 🛠️ BLOCO 1: FORMULÁRIO DE CADASTRO DE TAREFAS (BLOQUEADO AUTOMATICAMENTE SE O CONTRATO ESTIVER INTEGRADO) */}
      <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
        <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 8px 0", fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <Plus size={13} strokeWidth={2.5} style={{ color: "#0f172a" }} />
          <span>Agendar Novo Alerta / Retorno na Esteira</span>
        </h5>
        
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {/* SELETOR MULTI-CATEGORIA OPERACIONAL */}
          <select 
            disabled={categoriaBloqueada} // -> TRAVA DO VICTOR: Desativa e congela a caixa se a cobrança estiver na categoria feito ou finalizado.
            value={tipoTarefa} 
            onChange={(e) => setTipoTarefa(e.target.value)} 
            style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", background: categoriaBloqueada ? "#e2e8f0" : "white", color: "#0f172a", cursor: categoriaBloqueada ? "not-allowed" : "pointer" }}
          >
            <option value="Ligação">Ligação Telefônica</option>
            <option value="Mensagem">WhatsApp / SMS</option>
            <option value="Reunião">Reunião Conciliação</option>
            <option value="Lembrete">Lembrete Sistema</option>
          </select>

          {/* CAIXA DE TEXTO LIVRE PARA ORIENTAÇÕES */}
          <input 
            type="text" 
            disabled={categoriaBloqueada} // -> TRAVA DO VICTOR: Bloqueia a digitação de instruções caso o lote já esteja encerrado com sucesso.
            placeholder={categoriaBloqueada ? "Ações bloqueadas nesta etapa" : "Digitar instrução operacional técnica da tarefa..."} 
            value={textoTarefa} 
            onChange={(e) => setTextoTarefa(e.target.value)} 
            style={{ flex: 1, padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: categoriaBloqueada ? "#e2e8f0" : "#ffffff", outline: "none" }} 
          />

          {/* GATILHO DE CONFIRMAÇÃO DA TAREFA */}
          <button 
            type="button" 
            disabled={categoriaBloqueada} // -> TRAVA DO VICTOR: Desativa o clique físico do botão impedindo inserções espúrias.
            onClick={lidarAdicionarTarefaLocal} 
            style={{ background: categoriaBloqueada ? "#94a3b8" : "#0f172a", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: categoriaBloqueada ? "not-allowed" : "pointer", transition: "background 0.15s" }} 
            onMouseEnter={(e) => { if (!categoriaBloqueada) e.currentTarget.style.backgroundColor = "#1e293b"; }} 
            onMouseLeave={(e) => { if (!categoriaBloqueada) e.currentTarget.style.backgroundColor = "#0f172a"; }}
          >
            Anexar
          </button>
        </div>
      </div>

      {/* 🏛️ BLOCO 2: LISTAGEM DA FILA DE AÇÕES PROGRAMADAS VINDAS DA SACOLA NOSQL */}
      <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "8px 0 0 0", fontSize: "12px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        <ListTodo size={13} strokeWidth={2} style={{ color: "#475569" }} />
        <span>Fila de Ações Programadas</span>
      </h5>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {(card.tarefas || []).length === 0 ? ( // -> CONDICIONAL DE UX: Se o array de compromissos estiver 100% zerado ou deserto.
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", padding: "16px", background: "#f8fafc", borderRadius: "6px", border: "1px dashed #cbd5e1", fontStyle: "italic" }}>
            <FolderMinus size={13} strokeWidth={2} />
            <span>Nenhuma action pendente fixada na carcaça deste devedor.</span>
          </div>
        ) : ( // -> Caso existam agendamentos, executa a renderização das linhas do visor.
          card.tarefas.map((tar, idx) => ( // -> Roda o loop map varrendo cada objeto de tarefa arquivado no cofre.
            <div key={idx} style={{ padding: "10px 12px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", gap: "10px", boxShadow: "0 1px 2px rgba(0,0,0,0.01)" }}>
              <span style={{ fontWeight: "600", color: "#0f172a", textAlign: "left", lineHeight: "1.4" }}>
                {tar.texto || tar.descricao} {/* -> Resgata a string descritiva da tarefa tolerando chaves legadas. */}
              </span>
              <span style={{ fontSize: "10px", color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap", fontWeight: "700" }}>
                Por: {tar.criadoPor || "Operador"} em {tar.dataCriacao || tar.data} {/* -> Exibe as credenciais de quem agendou e o momento do rastro. */}
              </span>
            </div>
          )) // -> Encerra o loop map de tarefas.
        )}
      </div>

    </div> // -> Encerra o contêiner geral da aba de tarefas.
  );
}