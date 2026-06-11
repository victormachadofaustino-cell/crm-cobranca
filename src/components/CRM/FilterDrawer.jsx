import React, { useState } from "react"; // -> Importa o React e o gancho useState para monitorar as caixas de seleção locais do CRM de faturamento.

export default function FilterDrawer({ aberto, aoFechar, aoAplicarFiltros }) { // -> Define e exporta o componente da gaveta de buscas recebendo as ferramentas de controle do pai App.jsx.
  // -> GAVETA DE MEMÓRIA INTERNAS EXPANDIDA: Monitoram localmente todas as chaves do cabeçalho comercial antes do disparo do botão.
  const [filtroCodigo, setFiltroCodigo] = useState(""); // -> Monitora localmente o Código Conta digitado para o refino.
  const [filtroCliente, setFiltroCliente] = useState(""); // -> Monitora localmente a Razão Social da empresa devedora digitada.
  const [filtroResponsavel, setFiltroResponsavel] = useState(""); // -> Monitora localmente o nome do operador cobrador digitado.
  const [filtroStatus, setFiltroStatus] = useState("todos"); // -> Monitora localmente a fase do funil escolhida no menu suspenso.
  const [filtroOperadorValor, setFiltroOperadorValor] = useState(">="); // -> Monitora localmente o operador matemático escolhido (padrão: Maior ou Igual >=).
  const [filtroValorLimite, setFiltroValorLimite] = useState(""); // -> Monitora localmente o montante em dinheiro digitado para o corte de pipeline.

  // -> Trava de Segurança do React: Se a Toolbar não disparar a abertura, o componente não renderiza nada na tela e poupa memória RAM.
  if (!aberto) return null; // -> Para a renderização imediatamente retornando nulo se o gatilho estiver falso.

  // -> MANIPULADOR DE DISPARO DE BUSCA LOCAL AVANÇADO
  const tratarFiltroLocal = (e) => {
    e.preventDefault(); // -> Bloqueia o rebote de recarga cega da página mantendo a esteira reativa estável.
    
    // -> Envia o bloco completo de parâmetros matemáticos e textuais de volta para o pai (App.jsx) iniciar o corte nas planilhas e raias.
    aoAplicarFiltros({ // -> Executa a transmissão repassando o pacote higienizado na hora do clique.
      codigo: filtroCodigo.trim(), // -> Despacha o rascunho do Código Conta sem espaços mortos.
      cliente: filtroCliente.trim(), // -> Despacha o rascunho da Razão Social sem espaços mortos.
      responsavel: filtroResponsavel.trim(), // -> Despacha o rascunho do Operador cobrador sem espaços mortos.
      status: filtroStatus, // -> Despacha a string correspondente à fase ativa do CRM.
      operadorValor: filtroOperadorValor, // -> Despacha o token matemático selecionado para o cálculo fiscal.
      valorLimite: filtroValorLimite !== "" ? parseFloat(filtroValorLimite) : "" // -> Converte em número decimal puro para evitar quebras ou passa em branco se vazio.
    }); // -> Encerra o envio das propriedades consolidadas.
  }; // -> Encerra o interceptador de envios locais.

  // -> MANIPULADOR DE LIMPEZA DE SELEÇÃO EM LOTE
  const limparFiltrosLocais = () => {
    const [filtroCodigo, setFiltroCodigo] = useState(""); // -> Monitora localmente o Código Conta digitado para o refino.
    setFiltroCliente(""); // -> Zera localmente o campo de Razão Social.
    setFiltroResponsavel(""); // -> Zera localmente o campo de Operador.
    setFiltroStatus("todos"); // -> Retorna o combo de fases do funil para o valor global de exibir tudo.
    setFiltroOperadorValor(">="); // -> Retorna o seletor lógico para a posição de fábrica.
    setFiltroValorLimite(""); // -> Esvazia a caixa de digitação numérica de moedas.
    
    // -> Avisa o pai para remover todas as barreiras matemáticas simultaneamente e restaurar o faturamento bruto do Firebase.
    aoAplicarFiltros({
      codigo: "",
      cliente: "",
      responsavel: "",
      status: "todos",
      operadorValor: ">=",
      valorLimite: ""
    }); // -> Encerra a transmissão de reset total.
  }; // -> Encerra a função de limpeza.

  return ( // -> Renderiza a interface visual da gaveta lateral de faturamento na tela.
    // 🎭 CORTINA TRASEIRA ESCURA: Bloqueia cliques externos e dá foco visual total à gaveta lateral.
    <div 
      onClick={aoFechar} // -> Se o operador clicar na área escura de fora, fecha a gaveta na hora.
      style={{
        position: "fixed", // -> Trava o elemento de forma absoluta cobrindo toda a janela visual.
        top: 0, // -> Gruda no limite superior da página.
        left: 0, // -> Gruda no limite esquerdo da página.
        width: "100vw", // -> Força a largura a ocupar 100% do visor da máquina.
        height: "100vh", // -> Força a altura a ocupar 100% da tela física.
        backgroundColor: "rgba(15, 23, 42, 0.4)", // -> Fundo escuro esfumaçado premium com opacidade suave.
        zIndex: 6000, // -> Camada de profundidade altíssima para ficar por cima do Kanban e da Tabela devedora.
        display: "flex", // -> Ativa flexbox para empurrar o contêiner branco.
        justifyContent: "flex-end", // -> Empurra o painel branco rigorosamente para o canto direito da tela.
        alignItems: "stretch" // -> Estica o painel branco para ocupar toda a altura vertical da máquina (100vh).
      }}
    >
      {/* 📥 CORPO BRANCO DA GAVETA FLUTUANTE (DRAWER COM TODOS OS COMPONENTES DE CABEÇALHO) */}
      <div 
        onClick={(e) => e.stopPropagation()} // -> Trava de segurança: impede que clicar dentro da gaveta feche ela por acidente.
        style={{
          background: "#ffffff", // -> Folha branca limpa profissional.
          width: "100%", // -> Largura responsiva base adaptável.
          maxWidth: "340px", // -> Mantém o visual esguio e compacto de 340px ideal para escritórios jurídicos.
          boxShadow: "-10px 0 25px rgba(0,0,0,0.05)", // -> Sombra de projeção suave lateral de profundidade.
          padding: "24px", // -> Padding interno enxugado para maximizar o preenchimento de inputs na barra.
          display: "flex", // -> Ativa o flexbox para empilhar os elementos verticais.
          flexDirection: "column", // -> Organiza as caixas verticalmente de cima para baixo.
          justifyContent: "space-between", // -> Deixa o formulário no topo e os botões travados no rodapé da gaveta.
          boxSizing: "border-box" // -> Impede quebras de tamanho e estouros de margens.
        }}
      >
        {/* BLOCO SUPERIOR: TÍTULO INTEGRADO E ÍCONE DE FECHAR */}
        <div style={{ overflowY: "auto", flexGrow: 1, paddingRight: "4px" }}> {/* -> Adicionado rolagem interna auxiliar para evitar quebras em telas menores. */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}> {/* -> Cabeçalho separador compacto cinza. */}
            <div> {/* -> Agrupador de títulos estruturais. */}
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>🔍 Filtros Simultâneos</h3> {/* -> Título formal sóbrio em caixa alta corporativa. */}
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Refine a busca de devedores na esteira ativa.</p> {/* -> Subtítulo explicativo cinza. */}
            </div> {/* -> Encerra o bloco de títulos. */}
            <button type="button" onClick={aoFechar} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8", fontWeight: "bold", padding: 0 }}>&times;</button> {/* -> Ícone puro de fechamento em formato de X sem textos poluentes. */}
          </div> {/* -> Encerra o cabeçalho superior. */}

          {/* FORMULÁRIO COM SELETORES OPERACIONAIS DE CABEÇALHO COMPLETO */}
          <form onSubmit={tratarFiltroLocal} style={{ display: "flex", flexDirection: "column", gap: "12px" }}> {/* -> Gap enxugado para 12px para densidade profissional máxima. */}
            
            {/* NOVO CAMPO: BUSCA POR CÓDIGO CONTA */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador vertical do input de conta. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Código Conta</label> {/* -> Rótulo em caixa alta regulado para 11px. */}
              <input 
                type="text" 
                placeholder="Buscar por #ID código..." 
                value={filtroCodigo} 
                onChange={(e) => setFiltroCodigo(e.target.value)} 
                style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} // -> Input compacto com fonte de 12px.
              />
            </div> {/* -> Fim do campo de busca por Código. */}

            {/* NOVO CAMPO: BUSCA POR EMPRESA / RAZÃO SOCIAL */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador vertical do input de razão social. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Empresa / Razão Social</label> {/* -> Rótulo em caixa alta regulado para 11px. */}
              <input 
                type="text" 
                placeholder="Buscar nome do devedor..." 
                value={filtroCliente} 
                onChange={(e) => setFiltroCliente(e.target.value)} 
                style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} // -> Input compacto com fonte de 12px.
              />
            </div> {/* -> Fim do campo de busca por Empresa. */}

            {/* CAMPO MANTER: BUSCA POR OPERADOR RESPONSÁVEL */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador vertical do input do operador. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Operador Responsável</label> {/* -> Rótulo em caixa alta regulado para 11px. */}
              <input 
                type="text" 
                placeholder="Ex: Victor Faustino" 
                value={filtroResponsavel} 
                onChange={(e) => setFiltroResponsavel(e.target.value)} 
                style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} // -> Input compacto com fonte de 12px.
              />
            </div> {/* -> Fim do campo de busca por operador. */}

            {/* CAMPO RECALIBRADO: EXPANDIDO COM OS REQUISITOS DE ETAPA DO MÓDULO CLICKUP */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador vertical do select de etapas. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Fase do Funil</label> {/* -> Rótulo em caixa alta regulado para 11px. */}
              <select 
                value={filtroStatus} 
                onChange={(e) => setFiltroStatus(e.target.value)} 
                style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff", fontWeight: "bold", cursor: "pointer" }} // -> Dropdown compacto com fonte de 12px e negrito.
              >
                <option value="todos">🗂️ Exibir Todas as Colunas</option>
                <option value="novo">🆕 A Iniciar</option>
                <option value="contato">✉️ Notificação Enviada</option>
                <option value="negociacao">🤝 Em Negociação</option>
                <option value="acordo">📄 Termo em Andamento</option>
                <option value="cobranca">📊 Cobrança Parcelada</option> {/* -> NOVO STATUS: Acopla o filtro síncrono para os parcelamentos Price. */}
                <option value="conta_corrente">⚡ Conta Corrente</option> {/* -> NOVO STATUS: Acopla o filtro síncrono para as amortizações livres. */}
                <option value="finalizado">✅ Finalizado</option>
              </select> {/* -> Encerra a caixa seletora de fases do funil. */}
            </div> {/* -> Fim do campo de fase do funil. */}

            {/* NOVO SUPER FILTRO: MOTOR DE OPERADORES MATEMÁTICOS DE VALORES */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Alinhador vertical do bloco matemático de finanças. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", textTransform: "uppercase" }}>Saldo Vencido (Mecânica Lógica)</label> {/* -> Rótulo explicativo sênior. */}
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "6px" }}> {/* -> Grade de division interna acoplando o sinal lógico ao campo numérico de moeda. */}
                <select 
                  value={filtroOperadorValor} 
                  onChange={(e) => setFiltroOperadorValor(e.target.value)} 
                  style={{ padding: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff", fontWeight: "bold", cursor: "pointer" }} // -> Dropdown compacto contendo os quatro operadores fixos.
                >
                  <option value="<=">&lt;= (Menor ou Igual)</option>
                  <option value="<">&lt; (Menor)</option>
                  <option value=">">&gt; (Maior)</option>
                  <option value=">=">&gt;= (Maior ou Igual)</option>
                </select> {/* -> Encerra o select matemático. */}
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Valor corte (Ex: 5000)" 
                  value={filtroValorLimite} 
                  onChange={(e) => setFiltroValorLimite(e.target.value)} 
                  style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc", fontWeight: "bold", textAlign: "right" }} // -> Entrada numérica alinhada à direita para digitação do saldo limite.
                />
              </div> {/* -> Encerra a grade dupla interna. */}
            </div> {/* -> Fim do campo matemático de valores de saldo vencido. */}

          </form> {/* -> Encerra a tag de formulário avançado. */}
        </div> {/* -> Encerra o bloco superior de campos com rolagem. */}

        {/* BLOCO INFERIOR FIXO: BOTÕES DE LIMPAR E APLICAR COMBINAÇÕES */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginTop: "12px" }}> {/* -> Contêiner fixado no rodapé com friso divisório e padding compacto. */}
          <button 
            onClick={tratarFiltroLocal} // -> Aciona o gatilho interceptador que injeta o bloco completo de chaves na esteira do cérebro.
            type="button" // -> Tipo botão para estabilidade de eventos.
            style={{ backgroundColor: "#0f172a", border: "none", color: "white", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "700", textTransform: "uppercase", fontSize: "12px" }} // -> Botão sólido Azul Escuro Profundo institucional da advocacia.
          >
            Filtrar Esteira
          </button>
          <button 
            onClick={limparFiltrosLocais} // -> Aciona a função de limpeza redefinindo as 6 chaves de busca simultâneas na nuvem.
            type="button" // -> Tipo botão para estabilidade de eventos.
            style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }} // -> Botão sóbrio de limpeza em 12px.
          >
            Limpar Filtros
          </button>
        </div> {/* -> Encerra o bloco inferior fixo de comandos rápidos. */}

      </div> {/* -> Encerra o corpo branco da gaveta flutuante. */}
    </div> // -> Encerra a cortina escura traseira.
  );
}