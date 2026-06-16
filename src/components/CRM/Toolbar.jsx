import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export function Toolbar({ visaoAtual, aoMudarVisao, aoAbrirModalCadastro, aoAbrirGavetaFiltros, totalFiltrosAtivos = 0, exibirArquivados = false, aoAlternarArquivados }) { // -> Define a função mestre que desenha a barra de ferramentas recebendo os estados de controle do mestre App.jsx.
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
            padding: "6px 14px", // -> Espaçamento interno calibrado para compactação tridimensional do layout. 
            borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo sério.
            fontSize: "13px", // -> Fonte recalibrada para densidade ideal para rotinas fiscais.
            fontWeight: "700", // -> Peso de fonte destacado para leitura imediata da aba.
            color: visaoAtual === "kanban" ? "#ffffff" : "#475569", // -> Texto branco no fundo escuro, ou cinza ardósia corporativo no fundo claro. 
            cursor: "pointer", // -> Transforma a seta do mouse em ponteiro de clique interativo.
            display: "flex", // -> Ativa flexbox interno para centralização geométrica perfeita do ícone.
            alignItems: "center", // -> Centraliza verticalmente o ícone interno.
            justifyContent: "center", // -> Centraliza horizontalmente o ícone interno.
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
            padding: "6px 14px", // -> Espaçamento interno calibrado para compactação tridimensional do layout. 
            borderRadius: "6px", // -> Cantos arredondados de 6px padrão executivo sério.
            fontSize: "13px", // -> Fonte recalibrada para densidade ideal para rotinas fiscais.
            fontWeight: "700", // -> Peso de fonte destacado para leitura imediata da aba.
            color: visaoAtual === "tabela" ? "#ffffff" : "#475569", // -> Texto branco no fundo escuro, ou cinza ardósia corporativo no fundo claro. 
            cursor: "pointer", // -> Transforma a seta do mouse em ponteiro de clique interativo.
            display: "flex", // -> Ativa flexbox interno para centralização geométrica perfeita do ícone.
            alignItems: "center", // -> Centraliza verticalmente o ícone interno.
            justifyContent: "center", // -> Centraliza horizontalmente o ícone interno.
            transition: "all 0.2s ease" // -> Transição suave de cores ao chavear os cliques.
          }}
        >
          📋
        </button> {/* -> Encerra o botão alternador da planilha executiva. */}

      </div> {/* -> Encerra o contêiner esquerdo de alternadores de visão. */}

      {/* SEÇÃO DA DIREITA: FILTROS AVANÇADOS, BOTÃO DE ALTERNÂNCIA DO LIMBO E NOVO PROTOCOLO */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}> {/* -> Alinhador horizontal com espaçamento otimizado para 8px. */}
        
        {/* BOTÃO TOGGLE PREMIUM: Transforma-se em Ícone-Puro (Icon-Only) de arquivo aberto/fechado conforme o estado do Limbo */}
        <button
          type="button" // -> Define o tipo como botão padrão estável del sistema.
          onClick={() => aoAlternarArquivados && aoAlternarArquivados(!exibirArquivados)} // 🛠️ FIÇÃO CORRIGIDA: Casado perfeitamente o gatilho reativo com a propriedade 'aoAlternarArquivados' para estancar quebras lógicas.
          style={{
            background: exibirArquivados ? "#0f172a" : "#ffffff", // -> Fica escuro se o limbo estiver à vista, ou branco se a esteira limpa estiver ativa.
            color: exibirArquivados ? "#ffffff" : "#475569", // -> Elementos internos brancos ou cinza ardósia dependendo do estado do interruptor.
            border: exibirArquivados ? "1px solid #0f172a" : "1px solid #cbd5e1", // -> Casamento simétrico de contorno de bordas corporativas.
            padding: "6px 14px", // -> Altura padrão unificada de ferramentas do CRM.
            borderRadius: "6px", // -> Arredondamento corporativo estável de 6px.
            fontWeight: "700", // -> Força do texto em modo negrito sênior.
            fontSize: "13px", // -> Uniformizado em 13px para manter consistência com o grid esquerdo.
            cursor: "pointer", // -> Ponteiro indicador de clique ativo.
            display: "flex", // -> Alinhador flexbox interno para centralização perfeita.
            alignItems: "center", // -> Centralização vertical absoluta dos elementos.
            justifyContent: "center", // -> Centralização horizontal estrita para botões baseados apenas em ícones.
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)", // -> Micro-sombra protetiva de profundidade de interface.
            transition: "all 0.2s ease" // -> Transição suave de cor de preenchimento ao clicar.
          }}
          title={exibirArquivados ? "Exibindo Arquivos Mortos - Clique para voltar à esteira ativa" : "Exibindo Cards Ativos - Clique para visualizar o Limbo de Arquivados"} // -> Tooltip flutuante explicativa em português que aparece ao passar o mouse.
        >
          {/* MUDANÇA ESTÉTICA COMPLETA: Removido todo o texto poluído. Exibe a gaveta aberta/envelope aberto se ativo, ou a pasta fechada/envelope fechado se inativo */}
          <span>{exibirArquivados ? "📂 Limbo" : "📁 Limbo"}</span> 
        </button>

        {/* GATILHO DA GAVETA DE FILTROS SIMULTÂNEOS */}
        <button 
          type="button" // -> Define o tipo do elemento como botão para evitar disparos falsos de submit.
          onClick={aoAbrirGavetaFiltros} // -> Aciona o aparecimento reativo da barra lateral direita de filtros.
          style={{ 
            background: "#ffffff", // -> Fundo branco limpo.
            color: "#475569", // -> Texto cinza corporativo estável.
            border: "1px solid #cbd5e1", // -> Contorno suave de limitação.
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
          <span>🔍 Filtros</span> {/* -> Legenda do comando da gaveta de buscas. */}
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
            padding: "6px 16px", // -> Altura milimetricamente ajustada para casar com a linha de botões horizontais. 
            borderRadius: "6px", // -> Arredondamento corporativo estável de 6px.
            fontWeight: "800", // -> Negrito de destaque operacional sênior.
            fontSize: "12px", // -> Fonte em 12px mantendo a uniformidade densa da barra.
            cursor: "pointer", // -> Ponteiro indicador de clique ativo.
            display: "flex", // -> Flexbox para alinhar o ícone de adição e o texto interno.
            alignItems: "center", // -> Centralização vertical absoluta dos textos.
            gap: "6px", // -> Distanciamento interno do ícone de 6px.
            height: "30px", // -> Fixada altura simétrica para travar o barramento visual.
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)" // -> Sombra sutil executiva.
          }}
          title="Cadastrar Nova Cobrança no Funil" // -> Dica de tela para o acionador de inclusões de dívidas.
        >
          <span>+ Nova Cobrança</span> {/* -> Texto mestre do comando de novas inclusões de devedores. */}
        </button> {/* -> Encerra o botão de disparo de inclusões. */}

      </div> {/* -> Encerra o agrupador flexbox da ala direita de ferramentas. */}
    </div> // -> Encerra o contêiner mestre horizontal da Toolbar.
  );
}