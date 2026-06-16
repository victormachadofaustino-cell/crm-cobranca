import React from "react"; // -> Traz a biblioteca nativa do React para permitir a leitura e interpretação da sintaxe .jsx.

export default function ModalNovoContato({ aberto, aoFechar, tratarCadastroContato, empresas = [], conEmpresaId, setConEmpresaId, conNome, setConNome, conCpf, setConCpf, conTelefone, setConTelefone, conEmail, setConEmail, conTipo, setConTipo, listaVinculos = [] }) { // -> Declara a função mestre do componente recebendo os dados, modificadores de estado e a lista viva de vínculos do Firebase.
  if (!aberto) return null; // -> TRAVA DE SEGURANÇA: Se o controle do sistema disser que este modal deve ficar fechado, retorna vazio e não renderiza nada no navegador.

  return ( // -> Desenha a interface flutuante do modal na tela do usuário.
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.4)", zIndex: 6000, display: "flex", justifyContent: "center", alignItems: "center" }}> {/* -> Cortina escura de fundo configurada com opacidade suave para isolar visualmente as planilhas de fundo. */}
      <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "480px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" }}> {/* -> Cartão branco otimizado com bordas executivas de 8px e trava antiqueda com rolagem vertical caso a tela seja pequena. */}
        
        {/* TOPO DO MODAL: TÍTULO INSTITUCIONAL JURÍDICO AND BOTÃO FECHAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}> {/* -> Alinhador horizontal compacto do cabeçalho do modal flutuante. */}
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>👤 Novo Contato de Representante</h3> {/* -> Título institucional denso em caixa alta para manter o rigor técnico do sistema. */}
          <button type="button" onClick={aoFechar} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8", fontWeight: "bold", padding: 0 }}>&times;</button> {/* -> Ícone puro de fechamento em formato de 'X' que limpa os rascunhos locais e fecha a janela. */}
        </div> {/* -> Encerra o contêiner do cabeçalho superior. */}

        {/* CORPO DO FORMULÁRIO RELACIONAL */}
        <form onSubmit={tratarCadastroContato} style={{ display: "flex", gap: "12px", flexDirection: "column" }}> {/* -> Abre o formulário organizando a fiação de inputs empilhados verticalmente de forma densa. */}
          
          {/* EL PLUGO DE REFORÇO RELACIONAL: Caixa seletora vinculante de Empresas-Pai */}
          <div style={{ display: "flex", flexDirection: "column" }}> {/* -> Alinhador vertical em lote para o campo de seleção relacional da empresa credora. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>⚖️ SELECIONAR CLIENTE ASSOCIAÇÃO *</label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório de vínculo empresarial. */}
            <select required value={conEmpresaId} onChange={(e) => setConEmpresaId(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#0f172a", fontWeight: "bold", cursor: "pointer" }}> {/* -> Menu dropdown com fonte de 12px que armazena a ID da empresa selecionada. */}
              <option value="">-- Escolha uma empresa cadastrada na base --</option> {/* -> Opção neutra padrão inicial de instrução do seletor. */}
              {empresas.map((emp) => ( // -> Varre reativamente a listagem viva de empresas injetadas pelo mestre do sistema.
                <option key={emp.id} value={emp.id}>🏢 {emp.cliente} (Conta: #{emp.codigo || "S/C"})</option> // -> Desenha a opção vinculando o ID físico para persistência estável no Firestore da Google.
              ))} {/* -> Encerra o laço mapeador de opções dinâmicas. */}
            </select> {/* -> Encerra o elemento estrutural select de empresas credoras. */}
          </div> {/* -> Fim do campo relacional de associação. */}

          {/* LINHA DUPLA: NOME E CPF */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> {/* -> Alinhador flexbox responsivo lado a lado para otimização de espaço em tela. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 2 }}> {/* -> Ocupa dois terços da proporção horizontal para dar destaque ao nome completo civil do contato. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>NOME COMPLETO *</label> {/* -> Rótulo em caixa alta indicando campo rigidamente obrigatório de preenchimento. */}
              <input type="text" required placeholder="Ex: Roberto Alencar" value={conNome} onChange={(e) => setConNome(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto livre para digitação do nome do representante. */}
            </div> {/* -> Fim da coluna do nome completo. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Ocupa um terço da proporção horizontal focando o documento de identificação fiscal CPF. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>CPF DO CONTATO *</label> {/* -> Rótulo em caixa alta indicando campo de documento rigidamente obrigatório. */}
              <input type="text" required placeholder="000.000.000-00" value={conCpf} onChange={(e) => setConCpf(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto mascarada para validação estrita de CPF. */}
            </div> {/* -> Fim da coluna do CPF. */}
          </div> {/* -> Fim da linha dupla intermediária superior. */}

          {/* LINHA DUPLA: TELEFONE E EMAIL */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}> {/* -> Alinhador flexbox responsivo duplo para canais de acionamento e cobrança. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Coluna flexível dedicada ao número telefônico que receberá as higienizações do sistema. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>TELEFONE (DDD) *</label> {/* -> Rótulo em caixa alta indicando campo de telefone obrigatório. */}
              <input type="text" required placeholder="Números (Ex: 37999887119)" value={conTelefone} onChange={(e) => setConTelefone(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto que enviará os dígitos para a máscara brasileira de celulares ou fixos. */}
            </div> {/* -> Fim da coluna de acionamento telefônico. */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}> {/* -> Coluna flexível dedicada ao endereço eletrônico cadastral. */}
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>E-MAIL CONTATO</label> {/* -> Rótulo informativo cinza neutro para indicar campo opcional de contato. */}
              <input type="text" placeholder="roberto@empresa.com" value={conEmail} onChange={(e) => setConEmail(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", color: "#0f172a" }} /> {/* -> Entrada de texto livre que passará pelas travas de validação do símbolo arroba (@). */}
            </div> {/* -> Fim da coluna de e-mail eletrônico. */}
          </div> {/* -> Fim da linha dupla intermediária inferior. */}

          {/* CAMPO RECONFIGURADO: DROPDOWN DINÂMICO CONECTADO ÀS DIRETRIZES DA COLEÇÃO CADASTROS_VINCULOS */}
          <div style={{ display: "flex", flexDirection: "column" }}> {/* -> Alinhador vertical em lote para classificação de dependência civil e papel do contato. */}
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>VÍNCULO JURÍDICO / PAPEL</label> {/* -> Rótulo informativo cinza neutro identificador da caixa de seleção. */}
            <select 
              value={conTipo} 
              onChange={(e) => setConTipo(e.target.value)} 
              style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", background: "#ffffff", color: "#0f172a", fontWeight: "700", cursor: "pointer" }} // -> Menu dropdown corporativo denso configurado em 12px com peso em negrito para cliques do operador.
            >
              <option value="responsavel">-- Selecionar papel cadastrado --</option> {/* -> Opção neutra de instrução inicial padrão caso o usuário não clique em nada. */}
              {listaVinculos.map((vin) => ( // -> INVERSÃO DE LÓGICA CONCLUÍDA: Realiza o laço reativo mapeando os documentos reais vindos em tempo real da nuvem do Firebase.
                <option key={vin.id} value={vin.label}>{vin.label}</option> // -> Renderiza o papel corporativo de forma viva (Ex: Sócio, Diretor) capturando as chaves textuais imutáveis.
              ))} {/* -> Encerra o laço mapeador de opções dinâmicas da coleção de vínculos. */}
            </select> {/* -> Encerra a caixa seletora de papéis civis e vínculos dinâmicos. */}
          </div> {/* -> Fim do campo de classificação jurídica relacional. */}

          {/* RODAPÉ DO MODAL: BOTÕES DE COMANDO DE CONSOLIDAÇÃO */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}> {/* -> Adicionado traço de divisão sutil e padding superior para otimização visual sóbria do fechamento. */}
            <button type="button" onClick={aoFechar} style={{ background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#475569" }}>Cancelar</button> {/* -> Botão sóbrio de recusa voluntária que descarta as alterações e fecha o modal. */}
            <button type="submit" style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "12px" }}>Vincular Representante</button> {/* -> Botão mestre de salvaguarda sólido Azul Escuro Profundo que submete o formulário. */}
          </div> {/* -> Encerra o agrupador de botões do rodapé. */}

        </form> {/* -> Encerra a tag estrutural do formulário de elos relacionais humanos. */}
      </div> {/* -> Encerra o cartão interno branco do modal flutuante. */}
    </div> // -> Encerra o contêiner flutuante mestre de isolamento de tela.
  );
}