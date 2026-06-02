// [Dev Sênior] Exporta o objeto mestre responsável por higienizar, mascarar e validar os múltiplos contatos das contas.
export const cadastroContatos = {

  // [Dev Sênior] Função mecânica que limpa o texto e deita o telefone no formato padrão brasileiro com DDD.
  higienizarTelefone(telefoneBruto) {
    let digitosPuros = (telefoneBruto || "").replace(/\D/g, ""); // Remove terminantemente qualquer letra, espaço ou símbolo mantendo apenas os números puros.
    if (digitosPuros.length > 11) digitosPuros = digitosPuros.slice(0, 11); // Corta o texto por segurança se o operador tentar digitar mais do que 11 números no telefone.
    
    if (digitosPuros.length > 10) { // Se o número limpo possuir 11 dígitos, aplica a máscara moderna de celular com o 9 na frente.
      return `(${digitosPuros.slice(0, 2)}) ${digitosPuros.slice(2, 7)}-${digitosPuros.slice(7)}`; //
    } else if (digitosPuros.length > 6) { // Se possuir entre 7 e 10 dígitos, projeta o formato clássico de telefone fixo nacional.
      return `(${digitosPuros.slice(0, 2)}) ${digitosPuros.slice(2, 6)}-${digitosPuros.slice(6)}`; //
    } else if (digitosPuros.length > 2) { // Se o operador estiver iniciando a digitação, fecha o parêntese isolando o código de área (DDD).
      return `(${digitosPuros.slice(0, 2)}) ${digitosPuros.slice(2)}`; //
    }
    return digitosPuros; // Retorna os números digitados sem máscara caso o campo tenha menos de 2 dígitos.
  }, // Encerra a higienização de telefones.

  // [Dev Sênior] Scanner de segurança que valida se o e-mail possui os caracteres obrigatórios do padrão internacional.
  validarSintaxeEmail(emailTexto) {
    if (!emailTexto) return true; // Se o campo estiver totalmente em branco, autoriza a validação neutra provisória.
    const regraExpressaoRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Monta o crivo eletrônico (Regex) que exige texto seguido por arroba, ponto e extensão.
    return regraExpressaoRegular.test(emailTexto); // Retorna verdadeiro se o e-mail for legítimo ou falso se faltarem os símbolos obrigatórios.
  }, // Encerra a validação de e-mails.

  // [Dev Sênior] Tradutor camaleão que transforma os IDs brutos do Firebase em pílulas visuais elegantes para o operador.
  traduzirVinculo(vinculoChave) {
    const mapaVinculos = { // Cria um dicionário mapeando os termos de sistema para emojis e textos humanos.
      'proprio': { emoji: '👤', texto: 'Próprio Devedor', corFundo: '#f1f5f9' }, //
      'socio': { emoji: '💼', texto: 'Sócio / Repres. Legal', corFundo: '#eff6ff' }, //
      'conjuge': { emoji: '🏠', texto: 'Cônjuge / Parceiro(a)', corFundo: '#fdf2f8' }, //
      'familiar': { emoji: '👥', texto: 'Familiar Próximo', corFundo: '#f0fdf4' }, //
      'colega': { emoji: '🏢', texto: 'Colega de Trabalho', corFundo: '#fff7ed' }, //
      'terceiro': { emoji: '📞', texto: 'Terceiro Recado', corFundo: '#fff1f2' } //
    };

    // Devolve o pacote visual correspondente ao vínculo ou retorna o carimbo de "Recado" caso venha uma chave inédita.
    return mapaVinculos[vinculoChave] || { emoji: '📞', texto: 'Terceiro Recado', corFundo: '#fff1f2' };
  } // Encerra o tradutor de vínculos.
}; // Sela por completo o objeto especialista cadastroContatos.