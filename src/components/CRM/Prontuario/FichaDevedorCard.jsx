import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para gerenciar a abertura do menu de partilha na memória RAM.
import { Copy, Check, Send, Activity } from "lucide-react"; // -> Injeta os componentes de ícones vetoriais lineares e sóbrios da biblioteca Lucide.

export default function FichaDevedorCard({ card, cnpjExibido, tipoInscricao, localidadeFormatada, valorOriginalDivida, formatarCnpj }) { // -> Declara a função do componente recebendo as propriedades e dados mastigados pelo componente pai.
  const [menuAcaoAberto, setMenuAberto] = useState(false); // -> Estado local na RAM que controla se a janelinha flutuante de partilha está visível (true) ou escondida (false).
  const [copiado, setCopiado] = useState(false); // -> Estado local na RAM que chaveia o ícone de cópia para um visto verde de sucesso por 2 segundos.

  // -> FILTRO DE SEGURANÇA OPERACIONAL: Valida se o devedor possui um plano Price selado nas raias ou categorias Core homologadas
  const possuiAcordoSelado = card?.status === "acordo" || card?.status === "finalizado" || card?.categoria === "feito" || card?.categoria === "final"; // -> Retorna verdadeiro se o devedor estiver nas raias de acordos ou finalizados da controladoria.

  const obterTextoFichaCobranca = () => { // -> Função auxiliar que monta a string de texto estruturada com os dados do devedor para exportação.
    const textoNegociadoWhats = possuiAcordoSelado 
      ? `R$ ${(card?.proposta?.valorCobrado || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` 
      : "Sem Acordo Definido"; // -> Retorna string explícita limpa de aspas.

    return `⚡ DOCULOC - FICHA DE COBRANÇA\n\nID Conta: #${card?.codigo || card?.id}\nEmpresa: ${card?.cliente}\nCNPJ: ${formatarCnpj(cnpjExibido)}\nUnidade: ${tipoInscricao}\nPraça: ${localidadeFormatada}\nResponsável: ${card?.responsavel || "Victor Faustino"}\nDívida Acumulada: R$ ${valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}\nDívida Negociada: ${textoNegociadoWhats}`; // -> Retorna o payload completo formatado em caixa alta e quebras de linha limpas.
  };

  const lidarComCopiarFicha = () => { // -> Função que executa a cópia clássica dos dados para a área de transferência do sistema operacional.
    navigator.clipboard.writeText(obterTextoFichaCobranca()); // -> Arremessa o texto estruturado direto para o clipboard do computador do operador.
    setCopiado(true); // -> Altera a flag de cópia para verdadeiro, ativando o visto verde no ecrã.
    setMenuAberto(false); // -> Fecha automaticamente a janelinha suspensa de opções de partilha.
    setTimeout(() => setCopiado(false), 2000); // -> Cria um temporizador de 2 segundos para devolver o ícone original de prancheta.
  };

  const lidarComPartilharWhatsApp = () => { // -> Função que dispara o texto rico da ficha diretamente para o rádio transmissor do WhatsApp.
    const urlDisparo = `https://web.whatsapp.com/send?text=${encodeURIComponent(obterTextoFichaCobranca())}`; // -> Codifica os caracteres especiais e monta o link oficial de encaminhamento do WhatsApp Web.
    window.open(urlDisparo, "_blank"); // -> Abre uma nova aba no navegador web do Victor direcionando o payload de faturamento para o chat.
    setMenuAberto(false); // -> Recolhe e esconde o menu flutuante de ações contextuais.
  };

  return ( // -> Inicia a renderização do bloco de código HTML que desenha o cartão de dados cadastrais no ecrã.
    <div style={{ textAlign: "left" }}> 
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}> 
        <h4 style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}> 
          <Activity size={13} strokeWidth={2.5} style={{ color: "#475569" }} /> 
          <span>Ficha Cadastral do Devedor</span> 
        </h4>
      </div>

      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#1e293b", position: "relative" }}> 
        
        {/* LINHA 1: ID Conta na esquerda e Botão de Ação na extrema direita no mesmo alinhamento */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> 
          <span><span style={{ color: "#64748b" }}>ID Conta:</span> <b style={{ color: "#0f172a" }}>#{card?.codigo || card?.id}</b></span> 
          
          <div style={{ position: "relative" }}> 
            <button type="button" onClick={() => setMenuAberto(!menuAcaoAberto)} style={{ background: "none", border: "none", color: copiado ? "#16a34a" : "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px" }} title="Opções de exportação"> 
              {copiado ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />} 
            </button>

            {menuAcaoAberto && ( 
              <div style={{ position: "absolute", top: "20px", right: 0, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", zIndex: 90, padding: "4px", display: "flex", flexDirection: "column", minWidth: "160px" }}> 
                <button type="button" onClick={lidarComCopiarFicha} style={{ background: "none", border: "none", padding: "6px 10px", fontSize: "11px", fontWeight: "700", color: "#334155", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", borderRadius: "4px" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}> 
                  <Copy size={12} /> <span>Copiar Ficha Plena</span> 
                </button>
                <button type="button" onClick={lidarComPartilharWhatsApp} style={{ background: "none", border: "none", padding: "6px 10px", fontSize: "11px", fontWeight: "700", color: "#16a34a", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", borderRadius: "4px" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}> 
                  <Send size={12} /> <span>Partilhar no WhatsApp</span> 
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LINHA 2: Nome da Empresa na esquerda e Badge Matriz/Filial na extrema direita alinhado */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> 
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "340px" }}><span style={{ color: "#64748b" }}>Nome da Empresa:</span> <b style={{ color: "#0f172a" }}>{card?.cliente}</b></span> 
          <span style={{ fontSize: "10px", background: "#f0f9ff", padding: "2px 8px", borderRadius: "4px", border: "1px solid #bae6fd", color: "#0369a1", fontWeight: "700", whiteSpace: "nowrap" }}> 
            {tipoInscricao} 
          </span>
        </div>

        {/* LINHA 3: CNPJ isolado e limpo */}
        <div><span><span style={{ color: "#64748b" }}>CNPJ:</span> <span style={{ fontFamily: "monospace", color: "#0f172a" }}>{formatarCnpj(cnpjExibido)}</span></span></div> 

        {/* DEMAIS ITENS PRESERVADOS FIELMENTE */}
        <div><span style={{ color: "#64748b" }}>Cidade/UF:</span> <span style={{ color: "#475569" }}>{localidadeFormatada}</span></div> 
        <div><span style={{ color: "#64748b" }}>Operador de Cobrança:</span> <span>{card?.responsavel || "Victor Faustino"}</span></div> 
        
        <div><span style={{ color: "#64748b" }}>Dívida Acumulada Total:</span> <span style={{ color: "#ef4444", fontWeight: "800", fontSize: "13px" }}>R$ {valorOriginalDivida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></div> 
        
        {/* INTERVENÇÃO CONDICIONAL DA DÍVIDA NEGOCIADA TRAVADA RIGOROSAMENTE COMO STRING */}
        <div>
          <span style={{ color: "#64748b" }}>Dívida Negociada Total:</span>{" "}
          {possuiAcordoSelado ? (
            <span style={{ color: "#16a34a", fontWeight: "800", fontSize: "13px" }}>
              R$ {(card?.proposta?.valorCobrado || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          ) : (
            <span style={{ color: "#64748b", fontWeight: "700", fontStyle: "italic" }}>
              {"Sem Acordo Definido"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}