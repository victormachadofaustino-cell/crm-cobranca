import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import { LayoutDashboard, Columns3, CircleDollarSign, CalendarCheck2, Folder } from "lucide-react"; // -> Importa as ferramentas de ícones finos e sóbrios da biblioteca Lucide sem erros de compilação.

export default function Header({ abaAtiva, aoMudarAba, aoLogof }) { // -> Define e exporta o componente mestre de navegação superior recebendo os estados de aba ativa e gatilhos do maestro.
  // -> CONFIGURAÇÃO DE MENUS FINTECH: Matriz mestre que pareia cada rota técnica a seu respectivo componente gráfico do Lucide.
  const menusGlobais = [ // -> Configuração estável da matriz contendo os módulos de entrada do sistema.
    { id: "crm", nome: "CRM", IconeComponente: Columns3 }, // -> Módulo CRM: Vincula o painel comercial de raias ao componente geométrico de 3 colunas finas.
    { id: "dashboard", nome: "Dashboard", IconeComponente: LayoutDashboard }, // -> Módulo Dashboard: Vincula a central de BI ao ícone sóbrio de painel de indicadores.
    { id: "financeiro", nome: "Cobranças", IconeComponente: CircleDollarSign }, // -> MUDANÇA ESTRATÉGICA: Ajustado o nome para Cobranças para alinhar perfeitamente com o fluxo do importador de planilhas de Aging.
    { id: "tarefas", nome: "Tarefas", IconeComponente: CalendarCheck2 }, // -> Módulo Tasks: Vincula o cronograma de ocorrências ao ícone fino de calendário de auditoria.
    { id: "cadastros", nome: "Cadastros", IconeComponente: Folder } // -> Módulo Cadastros: Vincula a central de PJs e elos ao ícone executivo de pasta em linhas finas.
  ]; // -> Encerra a matriz de menus globais estáveis atualizada com suporte a componentes Lucide.

  return ( // -> Inicia o retorno do componente visual que desenha a barra de topo permanente no navegador.
    <header 
      style={{ 
        width: "100%", // -> Força a barra superior a ocupar a largura total horizontal da página.
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
            const Icone = menu.IconeComponente; // -> Isola dinamicamente o componente gráfico do Lucide correspondente à aba.

            return ( // -> Retorna o botão individual formatado para cada item de menu.
              <button
                key={menu.id} // -> Chave única de rastreio exigida pelo React para controle de nós.
                type="button" // -> Especificação do tipo de botão nativo para blindagem de cliques espúrios.
                onClick={() => aoMudarAba(menu.id)} // -> Dispara o aviso para o maestro trocar de tela na mesma hora.
                style={{
                  background: estaAtivo ? "#1e293b" : "none", // -> Destaca o botão com fundo cinza escuro se estiver ativo.
                  color: estaAtivo ? "#ffffff" : "#94a3b8", // -> MUDANÇA SÓBRIA: Texto branco sólido se ativo, ou cinza estável se inativo.
                  border: estaAtivo ? "1px solid #334155" : "1px solid transparent", // -> Borda discreta de contorno se ativo.
                  padding: "6px 12px", // -> Ajustado o preenchimento interno para centralização confortável de ícones finos.
                  borderRadius: "4px", // -> Arredondamento sutil de 4px padrão corporativo.
                  fontSize: "12px", // -> Fonte recalibrada para 12px ideal para leitura ágil.
                  fontWeight: "700", // -> Peso de fonte em negrito denso estruturado.
                  cursor: "pointer", // -> Mouse em formato de ponteiro de clique interativo.
                  display: "flex", // -> Ativa flexbox interno para alinhar o ícone geométrico e o texto lado a lado.
                  alignItems: "center", // -> Centraliza na vertical o ícone e o texto do menu.
                  gap: "6px", // -> Cria um espaçamento técnico e elegante de 6px entre o ícone do Lucide e o texto.
                  transition: "all 0.2s ease" // -> Efeito visual suave ao passar o mouse em cima.
                }}
              >
                <Icone size={14} strokeWidth={2} /> {/* -> Renderiza dinamicamente o ícone do Lucide em tamanho enxuto 14 e traço fino regular de espessura 2. */}
                <span>{menu.nome}</span> {/* -> Escreve o texto limpo da aba, agora totalmente higienizado e sem espaços manuais. */}
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