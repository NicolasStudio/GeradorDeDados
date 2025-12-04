// Funções específicas para Calculadora de Datas

// Verificar se um ano é bissexto
function isAnoBissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
}

// Contar quantos anos bissextos entre duas datas
function contarAnosBissextos(dataInicial, dataFinal) {
    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    
    let count = 0;
    
    // Pegar anos
    const anoInicio = inicio.getFullYear();
    const anoFim = fim.getFullYear();
    
    // Contar anos bissextos no intervalo
    for (let ano = anoInicio; ano <= anoFim; ano++) {
        if (isAnoBissexto(ano)) {
            count++;
        }
    }
    
    return count;
}

// Formatar data para exibição
function formatarDataParaExibicao(dataString) {
    if (!dataString) return '--/--/----';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Atualizar displays das datas
function atualizarDisplaysData() {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    
    document.getElementById('displayDataInicial').textContent = formatarDataParaExibicao(dataInicial);
    document.getElementById('displayDataFinal').textContent = formatarDataParaExibicao(dataFinal);
}

// Definir data atual
function definirDataAtual(campoId) {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    
    document.getElementById(campoId).value = dataFormatada;
    atualizarDisplaysData();
}

// Calcular diferença entre datas considerando anos bissextos
function calcularDiferencaData(dataInicial, dataFinal, incluirBissexto = true) {
    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    
    // Ajustar para meia-noite para evitar problemas com horários
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(0, 0, 0, 0);
    
    // Verificar se a data final é anterior à inicial
    if (fim < inicio) {
        return {
            error: "A data final não pode ser anterior à data inicial.",
            anos: 0,
            meses: 0,
            dias: 0,
            totalDias: 0,
            anosBissextos: 0
        };
    }
    
    // Calcular diferença em dias (método preciso com milissegundos)
    const diffTime = fim - inicio;
    let totalDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Contar anos bissextos no intervalo
    const anosBissextos = contarAnosBissextos(dataInicial, dataFinal);
    
    // Se NÃO incluir cálculo de ano bissexto, subtrair os dias extras dos anos bissextos
    if (!incluirBissexto) {
        // Cada ano bissexto adiciona 1 dia extra, então subtraímos
        totalDias -= anosBissextos;
    }
    
    // Calcular anos, meses e dias (método calendário preciso)
    let anos = fim.getFullYear() - inicio.getFullYear();
    let meses = fim.getMonth() - inicio.getMonth();
    let dias = fim.getDate() - inicio.getDate();
    
    // Ajustar valores negativos
    if (dias < 0) {
        meses--;
        // Pegar último dia do mês anterior
        const ultimoDiaMesAnterior = new Date(fim.getFullYear(), fim.getMonth(), 0).getDate();
        dias = ultimoDiaMesAnterior - inicio.getDate() + fim.getDate();
    }
    
    if (meses < 0) {
        anos--;
        meses = 12 + meses;
    }
    
    return {
        anos: anos,
        meses: meses,
        dias: dias,
        totalDias: totalDias,
        anosBissextos: anosBissextos,
        error: null
    };
}

// Calcular dias úteis (exclui sábados e domingos)
function calcularDiasUteis(dataInicial, dataFinal) {
    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(0, 0, 0, 0);
    
    let diasUteis = 0;
    const dataAtual = new Date(inicio);
    
    while (dataAtual <= fim) {
        const diaSemana = dataAtual.getDay();
        // 0 = Domingo, 6 = Sábado
        if (diaSemana !== 0 && diaSemana !== 6) {
            diasUteis++;
        }
        dataAtual.setDate(dataAtual.getDate() + 1);
    }
    
    return diasUteis;
}

// Função principal de contagem
function contar() {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    const incluirBissexto = document.getElementById('incluirBissexto').checked;
    
    // Validar entradas
    if (!dataInicial || !dataFinal) {
        alert('Por favor, selecione ambas as datas.');
        return;
    }
    
    // Calcular diferença
    const resultado = calcularDiferencaData(dataInicial, dataFinal, incluirBissexto);
    
    if (resultado.error) {
        alert(resultado.error);
        return;
    }
    
    // Calcular métricas adicionais
    const diasUteis = calcularDiasUteis(dataInicial, dataFinal);
    const mesesCompletos = resultado.anos * 12 + resultado.meses;
    const diasRestantes = resultado.dias;
    
    // Atualizar interface
    document.getElementById('resultadoAnos').textContent = resultado.anos;
    document.getElementById('resultadoMeses').textContent = resultado.meses;
    document.getElementById('resultadoDias').textContent = resultado.dias;
    document.getElementById('resultadoTotal').textContent = resultado.totalDias.toLocaleString('pt-BR');
    document.getElementById('diasUteis').textContent = diasUteis.toLocaleString('pt-BR');
    document.getElementById('mesesCompletos').textContent = mesesCompletos.toLocaleString('pt-BR');
    document.getElementById('diasRestantes').textContent = diasRestantes.toLocaleString('pt-BR');
    document.getElementById('anosBissextos').textContent = resultado.anosBissextos.toLocaleString('pt-BR');
    document.getElementById('configInfo').textContent = incluirBissexto ? 'Com ano bissexto' : 'Ano comum (365 dias)';
    
    // Atualizar detalhes
    document.getElementById('detailDataInicial').textContent = formatarDataParaExibicao(dataInicial);
    document.getElementById('detailDataFinal').textContent = formatarDataParaExibicao(dataFinal);
    
    // Mostrar seção de resultados
    document.getElementById('resultsSection').style.display = 'block';
    
    // Scroll para resultados
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// Limpar campos
function limparCampoData() {
    document.getElementById('dataInicial').value = '';
    document.getElementById('dataFinal').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    atualizarDisplaysData();
}

// Copiar resultados
function copiarResultados() {
    const anos = document.getElementById('resultadoAnos').textContent;
    const meses = document.getElementById('resultadoMeses').textContent;
    const dias = document.getElementById('resultadoDias').textContent;
    const totalDias = document.getElementById('resultadoTotal').textContent;
    const anosBissextos = document.getElementById('anosBissextos').textContent;
    const config = document.getElementById('configInfo').textContent;
    const dataInicial = document.getElementById('detailDataInicial').textContent;
    const dataFinal = document.getElementById('detailDataFinal').textContent;
    
    const texto = `CÁLCULO DE INTERVALO ENTRE DATAS
De: ${dataInicial}
Até: ${dataFinal}

Configuração: ${config}
Anos bissextos no período: ${anosBissextos}

Resultado: ${anos} anos, ${meses} meses e ${dias} dias
Total em dias: ${totalDias}

Gerado por Work tools - Calculadora de Datas`;
    
    navigator.clipboard.writeText(texto).then(() => {
        // Feedback visual
        const button = event.currentTarget;
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        button.style.background = 'var(--cor-sucesso)';
        
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.style.background = '';
        }, 2000);
    });
}

