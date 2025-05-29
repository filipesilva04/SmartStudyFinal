document.addEventListener("DOMContentLoaded", function () {
  // ================== REGISTO ==================
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.querySelector(
        "#signup-form input[placeholder='Name']"
      ).value;
      const email = document.querySelector(
        "#signup-form input[placeholder='Email']"
      ).value;
      const password = document.querySelector(
        "#signup-form input[placeholder='Password']"
      ).value;

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
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
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
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
    var sections = document.querySelectorAll(".content > div");
    sections.forEach(function (section) {
      section.classList.add("hidden");
    });

    document.getElementById(contentId).classList.remove("hidden");
  }

  // Eventos de navegação

  document
    .getElementById("menuPrevisao")
    .addEventListener("click", function () {
      showContent("previsaoContent");
    });
  document
    .getElementById("menuCarregarDados")
    .addEventListener("click", function () {
      showContent("carregarDadosContent");
    });
  document
    .getElementById("menuVisualizarDados")
    .addEventListener("click", function () {
      showContent("visualizarDadosContent");
    });
  document.getElementById("menuSuporte").addEventListener("click", function () {
    showContent("suporteContent");
  });
  document
    .getElementById("menuDefinicoes")
    .addEventListener("click", function () {
      showContent("definicoesContent");
    });

  // Submenu de Gestão de Dados
  document
    .getElementById("menuGestaoExpand")
    .addEventListener("click", function () {
      const submenu = document.getElementById("submenuGestao");
      submenu.classList.toggle("open");
    });

  document.addEventListener("click", function (event) {
    const submenu = document.getElementById("submenuGestao");
    const expandItem = document.getElementById("menuGestaoExpand");
    if (!submenu.contains(event.target) && !expandItem.contains(event.target)) {
      submenu.classList.remove("open");
    }
  });

  // Lógica de salvar nome
  document.getElementById("salvarNome").addEventListener("click", function () {
    var novoNome = document.getElementById("inputNome").value;
    if (novoNome.trim() !== "") {
      alert("Nome alterado para: " + novoNome);
    } else {
      alert("Por favor, insira um nome válido.");
    }
  });

  // Lógica de salvar senha
  document.getElementById("salvarSenha").addEventListener("click", function () {
    var senhaAtual = document.getElementById("inputSenhaAtual").value;
    var novaSenha = document.getElementById("inputNovaSenha").value;
    var confirmaSenha = document.getElementById("inputConfirmaSenha").value;

    if (
      senhaAtual.trim() === "" ||
      novaSenha.trim() === "" ||
      confirmaSenha.trim() === ""
    ) {
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
  document
    .getElementById("salvarConfiguracoes")
    .addEventListener("click", function () {
      alert("Configurações salvas.");
    });

  // 🌙 Modo escuro com localStorage
  const toggleDarkMode = document.getElementById("toggleDarkMode");

  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleDarkMode.checked = true;
  }

  toggleDarkMode.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "disabled");
    }
  });

  // Idioma
  document
    .getElementById("idiomaSelect")
    ?.addEventListener("change", function () {
      var idiomaSelecionado = this.value;
      alert("Idioma alterado para: " + idiomaSelecionado);
    });

  // Notificações
  document
    .getElementById("notificacoes")
    ?.addEventListener("change", function () {
      if (this.checked) {
        alert("Notificações ativadas.");
      } else {
        alert("Notificações desativadas.");
      }
    });

  // Suporte: envio de problema

  const btnSuporte = document.getElementById("enviarProblema");
  if (btnSuporte && !btnSuporte.dataset.listenerAttached) {
    btnSuporte.addEventListener("click", async function () {
      const problema = document.getElementById("problema").value;

      if (problema.trim() === "") {
        alert("Por favor, descreva seu problema antes de enviar.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/suporte", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mensagem: problema }),
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
          document.getElementById("problema").value = "";
        }
      } catch (error) {
        console.error("Erro ao enviar suporte:", error);
        alert("Erro ao enviar mensagem de suporte.");
      }
    });

    btnSuporte.dataset.listenerAttached = true;
  }

  // 🌟 Upload de ficheiro interativo com envio real para o backend
  const uploadCard = document.getElementById("uploadArea");
  const csvInput = document.getElementById("csvFile");
  const fileInfo = document.getElementById("fileInfo");
  const fileNameSpan = document.getElementById("fileName");

  uploadCard.addEventListener("click", () => {
    csvInput.click();
  });

  csvInput.addEventListener("change", () => {
    const file = csvInput.files[0];
    if (!file) return;

    fileInfo.classList.remove("hidden");
    fileNameSpan.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.trim().split("\n");
      const header = lines[0].split(";");
      const rows = lines.slice(1, 6); // Só mostrar 5 linhas

      const thead = document.querySelector("#csvPreviewTable thead");
      const tbody = document.querySelector("#csvPreviewTable tbody");

      thead.innerHTML = "";
      tbody.innerHTML = "";

      const headerRow = document.createElement("tr");
      header.forEach((col) => {
        const th = document.createElement("th");
        th.textContent = col.trim();
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      rows.forEach((line) => {
        const data = line.split(";");
        const row = document.createElement("tr");
        data.forEach((cell) => {
          const td = document.createElement("td");
          td.textContent = cell.trim();
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });

      document.getElementById("previewTable").classList.remove("hidden");

      // Enviar ficheiro para backend
      const formData = new FormData();
      formData.append("ficheiro_csv", file);

      fetch("http://localhost:3000/upload-csv", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message); // Mostra a mensagem de sucesso ou erro
        })
        .catch((error) => {
          console.error("Erro ao enviar ficheiro:", error);
          alert("Erro ao enviar ficheiro para o servidor.");
        });
    };

    reader.readAsText(file);
  });

  //-----------------VISUALIZAR DADOS----------------------------//

  // ✅ Função para carregar os ficheiros do backend
  async function carregarFicheiros() {
    try {
      const response = await fetch("http://localhost:3000/ficheiros");
      const ficheiros = await response.json();
      renderizarTabelaFicheiros(ficheiros.ficheiros);
    } catch (error) {
      console.error("Erro ao carregar ficheiros:", error);
    }
  }

  // ✅ Função para renderizar a tabela com os ficheiros obtidos
  function renderizarTabelaFicheiros(ficheiros) {
    const lista = document.getElementById("listaFicheiros");
    lista.innerHTML = "";

    ficheiros.forEach((f) => {
      const tr = document.createElement("tr");

      const tdCheck = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("ficheiroCheckbox");
      checkbox.dataset.id = f.id;
      tdCheck.appendChild(checkbox);

      const tdNome = document.createElement("td");
      tdNome.textContent = f.nome_ficheiro;

      tr.appendChild(tdCheck);
      tr.appendChild(tdNome);
      lista.appendChild(tr);
    });
  }

  // ✅ Eliminar ficheiros selecionados
  document
    .getElementById("eliminarSelecionados")
    .addEventListener("click", async (event) => {
      event.preventDefault();

      const selecionados = Array.from(
        document.querySelectorAll(".ficheiroCheckbox:checked")
      );

      if (selecionados.length === 0) {
        alert("Selecione pelo menos um ficheiro para eliminar.");
        return;
      }

      const ids = selecionados.map((cb) => cb.dataset.id);

      try {
        const response = await fetch("http://localhost:3000/ficheiros", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        });

        const resultado = await response.json();
        alert(resultado.message);

        showContent("visualizarDadosContent");
        carregarFicheiros(); // Recarregar tabela
      } catch (error) {
        console.error("Erro ao eliminar ficheiros:", error);
        alert("Erro ao eliminar ficheiros.");
      }
    });

  // ✅ Carrega a lista ao abrir a aba Visualizar Dados
  document
    .getElementById("menuVisualizarDados")
    .addEventListener("click", function () {
      showContent("visualizarDadosContent");
      carregarFicheiros();
    });

  // 🧠 Tela de Previsão
  const selectCsv = document.getElementById("selectCsv");
  const btnPrever = document.getElementById("btnPrever");
  const loading = document.getElementById("loadingIndicador");
  const tabelaResultados = document.getElementById("previewPrevisoes");
  const resumoBox = document.getElementById("resumoResultados");
  const exportBox = document.getElementById("exportBox");
  const btnExportar = document.getElementById("btnExportarCSV");

  let ficheiroResultado = "";

  fetch("http://localhost:3000/ficheiros")
    .then((response) => response.json())
    .then((data) => {
      data.ficheiros.forEach((f) => {
        const opt = document.createElement("option");

        // 👇 solução robusta
        const partes = f.caminho.split(/[\\/]/);
        opt.value = partes[partes.length - 1];

        opt.textContent = f.nome_ficheiro;
        selectCsv.appendChild(opt);
      });
    });

  btnPrever.addEventListener("click", () => {
  const ficheiro = selectCsv.value;
  if (!ficheiro) return alert("Selecione um ficheiro.");

  loading.classList.remove("hidden");
  tabelaResultados.innerHTML = "";
  resumoBox.classList.add("hidden");
  exportBox.classList.add("hidden");

  fetch("http://localhost:5000/prever", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ficheiro }),
  })
    .then(async (response) => {
      const data = await response.json();
      console.log("📥 RESPOSTA DO FLASK:", data);
      console.log("📦 Status HTTP:", response.status);

      loading.classList.add("hidden");

      if (!response.ok) {
        alert("Erro: " + (data.erro || "Erro inesperado."));
        return;
      }

      const amostra = data.amostra;
      ficheiroResultado = data.ficheiro_resultado;
      const counts = { aprovado: 0, risco: 0, chumbado: 0 };

      amostra.forEach((linha, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${i + 1}</td><td>${linha.previsao}</td>`;
        tabelaResultados.appendChild(tr);

        const valor = linha.previsao.toLowerCase();
        if (valor.includes("aprovado")) counts.aprovado++;
        else if (valor.includes("risco")) counts.risco++;
        else counts.chumbado++;
      });

      document.getElementById("aprovadoCount").textContent = counts.aprovado;
      document.getElementById("riscoCount").textContent = counts.risco;
      document.getElementById("chumbadoCount").textContent = counts.chumbado;

      resumoBox.classList.remove("hidden");
      document.getElementById("tabelaResultados")?.classList.remove("hidden");

      // 🔍 DEBUG do botão
      console.log("📌 Export box:", exportBox);
      console.log("📌 Export button:", btnExportar);

      exportBox.classList.remove("hidden");

      // Forçar mostrar o botão se ainda estiver escondido
      btnExportar.style.display = "block";
    })
    .catch((err) => {
      loading.classList.add("hidden");
      console.error("❌ Erro com Flask:", err);
      alert("Erro ao comunicar com o servidor Flask.");
    });
});


  btnExportar.addEventListener("click", () => {
  if (!ficheiroResultado) return;
  window.location.href = `http://localhost:5000/download/${ficheiroResultado}`;
  });

});

document.getElementById("menuSair").addEventListener("click", () => {
  // Limpa dados do utilizador (se necessário)
  localStorage.clear(); // ou sessionStorage.clear() dependendo do teu sistema
  // Redireciona para a página de login
  window.location.href = "login.html"; // substitui pelo nome real do teu ficheiro de login
});
