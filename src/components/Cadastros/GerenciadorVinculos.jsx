// [Dev Sênior] Componente especialista desmembrado e isolado para gerenciar, cadastrar e tabular de forma autônoma a coleção de vínculos civis. -> Inicia o arquivo trazendo o motor do React.
import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar e gerenciar a digitação de textos locais em RAM.
import { db } from "../../config/firebase"; // -> Injeta o conector físico db exportado para permitir comandos diretos de gravação e descarte na nuvem da Google.
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore"; // -> Puxa as ferramentas especialistas estáveis do SDK do Firestore para inclusão e exclusão atômica de documentos.
import { Link2, Plus, User, Trash2 } from "lucide-react"; // -> Injeta a engine de ícones finos, monocromáticos e sóbrios da biblioteca Lucide para garantir o padrão visual ClickUp.

export default function GerenciadorVinculos({ vinculosBase = [] }) { // -> Declara e exporta a função do componente recebendo o array de vínculos ativos vindo de fora através de propriedades (props).
  // GAVETA DE MONITORAMENTO DE INPUT LOCAL ISOLADA
  const [novoVinculoTexto, setNovoVinculoTexto] = useState(""); // -> Controla reativamente o texto digitado na caixinha em tempo real para criar um novo tipo de vínculo civil (Ex: Diretor Financeiro).

  // MANIPULADORES ASSÍNCRONOS DE BANCO DE DADOS: Gravam e deletam direto no Google Firestore de forma independente.
  const lidarAdicionarVinculo = async (e) => { // -> Função assíncrona executada ao enviar o formulário para registrar um novo elo civil humano.
    e.preventDefault(); // -> Impede a página do navegador de recarregar e perder os estados da aplicação.
    if (!novoVinculoTexto.trim()) return; // -> Barreira de segurança: se o campo estiver vazio ou preenchido com espaços fantasmas, aborta o salvamento.
    try { // -> Abre o escudo de proteção contra oscilações de rede e quedas de internet.
      const colecaoRef = collection(db, "cadastros_vinculos"); // -> Conecta o barramento de rede diretamente com a coleção "cadastros_vinculos" no Firestore.
      await addDoc(colecaoRef, { label: novoVinculoTexto.trim() }); // -> Injeta o documento limpo usando a chave regulamentar 'label' e deixando o Firebase gerar a ID automaticamente.
      setNovoVinculoTexto(""); // -> Limpa o campo de entrada de texto na tela preparando-o para o próximo cadastro do operador.
    } catch (err) { alert("Erro de rede ao salvar vínculo no Firebase!"); } // -> Exibe um aviso amigável em tela caso ocorra alguma falha na transmissão com a nuvem.
  }; // -> Encerra o gravador de elos humanos.

  const lidarDeletarVinculo = async (id, label) => { // -> Função assíncrona encarregada de remover uma categoria civil pelo ID exclusivo do documento.
    const confirmar = window.confirm(`⚠️ EXCLUSÃO DE METADADOS:\nDeseja banir o vínculo "${label}" permanentemente do Firebase?`); // -> Pop-up de barreira humana exigindo que o operador aprove o descarte permanente.
    if (confirmar) { // -> Se o usuário clicar no botão "OK" confirmando a intenção de descarte:
      try { // -> Tenta realizar a exclusão física do nó remoto de forma segura.
        const documentoRef = doc(db, "cadastros_vinculos", id); // -> Localiza a rota física exata da referência do documento do vínculo no Firestore.
        await deleteDoc(documentoRef); // -> Tritura o documento permanentemente e remove o cargo da base de dados em nuvem da Google.
      } catch (err) { alert("Falha na autorização de descarte!"); } // -> Alerta o operador caso haja algum bloqueio de segurança nas regras de escrita.
    } // -> Fim da checagem humana.
  }; // -> Encerra o deletador de elos humanos.

  return ( // -> Inicia a renderização do bloco visual que desenha a interface da sub-aba de vínculos no navegador do usuário.
    <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}> {/* -> Bloco estrutural branco com bordas suavizadas em 8px e limite de largura de 600px simétricos. */}
      <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}> {/* -> Título da sub-aba forçado em letras maiúsculas no padrão executivo rígido. */}
        <Link2 size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Componente de ícone vetorial de elo de corrente fina do Lucide. */}
        <span>Cadastro de Tipos de Vínculos Civis</span> {/* -> Rótulo explicativo do cabeçalho do gerenciador. */}
      </h3> {/* -> Fim do bloco de título. */}
      
      <form onSubmit={lidarAdicionarVinculo} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}> {/* -> Formulário inline que monitora o envio e dispara o gatilho assíncrono de gravação. */}
        <input 
          type="text" 
          placeholder="Digitar novo elo (Ex: Gerente Geral)..." 
          value={novoVinculoTexto} 
          onChange={(e) => setNovoVinculoTexto(e.target.value)} 
          style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", background: "#f8fafc" }} 
        /> {/* -> Caixa de digitação monitorada pelo estado reativo local para novos elos contratuais. */}
        <button type="submit" style={{ display: "flex", alignItems: "center", gap: "4px", background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>
          <Plus size={14} strokeWidth={2.5} /> {/* -> Mini ícone de sinal de cruz de adição fina. */}
          <span>Inserir</span> {/* -> Texto de rótulo do botão de salvamento. */}
        </button> {/* -> Botão sólido escuro regulamentar da DOCULOC. */}
      </form> {/* -> Encerra o formulário. */}

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}> {/* -> Estrutura modular compacta de listagem em formato de tabela de dados. */}
        <thead> {/* -> Cabeçalho de títulos da grade de vínculos. */}
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: "700" }}> {/* -> Fileira cinza claro com linha demarcadora inferior dupla. */}
            <th style={{ padding: "8px 12px" }}>CATEGORIA / PAPEL INSTITUCIONAL</th> {/* -> Título que identifica a coluna de cargos listados. */}
            <th style={{ padding: "8px 12px", textAlign: "center", width: "60px" }}>AÇÕES</th> {/* -> Título que identifica a coluna de botões de controle de descarte. */}
          </tr> {/* -> Fim da fileira de títulos. */}
        </thead> {/* -> Fim do cabeçalho. */}
        <tbody> {/* -> Abre o corpo dinâmico para preenchimento das linhas vindas do Firebase. */}
          {vinculosBase.length === 0 ? ( // -> Operador condicional de UX: Se a coleção vinda de fora estiver deserta:
            <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>Nenhuma categoria parametrizada na base.</td></tr> // -> Renderiza uma linha cinza em itálico informando que não há registros.
          ) : ( // -> Caso contrário, se existirem registros de papéis civis arquivados na nuvem:
            vinculosBase.map((vin) => ( // -> Abre o laço map percorrendo cargo por cargo gerando as linhas físicas na tela.
              <tr key={vin.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}> {/* -> Linha branca individual da categoria com identificação de chave ID obrigatória do React. */}
                <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}> {/* -> Célula de texto que exibe a label do cargo. */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}> {/* -> Alinhador flexbox horizontal de ícone e string. */}
                    <User size={13} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> Ícone sutil outline de perfil de usuário do Lucide. */}
                    <span>{vin.label}</span> {/* -> Imprime na célula o texto exato do papel jurídico do representante. */}
                  </div> {/* -> Fim do alinhador. */}
                </td> {/* -> Fim da célula de texto. */}
                <td style={{ padding: "8px 12px", textAlign: "center" }}> {/* -> Célula centralizada contendo o gatilho de exclusão. */}
                  <button type="button" onClick={() => lidarDeletarVinculo(vin.id, vin.label)} title="Excluir este vínculo permanentemente" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                    <Trash2 size={14} strokeWidth={2} /> {/* -> Desenha a mini lixeira linear cinza que acende em vermelho vivo no mouseenter, disparando a exclusão física na nuvem ao ser clicada. */}
                  </button> {/* -> Encerra o botão lixeira. */}
                </td> {/* -> Fim da célula de ações. */}
              </tr> // -> Encerra a fileira da categoria civil.
            )) // -> Encerra o loop mapeador.
          )} {/* -> Encerra a árvore condicional de listagens. */}
        </tbody> {/* -> Fecha o corpo da tabela. */}
      </table> {/* -> Fecha a tag semântica de tabela html. */}
    </div> // -> Encerra o painel estrutural do gerenciador de vínculos.
  );
}