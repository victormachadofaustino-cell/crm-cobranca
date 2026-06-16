import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar localmente os filtros da mesa de ações.
import { Phone, Mail, Calendar, Bell, SlidersHorizontal, Search, FolderMinus, User, Info } from "lucide-react"; // -> CORREÇÃO CIRÚRGICA: Adicionado o ícone 'User' na fiação de importações do topo para estancar o ReferenceError.

export default function ModuloTarefas({ cobrancas = [] }) { // -> Declara e exporta o componente mestre recebendo o array vivo de cobranças do Firebase.
  const [filtroTipo, setFiltroTipo] = useState("Todos"); // -> Inicializa o estado de monitoramento exibindo a volumetria completa da esteira processual.
  const [buscaTexto, setBuscaTexto] = useState(""); // -> BARRA DE BUSCA: Monitora o termo digitado para refinar ações por nome ou descrição.

  // =========================================================================================
  // ⚙️ MOTOR EXTRAÇÃO EM RAM: Varre as cobranças e extrai as tarefas embutidas
  // =========================================================================================
  const todasAsTarefasDaCarteira = cobrancas.flatMap((cliente) => { // -> Achata os sub-arrays de tarefas de toda a base NoSQL em uma fila única de auditoria.
    const tarefasInternas = cliente.tarefas || []; // -> Blindagem antiqueda: garante o array ou inicializa vazio.
    return tarefasInternas.map((tarefa, index) => ({ // -> Cria um novo mapa estendido injetando os dados de nascimento do cliente criador.
      idUnica: `${cliente.id}-${index}`, // -> Gera uma chave exclusiva combinando o ID da empresa e o índice da tarefa.
      clienteId: cliente.id, // -> Preserva a ID física do devedor para ancoragem relacional.
      razaoSocial: cliente.cliente, // -> Herda o nome da empresa devedora para estampar na linha da tarefa.
      responsavelMesa: cliente.responsavel || "Sem operador", // -> Herda o crachá do cobrador encarregado daquela conta.
      codigoConta: cliente.codigo, // -> Herda o ID numérico da conta judicial.
      tipo: tarefa.texto?.startsWith("[") ? tarefa.texto.split("]")[0].replace("[", "") : "Lembrete", // -> Captura o tipo escondido nos colchetes da string original.
      textoLimpo: tarefa.texto?.startsWith("[") ? tarefa.texto.split("]").slice(1).join("]").trim() : tarefa.texto, // -> Limpa a comanda operacional extraindo os colchetes textuais.
      criadoPor: tarefa.criadoPor || "Sistema", // -> Captura a assinatura do operador da mesa de faturamento.
      dataAgendada: tarefa.data || "2026-06-11", // -> Puxa o dia limite da ação técnica processual.
      dataCriacaoFormatada: tarefa.dataCriacao || "Data não registrada" // -> Puxa a estampa cronológica detalhada de gravação da ata.
    })); 
  }); 

  // =========================================================================================
  // 🔍 FILTRAGEM COMBINADA SIMULTÂNEA: Tipo de Ação + Termo de Busca
  // =========================================================================================
  const tarefasFiltradas = todasAsTarefasDaCarteira.filter((tarefa) => {
    const bateTipo = filtroTipo === "Todos" || tarefa.tipo === filtroTipo; // -> Barreira 1: Checa se bate com a pílula de tipo selecionada no topo.
    const bateBusca = !buscaTexto.trim() || 
      tarefa.razaoSocial.toLowerCase().includes(buscaTexto.toLowerCase()) || // -> Barreira 2: Procura por Razão Social.
      tarefa.textoLimpo.toLowerCase().includes(buscaTexto.toLowerCase()) || // -> Barreira 2: Procura na instrução da tarefa.
      tarefa.criadoPor.toLowerCase().includes(buscaTexto.toLowerCase()); // -> Barreira 2: Procura pelo preposto criador.
    return bateTipo && bateBusca; // -> Retorna verdadeiro se o registro passar pelas duas travas de filtragem simultaneamente.
  });

  // =========================================================================================
  // 📊 ACUMULADORES OPERACIONAIS (CARD DE MÉTRICAS DO TOPO)
  // =========================================================================================
  const contagemLigacoes = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Ligação").length; // -> Soma as chamadas telefônicas agendadas na base.
  const contagemMensagens = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Mensagem").length; // -> Soma os disparos pendentes de WhatsApp/SMS.
  const contagemReunioes = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Reunião").length; // -> Soma as mesas de conciliação agendadas.
  const contagemLembretes = todasAsTarefasDaCarteira.filter((t) => t.tipo === "Lembrete").length; // -> Soma os alertas fiscais internos do sistema.

  return ( // -> Inicia a renderização do painel executivo de tarefas corporativas.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 📊 GRID SUPERIOR DE INDICADORES DE PERFORMANCE OPERACIONAL */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        
        {/* CARD LIGAÇÕES */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #0f172a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <Phone size={12} strokeWidth={2.5} style={{ color: "#0f172a" }} />
            <span>Chamadas Telefônicas</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", marginTop: "4px" }}>{contagemLigacoes} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>pendentes</span></div>
        </div>

        {/* CARD MENSAGENS */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #10b981" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <Mail size={12} strokeWidth={2.5} style={{ color: "#10b981" }} />
            <span>WhatsApp / SMS</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#16a34a", marginTop: "4px" }}>{contagemMensagens} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>disparos</span></div>
        </div>

        {/* CARD REUNIÕES */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #2563eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <Calendar size={12} strokeWidth={2.5} style={{ color: "#2563eb" }} />
            <span>Conciliações / Mesas</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>{contagemReunioes} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>agendadas</span></div>
        </div>

        {/* CARD LEMBRETES */}
        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderLeft: "5px solid #d97706" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
            <Bell size={12} strokeWidth={2.5} style={{ color: "#d97706" }} />
            <span>Alertas do Sistema</span>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#b45309", marginTop: "4px" }}>{contagemLembretes} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>fiscais</span></div>
        </div>

      </div>

      {/* 📑 TOOLBAR DO MÓDULO DE TAREFAS (ESTILO CLICKUP EXECUTIVO) */}
      <div style={{ backgroundColor: "#ffffff", padding: "14px 20px", borderRadius: "10px 10px 0 0", border: "1px solid #e2e8f0", borderBottom: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        
        {/* FILTROS INTERATIVOS POR CATEGORIA (ALA ESQUERDA) */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", color: "#475569", paddingRight: "4px" }}>
            <SlidersHorizontal size={14} strokeWidth={2.5} /> {/* -> Alinha o componente geométrico de filtros do Lucide. */}
          </div>
          {["Todos", "Ligação", "Mensagem", "Reunião", "Lembrete"].map((tipo) => ( // -> Varre o array de escopo gerando as pílulas táteis de seleção.
            <button
              key={tipo} // -> Chave única reativa de controle de nós.
              type="button" // -> Elemento nativo estruturado para blindagem de cliques.
              onClick={() => setFiltroTipo(tipo)} // -> Alterna o estado na RAM atualizando as linhas da planilha de tarefas imediatamente.
              style={{
                backgroundColor: filtroTipo === tipo ? "#0f172a" : "#f1f5f9", // -> Azul Escuro Profundo se selecionado, cinza sóbrio se inativo.
                color: filtroTipo === tipo ? "#ffffff" : "#475569", // -> Muta o tom do texto para alta nitidez visual.
                border: "none", // -> Estética plana minimalista.
                padding: "6px 14px", // -> Margem interna compacta.
                borderRadius: "6px", // -> Cantos suavizados em 6px padrão fintech.
                fontSize: "12px", // -> Fonte sutil de alta densidade visual.
                fontWeight: "700", // -> Peso de fonte em negrito denso estruturado.
                cursor: "pointer", // -> Ativa o ponteiro de clique.
                transition: "all 0.2s ease" // -> Transição suave de transição cromática.
              }}
            >
              {tipo === "Todos" && `Ver Todas (${todasAsTarefasDaCarteira.length})`}
              {tipo === "Ligação" && `Ligações (${contagemLigacoes})`}
              {tipo === "Mensagem" && `Mensagens (${contagemMensagens})`}
              {tipo === "Reunião" && `Reuniões (${contagemReunioes})`}
              {tipo === "Lembrete" && `Alertas (${contagemLembretes})`}
            </button>
          ))}
        </div>

        {/* INPUT DE BUSCA TEXTUAL DINÂMICA (ALA DIREITA) */}
        <div style={{ minWidth: "280px", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#ffffff", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", width: "100%", boxSizing: "border-box" }}>
            <Search size={13} strokeWidth={2.5} style={{ color: "#94a3b8", flexShrink: 0 }} /> {/* -> Componente vetorial fino de busca do Lucide. */}
            <input
              type="text" // -> Campo de texto convencional.
              placeholder="Buscar por empresa, instrução ou operador..." // -> Frase de preenchimento explicativa limpa.
              value={buscaTexto} // -> Vincula o input ao estado reativo.
              onChange={(e) => setBuscaTexto(e.target.value)} // -> Refina as ocorrências caractere por caractere refinando a lista.
              style={{ width: "100%", border: "none", background: "none", fontSize: "12px", color: "#0f172a", outline: "none", paddingLeft: "4px" }} // -> Estilo inline integrado à caixa flexbox.
            />
          </div>
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
            {tarefasFiltradas.length === 0 ? ( // -> Tratamento de contingência para esteira vazia.
              <tr>
                <td colSpan="6" style={{ padding: "40px 20px", backgroundColor: "#ffffff" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#64748b", fontSize: "12px", fontStyle: "italic" }}>
                    <FolderMinus size={14} strokeWidth={2} /> {/* -> Injeta a pasta vazia fina outline do Lucide no aviso de deserto. */}
                    <span>Nenhuma tarefa pendente orbitando no quadrante selecionado. Tudo em dia na carteira!</span>
                  </div>
                </td>
              </tr>
            ) : (
              // -> MAPEAMENTO DE LINHAS: Desenha as fileiras reativas de afazeres diários com metadados higienizados.
              tarefasFiltradas.map((tarefa) => (
                <tr
                  key={tarefa.idUnica} // -> Chave composta inviolável de rastreio de nós.
                  style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff", transition: "background 0.2s" }} // -> Linha de alto contraste.
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f8fafc"; }} // -> Ativa o realce de linha.
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }} // -> Remove o realce de linha ao afastar o mouse.
                >
                  <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "12px" }}>
                    #{tarefa.codigoConta} {/* -> Célula de exibição do Código Conta. */}
                  </td>

                  <td style={{ padding: "14px 20px", textTransform: "uppercase", color: "#0f172a" }}>
                    {tarefa.razaoSocial} {/* -> Célula de exibição da Razão Social em caixa alta estrita. */}
                  </td>

                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        background: 
                          tarefa.tipo === "Ligação" ? "#f1f5f9" : 
                          tarefa.tipo === "Mensagem" ? "#d1fae5" : 
                          tarefa.tipo === "Reunião" ? "#dbeafe" : "#fef3c7", // -> Cores institucionais atenuadas vazadas.
                        color: 
                          tarefa.tipo === "Ligação" ? "#475569" : 
                          tarefa.tipo === "Mensagem" ? "#065f46" : 
                          tarefa.tipo === "Reunião" ? "#1e40af" : "#b45309", // -> Cores de fonte correspondentes de alta legibilidade.
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "800",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        textTransform: "uppercase"
                      }}
                    >
                      {/* INJEÇÃO DE ICONES EM BADGES DE LINHA: Resolvido o erro de referência ao incluir o User na RAM superior. */}
                      {tarefa.tipo === "Ligação" && <Phone size={11} strokeWidth={2.5} />} 
                      {tarefa.tipo === "Mensagem" && <Mail size={11} strokeWidth={2.5} />}
                      {tarefa.tipo === "Reunião" && <Calendar size={11} strokeWidth={2.5} />}
                      {tarefa.tipo === "Lembrete" && <Bell size={11} strokeWidth={2.5} />}
                      <span>{tarefa.tipo === "Lembrete" ? "Alerta" : tarefa.tipo}</span>
                    </span>
                  </td>

                  <td style={{ padding: "14px 20px", color: "#1e293b", fontSize: "12px", textAlign: "left", lineHeight: "1.4" }}>
                    {tarefa.textoLimpo} {/* -> Célula contendo a instrução do operador limpa sem colchetes. */}
                  </td>

                  <td style={{ padding: "14px 20px", color: "#475569", fontSize: "11px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <User size={12} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> AGORA FUNCIONANDO PERFEITAMENTE: Silhueta geométrica vazada fina em vetor cinza. */}
                      <span>{tarefa.criadoPor}</span> {/* -> Nome do preposto cobrador criador da ocorrência. */}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "2px", fontWeight: "700" }}>Registrado em: {tarefa.dataCriacaoFormatada}</div>
                  </td>

                  <td style={{ padding: "14px 20px", textAlign: "center" }}>
                    <span 
                      style={{ fontSize: "14px", cursor: "help", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", transition: "color 0.15s" }} 
                      onMouseEnter={(e) => e.currentTarget.style.color = "#0f172a"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                      title="Para dar baixa ou gerenciar esta ocorrência, abra o Prontuário do cliente na aba do CRM principal." // -> Dica de comanda técnica explicativa.
                    >
                      <Info size={14} strokeWidth={2.5} /> {/* -> Componente vetorial Info vazado do Lucide. */}
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