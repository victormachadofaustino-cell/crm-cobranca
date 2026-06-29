import React from "react"; // -> Traz a biblioteca mestre do React de forma nativa para permitir a interpretação de componentes .jsx.
import { Hash, Trash2, Plus, Search, X, Activity } from "lucide-react"; // -> Injeta a coleção de ícones vetoriais lineares e sóbrios da biblioteca Lucide.

export default function TabelaNotasFiscais({ categoriaBloqueada, listaTitulosFiltrada, notasSelecionadas, setNotasSelecionadas, filtroPesquisa, setFiltroPesquisa, abrirAdicaoNotaFiscal, abrirEdicaoNotaFiscal, CakeSelecExclusaoEmMassa, lidarMarcarTodasAsNotas, subModalNfAberto, setSubModalNfAberto, modoSubModal, processarSalvarNotaFiscalSacola, nfDocumento, setNfDocumento, nfReferencia, setNfReferencia, nfAtribuicao, setNfAtribuicao, nfDataDoc, setNfDataDoc, nfVencimento, setNfVencimento, nfValor, setNfValor, nfVendedor, setNfVendedor }) { // -> Declara a função do componente recebendo todas as propriedades, estados e gatilhos NoSQL mapeados no pai.
  return ( // -> Inicia a renderização do bloco de código que desenha a listagem planilhada e o sub-modal de faturamento.
    <div style={{ textAlign: "left" }}> {/* -> Garante o alinhamento de todos os elementos rigorosamente à esquerda da margem. */}
      
      {/* CABEÇALHO DA SEÇÃO DE NOTAS FISCAIS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}> {/* -> Faixa horizontal simétrica de topo. */}
        <h4 style={{ display: "flex", alignItems: "center", gap: "4px", margin: 0, fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}> {/* -> Título formal em caixa alta contendo a volumetria. */}
          <Hash size={13} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Ícone tralha numérico fino do Lucide. */}
          <span>Notas Fiscais ({listaTitulosFiltrada.length})</span> {/* -> Rótulo de texto descritivo. */}
        </h4>
        
        {!categoriaBloqueada && ( // -> CIRCUITO DE INTERVENÇÃO ADMINISTRATIVA: Só acende os botões de ação se a conta não estiver travada por acordo Price.
          <div style={{ display: "flex", gap: "6px" }}> {/* -> Alinhador horizontal de botões. */}
            <button type="button" onClick={CakeSelecExclusaoEmMassa} style={{ display: "inline-flex", alignItems: "center", gap: "3px", border: "1px solid #ef4444", background: "#fef2f2", color: "#ef4444", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}> {/* -> Botão de exclusão coletiva ClickUp. */}
              <Trash2 size={10} /> <span>Excluir Notas</span> {/* -> Ícone e texto. */}
            </button>
            <button type="button" onClick={abrirAdicaoNotaFiscal} style={{ display: "inline-flex", alignItems: "center", gap: "3px", border: "1px solid #2563eb", background: "#f0f9ff", color: "#2563eb", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}> {/* -> Botão de acender sub-modal limpo. */}
              <Plus size={10} strokeWidth={3} /> <span>Adicionar Título</span> {/* -> Ícone e texto. */}
            </button>
          </div>
        )}
      </div>

      {/* BARRA DE PESQUISA DA LUPA INTELIGENTE */}
      <div style={{ display: "flex", alignItems: "center", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 8px", marginBottom: "8px", gap: "4px" }}> {/* -> Caixa de contorno branca da lupa. */}
        <Search size={12} strokeWidth={3} style={{ color: "#94a3b8" }} /> {/* -> Ícone linear de lupa grossa. */}
        <input type="text" placeholder="Pesquisar por NF, contrato, emissão, vencimento..." value={filtroPesquisa} onChange={(e) => setFiltroPesquisa(e.target.value)} style={{ width: "100%", border: "none", background: "none", fontSize: "11px", color: "#0f172a", outline: "none" }} /> {/* -> Entrada livre monitorada caractere por caractere. */}
        {filtroPesquisa && <X size={12} style={{ color: "#94a3b8", cursor: "pointer" }} onClick={() => setFiltroPesquisa("")} />} {/* -> Botão X para limpar a busca. */}
      </div>

      {/* GRADE FISCAL SINGLE-LINE BLINDADA CONTRA ADVERTÊNCIAS DO DOM */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "6px", overflowX: "auto", background: "#ffffff" }}><table style={{ width: "100%", minWidth: "575px", borderCollapse: "collapse", fontSize: "11px" }}><thead><tr style={{ background: "#f1f5f9", borderBottom: "1px solid #cbd5e1", color: "#475569", fontWeight: "800" }}><th style={{ padding: "6px 8px", width: "4%", textAlign: "center" }}><input type="checkbox" disabled={categoriaBloqueada} checked={listaTitulosFiltrada.length > 0 && Object.keys(notasSelecionadas).length === listaTitulosFiltrada.length} onChange={lidarMarcarTodasAsNotas} style={{ cursor: 'pointer' }} /></th><th style={{ padding: "6px 8px", width: "14%", textAlign: "left" }}>NF (Ref)</th><th style={{ padding: "6px 8px", width: "10%", textAlign: "left" }}>Contrato</th><th style={{ padding: "6px 8px", width: "10%", textAlign: "left" }}>Emissão</th><th style={{ padding: "6px 8px", width: "10%", textAlign: "left" }}>Vencimento</th><th style={{ padding: "6px 8px", width: "18%", textAlign: "center" }}>Valor</th><th style={{ padding: "6px 8px", width: "25%", textAlign: "left", paddingLeft: "12px" }}>Executivo de Vendas</th></tr></thead><tbody>{listaTitulosFiltrada.map((titulo, tIdx) => (<tr key={tIdx} style={{ borderBottom: "1px solid #f1f5f9", background: notasSelecionadas[tIdx] ? "#f0f9ff" : "transparent" }}><td style={{ padding: "6px 8px", textAlign: "center" }}><input type="checkbox" disabled={categoriaBloqueada} checked={!!notasSelecionadas[tIdx]} onChange={(e) => { setNotasSelecionadas(prev => ({ ...prev, [tIdx]: e.target.checked })); }} style={{ cursor: 'pointer' }} /></td><td style={{ padding: "6px 8px", fontWeight: "700", color: "#0284c7", cursor: "pointer", textDecoration: "underline" }} onClick={() => abrirEdicaoNotaFiscal(titulo, tIdx)}>{titulo.referencia}</td><td style={{ padding: "6px 8px", color: "#475569", fontFamily: "monospace" }}>#{titulo.numDocumento}</td><td style={{ padding: "6px 8px", color: "#64748b" }}>{titulo.dataDocumento ? titulo.dataDocumento.split("-").reverse().join("/") : "S/D"}</td><td style={{ padding: "6px 8px", color: "#dc2626", fontWeight: "600" }}>{titulo.vencimentoLiquido ? titulo.vencimentoLiquido.split("-").reverse().join("/") : "S/D"}</td><td style={{ padding: "6px 8px", textAlign: "right", color: "#0f172a", fontWeight: "700", whiteSpace: "nowrap" }}>R$ {titulo.valorNota.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td><td style={{ padding: "6px 8px", paddingLeft: "12px", color: "#475569", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "130px" }}>{titulo.executivoVendas || "Não Informado"}</td></tr>))}{listaTitulosFiltrada.length === 0 && (<tr><td colSpan="7" style={{ padding: "14px", color: "#94a3b8", fontStyle: "italic", textAlign: "center" }}>Nenhum título fiscal localizado.</td></tr>)}</tbody></table></div>

      {/* SUB-MODAL FLUTUANTE DE LANÇAMENTO E EDIÇÃO DE NOTAS FISCAIS */}
      {subModalNfAberto && ( // -> Condição de existência: só projeta o pop-up caso o interruptor booleano esteja ativado.
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", zIndex: 8000, display: "flex", justifyContent: "center", alignItems: "center" }}> {/* -> Fundo escuro com opacidade controlada para foco visual total. */}
          <div style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #cbd5e1", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}> {/* -> Cartão branco plano delimitado em 400px simétricos. */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}> {/* -> Faixa horizontal superior. */}
              <h5 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}> {/* -> Título contextualizado em caixa alta. */}
                {modoSubModal === "editar" ? <Activity size={14} /> : <Plus size={14} strokeWidth={2.5} />} {/* -> Alterna ícone entre caneta ou sinal de mais. */}
                <span>{modoSubModal === "editar" ? "Modificar Dados do Título" : "Lançar Título no Lote"}</span> {/* -> Texto dinâmico. */}
              </h5>
              <button type="button" onClick={() => setSubModalNfAberto(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={16} /></button> {/* -> Fecha rigorosamente apenas o sub-modal de faturas. */}
            </div>

            <form onSubmit={(e) => processarSalvarNotaFiscalSacola(e, modoSubModal === "editar")} style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}> {/* -> Formulário inline com inputs densos regulamentares. */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>Nº CONTRATO PROPOSTA *</label> {/* -> Rótulo formal. */}
                <input type="number" required placeholder="Ex: 87546516" value={nfDocumento} onChange={(e) => setNfDocumento(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} /> {/* -> Caixa numérica vinculada a 'nfDocumento'. */}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>NOTA FISCAL (REFERÊNCIA) *</label> {/* -> Rótulo formal. */}
                <input type="text" required placeholder="Ex: 025070-A" value={nfReferencia} onChange={(e) => setNfReferencia(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }} /> {/* -> Caixa de texto vinculada a 'nfReferencia'. */}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>ATRIBUIÇÃO (TIPO DE VENDA)</label> {/* -> Rótulo informativo. */}
                <input type="text" placeholder="Ex: Rentals T" value={nfAtribuicao} onChange={(e) => setNfAtribuicao(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} /> {/* -> Caixa de texto para atribuição. */}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}> {/* -> Grade responsiva lado a lado para datas. */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>DATA EMISSÃO</label> {/* -> Rótulo de emissão. */}
                  <input type="date" value={nfDataDoc} onChange={(e) => setNfDataDoc(e.target.value)} style={{ padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} /> {/* -> Calendário nativo. */}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>VENCIMENTO REAL *</label> {/* -> Rótulo de vencimento. */}
                  <input type="date" required value={nfVencimento} onChange={(e) => setNfVencimento(e.target.value)} style={{ padding: "5px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }} /> {/* -> Calendário nativo obrigatório. */}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>MONTANTE EM MOEDA INTERNA (R$) *</label> {/* -> Rótulo mestre. */}
                <input type="number" step="0.01" required placeholder="0.00" value={nfValor} onChange={(e) => setNfValor(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", textAlign: "right" }} /> {/* -> Moeda alinhada à direita centaval. */}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", marginBottom: "2px" }}>EXECUTIVO DE VENDAS</label> {/* -> Rótulo de vendedor. */}
                <input type="text" placeholder="Nome do vendedor" value={nfVendedor} onChange={(e) => setNfVendedor(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px" }} /> {/* -> Texto livre. */}
              </div>

              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}> {/* -> Rodapé de botões contextuais. */}
                {modoSubModal === "adicionar" ? ( // -> Regime de inclusão dupla calibrada.
                  <>
                    <button type="button" onClick={(e) => processarSalvarNotaFiscalSacola(e, false)} style={{ flex: 1, background: "#16a34a", color: "white", border: "none", padding: "8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>🔄 Salvar e Seguir</button>
                    <button type="button" onClick={(e) => processarSalvarNotaFiscalSacola(e, true)} style={{ background: "#0f172a", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Concluir</button>
                  </>
                ) : ( // -> Regime de alteração cirúrgica.
                  <button type="submit" style={{ flex: 1, background: "#2563eb", color: "white", border: "none", padding: "8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer", textTransform: "uppercase" }}>Confirmar Alterações</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div> // -> Encerra o contêiner mestre absoluto.
  );
}