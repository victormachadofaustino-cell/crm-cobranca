import React from "react"; // -> Traz a biblioteca mestre do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function GavetaFiltrosCadastro({ aberto, aoFechar, visaoPainel, filtrosEmpresa, setFiltrosEmpresa, filtrosContato, setFiltrosContato, listaVinculos = [] }) { // -> Define e exporta o componente recebendo a visão ativa, as memórias de busca e a nova lista de vínculos do Firebase.
  if (!aberto) return null; // -> TRAVA DE SEGURANÇA: Se o maestro disser que a gaveta não deve aparecer, retorna nulo e não consome processamento.

  return ( // -> Desenha a interface flutuante da gaveta lateral na tela.
    <div style={{ position: "fixed", top: 0, right: 0, width: "300px", height: "100vh", background: "#ffffff", boxShadow: "-4px 0 15px rgba(0,0,0,0.03)", zIndex: 7000, padding: "16px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", borderLeft: "1px solid #e2e8f0" }}> {/* -> COMPACTAÇÃO: Largura otimizada para 300px e padding enxugado para 16px para maior densidade visual executiva. */}
      
      {/* CABEÇALHO DA GAVETA: TÍTULO E BOTÃO FECHAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "4px" }}> {/* -> Alinhador horizontal do topo compacto da gaveta de buscas. */}
        <h3 style={{ margin: 0, fontSize: "12px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>🔍 Filtrar Filas da Seção</h3> {/* -> Título calibrado para fonte densa de 12px em caixa alta. */}
        <button type="button" onClick={aoFechar} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#94a3b8", fontWeight: "bold", padding: 0 }}>&times;</button> {/* -> Botão 'X' minimalista puro para recolher a cortina lateral. */}
      </div> {/* -> Encerra o contêiner do cabeçalho superior. */}

      {/* =========================================================================================
          CORTINA DE FILTRO CONDICIONAL 1: CAMPOS EXCLUSIVOS PARA A PLANILHA DE EMPRESAS (TODAS AS COLUNAS)
          ========================================================================================= */}
      {visaoPainel === "empresas" && ( // -> REGRA DE ESCOPO: Só exibe estes campos se o advogado estiver auditando a planilha de Pessoas Jurídicas.
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}> {/* -> Empilhador vertical denso com gap enxugado para 10px. */}
          
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca del Código Conta. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CONTA (CÓDIGO)</label> {/* -> Rótulo ajustado para o título exato do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar código..." value={filtrosEmpresa.codigo || ""} onChange={(e) => setFiltrosEmpresa({ ...filtrosEmpresa, codigo: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o campo código sem apagar os outros filtros através do espalhador de propriedades. */}
          </div> {/* -> Fim do campo Código Conta. */}
          
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca della Razão Social. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>RAZÃO SOCIAL / ASSISTIDO</label> {/* -> Rótulo ajustado para o título exato do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar nome..." value={filtrosEmpresa.cliente || ""} onChange={(e) => setFiltrosEmpresa({ ...filtrosEmpresa, cliente: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o campo cliente sem apagar os outros filtros através do espalhador de propriedades. */}
          </div> {/* -> Fim do campo Razão Social. */}
          
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca del CNPJ Institucional. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CNPJ INSTITUCIONAL</label> {/* -> Rótulo ajustado para o título exato do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar CNPJ..." value={filtrosEmpresa.cnpj || ""} onChange={(e) => setFiltrosEmpresa({ ...filtrosEmpresa, cnpj: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o campo cnpj sem apagar os outros filtros através do espalhador de propriedades. */}
          </div> {/* -> Fim do campo CNPJ. */}
          
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para isolamento de Matriz/Filial. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>TIPO</label> {/* -> Rótulo ajustado para o título exato do cabeçalho della tabela. */}
            <select value={filtrosEmpresa.tipo || "todos"} onChange={(e) => setFiltrosEmpresa({ ...filtrosEmpresa, tipo: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#0f172a", fontWeight: "700", cursor: "pointer" }}> {/* -> Dropdown isolador de unidades em fonte compacta de 12px com negrito. */}
              <option value="todos">Exibir Todas Unidades</option> {/* -> Opção neutra que limpa a barreira de classificação corporativa. */}
              <option value="Matriz">Apenas Matrizes</option> {/* -> Isola estritamente as sedes administrativas. */}
              <option value="Filial">Apenas Filiais</option> {/* -> Isola estritamente os estabelecimentos secundários. */}
            </select> {/* -> Encerra o elemento select de empresas. */}
          </div> {/* -> Fim do campo Tipo Unidade. */}

          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca por Segmento de mercado. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>SEGMENTO</label> {/* -> Rótulo casado com o título do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar segmento..." value={filtrosEmpresa.segmento || ""} onChange={(e) => setFiltrosEmpresa({ ...filtrosEmpresa, segmento: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o campo segmento na memória preservando as outras chaves. */}
          </div> {/* -> Fim do campo Segmento. */}

          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca por Endereço. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>ENDEREÇO DA PRAÇA</label> {/* -> Rótulo casado com o título do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar endereço ou CEP..." value={filtrosEmpresa.endereco || ""} onChange={(e) => setFiltrosEmpresa({ ...filtrosEmpresa, endereco: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o campo endereço na memória preservando as outras chaves. */}
          </div> {/* -> Fim do campo Endereço. */}
          
          <button type="button" onClick={() => setFiltrosEmpresa({ codigo: "", cliente: "", cnpj: "", tipo: "todos", segmento: "", endereco: "" })} style={{ padding: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#475569", cursor: "pointer", marginTop: "4px" }}>Limpar Filtros</button> {/* -> MUDANÇA SÓBRIA: Botão de reset formatado com friso e fonte regular em 12px. */}
        </div>
      )}

      {/* =========================================================================================
          CORTINA DE FILTRO CONDICIONAL 2: CAMPOS EXCLUSIVOS PARA A PLANILHA DE CONTATOS (TODAS AS COLUNAS)
          ========================================================================================= */}
      {visaoPainel === "contatos" && ( // -> REGRA DE ESCOPO: Só exibe estes campos se o advogado estiver auditando a planilha de Pessoas Humanas.
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}> {/* -> Empilhador vertical denso de filtros de contatos representantes. */}
          
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca del Nome del Representante. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>NOME DO REPRESENTANTE</label> {/* -> Rótulo ajustado para o título exato do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar nome..." value={filtrosContato.nome || ""} onChange={(e) => setFiltrosContato({ ...filtrosContato, nome: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o campo nome sem apagar os outros filtros através do espalhador de propriedades. */}
          </div> {/* -> Fim do campo Nome. */}
          
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca del CPF Jurídico. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CPF JURÍDICO</label> {/* -> Rótulo ajustado para o título exato do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar CPF..." value={filtrosContato.cpf || ""} onChange={(e) => setFiltrosContato({ ...filtrosContato, cpf: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o campo cpf sem apagar os outros filtros através do espalhador de propriedades. */}
          </div> {/* -> Fim do campo CPF. */}

          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca por Telefone Contato. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>TELEFONE CONTATO</label> {/* -> Rótulo casado com o título do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar telefone..." value={filtrosContato.telefone || ""} onChange={(e) => setFiltrosContato({ ...filtrosContato, telefone: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o número do telefone preservando os demais filtros na memória RAM. */}
          </div> {/* -> Fim do campo Telefone. */}

          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para busca por Correio Eletrônico. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CORREIO ELETRÔNICO</label> {/* -> Rótulo casado com o título do cabeçalho della tabela. */}
            <input type="text" placeholder="Buscar e-mail..." value={filtrosContato.email || ""} onChange={(e) => setFiltrosContato({ ...filtrosContato, email: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a", background: "#f8fafc" }} /> {/* -> Modifica o endereço de e-mail preservando os demais filtros na memória RAM. */}
          </div> {/* -> Fim do campo E-mail. */}
          
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}> {/* -> Campo estrutural para isolamento de Papel/Vínculo civil. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>PAPEL / VÍNCULO</label> {/* -> Rótulo ajustado para o título exato del cabeçalho della tabela. */}
            <select value={filtrosContato.tipoVinculo || "todos"} onChange={(e) => setFiltrosContato({ ...filtrosContato, tipoVinculo: e.target.value })} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#0f172a", fontWeight: "700", cursor: "pointer" }}> {/* -> Menu suspenso reconfigurado em 12px densos. */}
              <option value="todos">Exibir Todos Papéis</option> {/* -> Opção neutra inicial. */}
              {listaVinculos.map((vin) => ( // -> ALINHAMENTO DINÂMICO CONCLUÍDO: Mapeia reativamente as categorias reais gravadas na coleção do Firebase.
                <option key={vin.id} value={vin.label}>{vin.label}</option> // -> Renderiza o papel técnico de forma síncrona.
              ))}
            </select> {/* -> Encerra o elemento select de contatos. */}
          </div> {/* -> Fim do campo Papel/Vínculo. */}
          
          <button type="button" onClick={() => setFiltrosContato({ nome: "", cpf: "", telefone: "", email: "", tipoVinculo: "todos" })} style={{ padding: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", color: "#475569", cursor: "pointer", marginTop: "4px" }}>Limpar Filtros</button> {/* -> MUDANÇA SÓBRIA: Botão de reset formatado com friso e fonte regular em 12px. */}
        </div>
      )}

      {/* BOTÃO FIXO INFERIOR DE FECHAMENTO COM DISPARO SIMULTÂNEO */}
      <button type="button" onClick={aoFechar} style={{ padding: "10px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", marginTop: "auto", textTransform: "uppercase", letterSpacing: "0.5px" }}>Aplicar Filtros Simultâneos</button> {/* -> Botão sólido Azul Escuro Profundo institucional da advocacia mantido rigorosamente. */}
    </div>
  );
}