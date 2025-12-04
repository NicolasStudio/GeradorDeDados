// Dados para geração de perfis fictícios
const nomesMasculinos = [
    'João Silva', 'Pedro Santos', 'Carlos Oliveira', 'Antônio Costa', 'Francisco Pereira',
    'Paulo Souza', 'Lucas Almeida', 'Marcos Rodrigues', 'Fernando Lima', 'Rafael Gomes'
];

const nomesFemininos = [
    'Maria Silva', 'Ana Santos', 'Cláudia Oliveira', 'Patrícia Costa', 'Juliana Pereira',
    'Amanda Souza', 'Beatriz Almeida', 'Carla Rodrigues', 'Fernanda Lima', 'Rafaela Gomes'
];

const sobrenomes = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Lima', 'Gomes', 'Costa',
    'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Pereira', 'Nascimento', 'Araújo', 'Melo', 'Barbosa', 'Rocha'
];

const cidadesEstados = [
    'São Paulo/SP', 'Rio de Janeiro/RJ', 'Belo Horizonte/MG', 'Porto Alegre/RS', 'Curitiba/PR',
    'Salvador/BA', 'Fortaleza/CE', 'Recife/PE', 'Brasília/DF', 'Manaus/AM',
    'Florianópolis/SC', 'Vitória/ES', 'Goiânia/GO', 'Campo Grande/MS', 'Cuiabá/MT'
];

const logradouros = [
    'Rua das Flores', 'Avenida Paulista', 'Rua XV de Novembro', 'Avenida Brasil', 'Rua da Paz',
    'Avenida Getúlio Vargas', 'Rua São João', 'Avenida Rio Branco', 'Rua das Palmeiras', 'Avenida das Nações'
];

// Função para gerar CPF válido
function gerarCPF() {
    const n = 9;
    let n1 = Math.floor(Math.random() * n);
    let n2 = Math.floor(Math.random() * n);
    let n3 = Math.floor(Math.random() * n);
    let n4 = Math.floor(Math.random() * n);
    let n5 = Math.floor(Math.random() * n);
    let n6 = Math.floor(Math.random() * n);
    let n7 = Math.floor(Math.random() * n);
    let n8 = Math.floor(Math.random() * n);
    let n9 = Math.floor(Math.random() * n);
    
    let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;
    
    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;
    
    return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
}

// Função para gerar RG
function gerarRG() {
    const numeros = Math.floor(10000000 + Math.random() * 90000000);
    const digito = Math.floor(Math.random() * 10);
    return `${numeros}-${digito}`;
}

// Função para gerar data de nascimento aleatória (18-70 anos)
function gerarDataNascimento() {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const anoNascimento = anoAtual - (18 + Math.floor(Math.random() * 53)); // 18-70 anos
    const mes = Math.floor(Math.random() * 12) + 1;
    const dia = Math.floor(Math.random() * 28) + 1;
    
    const data = new Date(anoNascimento, mes - 1, dia);
    return data.toLocaleDateString('pt-BR');
}

// Função para gerar telefone
function gerarTelefone(fixo = false) {
    const ddd = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];
    const dddAleatorio = ddd[Math.floor(Math.random() * ddd.length)];
    
    if (fixo) {
        const numero = Math.floor(3000 + Math.random() * 7000) + '-' + 
                      Math.floor(1000 + Math.random() * 9000);
        return `(${dddAleatorio}) ${numero}`;
    } else {
        const numero = '9' + Math.floor(1000 + Math.random() * 9000) + '-' + 
                      Math.floor(1000 + Math.random() * 9000);
        return `(${dddAleatorio}) ${numero}`;
    }
}

// Função para gerar e-mail baseado no nome
function gerarEmail(nome) {
    const nomes = nome.toLowerCase().split(' ');
    const primeiroNome = nomes[0];
    const ultimoNome = nomes[nomes.length - 1];
    const provedores = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br'];
    const provedor = provedores[Math.floor(Math.random() * provedores.length)];
    
    return `${primeiroNome}.${ultimoNome}@${provedor}`;
}

// Função para gerar CEP
function gerarCEP() {
    const numeros = Math.floor(10000 + Math.random() * 90000);
    const sufixo = Math.floor(100 + Math.random() * 900);
    return `${numeros}-${sufixo}`;
}

// Função para gerar endereço completo
function gerarEndereco() {
    const logradouro = logradouros[Math.floor(Math.random() * logradouros.length)];
    const numero = Math.floor(10 + Math.random() * 990);
    const complementos = ['', 'Apto 101', 'Sala 202', 'Casa 2', 'Bloco B'];
    const complemento = complementos[Math.floor(Math.random() * complementos.length)];
    
    let endereco = `${logradouro}, ${numero}`;
    if (complemento) {
        endereco += `, ${complemento}`;
    }
    
    return endereco;
}

