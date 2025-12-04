function retornar(){
    window.location.href = "index.html";
}

function redirecionarPessoa(){
    window.location.href = "gerarPessoas.html";
}

function redirecionarSenha(){
    window.location.href = "gerarSenha.html";
} 

function redirecionarCaractere(){
    window.location.href = "contadorCaractere.html";
} 

function redirecionarData(){
    window.location.href = "contadorData.html";
}


// ====== GERENCIAMENTO DE TEMA (funciona em todas as páginas) ======

// Inicializar tema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botão de tema
    const toggleThemeBtn = document.getElementById('toggleTheme');
    
    if (toggleThemeBtn) {
        const themeIcon = toggleThemeBtn.querySelector('i');
        
        // Verificar tema salvo no localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Aplicar tema salvo
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
        } else {
            document.body.classList.remove('dark-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
        }
        
        // Adicionar evento de clique
        toggleThemeBtn.addEventListener('click', function() {
            // Alternar tema
            document.body.classList.toggle('dark-theme');
            
            // Salvar preferência
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                if (themeIcon) {
                    themeIcon.className = 'fas fa-sun';
                }
            } else {
                localStorage.setItem('theme', 'light');
                if (themeIcon) {
                    themeIcon.className = 'fas fa-moon';
                }
            }
        });
    }
});