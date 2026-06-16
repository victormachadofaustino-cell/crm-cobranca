import React from "react"; // -> Traz a biblioteca nativa do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import { ChevronUp, ChevronDown, FolderMinus, Building2, SquarePen, Trash2 } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function TabelaEmpresas({ empresasFiltradas = [], aoEditarEmpresa, aoExcluirEmpresa, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao }) { // -> Define e recebe as propriedades de dados, as funções de clique nos ícones e os estados de ordenação dinâmica do cabeçalho.
  return ( // -> Dispara o desenho da interface da planilha executiva de Pessoas Jurídicas.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("codigo")} style={{ padding: "14px 20px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "120px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CONTA</span>
                {campoOrdenado === "codigo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cliente")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>RAZÃO SOCIAL / ASSISTIDO</span>
                {campoOrdenado === "cliente" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cnpj")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "180px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CNPJ INSTITUCIONAL</span>
                {campoOrdenado === "cnpj" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("tipo")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "110px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>TIPO</span>
                {campoOrdenado === "tipo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("segmento")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>SEGMENTO</span>
                {campoOrdenado === "segmento" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("endereco")} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>ENDEREÇO DA PRAÇA</span>
                {campoOrdenado === "endereco" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th style={{ padding: "14px 20px", color: "#475569", fontWeight: "700", textAlign: "center", width: "80px" }}>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.length === 0 ? (
            // -> COMPORTAMENTO DE DESERTO: Se as buscas retornarem vazias na planilha, exibe o aviso estruturado sóbrio.
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <FolderMinus size={14} strokeWidth={2} /> {/* -> Substitui o antigo emoji de balança pela pasta vazia geométrica do Lucide. */}
                  <span>Nenhum assistido foi localizado com os parâmetros de busca ativos.</span>
                </div>
              </td>
            </tr>
          ) : (
            // -> MAPEAMENTO DE LINHAS: Percorre a matriz viva de empresas gerando as linhas comerciais.
            empresasFiltradas.map((e) => {
              return (
                <tr key={e.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>
                  <td style={{ padding: "12px 20px", fontWeight: "bold", color: "#0f172a" }}>{e.codigo ? `#${e.codigo}` : "S/C"}</td>
                  <td style={{ padding: "12px 20px", fontWeight: "700", color: "#2563eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Building2 size={13} strokeWidth={2} style={{ color: "#2563eb" }} /> {/* -> Troca o emoji de prédio colorido pela silhueta corporativa em vetor azul fino. */}
                      <span>{e.cliente || "NOME NÃO INFORMADO"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px", color: e.cnpj && e.cnpj.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>{e.cnpj || "* REQUER ATUALIZAÇÃO *"}</td>
                  <td style={{ padding: "12px 20px" }}><span style={{ background: e.tipo === "Matriz" ? "#dbeafe" : "#f1f5f9", color: e.tipo === "Matriz" ? "#1e40af" : "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" }}>{e.tipo || "Matriz"}</span></td>
                  <td style={{ padding: "12px 20px", color: "#64748b" }}>{e.segmento || "Geral"}</td>
                  <td style={{ padding: "12px 20px", color: "#475569", fontSize: "12px" }}>{e.endereco || "Endereço não cadastrado"} {e.cep ? `(CEP: ${e.cep})` : ""}</td>
                  <td style={{ padding: "12px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                      <button 
                        type="button" 
                        onClick={() => aoEditarEmpresa && aoEditarEmpresa(e)} 
                        title="Editar dados cadastrais desta empresa" 
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#2563eb"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                      >
                        <SquarePen size={14} strokeWidth={2} /> {/* -> Injeta a caneta de edição em linhas finas outline eliminando o antigo emoji de lápis. */}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => aoExcluirEmpresa && aoExcluirEmpresa(e.id, e.cliente)} 
                        title="Excluir empresa permanentemente do sistema" 
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                      >
                        <Trash2 size={14} strokeWidth={2} /> {/* -> Injeta o componente vetorial da lixeira vazada eliminando o antigo emoji colorido. */}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}>
            <td colSpan="6" style={{ padding: "14px 20px", fontSize: "12px" }}>TOTAL DE CLIENTES / ASSISTIDOS ATIVOS LISTADOS:</td>
            <td style={{ padding: "14px 20px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "center", whiteSpace: "nowrap" }}>{empresasFiltradas.length} empresas</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}