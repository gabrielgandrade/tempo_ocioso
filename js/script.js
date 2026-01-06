// Quando a página carregar, mostra a imagem da tela 1
document.addEventListener('DOMContentLoaded', function() {
  const imagem = document.getElementById("imagem-do-esqueleto");
  imagem.style.display = "block";
});

function proximaTela(numero) {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("ativa");
  });

  const proxima = document.getElementById(`tela-${numero}`);
  if (proxima) proxima.classList.add("ativa");

  const imagem = document.getElementById("imagem-do-esqueleto");

  if (numero === 1) {
    imagem.style.display = "block";
  } else {
    imagem.style.display = "none";
  }
}

function trollarLogin() {
  alert("Óbvio que isso não tem login 😂");
  proximaTela(2);
}

function bloquear() {
  alert("clica aí não mermão");
}