// CONFIGURAÇÕES GLOBAIS

function trollarLogin() {
    alert("Mas é óbvio que esse login não funciona");
    proximaTela(2);
}

function bloquear() {
    alert("clica aí não mermão");
}

document.addEventListener("DOMContentLoaded", () => {
    proximaTela(1);
});

const area = document.getElementById("area-jogo");
const jogador = document.getElementById("jogador");
const chegada = document.getElementById("chegada");
const paredes = document.querySelectorAll(".parede");

let arrastando = false;
let jogoAtivo = true;
let offsetX = 0;
let offsetY = 0;



//SISTEMA DE NAVEGAÇÃO

function proximaTela(numero) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    const proxima = document.getElementById(`tela-${numero}`);
    if (proxima) proxima.classList.add("ativa");

    const imagemEsq = document.getElementById("imagem-do-esqueleto");
    if (imagemEsq) { 
        if (numero === 1) {
            imagemEsq.style.display = "block";
        } else {
            imagemEsq.style.display = "none";
        }
    }

    if (numero === 4) {
        document.body.classList.add("tela-4-ativa");
    } else {
        document.body.classList.remove("tela-4-ativa");
    }

    const body = document.body;
    let fundoEscolhido = ""; 

    switch (numero) {
        case 1: 
            fundoEscolhido = "preto";
            break;
            
        case 2: 
            fundoEscolhido = "preto"; 
            break;

        case 3: 
            fundoEscolhido = "preto"; 
            break;

        case 4: 
            fundoEscolhido = "preto"; 
            break;

        case 5: 
            fundoEscolhido = "preto"; 
            break;

        case 6: 
            fundoEscolhido = "preto"; 
            break;

        case 7: 
            fundoEscolhido = "preto";
            break;
            
        default:
            fundoEscolhido = "preto";
    }

    if (fundoEscolhido === "preto") {
        body.style.backgroundImage = "none";
        body.style.backgroundColor = "#111111"; 
    } else {
        body.style.backgroundImage = `url('${fundoEscolhido}')`;
        body.style.backgroundColor = "#111111"; 
    }
}



// LÓGICA DO JOGO (LABIRINTO)

