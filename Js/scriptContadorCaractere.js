// Funções específicas para Contador de Caracteres

function atualizarContador() {
    const textarea = document.getElementById('myTextArea');
    const texto = textarea.value;
    
    // Elementos para mostrar as contagens
    const contadorElement = document.getElementById('contador');
    const countWithSpacesElement = document.getElementById('countWithSpaces');
    const countWithoutSpacesElement = document.getElementById('countWithoutSpaces');
    const wordCountElement = document.getElementById('wordCount');
    const sentenceCountElement = document.getElementById('sentenceCount');
    const lineCountElement = document.getElementById('lineCount');
    const readingTimeElement = document.getElementById('readingTime');
    
    // Configurações
    const countSpaces = document.getElementById('countSpaces')?.checked ?? true;
    const ignoreNumbers = document.getElementById('ignoreNumbers')?.checked ?? false;
    
    // Preparar texto considerando "Ignorar números"
    let textoFiltrado = texto;
    if (ignoreNumbers) {
        // Remove APENAS números (0-9), mantém pontuação e outros símbolos
        textoFiltrado = textoFiltrado.replace(/[0-9]/g, '');
    }
    
    // Cálculo para contagem PRINCIPAL (que aparece no topo)
    let contagemPrincipal;
    if (countSpaces) {
        // Conta TUDO incluindo espaços
        contagemPrincipal = textoFiltrado.length;
    } else {
        // Remove espaços antes de contar
        contagemPrincipal = textoFiltrado.replace(/\s/g, '').length;
    }
    
    // Cálculos para estatísticas detalhadas (AGORA consideram "Ignorar números")
    const caracteresComEspacos = textoFiltrado.length;
    const caracteresSemEspacos = textoFiltrado.replace(/\s/g, '').length;
    
    // Para palavras: precisa considerar se está ignorando números
    let textoParaPalavras = textoFiltrado;
    const palavras = textoParaPalavras.trim() === '' ? 0 : textoParaPalavras.trim().split(/\s+/).filter(p => p.length > 0).length;
    
    // Para sentenças e linhas: usa o texto filtrado também
    const sentencas = textoFiltrado.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const linhas = textoFiltrado.split('\n').filter(line => line.trim().length > 0).length;
    
    // Tempo de leitura (palavras por minuto)
    const palavrasPorMinuto = 200;
    const tempoLeitura = palavras > 0 ? Math.max(1, Math.ceil(palavras / palavrasPorMinuto)) : 0;
    
    // Atualizar elementos se existirem
    if (contadorElement) {
        contadorElement.textContent = contagemPrincipal.toLocaleString('pt-BR');
        contadorElement.classList.add('count-updated');
        setTimeout(() => contadorElement.classList.remove('count-updated'), 300);
    }
    
    if (countWithSpacesElement) {
        // MOSTRA a contagem com espaços do TEXTO FILTRADO
        countWithSpacesElement.textContent = caracteresComEspacos.toLocaleString('pt-BR');
        countWithSpacesElement.classList.add('count-updated');
        setTimeout(() => countWithSpacesElement.classList.remove('count-updated'), 300);
    }
    
    if (countWithoutSpacesElement) {
        // MOSTRA a contagem sem espaços do TEXTO FILTRADO
        countWithoutSpacesElement.textContent = caracteresSemEspacos.toLocaleString('pt-BR');
        countWithoutSpacesElement.classList.add('count-updated');
        setTimeout(() => countWithoutSpacesElement.classList.remove('count-updated'), 300);
    }
    
    if (wordCountElement) {
        // Palavras considerando se está ignorando números
        wordCountElement.textContent = palavras.toLocaleString('pt-BR');
        wordCountElement.classList.add('count-updated');
        setTimeout(() => wordCountElement.classList.remove('count-updated'), 300);
    }
    
    if (sentenceCountElement) {
        sentenceCountElement.textContent = sentencas.toLocaleString('pt-BR');
        sentenceCountElement.classList.add('count-updated');
        setTimeout(() => sentenceCountElement.classList.remove('count-updated'), 300);
    }
    
    if (lineCountElement) {
        lineCountElement.textContent = linhas.toLocaleString('pt-BR');
        lineCountElement.classList.add('count-updated');
        setTimeout(() => lineCountElement.classList.remove('count-updated'), 300);
    }
    
    if (readingTimeElement) {
        readingTimeElement.textContent = tempoLeitura === 0 ? '< 1 min' : `${tempoLeitura} min`;
        readingTimeElement.classList.add('count-updated');
        setTimeout(() => readingTimeElement.classList.remove('count-updated'), 300);
    }
}

