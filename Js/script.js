const caixaResposta = document.querySelector('.caixaResposta');
const btn = document.querySelector('.btnGerar');

function gerarSenha() {
    const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
    const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    const caracteresEspeciais = '!@#$%&*';

    const todosCaracteres = letrasMinusculas + letrasMaiusculas + numeros + caracteresEspeciais;

    let senha = '';

    for (let i = 0; i < 10; i++) {
        const indiceAleatorio = Math.floor(Math.random() * todosCaracteres.length);
        senha += todosCaracteres.charAt(indiceAleatorio);
    }

    caixaResposta.value = senha;
}

btn.addEventListener('click', gerarSenha);

function copy() {
    const caixa = document.getElementById("caixaResposta");
    navigator.clipboard.writeText(caixa.value)
        .then(() => alert("Texto copiado!"))
        .catch(err => console.error("Erro ao copiar: ", err));
}

function copy(idCampo) {
    const campo = document.getElementById(idCampo);
    navigator.clipboard.writeText(campo.value)
        .catch(err => console.error("Erro ao copiar: ", err));
}

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

// Gerar nome
function gerarPessoa() {
    fetch("https://randomuser.me/api/?nat=br")
      .then(response => response.json())
      .then(data => {
        const user = data.results[0];
  
        // Nome completo
        document.getElementById("nome").value = `${user.name.first} ${user.name.last}`;
  
        // Email
        document.getElementById("email").value = user.email;
  
        // Data de nascimento
        const dataNasc = new Date(user.dob.date);
        document.getElementById("dataNasc").value = dataNasc.toLocaleDateString('pt-BR');
  
        // Telefones
        document.getElementById("telFixo").value = formatarTelefone(user.phone, false);
        document.getElementById("telCelular").value = formatarTelefone(user.cell, true);
        
  
        // CPF e RG fictícios (simples gerador)
        document.getElementById("cpf").value = gerarCPF();
        document.getElementById("rg").value = gerarRG();
      })
      .catch(err => console.error("Erro ao gerar pessoa:", err));
}
  
// Gerador simples de CPF (apenas para fins fictícios)
function gerarCPFValido() {
    const n = [];

    for (let i = 0; i < 9; i++) {
        n.push(Math.floor(Math.random() * 10));
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += n[i] * (10 - i);
    }
    let resto = soma % 11;
    let dig1 = resto < 2 ? 0 : 11 - resto;
    n.push(dig1);

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += n[i] * (11 - i);
    }
    resto = soma % 11;
    let dig2 = resto < 2 ? 0 : 11 - resto;
    n.push(dig2);

    return `${n[0]}${n[1]}${n[2]}.${n[3]}${n[4]}${n[5]}.${n[6]}${n[7]}${n[8]}-${n[9]}${n[10]}`;
}

function gerarDataNascimento() {
    const start = new Date(1950, 0, 1);
    const end = new Date(2005, 0, 1);
    const data = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function gerarTelefoneFixo() {
    const ddd = Math.floor(Math.random() * 90 + 10);
    const parte1 = Math.floor(Math.random() * 9000 + 1000);
    const parte2 = Math.floor(Math.random() * 9000 + 1000);
    return `(${ddd}) ${parte1}-${parte2}`;
}

function gerarCelular() {
    const ddd = Math.floor(Math.random() * 90 + 10);
    const parte1 = 9; // celular sempre começa com 9
    const parte2 = Math.floor(Math.random() * 90000000 + 10000000);
    return `(${ddd}) ${parte1}${parte2.toString().padStart(8, '0').slice(0,4)}-${parte2.toString().slice(4,8)}`;
}

function gerarNome() {
    const nomes = ["João", "Maria", "Carlos", "Ana", "Pedro", "Julia", "Marcos", "Beatriz"];
    const sobrenomes = ["Silva", "Souza", "Lima", "Oliveira", "Pereira", "Almeida", "Fernandes"];
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    return `${nome} ${sobrenome}`;
}

function gerarEmail(nome) {
    const dominio = ["gmail.com", "hotmail.com", "yahoo.com"];
    const usuario = nome.toLowerCase().replace(" ", ".") + Math.floor(Math.random() * 1000);
    return `${usuario}@${dominio[Math.floor(Math.random() * dominio.length)]}`;
}

function gerarPessoa() {
    const nome = gerarNome();
    document.getElementById('nome').value = nome;
    document.getElementById('cpf').value = gerarCPFValido();
    document.getElementById('rg').value = Math.floor(100000000 + Math.random() * 900000000);
    document.getElementById('dataNasc').value = gerarDataNascimento();
    document.getElementById('telFixo').value = gerarTelefoneFixo();
    document.getElementById('telCelular').value = gerarCelular();
    document.getElementById('email').value = gerarEmail(nome);
}
 
// Gerador simples de RG
function gerarRG() {
    let rg = "";
    for (let i = 0; i < 8; i++) {
        rg += Math.floor(Math.random() * 10);
    }
    return rg + "-" + Math.floor(Math.random() * 10);
}

function formatarTelefone(numero, celular = false) {
    // Extrai apenas os dígitos
    const digitos = numero.replace(/\D/g, "");

    // Garante o formato correto (ex: (11) 91234-5678)
    let ddd = digitos.substring(0, 2);
    let numeroFinal;

    if (celular) {
        let noveDigitos = digitos.substring(2).padStart(9, "9").substring(0, 9);
        numeroFinal = `(${ddd}) 9${noveDigitos.substring(1, 5)}-${noveDigitos.substring(5, 9)}`;
    } else {
        let oitoDigitos = digitos.substring(2).padStart(8, "3").substring(0, 8);
        numeroFinal = `(${ddd}) ${oitoDigitos.substring(0, 4)}-${oitoDigitos.substring(4, 8)}`;
    }

    return numeroFinal;
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleTheme');
    const btnGerar = document.querySelector('.btnGerar'); // se existir

    function atualizarIconeTema() {
        toggleBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    }

    // Aplica tema salvo
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    atualizarIconeTema();

    // Listener para botão de tema
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            atualizarIconeTema();
        });
    }

    // Listener para botão "Criar", se existir
    if (btnGerar) {
        btnGerar.addEventListener('click', () => {
            generator(); // chama tua função normalmente
        });
    }
});

