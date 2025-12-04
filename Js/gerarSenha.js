// Funções específicas para Gerador de Senhas

// Conjuntos de caracteres
const caracteres = {
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%&*'
};

// Atualizar valor do range
function atualizarValorRange() {
    const tamanho = document.getElementById('tamanhoSenha').value;
    document.getElementById('tamanhoValue').textContent = `${tamanho} caracteres`;
}

// Gerar uma senha
function gerarSenha() {
    // Obter configurações
    const tamanho = parseInt(document.getElementById('tamanhoSenha').value);
    const incluirMaiusculas = document.getElementById('incluirMaiusculas').checked;
    const incluirMinusculas = document.getElementById('incluirMinusculas').checked;
    const incluirNumeros = document.getElementById('incluirNumeros').checked;
    const incluirSimbolos = document.getElementById('incluirSimbolos').checked;
    
    // Verificar se pelo menos um tipo está selecionado
    if (!incluirMaiusculas && !incluirMinusculas && !incluirNumeros && !incluirSimbolos) {
        alert('Selecione pelo menos um tipo de caractere!');
        return;
    }
    
    // Construir conjunto de caracteres disponíveis
    let caracteresDisponiveis = '';
    
    if (incluirMaiusculas) caracteresDisponiveis += caracteres.maiusculas;
    if (incluirMinusculas) caracteresDisponiveis += caracteres.minusculas;
    if (incluirNumeros) caracteresDisponiveis += caracteres.numeros;
    if (incluirSimbolos) caracteresDisponiveis += caracteres.simbolos;
    
    // Verificar se há caracteres disponíveis
    if (caracteresDisponiveis.length === 0) {
        alert('Não há caracteres disponíveis para gerar a senha! Verifique as configurações.');
        return;
    }
    
    // Gerar senha
    let senha = '';
    for (let i = 0; i < tamanho; i++) {
        const randomIndex = Math.floor(Math.random() * caracteresDisponiveis.length);
        senha += caracteresDisponiveis[randomIndex];
    }
    
    // Exibir senha
    const campoSenha = document.getElementById('caixaResposta');
    campoSenha.value = senha;
    
    // Adicionar animação
    campoSenha.style.transform = 'scale(1.02)';
    campoSenha.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.3)';
    
    setTimeout(() => {
        campoSenha.style.transform = '';
        campoSenha.style.boxShadow = '';
    }, 300);
}

// Gerar múltiplas senhas
function gerarMultiplasSenhas() {
    // Primeiro verificar se pode gerar uma senha
    const incluirMaiusculas = document.getElementById('incluirMaiusculas').checked;
    const incluirMinusculas = document.getElementById('incluirMinusculas').checked;
    const incluirNumeros = document.getElementById('incluirNumeros').checked;
    const incluirSimbolos = document.getElementById('incluirSimbolos').checked;
    
    if (!incluirMaiusculas && !incluirMinusculas && !incluirNumeros && !incluirSimbolos) {
        alert('Selecione pelo menos um tipo de caractere!');
        return;
    }
    
    const container = document.getElementById('multiplePasswords');
    container.innerHTML = '';
    
    // Gerar 5 senhas
    for (let i = 0; i < 5; i++) {
        const tamanho = parseInt(document.getElementById('tamanhoSenha').value);
        
        // Construir conjunto de caracteres disponíveis
        let caracteresDisponiveis = '';
        
        if (incluirMaiusculas) caracteresDisponiveis += caracteres.maiusculas;
        if (incluirMinusculas) caracteresDisponiveis += caracteres.minusculas;
        if (incluirNumeros) caracteresDisponiveis += caracteres.numeros;
        if (incluirSimbolos) caracteresDisponiveis += caracteres.simbolos;
        
        // Gerar senha
        let senha = '';
        for (let j = 0; j < tamanho; j++) {
            const randomIndex = Math.floor(Math.random() * caracteresDisponiveis.length);
            senha += caracteresDisponiveis[randomIndex];
        }
        
        // Criar elemento para a senha
        const passwordItem = document.createElement('div');
        passwordItem.className = 'password-item';
        passwordItem.innerHTML = `
            <span class="password-text">${senha}</span>
            <button class="password-copy" onclick="copiarSenhaEspecifica(this, '${senha}')">
                <i class="fas fa-copy"></i> Copiar
            </button>
        `;
        
        container.appendChild(passwordItem);
    }
    
    // Mostrar seção de resultados múltiplos
    document.getElementById('multiResults').style.display = 'block';
    
    // Scroll para resultados
    setTimeout(() => {
        document.getElementById('multiResults').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// Copiar senha específica (função atualizada para receber o botão)
function copiarSenhaEspecifica(botao, senha) {
    navigator.clipboard.writeText(senha).then(() => {
        // Feedback visual
        const originalHtml = botao.innerHTML;
        botao.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        botao.style.background = 'var(--cor-sucesso)';
        
        setTimeout(() => {
            botao.innerHTML = originalHtml;
            botao.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar senha. Tente novamente.');
    });
}

// Copiar senha principal
function copy(elementId) {
    const element = document.getElementById(elementId);
    const senha = element.value;
    
    if (!senha) {
        alert('Não há senha para copiar! Gere uma senha primeiro.');
        return;
    }
    
    navigator.clipboard.writeText(senha).then(() => {
        // Feedback visual no botão que foi clicado
        const button = event.currentTarget;
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        button.style.background = 'var(--cor-sucesso)';
        
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar senha. Tente novamente.');
    });
}

// Limpar senha
function clearPassword() {
    const campoSenha = document.getElementById('caixaResposta');
    campoSenha.value = '';
    campoSenha.placeholder = 'Clique em Gerar Senha...';
    
    // Esconder seção de múltiplas senhas
    document.getElementById('multiResults').style.display = 'none';
    document.getElementById('multiplePasswords').innerHTML = '';
    
    // Animação de limpeza
    campoSenha.style.transform = 'scale(0.98)';
    campoSenha.style.opacity = '0.8';
    
    setTimeout(() => {
        campoSenha.style.transform = '';
        campoSenha.style.opacity = '';
    }, 300);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Configurar range
    const rangeSlider = document.getElementById('tamanhoSenha');
    rangeSlider.addEventListener('input', atualizarValorRange);
    atualizarValorRange();
    
    // REMOVIDO COMPLETAMENTE: Não gerar senha automaticamente
    // O campo inicia vazio e o usuário precisa clicar em "Gerar Senha"
    
    // Garantir que o campo inicia vazio
    document.getElementById('caixaResposta').value = '';
    document.getElementById('caixaResposta').placeholder = 'Clique em Gerar Senha...';
    
    // Adicionar foco visual ao campo (opcional, pode remover se quiser)
    setTimeout(() => {
        const campo = document.getElementById('caixaResposta');
        campo.style.borderColor = 'var(--cor-primaria)';
        campo.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        
        setTimeout(() => {
            campo.style.borderColor = '';
            campo.style.boxShadow = '';
        }, 1500);
    }, 500);
});