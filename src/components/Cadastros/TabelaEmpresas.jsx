import React from "react"; // -> Traz a biblioteca nativa do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import { ChevronUp, ChevronDown, FolderMinus, Building2 } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function TabelaEmpresas({ empresasFiltradas = [], aoEditarEmpresa, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao, itensSelecionadosExternos = {}, setItensSelecionadosExternos }) { // -> Define e recebe as propriedades de dados, as funções de clique e as esteiras de checkboxes em lote vindas do mestre.
  const totalFlegadosPJ = empresasFiltradas.filter(item => itensSelecionadosExternos[item.id] === true).length; // -> Soma as flags verdadeiras ativas na memória RAM em tempo real.
  const todosPJEstaoMarcados = empresasFiltradas.length > 0 && totalFlegadosPJ === empresasFiltradas.length; // -> Valida se a contagem de flegados atingiu o teto das linhas exibidas.

  const lidarComSelecaoMestrePJ = () => { // -> Função que gerencia o clique no checkbox do cabeçalho superior para marcar tudo de uma vez.
    const mapaRascunho = {}; // -> Inicializa um balde de memória RAM local temporário para guardar a seleção em massa.
    if (!todosPJEstaoMarcados) { // -> Se nem todas as linhas estiverem flegadas, roda o laço cravando a marcação em todas elas.
      empresasFiltradas.forEach((item) => { mapaRascunho[item.id] = true; }); // -> Grava o booleano de visto ativo no ID da empresa.
    } // -> Caso contrário, se já estiver tudo marcado, o balde vazio limpa todas as seleções de uma vez só.
    setItensSelecionadosExternos(mapaRascunho); // -> Atualiza a memória global do arquivo App.js por retroalimentação reativa.
  };

  const lidarComSelecaoIndividualPJ = (idItem) => { // -> Função que gerencia o clique no checkbox individual de uma empresa específica.
    setItensSelecionadosExternos((anterior) => ({ // -> Acessa o estado anterior de checkboxes guardados na memória.
      ...anterior, // -> Preserva o estado de flegagem de todas as outras linhas paralelas para não apagá-las.
      [idItem]: !anterior[idItem] // -> Inverte síncronamente o booleano do item clicado: se estava desmarcado vira marcado.
    }));
  };

  return ( // -> Dispara o desenho da interface da planilha executiva de Pessoas Jurídicas.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th style={{ padding: "14px 20px", width: "40px", textAlign: "center", userSelect: "none" }}>
              <input type="checkbox" checked={todosPJEstaoMarcados} onChange={lidarComSelecaoMestrePJ} style={{ cursor: "pointer", width: "14px", height: "14px" }} title="Selecionar / Limpar seleção de todas as empresas visíveis" />
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("codigo"); }} style={{ padding: "14px 20px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "120px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CONTA</span>
                {campoOrdenado === "codigo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("cliente"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>RAZÃO SOCIAL / ASSISTIDO</span>
                {campoOrdenado === "cliente" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("cnpj"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "180px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CNPJ INSTITUCIONAL</span>
                {campoOrdenado === "cnpj" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("tipo"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "110px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>TIPO</span>
                {campoOrdenado === "tipo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("segmento"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>SEGMENTO</span>
                {campoOrdenado === "segmento" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("endereco"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>ENDEREÇO DA PRAÇA</span>
                {campoOrdenado === "endereco" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {empresasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <FolderMinus size={14} strokeWidth={2} />
                  <span>Nenhum assistido foi localizado com os parâmetros de busca ativos.</span>
                </div>
              </td>
            </tr>
          ) : (
            empresasFiltradas.map((e) => {
              const isSelecionadoIndividual = itensSelecionadosExternos[e.id] === true;

              return (
                <tr 
                  key={e.id}
                  onClick={() => aoEditarEmpresa && aoEditarEmpresa(e)}
                  style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isSelecionadoIndividual ? "#f8fafc" : "#ffffff", cursor: "pointer", transition: "background 0.15s ease" }}
                  onMouseEnter={(event) => { if (!isSelecionadoIndividual) event.currentTarget.style.backgroundColor = "#f8fafc"; }}
                  onMouseLeave={(event) => { if (!isSelecionadoIndividual) event.currentTarget.style.backgroundColor = "#ffffff"; }}
                >
                  <td onClick={(event) => event.stopPropagation()} style={{ padding: "12px 20px", textAlign: "center", verticalAlign: "middle" }}>
                    <input type="checkbox" checked={isSelecionadoIndividual} onChange={() => lidarComSelecaoIndividualPJ(e.id)} style={{ cursor: "pointer", width: "13px", height: "13px" }} />
                  </td>
                  <td style={{ padding: "12px 20px", fontWeight: "bold", color: "#0f172a" }}>{e.codigo ? `#${e.codigo}` : "S/C"}</td>
                  <td style={{ padding: "12px 20px", fontWeight: "700", color: "#2563eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Building2 size={13} strokeWidth={2} style={{ color: "#2563eb" }} />
                      <span>{e.cliente || "NOME NÃO INFORMADO"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 20px", color: e.cnpj && e.cnpj.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>{e.cnpj || "* REQUER ATUALIZAÇÃO *"}</td>
                  <td style={{ padding: "12px 20px" }}><span style={{ background: e.tipo === "Matriz" ? "#dbeafe" : "#f1f5f9", color: e.tipo === "Matriz" ? "#1e40af" : "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" }}>{e.tipo || "Matriz"}</span></td>
                  <td style={{ padding: "12px 20px", color: "#64748b" }}>{e.segmento || "Geral"}</td>
                  <td style={{ padding: "12px 20px", color: "#475569", fontSize: "12px" }}>{e.endereco || "Endereço não cadastrado"} {e.cep ? `(CEP: ${e.cep})` : ""}</td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}>
            <td colSpan="6" style={{ padding: "14px 20px", fontSize: "12px" }}>TOTAL DE CLIENTES / ASSISTIDOS ATIVOS LISTADOS:</td>
            <td style={{ padding: "14px 20px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "right", whiteSpace: "nowrap", paddingRight: "40px" }}>{empresasFiltradas.length} empresas</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}