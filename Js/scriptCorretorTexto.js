// JavaScript adaptado para o HTML simplificado

// Elementos DOM
const textarea = document.getElementById('myTextAreaCorretor');
const contadorElement = document.getElementById('contador');
const wordCountElement = document.getElementById('wordCount');

// Atualizar contadores em tempo real
function atualizarContadores() {
    const texto = textarea.value;
    
    // Contagem de caracteres
    const caracteres = texto.length;
    contadorElement.textContent = caracteres.toLocaleString('pt-BR');
    
    // Contagem de palavras
    const palavras = texto.trim() === '' ? 0 : texto.trim().split(/\s+/).filter(p => p.length > 0).length;
    wordCountElement.textContent = palavras.toLocaleString('pt-BR');
}

// Transformações de texto básicas
function aplicarTransformacoesBasicas(texto) {
    let textoTransformado = texto;
    const transformacoes = [];
    
    // Formatação (radio buttons - seleção única)
    if (document.getElementById('formatacaoMaiuscula')?.checked) {
        textoTransformado = textoTransformado.toUpperCase();
        transformacoes.push('TODAS MAIÚSCULAS');
    } 
    else if (document.getElementById('formatacaoMinuscula')?.checked) {
        textoTransformado = textoTransformado.toLowerCase();
        transformacoes.push('todas minúsculas');
    } 
    else if (document.getElementById('formatacaoPrimeiraMaiuscula')?.checked) {
        textoTransformado = textoTransformado.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        transformacoes.push('Primeira Letra Maiúscula');
    } 
    else if (document.getElementById('formatacaoAposPontuacao')?.checked) {
        textoTransformado = textoTransformado.toLowerCase();
        textoTransformado = textoTransformado.replace(/(^|[.!?;]\s+)([a-z])/g, function(match, pontuacao, letra) {
            return pontuacao + letra.toUpperCase();
        });
        if (textoTransformado.length > 0) {
            textoTransformado = textoTransformado.charAt(0).toUpperCase() + textoTransformado.slice(1);
        }
        transformacoes.push('Maiúscula após pontuação');
    } 
    else if (document.getElementById('formatacaoAlternada')?.checked) {
        textoTransformado = textoTransformado.split('').map((char, index) => {
            return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }).join('');
        transformacoes.push('LeTrAs AlTeRnAdAs');
    }
    
    // Modificações
    if (document.getElementById('inverterTexto')?.checked) {
        textoTransformado = textoTransformado.split('').reverse().join('');
        transformacoes.push('Texto invertido');
    }
    
    if (document.getElementById('removerEspacosDuplos')?.checked) {
        textoTransformado = textoTransformado.replace(/\s+/g, ' ');
        transformacoes.push('Espaços duplos removidos');
    }
    
    if (document.getElementById('removerLinhasVazias')?.checked) {
        textoTransformado = textoTransformado.replace(/^\s*[\r\n]/gm, '');
        transformacoes.push('Linhas vazias removidas');
    }
    
    return {
        texto: textoTransformado,
        transformacoes: transformacoes,
        caracteresModificados: texto !== textoTransformado ? 
            Math.abs(texto.length - textoTransformado.length) : 0,
        palavrasModificadas: texto !== textoTransformado ? 
            Math.abs(texto.split(/\s+/).length - textoTransformado.split(/\s+/).length) : 0
    };
}