// Função principal para gerar uma pessoa
function gerarPessoa() {
    // Escolher gênero aleatoriamente
    const genero = Math.random() > 0.5 ? 'Masculino' : 'Feminino';
    
    // Escolher nome baseado no gênero
    let nome;
    if (genero === 'Masculino') {
        nome = nomesMasculinos[Math.floor(Math.random() * nomesMasculinos.length)];
    } else {
        nome = nomesFemininos[Math.floor(Math.random() * nomesFemininos.length)];
    }
    
    // Gerar sobrenome adicional
    const sobrenomeAdicional = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    nome = `${nome.split(' ')[0]} ${nome.split(' ')[1]} ${sobrenomeAdicional}`;
    
    // Gerar outros dados
    const dataNascimento = gerarDataNascimento();
    const cpf = gerarCPF();
    const rg = gerarRG();
    const email = gerarEmail(nome);
    const telFixo = gerarTelefone(true);
    const telCelular = gerarTelefone(false);
    const endereco = gerarEndereco();
    const cidadeEstado = cidadesEstados[Math.floor(Math.random() * cidadesEstados.length)];
    const cep = gerarCEP();
    
    // Preencher os campos
    document.getElementById('nome').value = nome;
    document.getElementById('genero').value = genero;
    document.getElementById('dataNasc').value = dataNascimento;
    document.getElementById('cpf').value = cpf;
    document.getElementById('rg').value = rg;
    document.getElementById('email').value = email;
    document.getElementById('telFixo').value = telFixo;
    document.getElementById('telCelular').value = telCelular;
    document.getElementById('endereco').value = endereco;
    document.getElementById('cidadeEstado').value = cidadeEstado;
    document.getElementById('cep').value = cep;
    
    // Animar os campos
    const campos = document.querySelectorAll('.pessoa-input');
    campos.forEach((campo, index) => {
        setTimeout(() => {
            campo.style.transform = 'scale(1.02)';
            campo.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.1)';
            
            setTimeout(() => {
                campo.style.transform = '';
                campo.style.boxShadow = '';
            }, 300);
        }, index * 50);
    });
}

// Função para copiar um campo específico
function copiarCampo(idCampo) {
    const campo = document.getElementById(idCampo);
    const valor = campo.value;
    
    if (!valor) {
        alert('Campo vazio! Gere um perfil primeiro.');
        return;
    }
    
    navigator.clipboard.writeText(valor).then(() => {
        // Feedback visual no botão
        const botao = event.currentTarget;
        const originalHtml = botao.innerHTML;
        botao.innerHTML = '<i class="fas fa-check"></i>';
        botao.style.background = '#10b981';
        
        setTimeout(() => {
            botao.innerHTML = originalHtml;
            botao.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Erro ao copiar. Tente novamente.');
    });
}

// Função para copiar perfil completo
function copiarPerfilCompleto() {
    const campos = ['nome', 'genero', 'dataNasc', 'cpf', 'rg', 'email', 'telFixo', 'telCelular', 'endereco', 'cidadeEstado', 'cep'];
    let perfilCompleto = '=== PERFIL FICTÍCIO ===\n\n';
    
    // Verificar se todos os campos têm valor
    let camposVazios = 0;
    campos.forEach(id => {
        const valor = document.getElementById(id).value;
        if (!valor) camposVazios++;
    });
    
    if (camposVazios === campos.length) {
        alert('Gere um perfil primeiro!');
        return;
    }
    
    // Construir texto
    campos.forEach(id => {
        const campo = document.getElementById(id);
        const label = campo.previousElementSibling?.textContent || id;
        const valor = campo.value;
        
        if (valor) {
            perfilCompleto += `${label}: ${valor}\n`;
        }
    });
    
    perfilCompleto += '\n=== Work tools ===\nGerado por: Gerador de Perfis Fictícios';
    
    navigator.clipboard.writeText(perfilCompleto).then(() => {
        // Feedback visual
        const botao = event.currentTarget;
        const originalHtml = botao.innerHTML;
        botao.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        botao.style.background = '#10b981';
        
        setTimeout(() => {
            botao.innerHTML = originalHtml;
            botao.style.background = '';
        }, 2000);
    });
}

// Função para exportar perfil
function exportarPerfil() {
    const campos = ['nome', 'genero', 'dataNasc', 'cpf', 'rg', 'email', 'telFixo', 'telCelular', 'endereco', 'cidadeEstado', 'cep'];
    let perfilCompleto = '=== PERFIL FICTÍCIO ===\n';
    perfilCompleto += `Data de geração: ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    // Verificar se todos os campos têm valor
    let camposVazios = 0;
    campos.forEach(id => {
        const valor = document.getElementById(id).value;
        if (!valor) camposVazios++;
    });
    
    if (camposVazios === campos.length) {
        alert('Gere um perfil primeiro!');
        return;
    }
    
    // Construir texto
    campos.forEach(id => {
        const campo = document.getElementById(id);
        const label = campo.previousElementSibling?.textContent || id;
        const valor = campo.value;
        
        if (valor) {
            perfilCompleto += `${label}: ${valor}\n`;
        }
    });
    
    perfilCompleto += '\n=== Work tools ===\nGerado por: Gerador de Perfis Fictícios';
    
    // Criar blob e fazer download
    const blob = new Blob([perfilCompleto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-ficticio-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Função para limpar todos os campos
function limparCampos() {
    const campos = document.querySelectorAll('.pessoa-input');
    campos.forEach(campo => {
        campo.value = '';
    });
    
    // Feedback visual
    const section = document.getElementById('profileSection');
    section.style.opacity = '0.8';
    section.style.transform = 'scale(0.99)';
    
    setTimeout(() => {
        section.style.opacity = '';
        section.style.transform = '';
    }, 300);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {

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