// Contador de caractere
const textarea = document.getElementById("myTextArea");
const contador = document.getElementById("contador");

textarea.addEventListener("input", () => {
  contador.textContent = textarea.value.length;
});

// Limpar contador de caractere
function limparCampo() {
    const textarea = document.getElementById("myTextArea");
    const contador = document.getElementById("contador");

    textarea.value = "";
    contador.textContent = "0";
}

function limparCampoData() {
    const dataInicial = document.getElementById("dataInicial");
    const dataFinal = document.getElementById("dataFinal");

    if (dataInicial) dataInicial.value = "";
    if (dataFinal) dataFinal.value = "";

    const spans = document.querySelectorAll(".resultados span");
    if (spans.length >= 4) {
        spans[0].textContent = "";
        spans[1].textContent = "";
        spans[2].textContent = "";
        spans[3].textContent = "";
    }

    const visibleResult = document.querySelector(".resultados");

    if (visibleResult.style.display === "block") {
        visibleResult.style.display = "none";
    }

}

function contar() {
    const visibleResult = document.querySelector(".resultados");

    if (visibleResult.style.display === "none" || !visibleResult.style.display) {
        visibleResult.style.display = "block";
    } else {
        visibleResult.style.display = "none";
    }



    const data1 = document.getElementById("dataInicial").value;
    const data2 = document.getElementById("dataFinal").value;

    if (!data1 || !data2) {
        alert("Por favor, preencha ambas as datas.");
        visibleResult.style.display = "none";
        return;
    }

    const inicio = new Date(data1);
    const fim = new Date(data2);

    if (fim < inicio) {
        alert("A data final deve ser maior que a data inicial.");
        visibleResult.style.display = "none";
        return;
    }

    // Verificar opção do radio button
    const opcaoBissexto = document.querySelector('input[name="anoBissexto"]:checked');
    const considerarBissextos = opcaoBissexto && opcaoBissexto.value === "sim";

    let dias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24));

    // Corrige pelos anos bissextos reais se necessário
    if (considerarBissextos) {
        let bissextos = 0;
        for (let ano = inicio.getFullYear(); ano <= fim.getFullYear(); ano++) {
            if ((ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0)) {
                const dataBissexto = new Date(ano, 1, 29); // 29 de fevereiro
                if (dataBissexto >= inicio && dataBissexto <= fim) {
                    bissextos++;
                }
            }
        }
        dias += bissextos; // adiciona 1 dia por bissexto verdadeiro
    }

    const anos = Math.floor(dias / 365);
    const meses = Math.floor(dias / 30.437); // média de dias por mês

    document.querySelector(".resultado-dias").textContent = dias;
    document.querySelector(".resultado-meses").textContent = meses;
    document.querySelector(".resultado-anos").textContent = anos;
    document.querySelector(".resultado-total").textContent = dias + " dias";
}