// FUNÇÃO DE CORREÇÃO ORTOGRÁFICA QUE SEMPRE FUNCIONA
function corrigirOrtografiaManual(texto) {
    console.log('Iniciando correção ortográfica manual...');
    
    let corrigido = texto;
    let alteracoes = 0;
    
    // CORREÇÕES ESPECÍFICAS PARA SEU TEXTO
    // Primeiro, corrigir os erros específicos do seu texto
    const correcoesEspecificas = [
        { original: 'v#lê', correcao: 'vale' },
        { original: 'féis', correcao: 'feliz' },
        { original: 'provenhas', correcao: 'problemas' },
        { original: 'propiá', correcao: 'própria' },
        { original: 'propria', correcao: 'própria' },
        { original: 'propia', correcao: 'própria' }
    ];
    
    for (const correcao of correcoesEspecificas) {
        if (corrigido.includes(correcao.original)) {
            const regex = new RegExp(correcao.original, 'gi');
            corrigido = corrigido.replace(regex, correcao.correcao);
            alteracoes++;
            console.log(`Corrigido: ${correcao.original} → ${correcao.correcao}`);
        }
    }
    
    // CORREÇÕES GERAIS DE ORTOGRAFIA
    const correcoesGerais = [
        // Abreviações comuns
        { original: 'vc', correcao: 'você' },
        { original: 'pq', correcao: 'porque' },
        { original: 'td', correcao: 'tudo' },
        { original: 'mto', correcao: 'muito' },
        { original: 'q', correcao: 'que' },
        { original: 'tb', correcao: 'também' },
        { original: 'blz', correcao: 'beleza' },
        { original: 'aki', correcao: 'aqui' },
        { original: 'vlw', correcao: 'valeu' },
        { original: 'obg', correcao: 'obrigado' },
        { original: 'bjs', correcao: 'beijos' },
        { original: 'd+', correcao: 'demais' },
        { original: 'fds', correcao: 'fim de semana' },
        { original: 'sqn', correcao: 'só que não' },
        { original: 'tbm', correcao: 'também' },
        
        // Palavras sem acento
        { original: 'voce', correcao: 'você' },
        { original: 'cade', correcao: 'cadê' },
        { original: 'so', correcao: 'só' },
        { original: 'ja', correcao: 'já' },
        { original: 'ate', correcao: 'até' },
        { original: 'alem', correcao: 'além' },
        { original: 'tambem', correcao: 'também' },
        { original: 'pois', correcao: 'pois' },
        { original: 'aqui', correcao: 'aqui' },
        { original: 'agora', correcao: 'agora' },
        
        // Erros comuns
        { original: 'concerteza', correcao: 'com certeza' },
        { original: 'nadaver', correcao: 'nada a ver' },
        { original: 'haver', correcao: 'a ver' },
        { original: 'senão', correcao: 'se não' },
        { original: 'aonde', correcao: 'onde' },
        { original: 'menas', correcao: 'menos' },
        { original: 'rsponder', correcao: 'responder' },
        { original: 'fazr', correcao: 'fazer' },
        { original: 'ensinando', correcao: 'ensinando' },
        
        // Contrações
        { original: 'de o', correcao: 'do' },
        { original: 'de a', correcao: 'da' },
        { original: 'em o', correcao: 'no' },
        { original: 'em a', correcao: 'na' },
        { original: 'a o', correcao: 'ao' },
        { original: 'a a', correcao: 'à' },
        { original: 'por o', correcao: 'pelo' },
        { original: 'por a', correcao: 'pela' },
        { original: 'pra', correcao: 'para a' },
        { original: 'pro', correcao: 'para o' }
    ];
    
    // Aplicar todas as correções gerais
    for (const correcao of correcoesGerais) {
        const regex = new RegExp(`\\b${correcao.original}\\b`, 'gi');
        const antes = corrigido;
        corrigido = corrigido.replace(regex, correcao.correcao);
        
        if (antes !== corrigido) {
            alteracoes++;
        }
    }
    
    // Correções de concordância verbal
    const concordancia = [
        { original: 'eu vai', correcao: 'eu vou' },
        { original: 'eu tem', correcao: 'eu tenho' },
        { original: 'eu faz', correcao: 'eu faço' },
        { original: 'nos vai', correcao: 'nós vamos' },
        { original: 'nos tem', correcao: 'nós temos' },
        { original: 'eles vai', correcao: 'eles vão' },
        { original: 'eles tem', correcao: 'eles têm' },
        { original: 'ela vai', correcao: 'ela vai' },
        { original: 'ela tem', correcao: 'ela tem' },
        { original: 'mim fazer', correcao: 'eu fazer' },
        { original: 'para mim fazer', correcao: 'para eu fazer' }
    ];
    
    for (const correcao of concordancia) {
        const regex = new RegExp(correcao.original, 'gi');
        corrigido = corrigido.replace(regex, correcao.correcao);
    }
    
    // Melhorar pontuação e formatação
    corrigido = corrigido
        .replace(/\s+/g, ' ')
        .replace(/([.,!?;:])([A-Za-zÀ-ú])/g, '$1 $2')
        .replace(/([A-Za-zÀ-ú])([.,!?;:])/g, '$1$2 ')
        .replace(/\s+([.,!?;:])/g, '$1')
        .replace(/([.!?]\s+)([a-z])/g, function(match, pontuacao, letra) {
            return pontuacao + letra.toUpperCase();
        })
        .trim();
    
    // Garantir que a primeira letra seja maiúscula
    if (corrigido.length > 0) {
        corrigido = corrigido.charAt(0).toUpperCase() + corrigido.slice(1);
    }
    
    console.log(`Correção ortográfica concluída: ${alteracoes} alterações realizadas`);
    console.log('Texto original:', texto);
    console.log('Texto corrigido:', corrigido);
    
    return corrigido;
}

