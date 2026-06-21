import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe de componentes .jsx.
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
  }; // -> Encerra o manipulador de seleção mestre.

  const lidarComSelecaoIndividualPJ = (idItem) => { // -> Função que gerencia o clique no checkbox individual de uma empresa específica.
    setItensSelecionadosExternos((anterior) => ({ // -> Acessa o estado anterior de checkboxes guardados na memória.
      ...anterior, // -> Preserva o estado de flegagem de todas as outras linhas paralelas para não apagá-las.
      [idItem]: !anterior[idItem] // -> Inverte síncronamente o booleano do item clicado: se estava desmarcado vira marcado.
    })); // -> Encerra a montagem do estado anterior de visto.
  }; // -> Encerra o manipulador de seleção individual.

  return ( // -> Dispara o desenho da interface della planilha executiva de Pessoas Jurídicas.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}> {/* -> Contêiner externo da tabela com fundo branco e barra de rolagem lateral de segurança. */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}> {/* -> Cria a tag de tabela colapsando as bordas internas e definindo o tamanho da fonte em 12px. */}
        <thead> {/* -> Abre o contêiner do cabeçalho superior da tabela onde ficam os títulos das colunas. */}
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}> {/* -> Cria a linha de títulos com fundo cinza claro e borda inferior reforçada de separação. */}
            <th style={{ padding: "14px 20px", width: "40px", textAlign: "center", userSelect: "none" }}> {/* -> Célula da caixa mestre de seleção em lote. */}
              <input type="checkbox" checked={todosPJEstaoMarcados} onChange={lidarComSelecaoMestrePJ} style={{ cursor: "pointer", width: "14px", height: "14px" }} title="Selecionar / Limpar seleção de todas as empresas visíveis" /> {/* -> Caixa de checkbox mestre que liga ou desliga a marcação de todas as empresas ao mesmo tempo. */}
            </th> {/* -> Fecha a célula do visto mestre. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("codigo"); }} style={{ padding: "14px 20px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "120px" }}> {/* -> Cabeçalho da coluna Código da Conta (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador flexbox horizontal para o texto da coluna e os ícones vetoriais. */}
                <span>CONTA</span> {/* -> Texto do cabeçalho que identifica o código da conta da empresa. */}
                {campoOrdenado === "codigo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Mostra a seta para cima se for ordem crescente ou para baixo se for decrescente. */}
              </div> {/* -> Fecha o alinhador flexbox horizontal. */}
            </th> {/* -> Fecha o cabeçalho de Conta. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("cliente"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}> {/* -> Cabeçalho da coluna Razão Social (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador flexbox horizontal de ícones e textos. */}
                <span>RAZÃO SOCIAL / ASSISTIDO</span> {/* -> Texto de identificação da Razão Social jurídica da empresa. */}
                {campoOrdenado === "cliente" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Renderiza a seta condicional de ordenação da coluna. */}
              </div> {/* -> Fecha o alinhador flexbox horizontal. */}
            </th> {/* -> Fecha o cabeçalho de Razão Social. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("cnpj"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "180px" }}> {/* -> Cabeçalho da coluna do CNPJ (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>CNPJ INSTITUCIONAL</span> {/* -> Texto identificador do documento de CNPJ federal. */}
                {campoOrdenado === "cnpj" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Desenha a seta de ordenação baseada no CNPJ. */}
              </div> {/* -> Fecha o alinhador flexbox horizontal. */}
            </th> {/* -> Fecha o cabeçalho de CNPJ. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("tipo"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "110px" }}> {/* -> Cabeçalho da coluna Tipo de Unidade (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>TIPO</span> {/* -> Texto identificador de Matriz ou Filial. */}
                {campoOrdenado === "tipo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Desenha a seta de ordenação baseada no tipo. */}
              </div> {/* -> Fecha o alinhador flexbox horizontal. */}
            </th> {/* -> Fecha o cabeçalho de Tipo. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("segmento"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none", width: "150px" }}> {/* -> Cabeçalho da coluna Segmento de Mercado (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>SEGMENTO</span> {/* -> Texto identificador do setor comercial da empresa. */}
                {campoOrdenado === "segmento" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Desenha a seta de ordenação baseada no nicho. */}
              </div> {/* -> Fecha o alinhador flexbox horizontal. */}
            </th> {/* -> Fecha o cabeçalho de Segmento. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("endereco"); }} style={{ padding: "14px 20px", cursor: "pointer", userSelect: "none" }}> {/* -> Cabeçalho da coluna Endereço (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>ENDEREÇO DA PRAÇA</span> {/* -> Texto identificador da localização física da empresa devedora. */}
                {campoOrdenado === "endereco" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Desenha a seta de ordenação baseada no endereço da praça. */}
              </div> {/* -> Fecha o alinhador flexbox horizontal. */}
            </th> {/* -> Fecha o cabeçalho de Endereço. */}
          </tr> {/* -> Encerra a fileira do cabeçalho de títulos. */}
        </thead> {/* -> Encerra o bloco de cabeçalhos. */}
        <tbody> {/* -> Abre o corpo dinâmico da tabela onde as linhas de dados reais serão inseridas. */}
          {empresasFiltradas.length === 0 ? ( // -> Operador condicional: Se o array de dados filtrados estiver completamente vazio:
            <tr> {/* -> Fabrica uma linha única de tabela para cobrir o aviso de lista vazia. */}
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600", backgroundColor: "#ffffff" }}> {/* -> Célula expandida por 7 colunas horizontais com fonte cinza e texto em negrito. */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}> {/* -> Alinhador flexbox centralizado para o ícone e texto. */}
                  <FolderMinus size={14} strokeWidth={2} /> {/* -> Desenha o ícone vetorial de pasta vazia da biblioteca Lucide. */}
                  <span>Nenhum assistido foi localizado com os parâmetros de busca ativos.</span> {/* -> Mensagem de aviso informando que a busca não encontrou registros. */}
                </div> {/* -> Fecha o alinhador de aviso. */}
              </td> {/* -> Fecha a célula expandida. */}
            </tr> // -> Encerra a linha do aviso de lista deserta.
          ) : ( // -> Caso contrário, se existirem empresas ativas retornadas pelo filtro:
            empresasFiltradas.map((e) => { // -> Inicia o mapeamento percorrendo uma por uma cada empresa do array do banco.
              const isSelecionadoIndividual = itensSelecionadosExternos[e.id] === true; // -> Investiga se o ID dessa empresa específica consta como marcado no mapa de lote.
              const stringCnpjExibição = e.cnpj || e.id || ""; // -> Puxa o CNPJ cadastrado ou resgata o próprio ID NoSQL do documento caso a propriedade venha ausente.
              const stringClienteUnificado = e.cliente || e.razaoSocial || "NOME NÃO INFORMADO"; // -> Cruzamento de duas vias NoSQL: Garante a Razão Social resgatando tanto pelo campo manual quanto pelo importado.

              return ( // -> Devolve a linha estruturada montada para cada empresa da base.
                <tr // -> Cria a linha física da tabela para a empresa da vez.
                  key={e.id} // -> Chave de rastreamento reativa exigida pelo React baseada na ID imutável do documento.
                  onClick={() => aoEditarEmpresa && aoEditarEmpresa(e)} // -> Ouve o clique do mouse em cima da linha abrindo o formulário com os dados preenchidos para alteração.
                  style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isSelecionadoIndividual ? "#f8fafc" : "#ffffff", cursor: "pointer", transition: "background 0.15s ease" }} // -> Aplica cor de fundo cinza claro se o item estiver marcado ou branco se estiver em descanso.
                  onMouseEnter={(event) => { if (!isSelecionadoIndividual) event.currentTarget.style.backgroundColor = "#f8fafc"; }} // -> Efeito de foco visual: realça a linha com cinza bem leve quando o mouse entra.
                  onMouseLeave={(event) => { if (!isSelecionadoIndividual) event.currentTarget.style.backgroundColor = "#ffffff"; }} // -> Remove o realce cinza devolvendo a cor de descanso branca ao afastar o mouse.
                > {/* -> Fecha as diretrizes estruturais da tag tr. */}
                  <td onClick={(event) => event.stopPropagation()} style={{ padding: "12px 20px", textAlign: "center", verticalAlign: "middle" }}> {/* -> Célula da caixinha de checkbox individual de lote. */}
                    <input type="checkbox" checked={isSelecionadoIndividual} onChange={() => lidarComSelecaoIndividualPJ(e.id)} style={{ cursor: "pointer", width: "13px", height: "13px" }} /> {/* -> Caixa de checkbox individual que marca ou desmarca a empresa da linha na memória RAM. */}
                  </td> {/* -> Fecha a célula do checkbox. */}
                  <td style={{ padding: "12px 20px", fontWeight: "bold", color: "#0f172a" }}>{e.codigo ? `#${e.codigo}` : "S/C"}</td> {/* -> Insere o código numérico da conta corporativa ou exibe "S/C" (Sem Código) se vier da planilha Aging. */}
                  <td style={{ padding: "12px 20px", fontWeight: "700", color: "#2563eb" }}> {/* -> Célula que exibe o nome/razão social em azul de destaque linkável. */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador horizontal flexbox para o ícone e nome. */}
                      <Building2 size={13} strokeWidth={2} style={{ color: "#2563eb" }} /> {/* -> Desenha o ícone vetorial de prédio comercial da biblioteca Lucide em azul. */}
                      <span>{stringClienteUnificado}</span> {/* -> Exibe reativamente a Razão Social corporativa em letras maiúsculas unificadas. */}
                    </div> {/* -> Fecha o alinhador horizontal. */}
                  </td> {/* -> Fecha a célula do nome da empresa. */}
                  <td style={{ padding: "12px 20px", color: stringCnpjExibição && stringCnpjExibição.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}>{stringCnpjExibição || "* REQUER ATUALIZAÇÃO *"}</td> {/* -> Exibe o CNPJ de 14 dígitos puros blindando as fileiras visuais. */}
                  <td style={{ padding: "12px 20px" }}><span style={{ background: e.tipo === "Filial" ? "#f1f5f9" : "#dbeafe", color: e.tipo === "Filial" ? "#475569" : "#1e40af", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" }}>{e.tipo || "Matriz"}</span></td> {/* -> Desenha a pílula colorida identificadora: azul para Matriz ou cinza escuro para Filiais. */}
                  <td style={{ padding: "12px 20px", color: "#64748b" }}>{e.segmento || "Geral"}</td> {/* -> Exibe o setor ou nicho de atuação da empresa cadastrada no banco. */}
                  <td style={{ padding: "12px 20px", color: "#475569", fontSize: "12px" }}>{e.endereco || "Endereço não cadastrado"} {e.cep ? `(CEP: ${e.cep})` : ""}</td> {/* -> Exibe o logradouro completo concatenado junto com o CEP geográfico. */}
                </tr> // -> Encerra a fileira física completa da empresa atualizada.
              ); // -> Encerra o retorno de escopo.
            }) // -> Encerra o mapeamento map.
          )} {/* -> Encerra a árvore de decisão condicional. */}
        </tbody> {/* -> Fecha o corpo físico da tabela de dados. */}
        <tfoot> {/* -> Inicializa a barra de sumário e rodapé permanente da planilha executiva. */}
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}> {/* -> Cria a linha de rodapé com fundo cinza e borda superior dupla cinza escuro. */}
            <td colSpan="6" style={{ padding: "14px 20px", fontSize: "12px" }}>TOTAL DE CLIENTES / ASSISTIDOS ATIVOS LISTADOS:</td> {/* -> Texto identificador do total expandido horizontalmente por 6 colunas. */}
            <td style={{ padding: "14px 20px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "right", whiteSpace: "nowrap", paddingRight: "40px" }}>{empresasFiltradas.length} empresas</td> {/* -> Exibe reativamente em azul a contagem síncrona de quantas empresas estão passando pelos filtros ativos em tela. */}
          </tr> {/* -> Encerra a fileira do rodapé. */}
        </tfoot> {/* -> Encerra o rodapé da tabela. */}
      </table> {/* -> Encerra a tag semântica de tabela html. */}
    </div> // -> Encerra o contêiner estrutural arredondado branco.
  );
}