function limparCampo() {
    const textarea = document.getElementById('myTextArea');
    textarea.value = '';
    textarea.focus();
    atualizarContador();
    
    // Feedback visual
    textarea.style.backgroundColor = 'var(--cor-container)';
    setTimeout(() => {
        textarea.style.backgroundColor = '';
    }, 500);
}

function copiarTexto() {
    const textarea = document.getElementById('myTextArea');
    const texto = textarea.value;
    
    if (texto.trim() === '') {
        alert('Não há texto para copiar!');
        return;
    }
    
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
    }).catch(err => {
        console.error('Erro ao copiar texto:', err);
        alert('Erro ao copiar texto. Tente novamente.');
    });
}

function exportarDados() {
    const textarea = document.getElementById('myTextArea');
    const texto = textarea.value;
    
    if (texto.trim() === '') {
        alert('Não há dados para exportar!');
        return;
    }
    
    // Obter configurações atuais
    const ignoreNumbers = document.getElementById('ignoreNumbers')?.checked ?? false;
    const countSpaces = document.getElementById('countSpaces')?.checked ?? true;
    
    // Preparar texto para estatísticas
    let textoParaEstatisticas = texto;
    if (ignoreNumbers) {
        textoParaEstatisticas = textoParaEstatisticas.replace(/[0-9]/g, '');
    }
    
    // Calcular com as configurações atuais
    const caracteresComConfig = countSpaces ? 
        textoParaEstatisticas.length : 
        textoParaEstatisticas.replace(/\s/g, '').length;
    
    // Coletar todas as estatísticas
    const stats = {
        texto: texto,
        caracteresComConfiguracao: caracteresComConfig,
        caracteresComEspacos: textoParaEstatisticas.length,
        caracteresSemEspacos: textoParaEstatisticas.replace(/\s/g, '').length,
        palavras: textoParaEstatisticas.trim() === '' ? 0 : textoParaEstatisticas.trim().split(/\s+/).length,
        sentencas: textoParaEstatisticas.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
        linhas: textoParaEstatisticas.split('\n').filter(line => line.trim().length > 0).length,
        configIgnorarNumeros: ignoreNumbers ? "SIM" : "NÃO",
        configIncluirEspacos: countSpaces ? "SIM" : "NÃO",
        dataAnalise: new Date().toLocaleString('pt-BR')
    };
    
    // Criar conteúdo para exportação
    const conteudo = `=== ANÁLISE DE TEXTO ===
Data: ${stats.dataAnalise}

CONFIGURAÇÕES:
• Ignorar números: ${stats.configIgnorarNumeros}
• Incluir espaços: ${stats.configIncluirEspacos}

TEXTO ANALISADO:
${stats.texto}

=== ESTATÍSTICAS ===
Caracteres (configuração atual): ${stats.caracteresComConfiguracao}
Caracteres (com espaços): ${stats.caracteresComEspacos}
Caracteres (sem espaços): ${stats.caracteresSemEspacos}
Palavras: ${stats.palavras}
Sentenças: ${stats.sentencas}
Linhas: ${stats.linhas}

=== Work tools ===
Gerado por: Contador de Caracteres`;

    // Criar blob e fazer download
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-texto-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Inicializar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('myTextArea');
    
    if (textarea) {
        // Atualizar contador em tempo real
        textarea.addEventListener('input', atualizarContador);
        
        // Atualizar quando opções mudarem
        const options = ['countSpaces', 'ignoreNumbers'];
        options.forEach(optionId => {
            const element = document.getElementById(optionId);
            if (element) {
                element.addEventListener('change', atualizarContador);
            }
        });
        
        // Configurar foco automático
        setTimeout(() => {
            textarea.focus();
        }, 300);
        
        // Inicializar contador
        atualizarContador();
    }
    
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
});

// Função de retorno (para compatibilidade)
function retornar() {
    window.location.href = 'index.html';
}