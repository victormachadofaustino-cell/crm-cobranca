// Importa a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import React from "react"; 
// Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.
import { Layers, ClipboardList, User, Archive, ArchiveRestore } from "lucide-react"; 

// Define e exporta a função do cartão recebendo as informações da dívida, a raia ativa e as funções de controle do mestre.
export default function CardCobranca({ card, colunaId, aoIniciarArrasto, aoDeletar, aoClicarCard, exibirArquivados = false }) { 
  // Transforma o saldo devedor vindo do banco em um número decimal limpo para evitar quebras de amostragem.
  const valorNum = parseFloat(card.valorVencido) || 0; 

  // Reposicionamento cirúrgico anti-falhas: Declarado no topo absoluto interno para estancar o ReferenceError e registrar a fiação na memória RAM antes do return.
  const obterCorBordaEsquerda = () => { 
    // Determina reativamente o tom do friso lateral de acordo com o substatus e calha do pipeline.
    if (card.subStatus === "sucesso") return "#10b981"; // Friso verde-esmeralda caso o acordo tenha sido homologado com sucesso de recebíveis.
    if (card.subStatus === "insucesso") return "#ef4444"; // Friso vermelho-alerta caso a conta tenha sido despachada para o contencioso judicial.
    // Mantém verde se estiver na calha final ou Azul Escuro Profundo sóbrio corporativo para as raias anteriores.
    return colunaId === "finalizado" ? "#10b981" : "#0f172a"; 
  }; // Encerra o seletor de cores de friso lateral.

  // Inicia o retorno do componente visual que desenha o cartão do devedor no quadro Kanban após memorizar suas diretrizes lógicas.
  return ( 
    <div
      draggable // Habilita a física de flutuação e arrastar-e-soltar nativa do navegador neste elemento. 
      onDragStart={(e) => aoIniciarArrasto(e, card.id, colunaId)} // Disparado no instante em que o operador segura o card com o clique do mouse. 
      onClick={() => aoClicarCard(card, valorNum)} // Ouve quando o operador clica na área interna branca do cartão para expandir o prontuário 360. 
      style={{
        background: "#ffffff", // Fundo branco limpo impecável do cartão de faturamento. 
        padding: "12px", // Compactação de espaço: Reduzido de 16px para 12px para otimização tridimensional das raias do funil. 
        borderRadius: "6px", // Cantos suavizados em 6px padrão executivo moderno. 
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)", // Micro-sombra minimalista sutil e elegante de profundidade. 
        border: "1px solid #e2e8f0", // Contorno cinza claro de proteção estrutural de bordas. 
        borderLeft: `4px solid ${obterCorBordaEsquerda()}`, // Mutação lógica consolidada: Aplica com segurança a cor do friso, agora carregando a função sem travamentos de console.
        display: "flex", // Ativa o alinhamento flexível interno para divisão harmônica de blocos. 
        flexDirection: "column", // Organiza as linhas de dados empilhadas verticalmente de cima para baixo. 
        gap: "6px", // Espaçamento interno calibrado para acomodar os novos badges técnicos sem estouros de margem. 
        cursor: "grab", // Muda o ponteiro do mouse para mão aberta indicando que o objeto pode ser arrastado no pipeline. 
      }}
    >
      
      {/* LINHA 1: CÓDIGO DO CLIENTE E VALOR MONETÁRIO FORMATADO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}> {/* Alinhador horizontal das informações do topo do cartão. */}
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", background: "#f1f5f9", padding: "2px 5px", borderRadius: "4px" }}> {/* Define a mini etiqueta cinza quadrada do código identificador. */}
          ID: {card.codigo} {/* Exibe o número identificador da conta judicial em caixa cinza compacta. */}
        </span> {/* Encerra a etiqueta do identificador. */}
        <span style={{ fontSize: "12px", fontWeight: "800", color: card.subStatus === "sucesso" ? "#10b981" : "#0f172a" }}> {/* Muda a cor do preço para verde se o caso for ganho. */}
          R$ {valorNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* Formata o preço em formato de moeda nacional de forma reativa. */}
        </span> {/* Encerra o text do saldo financeiro. */}
      </div> {/* Encerra o alinhador horizontal superior. */}

      {/* LINHA 2: RAZÃO SOCIAL DA EMPRESA DEVEDORA HIGIENIZADA */}
      <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", margin: "1px 0", textTransform: "uppercase", textAlign: "left", lineHeight: "1.3" }}> {/* Fonte reduzida para 11px em caixa alta para manter o rigor técnico. */}
        {card.cliente} {/* Cospe a Razão Social da carteira vinda da nuvem do banco de dados após a migração. */}
      </h3> {/* Encerra o título do nome do cliente. */}

      {/* LINHA DE BADGES TÉCNICOS: RENDERIZAÇÃO REATIVA DE ACORDOS PRICE E TAREFAS PENDENTES */}
      {((card.proposta?.qtdParcelas && card.proposta.qtdParcelas > 1) || (card.tarefas && card.tarefas.length > 0)) && ( // Verifica se há dados de simulação ou ações agendadas antes de desenhar a fileira.
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}> {/* Contêiner flexível alinhador de pílulas informativas. */}
          
          {/* BADGE FINANCEIRO: Mostra o fracionamento Price do acordo ativo direto no cartão */}
          {card.proposta?.qtdParcelas && card.proposta.qtdParcelas > 1 && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", fontWeight: "800", background: "#eff6ff", color: "#1e40af", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bfdbfe", textTransform: "uppercase" }}>
              <Layers size={10} strokeWidth={2.5} /> {/* Injeta o componente vetorial de camadas vazadas do Lucide substituindo o antigo emoji de barras coloridas. */}
              <span>Acordo: {card.proposta.qtdParcelas}x</span>
            </span>
          )}

          {/* BADGE DE EXECUÇÃO: Mostra o número de ocorrências e retornos pendentes na esteira */}
          {card.tarefas && card.tarefas.length > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", fontWeight: "800", background: "#f8fafc", color: "#475569", padding: "2px 6px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>
              <ClipboardList size={10} strokeWidth={2.5} /> {/* Injeta o componente sutil de linhas de log do Lucide no lugar da antiga prancheta escolar. */}
              <span>Ocorrências: {card.tarefas.length}</span>
            </span>
          )}
          
        </div>
      )}

      {/* LINHA 3: OPERADOR RESPONSÁVEL E BOTÃO MINIMALISTA DE ARQUIVAMENTO INTEGRADO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#64748b", fontWeight: "600", marginTop: "2px" }}> {/* Alinhador horizontal do rodapé do cartão com fonte compactada em 10px. */}
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: card.subStatus ? "#94a3b8" : "#64748b" }}>
          <User size={11} strokeWidth={2} style={{ color: "#94a3b8" }} /> {/* Troca a silhueta antiga pelo vetor fino e geométrico de perfil do usuário. */}
          <span>{card.responsavel || "Sem operador"}</span> {/* Exibe o crachá do preposto cobrador suavizando o tom caso o caso já esteja arquivado. */}
        </span>
        
        <button
          type="button" // Especifica o tipo como botão nativo para blindagem de cliques falsos.
          onClick={(e) => {
            e.stopPropagation(); // Trava de segurança: impede que o clique dispare a abertura do prontuário por acidente. 
            aoDeletar(card.id, card.cliente); // Dispara a ordem de arquivamento no limbo seguro do ClickUp para o mestre App.jsx. 
          }}
          style={{
            background: "none", // Remove fundos cinzas padrão de botões. 
            border: "none", // Remove contornos antigos para visual minimalista plano. 
            color: "#94a3b8", // Cor cinza neutra de descanso para o ícone da pasta. 
            cursor: "pointer", // Transforma o mouse em mãozinha de clique interativo. 
            display: "flex", // Alinhamento flexbox interno.
            alignItems: "center", // Centraliza verticalmente o vetor.
            justifyContent: "center", // Centraliza horizontalmente o vetor.
            padding: 0, // Zera preenchimentos espúrios de botão.
            transition: "color 0.15s ease" // Transição de hover sutil.
          }}
          title={exibirArquivados ? "Desarquivar este card e mandar para esteira ativa" : "Arquivar este card (Ocultar da esteira ativa)"} // Legenda explicativa premium contextual baseada no estado ativo da esteira.
        >
          {/* MUTAÇÃO VETORIAL REATIVA EM CARD: Substitui de forma estrita o antigo emoji de pasta colorida pelos componentes monocromáticos sóbrios do Lucide */}
          {exibirArquivados ? (
            <ArchiveRestore size={13} strokeWidth={2} style={{ color: "#2563eb" }} /> // Vetor fino de resgate/extração azul se o card estiver posicionado dentro do Limbo.
          ) : (
            <Archive size={13} strokeWidth={2} style={{ color: "#94a3b8" }} /> // Vetor fino de caixa organizadora neutra se o card estiver navegando na esteira operacional ativa.
          )}
        </button>
      </div> {/* Encerra o alinhador horizontal do rodapé do cartão. */}
    </div> // Encerra o contêiner estrutural do cartão do devedor.
  );
}