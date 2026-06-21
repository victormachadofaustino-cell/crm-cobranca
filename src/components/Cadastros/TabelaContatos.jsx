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
  }; // -> Encerra o gerenciador de marcação em lote do cabeçalho.

  const lidarComSelecaoIndividualPF = (idItem) => { // -> Acionado ao clicar no checkbox individual de uma fileira humana específica.
    setItensSelecionadosExternos((anterior) => ({ // -> Acessa o estado anterior de checkboxes guardados na memória RAM.
      ...anterior, // -> Preserva o estado de flegagem de todas as outras linhas paralelas para não apagá-las.
      [idItem]: !anterior[idItem] // -> Inverte síncronamente o booleano do item clicado: se estava desmarcado vira marcado.
    })); // -> Fecha a montagem do estado anterior de visto.
  }; // -> Encerra o manipulador de seleção individual de pessoas.

  return ( // -> Inicia o retorno do componente visual que desenhos a interface da planilha no navegador.
    <div style={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto", width: "100%", boxSizing: "border-box" }}> {/* -> Moldura externa branca da prancha de contatos humanos com rolagem horizontal de segurança. */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}> {/* -> Tag de tabela com unificação de linhas internas e fonte compacta configurada em 12px. */}
        <thead> {/* -> Inicia a cabeceira superior de títulos da planilha de contatos. */}
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}> {/* -> Fileira cinza claro com borda de separação dupla reforçada abaixo. */}
            <th style={{ padding: "14px 20px", width: "40px", textAlign: "center", userSelect: "none" }}> {/* -> Célula que abriga a caixa de flegagem mestre de pessoas físicas. */}
              <input type="checkbox" checked={todosPFEstaoMarcados} onChange={lidarComSelecaoMestrePF} style={{ cursor: "pointer", width: "14px", height: "14px" }} title="Selecionar / Limpar selection de todos os contatos visíveis" /> {/* -> Input de checkbox superior que marca ou limpa todos os contatos da tela de uma só vez. */}
            </th> {/* -> Fecha a célula do visto em bloco. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("nome"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}> {/* -> Cabeçalho da coluna Nome (clicável para ordenar de A-Z). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador horizontal de ícones e títulos em texto. */}
                <span>NOME DO REPRESENTANTE</span> {/* -> Título que identifica o nome do contato de faturamento. */}
                {campoOrdenado === "nome" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Desenha a seta de ordenação baseada no nome alfabético. */}
              </div> {/* -> Fecha o alinhador horizontal. */}
            </th> {/* -> Fecha o cabeçalho de Nome. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("cpf"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "150px" }}> {/* -> Cabeçalho da coluna do CPF (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>CPF JURÍDICO</span> {/* -> Título que identifica o documento fiscal de CPF do representante. */}
                {campoOrdenado === "cpf" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta reativa indicadora do sentido de triagem do CPF. */}
              </div> {/* -> Fecha o alinhador. */}
            </th> {/* -> Fecha o cabeçalho do CPF. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("telefone"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "160px" }}> {/* -> Cabeçalho da coluna Telefone (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>TELEFONE CONTATO</span> {/* -> Título que identifica o número com DDD do indivíduo. */}
                {campoOrdenado === "telefone" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta reativa indicadora do sentido de triagem telefônica. */}
              </div> {/* -> Fecha o alinhador. */}
            </th> {/* ->  Fecha o cabeçalho de Telefone. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("email"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none" }}> {/* -> Cabeçalho da coluna Correio Eletrônico (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>CORREIO ELETRÔNICO</span> {/* -> Título de identificação do endereço de e-mail com @. */}
                {campoOrdenado === "email" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta indicadora da triagem de e-mails. */}
              </div> {/* -> Fecha o alinhador. */}
            </th> {/* -> Fecha o cabeçalho de E-mail. */}
            <th onClick={(e) => { e.stopPropagation(); aoMudarOrdenacao && aoMudarOrdenacao("tipoVinculo"); }} style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", cursor: "pointer", userSelect: "none", width: "150px" }}> {/* -> Cabeçalho da coluna de Papel/Vínculo civil (clicável para ordenar). */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto. */}
                <span>PAPEL / VÍNCULO</span> {/* -> Título que identifica a categoria do elo (Ex: Preposto, Sócio). */}
                {campoOrdenado === "tipoVinculo" && (direcaoOrdenacao === "asc" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />)} {/* -> Seta indicadora do sentido do vínculo. */}
              </div> {/* -> Fecha o alinhador. */}
            </th> {/* -> Fecha o cabeçalho de Vínculo. */}
            <th style={{ padding: "14px 12px", color: "#475569", fontWeight: "700", width: "220px" }}> {/* -> Cabeçalho fixo da coluna que exibe a empresa controladora. */}
              EMPRESA-PAI ASSOCIAÇÃO {/* -> Título indicador da amarração relacional da Pessoa Jurídica credora. */}
            </th> {/* -> Fecha o cabeçalho relacional. */}
          </tr> {/* -> Encerra a fileira superior de títulos. */}
        </thead> {/* -> Encerra a cabeceira. */}
        <tbody> {/* -> Inicia o corpo dinâmico para renderizar as fileiras de representantes humanos na prancha. */}
          {contatosFiltrados.length === 0 ? ( // -> Operador condicional: Se a busca de contatos humanos retornar vazia:
            <tr> {/* -> Cria uma linha única estendida para acomodar a mensagem. */}
              <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#64748b", fontWeight: "600", backgroundColor: "#ffffff" }}> {/* -> Célula de aviso estendida por todas as 7 colunas horizontais da folha. */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}> {/* -> Alinhador central do aviso. */}
                  <FolderMinus size={14} strokeWidth={2} /> {/* -> Desenha o vetor linear de pasta vazia do Lucide. */}
                  <span>Nenhum representante humano foi localizado com as regras de busca ativas.</span> {/* -> Texto informativo de lista deserta para instruir o cobrador. */}
                </div> {/* -> Fecha o alinhador. */}
              </td> {/* -> Fecha a célula de aviso. */}
            </tr> // -> Encerra a linha de aviso.
          ) : ( // -> Caso contrário, se existirem representantes retornados na RAM:
            contatosFiltrados.map((c) => { // -> Abre o laço de repetição percorrendo contato por contato da base de dados síncrona.
              const pai = empresas.find((e) => e.id === c.empresaId); // -> CHAVE RELACIONAL: Localiza na lista de empresas a ficha da PJ que possui a ID correspondente à empresaId do contato.
              const isSelecionadoIndividual = itensSelecionadosExternos[c.id] === true; // -> Verifica se o checkbox dessa linha específica está flegado como verdadeiro no lote global.

              return ( // -> Retorna o desenho da fileira para cada contato humano encontrado.
                <tr // -> Fabrica a linha tr física da prancha de representantes.
                  key={c.id} // -> Chave única reativa exigida pelo React baseada na ID do contato na nuvem.
                  onClick={() => aoEditarContato && aoEditarContato(c)} // -> Ouve o clique na linha abrindo o formulário lateral preenchido com os dados do contato para alteração.
                  style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: isSelecionadoIndividual ? "#f8fafc" : "#ffffff", cursor: "pointer", transition: "background 0.15s ease" }} // -> Pinta a linha com fundo azul/cinza suave se estiver marcada no lote ou branco se estiver em descanso.
                > {/* -> Fecha as especificações de estilo da linha. */}
                  <td onClick={(event) => event.stopPropagation()} style={{ padding: "12px 20px", textAlign: "center", verticalAlign: "middle" }}> {/* -> Célula que abriga o checkbox individual da linha (bloqueia o clique de abrir o formulário por acidente). */}
                    <input type="checkbox" checked={isSelecionadoIndividual} onChange={() => lidarComSelecaoIndividualPF(c.id)} style={{ cursor: "pointer", width: "13px", height: "13px" }} /> {/* -> Caixa de checkbox individual que flega ou desmarca a Pessoa Física na memória. */}
                  </td> {/* -> Fecha a célula. */}
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#0f172a" }}> {/* -> Célula do nome do representante. */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador de ícone e texto inline. */}
                      <User size={13} strokeWidth={2} style={{ color: "#0f172a" }} /> {/* -> Ícone vetorial geométrico de usuário em linhas finas. */}
                      <span>{c.nome || "NOME NÃO INFORMADO"}</span> {/* -> Imprime o nome completo do representante mapeado no banco. */}
                    </div> {/* -> Fecha o alinhador. */}
                  </td> {/* -> Fecha a célula de nome. */}
                  <td style={{ padding: "10px 12px", color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#0f172a", fontWeight: "600" }}> {/* -> Célula do CPF (acende em vermelho de alerta caso exija coleta). */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador horizontal. */}
                      <Fingerprint size={13} strokeWidth={2} style={{ color: c.cpf && c.cpf.includes("*") ? "#ef4444" : "#64748b" }} /> {/* -> Desenha a digital vetorial fina do Lucide em vermelho ou cinza. */}
                      <span>{c.cpf || "* REQUER ATUALIZAÇÃO *"}</span> {/* -> Exibe o número de CPF do indivíduo ou emite a string vermelha de alerta obrigatório. */}
                    </div> {/* -> Fecha o alinhador. */}
                  </td> {/* -> Fecha a célula do CPF. */}
                  <td style={{ padding: "10px 12px", fontWeight: "bold", color: "#0f172a" }}> {/* -> Célula do telefone com DDD em negrito destacado. */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador horizontal. */}
                      <Phone size={13} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> Desenha o vetor outline de telefone. */}
                      <span>{c.telefone || "NÃO INFORMADO"}</span> {/* -> Imprime o número telefônico limpo do contato. */}
                    </div> {/* -> Fecha o alinhador. */}
                  </td> {/* -> Fecha a célula do telefone. */}
                  <td style={{ padding: "10px 12px", color: "#475569" }}> {/* -> Célula de exibição de e-mail eletrônico. */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador horizontal. */}
                      <Mail size={13} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> Desenha o vetor outline de envelope de cartas. */}
                      <span>{c.email || "Não informado"}</span> {/* -> Exibe o endereço de e-mail com arroba validado. */}
                    </div> {/* -> Fecha o alinhador. */}
                  </td> {/* -> Fecha a célula de e-mail. */}
                  <td style={{ padding: "10px 12px" }}> {/* -> Célula que renderiza a pílula de vínculo contratual. */}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#f1f5f9", color: "#475569", fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}> {/* -> Pílula oval cinza de metadado. */}
                      <Link size={10} strokeWidth={2.5} /> {/* -> Desenha o mini elo de corrente do Lucide. */}
                      <span>{c.tipoVinculo || "Preposto"}</span> {/* -> Imprime a categoria jurídica do representante humano. */}
                    </span> {/* -> Encerra a pílula. */}
                  </td> {/* -> Fecha a célula de papel. */}
                  <td style={{ padding: "10px 12px", fontWeight: "700", color: "#2563eb" }}> {/* -> Célula mestre que exibe a empresa controladora em azul de destaque. */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador horizontal flexbox. */}
                      <Building2 size={13} strokeWidth={2} style={{ color: "#2563eb" }} /> {/* -> Desenha o ícone vetorial de prédio corporativo azul em linhas finas. */}
                      <span>{pai ? (pai.cliente || pai.razaoSocial) : "Não Encontrada"}</span> {/* -> RE-CALIBRADO: Exibe reativamente o nome mestre ou a razão social oriunda da planilha Excel, banindo colunas vazias de registros importados! */}
                    </div> {/* -> Fecha o alinhador horizontal relacional. */}
                  </td> {/* -> Fecha a célula relacional de empresa-pai. */}
                </tr> // -> Encerra a fileira física completa da Pessoa Física na prancha.
              ); // -> Encerra o retorno do map.
            }) // -> Encerra o mapeamento síncrono.
          )} {/* -> Encerra a árvore condicional de listagens. */}
        </tbody> {/* -> Fecha o corpo de dados da tabela. */}
        <tfoot> {/* -> Inicializa a barra de somatórios e rodapé fixo inferior da prancha. */}
          <tr style={{ background: "#f8fafc", borderTop: "2px solid #e2e8f0", fontWeight: "bold", color: "#1e293b" }}> {/* -> Linha de fechamento com fundo cinza e friso duplo escuro superior. */}
            <td colSpan="6" style={{ padding: "14px 20px", fontSize: "12px" }}> {/* -> Texto identificador do total expandido por 6 raias horizontais. */}
              TOTAL DE REPRESENTANTES HUMANOS ATIVOS LISTADOS: {/* -> Rótulo formal do rodapé em caixa alta. */}
            </td> {/* -> Fecha a célula do rótulo. */}
            <td style={{ padding: "14px 20px", fontSize: "12px", fontWeight: "800", color: "#2563eb", textAlign: "right", whiteSpace: "nowrap", paddingRight: "40px" }}> {/* -> Célula numérica alinhada à direita em azul de destaque. */}
              {contatosFiltrados.length} contatos {/* -> Conta síncronamente na memória RAM quantos contatos passaram pelas caixas de buscas simultâneas. */}
            </td> {/* -> Fecha a célula da somatória final. */}
          </tr> {/* -> Encerra a fileira final da tabela. */}
        </tfoot> {/* -> Encerra o rodapé permanente da planilha. */}
      </table> {/* -> Encerra a tag semântica de tabela html. */}
    </div> // -> Encerra o contêiner estrutural arredondado branco do representante.
  );
}