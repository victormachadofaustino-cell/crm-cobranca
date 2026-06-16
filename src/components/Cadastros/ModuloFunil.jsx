import React, { useState, useEffect } from "react"; // -> Traz a biblioteca mestre do React e os ganchos de estado e efeito nativos.
import { db } from "../../config/firebase"; // -> Injeta o conector físico do banco para permitir comandos diretos à nuvem.
import { doc, onSnapshot, updateDoc } from "firebase/firestore"; // -> Puxa as ferramentas estáveis do SDK para monitorar e atualizar um documento específico.

export default function ModuloFunil() { // -> Define e exporta a função mestre que gerencia a interface de parametrização de etapas.
  const [etapas, setEtapas] = useState([]); // -> Bandeja de memória RAM que guarda o array vivo de etapas vindo em tempo real do Firebase.
  const [novoNome, setNovoNome] = useState(""); // -> Monitora o texto digitado caractere por caractere para o nome da nova etapa.
  const [novoId, setNovoId] = useState(""); // -> Monitora o texto digitado para a ID exclusiva (chave técnica) da etapa.
  const [novaCategoria, setNovaCategoria] = useState("em_andamento"); // -> Monitora a categoria mãe selecionada no dropdown (padrão: em_andamento).
  const [carregando, setCarregando] = useState(true); // -> Controla o aviso visual de carregamento de rede na tela.

  // -> ESTADOS LOCAIS OPERACIONAIS PARA A FIAÇÃO DE EDIÇÃO EM LINHA DOS METADADOS DO FUNIL
  const [idEtapaEmEdicao, setIdEtapaEmEdicao] = useState(null); // -> Memoriza na RAM qual ID de etapa está sofrendo alteração ativa pelo administrador.
  const [editNome, setEditNome] = useState(""); // -> Guarda o rascunho temporário do nome da etapa durante o processo de edição.
  const [editCategoria, setEditCategoria] = useState(""); // -> Guarda o rascunho temporário da macro-categoria Core mãe durante o processo de edição.

  // -> MATRIZ DE CATEGORIAS CORE DO CLICKUP: Regras de negócio imutáveis que o sistema usa para travas matemáticas.
  const categoriasCore = [
    { id: "inicio", nome: "Início (A Iniciar)" },
    { id: "em_andamento", nome: "Em Andamento (Atrito)" },
    { id: "feito", nome: "Feito (Acordos / Previsões)" },
    { id: "final", nome: "Final (Encerrados / Quitados)" }
  ]; // -> Encerra a matriz de categorias mãe estáveis.

  useEffect(() => { // -> Ativa o cordão de rede assíncrono assim que o componente liga na tela.
    const docRef = doc(db, "config_funil", "padrao"); // -> Aponta a mira do leitor diretamente para o documento fixo de configuração.
    
    const monitorarFunil = onSnapshot(docRef, (snapshot) => { // -> Grampeia the documento trazendo modificações da nuvem em tempo real.
      if (snapshot.exists()) { // -> Valida se o nó físico existe dentro do Firestore.
        const dados = snapshot.data(); // -> Extrai os mapas NoSQL do documento.
        setEtapas(dados.etapas || []); // -> Aloca o array de etapas na gaveta reativa do visor.
      } // -> Fim da checagem de existência.
      setCarregando(false); // -> Desliga o aviso visual de carregamento.
    }, (error) => {
      alert("Erro crítico de barramento ao ler configuração do funil!"); // -> Alerta o operador caso haja bloqueio de segurança.
    });

    return () => monitorarFunil(); // -> Desliga a escuta ao sair da tela para poupar tráfego de dados e memória RAM.
  }, []); // -> Indica que o efeito roda apenas uma vez na inicialização.

  const lidarAdicionarEtapa = async (e) => { // -> Função assíncrona que empacota e insere uma nova etapa no array da nuvem.
    e.preventDefault(); // -> Bloqueia o recarregamento padrão da página para reter os inputs digitados.
    
    const idLimpo = novoId.trim().toLowerCase().replace(/\s+/g, "_"); // -> Higieniza a ID forçando caixa baixa e trocando espaços por underlines.
    const nomeLimpo = novoNome.trim(); // -> Corta espaços mortos das pontas do nome corporativo.

    if (!nomeLimpo || !idLimpo) { // -> Trava de barreira contra envios em branco.
      alert("⚠️ CAMPOS OBRIGATÓRIOS:\nPreencha o Nome e a ID da nova etapa."); // -> Emite o aviso técnico.
      return; // -> Aborta a execução.
    }

    if (etapas.some(etapa => typeof etapa === "object" && etapa !== null && etapa.id === idLimpo)) { // -> Varre a RAM checando duplicidade técnica para não corromper o Kanban.
      alert("⚠️ ID DUPLICADA:\nEsta chave identificadora já está sendo usada por outra etapa!"); // -> Avisa o operador.
      return; // -> Aborta a descida.
    }

    const novaEtapaObjeto = { id: idLimpo, nome: nomeLimpo, categoria: novaCategoria }; // -> Estrutura o novo mapa simétrico compatível com o ClickUp.
    const novoArrayConsolidado = [...etapas, novaEtapaObjeto]; // -> Cria uma nova lista fundindo as etapas antigas com o novo membro.

    try { // -> Escudo de proteção para disparar a gravação internacional da Google.
      const docRef = doc(db, "config_funil", "padrao"); // -> Localiza o endereço físico do documento.
      await updateDoc(docRef, { etapas: novoArrayConsolidado }); // -> Grava o lote completo de faturamento do funil sobrescrevendo o array.
      setNovoNome(""); setNovoId(""); setNovaCategoria("em_andamento"); // -> Reseta os três inputs locais do formulário de parametrização.
      alert("🟩 ETAPA HOMOLOGADA!\nNova coluna injetada no pipeline dinâmico com sucesso."); // -> Alerta humano de sucesso.
    } catch (err) {
      alert("Falha de rede ao persistir nova etapa no Firestore!"); // -> Contingência neutra em caso de queda de sinal.
    }
  };

  const lidarSalvarEdicaoEtapa = async (idTarget) => { // -> Disparado ao clicar no disquete após alterar as caixas correspondentes.
    const nomeHigienizado = editNome.trim(); // -> Corta as rebarbas de texto digitadas na planilha.
    if (!nomeHigienizado) { // -> Impede o carimbo de strings vazias para não deixar raias invisíveis no Kanban.
      alert("⚠️ VALIDAÇÃO:\nO nome da etapa de faturamento não pode ficar em branco."); // -> Alerta o advogado.
      return; // -> Interrompe a descida de rede.
    }

    const listaModificada = etapas.map((etapa) => { // -> Transforma o lote inteiro na RAM local alterando cirurgicamente o ID sob modificação.
      if (typeof etapa === "object" && etapa !== null && etapa.id === idTarget) { // -> Encontra o alvo da alteração.
        return { ...etapa, nome: nomeHigienizado, categoria: editCategoria }; // -> Insere o novo nome e a nova raia do ClickUp mantendo o ID fixo.
      }
      return etapa; // -> Mantém as outras linhas intactas.
    });

    try { // -> Despacha o lote consolidado em canal assíncrono para reajustar o pipeline global.
      const docRef = doc(db, "config_funil", "padrao"); // -> Localiza o endereço físico.
      await updateDoc(docRef, { etapas: listaModificada }); // -> Sobrescreve o array de uma vez no banco NoSQL.
      setIdEtapaEmEdicao(null); // -> Desliga o modo de edição fechando as caixas de inputs da linha.
      alert("🟩 ETAPA ATUALIZADA!\nAs alterações foram propagadas e já refletem em todo o CRM."); // -> Feedback de sucesso.
    } catch (err) {
      alert("Falha crítica de barramento ao atualizar dados da etapa!"); // -> Contingência contra instabilidade de sinal.
    }
  };

  const prepararModoEdicao = (etapa) => { // -> Disparado ao clicar no ícone do lápis para abrir as caixas de texto.
    setIdEtapaEmEdicao(etapa.id); // -> Trava a ID della linha ativa na memória de foco.
    setEditNome(etapa.nome || ""); // -> Preenche o input rascunho com o nome histórico salvo.
    setEditCategoria(etapa.categoria || "em_andamento"); // -> Alinha o dropdown com a macro-categoria Core salva.
  };

  const lidarMoverEtapaLote = async (indiceAtual, direcao) => { // -> Acionado pelas setas direcionais da planilha.
    const novoIndiceDestino = direcao === "subir" ? indiceAtual - 1 : indiceAtual + 1; // -> Calcula matematicamente para onde o item deve caminhar no array.
    if (novoIndiceDestino < 0 || novoIndiceDestino >= etapas.length) return; // -> Trava antiqueda contra estouros de limite de vetor horizontais.

    const arrayRascunhoRAM = [...etapas]; // -> Clona a lista do Firebase para evitar mutações cegas em lote.
    const itemEmMovimento = arrayRascunhoRAM[indiceAtual]; // -> Captura a ficha da etapa que recebeu o clique.
    
    arrayRascunhoRAM[indiceAtual] = arrayRascunhoRAM[novoIndiceDestino]; // -> Executa a permuta: joga o vizinho para a posição antiga.
    arrayRascunhoRAM[novoIndiceDestino] = itemEmMovimento; // -> Executa a permuta: deposita o item na sua nova vaga de prioridade.

    try { // -> Arremessa a nova lista reordenada de uma vez para o cofre da Google.
      const docRef = doc(db, "config_funil", "padrao"); // -> Localiza o endereço físico fixo.
      await updateDoc(docRef, { etapas: arrayRascunhoRAM }); // -> Sobrescreve a sequência indexada salvando a nova ordem.
    } catch (err) {
      alert("Falha de comunicação ao sincronizar prioridade de índices!"); // -> Proteção contra perdas de sinal.
    }
  };

  const lidarDeletarEtapa = async (idEtapa, nomeEtapa) => { // -> Função assíncrona que expurga uma etapa do lote NoSQL da nuvem.
    const confirmar = window.confirm(`⚠️ EXCLUSÃO DE COLUNA:\nDeseja banir permanentemente a etapa "${nomeEtapa}"?\n\nCards antes estacionados nesta fase precisarão ser realocados.`); // -> Pop-up nativo de barreira humana.
    if (!confirmar) return; // -> Desiste da operação se o usuário clicar em cancelar.

    const novoArrayFiltrado = etapas.filter(etapa => typeof etapa === "object" && etapa !== null ? etapa.id !== idEtapa : true); // -> Expurga o item selecionado filtrando a lista em memória RAM.

    try { // -> Tenta a remoção física no servidor.
      const docRef = doc(db, "config_funil", "padrao"); // -> Localiza a rota física estável.
      await updateDoc(docRef, { etapas: novoArrayFiltrado }); // -> Atualiza o nó na nuvem refletindo o descarte imediatamente no Kanban.
      alert("🟩 EXCLUSÃO CONCLUÍDA!\nA coluna foi retirada das grades do sistema."); // -> Alerta o sucesso.
    } catch (err) {
      alert("Falha na autorização de descarte do funil!"); // -> Proteção contra internet instável.
    }
  };

  if (carregando) { // -> Validação de barreira visual de carregamento.
    return <div style={{ fontSize: "12px", color: "#64748b", padding: "32px", fontWeight: "600", letterSpacing: "0.5px" }}>🔄 Sincronizando barramento do funil com o Firestore...</div>; // -> Texto plano temporário de espera com visual aprimorado.
  }

  return ( // -> Renderiza a interface administrativa com design executivo premium refinado de alta performance.
    <div style={{ background: "#ffffff", padding: "28px", borderRadius: "12px", border: "1px solid #e2e8f0", maxWidth: "950px", margin: "0 auto", textAlign: "left", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
      
      {/* 🧭 CABEÇALHO DA INTERFACE PREMIUM */}
      <div style={{ marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px" }}>⚙️ Configuração de Etapas do Funil (CRM)</h3>
        <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>Configure, reordene e mude as regras das raias verticais do seu funil ClickUp conectadas à automação NoSQL.</p>
      </div>

      {/* ➕ FORMULÁRIO DE INCLUSÃO PREMIUM DESIGN INLINE */}
      <form onSubmit={lidarAdicionarEtapa} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 120px", gap: "12px", alignItems: "flex-end", marginBottom: "28px", backgroundColor: "#ffffff", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.01)" }}>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
          <label style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "6px", letterSpacing: "0.5px" }}>NOME DA ETAPA *</label>
          <input type="text" placeholder="Ex: Notificação Cartório" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", backgroundColor: "#f8fafc" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
          <label style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "6px", letterSpacing: "0.5px" }}>ID DA CHAVE TECHNICAL *</label>
          <input type="text" placeholder="Ex: notificacao_cartorio" value={novoId} onChange={(e) => setNovoId(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", backgroundColor: "#f8fafc", fontFamily: "monospace" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
          <label style={{ fontSize: "10px", fontWeight: "800", color: "#475569", marginBottom: "6px", letterSpacing: "0.5px" }}>CATEGORIA MÃE CORE *</label>
          <select value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", fontWeight: "700", cursor: "pointer", color: "#0f172a" }}>
            {categoriasCore.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "10px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", height: "37px" }}>+ Inserir</button>
      </form>

      {/* 📊 GRADE PLANILHADA EXECUTIVA DE ALTÍSSIMO CONTRASTE */}
      <div style={{ borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", backgroundColor: "#ffffff" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: "800" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", width: "80px" }}>PRIORIDADE</th>
              <th style={{ padding: "12px 16px", textAlign: "left" }}>NOME VISÍVEL DA COLUNA</th>
              <th style={{ padding: "12px 16px", textAlign: "left", width: "160px" }}>CHAVE TÉCNICA (ID)</th>
              <th style={{ padding: "12px 16px", textAlign: "left", width: "180px" }}>CATEGORIA GOVERNANÇA CORE</th>
              <th style={{ padding: "12px 16px", textAlign: "center", width: "140px" }}>AÇÕES DISPONÍVEIS</th>
            </tr>
          </thead>
          <tbody>
            {etapas.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>📭 Nenhuma raia configurada no documento padrão de funil.</td></tr>
            ) : (
              etapas.map((etapa, idx) => typeof etapa === "object" && etapa !== null ? ( 
                <tr key={etapa.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: idEtapaEmEdicao === etapa.id ? "#fff7ed" : "transparent", transition: "background 0.2s" }}>
                  
                  {/* 🛠️ ALINHAMENTO DO BLOCO DE CONTROLE DE ÍNDICES DE SEQUENCIA */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "10px", background: "#f1f5f9", color: "#475569", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", fontFamily: "monospace" }}>#{idx + 1}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <button type="button" disabled={idx === 0} onClick={() => lidarMoverEtapaLote(idx, "subir")} style={{ background: "none", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer", fontSize: "9px", padding: 0, opacity: idx === 0 ? 0.15 : 0.7, lineHeight: 1 }} title="Subir prioridade (Mover para esquerda no Kanban)">▲</button>
                        <button type="button" disabled={idx === etapas.length - 1} onClick={() => lidarMoverEtapaLote(idx, "descer")} style={{ background: "none", border: "none", cursor: idx === etapas.length - 1 ? "not-allowed" : "pointer", fontSize: "9px", padding: 0, opacity: idx === etapas.length - 1 ? 0.15 : 0.7, lineHeight: 1 }} title="Descer prioridade (Mover para direita no Kanban)">▼</button>
                      </div>
                    </div>
                  </td>

                  {/* COLUNA 2: NOME DA ETAPA RE-ESTILIZADA COM COMPONENTES FORM */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle", textAlign: "left" }}>
                    {idEtapaEmEdicao === etapa.id ? (
                      <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} style={{ padding: "5px 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px", width: "90%", fontWeight: "700", color: "#0f172a", backgroundColor: "#ffffff" }} />
                    ) : (
                      <span style={{ color: "#0f172a", fontWeight: "700", fontSize: "13px" }}>📊 {etapa.nome}</span>
                    )}
                  </td>

                  {/* COLUNA 3: ID TÉCNICA */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle", color: "#64748b", fontFamily: "monospace", textAlign: "left" }}>{etapa.id}</td>

                  {/* COLUNA 4: CATEGORIA CORE */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle", textAlign: "left" }}>
                    {idEtapaEmEdicao === etapa.id ? (
                      <select value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} style={{ padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "12px", background: "#ffffff", fontWeight: "700", color: "#0f172a", cursor: "pointer" }}>
                        {categoriasCore.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.id.toUpperCase()}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ fontSize: "10px", background: etapa.categoria === "feito" ? "#eff6ff" : etapa.categoria === "final" ? "#f0fdf4" : "#f1f5f9", color: etapa.categoria === "feito" ? "#1e40af" : etapa.categoria === "final" ? "#065f46" : "#475569", padding: "3px 8px", borderRadius: "4px", fontWeight: "800", letterSpacing: "0.5px" }}>
                        📁 {etapa.categoria ? etapa.categoria.toUpperCase() : "N/D"}
                      </span>
                    )}
                  </td>

                  {/* COLUNA 5: GATILHOS DE COMANDOS SELETIVOS ALINHADOS EM TOOLBELT */}
                  <td style={{ padding: "12px 16px", verticalAlign: "middle", textAlign: "center" }}>
                    {idEtapaEmEdicao === etapa.id ? ( // 🛠️ FIÇÃO TOTALMENTE PROTEGIDA: Os comentários antigos soltos foram embutidos com segurança absoluta aqui dentro das células td para silenciar de vez o validateDOMNesting!
                      <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center" }}>
                        <button type="button" onClick={() => lidarSalvarEdicaoEtapa(etapa.id)} title="Gravar alterações no Firebase" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: 0 }}>💾</button>
                        <button type="button" onClick={() => setIdEtapaEmEdicao(null)} title="Cancelar e restaurar histórico" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: 0 }}>❌</button>
                      </div>
                    ) : ( 
                      <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center" }}>
                        <button type="button" onClick={() => prepararModoEdicao(etapa)} title="Editar nome ou categoria core" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: 0, opacity: 0.8 }}>✏️</button>
                        <button type="button" onClick={() => lidarDeletarEtapa(etapa.id, etapa.nome)} title="Excluir esta etapa permanentemente do funil" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: 0, opacity: 0.8 }}>🗑️</button>
                      </div>
                    )}
                  </td>

                </tr>
              ) : null)
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}