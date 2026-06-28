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
                <li><a href="/signature.html" :class="{ active: currentPage === 'signature' }">Assinaturas</a></li>
                <li><a href="/catalog.html" :class="{ active: currentPage === 'catalog' }">Catálogo</a></li>
                <li><a href="/agency.html" :class="{ active: currentPage === 'agency' }">Rede de Agências</a></li>
            </ul>

            <!-- Botões auth desktop -->
            <div class="nav-auth">
                <!-- Não logado -->
                <div v-if="!isAuthenticated" class="nav-auth-guest">
                    <a href="../../login.html" class="btn-login">
                        <img src="../../assets/icons/login.png" class="login-icon">
                        <span>Login</span>
                    </a>

                    <div class="auth-divider"></div>

                    <a href="../../register.html" class="btn-register">Cadastrar</a>
                </div>

                <!-- Logado -->
                <div v-else class="nav-auth-user">
                    <button
                        type="button"
                        class="profile-btn"
                        @click="toggleProfileMenu"
                        aria-label="Conta"
                        aria-haspopup="true"
                        :aria-expanded="profileMenuOpen"
                    >
                        <img src="../../assets/icons/profile-picture.png" class="profile-icon" alt="Perfil" />
                    </button>

                    <transition name="dropdown-fade">
                        <div v-if="profileMenuOpen" class="profile-dropdown">
                            <button type="button" class="dropdown-item" @click="logout">
                                Sair
                            </button>
                        </div>
                    </transition>
                </div>
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
                <li><a href="/signature.html" @click="closeMenu">Assinaturas</a></li>
                <li><a href="/catalog.html" @click="closeMenu">Catálogo</a></li>
                <li><a href="/agency.html" @click="closeMenu">Rede de Agências</a></li>
            </ul>

            <div class="mobile-auth">
                <!-- Não logado -->
                <template v-if="!isAuthenticated">
                    <a href="../../login.html" class="btn-login mobile-login">
                        <img src="../../assets/icons/login.png" class="login-icon">
                        <span>Login</span>
                    </a>
                    <a href="../../register.html" class="btn-register mobile-register">Cadastrar</a>
                </template>

                <!-- Logado -->
                <template v-else>
                    <div class="mobile-auth-user">
                        <button
                            type="button"
                            class="profile-btn mobile-profile"
                            @click="toggleProfileMenu"
                            aria-label="Conta"
                            aria-haspopup="true"
                            :aria-expanded="profileMenuOpen"
                        >
                            <img src="../../assets/icons/profile-picture.png" class="profile-icon" alt="Perfil" />
                        </button>

                        <transition name="dropdown-fade">
                            <div v-if="profileMenuOpen" class="profile-dropdown mobile-dropdown">
                                <button type="button" class="dropdown-item" @click="logout">
                                    Sair
                                </button>
                            </div>
                        </transition>
                    </div>
                </template>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',

    data() {
        return {
            isScrolled: false,
            menuOpen: false,
            profileMenuOpen: false,
            isAuthenticated: false,
            currentPage: '',
        }
    },

    created() {
        const path = window.location.pathname
        if (path.includes('signature')) this.currentPage = 'signature'
        else if (path.includes('catalog')) this.currentPage = 'catalog'
        else if (path.includes('agency')) this.currentPage = 'agency'
        else this.currentPage = 'index'
    },

    mounted() {
        window.addEventListener('scroll', this.handleScroll)
        // 'storage' só dispara em outras abas; para a mesma aba usamos o
        // CustomEvent 'auth:changed' despachado por Login.vue / logout.
        window.addEventListener('storage', this.handleStorage)
        window.addEventListener('auth:changed', this.handleAuthChanged)

        this.checkAuthWithRetry()

        document.addEventListener('click', this.handleDocumentClick)
    },


    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('storage', this.handleStorage)
        window.removeEventListener('auth:changed', this.handleAuthChanged)
        document.removeEventListener('click', this.handleDocumentClick)
    },


    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 50
        },

        toggleMenu() {
            this.menuOpen = !this.menuOpen
        },

        closeMenu() {
            this.menuOpen = false
        },

        handleDocumentClick(e) {
            const dropdownEl = e.target?.closest?.('.profile-dropdown')
            const btnEl = e.target?.closest?.('.profile-btn')
            if (!dropdownEl && !btnEl) {
                this.profileMenuOpen = false
            }
        },

        async checkAuth() {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                this.isAuthenticated = false
                return false
            }

            // Token presente → exibe o estado autenticado imediatamente.
            // Não depende de uma chamada de rede para renderizar o avatar.
            this.isAuthenticated = true

            try {
                const res = await fetch('http://localhost:8000/api/auth/me', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                if (res.status === 401) {
                    // Token inválido ou expirado: limpa e desloga silenciosamente
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    this.isAuthenticated = false
                    return false
                }

                // Outros erros HTTP (5xx, rede) → mantém estado otimista;
                // o usuário não deve ser deslogado por instabilidade do servidor.
                return true
            } catch {
                // Falha de rede: mantém isAuthenticated = true (otimista).
                return true
            }
        },

        async checkAuthWithRetry() {
            // Alguns navegadores/fluxos montam o navbar antes do token estar no localStorage.
            // Esse retry garante que o estado seja atualizado.
            const attempts = 5
            const delayMs = 250

            for (let i = 0; i < attempts; i++) {
                const ok = await this.checkAuth()
                if (ok) return

                await new Promise((r) => setTimeout(r, delayMs))
            }
        },

        handleStorage(e) {
            if (!e) return
            if (e.key === 'accessToken' || e.key === 'refreshToken') {
                // Recalcula o estado do usuário (disparado por outras abas)
                this.checkAuthWithRetry()
            }
        },

        // Chamado pelo CustomEvent 'auth:changed' despachado na mesma aba.
        // O evento 'storage' nativo não dispara para mudanças feitas
        // na própria aba — este handler cobre esse gap.
        handleAuthChanged() {
            this.checkAuth()
        },


        toggleProfileMenu() {
            this.profileMenuOpen = !this.profileMenuOpen
        },

        async logout() {
            try {
                const accessToken = localStorage.getItem('accessToken')
                const refreshToken = localStorage.getItem('refreshToken')

                await fetch('http://localhost:8000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ refreshToken }),
                })
            } catch {
                // ignore
            } finally {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                this.isAuthenticated = false
                this.profileMenuOpen = false
                window.location.href = '/login.html'
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@700;800&display=swap');

:global(body) {
    margin: 0;
    padding: 0;
}

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

.navbar.scrolled {
    box-shadow: var(--shadow);
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(8px);
}

/* ── Navbar inner — overflow visible para o dropdown não ser cortado ── */
.navbar-inner {
    width: 100%;
    height: 72px;

    display: flex;
    align-items: center;

    padding: 0 10px;
    box-sizing: border-box;
    overflow: visible;
}

/* ── Logo ───────────────────────────── */
.logo {
    display: flex;
    align-items: center;
    margin-right: 40px;
    text-decoration: none;
}

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
    position: relative;   /* âncora o dropdown */
    margin-left: auto;    /* empurra para a direita quando nav-links não existe (mobile) */
}

