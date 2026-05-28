<template>
    <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
        <div class="navbar-inner">

            <!-- Logo -->
            <a href="/index.html" class="logo">
                <img src="../../assets/logo.png" alt="logo">
            </a>

            <!-- Links desktop -->
            <ul class="nav-links">
                <li><a href="/index.html" :class="{ active: currentPage === 'index' }">Início</a></li>
                <li><a href="/categories.html" :class="{ active: currentPage === 'categories' }">Assinaturas</a></li>
                <li><a href="/products.html" :class="{ active: currentPage === 'products' }">Catálogo</a></li>
                <li><a href="#" :class="{ active: currentPage === 'agencies' }">Rede de Agências</a></li>
            </ul>

            <!-- Botões auth desktop -->
            <div class="nav-auth">
                <a href="#" class="btn-login">
                    <img src="../../assets/icons/login.png" class="login-icon">
                    <span>Login</span> 
                </a>

                <div class="auth-divider"></div>

                <a href="../../register.html" class="btn-register">Cadastrar</a>
            </div>

            <!-- Botão hamburger mobile -->
            <button class="hamburger" @click="toggleMenu" :aria-expanded="menuOpen" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <!-- Menu mobile -->
        <div class="mobile-menu" :class="{ open: menuOpen }">
            <ul>
                <li><a href="/index.html" @click="closeMenu">Início</a></li>
                <li><a href="/categories.html" @click="closeMenu">Assinaturas</a></li>
                <li><a href="/products.html" @click="closeMenu">Catálogo</a></li>
                <li><a href="#" @click="closeMenu">Rede de Agências</a></li>
            </ul>
            <div class="mobile-auth">
                <a href="#" class="btn-login mobile-login">
                    <img src="../../assets/icons/login.png" class="login-icon">
                    <span>Login</span></a>
                <a href="../../register.html" class="btn-register mobile-register">Cadastrar</a>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',

    // --- data() é o equivalente do useState no React ---
    // Retorna um objeto com todas as variáveis reativas do componente
    data() {
        return {
            isScrolled: false,   // controla classe CSS quando página scrolla
            menuOpen: false,     // controla se menu mobile está aberto
            currentPage: '',     // página ativa para destacar link
        }
    },

    // --- mounted() roda quando o componente é inserido no DOM ---
    // Equivalente ao useEffect(() => { ... }, []) no React
    mounted() {
        // Detecta scroll para mudar estilo da navbar
        window.addEventListener('scroll', this.handleScroll)

        // Detecta qual página está ativa pelo nome do arquivo HTML
        const path = window.location.pathname
        if (path.includes('categories')) this.currentPage = 'categories'
        else if (path.includes('products')) this.currentPage = 'products'
        else if (path.includes('agencies')) this.currentPage = 'agencies'
        else this.currentPage = 'index'
    },

    // --- beforeUnmount() roda antes do componente ser removido do DOM ---
    // Equivalente ao return () => { cleanup } dentro do useEffect no React
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    },

    // --- methods: são as funções do componente ---
    // No React você declara funções normais dentro do componente;
    // no Vue Options API, elas ficam aqui.
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 50  // this.X acessa o data()
        },
        toggleMenu() {
            this.menuOpen = !this.menuOpen
        },
        closeMenu() {
            this.menuOpen = false
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');

/* REMOVE espaços padrão do navegador */
:global(body) {
    margin: 0;
    padding: 0;
}

/* evita scroll horizontal */
:global(html, body) {
    overflow-x: hidden;
}

/* ── Navbar ───────────────────────────── */
.navbar {
    --clr-bg: #CED7DB;
    --clr-primary: #1a56db;
    --clr-dark: #0f172a;
    --clr-text: #334155;
    --clr-border: rgba(0, 0, 0, 0.08);
    --shadow: 0 2px 20px rgba(0, 0, 0, 0.08);

    position: sticky;
    top: 0;
    left: 0;

    width: 100%;
    z-index: 1000;

    background: var(--clr-bg);
    border-bottom: 1px solid var(--clr-border);

    font-family: 'Barlow', sans-serif;

    transition:
        box-shadow 0.3s ease,
        background 0.3s ease;
}

/* navbar quando scrolla */
.navbar.scrolled {
    box-shadow: var(--shadow);
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(8px);
}

/* conteúdo interno */
.navbar-inner {
    width: 100%;
    height: 72px;

    display: flex;
    align-items: center;

    padding: 0 10px;

    box-sizing: border-box;
}

/* ── Logo ───────────────────────────── */
.logo {
    display: flex;
    align-items: center;

    margin-right: 40px;
    text-decoration: none;
}

/* logo responsiva */
.logo img {
    width: clamp(170px, 16vw, 280px);
    height: auto;

    display: block;
    object-fit: contain;
}

/* ── Links ───────────────────────────── */
.nav-links {
    display: flex;
    align-items: center;

    list-style: none;

    margin: 0;
    padding: 0;

    gap: 4px;

    flex: 1;
}

.nav-links a {
    display: block;

    padding: 6px 14px;

    text-decoration: none;

    font-size: 0.875rem;
    font-weight: 600;

    letter-spacing: 0.3px;
    text-transform: uppercase;

    color: var(--clr-text);

    border-radius: 6px;

    transition:
        color 0.2s,
        background 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--clr-primary);
    background: rgba(26, 86, 219, 0.07);
}

