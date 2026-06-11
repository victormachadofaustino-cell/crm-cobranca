import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function TabelaContatos({ contatosFiltrados = [], empresas = [], aoEditarContato, aoExcluirContato, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao }) { // -> Declara a função da tabela recebendo a lista de contatos, a base de empresas-pai, as funções de clique e as chaves de ordenação.
  return ( // -> Inicia o retorno do componente visual que desenha a interface da planilha no navegador.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("nome")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              NOME DO REPRESENTANTE {campoOrdenado === "nome" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cpf")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              CPF JURÍDICO {campoOrdenado === "cpf" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("telefone")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              TELEFONE CONTATO {campoOrdenado === "telefone" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("email")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              CORREIO ELETRÔNICO {campoOrdenado === "email" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("tipoVinculo")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              PAPEL / VÍNCULO {campoOrdenado === "tipoVinculo" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""}
            </th>
            <th style={{ padding: "10px 12px", color: "#475569", fontWeight: "700" }}>EMPRESA-PAI ASSOCIAÇÃO</th>
            <th style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", textAlign: "center", width: "80px" }}>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {contatosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>⚖️ Nenhum representante humano foi localizado com as regras de busca ativas.</td>
            </tr>
          ) : (
            contatosFiltrados.map((c) => {
              const pai = empresas.find((e) => e.id === c.empresaId);
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#0f172a" }}>👤 {c.nome || "NOME NÃO INFORMADO"}</td>
                  <td style={{ padding: "10px 12px", color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>{c.cpf || "* REQUER ATUALIZAÇÃO *"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: "bold" }}>📞 {c.telefone || "NÃO INFORMADO"}</td>
                  <td style={{ padding: "10px 12px", color: "#475569" }}>{c.email || "Não informado"}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ background: "#f1f5f9", color: "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>{c.tipoVinculo || "Preposto"}</span></td>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#2563eb" }}>🏢 {pai ? pai.cliente : "Não Encontrada"}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button type="button" onClick={() => aoEditarContato && aoEditarContato(c)} title="Editar dados deste representante" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "2px" }}>✏️</button>
                      <button type="button" onClick={() => aoExcluirContato && aoExcluirContato(c.id, c.nome)} title="Excluir representante permanentemente" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "2px" }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}>
            <td colSpan="6" style={{ padding: "10px 12px", fontSize: "12px" }}>TOTAL DE REPRESENTANTES HUMANOS ATIVOS LISTADOS:</td>
            <td style={{ padding: "10px 12px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "center" }}>{contatosFiltrados.length} contatos</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}