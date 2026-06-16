import React from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar as sanfonas locais de cada etapa.

export default function TabelaCobranca({ cobrancas, aoClicarLinha, aoDeletar, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao, aoMudarStatusDireto, exibirArquivados = false }) { // -> RECALIBRADA: Recebe a flag de controle global do Limbo para chavear os ícones de ações da planilha de forma reativa.
  // -> CALCULO DE TOTALIZADOR GERAL: Varre toda a esteira de dados reativos e soma os valores brutos para o rodapé.
  const faturamentoTotalEsteira = cobrancas.reduce((acumulador, item) => acumulador + (parseFloat(item.valorVencido) || 0), 0); // -> Faz a somatória reativa de todo o pipeline financeiro em tempo real.

  // -> CONFIGURAÇÃO OFICIAL DE SEQUÊNCIA E PRIORIDADE DE CAIXA DO CLICKUP (FINALIZADO NO TOPO, INICIAR NA BASE)
  const colunasFunil = [
    { id: "finalizado", nome: "Finalizado / Quitado", corFundo: "#f0fdf4", corTexto: "#16a34a", corBorda: "#bbf7d0" }, // -> Quadrante do topo: Processos encerrados e liquidados com sucesso.
    { id: "cobranca", nome: "Cobrança Parcelada", corFundo: "#eff6ff", corTexto: "#1e40af", corBorda: "#bfdbfe" }, // -> Segundo quadrante: Recebimentos estruturados Price ativos.
    { id: "conta_corrente", nome: "Conta Corrente", corFundo: "#f0fdfa", corTexto: "#0d9488", corBorda: "#99f6e4" }, // -> Terceiro quadrante: Amortizações livres em conta corrente.
    { id: "acordo", nome: "Termo em Andamento", corFundo: "#fdf2f8", corTexto: "#be185d", corBorda: "#fbcfe8" }, // -> Quarto quadrante: Contratos em fase de assinatura fiscal.
    { id: "negociacao", nome: "Em Negociação", corFundo: "#fffbeb", corTexto: "#b45309", corBorda: "#fef3c7" }, // -> Quinto quadrante: Mesas de atrito e conciliação ativa.
    { id: "contato", nome: "Notificação Enviada", corFundo: "#faf5ff", corTexto: "#6b21a8", corBorda: "#e9d5ff" }, // -> Sexto quadrante: Devedores notificados eletronicamente.
    { id: "novo", nome: "A Iniciar", corFundo: "#f8fafc", corTexto: "#475569", corBorda: "#e2e8f0" } // -> Quadrante da base: Lotes novos intocados aguardando faturamento.
  ]; // -> Encerra a matriz de prioridade vertical do CRM.

  // -> MEMÓRIA RAM DO ACCORDION: Monitora eletronicamente quais etapas estão maximizadas (true) ou minimizadas (false).
  const [abasAbertas, setAbasAbertas] = React.useState({ finalizado: true, cobranca: true, conta_corrente: true, acordo: true, negociacao: true, contato: true, novo: true }); // -> Inicializa todos os blocos abertos por padrão para exibição inicial completa usando a declaração explícita do React.

  // -> OPERADOR DE ALTERNÂNCIA DE SANFONA (MINIMIZAR / MAXIMIZAR)
  const alternarSanfonaEtapa = (idEtapa) => { // -> Acionado ao clicar na linha do cabeçalho da etapa correspondente.
    setAbasAbertas((anterior) => ({
      ...anterior, // -> Preserva o estado de abertura das demais abas paralelas.
      [idEtapa]: !anterior[idEtapa] // -> Inverte o booleano da aba clicada (se estava aberto vira fechado).
    }));
  }; // -> Encerra a inversão de sanfona.

  // -> MOTOR AUXILIAR DE SOMA PARCIAL DE CAIXA POR ETAPA REAL
  const somarDinheiroDaEtapa = (idEtapa) => { // -> Varre a esteira isolando apenas os clientes daquela coluna específica.
    const filtrados = cobrancas.filter((item) => (item.status || "novo") === idEtapa); // -> Agrupa pelo status real do documento.
    return filtrados.reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Soma e retorna o saldo bruto em reais.
  };

  return ( // -> Inicia o retorno do componente visual que desenha a interface da planilha no navegador.
    <div style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box" }}>
      {/* 📑 CONTÊINER DA PLANILHA COMERCIAL */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          
          {/* 🧭 CABEÇALHO DA TABELA (TÍTULOS DAS COLUNAS COM REGRAS DE ORDENAÇÃO) */}
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("codigo")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "120px" }}>
                CÓDIGO CONTA {campoOrdenado === "codigo" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
              </th>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cliente")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}>
                EMPRESA / RAZÃO SOCIAL {campoOrdenado === "cliente" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
              </th>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("responsavel")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "200px" }}>
                OPERADOR RESPONSÁVEL {campoOrdenado === "responsavel" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
              </th>
              <th style={{ padding: "14px 20px", width: "200px" }}>
                ETAPA DO FUNIL (ALTERAR EM LINHA) {/* -> Indica que a célula agora é um comando ativo de transição de fase. */}
              </th>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("valorVencido")} style={{ padding: "14px 20px", textAlign: "right", cursor: "pointer", userSelect: "none", width: "160px" }}>
                SALDO VENCIDO {campoOrdenado === "valorVencido" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
              </th>
              <th style={{ padding: "14px 20px", textAlign: "center", width: "100px" }}>AÇÕES</th>
            </tr>
          </thead>

          {/* =========================================================================================
              🗂️ LOOP DE CORPOS DE TABELA: MAPEIA AS ETAPAS DO USUÁRIO VERTICALMENTE
              ========================================================================================= */}
          {colunasFunil.map((coluna) => {
            const linhasDestaEtapa = cobrancas.filter((item) => (item.status || "novo") === coluna.id); // -> Isola os devedores que pertencem rigorosamente a este bloco de status.
            const estaAberto = abasAbertas[coluna.id]; // -> Resgata da memória RAM se a sanfona deste ID está maximizada ou encolhida.
            const dinheiroEtapa = somarDinheiroDaEtapa(coluna.id); // -> Executa a somatória financeira parcial da raia.

            return (
              <tbody key={coluna.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                
                {/* 🔽 CABEÇALHO INTERATIVO DA SANFONA DE ETAPA (BARRA DE TÍTULO DO ACCORDION) */}
                <tr 
                  onClick={() => alternarSanfonaEtapa(coluna.id)} // -> Altera reativamente a visualização do bloco ao clicar na barra.
                  style={{ backgroundColor: coluna.corFundo, borderBottom: `1px solid ${coluna.corBorda}`, cursor: "pointer", userSelect: "none" }}
                >
                  <td colSpan="6" style={{ padding: "10px 20px", fontSize: "11px", fontWeight: "800", color: coluna.corTexto, textAlign: "left", letterSpacing: "0.5px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px" }}>{estaAberto ? "🔽" : "▶️"}</span> {/* -> Seta dinâmica indicando se o bloco está expandido ou colapsado. */}
                        <span>📊 ETAPA: {coluna.nome.toUpperCase()} ({linhasDestaEtapa.length} EMPRESAS)</span>
                      </div>
                      <span style={{ background: "#ffffff", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${coluna.corBorda}` }}>
                        SUBTOTAL: R$ {dinheiroEtapa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* -> Exibe o caixa reativo travado naquela calha. */}
                      </span>
                    </div>
                    {/* 🛠️ DIRETRIZ CUMPRIDA EXCLUSÃO DE PASTAS CORE: O elemento indicador visual '📁 CORE: [###]' foi sumido daqui com sucesso, limpando as planilhas active por completo! */}
                  </td>
                </tr>

                {/* 📄 RENDERIZAÇÃO CONDICIONAL DAS LINHAS: Só varre e desenho os clientes se 'estaAberto' for verdadeiro */}
                {estaAberto && (
                  linhasDestaEtapa.length === 0 ? (
                    // -> COMPORTAMENTO DE RAIA VAZIA: Se a sanfona estiver aberta mas não houver ninguém na fase, exibe o aviso.
                    <tr>
                      <td colSpan="6" style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: "11px", fontStyle: "italic", backgroundColor: "#ffffff" }}>
                        📭 Nenhuma empresa estacionada na etapa {coluna.nome} no momento.
                      </td>
                    </tr>
                  ) : (
                    // -> MAPEAMENTO DE EMPRESAS: Desenha a linha corporativa densa para cada canhoto encontrado.
                    linhasDestaEtapa.map((item) => {
                      const valorNum = parseFloat(item.valorVencido) || 0; // -> Limpa o valor monetário extraindo o ponto flutuante para formatação.

                      return (
                        <tr 
                          key={item.id} // -> Chave de identificação interna do React.
                          style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}
                        >
                          {/* CÉLULA 1: ID DA CONTA (CLICÁVEL PARA ABRIR O PRONTUÁRIO) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", color: "#64748b", fontSize: "12px", cursor: "pointer" }}>
                            #{item.codigo}
                          </td>
                          
                          {/* CÉLULA 2: RAZÃO SOCIAL E BADGE PRICE (CLICÁVEL PARA ABRIR O PRONTUÁRIO) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", textTransform: "uppercase", color: "#0f172a", cursor: "pointer" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-start" }}>
                              <span>{item.cliente}</span>
                              {item.proposta?.qtdParcelas && item.proposta.qtdParcelas > 1 && (
                                <span style={{ fontSize: "9px", fontWeight: "800", background: "#eff6ff", color: "#1e40af", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bfdbfe" }}>
                                  📊 PRICE: {item.proposta.qtdParcelas}X
                                </span>
                              )}
                            </div>
                          </td>
                          
                          {/* CÉLULA 3: OPERADOR MESA (CLICÁVEL PARA ABRIR O PRONTUÁRIO) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", color: "#334155", cursor: "pointer" }}>
                            👤 {item.responsavel || "Sem operador"} 
                          </td>
                          
                          {/* CÉLULA 4 TRANSFORMATIVA: DROPDOWN INTERATIVO DE ALTERAÇÃO DE ETAPA EM LINHA DIRETA */}
                          <td style={{ padding: "8px 20px" }}>
                            <select
                              value={item.status || "novo"} // -> Herda reativamente a calha atual salva no Firestore.
                              onClick={(e) => e.stopPropagation()} // -> Trava de segurança: impede que a abertura do select dispare o clique da linha e abra o prontuário por erro.
                              onChange={(e) => aoMudarStatusDireto && aoMudarStatusDireto(item.id, e.target.value)} // -> MUTAÇÃO SÍNCRONA: Dispara a atualização imediata no Firebase, movendo a linha de bloco na hora.
                              style={{ 
                                padding: "4px 8px", 
                                borderRadius: "6px", 
                                border: "1px solid #cbd5e1", 
                                fontSize: "11px", 
                                fontWeight: "700", 
                                backgroundColor: "#f8fafc", 
                                color: "#0f172a",
                                cursor: "pointer",
                                width: "100%"
                              }}
                            >
                              <option value="novo">🆕 A Iniciar</option>
                              <option value="contato">✉️ Notificação Enviada</option>
                              <option value="negociacao">🤝 Em Negociação</option>
                              <option value="acordo">📄 Termo em Andamento</option>
                              <option value="cobranca">📊 Cobrança Parcelada</option>
                              <option value="conta_corrente">⚡ Conta Corrente</option>
                              <option value="finalizado">Finalizado / Quitado</option>
                            </select>
                          </td>
                          
                          {/* CÉLULA 5: SALDO MONETÁRIO VIVO */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", textAlign: "right", color: item.subStatus === "sucesso" ? "#10b981" : "#0f172a", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                            R$ {valorNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} 
                          </td>
                          
                          {/* CÉLULA 6 RECONFIGURADA PREMIUM: SISTEMA DE ARQUIVAMENTO CHAVE GANGORRA COMPATÍVEL COM O KANBAN */}
                          <td style={{ padding: "12px 20px", textAlign: "center" }}>
                            <button
                              type="button" // -> Tipo botão nativo comercial seguro.
                              onClick={(e) => {
                                e.stopPropagation(); // -> Evita o clique involuntário de expansão de ficha de prontuário.
                                aoDeletar(item.id, item.cliente); // -> Dispara o interruptor dinâmico (Arquivar / Desarquivar) no App.jsx.
                              }}
                              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
                              title={exibirArquivados ? "Desarquivar cobrança e mandar para esteira ativa" : "Arquivar cobrança e mandar para o Limbo"} // -> Tooltip explicativa flutuante contextual baseada na aba ativa.
                            >
                              {/* MUTAÇÃO DE EMOJI EM GRADE: Exibe a pasta com seta (📤) caso esteja no Limbo, ou a pasta de arquivos (📁) caso esteja na esteira de ativos comuns */}
                              {exibirArquivados ? "📤" : "📁"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )
                )}
              </tbody>
            );
          })}

        </table>

        {/* 📊 BARRA CONSOLIDADA DE SOMA DE PIPELINE FINANCEIRO NO RODAPÉ */}
        <div 
          style={{ 
            backgroundColor: "#f8fafc", 
            padding: "16px 20px", 
            borderTop: "1px solid #e2e8f0", 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#1e293b"
          }}
        >
          <span>TOTAL DE CARTEIRA FILTRADA ATIVA COBRADA:</span>
          <span style={{ color: "#2563eb", fontSize: "16px", fontWeight: "800" }}>
            R$ {faturamentoTotalEsteira.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

      </div>
    </div>
  );
}