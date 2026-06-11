import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export function Toolbar({ visaoAtual, aoMudarVisao, aoAbrirModalCadastro, aoAbrirGavetaFiltros, totalFiltrosAtivos = 0, exibirArquivados = false, aoAlternarArquivados }) { // -> RECALIBRAÇÃO: Recebe as novas propriedades de controle do limbo de arquivados vindas do mestre App.jsx.
  return ( // -> Inicia o retorno do componente visual que desenha a barra de controle na tela.
    <div style={{ maxWidth: "1400px", margin: "16px auto 0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}> {/* -> Espaçamento compactado para 16px para otimizar espaço vertical e alinhar elementos nas extremidades laterais. */}
      
      {/* SEÇÃO DA ESQUERDA: ALTERNADORES INTERATIVOS DE LAYOUT (KANBAN VS TABELA EXECUTIVA) */}
      <div style={{ display: "flex", gap: "6px" }}> {/* -> Agrupador flexbox compacto com distanciamento enxugado para 6px. */}
        
        {/* BOTÃO: VISÃO KANBAN */}
        <button 
          type="button" // -> Define explicitamente o tipo do elemento como botão nativo para blindagem de formulários.
          onClick={() => aoMudarVisao("kanban")} // -> Avisa o mestre App.jsx para carregar o quadro de raias cinzas.
          style={{ 
            backgroundColor: visaoAtual === "kanban" ? "#0f172a" : "#f1f5f9", // -> MUDANÇA SÓBRIA: Azul Escuro Profundo se ativo, ou cinza plano se inativo. 
            border: visaoAtual === "kanban" ? "1px solid #0f172a" : "1px solid #cbd5e1", // -> Ajusta o contorno de contorno combinando com a cor do estado ativo. 
            padding: "6px 12px", // -> Espaçamento interno reduzido para compactação tridimensional do layout. 
            borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo sério.
            fontSize: "12px", // -> Fonte recalibrada para 12px densa ideal para rotinas fiscais.
            fontWeight: "700", // -> Peso de fonte destacado para leitura imediata da aba.
            color: visaoAtual === "kanban" ? "#ffffff" : "#475569", // -> Texto branco no fundo escuro, ou cinza ardósia corporativo no fundo claro. 
            cursor: "pointer", // -> Transforma a seta do mouse em ponteiro de clique interativo.
            transition: "all 0.2s ease" // -> Transição suave de cores ao chavear os cliques.
          }}
        >
          📊
        </button> {/* -> Encerra o botão alternador do Kanban. */}

        {/* BOTÃO: VISÃO TABELA EXECUTIVA */}
        <button 
          type="button" // -> Define explicitamente o tipo do elemento como botão nativo para blindagem de formulários.
          onClick={() => aoMudarVisao("tabela")} // -> Avisa o mestre App.jsx para ocultar o Kanban e renderizar a planilha.
          style={{ 
            backgroundColor: visaoAtual === "tabela" ? "#0f172a" : "#f1f5f9", // -> MUDANÇA SÓBRIA: Azul Escuro Profundo se ativo, ou cinza plano se inativo. 
            border: visaoAtual === "tabela" ? "1px solid #0f172a" : "1px solid #cbd5e1", // -> Ajusta o contorno de contorno de acordo com o estado ativo. 
            padding: "6px 12px", // -> Espaçamento interno reduzido para compactação tridimensional do layout. 
            borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo sério.
            fontSize: "12px", // -> Fonte recalibrada para 12px densa ideal para rotinas fiscais.
            fontWeight: "700", // -> Peso de fonte destacado para leitura imediata da aba.
            color: visaoAtual === "tabela" ? "#ffffff" : "#475569", // -> Texto branco no fundo escuro, ou cinza ardósia corporativo no fundo claro. 
            cursor: "pointer", // -> Transforma a seta do mouse em ponteiro de clique interativo.
            transition: "all 0.2s ease" // -> Transição suave de cores ao chavear os cliques.
          }}
        >
          📋
        </button> {/* -> Encerra o botão alternador da planilha executiva. */}

      </div> {/* -> Encerra o contêiner esquerdo de alternadores de visão. */}

      {/* SEÇÃO DA DIREITA: FILTROS AVANÇADOS, BOTÃO DE ALTERNÂNCIA DO LIMBO E NOVO PROTOCOLO */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}> {/* -> Alinhador horizontal com espaçamento otimizado para 8px. */}
        
        {/* BOTÃO TOGGLE INÉDITO: Ativa ou desativa a exibição do Limbo de Arquivados do ClickUp */}
        <button
          type="button" // -> Define o tipo como botão padrão estável.
          onClick={() => aoAlternarArquivados && aoAlternarArquivados(!exibirArquivados)} // -> Inverte o booleano de busca no mestre ao ser pressionado pelo cobrador.
          style={{
            background: exibirArquivados ? "#0f172a" : "#ffffff", // -> Fica escuro se o limbo estiver à vista, ou branco se a esteira limpa estiver ativa.
            color: exibirArquivados ? "#ffffff" : "#475569", // -> Letras brancas ou cinza ardósia corporativo dependendo do estado do interruptor.
            border: exibirArquivados ? "1px solid #0f172a" : "1px solid #cbd5e1", // -> Casamento simétrico de contorno de bordas.
            padding: "6px 12px", // -> Altura padrão unificada de ferramentas do CRM.
            borderRadius: "6px", // -> Arredondamento corporativo estável de 6px.
            fontWeight: "700", // -> Força do texto em modo negrito sênior.
            fontSize: "12px", // -> Fonte milimetricamente calibrada em 12px.
            cursor: "pointer", // -> Ponteiro indicador de clique ativo.
            display: "flex", // -> Alinhador flexbox interno.
            alignItems: "center", // -> Centralização vertical absoluta dos elementos.
            gap: "6px", // -> Distanciamento interno do ícone de 6px.
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)", // -> Micro-sombra protetiva de profundidade.
            transition: "all 0.2s ease" // -> Transição suave de cor de preenchimento.
          }}
          title={exibirArquivados ? "Voltar para a esteira de cobrança ativa" : "Exibir contas arquivadas (Limbo Oculto)"} // -> Legenda explicativa em português ao pairar o ponteiro do mouse.
        >
          <span>👁️</span> {/* -> Ícone do olho interativo de monitoramento do arquivo morto. */}
          <span>{exibirArquivados ? "Ver Ativos" : "Ver Arquivados"}</span> {/* -> Texto dinâmico que muta para instruir as ações do advogado. */}
        </button>

        {/* GATILHO DA GAVETA DE FILTROS SIMULTÂNEOS */}
        <button 
          type="button" // -> Define o tipo do elemento como botão para evitar disparos falsos de submit.
          onClick={aoAbrirGavetaFiltros} // -> Aciona o aparecimento reativo da barra lateral direita de filtros.
          style={{ 
            background: "#ffffff", // -> Fundo branco limpo.
            color: "#475569", // -> Texto cinza corporativo estável.
            border: "1px solid #cbd5e1", // -> Contorno suave de limitação.
            padding: "6px 12px", // -> Altura reduzida alinhada simetricamente à ala esquerda.
            borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo.
            fontWeight: "700", // -> Força do texto em modo negrito denso.
            fontSize: "12px", // -> Fonte calibrada em 12px.
            cursor: "pointer", // -> Mouse em formato de mão de clique.
            display: "flex", // -> Ativa flexbox para acoplar o texto e a pílula de contagem lado a lado.
            alignItems: "center", // -> Centraliza verticalmente o texto e a pílula interna.
            gap: "6px", // -> Espaço de 6px entre a legenda e o círculo de avisos.
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)" // -> Micro-sombra protetiva de profundidade.
          }}
        >
          <span>🔍</span> {/* -> Legenda do comando da gaveta de buscas. */}
          {/* PÍLULA DE CONTAGEM: Só exibe o círculo numérico se houver ao menos 1 filtro ativado na esteira */}
          {totalFiltrosAtivos > 0 && (
            <span style={{ background: "#ef4444", color: "white", fontSize: "10px", padding: "1px 5px", borderRadius: "10px", fontWeight: "bold" }}>
              {totalFiltrosAtivos}
            </span> // -> Círculo vermelho dinâmico indicando o volume de filtros cruzados ativos na esteira.
          )}
        </button> {/* -> Encerra o botão de acionamento da gaveta. */}

        {/* GATILHO DO MODAL: + NOVA COBRANÇA */}
        <button 
          type="button" // -> Define o tipo do elemento como botão para estabilidade de eventos.
          onClick={aoAbrirModalCadastro} // -> Altera o estado para verdadeiro abrindo o pop-up flutuante de novas inserções. 
          style={{ 
            background: "#0f172a", // -> MUDANÇA SÓBRIA: Alterado do azul anterior para o Azul Escuro Profundo institucional da advocacia. 
            color: "white", // -> Texto em alta nitidez na cor branca.
            border: "none", // -> Remove contornos para manter o visual sólido plano.
            padding: "7px 14px", // -> Altura milimetricamente ajustada para casar com a linha de botões horizontais. 
            borderRadius: "6px", // -> Arredondamento corporativo estável de 6px.
            fontWeight: "700", // -> Negrito de destaque operacional sênior.
            fontSize: "12px", // -> Fonte em 12px mantendo a uniformidade densa da barra.
            cursor: "pointer", // -> Ponteiro indicador de clique ativo.
            display: "flex", // -> Flexbox para alinhar o ícone de adição e o texto interno.
            alignItems: "center", // -> Centralização vertical absoluta dos textos.
            gap: "6px" // -> Distanciamento interno do ícone de 6px.
          }}
        >
          <span>+</span> {/* -> Texto mestre do comando de novas inclusões de devedores. */}
        </button> {/* -> Encerra o botão de disparo de inclusões. */}

      </div> {/* -> Encerra o agrupador flexbox da ala direita de ferramentas. */}
    </div> // -> Encerra o contêiner mestre horizontal da Toolbar.
  );
}