// [Dev Sênior] Componente especialista desmembrado para gerenciar e tabular de forma independente a coleção de nichos comerciais. -> Inicia o arquivo trazendo o motor do React.
import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para monitorar a digitação local de termos.
import { db } from "../../config/firebase"; // -> Injeta o conector físico db exportado para permitir comandos diretos de gravação e descarte na nuvem da Google.
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore"; // -> Puxa as ferramentas especialistas do SDK do Firestore para inclusão e exclusão atômica de documentos.
import { Tag, Plus, Building2, Trash2 } from "lucide-react"; // -> Injeta as ferramentas de ícones finos, monocromáticos e sóbrios da biblioteca Lucide.

export default function GerenciadorSegmentos({ segmentosBase = [] }) { // -> Declara e exporta a função do componente recebendo o array de segmentos ativos vindo do Firebase.
  // GAVETAS DE MONITORAMENTO DE INPUT LOCAL ISOLADA
  const [novoSegmentoTexto, setNovoSegmentoTexto] = useState(""); // -> Controla o texto digitado na caixinha em tempo real para criar um novo segmento de mercado.

  // MANIPULADORES ASSÍNCRONOS DE BANCO DE DADOS: Gravam e deletam direto no Google Firestore de forma independente.
  const lidarAdicionarSegmento = async (e) => { // -> Função assíncrona executada ao enviar o formulário de novo segmento.
    e.preventDefault(); // -> Impede a página de recarregar e quebrar o estado da aplicação React.
    if (!novoSegmentoTexto.trim()) return; // -> Barreira de segurança: se o campo estiver vazio ou cheio de espaços, aborta o salvamento.
    try { // -> Inicia um bloco de proteção contra oscilações de rede.
      const colecaoRef = collection(db, "cadastros_segmentos"); // -> Conecta à tabela/coleção "cadastros_segmentos" no banco Firestore.
      await addDoc(colecaoRef, { nome: novoSegmentoTexto.trim() }); // -> Grava o novo documento com o nome do segmento higienizado na nuvem.
      setNovoSegmentoTexto(""); // -> Limpa o campo de texto da tela após salvar com sucesso.
    } catch (err) { alert("Erro de rede ao salvar segmento no Firebase!"); } // -> Exibe um aviso caso ocorra falha na conexão.
  }; // -> Encerra o gravador de segmentos.

  const lidarDeletarSegmento = async (id, nome) => { // -> Função assíncrona para excluir um segmento pelo ID único.
    const confirmar = window.confirm(`⚠️ EXCLUSÃO DE METADADOS:\nDeseja banir o segmento "${nome}" permanentemente do Firebase?`); // -> Exibe uma janela de confirmação de segurança para o usuário.
    if (confirmar) { // -> Se o usuário clicar em "OK".
      try { // -> Tenta realizar a exclusão de forma segura.
        const documentoRef = doc(db, "cadastros_segmentos", id); // -> Localiza o documento específico do segmento através do ID.
        await deleteDoc(documentoRef); // -> Deleta o documento permanentemente da nuvem do Google.
      } catch (err) { alert("Falha na autorização de descarte!"); } // -> Alerta se o usuário não tiver permissão ou houver erro de rede.
    } // -> Fim da checagem humana.
  }; // -> Encerra o deletador de segmentos.

  return ( // -> Inicia o retorno do bloco visual que desenha a interface da aba no navegador.
    <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", maxWidth: "600px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}> {/* -> Painel estrutural branco delimitado em 600px confortáveis. */}
      <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}> {/* -> Título da sub-fase forçado em letras maiúsculas. */}
        <Tag size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Componente de tag de categoria fina do Lucide. */}
        <span>Cadastro de Segmentos Independentes</span> {/* -> Texto do cabeçalho. */}
      </h3> {/* -> Fim do título. */}
      
      <form onSubmit={lidarAdicionarSegmento} style={{ display: "flex", gap: "8px", marginBottom: "16px", marginTop: "12px" }}> {/* -> Formulário inline com gatilho assíncrono acionado no botão de envio. */}
        <input 
          type="text" 
          placeholder="Digitar novo setor (Ex: Tecnologia)..." 
          value={novoSegmentoTexto} 
          onChange={(e) => setNovoSegmentoTexto(e.target.value)} 
          style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", background: "#f8fafc" }} 
        /> {/* -> Campo monitorado para digitação de novos nichos pelo usuário. */}
        <button type="submit" style={{ display: "flex", alignItems: "center", gap: "4px", background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0f172a"}>
          <Plus size={14} strokeWidth={2.5} /> {/* -> Ícone de adição fina. */}
          <span>Inserir</span> {/* -> Rótulo comercial do botão. */}
        </button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}> {/* -> Estrutura de listagem compacta em formato de tabela de dados. */}
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: "700" }}>
            <th style={{ padding: "8px 12px" }}>NOME DO NICHO / SETOR ATIVO</th>
            <th style={{ padding: "8px 12px", textAlign: "center", width: "60px" }}>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {!segmentosBase || segmentosBase.length === 0 ? ( // -> Se a lista retornada da nuvem estiver vazia, renderiza uma fileira contendo texto informativo.
            <tr><td colSpan="2" style={{ padding: "16px", textAlign: "center", color: "#64748b", fontStyle: "italic" }}>Nenhum segmento parametrizado na base.</td></tr>
          ) : (
            segmentosBase.map((seg) => ( // -> Havendo dados, percorre um a um criando linhas físicas reais na prancha.
              <tr key={seg.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: "#ffffff" }}>
                <td style={{ padding: "8px 12px", fontWeight: "700", color: "#0f172a" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building2 size={13} strokeWidth={2} style={{ color: "#64748b" }} /> {/* -> Ícone de prédio sutil indicativo do setor corporativo. */}
                    <span>{seg.nome}</span> {/* -> Mostra o nome textual do segmento de mercado gravado. */}
                  </div>
                </td>
                <td style={{ padding: "8px 12px", textAlign: "center" }}>
                  <button type="button" onClick={() => lidarDeletarSegmento(seg.id, seg.nome)} title="Excluir este segmento permanentemente" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", padding: "4px", color: "#94a3b8", transition: "color 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>
                    <Trash2 size={14} strokeWidth={2} /> {/* -> Ícone de lixeira que dispara exclusão ao receber o clique do mouse. */}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div> // -> Encerra o contêiner estrutural.
  );
}