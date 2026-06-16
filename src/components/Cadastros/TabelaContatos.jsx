import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import { ChevronUp, ChevronDown, FolderMinus, User, Fingerprint, Phone, Mail, Link, Building2 } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function TabelaContatos({ contatosFiltrados = [], empresas = [], aoEditarContato, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao, itensSelecionadosExternos = {}, setItensSelecionadosExternos }) { // -> RECALIBRADA PREMIUM: Recebe as bandejas de checkboxes em lote e as triggers de controle unificado vindas do pai ModuloCadastros.
  const totalFlegadosPF = contatosFiltrados.filter(item => itensSelecionadosExternos[item.id] === true).length; // -> Soma as marcas verdadeiras em tempo real na memória RAM.
  const todosPFEstaoMarcados = contatosFiltrados.length > 0 && totalFlegadosPF === contatosFiltrados.length; // -> Valida se o contador bateu no limite das linhas visíveis exibidas.

  const lidarComSelecaoMestrePF = () => { // -> Acionado ao clicar no checkbox do cabeçalho mestre superior da planilha para marcar tudo.
    const mapaRascunho = {}; // -> Inicializa o balde de memória ram local temporário.
    if (!todosPFEstaoMarcados) { // -> Se nem todas as linhas estiverem flegadas, roda o laço injetando true em todas as IDs de contatos.
      contatosFiltrados.forEach((item) => { mapaRascunho[item.id] = true; }); // -> Grava o booleano de visto ativo no ID do contato.
    } // -> Caso contrário, se já estiver tudo marcado, o balde vazio limpa todas as caixas simultaneamente.
    setItensSelecionadosExternos(mapaRascunho); // -> Atualiza a memória global do App.jsx por retroalimentação reativa.
  };

  const lidarComSelecaoIndividualPF = (idItem) => { // -> Acionado ao clicar no checkbox individual de uma fileira humana específica.
    setItensSelecionadosExternos((anterior) => ({ // -> Acessa o estado anterior de checkboxes guardados na memória RAM.
      ...anterior, // -> Preserva o estado de flegagem de todas as outras linhas paralelas para não apagá-las.
      [idItem]: !anterior[idItem] // -> Inverte síncronamente o booleano do item clicado: se estava desmarcado vira marcado.
    }));
  };

  return ( // -> Inicia o retorno do componente visual que desenha la interface da planilha no navegador.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th style={{ padding: "14px 20px", width: "40px", textAlign: "center", userSelect: "none" }}>
              <input type="checkbox" checked={todosPFEstaoMarcados} onChange={lidarComSelecaoMestrePF} style={{ cursor: "pointer", width: "14px", height: "14px" }} title="Selecionar / Limpar selection de todos os contatos visíveis" />
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("nome"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>NOME DO REPRESENTANTE</span>
                {campoOrdenado === "nome" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("cpf"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CPF JURÍDICO</span>
                {campoOrdenado === "cpf" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("telefone"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "160px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>TELEFONE CONTATO</span>
                {campoOrdenado === "telefone" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("email"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CORREIO ELETRÔNICO</span>
                {campoOrdenado === "email" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("tipoVinculo"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>PAPEL / VÍNCULO</span>
                {campoOrdenado === "tipoVinculo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)}
              </div>
            </th>
            <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", width: "220px" }}>
              EMPRESA-PAI ASSOCIAÇÃO
            </th>
          </tr>
        </thead>
        <tbody>
          {contatosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <FolderMinus size={14} strokeWidth={2} />
                  <span>Nenhum representante humano foi localizado com as regras de busca ativas.</span>
                </div>
              </td>
            </tr>
          ) : (
            contatosFiltrados.map((c) => {
              const pai = empresas.find((e) => e.id === c.empresaId);
              const isSelecionadoIndividual = itensSelecionadosExternos[c.id] === true;

              return (
                <tr 
                  key={c.id}
                  onClick={() => aoEditarContato && aoEditarContato(c)}
                  style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isSelecionadoIndividual ? "#f8fafc" : "#ffffff", cursor: "pointer", transition: "background 0.15s ease" }}
                >
                  <td onClick={(event) => event.stopPropagation()} style={{ padding: "12px 20px", textAlign: "center", verticalAlign: "middle" }}>
                    <input type="checkbox" checked={isSelecionadoIndividual} onChange={() => lidarComSelecaoIndividualPF(c.id)} style={{ cursor: "pointer", width: "13px", height: "13px" }} />
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#0f172a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <User size={13} strokeWidth={2} style={{ color: "#0f172a" }} />
                      <span>{c.nome || "NOME NÃO INFORMADO"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Fingerprint size={13} strokeWidth={2} style={{ color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#64748b" }} />
                      <span>{c.cpf || "* REQUER ATUALIZAÇÃO *"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: "bold", color: "#0f172a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={13} strokeWidth={2} style={{ color: "#64748b" }} />
                      <span>{c.telefone || "NÃO INFORMADO"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#475569" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={13} strokeWidth={2} style={{ color: "#64748b" }} />
                      <span>{c.email || "Não informado"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#f1f5f9", color: "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      <Link size={10} strokeWidth={2.5} />
                      <span>{c.tipoVinculo || "Preposto"}</span>
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#2563eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Building2 size={13} strokeWidth={2} style={{ color: "#2563eb" }} />
                      <span>{pai ? pai.cliente : "Não Encontrada"}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}>
            <td colSpan="6" style={{ padding: "14px 20px", fontSize: "12px" }}>
              TOTAL DE REPRESENTANTES HUMANOS ATIVOS LISTADOS:
            </td>
            <td style={{ padding: "14px 20px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "right", whiteSpace: "nowrap", paddingRight: "40px" }}>
              {contatosFiltrados.length} contatos
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}