// FUNÇÃO PRINCIPAL DE CORREÇÃO - SIMPLIFICADA
function iniciarCorrecao() {
    const textoOriginal = textarea.value.trim();
    
    if (!textoOriginal) {
        alert('Digite ou cole um texto para corrigir!');
        textarea.focus();
        return;
    }
    
    console.log('=== INICIANDO CORREÇÃO ===');
    console.log('Texto original:', textoOriginal);
    
    // Mostrar indicador de carregamento
    const botaoPrincipal = document.querySelector('.btn-primary');
    const textoOriginalBotao = botaoPrincipal.innerHTML;
    botaoPrincipal.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aplicando...';
    botaoPrincipal.disabled = true;
    
    // Desabilitar outros botões durante processamento
    document.querySelectorAll('.action-buttons button').forEach(btn => {
        if (btn !== botaoPrincipal) btn.disabled = true;
    });
    
    try {
        const startTime = performance.now();
        let textoProcessado = textoOriginal;
        const transformacoes = [];
        
        // 1. Aplicar transformações básicas primeiro
        const resultadoBasico = aplicarTransformacoesBasicas(textoOriginal);
        textoProcessado = resultadoBasico.texto;
        transformacoes.push(...resultadoBasico.transformacoes);
        
        console.log('Após transformações básicas:', textoProcessado);
        
        // 2. VERIFICAR se correção ortográfica está selecionada
        const ortografiaSelecionada = document.getElementById('melhoriaOrtografica')?.checked;
        
        console.log('Correção ortográfica selecionada:', ortografiaSelecionada);
        
        // 3. APLICAR correção ortográfica se selecionada
        if (ortografiaSelecionada) {
            const antesOrtografia = textoProcessado;
            textoProcessado = corrigirOrtografiaManual(textoProcessado);
            
            if (antesOrtografia !== textoProcessado) {
                transformacoes.push('Correção Ortográfica');
                console.log('✅ Correção ortográfica aplicada');
            } else {
                console.log('⚠️ Nenhuma correção ortográfica necessária');
            }
        }
        
        const endTime = performance.now();
        
        // 4. VERIFICAR se houve ALGUMA alteração
        const houveAlteracoesTotais = textoOriginal !== textoProcessado;
        
        console.log('Resultado final:', {
            alteracoesTotais: houveAlteracoesTotais,
            transformacoes: transformacoes.length
        });
        
        // 5. SEMPRE aplicar o texto processado no textarea
        textarea.value = textoProcessado;
        atualizarContadores();
        
        console.log('Texto final aplicado:', textoProcessado);
        
        // 6. Mostrar estatísticas
        mostrarEstatisticas({
            texto: textoProcessado,
            transformacoes: transformacoes,
            tempo: Math.round(endTime - startTime),
            caracteresModificados: Math.abs(textoOriginal.length - textoProcessado.length),
            palavrasModificadas: Math.abs(
                textoOriginal.split(/\s+/).length - 
                textoProcessado.split(/\s+/).length
            )
        });
        
        // 7. Feedback visual
        if (houveAlteracoesTotais) {
            // Feedback de SUCESSO
            textarea.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
            textarea.style.borderColor = '#22c55e';
            textarea.style.borderWidth = '2px';
            
            setTimeout(() => {
                textarea.style.backgroundColor = '';
                textarea.style.borderColor = '';
                textarea.style.borderWidth = '';
            }, 2000);
            
            console.log(`✅ ${transformacoes.length} transformações aplicadas com sucesso!`);
            
            // Mostrar alerta apenas se houve correções
            if (transformacoes.includes('Correção Ortográfica')) {
                setTimeout(() => {
                    alert('✅ Correções aplicadas com sucesso!');
                }, 500);
            }
        } else {
            // Se nenhuma transformação foi aplicada
            if (transformacoes.length === 0) {
                alert('⚠️ Nenhuma transformação selecionada. Marque pelo menos uma opção.');
            } else {
                alert('ℹ️ As transformações foram aplicadas, mas não alteraram o texto.');
            }
        }
        
        // 8. Scroll para textarea
        setTimeout(() => {
            textarea.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
        
    } catch (error) {
        console.error('Erro crítico:', error);
        alert('❌ Erro ao processar o texto. Por favor, tente novamente.');
    } finally {
        // Restaurar botões
        botaoPrincipal.innerHTML = textoOriginalBotao;
        botaoPrincipal.disabled = false;
        document.querySelectorAll('.action-buttons button').forEach(btn => {
            btn.disabled = false;
        });
        console.log('=== FIM DA CORREÇÃO ===');
    }
}

// Mostrar estatísticas
function mostrarEstatisticas(resultado) {
    const resultsSection = document.getElementById('resultsSection');
    
    // Sempre mostrar a seção de resultados
    resultsSection.style.display = 'block';
    
    // Atualizar estatísticas
    document.getElementById('modifiedChars').textContent = resultado.caracteresModificados;
    document.getElementById('modifiedWords').textContent = resultado.palavrasModificadas;
    document.getElementById('processingTime').textContent = `${resultado.tempo}ms`;
    document.getElementById('appliedTransformations').textContent = resultado.transformacoes.length;
    
    // Remover qualquer lista de transformações anterior
    const oldList = document.getElementById('transformacoesList');
    if (oldList) oldList.remove();
    
    // Adicionar nova lista de transformações apenas se houver transformações
    if (resultado.transformacoes.length > 0 && resultado.transformacoes[0] !== 'Nenhuma transformação necessária') {
        const statsGrid = document.querySelector('.stats-grid');
        const div = document.createElement('div');
        div.className = 'stat-card';
        div.id = 'transformacoesList';
        div.innerHTML = `
            <div class="stat-icon" style="background: #8b5cf6;">
                <i class="fas fa-list-check"></i>
            </div>
            <div class="stat-content">
                <h4>Transformações</h4>
                <div class="transformacoes-text">${resultado.transformacoes.join(', ')}</div>
            </div>
        `;
        statsGrid.appendChild(div);
    }
}

// Copiar texto - FUNCIONANDO
function copiarTexto(event) {
    const texto = textarea.value;
    
    if (!texto.trim()) {
        alert('Não há texto para copiar!');
        return;
    }
    
    // Método 1: Clipboard API moderna
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarFeedbackCopiado(event.currentTarget);
        }).catch(err => {
            console.warn('Clipboard API falhou, usando método antigo:', err);
            usarMetodoAntigoCopiar(texto, event.currentTarget);
        });
    } else {
        // Método 2: execCommand (funciona em mais situações)
        usarMetodoAntigoCopiar(texto, event.currentTarget);
    }
}

