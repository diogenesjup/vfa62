var button = $('.button');
var mic = button.find('svg');
var active = $('.active-wrapper');
var stop = $('.stop-button');
var dotCol = $('.dots-col');
var w = $(window);
var vw = w.innerWidth();
var vh = w.innerHeight();
var bw = button.innerWidth();
var bh = button.innerHeight();
var s;
var autoStopTimer;

// --- NOVO: Variável para controlar o stream de áudio ---
var mediaStream = null;

var clone = button.clone();
clone.find('svg').remove();
button.before(clone);

// --- NOVO: Funções de Controle de Áudio ---
function capturarMicrofone() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                mediaStream = stream;
                console.log("Microfone ativado");
            })
            .catch(function(err) {
                console.error("Erro ao capturar áudio", err);
            });
    }
}

function pararMicrofone() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(function(track) {
            track.stop();
        });
        mediaStream = null;
        console.log("Microfone desativado");
    }
}


var open = function() {
    if (vw > vh) {
        s = vw / bw * 1.5;
    } else {
        s = vh / bh * 1.5;
    }
    var scale = 'scale(' + s + ') translate(-50%,-50%)';
    
    clone.css({
        transform: scale
    });
    
    mic.css({
        fill: 'rgba(0,0,0,0.2)',
        transform: 'scale(4)'
    });
    
    button.on('transitionend', function() {
        active.addClass('active');
        $(this).off('transitionend');
    });

    // Inicia Mic e Salva Estado
    capturarMicrofone();
    localStorage.setItem('mic_ativo', 'true');

    // --- NOVO: Timer de 14 segundos com Fake Error ---
    autoStopTimer = setTimeout(function() {
        close(); // Fecha visualmente e para o mic
        alert("Error: Audio processing timeout. Hardware response validation failed (Code: 0x4F).");
    }, 2400);
    
    return false;
};



var close = function() {

    clearTimeout(autoStopTimer);

    active.removeClass('active');
    clone.removeAttr('style');
    mic.removeAttr('style');

    // --- NOVO: Para Mic e Remove Estado ---
    pararMicrofone();
    localStorage.removeItem('mic_ativo');
};

button.on('click', open);
stop.on('click', close);

// --- NOVO: Verifica se deve reabrir automaticamente ---
// Executa apenas se a página foi recarregada com o mic aberto
if (localStorage.getItem('mic_ativo') === 'true') {
    // Um pequeno timeout garante que o DOM esteja pronto para a animação
    setTimeout(function() {
        open();
    }, 100);
}