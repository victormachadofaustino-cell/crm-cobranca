import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import { ChevronUp, ChevronDown, ChevronRight, TrendingUp, FolderMinus, User, Inbox, GripVertical } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function TabelaCobranca({ cobrancas, aoClicarLinha, aoDeletar, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao, aoMudarStatusDireto, exibirArquivados = false, itensSelecionados = {}, setItensSelecionados, aoIniciarArrastoLinha, aoSoltarLinhaNaEtapa }) { // -> RECALIBRADA PREMIUM: Recebe as bandejas de estados de checkboxes em lote e os gatilhos físicos de arrasto híbrido de linhas do CRM.
  // -> CALCULO DE TOTALIZADOR GERAL: Varre toda a esteira de dados reativos e soma os valores brutos para o rodapé.
  const faturamentoTotalEsteira = cobrancas.reduce((acumulador, item) => acumulador + (parseFloat(item.valorVencido) || 0), 0); // -> Faz a somatória reativa de todo o pipeline financeiro em tempo real.

  // -> CONFIGURAÇÃO OFICIAL DE SEQUÊNCIA E PRIORIDADE DE CAIXA DO CLICKUP (FINALIZADO NO TOPO, INICIAR NA BASE)
  const colunasFunil = [
    { id: "finalizado", nome: "Finalizado / Quitado", corFundo: "#f0fdf4", corTexto: "#16a34a", corBorda: "#bbf7d0" }, // -> Quadrante do topo: Processos encerrados e liquidados com sucesso.
    { id: "cobranca", nome: "Cobrança Parcelada", corFundo: "#eff6ff", corTexto: "#1e40af", corBorda: "#bfdbfe" }, // -> Segundo quadrante: Recebimentos estruturados Price ativos.
    { id: "conta_corrente", nome: "Conta Corrente", corFundo: "#f0fdfa", corTexto: "#0d9488", corBorda: "#99f6e4" }, // -> Terceiro quadrante: Amortizações livres em conta corrente.
    { id: "acordo", nome: "Termo em Andamento", corFundo: "#fdf2f8", corTexto: "#be185d", corBorda: "#fbcfe8" }, // -> Quarto quadrante: Contratos em fase de assinatura fiscal.
    { id: "negociacao", nome: "Em Negociação", corFundo: "#fffbeb", corTexto: "#b45309", corBorda: "#fef3c7" }, // -> Quinto quadrante: Mesas de atrito e conciliação activa.
    { id: "contato", nome: "Notificação Enviada", corFundo: "#faf5ff", corTexto: "#6b21a8", corBorda: "#e9d5ff" }, // -> Sexto quadrante: Devedores notificados eletronicamente.
    { id: "novo", nome: "A Iniciar", corFundo: "#f8fafc", corTexto: "#475569", corBorda: "#e2e8f0" } // -> Quadrante da base: Lotes novos intocados aguardando faturamento.
  ]; // -> Encerra a matriz de prioridade vertical do CRM.

  // -> MEMÓRIA RAM DO ACCORDION: Monitora eletronicamente quais etapas estão maximizadas (true) ou minimizadas (false).
  const [abasAbertas, setAbasAbertas] = React.useState({ finalizado: true, cobranca: true, conta_corrente: true, acordo: true, negociacao: true, contato: true, novo: true }); // -> Inicializa todos os blocos abertos por padrão para exibição inicial completa usando a declaração explícita del React.

  // -> OPERADOR DE ALTERNÂNCIA DE SANFONA (MINIMIZAR / MAXIMIZAR)
  const alternarSanfonaEtapa = (idEtapa) => { // -> Acionado ao clicar na linha do cabeçalho da etapa correspondente.
    setAbasAbertas((anterior) => ({
      ...anterior, // -> Preserva o estado de abertura das demais abas paralelas.
      [idEtapa]: !anterior[idEtapa] // -> Inverte o booleano da aba clicada (se estava aberto vira fechado).
    }));
  }; // -> Encerra a inversão de sanfona.

  // -> MOTOR AUXILIAR DE SOMA PARCIAL DE CAIXA POR ETAPA REAL
  const somarDinheiroDaEtapa = (idEtapa) => { // -> Varre a esteira isolando apenas os clientes daquela coluna específica.
    const filtrados = cobrancas.filter((item) => { // -> Executa o filtro de soma tratando a redundância ortográfica de segurança.
      const statusLimpo = item.status || "novo"; // -> Carrega o status do item ou joga para a coluna inicial se estiver em branco.
      if (idEtapa === "cobranca") return statusLimpo === "cobranca" || statusLimpo === "cobrança"; // -> Se for a aba de cobrança, soma os cartões salvos com ou sem cedilha.
      return statusLimpo === idEtapa; // -> Caso contrário, executa a comparação padrão de ID.
    }); // -> Encerra o filtro do somador de caixa parcial.
    return filtrados.reduce((acc, item) => acc + (parseFloat(item.valorVencido) || 0), 0); // -> Soma e retorna o saldo bruto em reais.
  };

  // 🧺 INTERCEPTADOR DO CHECKBOX MESTRE: Marca ou limpa em lote todas as empresas filtradas ativas na tabela com um único clique.
  const totalItensMarcadosNaEsteira = cobrancas.filter(item => itensSelecionados[item.id] === true).length; // -> Conta reativamente os booleanos ativos.
  const todosEstaoFlegados = cobrancas.length > 0 && totalItensMarcadosNaEsteira === cobrancas.length; // -> Checa se bate simetricamente com o teto.

  const lidarComSelecaoMestreLote = () => { // -> Gatilho mestre de cabeçalho.
    const mapaRascunho = {}; // -> Cria balde temporário.
    if (!todosEstaoFlegados) { // -> Se não estiver tudo marcado, preenche o mapa forçando flag true em todas as IDs devedoras.
      cobrancas.forEach((item) => { mapaRascunho[item.id] = true; }); // -> Crava o valor ativo.
    } // -> Caso contrário, o balde vazio limpa todas as seleções de uma vez só.
    setItensSelecionados(mapaRascunho); // -> Propaga a alteração em lote no App.jsx.
  };

  const lidarComSelecaoIndividual = (idItem) => { // -> Gatilho individual de checkbox de linha.
    setItensSelecionados((anterior) => ({
      ...anterior, // -> Preserva o estado das demais caixas paralelas.
      [idItem]: !anterior[idItem] // -> Inverte o booleano do item flegado.
    }));
  };

  return ( // -> Inicia o retorno do componente visual que desenha a interface da planilha no navegador.
    <div style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 20px", boxSizing: "border-box" }}>
      {/* 📑 CONTÊINER DA PLANILHA COMERCIAL */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          
          {/* 🧭 CABEÇALHO DA TABELA (TÍTULOS DAS COLUNAS COM REGRAS DE ORDENAÇÃO) */}
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
              {/* 🧺 COLUNA DE LOTE MESTRE: Contém o checkbox mestre superior de inversão em bloco do CRM */}
              <th style={{ padding: "14px 20px", width: "40px", textAlign: "center", userSelect: "none" }}>
                <input type="checkbox" checked={todosEstaoFlegados} onChange={lidarComSelecaoMestreLote} style={{ cursor: "pointer", width: "14px", height: "14px" }} title="Marcar / Desmarcar todos os registros listados" />
              </th>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("codigo")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "120px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>CÓDIGO CONTA</span>
                  {campoOrdenado === "codigo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta fina vetorial do Lucide. */}
                </div>
              </th>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cliente")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>EMPRESA / RAZÃO SOCIAL</span>
                  {campoOrdenado === "cliente" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta fina vetorial do Lucide. */}
                </div>
              </th>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("responsavel")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>OPERADOR RESPONSÁVEL</span>
                  {campoOrdenado === "responsavel" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta fina vetorial do Lucide. */}
                </div>
              </th>
              <th style={{ padding: "14px 20px", width: "220px" }}>
                ETAPA DO FUNIL ACTIVE {/* -> Título limpo sem poluição visual. */}
              </th>
              <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("valorVencido")} style={{ padding: "14px 20px", textAlign: "right", cursor: "pointer", userSelect: "none", width: "160px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                  <span>SALDO VENCIDO</span>
                  {campoOrdenado === "valorVencido" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta fina vetorial do Lucide. */}
                </div>
              </th>
            </tr>
          </thead>

          {/* =========================================================================================
              🗂️ LOOP DE CORPOS DE TABELA: MAPEIA AS ETAPAS DO USUÁRIO VERTICALMENTE
              ========================================================================================= */}
          {colunasFunil.map((coluna) => {
            const linhasDestaEtapa = cobrancas.filter((item) => { // -> Executa o filtro de renderização inteligente nas raias da tabela.
              const statusLimpo = item.status || "novo"; // -> Captura o status real do banco NoSQL ou assume "novo" por segurança se estiver vazio.
              if (coluna.id === "cobranca") return statusLimpo === "cobranca" || statusLimpo === "cobrança"; // -> CORREÇÃO CIRÚRGICA: Se a linha for da sanfona cobrança, aceita o status com ou sem cedilha salvando a visualização.
              return statusLimpo === coluna.id; // -> Caso contrário, executa a filtragem normal por ID idêntico.
            }); // -> Encerra a esteira de filtragem protetiva.
            
            const estaAberto = abasAbertas[coluna.id]; // -> Resgata da memória RAM se a sanfona deste ID está maximizada ou encolhida.
            const dinheiroEtapa = somarDinheiroDaEtapa(coluna.id); // -> Executa a somatória financeira parcial da raia.

            return (
              <tbody 
                key={coluna.id} 
                style={{ borderBottom: "1px solid #e2e8f0" }}
                onDragOver={(e) => e.preventDefault()} // -> Habilita a escuta nativa para receber arrastos sobre o bloco.
                onDrop={(e) => aoSoltarLinhaNaEtapa && aoSoltarLinhaNaEtapa(e, coluna.id)} // 🔀 FIÇÃO DE SOLTURA REATIVA: Permite soltar uma linha arrastada em cima da sanfona da etapa para mudá-la de fase.
              >
                
                {/* 🔽 CABEÇALHO INTERATIVO DA SANFONA DE ETAPA (BARRA DE TÍTULO DO ACCORDION / RECEPTOR DROP) */}
                <tr 
                  onClick={() => alternarSanfonaEtapa(coluna.id)} // -> Altera reativamente a visualização do bloco ao clicar na barra.
                  style={{ backgroundColor: coluna.corFundo, borderBottom: `1px solid ${coluna.corBorda}`, cursor: "pointer", userSelect: "none" }}
                >
                  <td colSpan="6" style={{ padding: "10px 20px", fontSize: "11px", fontWeight: "800", color: coluna.corTexto, textAlign: "left", letterSpacing: "0.5px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ display: "flex", alignItems: "center", color: coluna.corTexto }}>
                          {estaAberto ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />} {/* -> Seta dinâmica de accordion. */}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <TrendingUp size={13} strokeWidth={2.5} style={{ opacity: 0.8 }} /> {/* -> Indicador gráfico de linhas finas do Lucide. */}
                          <span>ETAPA: {coluna.nome.toUpperCase()} ({linhasDestaEtapa.length} EMPRESAS)</span>
                        </div>
                      </div>
                      <span style={{ background: "#ffffff", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${coluna.corBorda}` }}>
                        SUBTOTAL: R$ {dinheiroEtapa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} {/* -> Exibe o caixa reativo travado naquela calha. */}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* 📄 RENDERIZAÇÃO CONDICIONAL DAS LINHAS: Só varre e desenho os clientes se 'estaAberto' for verdadeiro */}
                {estaAberto && (
                  linhasDestaEtapa.length === 0 ? (
                    // -> COMPORTAMENTO DE RAIA VAZIA: Se a sanfona estiver aberta mas não houver ninguém na fase, exibe o aviso.
                    <tr>
                      <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "11px", fontStyle: "italic", backgroundColor: "#ffffff" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <FolderMinus size={14} strokeWidth={2} /> {/* -> Injeta o ícone sóbrio de repositório vazio do Lucide. */}
                          <span>Nenhuma empresa estacionada na etapa {coluna.nome} no momento.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // -> MAPEAMENTO DE EMPRESAS: Desenha a linha corporativa densa para cada canhoto encontrado.
                    linhasDestaEtapa.map((item) => {
                      const valorNum = parseFloat(item.valorVencido) || 0; // -> Limpa o valor monetário extraindo o ponto flutuante para formatação.
                      const isFlegadoIndividual = itensSelecionados[item.id] === true; // -> Captura da RAM global se este checkbox de linha específico está ativo.

                      return (
                        <tr 
                          key={item.id} // -> Chave de identificação interna do React.
                          style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isFlegadoIndividual ? "#f8fafc" : "#ffffff", transition: "background 0.15s ease" }} // -> Destaca com preenchimento cinza sutil se flegado.
                        >
                          {/* 🔀 CÉLULA EXCLUSIVA DE MOUSE-ARRASTO E SELEÇÃO INDIVIDUAL */}
                          <td style={{ padding: "12px 20px", textAlign: "center", verticalAlign: "middle", width: "40px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                              {/* MANÍPULO DE ARRASTO (PINÇA): Habilita arrastar a linha inteira com o clique do mouse e soltar nas sanfonas das fases */}
                              <div 
                                draggable // -> Ativa a física de movimento HTML5.
                                onDragStart={(e) => aoIniciarArrastoLinha && aoIniciarArrastoLinha(e, item.id, item.status || "novo")} // -> Amarra as chaves NoSQL de decolagem.
                                style={{ cursor: "grab", display: "flex", alignItems: "center", color: "#94a3b8", padding: "2px" }}
                                title="Clique e segure para arrastar este registro e soltar in outra Sanfona de Etapa acima"
                              >
                                <GripVertical size={14} strokeWidth={2} /> {/* -> Ícone sutil de pinça lateral executiva. */}
                              </div>
                              <input type="checkbox" checked={isFlegadoIndividual} onChange={() => lidarComSelecaoIndividual(item.id)} onClick={(e) => e.stopPropagation()} style={{ cursor: "pointer", width: "13px", height: "13px" }} /> {/* 🛠️ CORRIGIDO: Vinculada a função síncrona certa para destravar a marcação individual na tabela do CRM. */}
                            </div>
                          </td>

                          {/* CÉLULA 1: CÓDIGO DA CONTA (CLICÁVEL PARA ABRIR O PRONTUÁRIO DIRETO DA LINHA) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", color: "#64748b", fontSize: "12px", cursor: "pointer" }}>
                            #{item.codigo}
                          </td>
                          
                          {/* CÉLULA 2: RAZÃO SOCIAL E BADGE PRICE (CLICÁVEL PARA ABRIR O PRONTUÁRIO DIRETO DA LINHA) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", textTransform: "uppercase", color: "#0f172a", cursor: "pointer" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-start" }}>
                              <span style={{ fontWeight: "600" }}>{item.cliente}</span>
                              {item.proposta?.qtdParcelas && item.proposta.qtdParcelas > 1 && (
                                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", fontWeight: "800", background: "#eff6ff", color: "#1e40af", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bfdbfe" }}>
                                  <Inbox size={10} strokeWidth={2.5} /> {/* -> Caixa de faturas vazada do Lucide. */}
                                  <span>PRICE: {item.proposta.qtdParcelas}X</span>
                                </span>
                              )}
                            </div>
                          </td>
                          
                          {/* CÉLULA 3: OPERADOR MESA (CLICÁVEL PARA ABRIR O PRONTUÁRIO DIRETO DA LINHA) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", color: "#334155", cursor: "pointer" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <User size={13} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> Perfil geométrico fino em vetor cinza. */}
                              <span>{item.responsavel || "Sem operador"}</span>
                            </div>
                          </td>
                          
                          {/* CÉLULA 4 SÓBRIA: EXIBE REATIVAMENTE O SELO CORRESPONDENTE À ETAPA DA LINHA SEM SEVERIDADES DE CLIQUE (FIM DO SELECT OPERACIONAL) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", cursor: "pointer" }}>
                            <span style={{ background: coluna.corFundo, color: coluna.corTexto, border: `1px solid ${coluna.corBorda}`, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                              {coluna.nome}
                            </span> {/* 🛠️ REMOÇÃO DO SELECT CONCLUÍDA: A célula agora é limpa e serve apenas como marcador de status, liberando a mecânica de arrasto por mouse. */}
                          </td>
                          
                          {/* CÉLULA 5: SALDO MONETÁRIO VIVO (CLICÁVEL PARA ABRIR O PRONTUÁRIO DIRETO DA LINHA) */}
                          <td onClick={() => aoClicarLinha(item, valorNum)} style={{ padding: "12px 20px", textAlign: "right", color: item.subStatus === "sucesso" ? "#10b981" : "#0f172a", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                            R$ {valorNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} 
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