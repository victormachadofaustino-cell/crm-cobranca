import React, { useState } from "react"; // -> Importa a biblioteca mestre do React e o gancho useState para monitorar as caixas de seleção locais do CRM de faturamento.
import { FilePlus2, X, Briefcase, DollarSign, Calendar, User, Columns3, FileText } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function ModalCadastro({ aberto, aoFechar, aoSalvar, empresas = [] }) { // -> Define a função do modal recebendo reativamente a lista estável de empresas da base.
  // -> ESTADOS LOCAIS E ISOLADOS: As variáveis de digitação agora moram aqui dentro e não pesam mais no App.jsx!
  const [empresaIdSelecionada, setEmpresaIdSelecionada] = useState(""); // -> Monitora localmente a ID da empresa escolhida na caixinha de seleção.
  const [responsavel, setResponsavel] = useState(""); // -> Monitora localmente o operador responsável.
  const [statusInicial, setStatusInicial] = useState("novo"); // -> Monitora localmente a coluna de entrada escolhida.
  const [observacao, setObservacao] = useState(""); // -> Monitora localmente a caixa de texto de notas fiscais.

  // -> Trava de Segurança do React: Se o maestro 'App.jsx' disser que o modal não está aberto, o componente retorna vazio e não desenha nada no HTML.
  if (!aberto) return null; // -> Para a renderização imediatamente retornando nulo se o gatilho estiver falso.

  // -> INTERCEPTADOR DE ENVIO LOCAL
  const tratarEnvioFormulario = (e) => {
    e.preventDefault(); // -> Bloqueia a recarga cega da página mantendo a reatividade estável.
    
    // -> Busca as informações completas da empresa selecionada dentro da nossa lista reativa de base.
    const empresaDados = empresas.find(emp => emp.id === empresaIdSelecionada); // -> Localiza a ficha cadastral correspondente.

    if (!empresaDados) { // -> Trava de segurança: impede o avanço se o advogado não tiver selecionado nenhuma empresa válida.
      alert("⚠️ VALIDAÇÃO DE PROTOCOLO:\n\nSelecione um Cliente / Assistido homologado na base antes de injetar na esteira."); // -> Exibe o aviso sóbrio na tela.
      return; // -> Aborta a execução da função.
    }

    const valorInputFisico = parseFloat(document.getElementById("valor-vencido-input-id")?.value) || 0; // -> Captura com precisão cirúrgica o montante financeiro digitado.

    // -> Prepara o pacote formatado exatamente do jeito que o Firebase CentOS espera receber.
    const novaCobrancaEstruturada = {
      codigo: empresaDados.codigo || "S/C", // -> Herda automaticamente o Código Conta fixo que foi cadastrado na central de clientes.
      cliente: empresaDados.cliente.trim().toUpperCase(), // -> Herda a Razão Social corporativa em letras maiúsculas da base estável.
      responsavel: responsavel.trim() || "Victor Faustino", // -> Vincula o operador responsável.
      status: statusInicial, // -> Atribui a raia de destino escolhida para o cartão.
      statusInicial: statusInicial, // -> Memoriza a raia natal para fins de auditoria de performance.
      valorVencido: valorInputFisico, // -> Insere o montante da pendência atual.
      valor: valorInputFisico, // -> Sincroniza o pipeline com os contadores de topo de coluna.
      valorAVencer: 0, // -> Inicializa zerado o lote de valores futuros.
      subStatus: "", // -> Inicializa o subcampo de marcações vazio.
      observacao: observacao, // -> Despeja as notas fiscais digitadas.
      planoParcelas: [], // -> Inicializa a esteira de parcelas totalmente virgem.
      tarefas: [], // -> Inicializa a lista de agendamentos limpa.
      historicoNotas: [ // -> Abre a matriz de notas históricas de auditoria.
        { 
          conteudo: `Procedimento iniciado para atendimento por Victor Faustino`, // -> Descrição sóbria de histórico.
          dataHora: new Date().toLocaleDateString("pt-BR") + " as " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Carimba o momento exato da inclusão.
        } // -> Log indelével de auditoria de nascimento del card.
      ], // -> Fecha a matriz de notas históricas.
      proposta: { // -> Prepara o ecossistema para a futura calculadora Price de acordos comerciais.
        valorCobrado: valorInputFisico, // -> Sincroniza o valor base da simulação.
        tipoModificador: "R$", // -> Configura o modificador padrão em moeda corrente.
        valorModificador: 0, // -> Inicia a margem de desconto zerada.
        formaPagamento: "A vista", // -> Configura a opção padrão de recebimento.
        tipoPagamento: "Boleto", // -> Configura o boleto como emissão nativa.
        qtdParcelas: 1, // -> Inicia com parcela única.
        parcelasSimuladas: [] // -> Deixa a esteira de projeção limpa.
      } // -> Encerra o objeto de propostas de acordo.
    }; // -> Encerra a montagem completa do documento relacional.

    // -> Dispara o comando enviado pelo pai (App.jsx), repassando os dados prontos para a gravação na nuvem.
    aoSalvar(novaCobrancaEstruturada); // -> Transmite o pacote completo formatado para o Firestore.

    // -> Limpa a mesa de rascunhos local para o modal nascer zerado da próxima vez que abrir.
    setEmpresaIdSelecionada(""); // -> Reseta o ID da empresa selecionada.
    setResponsavel(""); // -> Reseta o campo do operador.
    setStatusInicial("novo"); // -> Retorna o seletor para a posição inicial.
    setObservacao(""); // -> Esvazia a área de texto de observações.
  }; // -> Encerra o interceptador de envios.

  return ( // -> Renderiza a interface visual flutuante do modal na tela.
    // 🎭 CORTINA TRASEIRA ESCURA: Bloqueia cliques externos e dá foco visual total ao modal.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", zIndex: 5000, display: "flex", justifyContent: "center", alignItems: "center" }}> {/* -> Cortina escura de fundo configurada com opacidade suave. */}
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "480px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}> {/* -> Cartão branco otimizado com bordas compactas de 8px e trava antiqueda de estouro de tela. */}
        
        {/* TOPO DO MODAL: TÍTULO E BOTÃO FECHAR (X) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}> {/* -> Cabeçalho separador horizontal compacto. */}
          <div> {/* -> Agrupador de títulos estruturais. */}
            <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <FilePlus2 size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Injeta o componente vetorial de criação de documentos eliminando o antigo emoji de mais (+). */}
              <span>Iniciar Procedimento Financeiro</span>
            </h3> {/* -> Título formal sóbrio em fonte densa de 14px. */}
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Abra um lote de cobrança para um assistido homologado.</p> {/* -> Subtítulo explicativo corporativo de instrução. */}
          </div> {/* -> Encerra o agrupador de títulos. */}
          <button 
            type="button" 
            onClick={aoFechar} 
            style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", padding: "4px", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
          >
            <X size={18} strokeWidth={2.5} /> {/* -> Substitui o caractere antigo pelo componente X fino e geométrico do Lucide. */}
          </button> 
        </div> {/* -> Encerra o topo do modal. */}

        {/* CORPO DO FORMULÁRIO OPERACIONAL */}
        <form onSubmit={tratarEnvioFormulario} style={{ display: "flex", flexDirection: "column", gap: "12px" }}> {/* -> Formulário com gap compactado para 12px otimizando a altura útil. */}
          
          {/* CAMPO REFORMULADO: SELEÇÃO DO ASSISTIDO NA BASE VIVA */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador do campo de escolha do cliente. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
              <Briefcase size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Substitui a balança de texto pelo componente de maleta corporativa fina do Lucide. */}
              <span>Selecionar Cliente / Assistido *</span>
            </label> 
            <select 
              required 
              value={empresaIdSelecionada} 
              onChange={(e) => setEmpresaIdSelecionada(e.target.value)} 
              style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#0f172a", fontWeight: "bold", cursor: "pointer" }} // -> Caixa drop-down corporativa densa em 12px.
            >
              <option value="">-- Escolha um cliente cadastrado no sistema --</option> {/* -> Opção nula inicial de instrução. */}
              {empresas.map((emp) => ( // -> Varre a lista viva de empresas injetadas para desenhar as opções relacionais.
                <option key={emp.id} value={emp.id}>{emp.cliente} (Conta: #{emp.codigo || "S/C"})</option> // -> Renderiza a Razão Social e o Código da Conta herdados da base física, higienizados de emojis.
              ))}
            </select> {/* -> Encerra o elemento select de vínculo. */}
          </div> {/* -> Encerra o container do campo. */}

          {/* LINHA DUPLA: VALOR VENCIDO E DATA DO LOTE */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}> {/* -> Grade simétrica responsiva dividida ao meio. */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Coluna do montante financeiro da pendência. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                <DollarSign size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta o ícone fino vetorial de cifrão no lugar de legendas vazias. */}
                <span>Valor Devido (R$)</span>
              </label> 
              <input type="number" step="0.01" required placeholder="0.00" id="valor-vencido-input-id" style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", fontWeight: "bold", textAlign: "right" }} /> {/* -> Entrada numérica calibrada para fonte de 12px e alinhada à direita. */}
            </div> {/* -> Encerra o bloco do valor monetário. */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Coluna do calendário de lançamento fiscal. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                <Calendar size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta o componente sutil de calendário outline do Lucide. */}
                <span>Data de Lançamento</span>
              </label> 
              <input type="date" id="dataEnvio" style={{ padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", fontWeight: "600" }} /> {/* -> Entrada nativa de calendário compactada. */}
            </div> {/* -> Encerra o bloco da data de lançamento. */}
          </div> {/* -> Encerra la grade dupla horizontal. */}

          {/* CAMPO: OPERADOR RESPONSÁVEL */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador da caixa de texto do operador encarregado. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
              <User size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta a silhueta geométrica vazada do Lucide no operador. */}
              <span>Operador Responsável</span>
            </label> 
            <input type="text" placeholder="Ex: Lucas Vieira" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Entrada de texto livre compactada em 12px. */}
          </div> {/* -> Encerra o container do operador responsavel. */}

          {/* CAMPO: SELETOR DA COLUNA DE ENTRADA DO KANBAN */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador da caixa de seleção da raia natal do card. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
              <Columns3 size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta o componente sutil de raias do Lucide na seleção do funil. */}
              <span>Coluna de Entrada</span>
            </label> 
            <select value={statusInicial} onChange={(e) => setStatusInicial(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff", fontWeight: "bold", cursor: "pointer" }}> {/* -> Seletor de raias do faturamento. */}
              <option value="novo">A Iniciar</option> {/* -> Vincula o card na primeira raia do funil, higienizado de emojis. */}
              <option value="contato">Notificação Enviada</option> {/* -> Vincula o card na segunda raia do funil, higienizado de emojis. */}
              <option value="negociacao">Em Negociação</option> {/* -> Vincula o card na terceira raia do funil, higienizado de emojis. */}
              <option value="acordo">Termo em Andamento</option> {/* -> Vincula o card na quarta raia do funil, higienizado de emojis. */}
              <option value="finalizado">Finalizado</option> {/* -> Vincula o card na quinta raia do funil, higienizado de emojis. */}
            </select> {/* -> Encerra o seletor de calhas. */}
          </div> {/* -> Encerra o container de raias do Kanban. */}

          {/* CAMPO: NOTAS INICIAIS */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador da caixa de notas textuais do histórico processual. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
              <FileText size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta o componente sutil de linhas de texto do Lucide nas notas. */}
              <span>Notas Iniciais do Caso</span>
            </label> 
            <textarea rows="3" placeholder="Digite detalhes fiscais ou processuais..." value={observacao} onChange={(e) => setObservacao(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", resize: "none" }}></textarea> {/* -> Área de texto livre travada contra desconfigurações manuais. */}
          </div> {/* -> Encerra o container de notas fiscais. */}

          {/* BASE DO MODAL: BOTÕES DE CANCELAR OU INJETAR DÍVIDA */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "4px" }}> {/* -> Alinhador do rodapé do modal com traço sutil de divisão e padding compacto. */}
            <button type="button" onClick={aoFechar} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", transition: "all 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}>Cancelar</button> {/* -> Botão sóbrio de cancelamento da inclusão ativa. */}
            <button type="submit" style={{ backgroundColor: "#0f172a", border: "none", color: "white", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", transition: "background 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>Injetar na Esteira</button> {/* -> MUDANÇA SÓBRIA DE COR: Alterado de azul para o tom institucional Azul Escuro Profundo. */}
          </div> {/* -> Encerra a barra de botões do rodapé. */}

        </form> {/* -> Encerra a tag de formulário operacional. */}
      </div> {/* -> Encerra o contêiner interno branco do modal. */}
    </div> // -> Encerra o contêiner flutuante principal de isolamento.
  );
}