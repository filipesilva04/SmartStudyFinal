document.addEventListener('DOMContentLoaded', function () {

    // ================== REGISTO ==================
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const name = document.querySelector("#signup-form input[placeholder='Name']").value;
            const email = document.querySelector("#signup-form input[placeholder='Email']").value;
            const password = document.querySelector("#signup-form input[placeholder='Password']").value;

            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Conta criada com sucesso!");
                    window.location.href = "login.html";
                } else {
                    alert(data.message || "Erro no registo.");
                }
            } catch (error) {
                console.error(error);
                alert("Erro de rede.");
            }
        });
    }

    // ================== LOGIN ==================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Login bem-sucedido!");
                    window.location.href = "paginaprincipal.html";
                } else {
                    alert(data.message || "Falha no login.");
                }
            } catch (error) {
                console.error(error);
                alert("Erro de rede.");
            }
        });
    }



    // Função para mostrar o conteúdo da página selecionada
    function showContent(contentId) {
        var sections = document.querySelectorAll('.content > div');
        sections.forEach(function(section) {
            section.classList.add('hidden');
        });

        document.getElementById(contentId).classList.remove('hidden');
    }

    // Eventos de navegação
    
    document.getElementById('menuPrevisao').addEventListener('click', function() {
        showContent('previsaoContent');
    });
    document.getElementById('menuCarregarDados').addEventListener('click', function() {
        showContent('carregarDadosContent');
    });
    document.getElementById('menuVisualizarDados').addEventListener('click', function() {
        showContent('visualizarDadosContent');
    });
    document.getElementById('menuSuporte').addEventListener('click', function() {
        showContent('suporteContent');
    });
    document.getElementById('menuDefinicoes').addEventListener('click', function() {
        showContent('definicoesContent');
    });

    // Submenu de Gestão de Dados
    document.getElementById('menuGestaoExpand').addEventListener('click', function () {
        const submenu = document.getElementById('submenuGestao');
        submenu.classList.toggle('open');
    });

    document.addEventListener('click', function (event) {
        const submenu = document.getElementById('submenuGestao');
        const expandItem = document.getElementById('menuGestaoExpand');
        if (!submenu.contains(event.target) && !expandItem.contains(event.target)) {
            submenu.classList.remove('open');
        }
    });

    // Lógica de salvar nome
    document.getElementById('salvarNome').addEventListener('click', function() {
        var novoNome = document.getElementById('inputNome').value;
        if (novoNome.trim() !== "") {
            alert("Nome alterado para: " + novoNome);
        } else {
            alert("Por favor, insira um nome válido.");
        }
    });

    // Lógica de salvar senha
    document.getElementById('salvarSenha').addEventListener('click', function() {
        var senhaAtual = document.getElementById('inputSenhaAtual').value;
        var novaSenha = document.getElementById('inputNovaSenha').value;
        var confirmaSenha = document.getElementById('inputConfirmaSenha').value;

        if (senhaAtual.trim() === "" || novaSenha.trim() === "" || confirmaSenha.trim() === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        if (novaSenha !== confirmaSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        alert("Senha alterada com sucesso.");
    });

    // Lógica de salvar configurações
    document.getElementById('salvarConfiguracoes').addEventListener('click', function() {
        alert("Configurações salvas.");
    });

    // 🌙 Modo escuro com localStorage
    const toggleDarkMode = document.getElementById('toggleDarkMode');

    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleDarkMode.checked = true;
    }

    toggleDarkMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
    });


    // Suporte: envio de problema

    document.getElementById('menuSuporte')?.addEventListener('click', function () {
        showContent('suporteContent');
    
        const btnSuporte = document.getElementById('enviarProblema');
        if (btnSuporte && !btnSuporte.dataset.listenerAttached) {
            btnSuporte.addEventListener('click', async function () {
                const problema = document.getElementById('problema')?.value;
    
                if (!problema || problema.trim() === "") {
                    alert("Por favor, descreva seu problema antes de enviar.");
                    return;
                }
    
                try {
                    const response = await fetch("http://localhost:3000/suporte", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ mensagem: problema })
                    });
    
                    const data = await response.json();
                    alert(data.message);
    
                    if (response.ok) {
                        document.getElementById('problema').value = "";
                    }
                } catch (error) {
                    console.error("Erro ao enviar suporte:", error);
                    alert("Erro ao enviar mensagem de suporte.");
                }
            });
    
            btnSuporte.dataset.listenerAttached = "true";
        }
    });
    
    


    // 🌟 Upload de ficheiro interativo
    const uploadCard = document.getElementById('uploadArea');
    const csvInput = document.getElementById('csvFile');
    const fileInfo = document.getElementById('fileInfo');
    const fileNameSpan = document.getElementById('fileName');

    uploadCard.addEventListener('click', () => {
        csvInput.click();
    });

    csvInput.addEventListener('change', () => {
        const file = csvInput.files[0];
        if (!file) return;

        fileInfo.classList.remove('hidden');
        fileNameSpan.textContent = file.name;

        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.trim().split('\n');
            const header = lines[0].split(',');
            const rows = lines.slice(1, 6);

            const thead = document.querySelector('#csvPreviewTable thead');
            const tbody = document.querySelector('#csvPreviewTable tbody');

            thead.innerHTML = '';
            tbody.innerHTML = '';

            const headerRow = document.createElement('tr');
            header.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col.trim();
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            rows.forEach(line => {
                const data = line.split(',');
                const row = document.createElement('tr');
                data.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell.trim();
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });

            document.getElementById('previewTable').classList.remove('hidden');
        };
        reader.readAsText(file);
    });

    // 📁 Visualizar Dados: simulação de ficheiros carregados
    const ficheirosSimulados = [
        "alunos_1.csv",
        "estatisticas_matematica.csv",
        "ano2023_dados.csv"
    ];

    const listaFicheiros = document.getElementById('listaFicheiros');
    const pesquisaInput = document.getElementById('pesquisaFicheiros');
    const btnEliminar = document.getElementById('eliminarSelecionados');

    function renderizarLista(filtros = "") {
        listaFicheiros.innerHTML = "";

        ficheirosSimulados
            .filter(nome => nome.toLowerCase().includes(filtros.toLowerCase()))
            .forEach(nome => {
                const li = document.createElement("li");
                li.classList.add("arquivo-item");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("arquivo-check");

                const nomeSpan = document.createElement("span");
                nomeSpan.textContent = nome;

                li.appendChild(checkbox);
                li.appendChild(nomeSpan);
                listaFicheiros.appendChild(li);
            });
    }

    pesquisaInput.addEventListener("input", function() {
        renderizarLista(this.value);
    });

    btnEliminar.addEventListener("click", function() {
        const checkboxes = document.querySelectorAll(".arquivo-check:checked");
        if (checkboxes.length === 0) {
            alert("Selecione pelo menos um ficheiro para eliminar.");
            return;
        }

        checkboxes.forEach(cb => {
            const nomeFicheiro = cb.nextSibling.textContent;
            const index = ficheirosSimulados.indexOf(nomeFicheiro);
            if (index > -1) ficheirosSimulados.splice(index, 1);
        });

        renderizarLista(pesquisaInput.value);
    });

    renderizarLista();

    // 🧠 Tela de Previsão (simulação)
    const ficheirosPrevisao = ["alunos_1.csv", "estatisticas_matematica.csv", "ano2023_dados.csv"];
    const selectFicheiro = document.getElementById("ficheiroSelecionado");
    const botaoPrever = document.getElementById("botaoPrever");
    const secaoResultado = document.getElementById("resultadoPrevisao");
    const tabelaPreview = document.getElementById("tabelaResultadoPrevisao");

    ficheirosPrevisao.forEach(nome => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        selectFicheiro.appendChild(option);
    });

    botaoPrever.addEventListener("click", function () {
        const nomeFicheiro = selectFicheiro.value;

        secaoResultado.classList.remove("hidden");
        tabelaPreview.innerHTML = "";

        const cabecalho = document.createElement("tr");
        ["ID", "Nome", "Resultado Previsto"].forEach(titulo => {
            const th = document.createElement("th");
            th.textContent = titulo;
            cabecalho.appendChild(th);
        });
        tabelaPreview.appendChild(cabecalho);

        for (let i = 1; i <= 5; i++) {
            const linha = document.createElement("tr");
            const tdId = document.createElement("td");
            tdId.textContent = i;

            const tdNome = document.createElement("td");
            tdNome.textContent = `Aluno ${i}`;

            const tdResultado = document.createElement("td");
            tdResultado.textContent = i % 2 === 0 ? "Aprovado" : "Chumbado";

            linha.appendChild(tdId);
            linha.appendChild(tdNome);
            linha.appendChild(tdResultado);
            tabelaPreview.appendChild(linha);
        }
    });
});

