import React, { useState } from "react"; // -> Importa o coração do React e o gancho de estado (useState) para monitorar localmente as caixas de seleção e inputs dinâmicos de lote.
import { Kanban, TableProperties, Archive, ArchiveX, Filter, PlusCircle, Trash2, SlidersHorizontal, UploadCloud } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e ultra modernos da biblioteca Lucide, incluindo o UploadCloud para o CSV.

// CORREÇÃO DE EMBALAGEM: Removido o 'default' para bater 100% com a importação por chaves { Toolbar } declarada na linha 6 do seu App.jsx.
export function Toolbar({ visaoAtual, aoMudarVisao, aoAbrirModalCadastro, aoAbrirGavetaFiltros, totalFiltrosAtivos = 0, exibirArquivados = false, aoAlternarArquivados, itensSelecionados = {}, aoExecutarExclusaoEmMassa, aoExecutarEdicaoEmMassa, etapasFunilExternas = [], abaAtivaAtual = "crm", aoImportarCSV }) { // -> Declara a função da barra de ferramentas recebendo os controles operacionais, filtros, estados de lotes e a nova função de importação de CSV do App.jsx.
  // Motor de contagem em massa: Varre a bandeja de checkboxes ativos e calcula quantos itens o operador flegou nas linhas.
  const contagemSelecionados = Object.keys(itensSelecionados).filter((id) => itensSelecionados[id] === true).length; // -> Filtra os IDs salvos na memória RAM para contar apenas quem está com o visto ativado.

  // Novos estados locais operacionais para a edição em duas etapas dinâmicas:
  // Etapa 1: Armazena na memória qual metadado do cliente o gestor deseja alterar (status, responsavel, segmento).
  const [campoSelecionadoLote, setCampoSelecionadoLote] = useState(""); // -> Monitora o dropdown della primeira fase de edição coletiva.
  // Etapa 2: Monitora a nova string ou opção que será carimbada em todos os registros marcados de uma vez.
  const [valorEdicaoMassa, setValorEdicaoMassa] = useState(""); // -> Monitora o input de texto ou select de destino da segunda fase.

  // Disparador do comando coletivo de atualização ao clicar no botão "Aplicar Alteração".
  const lidarComAplicarEdicaoLote = () => { // -> Aciona a trigger coletiva empurrando as modificações em massa para a nuvem.
    // Trava de barreira se o operador não escolheu qual coluna quer reajustar.
    if (!campoSelecionadoLote) { // -> Verifica se o campo alvo da Etapa 1 está em branco.
      alert("⚠️ OPERAÇÃO EM LOTE:\nPor favor, escolha primeiro qual campo deseja alterar em massa."); // -> Emite o aviso de alerta explicativo na tela para o usuário.
      return; // -> Interrompe o processamento do código para evitar erros de gravação.
    } // -> Fim da barreira de campo.
    // Trava de barreira se a caixinha de novo valor estiver vazia.
    if (!valorEdicaoMassa.trim()) { // -> Verifica se o texto digitado na Etapa 2 veio nulo ou cheio de espaços.
      alert("⚠️ OPERAÇÃO EM LOTE:\nDigite ou escolha o novo valor que será carimbado em todos os itens."); // -> Emite o aviso de alerta cobrando o preenchimento da informação.
      return; // -> Interrompe o processamento do código para evitar o envio de textos vazios.
    } // -> Fim da barreira de valor.
    // Se o cabo de rede com o App.jsx estiver conectado e a função existir no mestre.
    if (aoExecutarEdicaoEmMassa) { // -> Testa se o maestro pai repassou a trigger de salvamento em massa.
      aoExecutarEdicaoEmMassa(campoSelecionadoLote, valorEdicaoMassa.trim()); // -> Transmite síncronamente o par alvo de atualização (Coluna + Novo Valor) para o laço NoSQL principal do app.
      setCampoSelecionadoLote(""); // -> Reseta o dropdown da Etapa 1 na memória RAM para a posição padrão limpa.
      setValorEdicaoMassa(""); // -> Reseta o input ou select da Etapa 2 na memória RAM para limpar o campo visual.
    } // -> Fim do disparo.
  }; // -> Encerra o aplicador de lote.

  // Monitor de mudança de escopo: Limpa a caixinha de valor caso o operador mude o campo alvo para não cruzar fantasmas textuais de outras colunas.
  const lidarMudancaCampoMassa = (novoCampo) => { // -> Gerencia o chaveamento de categorias de lote.
    setCampoSelecionadoLote(novoCampo); // -> Salva a nova coluna alvo escolhida pelo operador no dropdown.
    setValorEdicaoMassa(""); // -> Zera a Etapa 2 imediatamente para receber o novo componente adequado de inserção.
  }; // -> Encerra o resetador de escopo.

  // Inicia o retorno do componente visual que desenha a barra de controle na tela com suas caixas flexíveis.
  return ( 
    // Contêiner mestre horizontal configurado com espaçamento compacto de 16px para alinhar perfeitamente os botões nas extremidades.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "16px auto 0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}> 
      
      {/* Seção da esquerda dinâmica: Se houver itens marcados, exibe o painel de ações coletivas; caso contrário, carrega os botões de Kanban e Planilha */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}> 
        {contagemSelecionados > 0 ? (
          // Circuito de lote active premium integrado em duas etapas: Caso o operador tenha flegado linhas, acende o cockpit vermelho de alterações.
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff1f2", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fecdd3", height: "34px", boxSizing: "border-box" }}>
            {/* Exibe o contador em lote informando em tempo real o volume de registros marcados. */}
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
              {contagemSelecionados} selecionados
            </span> 
            
            {/* Etapa 1: Seletor do campo alvo - Exibe as colunas de metadados de acordo com a aba operacional em foco na tela */}
            <select
              value={campoSelecionadoLote} // Vincula a caixa de seleção ao estado da Etapa 1.
              onChange={(e) => lidarMudancaCampoMassa(e.target.value)} // Aciona o limpador de segurança e salva a coluna selecionada.
              style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
            >
              <option value="">-- Campo para Editar --</option>
              {abaAtivaAtual === "crm" && ( // Se o usuário estiver operando no ecossistema do CRM.
                <>
                  <option value="status">ETAPA DO FUNIL (ARRASTAR)</option>
                  <option value="responsavel">OPERADOR GESTOR</option>
                </>
              )}
              {abaAtivaAtual === "cadastros" && ( // Se o usuário estiver trabalhando no módulo de Cadastros de Empresas.
                <>
                  <option value="segmento">SEGMENTO DE MERCADO</option>
                  <option value="tipo">TIPO (MATRIZ / FILIAL)</option>
                </>
              )}
            </select>

            {/* Etapa 2: Input dinâmico inteligente - Modifica seu formato de acordo com o campo selecionado na caixa anterior */}
            {campoSelecionadoLote === "status" && ( // Cenário A: Se escolher status, monta a caixa de seleção alimentada pelas raias ativas do Firebase.
              <select
                value={valorEdicaoMassa}
                onChange={(e) => setValorEdicaoMassa(e.target.value)}
                style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#2563eb", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
              >
                <option value="">-- Escolha a Nova Etapa --</option>
                {etapasFunilExternas.map((col) => (
                  <option key={col.id} value={col.id}>{col.nome.toUpperCase()}</option>
                ))}
              </select>
            )}

            {campoSelecionadoLote === "tipo" && ( // Cenário B: Se escolher tipo corporativo, trava o seletor entre Matriz ou Filial evitando erros de digitação.
              <select
                value={valorEdicaoMassa}
                onChange={(e) => setValorEdicaoMassa(e.target.value)}
                style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
              >
                <option value="">-- Escolha o Tipo --</option>
                <option value="Matriz">MATRIZ</option>
                <option value="Filial">FILIAL</option>
              </select>
            )}

            {(campoSelecionadoLote === "responsavel" || campoSelecionadoLote === "segmento") && ( // Cenário C: Se for operador ou segmento de texto livre, libera a caixinha de digitação limpa.
              <input
                type="text"
                value={valorEdicaoMassa}
                onChange={(e) => setValorEdicaoMassa(e.target.value)}
                placeholder={campoSelecionadoLote === "responsavel" ? "Nome do novo gestor..." : "Novo segmento (Ex: Alimentos)..."}
                style={{ padding: "2px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", color: "#0f172a", backgroundColor: "#ffffff", outline: "none", width: "160px", height: "20px" }}
              />
            )}

            {/* Botão de confirmação do lote que executa a alteração em massa e atualiza as linhas selecionadas */}
            {campoSelecionadoLote && (
              <button
                type="button" 
                onClick={lidarComAplicarEdicaoLote} // Arremessa os pacotes de alteração coletivos para o banco de dados.
                style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s ease", height: "20px", display: "flex", alignItems: "center" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
              >
                Aplicar
              </button>
            )}

            {/* Traço divisor vertical fino para separar as funções de edição e exclusão dentro da barra. */}
            <div style={{ width: "1px", height: "16px", backgroundColor: "#fda4af" }}></div> 

            {/* Gatilho de exclusão em massa para apagar em lote todos os itens marcados de uma vez só */}
            <button
              type="button" 
              onClick={aoExecutarExclusaoEmMassa} // Aciona o comando do App.jsx que deleta fisicamente os itens marcados na nuvem.
              style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#ef4444", border: "none", color: "white", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
              title="Excluir todos os itens marcados permanentemente da esteira" // Texto de dica que aparece ao passar o mouse.
            >
              {/* Injeta o ícone geométrico de lixeira da biblioteca Lucide. */}
              <Trash2 size={11} strokeWidth={2.5} /> 
              <span>Excluir</span>
            </button>
          </div>
        ) : (
          // Circuito comum padrão: Se não houver checkboxes flegados, renderiza os seletores normais de Kanban e Planilha.
          <>
            {/* Botão para ativar a visualização em formato de Quadro Kanban */}
            <button 
              type="button" 
              onClick={() => aoMudarVisao("kanban")} // Avisa o mestre App.jsx para chavear a tela para o modo de raias.
              style={{ 
                backgroundColor: visaoAtual === "kanban" ? "#0f172a" : "#f1f5f9", 
                border: visaoAtual === "kanban" ? "1px solid #0f172a" : "1px solid #cbd5e1", 
                padding: "6px 14px", 
                borderRadius: "6px", 
                fontSize: "13px", 
                fontWeight: "700", 
                color: visaoAtual === "kanban" ? "#ffffff" : "#475569", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "1px", 
                transition: "all 0.2s ease" 
              }}
            >
              {/* Insere o ícone de colunas do Kanban. */}
              <Kanban size={14} strokeWidth={2} /> 
              <span></span> 
            </button> 

            {/* Botão para ativar a visualização em formato de Tabela/Planilha Executiva */}
            <button 
              type="button" 
              onClick={() => aoMudarVisao("tabela")} // Avisa o mestre App.jsx para ocultar o Kanban e desenhar as linhas da planilha.
              style={{ 
                backgroundColor: visaoAtual === "tabela" ? "#0f172a" : "#f1f5f9", 
                border: visaoAtual === "tabela" ? "1px solid #0f172a" : "1px solid #cbd5e1", 
                padding: "6px 14px", 
                borderRadius: "6px", 
                fontSize: "13px", 
                fontWeight: "700", 
                color: visaoAtual === "tabela" ? "#ffffff" : "#475569", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "1px", 
                transition: "all 0.2s ease" 
              }}
            >
              {/* Insere o ícone de estrutura de planilha. */}
              <TableProperties size={14} strokeWidth={2} /> 
              <span></span> 
            </button> 
          </>
        )}
      </div> 

      {/* Seção da direita: Filtros avançados, Importação de Aging CSV, Limbo de arquivados e Nova Cobrança */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}> 
        
        {/* Botão Toggle Premium: Altera o ícone de caixa aberta ou fechada dependendo do estado do Limbo */}
        <button
          type="button" 
          onClick={() => aoAlternarArquivados && aoAlternarArquivados(!exibirArquivados)} // Executa a inversão segura do estado booleano de exibição do arquivo morto.
          style={{
            background: exibirArquivados ? "#0f172a" : "#ffffff", 
            color: exibirArquivados ? "#ffffff" : "#475569", 
            border: exibirArquivados ? "1px solid #0f172a" : "1px solid #cbd5e1", 
            padding: "6px 14px", 
            borderRadius: "6px", 
            fontWeight: "700", 
            fontSize: "13px", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "6px", 
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)", 
            transition: "all 0.2s ease" 
          }}
          title={exibirArquivados ? "Exibindo Arquivos Mortos - Clique para voltar à esteira ativa" : "Exibindo Cards Ativos - Clique para visualizar o Limbo de Arquivados"} // Tooltip explicativa em português.
        >
          {exibirArquivados ? (
            // Desenha o ícone de caixa fechada com um "X" indicando que o limbo está ativo e pode ser fechado.
            <ArchiveX size={14} strokeWidth={2} /> 
          ) : (
            // Desenha a caixa de arquivos clássica vazada para dar acesso ao repositório morto.
            <Archive size={14} strokeWidth={2} /> 
          )}
          <span>Limbo</span> 
        </button>

        {/* Botão de acionamento reativo da gaveta lateral direita de Filtros Avançados */}
        <button 
          type="button" 
          onClick={aoAbrirGavetaFiltros} // Dispara a função que faz a barra lateral de filtros deslizar na tela.
          style={{ 
            background: "#ffffff", 
            color: "#475569", 
            border: "1px solid #cbd5e1", 
            padding: "6px 14px", 
            borderRadius: "6px", 
            fontWeight: "700", 
            fontSize: "12px", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)" 
          }}
          title="Filtros Avançados de Busca" 
        >
          {/* Insere o ícone de funil calibrado em tamanho 14. */}
          <Filter size={14} strokeWidth={2} /> 
          <span>Filtros</span> 
          {totalFiltrosAtivos > 0 && (
            // Pílula indicadora vermelha que acende dinamicamente mostrando quantos filtros o operador está combinando.
            <span style={{ background: "#ef4444", color: "white", fontSize: "10px", padding: "1px 5px", borderRadius: "10px", fontWeight: "bold" }}>
              {totalFiltrosAtivos}
            </span>
          )}
        </button>

        {/* 🎛️ CONECTOR VISUAL DO IMPORTADOR (MÓDULO DE AUTONOMIA AGING):
            Contêiner de ID exclusivo fixado. O gancho useEffect do App.jsx vai ler essa ID na montagem 
            e injetar o botão azul oficial calibrado para carregar a planilha Aging sem dar erros de módulo! */}
        <div id="container-importador-toolbar-id" style={{ display: "inline-flex", height: "30px", alignItems: "center" }}></div>

        {/* Botão de comando primário para abrir o modal de cadastro manual de novas cobranças */}
        <button 
          type="button" 
          onClick={aoAbrirModalCadastro} // Abre o formulário limpo para inserção de um novo devedor.
          style={{ 
            background: "#0f172a", 
            color: "white", 
            border: "none", 
            padding: "6px 16px", 
            borderRadius: "6px", 
            fontWeight: "800", 
            fontSize: "12px", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            height: "30px", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)", 
            transition: "background 0.15s ease"
          }}
          title="Cadastrar Nova Cobrança no Funil" 
        >
          {/* Vetor de círculo com sinal de adição da biblioteca Lucide. */}
          <PlusCircle size={14} strokeWidth={2} />
          <span>Nova Cobrança</span>
        </button>

      </div> 
    </div> 
  );
}