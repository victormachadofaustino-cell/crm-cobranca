import React from "react"; // -> Traz a biblioteca mestre do React de forma nativa para desenhar a interface na tela.
import { History, FolderMinus } from "lucide-react"; // -> Injeta os ícones geométricos vazados e finos do Lucide para ilustrar o cabeçalho e estados vazios de RAM.

export default function AbaHistorico({ card }) { // -> Declara e exporta a função especialista recebendo o objeto do devedor focado para expor suas notas.
  return ( // -> Renderiza o layout da linha do tempo analítica do Prontuário.
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}> {/* -> Container alinhado à esquerda com espaçamento de 10px entre os blocos de ocorrências. */}
      
      {/* 🏛️ CABEÇALHO DO BLOCO ANALÍTICO (ESTILO SÓBRIO DO ESCRITÓRIO) */}
      <h5 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 4px 0", fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        <History size={13} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Injeta o componente vetorial de relógio com contorno firme do Lucide[cite: 1]. */}
        <span>Linha do Tempo e Logs de Gravação de Lote</span> {/* -> Título técnico que indica a trilha de auditoria[cite: 1]. */}
      </h5>
      
      {/* 📜 AREA DE RENDERIZAÇÃO VERTICAL DE ATA (A LINHA DO TEMPO INDELÉVEL) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}> {/* -> Empilha os logs verticalmente com separação compacta de 6px[cite: 1]. */}
        
        {/* CONDICIONAL DE UX BRUTA: Se a matriz NoSQL de logs históricos vier vazia ou nula della nuvem[cite: 1]. */}
        {(card.historicoNotas || []).length === 0 ? ( 
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#94a3b8", padding: "16px", background: "#f8fafc", borderRadius: "6px", border: "1px dashed #cbd5e1", fontStyle: "italic" }}>
            <FolderMinus size={13} strokeWidth={2} /> {/* -> Injeta o componente de pasta vazia sutil em tom cinza outline[cite: 1]. */}
            <span>Nenhum histórico estruturado de minutas na fiação da conta.</span> {/* -> Mensagem didática para instruir o cobrador da mesa[cite: 1]. */}
          </div>
        ) : ( // -> Caso existam anotações fiscais ou logs automáticos, abre a esteira de renderização.
          
          // -> MOTOR REATIVO: Varre objeto por objeto da matriz de notas históricas ordenando do mais novo para o mais antigo[cite: 1].
          card.historicoNotas.map((nota, index) => ( 
            <div 
              key={index} // -> Chave identificadora indexada exigida pelo React para controle de performance da árvore virtual.
              style={{ 
                padding: "10px", 
                background: "#f8fafc", // -> Fundo cinza-claro contrastante de alta legibilidade corporativa.
                borderRadius: "6px", // -> Quinas suavizadas em 6px seguindo a identidade visual ClickUp do CRM.
                borderLeft: "3px solid #475569", // -> Borda lateral esquerda densa em tom cinza ardósia para simular as raias de linha do tempo.
                fontSize: "12px", // -> Fonte regular compacta de 12px ideal para leitura de relatórios densos.
                boxSizing: "border-box" // -> Trava antiqueda contra estouros de preenchimento de layout na tela[cite: 1].
              }}
            >
              {/* DESCRIÇÃO DA OCORRÊNCIA FINANCEIRA OU CADASTRAL */}
              <div style={{ color: "#1e293b", fontWeight: "600", lineHeight: "1.4" }}>
                {nota.conteudo} {/* -> Cospe reativamente o texto gravado pela inteligência do importador ou do financeiro[cite: 1]. */}
              </div>
              
              {/* CARIMBO DE DATA E HORA IMUTÁVEL DE AUDITORIA (COMPLIANCE) */}
              <div style={{ color: "#94a3b8", fontSize: "10px", marginTop: "4px", fontWeight: "700", textTransform: "uppercase" }}>
                🔒 Autenticado em: {nota.dataHora} {/* -> Rastro imutável do sistema carimbando o milésimo em que o operador executou a ação[cite: 1]. */}
              </div>
            </div> // -> Encerra o contêiner do log individual.
          )) // -> Encerra o loop map del histórico[cite: 1].
        )}
      </div>

    </div> // -> Encerra o contêiner geral da aba de histórico.
  );
}