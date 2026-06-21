// [Dev Sênior] Hook encarregado de processar filtros complexos, buscas textuais combinadas e ordenação em memória RAM de forma ultra rápida.
import { useState, useMemo } from "react";

export const useCobrancasManager = (dadosCobrancasGlobais) => {
    // === Estados Reativos de Filtros e Painéis ===
    const [pesquisaFiltro, setPesquisaFiltro] = useState("");
    const [executivoSelecionado, setExecutivoSelecionado] = useState("");
    const [filtroFaixaAtraso, setFiltroFaixaAtraso] = useState("");
    const [filtroCarteira, setFiltroCarteira] = useState("");
    const [ordenacaoColuna, setOrdenacaoColuna] = useState({ campo: "vencimentoLiquido", direcao: "asc" });

    // === 1. Motor Computacional de Filtragem (Evita re-processamentos desnecessários) ===
    const cobrancasFiltradas = useMemo(() => {
        if (!dadosCobrancasGlobais || !Array.isArray(dadosCobrancasGlobais)) return [];

        return dadosCobrancasGlobais.filter((cobranca) => {
            // A) Filtro por Termo de Busca (Pesquisa Inteligente por Cliente, CNPJ, Documento ou Executivo)
            const termo = pesquisaFiltro.toLowerCase().trim();
            const bateTexto = !termo || 
                (cobranca.Cliente && cobranca.Cliente.toLowerCase().includes(termo)) ||
                (cobranca.CNPJ && cobranca.CNPJ.includes(termo)) ||
                (cobranca.NumeroDocumento && String(cobranca.NumeroDocumento).includes(termo)) ||
                (cobranca.ExecutivoVendas && cobranca.ExecutivoVendas.toLowerCase().includes(termo));

            // B) Filtro por Executivo de Vendas selecionado na gaveta
            const bateExecutivo = !executivoSelecionado || 
                (cobranca.ExecutivoVendas && cobranca.ExecutivoVendas === executivoSelecionado);

            // C) Filtro por Faixa de Atraso (Aging / Portfólio)
            const bateAtraso = !filtroFaixaAtraso || 
                (cobranca.AGE && cobranca.AGE === filtroFaixaAtraso);

            // D) Filtro por Carteira (Pública, Privada, etc.)
            const bateCarteira = !filtroCarteira || 
                (cobranca.Portifolio && cobranca.Portifolio === filtroCarteira);

            // Retorna verdadeiro se o registro passar simultaneamente por todos os critérios ativos
            return bateTexto && bateExecutivo && bateAtraso && bateCarteira;
        });
    }, [dadosCobrancasGlobais, pesquisaFiltro, executivoSelecionado, filtroFaixaAtraso, filtroCarteira]);

    // === 2. Motor Computacional de Ordenação Dinâmica ===
    const cobrancasOrdenadasCrm = useMemo(() => {
        const dadosParaOrdenar = [...cobrancasFiltradas];
        if (!ordenacaoColuna.campo) return dadosParaOrdenar;

        return dadosParaOrdenar.sort((itemA, itemB) => {
            let valorA = itemA[ordenacaoColuna.campo];
            let valorB = itemB[ordenacaoColuna.campo];

            // Trata valores nulos ou indefinidos para evitar erros de comparação
            if (valorA === undefined || valorA === null) valorA = "";
            if (valorB === undefined || valorB === null) valorB = "";

            // Comparação para tipos numéricos (como Montante Moeda)
            if (typeof valorA === "number" && typeof valorB === "number") {
                return ordenacaoColuna.direcao === "asc" ? valorA - valorB : valorB - valorA;
            }

            // Comparação textual ou de strings de data padrão ISO
            valorA = String(valorA).toLowerCase();
            valorB = String(valorB).toLowerCase();

            if (valorA < valorB) return ordenacaoColuna.direcao === "asc" ? -1 : 1;
            if (valorA > valorB) return ordenacaoColuna.direcao === "asc" ? 1 : -1;
            return 0;
        });
    }, [cobrancasFiltradas, ordenacaoColuna]);

    // === 3. Manipulador de Alternância de Ordenação por Coluna ===
    const alternarOrdenacao = (nomeCampo) => {
        setOrdenacaoColuna((ordemAtual) => {
            if (ordemAtual.campo === nomeCampo) {
                // Se já for a mesma coluna, inverte a direção de triagem
                return { campo: nomeCampo, direcao: ordemAtual.direcao === "asc" ? "desc" : "asc" };
            }
            // Se for uma coluna nova, define como ascendente por padrão
            return { campo: nomeCampo, direcao: "asc" };
        });
    };

    // === 4. Função Centralizada de Reset de Filtros ===
    const limparTodosOsFiltros = () => {
        setPesquisaFiltro("");
        setExecutivoSelecionado("");
        setFiltroFaixaAtraso("");
        setFiltroCarteira("");
        setOrdenacaoColuna({ campo: "vencimentoLiquido", direcao: "asc" });
    };

    return {
        // Estados expostos para bind direto nos inputs/gavetas
        pesquisaFiltro,
        setPesquisaFiltro,
        executivoSelecionado,
        setExecutivoSelecionado,
        filtroFaixaAtraso,
        setFiltroFaixaAtraso,
        filtroCarteira,
        setFiltroCarteira,
        ordenacaoColuna,

        // Coleções já calculadas em memória prontas para renderizar
        cobrancasFiltradas,
        cobrancasOrdenadasCrm,

        // Funções controladoras de estado
        alternarOrdenacao,
        limparTodosOsFiltros
    };
};