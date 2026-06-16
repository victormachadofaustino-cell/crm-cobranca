import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar localmente as caixas de seleção e inputs dinâmicos de lote.
import { Kanban, TableProperties, Archive, ArchiveX, Filter, PlusCircle, Trash2, SlidersHorizontal } from "lucide-react"; // -> Injeta as ferramentas de ícones finos, monocromáticos e ultra modernos da biblioteca Lucide.

export function Toolbar({ visaoAtual, aoMudarVisao, aoAbrirModalCadastro, aoAbrirGavetaFiltros, totalFiltrosAtivos = 0, exibirArquivados = false, aoAlternarArquivados, itensSelecionados = {}, aoExecutarExclusaoEmMassa, aoExecutarEdicaoEmMassa, etapasFunilExternas = [], abaAtivaAtual = "crm" }) { // -> RECALIBRADA FINTECH: Herda os modificadores de mutação em lote, a aba operacional ativa e a listagem de fases NoSQL vindas do mestre App.jsx.
  // -> MOTOR DE CONTAGEM EM MASSA: Varre a bandeja de checkboxes ativos e calcula quantos itens o operador flegou nas linhas.
  const contagemSelecionados = Object.keys(itensSelecionados).filter((id) => itensSelecionados[id] === true).length; // -> Soma reativamente os booleanos de flag verdadeira em tempo real.

  // -> NOVOS ESTADOS LOCAIS OPERACIONAIS PARA A EDICAO EM DUAS ETAPAS DINÂMICAS:
  const [campoSelecionadoLote, setCampoSelecionadoLote] = useState(""); // -> ETAPA 1: Armazena na memória qual metadado do cliente o gestor deseja alterar (status, responsavel, segmento).
  const [valorEdicaoMassa, setValorEdicaoMassa] = useState(""); // -> ETAPA 2: Monitora a nova string ou opção que será carimbada em todos os registros marcados de uma vez.

  // -> DISPARADOR DO COMANDO COLETIVO DE ATUALIZAÇÃO
  const lidarComAplicarEdicaoLote = () => { // -> Acionado ao clicar no botão "Aplicar Alteração".
    if (!campoSelecionadoLote) { // -> Trava de barreira se o operador não escolheu qual coluna quer reajustar.
      alert("⚠️ OPERAÇÃO EM LOTE:\nPor favor, escolha primeiro qual campo deseja alterar em massa."); // -> Emite o aviso.
      return; // -> Interrompe a descida de barramento.
    }
    if (!valorEdicaoMassa.trim()) { // -> Trava de barreira se a caixinha de novo valor estiver vazia.
      alert("⚠️ OPERAÇÃO EM LOTE:\nDigite ou escolha o novo valor que será carimbado em todos os itens."); // -> Emite o aviso.
      return; // -> Interrompe a descida de barramento.
    }
    if (aoExecutarEdicaoEmMassa) { // -> Se o cabo de rede com o App.jsx estiver conectado.
      aoExecutarEdicaoEmMassa(campoSelecionadoLote, valorEdicaoMassa.trim()); // 🛠️ FIÇÃO EM DUAS ETAPAS HOMOLOGADA: Transmite síncronamente o par alvo de atualização (Coluna + Novo Valor) para o laço NoSQL principal.
      setCampoSelecionadoLote(""); // -> Reseta o dropdown da Etapa 1 na memória RAM.
      setValorEdicaoMassa(""); // -> Reseta o input da Etapa 2 na memória RAM.
    }
  };

  // -> MONITOR DE MUDANÇA DE ESCOPO: Limpa a caixinha de valor caso o operador mude o campo alvo para não cruzar fantasmas textuais.
  const lidarMudancaCampoMassa = (novoCampo) => { // -> Recebe a string de foco da caixa.
    setCampoSelecionadoLote(novoCampo); // -> Salva a nova coluna alvo.
    setValorEdicaoMassa(""); // -> Zera a Etapa 2 imediatamente para receber o novo componente adequado.
  };

  return ( // -> Inicia o retorno do componente visual que desenha a barra de controle na tela.
    <div style={{ width: "100%", maxWidth: "1400px", margin: "16px auto 0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}> {/* -> Espaçamento compactado para 16px para otimizar espaço vertical e alinhar elementos nas extremidades laterais. */}
      
      {/* SEÇÃO DA ESQUERDA DINÂMICA: SE HOUVER ITENS MARCADOS, EXIBE O PAINEL DE AÇÕES COLETIVAS NO TOPO; CASO CONTRÁRIO, CARREGA OS ALTERNADORES DE VISÃO */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}> {/* -> Agrupador flexbox compacto com distanciamento enxugado para 6px. */}
        {contagemSelecionados > 0 ? (
          // 🧺 CIRCUITO DE LOTE ATIVO PREMIUM INTEGRADO EM DUAS ETAPAS: Caso o operador tenha flegado linhas, renderiza o cockpit vermelho de mutações em bloco.
          <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff1f2", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fecdd3", height: "34px", boxSizing: "border-box" }}>
            <span style={{ fontSize: "11px", fontWeight: "800", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
              {contagemSelecionados} selecionados
            </span> {/* -> Exibe o contador em lote informando o volume de checkboxes flegados de forma síncrona. */}
            
            {/* 🛠️ ETAPA 1: SELETOR DO CAMPO ALVO - Exibe metadados de acordo com a aba operacional ativa */}
            <select
              value={campoSelecionadoLote} // -> Vincula ao estado da Etapa 1.
              onChange={(e) => lidarMudancaCampoMassa(e.target.value)} // -> Aciona o resetador de segurança e salva o alvo.
              style={{ padding: "2px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff", cursor: "pointer", outline: "none" }}
            >
              <option value="">-- Campo para Editar --</option>
              {abaAtivaAtual === "crm" && ( // -> Se o usuário estiver trabalhando na Planilha do CRM.
                <>
                  <option value="status">ETAPA DO FUNIL (ARRRASTAR)</option>
                  <option value="responsavel">OPERADOR GESTOR</option>
                </>
              )}
              {abaAtivaAtual === "cadastros" && ( // -> Se o usuário estiver trabalhando no Hub de Cadastros de Empresas/Contatos.
                <>
                  <option value="segmento">SEGMENTO DE MERCADO</option>
                  <option value="tipo">TIPO (MATRIZ / FILIAL)</option>
                </>
              )}
            </select>

            {/* 🛠️ ETAPA 2: INPUT DINÂMICO INTELIGENTE - Modifica sua estrutura de acordo com o campo focado na Etapa 1 */}
            {campoSelecionadoLote === "status" && ( // -> Cenário A: Se escolher status, renderiza o select alimentado pelas raias reais do Firebase NoSQL.
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

            {campoSelecionadoLote === "tipo" && ( // -> Cenário B: Se escolher tipo corporativo, trava as duas opções oficiais evitando erros de digitação.
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

            {(campoSelecionadoLote === "responsavel" || campoSelecionadoLote === "segmento") && ( // -> Cenário C: Se for operador ou segmento livre, libera a caixinha de escrita limpa.
              <input
                type="text"
                value={valorEdicaoMassa}
                onChange={(e) => setValorEdicaoMassa(e.target.value)}
                placeholder={campoSelecionadoLote === "responsavel" ? "Nome do novo gestor..." : "Novo segmento (Ex: Alimentos)..."}
                style={{ padding: "2px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px", color: "#0f172a", backgroundColor: "#ffffff", outline: "none", width: "160px", height: "20px" }}
              />
            )}

            {/* BOTÃO DE CONFIRMAÇÃO DO LOTE COM ADESÃO AO MOUSEOVER */}
            {campoSelecionadoLote && (
              <button
                type="button" // -> Tipo comanda estável.
                onClick={lidarComAplicarEdicaoLote} // -> Arremessa os pacotes de alteração em massa coletivos para a nuvem.
                style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "3px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s ease", height: "20px", display: "flex", alignItems: "center" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
              >
                Aplicar
              </button>
            )}

            <div style={{ width: "1px", height: "16px", backgroundColor: "#fda4af" }}></div> {/* -> Traço divisor fino de altíssimo contraste visual. */}

            {/* GATILHO DE EXPURGO COLETIVO REATIVO */}
            <button
              type="button" // -> Tipo botão comercial de segurança.
              onClick={aoExecutarExclusaoEmMassa} // -> Aciona o bombardeio NoSQL que tritura em massa os canhotos no Firebase.
              style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#ef4444", border: "none", color: "white", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase", transition: "background 0.15s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
              title="Excluir todos os itens marcados permanentemente da esteira" // -> Tooltip explicativa.
            >
              <Trash2 size={11} strokeWidth={2.5} /> {/* -> Injeta o vetor fino de lixeira outline no comando de destruição coletiva. */}
              <span>Excluir</span>
            </button>
          </div>
        ) : (
          // 🧭 CIRCUITO COMUM PADRÃO: Se não houver checkboxes flegados, renderiza os seletores de layout comuns estáveis.
          <>
            {/* BOTÃO: VISÃO KANBAN */}
            <button 
              type="button" // -> Define explicitamente o tipo do elemento como botão nativo para blindagem de formulários.
              onClick={() => aoMudarVisao("kanban")} // -> Avisa o mestre App.jsx para carregar o quadro de raias cinzas.
              style={{ 
                backgroundColor: visaoAtual === "kanban" ? "#0f172a" : "#f1f5f9", // -> MUDANÇA SÓBRIA: Azul Escuro Profundo se ativo, ou cinza plano se inativo. 
                border: visaoAtual === "kanban" ? "1px solid #0f172a" : "1px solid #cbd5e1", // -> Ajusta o contorno de contorno combinando com a cor do estado ativo. 
                padding: "6px 14px", // -> Espaçamento interno calibrado para compactação tridimensional do layout. 
                borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo sério.
                fontSize: "13px", // -> Fonte recalibrada para densidade ideal para rotinas fiscais.
                fontWeight: "700", // -> Peso de fonte destacado para leitura imediata da aba.
                color: visaoAtual === "kanban" ? "#ffffff" : "#475569", // -> Texto branco no fundo escuro, ou cinza ardósia corporativo no fundo claro. 
                cursor: "pointer", // -> Transforma a seta do mouse em ponteiro de clique interativo.
                display: "flex", // -> Ativa flexbox interno para centralização geométrica perfeita do ícone.
                alignItems: "center", // -> Centraliza verticalmente o ícone interno do Lucide.
                justifyContent: "center", // -> Centraliza horizontalmente o ícone interno do Lucide.
                gap: "6px", // -> Cria um espaçamento técnico e elegante de 6px entre o componente gráfico e o texto.
                transition: "all 0.2s ease" // -> Transição suave de cores ao chavear os cliques.
              }}
            >
              <Kanban size={14} strokeWidth={2} /> {/* -> Renderiza o ícone geométrico de raias do Lucide em tamanho enxuto 14 e traço fino de espessura 2. */}
              <span>Kanban</span> {/* -> Texto limpo e institucional substituindo o emoji antigo por extenso. */}
            </button> {/* -> Encerra o botão alternador do Kanban. */}

            {/* BOTÃO: VISÃO TABELA EXECUTIVA */}
            <button 
              type="button" // -> Define explicitamente o tipo do elemento como botão nativo para blindagem de formulários.
              onClick={() => aoMudarVisao("tabela")} // -> Avisa o mestre App.jsx para ocultar o Kanban e renderizar a planilha.
              style={{ 
                backgroundColor: visaoAtual === "tabela" ? "#0f172a" : "#f1f5f9", // -> MUDANÇA SÓBRIA: Azul Escuro Profundo se ativo, ou cinza plano se inativo. 
                border: visaoAtual === "tabela" ? "1px solid #0f172a" : "1px solid #cbd5e1", // -> Ajusta o contorno de contorno de acordo com o estado ativo. 
                padding: "6px 14px", // -> Espaçamento interno calibrado para compactação tridimensional do layout. 
                borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo sério.
                fontSize: "13px", // -> Fonte recalibrada para densidade ideal para rotinas fiscais.
                fontWeight: "700", // -> Peso de fonte destacado para leitura imediata da aba.
                color: visaoAtual === "tabela" ? "#ffffff" : "#475569", // -> Texto branco no fundo escuro, ou cinza ardósia corporativo no fundo claro. 
                cursor: "pointer", // -> Transforma a seta do mouse em ponteiro de clique interativo.
                display: "flex", // -> Ativa flexbox interno para centralização geométrica perfeita do ícone.
                alignItems: "center", // -> Centraliza verticalmente o ícone interno do Lucide.
                justifyContent: "center", // -> Centraliza horizontalmente o ícone interno do Lucide.
                gap: "6px", // -> Cria um espaçamento técnico de 6px entre o ícone do Lucide e o texto.
                transition: "all 0.2s ease" // -> Transição suave de cores ao chavear os cliques.
              }}
            >
              <TableProperties size={14} strokeWidth={2} /> {/* -> Renderiza o ícone de propriedades de tabela em linhas finas vazadas. */}
              <span>Planilha</span> {/* -> Texto executivo e sóbrio substituindo o emoji antigo por extenso. */}
            </button> {/* -> Encerra o botão alternador da planilha executiva. */}
          </>
        )}
      </div> {/* -> Encerra o contêiner esquerdo de alternadores de visão. */}

      {/* SEÇÃO DA DIREITA: FILTROS AVANÇADOS, BOTÃO DE ALTERNÂNCIA DO LIMBO E NOVO PROTOCOLO */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}> {/* -> Alinhador horizontal com espaçamento otimizado para 8px. */}
        
        {/* BOTÃO TOGGLE PREMIUM: Transforma-se em Ícone-Puro (Icon-Only) de arquivo aberto/fechado conforme o estado do Limbo */}
        <button
          type="button" // -> Define o tipo como botão padrão estável del sistema.
          onClick={() => aoAlternarArquivados && aoAlternarArquivados(!exibirArquivados)} // -> Casado perfeitamente o gatilho reativo com a propriedade 'aoAlternarArquivados' para estancar quebras lógicas.
          style={{
            background: exibirArquivados ? "#0f172a" : "#ffffff", // -> Fica escuro se o limbo estiver à vista, ou branco se a esteira limpa estiver ativa.
            color: exibirArquivados ? "#ffffff" : "#475569", // -> Elementos internos brancos ou cinza ardósia dependendo do estado do interruptor.
            border: exibirArquivados ? "1px solid #0f172a" : "1px solid #cbd5e1", // -> Casamento simétrico de contorno de bordas corporativas.
            padding: "6px 14px", // -> Altura padrão unificada de ferramentas do CRM.
            borderRadius: "6px", // -> Arredondamento corporativo estável de 6px.
            fontWeight: "700", // -> Força do texto em modo negrito sênior.
            fontSize: "13px", // -> Uniformizado in 13px para manter consistência com o grid esquerdo.
            cursor: "pointer", // -> Ponteiro indicador de clique ativo.
            display: "flex", // -> Alinhador flexbox interno para centralização perfeita.
            alignItems: "center", // -> Centralização vertical absoluta dos elementos.
            justifyContent: "center", // -> Centralização horizontal estrita para botões baseados apenas in ícones.
            gap: "6px", // -> Cria um espaçamento técnico de 6px entre o componente gráfico e la legenda do limbo.
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)", // -> Micro-sombra protetiva de profundidade de interface.
            transition: "all 0.2s ease" // -> Transição suave de cor de preenchimento ao clicar.
          }}
          title={exibirArquivados ? "Exibindo Arquivos Mortos - Clique para voltar à esteira ativa" : "Exibindo Cards Ativos - Clique para visualizar o Limbo de Arquivados"} // -> Tooltip flutuante explicativa em português que aparece ao passar o mouse.
        >
          {exibirArquivados ? (
            <ArchiveX size={14} strokeWidth={2} /> // -> Exibe la caixa organizadora com um friso fino indicando que o limbo está ativo e pode ser fechado.
          ) : (
            <Archive size={14} strokeWidth={2} /> // -> Exibe la caixa organizadora clássica vazada indicando acesso ao repositório do arquivo morto.
          )}
          <span>Limbo</span> {/* -> Legenda corporativa enxuta e elegante. */}
        </button>

        {/* GATILHO DA GAVETA DE FILTROS SIMULTÂNEOS */}
        <button 
          type="button" // -> Define o tipo do elemento como botão para evitar disparos falsos de submit.
          onClick={aoAbrirGavetaFiltros} // -> Aciona o aparecimento reativo da barra lateral direita de filtros.
          style={{ 
            background: "#ffffff", // -> Fundo branco limpo.
            color: "#475569", // -> Texto cinza corporativo estável.
            border: "1px solid #cbd5e1", // -> Contorno suave de limitation.
            padding: "6px 14px", // -> Altura reduzida alinhada simetricamente à ala esquerda.
            borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo.
            fontWeight: "700", // -> Força do texto em modo negrito denso.
            fontSize: "12px", // -> Fonte calibrada em 12px.
            cursor: "pointer", // -> Mouse em formato de mão de clique.
            display: "flex", // -> Ativa flexbox para acoplar o texto e a pílula de contagem lado a lado.
            alignItems: "center", // -> Centraliza verticalmente o texto e a pílula interna.
            gap: "6px", // -> Espaço de 6px entre a legenda e o círculo de avisos.
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)" // -> Micro-sombra protetiva de profundidade.
          }}
          title="Filtros Avançados de Busca" // -> Dica de tela informativa para o operador.
        >
          <Filter size={14} strokeWidth={2} /> {/* -> Funil geométrico do Lucide. */}
          <span>Filtros</span> {/* -> Legenda totalmente higienizada. */}
          {totalFiltrosAtivos > 0 && (
            <span style={{ background: "#ef4444", color: "white", fontSize: "10px", padding: "1px 5px", borderRadius: "10px", fontWeight: "bold" }}>
              {totalFiltrosAtivos}
            </span>
          )}
        </button>

        {/* GATILHO DO MODAL: + NOVA COBRANÇA */}
        <button 
          type="button" // -> Define o tipo do elemento como botão para estabilidade de eventos.
          onClick={aoAbrirModalCadastro} // -> Altera o estado para verdadeiro abrindo o pop-up flutuante de novas inserções. 
          style={{ 
            background: "#0f172a", // -> MUDANÇA SÓBRIA: Alterado do azul anterior para o Azul Escuro Profundo institucional da advocacia. 
            color: "white", // -> Texto em alta nitidez na cor branca.
            border: "none", // -> Remove contornos para manter o visual sólido plano.
            padding: "6px 16px", // -> Altura milimetricamente adjusted para casar com a linha de botões horizontais. 
            borderRadius: "6px", // -> Arredondamento corporativo estável de 6px.
            fontWeight: "800", // -> Negrito de destaque operacional sênior.
            fontSize: "12px", // -> Fonte em 12px mantendo a uniformidade densa da barra.
            cursor: "pointer", // -> Ponteiro indicador de clique ativo.
            display: "flex", // -> Flexbox para alinhar o ícone de adição e o texto interno.
            alignItems: "center", // -> Centralização vertical absoluta dos textos.
            gap: "6px", // -> Distanciamento interno do ícone de 6px.
            height: "30px", // -> Fixada altura simétrica para travar o barramento visual.
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)", // -> Sombra sutil executiva.
            transition: "background 0.15s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}
          title="Cadastrar Nova Cobrança no Funil" // -> Dica de tela para o acionador de inclusões de dívidas.
        >
          <PlusCircle size={14} strokeWidth={2} />
          <span>Nova Cobrança</span>
        </button>

      </div> {/* -> Encerra o agrupador flexbox da ala direita de ferramentas. */}
    </div> // -> Encerra o contêiner mestre horizontal da Toolbar.
  );
}