/**
 * Abelha da Amazônia - Autenticação Administrativa Discreta (Auth)
 */

const AUTH_CONFIG = {
    SESSION_KEY: 'abz_admin_session',
    USERS_KEY: 'abz_admin_credentials',
    DEFAULT_USER: 'admin',
    DEFAULT_PASS: 'admin123'
};

const Auth = {
    init() {
        if (!localStorage.getItem(AUTH_CONFIG.USERS_KEY)) {
            localStorage.setItem(AUTH_CONFIG.USERS_KEY, JSON.stringify({
                username: AUTH_CONFIG.DEFAULT_USER,
                password: AUTH_CONFIG.DEFAULT_PASS,
                name: 'Administrador Abelha da Amazônia',
                lastLogin: null
            }));
        }
    },

    getCredentials() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(AUTH_CONFIG.USERS_KEY));
        } catch (e) {
            return { username: AUTH_CONFIG.DEFAULT_USER, password: AUTH_CONFIG.DEFAULT_PASS };
        }
    },

    login(username, password) {
        this.init();
        const creds = this.getCredentials();

        if (username.trim() === creds.username && password === creds.password) {
            const session = {
                username: creds.username,
                name: creds.name || 'Administrador',
                token: 'tok_' + Math.random().toString(36).substr(2) + Date.now(),
                loginAt: new Date().toISOString()
            };
            sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));

            // Atualiza último login
            creds.lastLogin = new Date().toISOString();
            localStorage.setItem(AUTH_CONFIG.USERS_KEY, JSON.stringify(creds));
            return { success: true };
        }

        return { success: false, message: 'Usuário ou senha incorretos.' };
    },

    logout() {
        sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        window.location.href = 'index.html';
    },

    isAuthenticated() {
        try {
            const session = JSON.parse(sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY));
            return !!(session && session.token);
        } catch (e) {
            return false;
        }
    },

    getSession() {
        try {
            return JSON.parse(sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY));
        } catch (e) {
            return null;
        }
    },

    updatePassword(currentPassword, newPassword) {
        const creds = this.getCredentials();
        if (currentPassword !== creds.password) {
            return { success: false, message: 'Senha atual incorreta.' };
        }
        if (!newPassword || newPassword.length < 5) {
            return { success: false, message: 'A nova senha deve ter no mínimo 5 caracteres.' };
        }
        creds.password = newPassword;
        localStorage.setItem(AUTH_CONFIG.USERS_KEY, JSON.stringify(creds));
        return { success: true, message: 'Senha alterada com sucesso!' };
    },

    // Guard de rota para o Painel Admin
    protectAdminPage() {
        if (!this.isAuthenticated()) {
            window.location.href = 'admin-login.html';
        }
    },

    // Se já estiver logado e abrir a tela de login, vai direto para o admin
    redirectIfLoggedIn() {
        if (this.isAuthenticated()) {
            window.location.href = 'admin.html';
        }
    }
};

Auth.init();
