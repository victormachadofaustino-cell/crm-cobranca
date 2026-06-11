import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function Header({ abaAtiva, aoMudarAba, aoLogof }) { // -> Define e exporta o componente mestre de navegação superior recebendo os estados de aba ativa e gatilhos do maestro.
  // -> Lista oficial dos menus que você planejou para expandir a inteligência do DOCULOC.
  const menusGlobais = [ // -> Configuração estável da matriz contendo os módulos de entrada do sistema.
    { id: "crm", nome: " CRM " }, // -> Primeiro módulo: painel de raias e planilhas comerciais de faturamento.
    { id: "dashboard", nome: " Dashboard" }, // -> Segundo módulo: central estatística de cubos e metas.
    { id: "financeiro", nome: " Financeiro" }, // -> NOVO MÓDULO PLUGADO: Ativa o acesso direto ao painel de fluxo de caixa, alíquotas e baixas Price.
    { id: "tarefas", nome: " Tarefas" }, // -> Quarto módulo: cronograma de notificações processuais e retornos.
    { id: "cadastros", nome: " Cadastros" } // -> Quinto módulo: central de parametrização de assistidos e elos humanos.
  ]; // -> Encerra a matriz de menus globais estáveis atualizada.

  return ( // -> Inicia o retorno do componente visual que desenha a barra de topo permanente no navegador.
    <header 
      style={{ 
        width: "100%", 
        backgroundColor: "#0f172a", // -> Fundo escuro corporativo idêntico ao original preservado rigidamente. 
        padding: "0 20px", // -> Ajustado o espaçamento lateral para 20px para harmonizar com a Toolbar e as grades.
        height: "52px", // -> COMPACTAÇÃO DE ESPAÇO: Reduzido de 70px para 52px para liberar área útil vertical para os devedores.
        display: "flex", // -> Ativa o alinhamento flexível horizontal dos blocos internos.
        justifyContent: "space-between", // -> Alinha o logotipo na esquerda e o avatar na direita. 
        alignItems: "center", // -> Centraliza de forma absoluta todos os elementos na linha vertical.
        borderBottom: "1px solid #1e293b", // -> Linha sutil divisória inferior preservada. 
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)", // -> Sombra enxugada para manter o minimalismo limpo.
        boxSizing: "border-box" // -> Impede que as margens quebrem as dimensões da folha.
      }}
    >
      {/* SEÇÃO DA ESQUERDA: LOGOTIPO E MENUS GLOBAIS DE NAVEGAÇÃO */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}> {/* -> Agrupador flexbox esquerdo com gap compacto de 24px. */}
        
        {/* LOGOTIPO OFICIAL */}
        <div style={{ display: "flex", alignItems: "center" }}> {/* -> Alinhador horizontal do logotipo estável. */}
          <h1 style={{ color: "#ffffff", fontSize: "14px", fontWeight: "800", margin: 0, letterSpacing: "1px" }}> {/* -> MUDANÇA SÓBRIA: Alterado para Branco Puro com peso 800 e fonte de 14px de alta imponência executiva. */}
            ⚡ DOCULOC CENTRAL
          </h1> {/* -> Encerra o texto do logotipo oficial. */}
        </div> {/* -> Encerra o bloco do logotipo. */}

        {/* 🎛️ BARRA DE MENUS INTERATIVOS (MUDANÇA DE ABAS DO SISTEMA) */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}> {/* -> Espaçamento de navegação enxugado para 4px para otimizar space de clique. */}
          {menusGlobais.map((menu) => { // -> Executa o laço reativo varrendo as opções de menu mapeadas na memória ram.
            // -> Checa dinamicamente se este botão é a página que o usuário está visualizando agora.
            const estaAtivo = abaAtiva === menu.id; // -> Retorna verdadeiro se o ID do loop bater com a aba ativa do maestro.

            return ( // -> Retorna o botão individual formatado para cada item de menu.
              <button
                key={menu.id} // -> Chave única de rastreio exigida pelo React para controle de nós.
                type="button" // -> Especificação do tipo de botão nativo para blindagem de cliques espúrios.
                onClick={() => aoMudarAba(menu.id)} // -> Dispara o aviso para o maestro trocar de tela na mesma hora.
                style={{
                  background: estaAtivo ? "#1e293b" : "none", // -> Destaca o botão com fundo cinza escuro se estiver ativo.
                  color: estaAtivo ? "#ffffff" : "#94a3b8", // -> MUDANÇA SÓBRIA: Texto branco sólido se ativo, ou cinza estável se inativo.
                  border: estaAtivo ? "1px solid #334155" : "1px solid transparent", // -> Borda discreta de contorno se ativo.
                  padding: "4px 10px", // -> Preenchimento compactado para se adequar à nova altura de 52px.
                  borderRadius: "4px", // -> Arredondamento sutil de 4px padrão corporativo.
                  fontSize: "12px", // -> Fonte recalibrada para 12px ideal para leitura ágil.
                  fontWeight: "700", // -> Peso de fonte em negrito denso estruturado.
                  cursor: "pointer", // -> Mouse em formato de ponteiro de clique interativo.
                  transition: "all 0.2s ease", // -> Efeito visual suave ao passar o mouse em cima.
                }}
              >
                {menu.nome} {/* -> Cospe a string contendo o emoji e o título em português do botão. */}
              </button>
            );
          })}
        </nav>
      </div>

      {/* SEÇÃO DA DIREITA: AVATAR DO OPERADOR E BOTÃO LOGOUT */}
      <div style={{ display: "flex", alignItems: "center" }}> {/* -> Agrupador flexbox da ala direita da navegação. */}
        <div 
          onClick={aoLogof} // -> Executa a rotina de fechamento de turno seguro do Firebase Auth. 
          style={{ 
            width: "26px", // -> Diâmetro compactado de 32px para 26px para manter a simetria elegante.
            height: "26px", // -> Altura compactada correspondente.
            backgroundColor: "#475569", // -> MUDANÇA SÓBRIA: Alterado de azul para cinza ardósia Slate administrativo discreto. 
            color: "#ffffff", // -> Iniciais do operador em alta nitidez branca.
            borderRadius: "50%", // -> Arredondamento circular perfeito de 50%.
            display: "flex", // -> Flexbox interno para centralização das letras.
            alignItems: "center", // -> Alinhamento vertical central absoluto.
            justifyContent: "center", // -> Alinhamento horizontal central absoluto.
            fontWeight: "700", // -> Força de negrito estruturada.
            fontSize: "10px", // -> Tamanho de fonte reduzido para 10px compacto.
            cursor: "pointer", // -> Transforma o cursor do mouse em gatilho de clique ativo.
            border: "1px solid #ffffff", // -> Friso branco reduzido para 1px minimalista.
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)" // -> Sombra de profundidade suavizada.
          }} 
          title="Clique para encerrar seu turno com segurança" // -> Legenda técnica explicativa em português ao pairar o mouse.
        >
          VF {/* -> Iniciais fixas do operador do painel. */}
        </div> {/* -> Encerra o contêiner do avatar redondo de fechamento. */}
      </div> {/* -> Encerra o agrupador flexbox da ala direita do cabeçalho. */}

    </header> // -> Encerra o elemento semântico de cabeçalho do sistema.
  );
}