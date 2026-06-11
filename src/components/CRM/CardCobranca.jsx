import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function CardCobranca({ card, colunaId, aoIniciarArrasto, aoDeletar, aoClicarCard }) { // -> Define e exporta la função do cartão recebendo as informações da dívida, a raia ativa e as funções de controle do mestre.
  // -> Transforma o saldo devedor vindo do banco em um número decimal limpo para evitar quebras.
  const valorNum = parseFloat(card.valorVencido) || 0; // -> Faz a higienização do número monetário para a formatação decimal em reais.

  // -> CONFIGURADOR DE MUTAR COR DE BORDA BASEADO NO VEREDITO COMERCIAL DO SCRIPT
  const obterCorBordaEsquerda = () => { // -> Determina reativamente o tom do friso lateral de acordo com o substatus e calha.
    if (card.subStatus === "sucesso") return "#10b981"; // -> Friso verde-esmeralda caso o acordo tenha sido homologado com sucesso.
    if (card.subStatus === "insucesso") return "#ef4444"; // -> Friso vermelho-alerta caso a conta tenha sido despachada para o jurídico contencioso.
    return colunaId === "finalizado" ? "#10b981" : "#0f172a"; // -> Mantém verde se estiver na calha final comum ou Azul Escuro Profundo sóbrio para as fases anteriores.
  }; // -> Encerra o seletor de cores da borda.

  return ( // -> Inicia o retorno do componente visual que desenha o cartão do devedor no quadro Kanban.
    <div
      draggable // -> Habilita a física de flutuação e arrasto nativa do navegador neste elemento. 
      onDragStart={(e) => aoIniciarArrasto(e, card.id, colunaId)} // -> Disparado no instante em que o operador pinça o card com o mouse. 
      onClick={() => aoClicarCard(card, valorNum)} // -> Ouve quando o operador clica na superfície branca do cartão para abrir o prontuário. 
      style={{
        background: "#ffffff", // -> Fundo branco impecável do cartão de faturamento. 
        padding: "12px", // -> COMPACTAÇÃO DE ESPAÇO: Reduzido de 16px para 12px para otimização tridimensional das raias do funil. 
        borderRadius: "6px", // -> Cantos suavizados em 6px padrão executivo. 
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)", // -> Micro-sombra minimalista sutil e elegante. 
        border: "1px solid #e2e8f0", // -> Contorno cinza claro de proteção estrutural. 
        borderLeft: `4px solid ${obterCorBordaEsquerda()}`, // -> MUTAÇÃO LÓGICA: Aplica dinamicamente a cor da borda baseado no sucesso, insucesso ou raia ativa.
        display: "flex", // -> Ativa o alinhamento flexível interno para divisão de blocos. 
        flexDirection: "column", // -> Organiza as linhas de dados empilhadas de cima para baixo. 
        gap: "6px", // -> Espaçamento interno calibrado para acomodar os novos badges técnicos sem estouro. 
        cursor: "grab", // -> Muda o ponteiro do mouse para mão aberta indicando que o objeto é arrastável. 
      }}
    >
      
      {/* LINHA 1: CÓDIGO DO CLIENTE AND VALOR MONETÁRIO FORMATADO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}> {/* -> Alinhador horizontal das informações do topo do cartão. */}
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", background: "#f1f5f9", padding: "2px 5px", borderRadius: "4px" }}> {/* -> Define a mini etiqueta cinza quadrada do código identificador. */}
          ID: {card.codigo} {/* -> Exibe o número identificador da conta judicial em caixa cinza compacta. */}
        </span> {/* -> Encerra a etiqueta do identificador. */}
        <span style={{ fontSize: "12px", fontWeight: "800", color: card.subStatus === "sucesso" ? "#10b981" : "#0f172a" }}> {/* -> Muda a cor do preço para verde se o caso for ganho. */}
          R$ {valorNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* -> Formata o preço em formato de moeda nacional de forma reativa. */}
        </span> {/* -> Encerra o texto do saldo financeiro. */}
      </div> {/* -> Encerra o alinhador horizontal superior. */}

      {/* LINHA 2: RAZÃO SOCIAL DA EMPRESA DEVEDORA HIGIENIZADA */}
      <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#1e293b", margin: "1px 0", textTransform: "uppercase", textAlign: "left", lineHeight: "1.3" }}> {/* -> Fonte reduzida para 11px em caixa alta para manter o rigor técnico. */}
        {card.cliente} {/* -> Cospe a Razão Social da carteira vinda da nuvem do banco de dados após a migração. */}
      </h3> {/* -> Encerra o título do nome do cliente. */}

      {/* LINHA DE BADGES TÉCNICOS: RENDERIZAÇÃO REATIVA DE ACORDOS PRICE E TAREFAS PENDENTES */}
      {((card.proposta?.qtdParcelas && card.proposta.qtdParcelas > 1) || (card.tarefas && card.tarefas.length > 0)) && ( // -> Verifica se há dados de simulação ou ações agendadas antes de desenhar a fileira.
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}> {/* -> Contêiner flexível alinhador de pílulas informativas. */}
          
          {/* BADGE FINANCEIRO: Mostra o fracionamento Price do acordo ativo direto no cartão */}
          {card.proposta?.qtdParcelas && card.proposta.qtdParcelas > 1 && (
            <span style={{ fontSize: "9px", fontWeight: "800", background: "#eff6ff", color: "#1e40af", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bfdbfe", textTransform: "uppercase" }}>
              📊 Acordo: {card.proposta.qtdParcelas}x
            </span>
          )}

          {/* BADGE DE EXECUÇÃO: Mostra o número de ocorrências e retornos pendentes na esteira */}
          {card.tarefas && card.tarefas.length > 0 && (
            <span style={{ fontSize: "9px", fontWeight: "800", background: "#f8fafc", color: "#475569", padding: "2px 6px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>
              📋 Ocorrências: {card.tarefas.length}
            </span>
          )}
          
        </div>
      )}

      {/* LINHA 3: OPERADOR RESPONSÁVEL E LIXEIRA DE DELEÇÃO PERMANENTE */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#64748b", fontWeight: "600", marginTop: "2px" }}> {/* -> Alinhador horizontal do rodapé do cartão com fonte compactada em 10px. */}
        <span style={{ color: card.subStatus ? "#94a3b8" : "#64748b" }}>👤 {card.responsavel || "Sem operador"}</span> {/* -> Exibe o crachá do preposto cobrador suavizando o tom caso o caso já esteja arquivado. */}
        <button
          type="button" // -> Especifica o tipo como botão nativo para blindagem de cliques falsos.
          onClick={(e) => {
            e.stopPropagation(); // -> Trava de segurança: impede que o clique dispare a abertura do prontuário por acidente. 
            aoDeletar(card.id, card.cliente); // -> Dispara a ordem de trituração segura para o mestre App.jsx. 
          }}
          style={{
            background: "none", // -> Remove fundos cinzas padrão de botões. 
            border: "none", // -> Remove contornos antigos para visual minimalista plano. 
            color: "#94a3b8", // -> Cor cinza neutra de descanso para o ícone. 
            cursor: "pointer", // -> Transforma o mouse em mãozinha de clique interativo. 
            fontSize: "12px", // -> Tamanho milimetricamente calibrado. 
            fontWeight: "bold", // -> Dá destaque estrutural ao desenho da lixeira. 
            padding: 0, // -> Zera preenchimentos espúrios de botão.
          }}
          title="Deletar cobrança permanentemente do Firebase" // -> Legenda explicativa flutuante em português ao pairar o mouse.
        >
          🗑️
        </button> {/* -> Encerra o botão de descarte em ícone minimalista. */}
      </div> {/* -> Encerra o alinhador horizontal do rodapé do cartão. */}
    </div> // -> Encerra o contêiner estrutural do cartão do devedor.
  );
}