.nav-auth-guest,
.nav-auth-user {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* ── Botão Login ───────────────────────────── */
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

.login-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
}

/* ── Divisor ───────────────────────────── */
.auth-divider {
    width: 1px;
    height: 24px;
    background: rgba(0, 0, 0, 0.15);
}

/* ── Botão Cadastrar ───────────────────────────── */
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

/* ── Perfil (logado) ───────────────────────────── */
.nav-auth-user {
    position: relative;
}

.profile-btn {
    width: 38px;
    height: 38px;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.10);
    background: rgba(255, 255, 255, 0.4);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
        transform 0.15s,
        background 0.2s,
        border-color 0.2s;
}

.profile-btn:hover {
    background: rgba(255, 255, 255, 0.7);
    border-color: rgba(26, 86, 219, 0.25);
    transform: translateY(-1px);
}

.profile-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
}

/* ── Dropdown ───────────────────────────── */
.profile-dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    z-index: 9999;

    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14);
    min-width: 130px;
    padding: 8px;
}

.dropdown-item {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    font-family: 'Barlow', sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--clr-text);
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.dropdown-item:hover {
    background: rgba(26, 86, 219, 0.08);
    color: var(--clr-primary);
}

/* ── Animação do dropdown ───────────────────────────── */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
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
    margin-left: 12px;
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

/* ── Mobile auth ───────────────────────────── */
.mobile-auth {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 18px;
}

.mobile-auth .btn-register {
    flex: 1;
    text-align: center;
}

.mobile-login {
    flex: 1;
    justify-content: center;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 10px;
}

.mobile-register {
    padding: 10px 16px;
    border-radius: 10px;
    white-space: nowrap;
}

.mobile-login .login-icon {
    width: 20px;
    height: 20px;
}

/* ── Mobile auth usuário logado ───────────────────────────── */
.mobile-auth-user {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.mobile-profile {
    width: 44px;
    height: 44px;
}

.profile-dropdown.mobile-dropdown {
    position: static;
    margin-top: 10px;
    box-shadow: none;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    width: 100%;
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

    .auth-divider {
        display: none;
    }
}

@media (max-width: 480px) {
    .logo img {
        width: 155px;
    }
}
</style>
