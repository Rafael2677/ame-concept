(function () {
  'use strict';

  var WHATS = '5511984827777';
  function linkWhats(texto) { return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(texto); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- Aberto agora (horário do Google: terça a sábado, 9h às 20h) ---------- */
  var ABRE = 9 * 60, FECHA = 20 * 60;
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  function abreNoDia(d) { return d >= 2 && d <= 6; }

  function agoraSP() {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {};
      p.forEach(function (x) { o[x.type] = x.value; });
      var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
      return { dia: dia, min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function estado() {
    var a = agoraSP();
    if (abreNoDia(a.dia) && a.min >= ABRE && a.min < FECHA) {
      return { aberto: true, texto: 'Aberto agora, até as 20h', dia: a.dia };
    }
    if (abreNoDia(a.dia) && a.min < ABRE) {
      return { aberto: false, texto: 'Fechado agora, abre hoje às 9h', dia: a.dia };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (a.dia + i) % 7;
      if (abreNoDia(d)) {
        return { aberto: false, texto: 'Fechado agora, abre ' + (i === 1 ? 'amanhã' : DIAS[d]) + ' às 9h', dia: a.dia };
      }
    }
  }

  function pintarAberto() {
    var e = estado();
    $$('[data-aberto]').forEach(function (el) {
      el.hidden = false;
      el.classList.toggle('esta-aberto', e.aberto);
      $('[data-aberto-texto]', el).textContent = e.texto;
    });
    $$('.horario tr').forEach(function (tr) {
      tr.classList.toggle('hoje', tr.getAttribute('data-dia') === String(e.dia));
    });
  }
  pintarAberto();
  setInterval(pintarAberto, 60000);

  /* ---------- Equipe: cada nome leva ao WhatsApp com a mensagem pronta ---------- */
  $$('.pessoa__agendar').forEach(function (a) {
    a.href = linkWhats('Olá! Vi o site do Âme Concept e quero agendar um horário com ' + a.getAttribute('data-profissional') + '.');
  });

  /* ---------- Guia: objetivo → serviço indicado → com quem → quando → mensagem ---------- */
  // Só entra o que o salão publica (Instagram @concept.ame e SheerME). Nada aqui promete resultado.
  var OBJETIVOS = [
    {
      id: 'cor', rotulo: 'Clarear, iluminar ou mudar a cor', tom: '#d9bf8f',
      tons: ['#4a3327', '#7a5540', '#b98a5e', '#e3cfa9'],
      titulo: 'Cor e mechas',
      texto: 'Loiros, morenas iluminadas, luzes e abertura de fundo. O caminho e o número de sessões dependem do histórico do seu cabelo, e isso se decide na conversa com o profissional.',
      quem: 'Nas publicações do salão, Du Nunes assina trabalhos de loiro.',
      antes: ['Separe duas ou três fotos de referência, do que você gosta e do que não quer.', 'Conte tudo o que o cabelo recebeu nos últimos anos: tintura, progressiva, descoloração.', 'Reserve tempo: cor e mechas costumam levar algumas horas.'],
      pedido: 'cor e mechas', online: false
    },
    {
      id: 'corte', rotulo: 'Mudar o corte', tom: '#8f8a83',
      tons: ['#1c1a18', '#57514a', '#a8a29a', '#f1eee9'],
      titulo: 'Corte',
      texto: 'Feminino e masculino, pensado para o formato do rosto e a textura dos fios. Cerca de uma hora.',
      quem: 'Nas publicações do salão, Du Nunes assina o corte Face Line.',
      antes: ['Leve referências do comprimento e da franja que imagina.', 'Diga como você arruma o cabelo no dia a dia.'],
      pedido: 'corte', online: true
    },
    {
      id: 'tratar', rotulo: 'Recuperar brilho e maciez', tom: '#b98a5e',
      tons: ['#3b2a20', '#8a6042', '#c79a6b', '#ead9bd'],
      titulo: 'Hidratação com Keune',
      texto: 'Protocolo escolhido conforme a necessidade do cabelo. Cerca de uma hora.',
      quem: '',
      antes: ['Conte quais químicas o cabelo tem e o que mais incomoda hoje.'],
      pedido: 'hidratação', online: true
    },
    {
      id: 'mega', rotulo: 'Ganhar comprimento ou volume', tom: '#5b4032',
      tons: ['#2a1d16', '#5b4032', '#8c6a50', '#c7a57e'],
      titulo: 'Mega hair',
      texto: 'Alongamento para ganhar comprimento e volume com movimento natural. Método e quantidade são definidos em avaliação.',
      quem: '',
      antes: ['Leve fotos do comprimento que você quer.', 'Conte se já usou alongamento antes e como foi.'],
      pedido: 'mega hair', online: false
    },
    {
      id: 'evento', rotulo: 'Me arrumar para um evento', tom: '#5e1f2b',
      tons: ['#2b0f15', '#5e1f2b', '#a0616a', '#ead3d0'],
      titulo: 'Escova, penteado e maquiagem',
      texto: 'Blow out, coques, tranças e maquiagem para festas, formaturas e ocasiões especiais.',
      quem: 'Nas publicações do salão, Marcello Mastrorosa assina trabalhos de blow out.',
      antes: ['Diga a data e o horário do evento.', 'Leve fotos do penteado e do vestido, se já tiver.'],
      pedido: 'escova, penteado ou maquiagem para um evento', online: false
    },
    {
      id: 'unhas', rotulo: 'Fazer as unhas', tom: '#b3202f',
      tons: ['#6d1620', '#b3202f', '#e7b8b4', '#f6e7e2'],
      titulo: 'Unhas',
      texto: 'Manicure, pedicure e alongamento em gel.',
      quem: '',
      antes: ['Para alongamento em gel, avise se é a primeira vez ou manutenção.'],
      pedido: 'unhas', online: true
    }
  ];
  var QUEM = ['Sem preferência', 'Du Nunes', 'Tiago Aprígio', 'Marcello Mastrorosa', 'Cris', 'Jhony', 'Kaio', 'Gabriel'];
  var QUANDO = ['Manhã', 'Tarde', 'Fim do dia', 'Sábado'];

  var escolha = { objetivo: null, quem: null, quando: null };
  var elObj = $('[data-objetivos]');
  if (!elObj) return;

  function botao(classe, texto, aoClicar) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = classe; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      $$('.' + classe, b.parentNode).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      aoClicar();
    });
    b.appendChild(document.createTextNode(texto));
    return b;
  }

  OBJETIVOS.forEach(function (o) {
    var b = botao('objetivo', o.rotulo, function () { escolha.objetivo = o; mostrarIndicado(); atualizar(); });
    var tom = document.createElement('span');
    tom.className = 'objetivo__tom'; tom.style.background = o.tom; tom.setAttribute('aria-hidden', 'true');
    b.insertBefore(tom, b.firstChild);
    elObj.appendChild(b);
  });
  QUEM.forEach(function (n) {
    $('[data-quem]').appendChild(botao('ficha', n, function () { escolha.quem = n; atualizar(); }));
  });
  QUANDO.forEach(function (q) {
    $('[data-quando]').appendChild(botao('ficha', q, function () { escolha.quando = q; atualizar(); }));
  });

  function mostrarIndicado() {
    var o = escolha.objetivo;
    $('[data-ind-titulo]').textContent = o.titulo;
    $('[data-ind-texto]').textContent = o.texto;
    $('[data-ind-quem]').textContent = o.quem;
    var tons = $('[data-tons]'); tons.textContent = '';
    o.tons.forEach(function (c) { var s = document.createElement('span'); s.style.background = c; tons.appendChild(s); });
    var ul = $('[data-ind-antes]'); ul.textContent = '';
    o.antes.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    $('[data-indicado]').hidden = false;
    $('[data-passo-quem]').hidden = false;
    $('[data-passo-quando]').hidden = false;
    $('[data-bilhete]').hidden = false;
  }

  function atualizar() {
    var o = escolha.objetivo;
    if (!o) return;
    var msg = 'Olá! Vi o site do Âme Concept e quero agendar ' + o.pedido;
    if (escolha.quem && escolha.quem !== 'Sem preferência') msg += ' com ' + escolha.quem;
    msg += '.';
    if (escolha.quando === 'Sábado') msg += ' Prefiro no sábado.';
    else if (escolha.quando) msg += ' Prefiro ' + { 'Manhã': 'de manhã', 'Tarde': 'à tarde', 'Fim do dia': 'no fim do dia' }[escolha.quando] + '.';
    msg += ' Quais horários vocês têm?';
    $('[data-mensagem]').textContent = msg;
    $('[data-enviar]').href = linkWhats(msg);
    $('[data-sheerme]').hidden = !o.online;
  }

  /* ---------- Botão flutuante aparece depois da abertura ---------- */
  var flutua = $('[data-flutua]'), abre = $('.abre');
  if (flutua && abre && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      flutua.classList.toggle('visivel', !e[0].isIntersecting);
    }, { threshold: 0.25 }).observe(abre);
  } else if (flutua) {
    flutua.classList.add('visivel');
  }
})();