// Exportar resultados
function exportarResultados() {
    const anos = document.getElementById('resultadoAnos').textContent;
    const meses = document.getElementById('resultadoMeses').textContent;
    const dias = document.getElementById('resultadoDias').textContent;
    const totalDias = document.getElementById('resultadoTotal').textContent;
    const diasUteis = document.getElementById('diasUteis').textContent;
    const anosBissextos = document.getElementById('anosBissextos').textContent;
    const config = document.getElementById('configInfo').textContent;
    const dataInicial = document.getElementById('detailDataInicial').textContent;
    const dataFinal = document.getElementById('detailDataFinal').textContent;
    
    const incluirBissexto = document.getElementById('incluirBissexto').checked;
    const configTexto = incluirBissexto ? 
        'Cálculo considera anos bissextos (366 dias para anos bissextos)' :
        'Cálculo simplificado (sempre 365 dias por ano)';
    
    const conteudo = `=== CÁLCULO DE INTERVALO ENTRE DATAS ===
Data da análise: ${new Date().toLocaleString('pt-BR')}

CONFIGURAÇÃO:
${configTexto}

DATAS ANALISADAS:
Data Inicial: ${dataInicial}
Data Final: ${dataFinal}

RESULTADOS:
Intervalo total: ${anos} anos, ${meses} meses e ${dias} dias
Total de dias: ${totalDias}
Dias úteis: ${diasUteis}
Anos bissextos no período: ${anosBissextos}

DETALHAMENTO:
Data inicial: ${dataInicial}
Data final: ${dataFinal}
Meses completos: ${document.getElementById('mesesCompletos').textContent}
Dias restantes: ${document.getElementById('diasRestantes').textContent}
Configuração utilizada: ${config}

=== Work tools ===
Gerado por: Calculadora de Datas`;

    // Criar blob e fazer download
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intervalo-datas-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Recalcular automaticamente quando checkbox mudar
function atualizarCalculo() {
    const dataInicial = document.getElementById('dataInicial').value;
    const dataFinal = document.getElementById('dataFinal').value;
    
    if (dataInicial && dataFinal && document.getElementById('resultsSection').style.display !== 'none') {
        contar();
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Configurar displays
    atualizarDisplaysData();
    
    // Atualizar displays quando datas mudarem
    document.getElementById('dataInicial').addEventListener('change', atualizarDisplaysData);
    document.getElementById('dataFinal').addEventListener('change', atualizarDisplaysData);
    
    // Adicionar evento para checkbox
    document.getElementById('incluirBissexto').addEventListener('change', atualizarCalculo);
    
    // Limpar o código que seta datas fixas - REMOVIDO
    // Não vamos preencher automaticamente as datas
    // O usuário deve escolher as datas manualmente ou clicar nos botões "Hoje"

        // Configurar botão de tema
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const themeIcon = toggleThemeBtn?.querySelector('i');
    
    if (toggleThemeBtn && themeIcon) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fas fa-sun';
        }
        
        toggleThemeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.className = 'fas fa-sun';
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.className = 'fas fa-moon';
            }
        });
    }
    
    atualizarDisplaysData();
});