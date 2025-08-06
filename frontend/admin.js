const categorias = ["oferta", "bovinos", "bovinos2", "aves", "suinos"];
let dados = {};

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
    alert("Erro ao carregar produtos.json: " + err.message);
  });

function carregarTudo() {
  categorias.forEach(cat => {
    if (!Array.isArray(dados[cat])) {
      dados[cat] = []; // Corrige se 'oferta' estiver como objeto
    }
  });

  carregarProdutos("oferta", document.getElementById("oferta"));
  carregarProdutosRestantes();
}

function carregarProdutosRestantes() {
  const container = document.getElementById("categorias");
  container.innerHTML = "";

  categorias.slice(1).forEach(categoria => {
    const div = document.createElement("div");
    div.className = "categoria";
    div.innerHTML = `<h2>${categoria.toUpperCase()}</h2>`;

    dados[categoria].forEach((produto, i) => {
      div.appendChild(criarLinhaProduto(categoria, i, produto));
    });

    const btnAdd = document.createElement("button");
    btnAdd.className = "btn";
    btnAdd.textContent = `+ Adicionar em ${categoria}`;
    btnAdd.onclick = () => {
      dados[categoria].push({ nome: "", preco: ""});
      carregarTudo();
    };
    div.appendChild(btnAdd);

    container.appendChild(div);
  });
}

function carregarProdutos(categoria, container) {
  container.innerHTML = `<h2>${categoria === 'oferta' ? "Ofertas da Semana" : categoria.toUpperCase()}</h2>`;
  
  dados[categoria].forEach((produto, i) => {
    container.appendChild(criarLinhaProduto(categoria, i, produto));
  });

  const btnAdd = document.createElement("button");
  btnAdd.className = "btn";
  btnAdd.textContent = `+ Adicionar em ${categoria}`;
  btnAdd.onclick = () => {
    dados[categoria].push({ nome: "", preco: ""});
    carregarTudo();
  };
  container.appendChild(btnAdd);
}

function criarLinhaProduto(categoria, index, produto) {
  const linha = document.createElement("div");
  linha.className = "produto";

  const nome = document.createElement("input");
  nome.value = produto.nome;
  nome.placeholder = "Nome";
  nome.oninput = e => dados[categoria][index].nome = e.target.value;

  const preco = document.createElement("input");
  preco.value = produto.preco;
  preco.placeholder = "Preço";
  preco.oninput = e => dados[categoria][index].preco = e.target.value;

  /*const imagem = document.createElement("input");
  imagem.value = produto.imagem || "";
  imagem.placeholder = "Imagem (opcional)";
  imagem.oninput = e => dados[categoria][index].imagem = e.target.value;*/

  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "❌";
  btnExcluir.onclick = () => {
    dados[categoria].splice(index, 1);
    carregarTudo();
  };

  linha.appendChild(nome);
  linha.appendChild(preco);
  //linha.appendChild(imagem);
  linha.appendChild(btnExcluir);

  return linha;
}

function salvar() {
  fetch('http://localhost:8081/salvar_produtos.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(res => {
    if (res.ok) alert("Produtos salvos com sucesso!");
    else throw new Error();
  })
  .catch(() => alert("Erro ao salvar os produtos."));
}


function publicar() {
  if (!confirm("Deseja publicar o site com as alterações atuais?")) return;

  fetch('/deploy.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Publicação concluída!\n" + data.message);
      } else {
        alert("Falha na publicação.\n" + data.message + "\n" + data.output.join("\n"));
      }
    })
    .catch(err => alert("Erro ao executar publicação: " + err));
}
