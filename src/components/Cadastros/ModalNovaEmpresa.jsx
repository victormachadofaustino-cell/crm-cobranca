import React from "react"; // -> Traz a biblioteca nativa do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function ModalNovaEmpresa({ aberto, aoFechar, tratarCadastroEmpresa, empCodigo, setEmpCodigo, empNome, setEmpNome, empCnpj, setEmpCnpj, empIsFilial, setEmpIsFilial, empSegmento, setEmpSegmento, empEndereco, setEmpEndereco, empCep, setEmpCep, listaSegmentos = [] }) { // -> Define e exporta o componente recebendo os estados de monitoração de digitação do maestro e a lista viva de segmentos do Firebase.
  if (!aberto) return null; // -> TRAVA DE SEGURANÇA: Se o maestro disser que o modal não deve aparecer, retorna nulo e não renderiza nada no HTML.

  return ( // -> Desenha a interface flutuante do modal na tela.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", zIndex: 6000, display: "flex", justifyContent: "center", alignItems: "center" }}> {/* -> Cortina escura de fundo configurada com opacidade suave para isolar visualmente as planilhas de fundo. */}
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "480px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}> {/* -> Cartão branco otimizado com bordas executivas de 8px e trava antiqueda de estouro de tela. */}
        
        {/* TOPO DO MODAL: TÍTULO INSTITUCIONAL Y BOTÃO FECHAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}> {/* -> Alinhador horizontal compacto do cabeçalho do modal flutuante. */}
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>🏢 Registro de Assistido / Empresa</h3> {/* -> Título institucional denso em caixa alta para manter o rigor técnico. */}
          <button type="button" onClick={aoFechar} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8", fontWeight: "bold", padding: 0 }}>&times;</button> {/* -> Ícone puro de fechamento em formato de 'X' sem textos poluentes. */}
        </div> {/* -> Encerra o contêiner do cabeçalho superior. */}

        {/* CORPO DO FORMULÁRIO JURÍDICO */}
        <form onSubmit={tratarCadastroEmpresa} style={{ display: "flex", gap: "12px", flexDirection: "column" }}> {/* -> Abre o formulário organizando a fiação de inputs empilhados verticalmente de forma densa. */}
          
          {/* LINHA DUPLA: CÓDIGO CONTA E SELEÇÃO FILIAL */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> {/* -> Alinhador flexbox responsivo lado a lado para otimização de espaço em tela. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Coluna ajustável dedicada ao código de identificação da conta judicial. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CÓDIGO CONTA *</label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório. */}
              <input type="text" required placeholder="Ex: 1022" value={empCodigo} onChange={(e) => setEmpCodigo(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Entrada de texto higienizada com fonte densa de 12px. */}
            </div> {/* -> Fim da coluna do código. */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "18px" }}> {/* -> Coluna alinhadora centralizada para a marcação da unidade. */}
              <input type="checkbox" id="checkFilial" checked={empIsFilial} onChange={(e) => setEmpIsFilial(e.target.checked)} style={{ width: "14px", height: "14px", cursor: "pointer" }} /> {/* -> Caixa de marcação booleana para chaveamento de Matriz e Filial. */}
              <label htmlFor="checkFilial" style={{ fontSize: "11px", fontWeight: "700", color: "#334155", cursor: "pointer" }}>REGISTRO FILIAL</label> {/* -> Rótulo clicável alinhado ao padrão técnico de 11px. */}
            </div> {/* -> Fim da coluna de marcação. */}
          </div> {/* -> Fim da linha dupla superior. */}

          {/* CAMPO: RAZÃO SOCIAL */}
          <div style={{ display: "flex", flexDirection: "column" }}> {/* -> Alinhador vertical em lote para o campo de nome corporativo. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>RAZÃO SOCIAL *</label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório. */}
            <input type="text" required placeholder="Ex: Alfa Transportes LTDA" value={empNome} onChange={(e) => setEmpNome(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto livre para digitação do nome oficial da empresa cliente. */}
          </div> {/* -> Fim do campo de razão social. */}

          {/* LINHA DUPLA RECONFIGURADA: CNPJ E SELECT DINÂMICO DE SEGMENTOS */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> {/* -> Alinhador flexbox duplo para campos secundários corporativos. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Coluna flexível para inserção da numeração cadastral do Ministério da Fazenda. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CNPJ DO CLIENTE *</label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório. */}
              <input type="text" required placeholder="00.000.000/0000-00" value={empCnpj} onChange={(e) => setEmpCnpj(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto do documento CNPJ sem quebras de layout. */}
            </div> {/* -> Fim da coluna do CNPJ. */}
            
            {/* INVERSÃO DE LÓGICA CONSOLIDADA: DROPDOWN DINÂMICO CONECTADO À COLEÇÃO CADASTROS_SEGMENTOS */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Coluna flexível dedicada ao seletor de metadados de mercado. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>SEGMENTO</label> {/* -> Rótulo informativo cinza neutro. */}
              <select 
                value={empSegmento} 
                onChange={(e) => setEmpSegmento(e.target.value)} 
                style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#ffffff", fontWeight: "700", cursor: "pointer" }} // -> Menu dropdown corporativo denso configurado em 12px.
              >
                <option value="">-- Setor Não Definido --</option> {/* -> Opção nula inicial padrão caso o assistido não tenha nicho específico. */}
                {listaSegmentos.map((seg) => ( // -> Realiza o laço reativo mapeando os documentos guardados na coleção cadastros_segmentos real.
                  <option key={seg.id} value={seg.nome}>{seg.nome}</option> // -> Renderiza o nome do setor parametrizado de forma viva puxando a ID NoSQL.
                ))}
              </select> {/* -> Encerra a caixa de seleção dinâmica. */}
            </div> {/* -> Fim da coluna de segmento relacional. */}
          </div> {/* -> Fim da linha dupla intermediária. */}

          {/* LINHA DUPLA: ENDEREÇO E CEP */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> {/* -> Alinhador flexbox duplo para dados de localização e citações. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 2 }}> {/* -> Ocupa dois terços da proporção horizontal da linha para abrigar o logradouro completo. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>ENDEREÇO COMPLETO</label> {/* -> Rótulo informativo cinza neutro. */}
              <input type="text" placeholder="Av. Paulista, 1000" value={empEndereco} onChange={(e) => setEmpEndereco(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto livre alocando rua, número e bairro do assistido. */}
            </div> {/* -> Fim da coluna de endereço. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Ocupa um terço restante da proporção horizontal para o código postal CEP. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CEP</label> {/* -> Rótulo informativo cinza neutro. */}
              <input type="text" placeholder="00000-000" value={empCep} onChange={(e) => setEmpCep(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto para alocação de localização postal. */}
            </div> {/* -> Fim da coluna do CEP. */}
          </div> {/* -> Fim da linha dupla de endereçamento. */}

          {/* RODAPÉ DO MODAL: CONTROLES DE SUBMISSÃO OU REJEIÇÃO */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}> {/* -> Adicionado traço de divisão sutil e padding superior para otimização visual sóbria. */}
            <button type="button" onClick={aoFechar} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#475569" }}>Cancelar</button> {/* -> Botão sóbrio de recusa voluntária da operação em andamento. */}
            <button type="submit" style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "12px" }}>Gravar Registro</button> {/* -> Botão mestre de salvaguarda sólido Azul Escuro Profundo. */}
          </div> {/* -> Encerra o agrupador de botões do rodapé. */}

        </form> {/* -> Encerra a tag estrutural do formulário de inserções. */}
      </div> {/* -> Encerra o cartão interno branco do modal. */}
    </div> // -> Encerra o contêiner flutuante mestre de isolamento de tela.
  );
}