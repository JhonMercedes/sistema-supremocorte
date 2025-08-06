// Detecta se está rodando no Surge ou local
const isSurge = !location.hostname.includes('localhost');
const produtosURL = isSurge ? './produtos.json' : 'http://localhost:8081/produtos.json';

// Carrega produtos
document.addEventListener("DOMContentLoaded", () => {
  fetch(produtosURL)
    .then(response => response.json())
    .then(data => {
      preencherTabela("tabela-oferta", data.oferta);
      preencherTabela("tabela-bovinos", data.bovinos);
      preencherTabela("tabela-bovinos2", data.bovinos2);
      preencherTabela("tabela-aves", data.aves);
      preencherTabela("tabela-suinos", data.suinos);
    })
    .catch(erro => console.error("Erro ao carregar produtos:", erro));
});

function preencherTabela(idTabela, produtos) {
  const tabela = document.getElementById(idTabela);
  if (!tabela || !produtos) return;

  tabela.innerHTML = "";
  produtos.forEach(produto => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td class="preco">${produto.preco}</td>
    `;
    tabela.appendChild(linha);
  });
}

/*function preencherOferta(oferta) {
  if (!oferta) return;

  document.querySelector(".oferta-desc h3").textContent = oferta.nome;
  document.querySelector(".oferta-desc .preco span").textContent = oferta.preco;
}*/

function atualizarRelogio() {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const hora = agora.toLocaleTimeString('pt-BR');

  document.getElementById("data").textContent = data;
  document.getElementById("hora").textContent = hora;
}

// Atualiza o relógio a cada segundo
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

let mostrandoProdutos = true;

function alternarSlides() {
  if (mostrandoProdutos) {
    // Mostrar logo
    document.querySelector(".totem").style.display = "none";
    document.querySelector(".logo-slide").style.display = "flex";
    mostrandoProdutos = false;

    setTimeout(alternarSlides, 10000); // Logo por 10s
  } else {
    // Mostrar tabela
    document.querySelector(".totem").style.display = "flex";
    document.querySelector(".logo-slide").style.display = "none";
    mostrandoProdutos = true;

    setTimeout(alternarSlides, 55000); // Tabela por 45s
  }
}

// Inicia a troca automática
setTimeout(alternarSlides, 45000); // começa com tabela por 45s

// Adicionando botão para tela cheia
function alternarTelaCheia() {
  if (!document.fullscreenElement) {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

// Atualiza o texto do botão de tela cheia
document.addEventListener("fullscreenchange", () => {
  const entrar = document.getElementById("icone-entrar");
  const sair = document.getElementById("icone-sair");

  if (document.fullscreenElement) {
    entrar.style.display = "none";
    sair.style.display = "inline";
  } else {
    entrar.style.display = "inline";
    sair.style.display = "none";
  }
});

let temporizadorEscondeBotao;

// Mostrar botão de tela cheia
function mostrarBotaoFullscreen() {
  const btn = document.getElementById("btn-fullscreen");
  btn.classList.remove("oculto");

  clearTimeout(temporizadorEscondeBotao);
  temporizadorEscondeBotao = setTimeout(() => {
    btn.classList.add("oculto");
  }, 5000); // 5 segundos
}

document.addEventListener("mousemove", mostrarBotaoFullscreen);
document.addEventListener("touchstart", mostrarBotaoFullscreen);

// Ocultar inicialmente após 5s do carregamento
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("btn-fullscreen").classList.add("oculto");
  }, 5000);
});

let temporizadorEscondeCursor;

function resetarCursor() {
  document.body.classList.remove("ocultar-cursor");
  clearTimeout(temporizadorEscondeCursor);

  temporizadorEscondeCursor = setTimeout(() => {
    document.body.classList.add("ocultar-cursor");
  }, 3000); // 3 segundos de inatividade
}

document.addEventListener("mousemove", resetarCursor);
document.addEventListener("touchstart", resetarCursor);

// Inicia o temporizador no carregamento da página
window.addEventListener("load", () => {
  resetarCursor();
});