/* link ativo */
.nav-links a.active {
    position: relative;
}

.nav-links a.active::after {
    content: '';

    position: absolute;

    left: 14px;
    right: 14px;
    bottom: -2px;

    height: 2px;

    background: var(--clr-primary);

    border-radius: 2px;
}

/* ── Auth Desktop ───────────────────────────── */
.nav-auth {
    display: flex;
    align-items: center;

    gap: 14px;

    white-space: nowrap;
}

/* login */
.btn-login {
    display: flex;
    align-items: center;
    gap: 8px;

    text-decoration: none;

    font-size: 0.875rem;
    font-weight: 600;

    color: var(--clr-text);

    padding: 6px 10px;

    border-radius: 8px;

    transition:
        background 0.2s,
        transform 0.15s;
}

.btn-login:hover {
    background: rgba(26, 86, 219, 0.08);
    transform: translateY(-1px);
}

/* ícone login */
.login-icon {
    width: 18px;
    height: 18px;

    object-fit: contain;

    flex-shrink: 0;
}

/* divisor */
.auth-divider {
    width: 1px;
    height: 24px;

    background: rgba(0, 0, 0, 0.15);
}

/* botão cadastrar */
.btn-register {
    text-decoration: none;

    font-size: 0.82rem;
    font-weight: 700;

    color: #fff;
    background: var(--clr-primary);

    padding: 7px 14px;

    border-radius: 8px;

    letter-spacing: 0.3px;

    transition:
        background 0.2s,
        transform 0.15s;
}

.btn-register:hover {
    background: #1447c0;
    transform: translateY(-1px);
}

/* ── Mobile auth melhorado ───────────────────────────── */
@media (max-width: 768px) {

    .mobile-auth {
        display: flex;
        align-items: center;

        gap: 10px;

        margin-top: 18px;
    }

    /* botão login mobile */
    .mobile-login {
        flex: 1;

        justify-content: center;

        padding: 10px 12px;

        background: rgba(255, 255, 255, 0.5);

        border: 1px solid rgba(0, 0, 0, 0.08);

        border-radius: 10px;
    }

    /* botão cadastrar mobile */
    .mobile-register {
        padding: 10px 16px;

        border-radius: 10px;

        white-space: nowrap;

        flex: unset;
    }

    /* remove divisor no mobile */
    .auth-divider {
        display: none;
    }

    /* ícone um pouco maior no mobile */
    .mobile-login .login-icon {
        width: 20px;
        height: 20px;
    }
}

/* ── Hamburger ───────────────────────────── */
.hamburger {
    display: none;

    flex-direction: column;
    justify-content: center;

    gap: 5px;

    background: none;
    border: none;

    cursor: pointer;

    padding: 8px;

    margin-left: auto;
}

.hamburger span {
    display: block;

    width: 22px;
    height: 2px;

    background: var(--clr-dark);

    border-radius: 2px;

    transition:
        transform 0.3s,
        opacity 0.3s;
}

/* animação X */
.menu-open .hamburger span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.menu-open .hamburger span:nth-child(2) {
    opacity: 0;
}

.menu-open .hamburger span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

/* ── Mobile menu ───────────────────────────── */
.mobile-menu {
    display: none;
    flex-direction: column;

    background: var(--clr-bg);

    border-top: 1px solid var(--clr-border);

    padding: 12px 20px 20px;

    gap: 4px;
}

.mobile-menu.open {
    display: flex;
}

.mobile-menu ul {
    list-style: none;

    margin: 0;
    padding: 0;
}

.mobile-menu ul a {
    display: block;

    padding: 12px 4px;

    text-decoration: none;

    font-size: 1rem;
    font-weight: 600;

    color: var(--clr-text);

    border-bottom: 1px solid var(--clr-border);

    text-transform: uppercase;
    letter-spacing: 0.3px;

    transition: color 0.2s;
}

.mobile-menu ul a:hover {
    color: var(--clr-primary);
}

.mobile-auth {
    display: flex;

    gap: 12px;

    margin-top: 16px;
}

.mobile-auth .btn-register {
    flex: 1;
    text-align: center;
}

/* ── Responsivo ───────────────────────────── */
@media (max-width: 768px) {

    .nav-links,
    .nav-auth {
        display: none;
    }

    .hamburger {
        display: flex;
    }

    .navbar-inner {
        height: 68px;
        padding: 0 12px;
    }

    .logo {
        margin-right: 0;
    }

    .logo img {
        width: 180px;
    }
}

@media (max-width: 480px) {
    .logo img {
        width: 155px;
    }
}

@media (max-width: 768px) {
    .auth-divider {
        display: none;
    }
}
</style>