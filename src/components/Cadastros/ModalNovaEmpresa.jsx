import React, { useState } from "react"; // -> Traz a biblioteca nativa do React e o gancho useState para gerenciar os estados de carregamento do barramento da BrasilAPI.
import { Building2, X, FileKey, Network, Fingerprint, Tag, MapPin, Map, Loader2 } from "lucide-react"; // -> Injeta as engines de ícones finos do Lucide, adicionando o Loader2 para animações de sincronização.

export default function ModalNovaEmpresa({ aberto, aoFechar, tratarCadastroEmpresa, empCodigo, setEmpCodigo, empNome, setEmpNome, empCnpj, setEmpCnpj, empIsFilial, setEmpIsFilial, empSegmento, setEmpSegmento, empEndereco, setEmpEndereco, empCep, setEmpCep, listaSegmentos = [] }) { // -> Define e exporta o componente recebendo os estados de monitoração de digitação do maestro e a lista viva de segmentos do Firebase.
  
  // 🛰️ CONTROLADORES DE INTEGRAÇÃO DE APIs EXTERNAS
  const [carregandoCnpj, setCarregandoCnpj] = useState(false); // -> Monitora o status da requisição de rede para renderizar os loaders visuais na tela.

  if (!aberto) return null; // -> TRAVA DE SEGURANÇA: Se o maestro disser que o modal não deve aparecer, retorna nulo e não renderiza nada no HTML.

  // 🚀 ENGINE DE CONSULTA AUTOMÁTICA DE CNPJ (BRASIL API)
  const consultarCnpjAutomatico = async (valorCnpjBruto) => { // -> Declara a função assíncrona responsável por disparar o pacote de rede para enrichment de dados.
    const apenasNumeros = valorCnpjBruto.replace(/\D/g, ""); // -> Remove pontos, barras e traços aplicando regex para isolar estritamente os 14 dígitos numéricos federais.
    
    if (apenasNumeros.length !== 14) return; // -> TRAVA DE FLUXO ANTI-BOMBARDEIO: Garante que a requisição de rede só aconteça se a string limpa possuir exatamente 14 dígitos, evitando chamadas repetidas.

    try { // -> Escudo protetivo antiqueda para tratar instabilidades de conexão ou CNPJs inexistentes.
      setCarregandoCnpj(true); // -> Liga o sinal visual de processamento, travando as caixas de texto para evitar digitação concorrente.
      
      const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${apenasNumeros}`); // -> Dispara o método nativo fetch visando o endpoint ultra-rápido de alta performance da BrasilAPI.
      
      if (!resposta.ok) { // -> Captura se o servidor devolveu algum status de erro (Ex: 404 CNPJ não localizado).
        throw new Error("CNPJ não localizado na base de dados da Receita Federal."); // -> Atira a exceção para o bloco catch tratar.
      }

      const dadosEmpresa = await resposta.json(); // -> Traduz o pacote de rede codificado em formato JSON vivo para leitura na memória RAM de forma correta e síncrona.

      // 🧼 TRATAMENTO E HIGIENIZAÇÃO DE RETORNO DO BANCO DE DADOS
      if (dadosEmpresa.descricao_situacao_cadastral === "BAIXADA" || dadosEmpresa.situacao_cadastral === "BAIXADA" || dadosEmpresa.situacao_cadastral === 8) { // -> Valida o status fiscal operacional do assistido usando as chaves reais e numéricas entregues pela BrasilAPI.
        alert(`⚠️ ALERTA FISCAL CRÍTICO:\nA empresa vinculada a este CNPJ encontra-se [BAIXADA] na Receita Federal.\nMotivo: ${dadosEmpresa.descricao_motivo_situacao_cadastral || dadosEmpresa.motivo_baixa || "Não Informado"}.`); // -> Dispara aviso vermelho na tela para proteção jurídica da operação.
      }

      // 🧠 RETROALIMENTAÇÃO REATIVA DOS ESTADOS DO MAESTRO
      setEmpNome((dadosEmpresa.razao_social || dadosEmpresa.nome_fantasia || "").toUpperCase()); // -> Preenche a Razão Social corporativa automaticamente em caixa alta por herança de estado e força letras maiúsculas.
      
      // 🗺️ TRICOTAGEM DO ENDEREÇO DA PRAÇA CONCATENADO (ENRIQUECIDO COM O TIPO DE LOGRADOURO EXPLÍCITO DA BRASILAPI)
      const tipoLogradouro = dadosEmpresa.descricao_tipo_de_logradouro ? `${dadosEmpresa.descricao_tipo_de_logradouro} ` : ""; // -> Captura se é 'AVENIDA', 'RUA' ou 'ALAMEDA' para o endereço não nascer cortado.
      const logradouro = dadosEmpresa.logradouro || ""; // -> Isola o nome da rua/avenida principal.
      const numero = dadosEmpresa.numero ? `, Nº ${dadosEmpresa.numero}` : ""; // -> Isola a numeração física do imóvel.
      const complemento = dadosEmpresa.complemento ? ` - ${dadosEmpresa.complemento}` : ""; // -> Captura salas, blocos ou galpões de retaguarda.
      const bairro = dadosEmpresa.bairro ? ` - Bairro: ${dadosEmpresa.bairro}` : ""; // -> Captura o distrito territorial.
      const cidadeUf = dadosEmpresa.municipio ? ` (${dadosEmpresa.municipio}/${dadosEmpresa.uf})` : ""; // -> Concatena a praça de comarca de faturamento correspondente.
      
      setEmpEndereco(`${tipoLogradouro}${logradouro}${numero}${complemento}${bairro}${cidadeUf}`.toUpperCase()); // -> Unifica todas as strings estruturadas em uma linha executiva única perfeita e limpa em caixa alta.
      setEmpCep(dadosEmpresa.cep || ""); // -> Injeta o código postal CEP correspondente de forma automatizada sem travas.
      
      // EQUALIZAÇÃO EXECUTIVA: Ajustado para validar tanto pelo número técnico (2) quanto pela string textual mestre ("FILIAL") enviada pelo servidor.
      if (dadosEmpresa.identificador_matriz_filial === 2 || dadosEmpresa.descricao_identificador_matriz_filial === "FILIAL") { // -> Regra da BrasilAPI: Se o identificador for idêntico a filial, significa que a unidade é um braço dependente.
        setEmpIsFilial(true); // -> Chaveia o checkbox para verdadeiro de forma autônoma.
      } else {
        setEmpIsFilial(false); // -> Mantém o status mestre de Matriz ativo.
      }

    } catch (err) { // -> Captura falhas de timeout ou erros cadastrais de digitação humana.
      alert(`⚠️ FALHA DE INTEGRAÇÃO:\nNão foi possível auto-preencher os dados deste CNPJ.\nPor favor, preencha as informações manualmente.`); // -> Feedback amigável para contingência.
    } finally {
      setCarregandoCnpj(false); // -> Desliga o loader de processamento liberando as caixas de texto para edição corretiva.
    }
  };

  // 🧼 MÁSCARA DINÂMICA EM TEMPO REAL PARA CNPJ (UX PREMIUM)
  const lidarComMudancaCnpj = (e) => { // -> Captura cada clique ou caractere colado no campo de documento federal.
    const textoBruto = e.target.value; // -> Extrai a string de entrada.
    const apenasNumeros = textoBruto.replace(/\D/g, ""); // -> Remove qualquer letra ou caractere especial preservando os dígitos.
    
    // 🎨 Aplicação da máscara clássica visual: 00.000.000/0000-00
    let cnpjFormatado = apenasNumeros; // -> Inicializa o rascunho com os números limpos.
    if (apenasNumeros.length > 2) cnpjFormatado = `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(2)}`; // -> Injeta o primeiro ponto.
    if (apenasNumeros.length > 5) cnpjFormatado = `${cnpjFormatado.slice(0, 6)}.${cnpjFormatado.slice(6)}`; // -> Injeta o segundo ponto.
    if (apenasNumeros.length > 8) cnpjFormatado = `${cnpjFormatado.slice(0, 10)}/${cnpjFormatado.slice(10)}`; // -> Injeta a barra de subdivisão corporativa.
    if (apenasNumeros.length > 12) cnpjFormatado = `${cnpjFormatado.slice(0, 15)}-${cnpjFormatado.slice(15, 17)}`; // -> Injeta o traço verificador final.

    setEmpCnpj(cnpjFormatado.slice(0, 18)); // -> Atualiza o estado mestre limitando ao teto estrito de 18 caracteres da máscara.

    if (apenasNumeros.length === 14) { // -> GATILHO REATIVO INTEGRADO: No exato milissegundo em que os números limpos atingirem 14 dígitos, dispara a busca controlada.
      consultarCnpjAutomatico(apenasNumeros); // -> Arremessa o pacote para processamento na nuvem da BrasilAPI de forma isolada.
    }
  };

  return ( // -> Dispara o desenho da interface flutuante do modal na tela.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", zIndex: 6000, display: "flex", justifyContent: "center", alignItems: "center" }}> {/* -> Cortina escura de fundo configurada com opacidade suave para isolar visualmente as planilhas de fundo. */}
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "480px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}> {/* -> Cartão branco otimizado com bordas executivas de 8px e trava antiqueda de estouro de tela. */}
        
        {/* TOPO DO MODAL: TÍTULO INSTITUCIONAL E BOTÃO FECHAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}> {/* -> Alinhador horizontal compacto do cabeçalho do modal flutuante. */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Building2 size={14} strokeWidth={2.5} style={{ color: "#0f172a" }} /> {/* -> Injeta o componente vetorial de prédio do Lucide removendo o antigo emoji corporativo. */}
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Registro de Assistido / Empresa</h3> {/* -> Título institutional denso em caixa alta para manter o rigor técnico. */}
          </div>
          <button 
            type="button" 
            onClick={aoFechar} 
            style={{ background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", padding: "4px", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
          >
            <X size={18} strokeWidth={2.5} /> {/* -> Substitui o caractere antigo pelo componente X sutil em linhas finas. */}
          </button> 
        </div> {/* -> Encerra o contêiner do cabeçalho superior. */}

        {/* CORPO DO FORMULÁRIO JURÍDICO */}
        <form onSubmit={tratarCadastroEmpresa} style={{ display: "flex", gap: "12px", flexDirection: "column" }}> {/* -> Abre o formulário organizando a fiação de inputs empilhados verticalmente de forma densa. */}
          
          {/* LINHA DUPLA: CÓDIGO CONTA E SELEÇÃO FILIAL */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> {/* -> Alinhador flexbox responsivo lado a lado para otimização de espaço em tela. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Coluna adjustable dedicada ao código de identificação da conta judicial. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <FileKey size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Adiciona o ícone de chave de arquivo outline para representar a conta. */}
                <span>CÓDIGO CONTA *</span>
              </label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório. */}
              <input type="text" required disabled={carregandoCnpj} placeholder="Ex: 1022" value={empCodigo} onChange={(e) => setEmpCodigo(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: carregandoCnpj ? "#f1f5f9" : "#f8fafc", cursor: carregandoCnpj ? "not-allowed" : "text" }} /> {/* -> Entrada de texto higienizada travada reativamente caso o barramento API esteja ativo. */}
            </div> {/* -> Fim da coluna do código. */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "18px" }}> {/* -> Coluna alinhadora centralizada para a marcação da unidade. */}
              <input type="checkbox" id="checkFilial" disabled={carregandoCnpj} checked={empIsFilial} onChange={(e) => setEmpIsFilial(e.target.checked)} style={{ width: "14px", height: "14px", cursor: carregandoCnpj ? "not-allowed" : "pointer" }} /> {/* -> Caixa de marcação booleana para chaveamento de Matriz e Filial automática. */}
              <label htmlFor="checkFilial" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#334155", cursor: carregandoCnpj ? "not-allowed" : "pointer" }}>
                <Network size={12} strokeWidth={2.5} style={{ color: "#334155" }} /> {/* -> Adiciona o ícone de ramificação estrutural para a filial. */}
                <span>REGISTRO FILIAL</span>
              </label> {/* -> Rótulo clicável alinhado ao padrão técnico de 11px. */}
            </div> {/* -> Fim da coluna de marcação. */}
          </div> {/* -> Fim da linha dupla superior. */}

          {/* CAMPO RECONFIGURADO: CNPJ DO CLIENTE COM AUTO-BUSCA INTEGRADA BLINDADA */}
          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}> {/* -> Alinhador vertical com posicionamento relativo para acomodar o loader interno de rede. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
              <Fingerprint size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Adiciona o ícone de impressão digital outline representativo do documento federal. */}
              <span>CNPJ DO CLIENTE *</span>
              {carregandoCnpj && <span style={{ fontSize: "10px", color: "#2563eb", fontWeight: "800", marginLeft: "auto", textTransform: "uppercase", letterSpacing: "0.5px" }}>Consultando Nuvem...</span>} {/* -> Alerta textual discreto informando o andamento da requisição em lote. */}
            </label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório. */}
            <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
              <input 
                type="text" 
                required 
                disabled={carregandoCnpj}
                placeholder="00.000.000/0000-00" 
                value={empCnpj} 
                onChange={lidarComMudancaCnpj} // -> Aciona a engine especialista em máscaras numéricas e interceptação de 14 dígitos.
                style={{ padding: "8px 35px 8px 10px", border: `1px solid ${carregandoCnpj ? "#2563eb" : "#cbd5e1"}`, borderRadius: "6px", fontSize: "12px", color: "#0f172a", width: "100%", background: carregandoCnpj ? "#f0f9ff" : "#ffffff", boxSizing: "border-box", outline: "none", transition: "all 0.15s ease" }} // -> REMOÇÃO DO ONBLUR DUPLICADO: O evento de desfoque foi extinto para expurgar a duplicação de pacotes de rede e afastar o erro 429.
              />
              {carregandoCnpj && (
                <div style={{ position: "absolute", right: "10px", display: "flex", alignItems: "center", color: "#2563eb" }}>
                  <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} /> {/* -> Injeta o spinner vetorial girando continuamente na RAM enquanto aguarda os dados. */}
                </div>
              )}
            </div>
          </div> {/* -> Fim do campo de CNPJ. */}

          {/* CAMPO: RAZÃO SOCIAL */}
          <div style={{ display: "flex", flexDirection: "column" }}> {/* -> Alinhador vertical em lote para o campo de nome corporativo. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
              <Building2 size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Adiciona o ícone de prédio corporativo no rótulo da razão social. */}
              <span>RAZÃO SOCIAL *</span>
            </label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório. */}
            <input type="text" required disabled={carregandoCnpj} placeholder="Ex: Alfa Transportes LTDA" value={empNome} onChange={(e) => setEmpNome(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: carregandoCnpj ? "#f1f5f9" : "#ffffff", cursor: carregandoCnpj ? "not-allowed" : "text" }} /> {/* -> Preenchido via satélite de forma instantânea. */}
          </div> {/* -> Fim do campo de razão social. */}

          {/* LINHA INDIVIDUAL: SELECT DINÂMICO DE SEGMENTOS */}
          <div style={{ display: "flex", flexDirection: "column" }}> {/* -> Isola o dropdown de metadados para manter simetria visual fluida. */}
            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
              <Tag size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Adiciona o ícone sutil de tag de classificação. */}
              <span>SEGMENTO COMERCIAL</span>
            </label> {/* -> Rótulo informativo cinza neutro. */}
            <select 
              value={empSegmento} 
              disabled={carregandoCnpj}
              onChange={(e) => setEmpSegmento(e.target.value)} 
              style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: carregandoCnpj ? "#f1f5f9" : "#ffffff", fontWeight: "700", cursor: carregandoCnpj ? "not-allowed" : "pointer", width: "100%" }} // -> Menu dropdown corporativo denso configurado em 12px.
            >
              <option value="">-- Setor Não Definido --</option> {/* -> Opção nula inicial padrão caso o assistido não tenha nicho específico. */}
              {listaSegmentos.map((seg) => ( // -> Realiza o laço reativo mapeando os documentos guardados na coleção cadastros_segmentos real.
                <option key={seg.id} value={seg.nome}>{seg.nome}</option> // -> Renderiza o nome do setor parametrizado de forma viva puxando a ID NoSQL, limpo de emojis.
              ))}
            </select> {/* -> Encerra a caixa de seleção dinâmica. */}
          </div> {/* -> Fim da linha de segmento relacional. */}

          {/* LINHA DUPLA: ENDEREÇO E CEP */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> {/* -> Alinhador flexbox duplo para dados de localização e citações. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 2, minWidth: "200px" }}> {/* -> Ocupa dois terços da proporção horizontal da linha para abrigar o logradouro completo auto-gerado. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <MapPin size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta o marcador geográfico outline do Lucide na localização. */}
                <span>ENDEREÇO COMPLETO DA PRAÇA</span>
              </label> {/* -> Rótulo informativo cinza neutro. */}
              <input type="text" disabled={carregandoCnpj} placeholder="Av. Paulista, 1000" value={empEndereco} onChange={(e) => setEmpEndereco(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: carregandoCnpj ? "#f1f5f9" : "#ffffff", cursor: carregandoCnpj ? "not-allowed" : "text" }} /> {/* -> Entrada enriquecida automaticamente pela BrasilAPI. */}
            </div> {/* -> Fim da coluna de endereço. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: "100px" }}> {/* -> Ocupa um terço restante da proporção horizontal para o código postal CEP. */}
              <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                <Map size={12} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta o mapa planificado outline do Lucide no código de área do CEP. */}
                <span>CEP</span>
              </label> {/* -> Rótulo informativo cinza neutro. */}
              <input type="text" disabled={carregandoCnpj} placeholder="00000-000" value={empCep} onChange={(e) => setEmpCep(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: carregandoCnpj ? "#f1f5f9" : "#ffffff", cursor: carregandoCnpj ? "not-allowed" : "text" }} /> {/* -> Entrada de texto para alocação de localização postal. */}
            </div> {/* -> Fim da coluna do CEP. */}
          </div> {/* -> Fim da linha dupla de endereçamento. */}

          {/* RODAPÉ DO MODAL: CONTROLES DE SUBMISSÃO OU REJEIÇÃO */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}> {/* -> Adicionado traço de divisão sutil e padding superior para otimização visual sóbria. */}
            <button type="button" disabled={carregandoCnpj} onClick={aoFechar} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: "6px", cursor: carregandoCnpj ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "600", color: "#475569", transition: "background 0.15s ease" }} onMouseEnter={(e) => { if (!carregandoCnpj) e.currentTarget.style.backgroundColor = "#f8fafc"; }} onMouseLeave={(e) => { if (!carregandoCnpj) e.currentTarget.style.backgroundColor = "#ffffff"; }}>Cancelar</button> {/* -> Botão sóbrio de recusa voluntária da operação em andamento. */}
            <button type="submit" disabled={carregandoCnpj} style={{ background: carregandoCnpj ? "#64748b" : "#0f172a", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", cursor: carregandoCnpj ? "not-allowed" : "pointer", fontSize: "12px", transition: "background 0.15s ease" }} onMouseEnter={(e) => { if (!carregandoCnpj) e.currentTarget.style.backgroundColor = "#1e293b"; }} onMouseLeave={(e) => { if (!carregandoCnpj) e.currentTarget.style.backgroundColor = "#0f172a"; }}>
              {carregandoCnpj ? "Processando..." : "Gravar Registro"}
            </button> {/* -> Botão mestre de salvaguarda sólido Azul Escuro Profundo. */}
          </div> {/* -> Encerra o agrupador de botões do rodapé. */}

        </form> {/* -> Encerra a tag estrutural do formulário de inserções. */}
      </div> {/* -> Encerra o cartão interno branco do modal. */}
      
      {/* INJEÇÃO DE ESTILO INLINE TEMPORÁRIO PARA SUPORTAR A ANIMAÇÃO DE GIRO DO LUCIDE SEM ARQUIVO CSS EXTERNO */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div> // -> Encerra o contêiner flutuante mestre de isolamento de tela.
  );
}