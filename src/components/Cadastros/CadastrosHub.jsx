// [Dev Sênior] Componente especialista isolado para renderizar o menu principal (Hub) de cartões simétricos da Central de Parametrização. -> Inicia o arquivo trazendo o motor do React.
import React from "react"; // -> Traz a biblioteca mestre do React para permitir a montagem da sintaxe de componentes visuais .jsx.
// Injeta os ícones monocromáticos executivos da biblioteca Lucide para ilustrar cada um dos 6 botões simétricos de configuração. -> Nota sobre a identidade visual DOCULOC.
import { Building2, User, Tag, Link2, Columns3, MessageSquare } from "lucide-react"; // -> Injeta as engines de ícones finos e sóbrios sem quebras de layout.

export default function CadastrosHub({ setVisaoPainel, totalEmpresas, totalContatos, totalSegmentos, totalVinculos, totalEtapas }) { // -> Declara e exporta a função do Hub recebendo as triggers de navegação e as contagens assíncronas do Firebase.
  return ( // -> Inicia o retorno do desenho da interface gráfica dos cartões inline no navegador.
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginTop: "8px" }}> {/* -> Grade responsiva CSS Grid que organiza os 6 cartões simetricamente adaptando-se ao tamanho do monitor (3x2 ou 3x3). */}
      
      {/* CARD INTERATIVO 1: BASE DE ASSISTIDOS (PESSOAS JURÍDICAS) */}
      <div 
        onClick={() => setVisaoPainel("empresas")} // -> Ouve o clique do mouse e altera o estado do painel no maestro para abrir a planilha de Empresas.
        style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} // -> Estilo inline estrutural em flexbox vertical com cantos suavizados em 8px padrão ClickUp.
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} // -> Efeito visual reativo: eleva levemente o cartão e escurece a borda quando o operador passa o mouse por cima (mouseover).
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }} // -> Efeito visual reativo: devolve o cartão para a posição de descanso original quando o mouse sai.
      >
        <div> {/* -> Divisora interna superior para agrupar o ícone e os textos descritivos. */}
          <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}> {/* -> Alinhador do ícone vetorial escuro. */}
            <Building2 size={24} strokeWidth={2} /> {/* -> Desenha o ícone grande outline de prédio corporativo representando as PJs credoras. */}
          </div> {/* -> Fim do alinhador do ícone. */}
          <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Base de Assistidos (Empresas)</h3> {/* -> Título da aba em caixa alta rígida executiva. */}
          <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie Razão Social, CNPJs obrigatórios, endereços de citações e status de matriz/filial.</p> {/* -> Texto explicativo de UX informando o objetivo das parametrizações de empresas. */}
        </div> {/* -> Fim do agrupador superior. */}
        <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Total Cadastrado: {totalEmpresas}</span> {/* -> Pílula de metadado cinza exibindo reativamente o total de empresas integradas lidas na nuvem. */}
      </div> {/* -> Encerra o Card 1. */}

      {/* CARD INTERATIVO 2: REPRESENTANTES FINANCEIROS (PESSOAS HUMANAS) */}
      <div 
        onClick={() => setVisaoPainel("contatos")} // -> Ouve o clique do mouse e altera o estado do painel no maestro para abrir a planilha de Contatos humanos.
        style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} // -> Estilo inline flat minimalista com cantos arredondados de 8px.
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} // -> Eleva o cartão e escurece o contorno no mouseenter.
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }} // -> Devolve o cartão para a posição neutra de descanso ao afastar o mouse.
      >
        <div> {/* -> Agrupador de textos do cartão. */}
          <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}> {/* -> Alinhador do ícone. */}
            <User size={24} strokeWidth={2} /> {/* -> Desenha o ícone outline de silhueta de usuário representando os contatos humanos. */}
          </div> {/* -> Fim do ícone. */}
          <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Representantes Financeiros (Contatos)</h3> {/* -> Título da sub-fase em caixa alta sóbria. */}
          <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Gerencie a fiação humana relacional, CPFs obrigatórios, telefones com DDD e e-mails com @.</p> {/* -> Texto explicativo detalhando as regras de digitação e máscaras humanas. */}
        </div> {/* -> Fim do agrupador. */}
        <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Total Cadastrado: {totalContatos}</span> {/* -> Pílula executiva exibindo reativamente o total de pessoas físicas gravadas no Firebase. */}
      </div> {/* -> Encerra o Card 2. */}

      {/* CARD INTERATIVO 3: SEGMENTOS DE MERCADO (COLEÇÃO AUTÔNOMA) */}
      <div 
        onClick={() => setVisaoPainel("segmentos")} // -> Ouve o clique do mouse e altera a tela do maestro abrindo o micro-gerenciador de nichos de mercado.
        style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} // -> Estilo inline padronizado DOCULOC.
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} // -> Aciona a elevação reativa 3D de margem.
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }} // -> Desativa a elevação ao retirar o mouse.
      >
        <div> {/* -> Agrupador de textos. */}
          <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}> {/* -> Alinhador. */}
            <Tag size={24} strokeWidth={2} /> {/* -> Desenha o ícone vetorial outline de etiqueta indicando indexadores ou categorias comerciais. */}
          </div> {/* -> Fim do ícone. */}
          <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Segmentos de Mercado</h3> {/* -> Título da coluna em caixa alta. */}
          <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice os nichos de atuação comercial de devedores (Ex: Logística, Varejo) in coleção separada.</p> {/* -> Texto explicativo de retaguarda. */}
        </div> {/* -> Fim do bloco. */}
        <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Setores Ativos: {totalSegmentos}</span> {/* -> Pílula exibindo a contagem síncrona de quantos ramos mercadológicos existem salvos na nuvem. */}
      </div> {/* -> Encerra o Card 3. */}

      {/* CARD INTERATIVO 4: TIPOS DE ELOS E VÍNCULOS JURÍDICOS */}
      <div 
        onClick={() => setVisaoPainel("vinculos")} // -> Ouve o clique do mouse abrindo o micro-gerenciador autônomo de vínculos contratuais civis.
        style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} // -> Estilo estrutural flat inline.
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} // -> Ativa realce estético de contorno.
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }} // -> Remove realce estético.
      >
        <div> {/* -> Agrupador de strings textuais. */}
          <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}> {/* -> Alinhador. */}
            <Link2 size={24} strokeWidth={2} /> {/* -> Desenha o ícone vetorial de elo de corrente simbolizando conexões societárias ou profissionais. */}
          </div> {/* -> Fim do ícone. */}
          <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Tipos de Elos e Vínculos</h3> {/* -> Título formal em caixa alta. */}
          <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Parametrice as categorias jurídicas de representation humana (Ex: Preposto, Sócio) in coleção separada.</p> {/* -> Texto informativo instruindo o operador sobre as amarrações civis. */}
        </div> {/* -> Fim do agrupador. */}
        <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Categorias: {totalVinculos}</span> {/* -> Pílula com o totalizadores numéricos de elos vigentes no Firestore. */}
      </div> {/* -> Encerra o Card 4. */}

      {/* CARD INTERATIVO 5: GERENCIAMENTO E PARAMETRIZAÇÃO DAS COLUNAS DO KANBAN */}
      <div 
        onClick={() => setVisaoPainel("funil")} // -> Ouve o clique abrindo a interface especialista de reconfiguração e ordenamento das raias do funil de cobrança.
        style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} // -> Estilo estrutural flat inline regulamentar.
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} // -> Dispara animação de sobreposição fina.
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }} // -> Finaliza animação ao retirar o mouse.
      >
        <div> {/* -> Agrupador de textos. */}
          <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}> {/* -> Alinhador. */}
            <Columns3 size={24} strokeWidth={2} /> {/* -> Desenha o componente outline de 3 colunas de blocos paralelos simulando as raias Kanban. */}
          </div> {/* -> Fim do ícone. */}
          <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Gerenciamento do Funil (CRM)</h3> {/* -> Título da central em caixa alta. */}
          <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Adicione, renomeie ou remova colunas vivas do Kanban ligando-as à máquina de estados Core.</p> {/* -> Texto informativo de UX detalhando a engrenagem das calhas. */}
        </div> {/* -> Fim do bloco. */}
        <span style={{ background: "#f1f5f9", color: "#1e293b", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "4px", border: "1px solid #e2e8f0", width: "fit-content", marginTop: "8px" }}>Etapas do Banco: {totalEtapas}</span> {/* -> Pílula com a volumetria exata de colunas ativas arquivadas no core do banco NoSQL. */}
      </div> {/* -> Encerra o Card 5. */}

      {/* CARD INTERATIVO 6: COCKPIT DE MODELOS E RÉGUAS DE NOTIFICAÇÕES (A CENTRAL DE MENSAGENS) */}
      <div 
        onClick={() => setVisaoPainel("mensagens")} // -> Ouve o clique do mouse redirecionando o operador de forma síncrona para a nova tela de templates de textos automáticos.
        style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s ease", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }} // -> Estilo estrutural flat inline institucional Azul Escuro DOCULOC.
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = "#cbd5e1"; }} // -> Dispara animação de elevação fina no mouseover.
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8f0"; }} // -> Restaura posição de descanso ao afastar o mouse.
      >
        <div> {/* -> Agrupador de strings textuais de descrição de ferramenta. */}
          <div style={{ color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center" }}> {/* -> Alinhador. */}
            <MessageSquare size={24} strokeWidth={2} /> {/* -> Desenha o componente sutil de balão de mensagens e conversações quadradas do Lucide. */}
          </div> {/* -> Fim do ícone. */}
          <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.3px" }}>Central de Mensagens</h3> {/* -> Título regulamentar do novo botão em caixa alta. */}
          <p style={{ margin: "0", fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>Configure os modelos, réguas e templates padrão de mensagens automáticas disparadas pelo ecossistema.</p> {/* -> Texto informativo traduzindo a finalidade corporativa da parametrização de réguas de cobrança. */}
        </div> {/* -> Fim do bloco de textos. */}
        <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "11px", fontWeight: "800", padding: "3px 10px", borderRadius: "4px", border: "1px solid #bae6fd", width: "fit-content", marginTop: "8px" }}>Status: Ativo</span> {/* -> Pílula azul claro indicativa de funcionamento ativo estável do sub-módulo secundário. */}
      </div> {/* -> Encerra o Card 6 de mensagens. */}

    </div> // -> Encerra a prancha de grid mestre dos cartões do Hub.
  );
}