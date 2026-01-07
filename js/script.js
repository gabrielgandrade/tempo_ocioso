/* ===================================
   CONTROLE DE TELAS
   =================================== */

function proximaTela(numero) {
  // Remove estado ativo de todas as telas
  document.querySelectorAll(".tela").forEach(tela => {
    tela.classList.remove("ativa");
  });

  // Ativa a próxima tela
  const proxima = document.getElementById(`tela-${numero}`);
  if (proxima) proxima.classList.add("ativa");

  const imagem = document.getElementById("imagem-do-esqueleto");
  const body = document.body;

  // Imagem de esqueleto só aparece na tela 1
  if (numero === 1) {
    imagem.style.display = "block";
  } else {
    imagem.style.display = "none";
  }

  // Remove visual do box apenas na tela 4
  if (numero === 4) {
    body.classList.add("tela-4-ativa");
  } else {
    body.classList.remove("tela-4-ativa");
  }
}

// Garante estado inicial correto
document.addEventListener("DOMContentLoaded", () => {
  proximaTela(1);
});

function trollarLogin() {
  alert("Mas é óbvio que esse login não funciona");
  proximaTela(2);
}

function bloquear() {
  alert("clica aí não mermão");
}


/* ===============================
   JOGO DE WALLACY — COM COLISÃO
   =============================== */

/* ===============================
   JOGO DE WALLACY — LÓGICA
   =============================== */

const area = document.getElementById("area-jogo");
const jogador = document.getElementById("jogador");
const chegada = document.getElementById("chegada");
const paredes = document.querySelectorAll(".parede");

let arrastando = false;
let jogoAtivo = true; // Para impedir movimentos depois de ganhar
let offsetX = 0;
let offsetY = 0;

// Inicia o arraste
jogador.addEventListener("mousedown", (e) => {
    if (!jogoAtivo) return;
    arrastando = true;

    const rect = jogador.getBoundingClientRect();
    // Calcula onde exatamente o mouse clicou dentro da imagem
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    jogador.style.cursor = "grabbing";
});

// Move o boneco (No documento todo, pra não perder o foco se mover rápido)
document.addEventListener("mousemove", (e) => {
    if (!arrastando || !jogoAtivo) return;

    const areaRect = area.getBoundingClientRect();

    // Calcula a nova posição relativa à caixa do jogo
    let novoX = e.clientX - areaRect.left - offsetX;
    let novoY = e.clientY - areaRect.top  - offsetY;

    // Limites da caixa (não deixa sair da área preta)
    const maxX = area.clientWidth - jogador.clientWidth;
    const maxY = area.clientHeight - jogador.clientHeight;

    // Garante que não saia da tela (Clamp)
    novoX = Math.max(0, Math.min(novoX, maxX));
    novoY = Math.max(0, Math.min(novoY, maxY));

    // Só move se NÃO bater na parede
    if (!colideComParede(novoX, novoY)) {
        jogador.style.left = novoX + "px";
        jogador.style.top  = novoY + "px";
        
        // Verifica vitória apenas se moveu com sucesso
        verificarVitoria();
    }
});

// Solta o boneco
document.addEventListener("mouseup", () => {
    arrastando = false;
    jogador.style.cursor = "grab";
});

/* ===============================
   DETECÇÃO DE COLISÃO
   =============================== */
function colideComParede(x, y) {
    // Cria um retângulo virtual onde o jogador QUER ir
    const jogadorFuturo = {
        left: x,
        top: y,
        right: x + jogador.clientWidth,
        bottom: y + jogador.clientHeight
    };

    const areaRect = area.getBoundingClientRect();

    for (let parede of paredes) {
        const p = parede.getBoundingClientRect();
        
        // Converte coordenadas da parede para relativas à área de jogo
        const paredeRelativa = {
            left: p.left - areaRect.left,
            top: p.top - areaRect.top,
            right: p.right - areaRect.left,
            bottom: p.bottom - areaRect.top
        };

        // Fórmula clássica de intersecção de retângulos (AABB)
        const bateu = !(
            jogadorFuturo.right < paredeRelativa.left ||
            jogadorFuturo.left > paredeRelativa.right ||
            jogadorFuturo.bottom < paredeRelativa.top ||
            jogadorFuturo.top > paredeRelativa.bottom
        );

        if (bateu) return true;
    }
    return false;
}

/* ===============================
   VITÓRIA
   =============================== */
function verificarVitoria() {
    const j = jogador.getBoundingClientRect();
    const c = chegada.getBoundingClientRect();

    // Verifica se encostou na chegada
    const tocou = !(
        j.right < c.left ||
        j.left > c.right ||
        j.bottom < c.top ||
        j.top > c.bottom
    );

    if (tocou) {
        jogoAtivo = false; // Trava o boneco
        arrastando = false; // Solta o mouse
        
        // Um delayzinho só pro boneco encostar visualmente antes de mudar
        setTimeout(() => {
        
            
          // Esconde o jogo e vai para a Tela 5
          proximaTela(5); 
            
        }, 100);
    }
}

/* ===============================
   LÓGICA DO QUIZ (COM FAXINA)
   =============================== */

function erroQuiz() {
    const novaImagem = document.createElement('img');
    
    // AQUI ESTÁ A MUDANÇA:
    novaImagem.src = 'imagens/arthur.jpg'; 
    
    // --- RESTO DO CÓDIGO (Não precisa mudar) ---
    novaImagem.classList.add('imagem-lixo'); 
    
    const tamanho = 200; 
    const x = Math.max(0, Math.random() * (window.innerWidth - tamanho));
    const y = Math.max(0, Math.random() * (window.innerHeight - tamanho));

    novaImagem.style.position = 'fixed';
    novaImagem.style.left = x + 'px';
    novaImagem.style.top = y + 'px';
    novaImagem.style.width = tamanho + 'px';
    novaImagem.style.zIndex = '9999'; 
    novaImagem.style.pointerEvents = 'none';

    document.body.appendChild(novaImagem);

    setTimeout(() => {
        novaImagem.remove();
    }, 1500);
}

function acertoQuiz() {
    // 1. A FAXINA
    // Procura todas as imagens que tenham a classe 'imagem-lixo'
    const sujeira = document.querySelectorAll('.imagem-lixo');
    
    // Passa uma por uma e deleta
    sujeira.forEach(img => img.remove());

    proximaTela(6);
}