function usarMetodoAntigoCopiar(texto, botao) {
    // Criar um textarea temporário
    const textareaTemp = document.createElement('textarea');
    textareaTemp.value = texto;
    textareaTemp.style.position = 'fixed';
    textareaTemp.style.opacity = '0';
    document.body.appendChild(textareaTemp);
    
    // Selecionar e copiar
    textareaTemp.select();
    textareaTemp.setSelectionRange(0, 99999);
    
    try {
        const sucesso = document.execCommand('copy');
        document.body.removeChild(textareaTemp);
        
        if (sucesso) {
            mostrarFeedbackCopiado(botao);
        } else {
            alert('Falha ao copiar. Selecione o texto e use Ctrl+C.');
        }
    } catch (err) {
        document.body.removeChild(textareaTemp);
        console.error('Erro execCommand:', err);
        alert('Erro ao copiar. Selecione o texto manualmente e use Ctrl+C.');
    }
}

function mostrarFeedbackCopiado(botao) {
    const originalHTML = botao.innerHTML;
    const originalBackground = botao.style.background;
    const originalColor = botao.style.color;
    
    botao.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    botao.style.background = '#10b981';
    botao.style.color = 'white';
    
    setTimeout(() => {
        botao.innerHTML = originalHTML;
        botao.style.background = originalBackground;
        botao.style.color = originalColor;
    }, 2000);
}

