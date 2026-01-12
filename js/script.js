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
   SISTEMA DE NAVEGAÇÃO (MISTURANDO IMAGENS E FUNDO PRETO)
   ========================================================================== */

function proximaTela(numero) {
    // 1. Esconde todas as telas
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    // 2. Mostra a tela desejada
    const proxima = document.getElementById(`tela-${numero}`);
    if (proxima) proxima.classList.add("ativa");

    // 3. Lógica do Esqueleto (Apenas Tela 1)
    const imagemEsq = document.getElementById("imagem-do-esqueleto");
    if (imagemEsq) { // Verificação de segurança
        if (numero === 1) {
            imagemEsq.style.display = "block";
        } else {
            imagemEsq.style.display = "none";
        }
    }

    // 4. Ajustes da Tela 4 (Jogo)
    if (numero === 4) {
        document.body.classList.add("tela-4-ativa");
    } else {
        document.body.classList.remove("tela-4-ativa");
    }

    /* ======================================================
       5. CONTROLE DE FUNDO (IMAGEM vs COR SÓLIDA)
       ====================================================== */
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

    // --- A MÁGICA ACONTECE AQUI ---
    if (fundoEscolhido === "preto") {
        // Desliga a imagem e pinta de preto
        body.style.backgroundImage = "none";
        body.style.backgroundColor = "#111111"; // Cor quase preta (confortável)
    } else {
        // Liga a imagem escolhida
        body.style.backgroundImage = `url('${fundoEscolhido}')`;
        // Se quiser garantir que a cor de fundo não atrapalhe se a imagem demorar carregar:
        body.style.backgroundColor = "#111111"; 
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


// 1. Clicou no boneco
if (jogador) {
    jogador.addEventListener("mousedown", (e) => {
        if (!jogoAtivo) return;
        
        arrastando = true;
        const rect = jogador.getBoundingClientRect();
        
        // Calcula onde clicou dentro da imagem para não "pular"
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        jogador.style.cursor = "grabbing";
    });
}

// 2. Moveu o mouse 
document.addEventListener("mousemove", (e) => {
    if (!arrastando || !jogoAtivo) return;

    const areaRect = area.getBoundingClientRect();

    // 1. Onde o boneco ESTÁ agora (Posição atual)
    const atualX = parseFloat(jogador.style.left) || 20;
    const atualY = parseFloat(jogador.style.top) || 20;

    // 2. Onde o mouse QUER que o boneco vá (Destino final)
    let destinoX = e.clientX - areaRect.left - offsetX;
    let destinoY = e.clientY - areaRect.top  - offsetY;

    // Limites da caixa (Não deixa sair)
    const maxX = area.clientWidth - jogador.clientWidth;
    const maxY = area.clientHeight - jogador.clientHeight;
    destinoX = Math.max(0, Math.min(destinoX, maxX));
    destinoY = Math.max(0, Math.min(destinoY, maxY));

    // 3. O SISTEMA ANTI-TUNELAMENTO (Passos curtos)
    const dx = destinoX - atualX;
    const dy = destinoY - atualY;
    const distancia = Math.sqrt(dx*dx + dy*dy);

    // Divide o movimento em passos de 5 pixels para checar a parede a cada milímetro
    const passos = Math.ceil(distancia / 5); 

    let ultimoXSeguro = atualX;
    let ultimoYSeguro = atualY;

    // Simula o movimento passo a passo
    for (let i = 1; i <= passos; i++) {
        const t = i / passos;
        
        // Ponto intermediário
        const testeX = atualX + (dx * t);
        const testeY = atualY + (dy * t);

        if (colideComParede(testeX, testeY)) {
            // BATEU! Para aqui mesmo.
            break; 
        } else {
            // Caminho livre, atualiza o último ponto seguro
            ultimoXSeguro = testeX;
            ultimoYSeguro = testeY;
        }
    }

    // 4. Move o boneco apenas até o último lugar seguro
    jogador.style.left = ultimoXSeguro + "px";
    jogador.style.top  = ultimoYSeguro + "px";

    // Verifica vitória
    verificarVitoria();
});

// 3. Soltou o mouse
document.addEventListener("mouseup", () => {
    arrastando = false;
    if(jogador) jogador.style.cursor = "grab";
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

/* ==========================================================================
   DESAFIO DAS ESFIHAS (RANKING)
   ========================================================================== */

let rankingAtual = [];
const ORDEM_CORRETA = ['M&M', 'Chocolate', 'Doce de leite'];

function escolhaesfihas(esfihas, botaoElemento) {
    // 1. Adiciona na lista temporária
    rankingAtual.push(esfihas);

    // 2. Esconde o botão clicado pra não clicar duas vezes
    botaoElemento.classList.add('btn-escondido');

    // 3. Mostra visualmente no Slot correspondente
    const slotIndex = rankingAtual.length; // 1, 2 ou 3
    const slot = document.getElementById(`slot-${slotIndex}`);
    
    if (slot) {
        slot.innerText = esfihas;
        slot.classList.add('preenchido');
    }

    // 4. Se já escolheu 3, verifica a resposta
    if (rankingAtual.length === 3) {
        setTimeout(verificarRanking, 500); // Espera meio segundo pra verificar
    }
}

function verificarRanking() {
    // Transforma os arrays em texto para comparar 
    if (JSON.stringify(rankingAtual) === JSON.stringify(ORDEM_CORRETA)) {
        // ACERTOU!
        alert("NOOOOSSA");
        
        // --- AQUI VAI PARA A TELA 8 (Abiel) ---
        proximaTela(8); 
        
    } else {
        // ERROU!
        resetaresfihas();
    }
}

function resetaresfihas() {
    rankingAtual = [];
    
    // Limpa os slots
    for (let i = 1; i <= 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.innerText = `${i}º`;
        slot.classList.remove('preenchido');
    }

    // Mostra os botões de volta
    // OBS: Corrigi apenas o pontinho que faltava na classe abaixo para funcionar
    document.querySelectorAll('.esfihas').forEach(btn => {
        btn.classList.remove('btn-escondido');
    });
}

/* ==========================================================================
   TRANSIÇÃO FINAL (CORTINAS)
   ========================================================================== */
function iniciarFinal() {
    const cortinaEsq = document.getElementById('cortina-esquerda');
    const cortinaDir = document.getElementById('cortina-direita');
    const imgFinal = document.getElementById('img-final');

    // 1. FECHA AS CORTINAS
    cortinaEsq.classList.add('fechada');
    cortinaDir.classList.add('fechada');

    // 2. Espera 1.5s (tempo de fechar)
    setTimeout(() => {
        
        // Troca para a tela 9 (no escuro)
        proximaTela(9); 
        
        // Pausa dramática (0.5s)
        setTimeout(() => {
            
            // 3. ABRE AS CORTINAS
            cortinaEsq.classList.remove('fechada');
            cortinaDir.classList.remove('fechada');
            
            // 4. FAZ A IMAGEM SURGIR
            setTimeout(() => {
                if(imgFinal) imgFinal.classList.add('aparecer');
            }, 500);

        }, 500);

    }, 1500);
}