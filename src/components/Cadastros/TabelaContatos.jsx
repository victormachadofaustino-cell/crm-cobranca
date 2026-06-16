import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
import { ChevronUp, ChevronDown, FolderMinus, User, Fingerprint, Phone, Mail, Link, Building2, SquarePen, Trash2 } from "lucide-react"; // -> Injeta as engines de ícones finos, monocromáticos e sóbrios da biblioteca Lucide sem quebras de layout.

export default function TabelaContatos({ contatosFiltrados = [], empresas = [], aoEditarContato, aoExcluirContato, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao }) { // -> Declara a função da tabela recebendo a lista de contatos, a base de empresas-pai, as funções de clique e as chaves de ordenação.
  return ( // -> Inicia o retorno do componente visual que desenha a interface da planilha no navegador.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("nome")} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>NOME DO REPRESENTANTE</span>
                {campoOrdenado === "nome" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cpf")} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CPF JURÍDICO</span>
                {campoOrdenado === "cpf" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("telefone")} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "160px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>TELEFONE CONTATO</span>
                {campoOrdenado === "telefone" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("email")} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>CORREIO ELETRÔNICO</span>
                {campoOrdenado === "email" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("tipoVinculo")} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>PAPEL / VÍNCULO</span>
                {campoOrdenado === "tipoVinculo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Substitui o emoji de seta por ícones finos vetoriais do Lucide. */}
              </div>
            </th>
            <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", width: "220px" }}>
              EMPRESA-PAI ASSOCIAÇÃO {/* -> Cabeçalho de amarração relacional: Exibe o nome da empresa credora vinculada sem filtros de ordenação. */}
            </th>
            <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", textAlign: "center", width: "80px" }}>
              AÇÕES {/* -> Cabeçalho fixo das ferramentas de controle e alteração de lote da linha. */}
            </th>
          </tr>
        </thead>
        <tbody>
          {contatosFiltrados.length === 0 ? (
            // -> COMPORTAMENTO DE DESERTO: Se as buscas retornarem vazias na planilha, exibe o aviso estruturado sóbrio.
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600", backgroundColor: "#ffffff" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <FolderMinus size={14} strokeWidth={2} /> {/* -> Substitui o antigo emoji pelo componente de pasta vazia geométrica do Lucide. */}
                  <span>Nenhum representante humano foi localizado com as regras de busca ativas.</span>
                </div>
              </td>
            </tr>
          ) : (
            // -> MAPEAMENTO DE CONTATOS: Percorre a matriz viva de contatos gerando as linhas comerciais relacionais.
            contatosFiltrados.map((c) => {
              const pai = empresas.find((e) => e.id === c.empresaId); // -> MOTOR RELACIONAL: Cruza na memória RAM a ID da empresa do contato com a lista mestre de empresas para pescar o nome oficial do cliente.
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#0f172a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <User size={13} strokeWidth={2} style={{ color: "#0f172a" }} /> {/* -> Troca a silhueta antiga pelo perfil geométrico fino em vetor escuro do Lucide. */}
                      <span>{c.nome || "NOME NÃO INFORMADO"}</span> {/* -> Célula 1: Imprime o Nome Completo do representante em negrito denso corporativo. */}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Fingerprint size={13} strokeWidth={2} style={{ color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#64748b" }} /> {/* -> Adiciona o ícone de impressão digital outline para representar o documento fiscal. */}
                      <span>{c.cpf || "* REQUER ATUALIZAÇÃO *"}</span> {/* -> Célula 2: Imprime o CPF do contato, acendendo em vermelho de alerta caso o documento possua rasuras ou asteriscos. */}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: "bold", color: "#0f172a" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={13} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> Injeta o componente sutil de telefone em vetor do Lucide. */}
                      <span>{c.telefone || "NÃO INFORMADO"}</span> {/* -> Célula 3: Imprime o número de contato telefônico com DDD higienizado. */}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#475569" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={13} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> Injeta o componente sutil de envelope de correspondência processual eletrônica. */}
                      <span>{c.email || "Não informado"}</span> {/* -> Célula 4: Imprime o correio eletrônico oficial de notificações em tom neutro cinza. */}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#f1f5f9", color: "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      <Link size={10} strokeWidth={2.5} /> {/* -> Injeta o micro-elo vazado do Lucide na pílula cinza do cargo. */}
                      <span>{c.tipoVinculo || "Preposto"}</span> {/* -> Célula 5: Emoldura o papel jurídico (Sócio, Advogado) em um selo cinza elegante de 11px. */}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#2563eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Building2 size={13} strokeWidth={2} style={{ color: "#2563eb" }} /> {/* -> Troca o emoji de prédio colorido pela silhueta corporativa em vetor azul fino. */}
                      <span>{pai ? pai.cliente : "Não Encontrada"}</span> {/* -> Célula 6: Exibe o nome oficial do cliente recuperado pelo cruzamento relacional em tom Azul Elétrico. */}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                      <button 
                        type="button" 
                        onClick={() => aoEditarContato && aoEditarContato(c)} 
                        title="Editar dados deste representante" 
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#2563eb"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                      >
                        <SquarePen size={14} strokeWidth={2} /> {/* -> Injeta a caneta de edição em linhas finas outline eliminando o antigo emoji de lápis. */}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => aoExcluirContato && aoExcluirContato(c.id, c.nome)} 
                        title="Excluir representante permanentemente" 
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
            <td colSpan="6" style={{ padding: "12px 12px", fontSize: "12px" }}>
              TOTAL DE REPRESENTANTES HUMANOS ATIVOS LISTADOS: {/* -> Célula descritiva estendida cobrindo seis colunas horizontais. */}
            </td>
            <td style={{ padding: "12px 12px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "center", whiteSpace: "nowrap" }}>
              {contatosFiltrados.length} contatos {/* -> Célula contadora reativa exibindo a volumetria exata de contatos ativos na mesa. */}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}