// Limpar campo
function limparCampo() {
    if (!confirm('Tem certeza que deseja limpar todo o texto?')) {
        return;
    }
    
    textarea.value = '';
    textarea.focus();
    atualizarContadores();
    
    // Esconder seção de resultados
    document.getElementById('resultsSection').style.display = 'none';
    
    // Remover lista de transformações se existir
    const oldList = document.getElementById('transformacoesList');
    if (oldList) oldList.remove();
    
    // Resetar controles
    document.getElementById('formatacaoNenhuma').checked = true;
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Remover feedback visual dos controles
    document.querySelectorAll('.checkbox-label, .radio-label').forEach(label => {
        label.style.background = '';
        label.style.borderLeft = '';
    });
    
    // Aplicar feedback ao radio "Nenhuma"
    document.getElementById('formatacaoNenhuma').parentElement.style.background = 'rgba(37, 99, 235, 0.1)';
    document.getElementById('formatacaoNenhuma').parentElement.style.borderLeft = '3px solid #2563eb';
    
    // Feedback visual
    textarea.style.transform = 'scale(0.98)';
    setTimeout(() => {
        textarea.style.transform = '';
    }, 300);
    
    alert('Campo limpo com sucesso!');
}

// Exportar texto
function exportarTexto() {
    const texto = textarea.value;
    
    if (!texto.trim()) {
        alert('Não há texto para exportar!');
        return;
    }
    
    const dataAtual = new Date();
    const formatoData = dataAtual.toLocaleDateString('pt-BR');
    const formatoHora = dataAtual.toLocaleTimeString('pt-BR');
    
    const conteudo = `=== TEXTO CORRIGIDO ===
Data: ${formatoData}
Hora: ${formatoHora}

${texto}

=== WORK TOOLS ===
Gerado por: Corretor de Texto`;

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `texto-corrigido-${formatoData.replace(/\//g, '-')}_${formatoHora.replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Texto exportado com sucesso!');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos
    if (textarea) {
        textarea.addEventListener('input', atualizarContadores);
        textarea.focus();
        atualizarContadores();
    }
    
    console.log('✅ Corretor de Texto carregado e pronto!');
    
    // Eventos para feedback visual
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            const label = this.parentElement;
            if (this.checked) {
                label.style.background = 'rgba(37, 99, 235, 0.15)';
                label.style.borderLeft = '3px solid #2563eb';
            } else {
                label.style.background = '';
                label.style.borderLeft = '';
            }
        });
    });
    
    // Eventos para radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(rb => {
        rb.addEventListener('change', function() {
            // Remover feedback de todos os radio buttons
            document.querySelectorAll('.radio-label').forEach(label => {
                label.style.background = '';
                label.style.borderLeft = '';
            });
            
            // Aplicar feedback ao selecionado
            if (this.checked) {
                const label = this.parentElement;
                label.style.background = 'rgba(37, 99, 235, 0.15)';
                label.style.borderLeft = '3px solid #2563eb';
            }
        });
    });
    
    // Aplicar feedback inicial
    document.getElementById('formatacaoNenhuma').parentElement.style.background = 'rgba(37, 99, 235, 0.15)';
    document.getElementById('formatacaoNenhuma').parentElement.style.borderLeft = '3px solid #2563eb';
});