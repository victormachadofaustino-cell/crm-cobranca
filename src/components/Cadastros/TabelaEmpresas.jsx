import React from "react"; // -> Traz a biblioteca nativa do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function TabelaEmpresas({ empresasFiltradas = [], aoEditarEmpresa, aoExcluirEmpresa, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao }) { // -> Define e recebe as propriedades de dados, as funções de clique nos ícones e os estados de ordenação dinâmica do cabeçalho.
  return ( // -> Dispara o desenho da interface da planilha executiva de Pessoas Jurídicas.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("codigo")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              CONTA {campoOrdenado === "codigo" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cliente")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              RAZÃO SOCIAL / ASSISTIDO {campoOrdenado === "cliente" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cnpj")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              CNPJ INSTITUCIONAL {campoOrdenado === "cnpj" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("tipo")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              TIPO {campoOrdenado === "tipo" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("segmento")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              SEGMENTO {campoOrdenado === "segmento" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("endereco")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              ENDEREÇO DA PRAÇA {campoOrdenado === "endereco" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", textAlign: "center", width: "80px" }}>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>⚖️ Nenhum assistido foi localizado com os parâmetros de busca ativos.</td>
            </tr>
          ) : (
            empresasFiltradas.map((e) => {
              return (
                <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: "bold", color: "#0f172a" }}>{e.codigo ? `#${e.codigo}` : "S/C"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#2563eb" }}>🏢 {e.cliente || "NOME NÃO INFORMADO"}</td>
                  <td style={{ padding: "10px 12px", color: e.cnpj && e.cnpj.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>{e.cnpj || "* REQUER ATUALIZAÇÃO *"}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ background: e.tipo === "Matriz" ? "#dbeafe" : "#f1f5f9", color: e.tipo === "Matriz" ? "#1e40af" : "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" }}>{e.tipo || "Matriz"}</span></td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{e.segmento || "Geral"}</td>
                  <td style={{ padding: "10px 12px", color: "#475569", fontSize: "12px" }}>{e.endereco || "Endereço não cadastrado"} {e.cep ? `(CEP: ${e.cep})` : ""}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button type="button" onClick={() => aoEditarEmpresa && aoEditarEmpresa(e)} title="Editar dados cadastrais desta empresa" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "2px" }}>✏️</button>
                      <button type="button" onClick={() => aoExcluirEmpresa && aoExcluirEmpresa(e.id, e.cliente)} title="Excluir empresa permanentemente do sistema" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "2px" }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}>
            <td colSpan="6" style={{ padding: "10px 12px", fontSize: "12px" }}>TOTAL DE CLIENTES / ASSISTIDOS ATIVOS LISTADOS:</td>
            <td style={{ padding: "10px 12px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "center" }}>{empresasFiltradas.length} empresas</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}