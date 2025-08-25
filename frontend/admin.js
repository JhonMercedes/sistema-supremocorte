const categorias = ["oferta", "bovinos", "bovinos2", "aves", "suinos"];
let dados = {};

// Configurações das categorias
const categoriasConfig = {
  oferta: { nome: "Ofertas da Semana", cor: "#ff6b6b", emoji: "⭐" },
  bovinos: { nome: "Bovinos", cor: "#f39c12", emoji: "🐄" },
  bovinos2: { nome: "Bovinos Premium", cor: "#e67e22", emoji: "🥩" },
  aves: { nome: "Aves", cor: "#3498db", emoji: "🐔" },
  suinos: { nome: "Suínos", cor: "#e74c3c", emoji: "🐷" }
};

// Carrega dados do backend
fetch('http://localhost:8081/produtos.json')
  .then(res => {
    if (!res.ok) throw new Error(`Erro ao carregar: ${res.status}`);
    return res.json();
  })
  .then(json => {
    dados = json;
    carregarTudo();
  })
  .catch(err => {
    showNotification("Erro ao carregar produtos: " + err.message, 'error');
  });

function carregarTudo() {
  // Garante que todas as categorias existem como array
  categorias.forEach(cat => {
    if (!Array.isArray(dados[cat])) {
      dados[cat] = [];
    }
  });

  // Carrega ofertas (seção especial)
  carregarOfertas();
  
  // Carrega outras categorias
  carregarCategorias();
  
  // Atualiza contadores
  atualizarContadores();
}

function carregarOfertas() {
  const container = document.getElementById("oferta");
  container.innerHTML = "";

  if (dados.oferta.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma oferta cadastrada</p>
      </div>
    `;
  } else {
    dados.oferta.forEach((produto, i) => {
      container.appendChild(criarProdutoItem("oferta", i, produto));
    });
  }

  // Botão adicionar
  const btnAdd = criarBotaoAdicionar("oferta");
  container.appendChild(btnAdd);
}

function carregarCategorias() {
  const container = document.getElementById("categorias");
  container.innerHTML = "";

  // Pula "oferta" pois já foi carregada
  categorias.slice(1).forEach(categoria => {
    const config = categoriasConfig[categoria];
    
    const card = document.createElement("div");
    card.className = `categoria-card ${categoria}`;
    
    card.innerHTML = `
      <div class="categoria-header">
        <h2>${config.emoji} ${config.nome}</h2>
        <div class="produto-count" id="${categoria}-count">0 produtos</div>
      </div>
      <div class="produtos-list" id="lista-${categoria}"></div>
    `;

    const listaContainer = card.querySelector(`#lista-${categoria}`);
    
    if (dados[categoria].length === 0) {
      listaContainer.innerHTML = `
        <div class="empty-state">
          <p>Nenhum produto cadastrado</p>
        </div>
      `;
    } else {
      dados[categoria].forEach((produto, i) => {
        listaContainer.appendChild(criarProdutoItem(categoria, i, produto));
      });
    }

    // Botão adicionar
    const btnAdd = criarBotaoAdicionar(categoria);
    listaContainer.appendChild(btnAdd);

    container.appendChild(card);
  });
}

function criarProdutoItem(categoria, index, produto) {
  const item = document.createElement("div");
  item.className = "produto-item";

  const inputNome = document.createElement("input");
  inputNome.type = "text";
  inputNome.value = produto.nome || "";
  inputNome.placeholder = "Nome do produto";
  inputNome.oninput = e => {
    dados[categoria][index].nome = e.target.value;
    atualizarContadores();
  };

  const inputPreco = document.createElement("input");
  inputPreco.type = "text";
  inputPreco.value = produto.preco || "";
  inputPreco.placeholder = "Preço";
  inputPreco.oninput = e => {
    // Formatar como moeda brasileira
    let valor = e.target.value.replace(/\D/g, '');
    if (valor) {
      valor = (parseFloat(valor) / 100).toFixed(2);
      e.target.value = valor.replace('.', ',');
    }
    dados[categoria][index].preco = e.target.value;
  };

  // Adicionar máscara de moeda ao preço
  inputPreco.addEventListener('blur', function() {
    if (this.value && !this.value.includes(',')) {
      this.value = parseFloat(this.value).toFixed(2).replace('.', ',');
    }
  });

  const btnExcluir = document.createElement("button");
  btnExcluir.className = "btn-excluir";
  btnExcluir.innerHTML = "🗑️";
  btnExcluir.title = "Excluir produto";
  btnExcluir.onclick = () => {
    if (confirm(`Deseja realmente excluir "${produto.nome || 'este produto'}"?`)) {
      dados[categoria].splice(index, 1);
      carregarTudo();
      showNotification("Produto excluído com sucesso!", 'success');
    }
  };

  item.appendChild(inputNome);
  item.appendChild(inputPreco);
  item.appendChild(btnExcluir);

  return item;
}

function criarBotaoAdicionar(categoria) {
  const btn = document.createElement("button");
  btn.className = "btn-adicionar";
  btn.innerHTML = `➕ Adicionar produto em ${categoriasConfig[categoria].nome}`;
  btn.onclick = () => {
    dados[categoria].push({ nome: "", preco: "" });
    carregarTudo();
    showNotification("Novo produto adicionado!", 'success');
  };
  return btn;
}

function atualizarContadores() {
  categorias.forEach(categoria => {
    const count = dados[categoria].length;
    const element = document.getElementById(`${categoria}-count`);
    if (element) {
      element.textContent = `${count} produto${count !== 1 ? 's' : ''}`;
    }
  });
}

function salvar() {
  const btn = document.getElementById('btn-salvar');
  btn.classList.add('loading');
  btn.disabled = true;
  btn.innerHTML = '💾 Salvando...';

  fetch('http://localhost:8081/salvar_produtos.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(res => {
    if (res.ok) {
      showNotification("✅ Produtos salvos com sucesso!", 'success');
    } else {
      throw new Error('Erro no servidor');
    }
  })
  .catch(err => {
    showNotification("❌ Erro ao salvar os produtos: " + err.message, 'error');
  })
  .finally(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.innerHTML = '💾 Salvar Alterações';
  });
}

function publicar() {
  if (!confirm("🚀 Deseja publicar o site com as alterações atuais?")) return;

  const btn = document.getElementById('btn-publicar');
  btn.classList.add('loading');
  btn.disabled = true;
  btn.innerHTML = '🚀 Publicando...';

  fetch('http://localhost:8081/deploy.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showNotification("✅ Site publicado com sucesso!\n🌐 Disponível em: https://supremocorteteste.surge.sh", 'success');
      } else {
        showNotification("❌ Falha na publicação.\n" + data.message, 'error');
        console.log('Output:', data.output);
      }
    })
    .catch(err => {
      console.error('Erro:', err);
      showNotification("❌ Erro ao executar publicação: " + err, 'error');
    })
    .finally(() => {
      btn.classList.remove('loading');
      btn.disabled = false;
      btn.innerHTML = '🚀 Publicar no Site';
    });
}

// Pagina local para validar alterações
function abrirLocal() {
  window.open("http://localhost:8080/index.html", "_blank");
}

// Sistema de notificações
function showNotification(message, type = 'info') {
  // Remove notificações existentes
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    max-width: 400px;
    white-space: pre-line;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);

  // Permite fechar clicando
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  });
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .notification {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .notification:hover {
    transform: scale(1.02);
  }
`;
document.head.appendChild(style);