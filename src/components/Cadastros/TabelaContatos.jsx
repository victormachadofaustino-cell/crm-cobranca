import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function TabelaContatos({ contatosFiltrados = [], empresas = [], aoEditarContato, aoExcluirContato, campoOrdenado = "", direcaoOrdenacao = "asc", aoMudarOrdenacao }) { // -> Declara a função da tabela recebendo a lista de contatos, a base de empresas-pai, as funções de clique e as chaves de ordenação.
  return ( // -> Inicia o retorno do componente visual que desenha a interface da planilha no navegador.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("nome")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              NOME DO REPRESENTANTE {campoOrdenado === "nome" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""} {/* -> Cabeçalho Nome do Representante: Ativa a alternância de A-Z ou Z-A na ordenação ao receber o clique. */}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("cpf")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              CPF JURÍDICO {campoOrdenado === "cpf" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""} {/* -> Cabeçalho CPF Jurídico: Ativa a alternância de ordenação numérica ao receber o clique do operador. */}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("telefone")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              TELEFONE CONTATO {campoOrdenado === "telefone" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""} {/* -> Cabeçalho Telefone Contato: Ativa a ordenação síncrona por DDD. */}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("email")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              CORREIO ELETRÔNICO {campoOrdenado === "email" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""} {/* -> Cabeçalho Correio Eletrônico: Ativa a ordenação por ordem de provedor de e-mail. */}
            </th>
            <th onClick={() => aoMudarOrdenacao && aoMudarOrdenacao("tipoVinculo")} style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}>
              PAPEL / VÍNCULO {campoOrdenado === "tipoVinculo" ? (direcaoOrdenacao === "asc" ? "🔼" : "🔽") : ""} {/* -> Cabeçalho Papel / Vínculo: Ativa a ordenação baseada no cargo civil do representante. */}
            </th>
            <th style={{ padding: "10px 12px", color: "#475569", fontWeight: "700" }}>
              EMPRESA-PAI ASSOCIAÇÃO {/* -> Cabeçalho de amarração relacional: Exibe o nome da empresa credora vinculada sem filtros de ordenação. */}
            </th>
            <th style={{ padding: "10px 12px", color: "#475569", fontWeight: "700", textAlign: "center", width: "80px" }}>
              AÇÕES {/* -> Cabeçalho fixo das ferramentas de controle e alteração de lote da linha. */}
            </th>
          </tr>
        </thead>
        <tbody>
          {contatosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>
                ⚖️ Nenhum representante humano foi localizado com as regras de busca ativas. {/* -> Alerta técnico centralizado cobrindo as 7 colunas da tabela de uma só vez. */}
              </td>
            </tr>
          ) : (
            contatosFiltrados.map((c) => {
              const pai = empresas.find((e) => e.id === c.empresaId); // -> MOTOR RELACIONAL: Cruza na memória RAM a ID da empresa do contato com a lista mestre de empresas para pescar o nome oficial do cliente.
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#0f172a" }}>
                    👤 {c.nome || "NOME NÃO INFORMADO"} {/* -> Célula 1: Imprime o Nome Completo do representante em negrito denso corporativo. */}
                  </td>
                  <td style={{ padding: "10px 12px", color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>
                    {c.cpf || "* REQUER ATUALIZAÇÃO *"} {/* -> Célula 2: Imprime o CPF do contato, acendendo em vermelho de alerta caso o documento possua rasuras ou asteriscos. */}
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: "bold" }}>
                    📞 {c.telefone || "NÃO INFORMADO"} {/* -> Célula 3: Imprime o número de contato telefônico com DDD higienizado. */}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#475569" }}>
                    {c.email || "Não informado"} {/* -> Célula 4: Imprime o correio eletrônico oficial de notificações em tom neutro cinza. */}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: "#f1f5f9", color: "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      {c.tipoVinculo || "Preposto"} {/* -> Célula 5: Emoldura o papel jurídico (Sócio, Advogado) em um selo cinza elegante de 11px. */}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#2563eb" }}>
                    🏢 {pai ? pai.cliente : "Não Encontrada"} {/* -> Célula 6: Exibe o nome oficial do cliente recuperado pelo cruzamento relacional em tom Azul Elétrico. */}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button type="button" onClick={() => aoEditarContato && aoEditarContato(c)} title="Editar dados deste representante" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "2px" }}>✏️</button> {/* -> Botão Lápis: Puxa o objeto completo do contato e abre o formulário preenchido em modo de alteração. */}
                      <button type="button" onClick={() => aoExcluirContato && aoExcluirContato(c.id, c.nome)} title="Excluir representante permanentemente" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "2px" }}>🗑️</button> {/* -> Botão Lixeira: Dispara o comando real de descarte NoSQL enviado diretamente para o Firestore da Google. */}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}>
            <td colSpan="6" style={{ padding: "10px 12px", fontSize: "12px" }}>
              TOTAL DE REPRESENTANTES HUMANOS ATIVOS LISTADOS: {/* -> Célula descritiva estendida cobrindo seis colunas horizontais. */}
            </td>
            <td style={{ padding: "10px 12px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "center" }}>
              {contatosFiltrados.length} contatos {/* -> Célula contadora reativa exibindo a volumetria exata de contatos ativos na mesa. */}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}