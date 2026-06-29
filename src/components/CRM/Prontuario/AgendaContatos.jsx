import React, { useState } from "react"; // -> Traz a biblioteca mestre do React e o gancho useState para gerenciar os pop-ups locais de canais de atendimento na memória RAM.
import { Phone, Mail, User, Link } from "lucide-react"; // -> Injeta as ferramentas de ícones finos, monocromáticos e sóbrios da biblioteca Lucide para o padrão executivo.

export default function AgendaContatos({ listaContatosFirebase, valorOriginalDivida, card, dispararWhatsAppLocal, dispararEmailLocal }) { // -> Declara e exporta a função do componente recebendo a lista viva de contactos e os disparadores do pai.
  const [menuWhatsAberto, setMenuWhatsAberto] = useState(null); // -> Rastreia localmente se o menu de opções do WhatsApp de um contacto específico está aceso na linha.
  const [menuEmailAberto, setMenuEmailAberto] = useState(null); // -> Rastreia localmente se o menu de opções de e-mail de um contacto específico está aceso na linha.

  return ( // -> Inicia o retorno do bloco visual que desenha a agenda de contactos representantes humanos no ecrã.
    <div style={{ textAlign: "left" }}> {/* -> Garante o alinhamento de todos os sub-blocos rigorosamente à esquerda da margem. */}
      <h4 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px 0", fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}> {/* -> Título da seção em letras maiúsculas sóbrias corporativas. */}
        <Phone size={13} strokeWidth={2.5} style={{ color: "#475569" }} /> {/* -> Injeta o ícone vetorial de telefone linear fino do Lucide. */}
        <span>Agenda Contatos</span> {/* -> Rótulo em texto do cabeçalho da agenda. */}
      </h4>

      <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}> {/* -> Empilhador vertical de cartões de representantes humanos. */}
        {listaContatosFirebase.map((con) => (
          <div key={con.id} style={{ padding: "8px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", borderLeft: "3px solid #0f172a", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "700", color: "#0f172a" }}>
              <User size={12} strokeWidth={2} />
              <span>{con.nome || "NOME NÃO INFORMADO"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Link size={10} strokeWidth={2} /> <span>Vínculo: {con.tipoVinculo || "Responsável Legal"}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={10} strokeWidth={2} /> <span>{con.email || "Não informado"}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#2563eb", fontWeight: "bold", marginTop: "2px" }}><Phone size={10} strokeWidth={2} /> <span>{con.telephone || con.telefone || "NÃO INFORMADO"}</span></div>
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "8px", borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
              <button type="button" onClick={() => dispararWhatsAppLocal(con.nome, (con.telephone || con.telefone))} style={{ flex: 1, background: "#25d366", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>WhatsApp</button>
              {con.email && con.email !== "Não informado" && (
                <button type="button" onClick={() => dispararEmailLocal(con.email, con.nome, "gmail")} style={{ flex: 1, background: "#2563eb", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>E-mail</button>
              )}
            </div>
          </div>
        ))}

        {listaContatosFirebase.length === 0 && ( // -> Comportamento de agenda deserta.
          <div style={{ padding: "10px", background: "#ffffff", border: "1px dashed #cbd5e1", borderRadius: "6px", fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>
            Nenhum contacto localizado para este CNPJ na base NoSQL.
          </div>
        )}
      </div>
    </div>
  );
}