function getPos(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function iniciarArraste(e) {
    if (!jogoAtivo) return;
    
    if (e.type === 'touchstart') {
    }

    arrastando = true;
    const rect = jogador.getBoundingClientRect();
    const pos = getPos(e);

    offsetX = pos.x - rect.left;
    offsetY = pos.y - rect.top;

    jogador.style.cursor = "grabbing";
}

if (jogador) {
    jogador.addEventListener("mousedown", iniciarArraste);
    jogador.addEventListener("touchstart", iniciarArraste, {passive: false});
}

function moverPersonagem(e) {
    if (!arrastando || !jogoAtivo) return;

    if (e.type === 'touchmove') e.preventDefault();

    const areaRect = area.getBoundingClientRect();
    const pos = getPos(e);

    const atualX = parseFloat(jogador.style.left) || 20;
    const atualY = parseFloat(jogador.style.top) || 20;

    let destinoX = pos.x - areaRect.left - offsetX;
    let destinoY = pos.y - areaRect.top  - offsetY;

    // CORREÇÃO PARA CELULAR
    if (areaRect.width < 690) { 
        const escala = 700 / areaRect.width; 
        destinoX *= escala;
        destinoY *= escala;
    }

    const maxX = 700 - 60; 
    const maxY = 350 - 60;
    
    destinoX = Math.max(0, Math.min(destinoX, maxX));
    destinoY = Math.max(0, Math.min(destinoY, maxY));

    const dx = destinoX - atualX;
    const dy = destinoY - atualY;
    const distancia = Math.sqrt(dx*dx + dy*dy);
    const passos = Math.ceil(distancia / 5); 

    let ultimoXSeguro = atualX;
    let ultimoYSeguro = atualY;

    for (let i = 1; i <= passos; i++) {
        const t = i / passos;
        const testeX = atualX + (dx * t);
        const testeY = atualY + (dy * t);

        if (colideComParede(testeX, testeY)) {
            break; // Bateu!
        } else {
            ultimoXSeguro = testeX;
            ultimoYSeguro = testeY;
        }
    }

    jogador.style.left = ultimoXSeguro + "px";
    jogador.style.top  = ultimoYSeguro + "px";

    verificarVitoria();
}

document.addEventListener("mousemove", moverPersonagem);
document.addEventListener("touchmove", moverPersonagem, {passive: false});

function pararArraste() {
    arrastando = false;
    if(jogador) jogador.style.cursor = "grab";
}

document.addEventListener("mouseup", pararArraste);
document.addEventListener("touchend", pararArraste);



// FÍSICA DO JOGO

function colideComParede(x, y) {
    const jogadorFuturo = {
        left: x,
        top: y,
        right: x + jogador.clientWidth,
        bottom: y + jogador.clientHeight
    };

    const areaRect = area.getBoundingClientRect();

    for (let parede of paredes) {
        const p = parede.getBoundingClientRect();
        const paredeRelativa = {
            left: p.left - areaRect.left,
            top: p.top - areaRect.top,
            right: p.right - areaRect.left,
            bottom: p.bottom - areaRect.top
        };

        if (areaRect.width < 690) {
            const escala = 700 / areaRect.width;
            paredeRelativa.left *= escala;
            paredeRelativa.top *= escala;
            paredeRelativa.right *= escala;
            paredeRelativa.bottom *= escala;
        }

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

    const tocou = !(
        j.right < c.left ||
        j.left > c.right ||
        j.bottom < c.top ||
        j.top > c.bottom
    );

    if (tocou) {
        jogoAtivo = false;
        arrastando = false;
        
        setTimeout(() => {
            proximaTela(5); 
        }, 100);
    }
}



// SISTEMA DO QUIZ (SHITPOST)
   
function erroQuiz() {
    const novaImagem = document.createElement('img');
    novaImagem.src = 'imagens/arthur.jpg'; 
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
    const sujeira = document.querySelectorAll('.imagem-lixo');
    sujeira.forEach(img => img.remove());

    proximaTela(6);
}



// DESAFIO DAS ESFIHAS

let rankingAtual = [];
const ORDEM_CORRETA = ['M&M', 'Chocolate', 'Doce de leite'];

function escolhaesfihas(esfihas, botaoElemento) {
    rankingAtual.push(esfihas);

    botaoElemento.classList.add('btn-escondido');

    const slotIndex = rankingAtual.length; // 1, 2 ou 3
    const slot = document.getElementById(`slot-${slotIndex}`);
    
    if (slot) {
        slot.innerText = esfihas;
        slot.classList.add('preenchido');
    }

    if (rankingAtual.length === 3) {
        setTimeout(verificarRanking, 500);
    }
}

function verificarRanking() {
    if (JSON.stringify(rankingAtual) === JSON.stringify(ORDEM_CORRETA)) {
        alert("NOOOOSSA");
        proximaTela(8);    
    } else {
        resetaresfihas();
    }
}

function resetaresfihas() {
    rankingAtual = [];
    
    for (let i = 1; i <= 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.innerText = `${i}º`;
        slot.classList.remove('preenchido');
    }

        document.querySelectorAll('.esfihas').forEach(btn => {
        btn.classList.remove('btn-escondido');
    });
}



// TRANSIÇÃO FINAL (CORTINAS)

function iniciarFinal() {
    const cortinaEsq = document.getElementById('cortina-esquerda');
    const cortinaDir = document.getElementById('cortina-direita');
    const imgFinal = document.getElementById('img-final');

    cortinaEsq.classList.add('fechada');
    cortinaDir.classList.add('fechada');

    setTimeout(() => {
        
        proximaTela(9); 
        
        setTimeout(() => {
            
            cortinaEsq.classList.remove('fechada');
            cortinaDir.classList.remove('fechada');
            
            setTimeout(() => {
                if(imgFinal) imgFinal.classList.add('aparecer');
            }, 500);

        }, 500);

    }, 1500);
}