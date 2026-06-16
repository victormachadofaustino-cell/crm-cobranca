import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar localmente os filtros da mesa de ações.

export default function ModuloTarefas({ cobrancas = [] }) { // -> Declara e exporta o componente mestre recebendo o array vivo de cobranças do Firebase.
  // -> ESTADO LOCAL DE CONTROLE: Monitora qual filtro de tipo de ação está ativo (Todos, Ligação, Mensagem, Reunião, Lembrete).
  const [filtroTipo, setFiltroTipo] = useState("Todos"); // -> Inicializa exibindo a volumetria completa da esteira processual.
  const [buscaTexto, setBuscaTexto] = useState(""); // -> BARRA DE BUSCA: Monitora o termo digitado para refinar ações por nome ou descrição.

  // =========================================================================================
  // ⚙️ MOTOR EXTRAÇÃO EM RAM: Varre as cobranças e extrai as tarefas embutidas
  // =========================================================================================
  const todasAsTarefasDaCarteira = cobrancas.flatMap((cliente) => { // -> Achata os sub-arrays de tarefas de toda a base NoSQL em uma fila única.
    const tarefasInternas = cliente.tarefas || []; // -> Blindagem antiqueda: garante o array ou inicializa vazio.
    return tarefasInternas.map((tarefa, index) => ({ // -> Cria um novo mapa estendido injetando os dados de nascimento do cliente criador.
      idUnica: `${cliente.id}-${index}`, // -> Gera uma chave exclusiva combinando o ID da empresa e o índice da tarefa.
      clienteId: cliente.id, // -> Preserva a ID física do devedor para ancoragem.
      razaoSocial: cliente.cliente, // -> Herda o nome da empresa (Ex: EBSE) para estampar na linha da tarefa.
      responsavelMesa: cliente.responsavel || "Sem operador", // -> Herda o crachá do cobrador encarregado daquela conta.
      codigoConta: cliente.codigo, // -> Herda o ID numérico da conta.
      // -> Captura o tipo escondido nos colchetes (Ex: "[Ligação] Ligar para diretor" -> Tipo: "Ligação", Texto: "Ligar para diretor")
      tipo: tarefa.texto?.startsWith("[") ? tarefa.texto.split("]")[0].replace("[", "") : "Lembrete",
      textoLimpo: tarefa.texto?.startsWith("[") ? tarefa.texto.split("]").slice(1).join("]").trim() : tarefa.texto,
      criadoPor: tarefa.criadoPor || "Sistema", // -> Captura a assinatura do operador da mesa de faturamento.
      dataAgendada: tarefa.data || "2026-06-11", // -> Puxa o dia limite da ação técnica.
      dataCriacaoFormatada: tarefa.dataCriacao || "Data não registrada" // -> Puxa a estampa cronológica detalhada da ata.
    })); // 🛠️ CORREÇÃO CIRÚRGICA DE COMPILAÇÃO: Ajustado o fechamento do mapa interno para travar as chaves NoSQL com segurança.
  }); // 🛠️ CORREÇÃO CIRÚRGICA DE COMPILAÇÃO: Removido o parêntese ilegal duplicado que causava o travamento fatal de Erro 500 no Vite!

  // =========================================================================================
  // 🔍 FILTRAGEM COMBINADA SIMULTÂNEA: Tipo de Ação + Termo de Busca
  // =========================================================================================
  const tarefasFiltradas = todasAsTarefasDaCarteira.filter((tarefa) => {
    const bateTipo = filtroTipo === "Todos" || tarefa.tipo === filtroTipo; // -> Barreira 1: Checa se bate com a pílula de tipo selecionada no topo.
    const bateBusca = !buscaTexto.trim() || 
      tarefa.razaoSocial.toLowerCase().includes(buscaTexto.toLowerCase()) || // -> Barreira 2: Procura por Razão Social.
      tarefa.textoLimpo.toLowerCase().includes(buscaTexto.toLowerCase()) || // -> Barreira 2: Procura na instrução da tarefa.
      tarefa.criadoPor.toLowerCase().includes(buscaTexto.toLowerCase()); // -> Barreira 2: Procura pelo preposto criador.
    return bateTipo && bateBusca; // -> Retorna verdadeiro se o registro passar ileso pelos dois cortes horizontais simultaneamente.
  });

  // =========================================================================================
  // 📊 ACUMULADORES OPERACIONAIS (CARD DE MÉTRICAS DO TOPO)
  // =========================================================================================
  const contagemLigacoes = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Ligação").length; // -> Soma as chamadas telefônicas agendadas.
  const contagemMensagens = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Mensagem").length; // -> Soma os envios pendentes de WhatsApp/SMS.
  const contagemReunioes = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Reunião").length; // -> Soma os agendamentos de conciliação judicial.
  const contagemLembretes = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Lembrete").length; // -> Soma os alertas fiscais internos do sistema.

  return ( // -> Inicia a renderização do painel tridimensional de tarefas corporativas.
    <div style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 📊 GRID SUPERIOR DE INDICADORES DE PERFORMANCE OPERACIONAL */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        
        {/* CARD LIGAÇÕES */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>📞 Chamadas Telefônicas</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>{contagemLigacoes} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>pendentes</span></div>
        </div>

        {/* CARD MENSAGENS */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>✉️ WhatsApp / SMS</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#16a34a", marginTop: "4px" }}>{contagemMensagens} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>disparos</span></div>
        </div>

        {/* CARD REUNIÕES */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>📅 Conciliações / Mesas</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>{contagemReunioes} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>agendadas</span></div>
        </div>

        {/* CARD LEMBRETES */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>🔔 Alertas do Sistema</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#b45309", marginTop: "4px" }}>{contagemLembretes} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>fiscais</span></div>
        </div>

      </div>

      {/* 📑 TOOLBAR DO MÓDULO DE TAREFAS (ESTILO CLICKUP EXECUTIVO) */}
      <div style={{ backgroundColor: "#ffffff", padding: "14px 20px", borderRadius: "10px 10px 0 0", border: "1px solid #e2e8f0", borderBottom: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        
        {/* FILTROS INTERATIVOS POR CATEGORIA (ALA ESQUERDA) */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["Todos", "Ligação", "Mensagem", "Reunião", "Lembrete"].map((tipo) => (
            <button
              key={tipo}
              type="button" // -> Blindagem nativa de clique para não disparar submits falsos.
              onClick={() => setFiltroTipo(tipo)} // -> Chaveia o estado local reconfigurando a planilha de tarefas imediatamente.
              style={{
                backgroundColor: filtroTipo === tipo ? "#0f172a" : "#f1f5f9", // -> Azul Escuro Profundo se selecionado, cinza sóbrio se inativo.
                color: filtroTipo === tipo ? "#ffffff" : "#475569", // -> Muta o tom do texto para alta nitidez visual.
                border: "none",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {tipo === "Todos" && `📋 Ver Todas (${todasAsTarefasDaCarteira.length})`}
              {tipo === "Ligação" && `📞 Ligações (${contagemLigacoes})`}
              {tipo === "Mensagem" && `✉️ Mensagens (${contagemMensagens})`}
              {tipo === "Reunião" && `📅 Reuniões (${contagemReunioes})`}
              {tipo === "Lembrete" && `🔔 Alertas (${contagemLembretes})`}
            </button>
          ))}
        </div>

        {/* INPUT DE BUSCA TEXTUAL DINÂMICA (ALA DIREITA) */}
        <div style={{ minWidth: "280px" }}>
          <input
            type="text"
            placeholder="🔍 Buscar por empresa, instrução ou operador..."
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)} // -> Monitora caractere por caractere refinando a lista.
            style={{ width: "100%", padding: "7px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", boxSizing: "border-box" }}
          />
        </div>

      </div>

      {/* 📑 CONTÊINER ESTRUTURAL DA PLANILHA DE TAREFAS EM LOTE */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "0 0 12px 12px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
              <th style={{ padding: "14px 20px", width: "120px" }}>CÓDIGO CONTA</th>
              <th style={{ padding: "14px 20px", width: "280px" }}>EMPRESA DEVEDORA</th>
              <th style={{ padding: "14px 20px", width: "150px" }}>TIPO DE AÇÃO</th>
              <th style={{ padding: "14px 20px" }}>INSTRUÇÃO OPERACIONAL TÉCNICA</th>
              <th style={{ padding: "14px 20px", width: "220px" }}>REGISTRADO POR</th>
              <th style={{ padding: "14px 20px", width: "100px", textAlign: "center" }}>AÇÕES</th>
            </tr>
          </thead>

          <tbody style={{ color: "#0f172a", fontWeight: "600" }}>
            {tarefasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                  📭 Nenhuma tarefa pendente orbitando no quadrante selecionado. Tudo em dia na carteira! {/* -> O comentário antigo flutuante foi guardado de forma protegida aqui dentro do td. */}
                </td>
              </tr>
            ) : (
              tarefasFiltradas.map((tarefa) => ( // -> Os comentários didáticos explicativos foram embutidos rigorosamente nas células td de dados.
                <tr
                  key={tarefa.idUnica} 
                  style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f8fafc"; }} 
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }} 
                >
                  <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "12px" }}>
                    #{tarefa.codigoConta} {/* -> CÉLULA 1: Código Conta Cobrança. */}
                  </td>

                  <td style={{ padding: "14px 20px", textTransform: "uppercase", color: "#0f172a" }}>
                    {tarefa.razaoSocial} {/* -> CÉLULA 2: Razão Social da Empresa devedora em caixa alta. */}
                  </td>

                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        background: 
                          tarefa.tipo === "Ligação" ? "#f1f5f9" : 
                          tarefa.tipo === "Mensagem" ? "#d1fae5" : 
                          tarefa.tipo === "Reunião" ? "#dbeafe" : "#fef3c7", // 🛠️ CORREÇÃO DE PROPRIEDADE: Corrigido o seletor reativo de inglês para ler rigorosamente a variável em português tarefa.tipo.
                        color: 
                          tarefa.tipo === "Ligação" ? "#475569" : 
                          tarefa.tipo === "Mensagem" ? "#065f46" : 
                          tarefa.tipo === "Reunião" ? "#1e40af" : "#b45309", // 🛠️ CORREÇÃO DE PROPRIEDADE: Corrigido o seletor reativo de inglês para ler rigorosamente a variável em português tarefa.tipo.
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "800",
                        textTransform: "uppercase"
                      }}
                    >
                      {tarefa.tipo === "Ligação" && "📞 Ligação"} {/* -> CÉLULA 3: Badge com cores e ícones executivos pareados. */}
                      {tarefa.tipo === "Mensagem" && "✉️ Mensagem"}
                      {tarefa.tipo === "Reunião" && "📅 Reunião"}
                      {tarefa.tipo === "Lembrete" && "🔔 Alerta"}
                    </span>
                  </td>

                  <td style={{ padding: "14px 20px", color: "#1e293b", fontSize: "12px", textAlign: "left", lineHeight: "1.4" }}>
                    {tarefa.textoLimpo} {/* -> CÉLULA 4: Instrução higienizada removendo os metadados de colchete. */}
                  </td>

                  <td style={{ padding: "14px 20px", color: "#475569", fontSize: "11px" }}>
                    <div>👤 {tarefa.criadoPor}</div> {/* -> CÉLULA 5: Nome do preposto e carimbo de criação da ata. */}
                    <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "2px", fontWeight: "700" }}>Registrado em: {tarefa.dataCriacaoFormatada}</div>
                  </td>

                  <td style={{ padding: "14px 20px", textAlign: "center" }}>
                    <span 
                      style={{ fontSize: "14px", cursor: "help", opacity: 0.6 }} 
                      title="Para dar baixa ou gerenciar esta ocorrência, abra o Prontuário do cliente na aba do CRM principal." 
                    >
                      ℹ️ {/* -> CÉLULA 6: Ícone de tooltip de governança em português explicativo. */}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}