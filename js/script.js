/* ==========================================================================
   CONFIGURAÇÕES GLOBAIS E INICIALIZAÇÃO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Começa sempre na tela 1 ao carregar
    proximaTela(1);
});

// Variáveis do Jogo (Declaradas aqui para ficarem acessíveis globalmente)
const area = document.getElementById("area-jogo");
const jogador = document.getElementById("jogador");
const chegada = document.getElementById("chegada");
const paredes = document.querySelectorAll(".parede");

// Estado do Jogo
let arrastando = false;
let jogoAtivo = true;
let offsetX = 0;
let offsetY = 0;


/* ==========================================================================
   SISTEMA DE NAVEGAÇÃO ENTRE TELAS
   ========================================================================== */

function proximaTela(numero) {
    // 1. Esconde todas as telas
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    // 2. Mostra a tela desejada
    const proxima = document.getElementById(`tela-${numero}`);
    if (proxima) proxima.classList.add("ativa");

    // 3. Lógica específica do Esqueleto (Apenas Tela 1)
    const imagem = document.getElementById("imagem-do-esqueleto");
    if (numero === 1) {
        imagem.style.display = "block";
    } else {
        imagem.style.display = "none";
    }

    // 4. Ajustes visuais específicos da Tela 4 (Jogo)
    if (numero === 4) {
        document.body.classList.add("tela-4-ativa");
    } else {
        document.body.classList.remove("tela-4-ativa");
    }
}

// Funções dos botões de zoeira
function trollarLogin() {
    alert("Mas é óbvio que esse login não funciona");
    proximaTela(2);
}

function bloquear() {
    alert("clica aí não mermão");
}


/* ==========================================================================
   LÓGICA DO JOGO (LABIRINTO)
   ========================================================================== */

// --- EVENTOS DO MOUSE (Arraste) ---

// 1. Clicou no boneco
jogador.addEventListener("mousedown", (e) => {
    if (!jogoAtivo) return;
    
    arrastando = true;
    const rect = jogador.getBoundingClientRect();
    
    // Calcula onde clicou dentro da imagem para não "pular"
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    jogador.style.cursor = "grabbing";
});

// 2. Moveu o mouse (No documento todo para não perder o foco)
document.addEventListener("mousemove", (e) => {
    if (!arrastando || !jogoAtivo) return;

    const areaRect = area.getBoundingClientRect();

    // Calcula posição futura
    let novoX = e.clientX - areaRect.left - offsetX;
    let novoY = e.clientY - areaRect.top  - offsetY;

    // Impede que saia da caixa preta (Clamp)
    const maxX = area.clientWidth - jogador.clientWidth;
    const maxY = area.clientHeight - jogador.clientHeight;

    novoX = Math.max(0, Math.min(novoX, maxX));
    novoY = Math.max(0, Math.min(novoY, maxY));

    // Só aplica o movimento se não houver colisão
    if (!colideComParede(novoX, novoY)) {
        jogador.style.left = novoX + "px";
        jogador.style.top  = novoY + "px";
        
        verificarVitoria();
    }
});

// 3. Soltou o mouse
document.addEventListener("mouseup", () => {
    arrastando = false;
    jogador.style.cursor = "grab";
});


// --- FÍSICA E COLISÃO ---

function colideComParede(x, y) {
    // Projeta onde o jogador estaria
    const jogadorFuturo = {
        left: x,
        top: y,
        right: x + jogador.clientWidth,
        bottom: y + jogador.clientHeight
    };

    const areaRect = area.getBoundingClientRect();

    // Checa colisão com cada parede
    for (let parede of paredes) {
        const p = parede.getBoundingClientRect();
        
        // Ajusta coordenadas da parede para serem relativas à área de jogo
        const paredeRelativa = {
            left: p.left - areaRect.left,
            top: p.top - areaRect.top,
            right: p.right - areaRect.left,
            bottom: p.bottom - areaRect.top
        };

        // Verifica intersecção (AABB)
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

function verificarVitoria() {
    const j = jogador.getBoundingClientRect();
    const c = chegada.getBoundingClientRect();

    // Verifica intersecção com a chegada
    const tocou = !(
        j.right < c.left ||
        j.left > c.right ||
        j.bottom < c.top ||
        j.top > c.bottom
    );

    if (tocou) {
        jogoAtivo = false; // Trava o jogo
        arrastando = false;
        
        setTimeout(() => {
            proximaTela(5); 
        }, 100);
    }
}


/* ==========================================================================
   SISTEMA DO QUIZ (SHITPOST)
   ========================================================================== */

function erroQuiz() {
    // 1. Cria elemento
    const novaImagem = document.createElement('img');
    novaImagem.src = 'imagens/arthur.jpg'; // Sua imagem local
    novaImagem.classList.add('imagem-lixo'); 
    
    // 2. Define posição aleatória segura
    const tamanho = 200; 
    const x = Math.max(0, Math.random() * (window.innerWidth - tamanho));
    const y = Math.max(0, Math.random() * (window.innerHeight - tamanho));

    // 3. Aplica estilos
    novaImagem.style.position = 'fixed';
    novaImagem.style.left = x + 'px';
    novaImagem.style.top = y + 'px';
    novaImagem.style.width = tamanho + 'px';
    novaImagem.style.zIndex = '9999'; 
    novaImagem.style.pointerEvents = 'none'; // Permite clicar através

    // 4. Adiciona e remove
    document.body.appendChild(novaImagem);

    setTimeout(() => {
        novaImagem.remove();
    }, 1500);
}

function acertoQuiz() {
    // Limpa a sujeira antes de avançar
    const sujeira = document.querySelectorAll('.imagem-lixo');
    sujeira.forEach(img => img.remove());

    proximaTela(6);
}