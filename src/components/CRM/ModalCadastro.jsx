import React, { useState } from "react"; // -> Importa a biblioteca mestre do React e o gancho useState para monitorar as caixas de seleção locais do CRM de faturamento.
import { FilePlus2, X, Briefcase, DollarSign, Calendar, User, Columns3, FileText } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function ModalCadastro({ aberto, aoFechar, aoSalvar, empresas = [] }) { // -> Define a função do modal recebendo reativamente a lista estável de empresas da base.
  // -> ESTADOS LOCAIS E ISOLADOS RECALIBRADOS CONFORME O DE-PARA DA PLANILHA AGING
  const [empresaIdSelecionada, setEmpresaIdSelecionada] = useState(""); // -> Monitora localmente a ID da empresa escolhida na caixinha de seleção.
  const [numDocumento, setNumDocumento] = useState(""); // -> INJETADO CONFORME DE-PARA: Monitora localmente o número do documento/proposta comercial.
  const [referencia, setReferencia] = useState(""); // -> INJETADO CONFORME DE-PARA: Monitora localmente a Nota Fiscal de referência para conciliação.
  const [atribuicao, setAtribuicao] = useState(""); // -> INJETADO CONFORME DE-PARA: Monitora localmente a atribuição ou tipo de venda realizada.
  const [dataDocumento, setDataDocumento] = useState(""); // -> ADEQUADO CONFORME DE-PARA: Monitora localmente a data de emissão da Nota Fiscal.
  const [vencimentoLiquido, setVencimentoLiquido] = useState(""); // -> INJETADO CONFORME DE-PARA: Monitora localmente a data real de vencimento do título atrasado.
  const [executivoVendas, setExecutivoVendas] = useState(""); // -> INJETADO CONFORME DE-PARA: Monitora localmente o representante comercial do cliente cobrador.
  const [responsavel, setResponsavel] = useState(""); // -> Monitora localmente o operador responsável (cobrador interno do CRM).
  const [statusInicial, setStatusInicial] = useState("novo"); // -> Monitora localmente a coluna de entrada escolhida no funil.
  const [observacao, setObservacao] = useState(""); // -> Monitora localmente a caixa de texto de notas fiscais e ocorrências iniciais.

  // -> Trava de Segurança do React: Se o maestro 'App.jsx' disser que o modal não está aberto, o componente retorna vazio e não desenha nada no HTML.
  if (!aberto) return null; // -> Para a renderização imediatamente retornando nulo se o gatilho estiver falso.

  // -> INTERCEPTADOR DE ENVIO LOCAL RECALIBRADO PARA GRAVAÇÃO DE DUAS VIAS
  const tratarEnvioFormulario = (e) => {
    e.preventDefault(); // -> Bloqueia a recarga cega da página mantendo a reatividade estável.
    
    // -> Busca as informações completas da empresa selecionada dentro da nossa lista reativa de base.
    const empresaDados = empresas.find(emp => emp.id === empresaIdSelecionada); // -> Localiza a ficha cadastral correspondente.

    if (!empresaDados) { // -> Trava de segurança: impede o avanço se o advogado não tiver selecionado nenhuma empresa válida.
      alert("⚠️ VALIDAÇÃO DE PROTOCOLO:\n\nSelecione um Cliente / Assistido homologado na base antes de injetar na esteira."); // -> Exibe o aviso sóbrio na tela.
      return; // -> Aborta a execução da função.
    }

    const valorInputFisico = parseFloat(document.getElementById("valor-vencido-input-id")?.value) || 0; // -> Captura com precisão cirúrgica o montante financeiro digitado.

    // -> Prepara o pacote formatado exatamente do jeito que o Firebase CentOS e o Visor esperam receber.
    const novaCobrancaEstruturada = {
      codigo: empresaDados.codigo || "S/C", // -> Herda automaticamente o Código Conta fixo que foi cadastrado na central de clientes.
      cliente: empresaDados.cliente ? empresaDados.cliente.trim().toUpperCase() : (empresaDados.razaoSocial || "").trim().toUpperCase(), // -> Herda a Razão Social de retaguarda em letras maiúsculas.
      cnpj: empresaDados.cnpj || "", // -> CORREÇÃO CIRÚRGICA: Alterada a herança inválida 'reg.cnpj' para 'empresaDados.cnpj' salvando o fluxo de erro NoSQL do Firebase.
      numDocumento: parseInt(numDocumento) || 0, // -> INJETADO CONFORME DE-PARA: Grava o número do documento/proposta vindo do input.
      referencia: referencia.trim().toUpperCase(), // -> INJETADO CONFORME DE-PARA: Grava a Nota Fiscal de ancoragem forçada em caixa alta.
      atribuicao: atribuicao.trim(), // -> INJETADO CONFORME DE-PARA: Grava o tipo de venda estruturado.
      dataDocumento: dataDocumento, // -> ADEQUADO CONFORME DE-PARA: Grava a data real de emissão fiscal.
      dataEnvio: dataDocumento, // -> ALINHAMENTO DE RETROCOMPATIBILIDADE: Duplica para a chave antiga para evitar quebras de visualizadores legado.
      vencimentoLiquido: vencimentoLiquido, // -> INJETADO CONFORME DE-PARA: Grava a data marco da inadimplência líquida.
      executivoVendas: executivoVendas.trim() || "Não Informado", // -> INJETADO CONFORME DE-PARA: Grava o representante comercial do cliente cobrador.
      responsavel: responsavel.trim() || "Victor Faustino", // -> Vincula o operador responsável (cobrador interno do CRM).
      status: statusInicial, // -> Atribui a raia de destino escolhida para o cartão.
      statusInicial: statusInicial, // -> Memoriza a raia natal para fins de auditoria de performance.
      valorVencido: valorInputFisico, // -> Insere o montante da pendência atual (Montante em moeda interna).
      valor: valorInputFisico, // -> Sincroniza o pipeline com os contadores de topo de coluna.
      valorAVencer: 0, // -> Inicializa zerado o lote de valores futuros.
      subStatus: "", // -> Inicializa o subcampo de marcações vazio.
      observacao: observacao, // -> Despeja as notas fiscais digitadas.
      planoParcelas: [], // -> Inicializa a esteira de parcelas totalmente virgem.
      tarefas: [], // -> Inicializa a lista de agendamentos limpa.
      historicoNotas: [ // -> Abre a matriz de notas históricas de auditoria.
        { 
          conteudo: `Procedimento iniciado manualmente via modal por ${responsavel.trim() || "Victor Faustino"}. NF: ${referencia.trim()}`, // -> Descrição sóbria de histórico contendo rastro da Nota Fiscal.
          dataHora: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) // -> Carimba o momento exato da inclusão.
        } // -> Log indelével de auditoria de nascimento del card.
      ], // -> Fecha a matriz de notas históricas.
      proposta: { // -> Prepara o ecossistema para a futura calculadora Price de acordos comerciais.
        valorCobrado: valorInputFisico, // -> Sincroniza o valor base da simulação.
        tipoModificador: "R$", // -> Configura o modificador padrão em moeda corrente.
        valorModificador: 0, // -> Inicia a margem de desconto zerada.
        formaPagamento: "A vista", // -> Configura a opção padrão de recebimento.
        tipoPagamento: "Boleto", // -> Configura o boleto como emissão nativa.
        qtdParcelas: 1, // -> Inicia com parcela única.
        parcelasSimuladas: [] // -> Deixa a esteira de projection limpa.
      } // -> Encerra o objeto de propostas de acordo.
    }; // -> Encerra a montagem completa do documento relacional.

    // -> Dispara o comando enviado pelo pai (App.jsx), repassando os dados prontos para a gravação na nuvem.
    aoSalvar(novaCobrancaEstruturada); // -> Transmite o pacote completo formatado para o Firestore.

    // -> Limpa a mesa de rascunhos local para o modal nascer zerado da próxima vez que abrir.
    setEmpresaIdSelecionada(""); 
    setNumDocumento("");
    setReferencia("");
    setAtribuicao("");
    setDataDocumento("");
    setVencimentoLiquido("");
    setExecutivoVendas("");
    setResponsavel(""); 
    setStatusInicial("novo"); 
    setObservacao(""); 
  }; // -> Encerra o interceptador de envios.

  return ( // -> Renderiza a interface visual flutuante do modal na tela.
    // 🎭 CORTINA TRASEIRA ESCURA: Bloqueia cliques externos e dá foco visual total ao modal.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", zIndex: 5000, display: "flex", justifyContent: "center", alignItems: "center" }}> {/* -> Cortina escura de fundo configurada com opacidade suave. */}
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "520px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }}> {/* -> Cartão branco otimizado alargado para 520px para comportar as linhas duplas técnicas. */}
        
        {/* TOPO DO MODAL: TÍTULO E BOTÃO FECHAR (X) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}> {/* -> Cabeçalho separador horizontal compacto. */}
          <div> {/* -> Agrupador de títulos estruturais. */}
            <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <FilePlus2 size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Injeta o componente vetorial de criação de documentos do Lucide. */}
              <span>Iniciar Lote de Cobrança Manual</span>
            </h3> {/* -> Título formal de alta precisão técnica. */}
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Injete um título inadimplente alinhado aos cabeçalhos da planilha Aging.</p> {/* -> Subtítulo explicativo corporativo de instrução de de-para. */}
          </div> {/* -> Encerra o agrupador de títulos. */}
          <button 
            type="button" 
            onClick={aoFechar} 
            style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", padding: "4px", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
          >
            <X size={18} strokeWidth={2.5} /> {/* -> Substitui o caractere antigo pelo componente X do Lucide. */}
          </button> 
        </div> {/* -> Encerra o topo do modal. */}

        {/* CORPO DO FORMULÁRIO OPERACIONAL */}
        <form onSubmit={tratarEnvioFormulario} style={{ display: "flex", gap: "12px", flexDirection: "column" }}> {/* -> Formulário com fiação de inputs densos. */}
          
          {/* CAMPO: SELEÇÃO DO ASSISTIDO NA BASE VIVA */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador do campo de escolha do cliente. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
              <Briefcase size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Componente de maleta corporativa fina do Lucide. */}
              <span>Selecionar Cliente / Assistido *</span>
            </label> 
            <select 
              required 
              value={empresaIdSelecionada} 
              onChange={(e) => setEmpresaIdSelecionada(e.target.value)} 
              style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#0f172a", fontWeight: "bold", cursor: "pointer" }} // -> Caixa drop-down corporativa densa em 12px.
            >
              <option value="">-- Escolha um cliente cadastrado no sistema --</option> 
              {empresas.map((emp) => ( // -> Varre a lista viva de empresas de raiz.
                <option key={emp.id} value={emp.id}>{emp.cliente || emp.razaoSocial} (Conta: #{emp.codigo || "S/C"})</option> // -> Renderiza os dados herdados em caixa alta.
              ))}
            </select> 
          </div> {/* -> Encerra o container do campo. */}

          {/* LINHA DUPLA NOVA: Nº DOCUMENTO E REFERÊNCIA (NF) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Nº Documento (Contrato) *</label>
              <input type="number" required placeholder="Ex: 87546516" value={numDocumento} onChange={(e) => setNumDocumento(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Referência (Nota Fiscal) *</label>
              <input type="text" required placeholder="Ex: 025070-A" value={referencia} onChange={(e) => setReferencia(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff", fontWeight: "700" }} />
            </div>
          </div>

          {/* LINHA DUPLA: MONTANTE MONETÁRIO E ATRIBUIÇÃO */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}> {/* -> Grade simétrica responsiva dividida ao meio. */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Coluna do montante. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                <DollarSign size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> 
                <span>Montante Devido (R$) *</span>
              </label> 
              <input type="number" step="0.01" required placeholder="0.00" id="valor-vencido-input-id" style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", fontWeight: "800", textAlign: "right" }} /> 
            </div> 
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> INJETADO CONFORME DE-PARA: Coluna do tipo de venda/atribuição. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Atribuição (Tipo Venda)</label>
              <input type="text" placeholder="Ex: Rentals T" value={atribuicao} onChange={(e) => setAtribuicao(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff" }} />
            </div>
          </div> 

          {/* LINHA DUPLA ADEQUADA: DATA DO DOCUMENTO E VENCIMENTO LÍQUIDO */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}> 
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> ADEQUADO CONFORME DE-PARA: Data de emissão da NF. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                <Calendar size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> 
                <span>Data do Doc (Emissão) *</span>
              </label> 
              <input type="date" required value={dataDocumento} onChange={(e) => setDataDocumento(e.target.value)} style={{ padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", fontWeight: "600" }} /> 
            </div> 
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> INJETADO CONFORME DE-PARA: Calendário de vencimento do atraso. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                <Calendar size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> 
                <span>Vencimento Líquido *</span>
              </label> 
              <input type="date" required value={vencimentoLiquido} onChange={(e) => setVencimentoLiquido(e.target.value)} style={{ padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", fontWeight: "700" }} /> 
            </div> 
          </div> 

          {/* LINHA DUPLA NOVA: EXECUTIVO DE VENDAS E OPERADOR RESPONSÁVEL */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> INJETADO CONFORME DE-PARA: Vendedor do cliente. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Executivo de Vendas</label>
              <input type="text" placeholder="Ex: Romulo Franca" value={executivoVendas} onChange={(e) => setExecutivoVendas(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> MANTER: Cobrador interno da mesa. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
                <User size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> 
                <span>Operador Cobrador</span>
              </label> 
              <input type="text" placeholder="Ex: Lucas Vieira" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> 
            </div>
          </div>

          {/* CAMPO: SELETOR DA COLUNA DE ENTRADA DO KANBAN */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> 
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
              <Columns3 size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> 
              <span>Coluna de Entrada Funil</span>
            </label> 
            <select value={statusInicial} onChange={(e) => setStatusInicial(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff", fontWeight: "bold", cursor: "pointer" }}> 
              <option value="novo">A Iniciar</option> 
              <option value="contato">Notificação Enviada</option> 
              <option value="negociacao">Em Negociação</option> 
              <option value="acordo">Termo em Andamento</option> 
              <option value="finalizado">Finalizado</option> 
            </select> 
          </div> 

          {/* CAMPO: NOTAS INICIAIS */}
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> 
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>
              <FileText size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> 
              <span>Notas Iniciais do Caso</span>
            </label> 
            <textarea rows="2" placeholder="Digite detalhes fiscais ou processuais da Nota Fiscal..." value={observacao} onChange={(e) => setObservacao(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", resize: "none" }}></textarea> 
          </div> 

          {/* BASE DO MODAL: BOTÕES DE CANCELAR OU INJETAR DÍVIDA */}
          <div style={{ display: "flex", justifyRef: "flex-end", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "4px" }}> 
            <button type="button" onClick={aoFechar} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", transition: "all 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}>Cancelar</button> 
            <button type="submit" style={{ backgroundColor: "#0f172a", border: "none", color: "white", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", transition: "background 0.15s ease" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>Injetar na Esteira</button> 
          </div> 

        </form> 
      </div> 
    </div> // -> Encerra o contêiner flutuante principal de isolamento.
  );
}