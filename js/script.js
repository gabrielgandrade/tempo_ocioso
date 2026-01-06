function proximaTela(numero) {
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("ativa");
  });

  const proxima = document.getElementById(`tela-${numero}`);
  if (proxima) proxima.classList.add("ativa");
}

function trollarLogin() {
  alert("Óbvio que isso não tem login 😂");
  proximaTela(2);
}

function bloquear() {
  alert("clica aí não mermão");
}