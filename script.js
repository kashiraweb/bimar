document.addEventListener('DOMContentLoaded', () => {

    /* ========== CONTADOR REGRESIVO ========== */
    const fechaEvento = new Date('2026-12-07T20:00:00').getTime();
    const $ = id => document.getElementById(id);
    const pad = n => String(n).padStart(2, '0');

    function actualizarContador() {
        const diff = fechaEvento - Date.now();

        if (diff <= 0) {
            ['days', 'hours', 'minutes', 'seconds'].forEach(id => $(id).textContent = '00');
            $('countdown-msg').hidden = false;
            return;
        }

        $('days').textContent    = Math.floor(diff / 86400000);
        $('hours').textContent   = pad(Math.floor((diff % 86400000) / 3600000));
        $('minutes').textContent = pad(Math.floor((diff % 3600000) / 60000));
        $('seconds').textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    actualizarContador();
    setInterval(actualizarContador, 1000);

    /* ========== CARRUSEL ========== */
    const slides = document.querySelectorAll('.slider .slide');
    const dotsBox = $('dots');
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', () => { mostrar(i); reiniciar(); });
        dotsBox.appendChild(dot);
    });
    const dots = dotsBox.querySelectorAll('.dot');

    function mostrar(i) {
        slides[index].classList.remove('active');
        dots[index].classList.remove('active');
        index = (i + slides.length) % slides.length;
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    function reiniciar() {
        clearInterval(timer);
        timer = setInterval(() => mostrar(index + 1), 4000);
    }
    reiniciar();

    $('prev').addEventListener('click', () => { mostrar(index - 1); reiniciar(); });
    $('next').addEventListener('click', () => { mostrar(index + 1); reiniciar(); });

    // Deslizar con el dedo
    let startX = 0;
    const slider = $('slider');
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) { mostrar(index + (dx < 0 ? 1 : -1)); reiniciar(); }
    });

    /* ========== ANIMACIÓN AL HACER SCROLL ========== */
    const items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach(el => obs.observe(el));
    } else {
        items.forEach(el => el.classList.add('visible'));
    }

    /* ========== CONFETI DE FONDO ========== */
    const confeti = $('confetti');
    const colores = ['#f5c518', '#ff2e93', '#19d3ff', '#ff5a36', '#7dff6b'];
    const cantidad = window.innerWidth < 640 ? 22 : 40;
    for (let i = 0; i < cantidad; i++) {
        const p = document.createElement('span');
        p.className = 'piece';
        p.style.left = Math.random() * 100 + '%';
        p.style.background = colores[Math.floor(Math.random() * colores.length)];
        p.style.animationDuration = (7 + Math.random() * 9) + 's';
        p.style.animationDelay = (-Math.random() * 14) + 's';
        p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        p.style.opacity = 0.35 + Math.random() * 0.5;
        confeti.appendChild(p);
    }

    /* ========== MÚSICA ========== */
    const musica = $('background-music');
    const btnMusica = $('music-btn');
    const estado = $('music-status');

    function marcar(sonando) {
        estado.textContent = sonando ? 'Pausa' : 'Play';
        btnMusica.classList.toggle('playing', sonando);
    }
    function alternarMusica() {
        if (musica.paused) {
            musica.play().then(() => marcar(true)).catch(() => {});
        } else {
            musica.pause();
            marcar(false);
        }
    }
    btnMusica.addEventListener('click', e => { e.stopPropagation(); alternarMusica(); });

    // Pantalla de bienvenida: el toque en "Abrir invitación" inicia la música
    const welcome = $('welcome');
    document.body.classList.add('locked');

    function abrirInvitacion() {
        musica.play().then(() => marcar(true)).catch(() => {});
        welcome.classList.add('hide');
        document.body.classList.remove('locked');
        setTimeout(() => welcome.remove(), 900);
    }
    $('open-invite').addEventListener('click', abrirInvitacion);

    // Intento extra: algunos navegadores sí permiten sonar solos al cargar
    musica.play().then(() => marcar(true)).catch(() => {});

    /* ========== CONFIRMAR ASISTENCIA ========== */
    $('rsvp').addEventListener('click', () => {
        const msg = encodeURIComponent('¡Hola! Confirmo mi asistencia a la Fiesta de Ex-Promociones U.E. Maria Ayma 🎉');
        window.open('https://wa.me/59173436970?text=' + msg, '_blank');
    });
});
