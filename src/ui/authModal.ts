
import { getUsers, saveUsers, saveUserData, addActivityLog } from '../services/storage';
import { showToast } from '../utils/dom';

// --- SVG Icons ---
const ICONS = {
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    password: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    google: `<svg role="img" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.02 1.9-4.5 0-8.19-3.6-8.19-8.1 0-4.5 3.69-8.1 8.19-8.1 2.5 0 4.13 1.02 5.02 1.9l2.85-2.85C18.44 1.14 15.47 0 12.48 0 5.88 0 0 5.88 0 12s5.88 12 12.48 12c7.2 0 12.03-4.92 12.03-12.36 0-.8-.07-1.55-.2-2.28H12.48z"/></svg>`,
    github: `<svg role="img" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
};

export const switchAuthForm = (tab: 'login' | 'signup' | 'forgot') => {
    const forms = ['login-form', 'signup-form', 'forgot-password-form'];
    const authTabs = document.getElementById('auth-tabs');

    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            const isActive = formId.startsWith(tab);
            form.classList.toggle('active', isActive);
        }
    });

    if (authTabs) {
        authTabs.style.display = (tab === 'forgot') ? 'none' : 'flex';
    }
    
    const loginTab = document.getElementById('login-tab-btn');
    const signupTab = document.getElementById('signup-tab-btn');
    if(loginTab && signupTab) {
        loginTab.classList.toggle('active', tab === 'login');
        signupTab.classList.toggle('active', tab === 'signup');
    }
};

export const renderAuthModal = (): string => `
    <div id="auth-modal" class="modal fixed inset-0 bg-black/60 z-[100] hidden opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
      <div class="modal-content-inner card w-full max-w-md transform scale-95 transition-transform duration-300 relative">
        <div id="auth-tabs" class="tabs">
          <button id="login-tab-btn" class="tab-btn active">ورود</button>
          <button id="signup-tab-btn" class="tab-btn">ثبت نام</button>
        </div>

        <div class="p-8 pt-6 content-wrapper">
          <!-- Login Form -->
          <form id="login-form" class="auth-form active">
            <div class="input-group">
                ${ICONS.email}
                <input type="email" id="email" placeholder="ایمیل" required />
            </div>
            <div class="input-group">
                ${ICONS.password}
                <input type="password" id="password" placeholder="رمز عبور" required />
            </div>
            <a href="#" class="forgot-password-link">رمز عبور را فراموش کرده‌اید؟</a>
            <button type="submit" class="submit-btn">ورود</button>
            <div class="divider">یا با</div>
            <div class="social-logins">
                <button type="button" class="social-btn">${ICONS.google}</button>
                <button type="button" class="social-btn">${ICONS.github}</button>
            </div>
          </form>

          <!-- Sign Up Form -->
          <form id="signup-form" class="auth-form">
            <div class="input-group">
                ${ICONS.user}
                <input type="text" id="new-username" placeholder="نام کاربری" required />
            </div>
            <div class="input-group">
                ${ICONS.email}
                <input type="email" id="new-email" placeholder="ایمیل" required />
            </div>
            <div class="input-group">
                ${ICONS.password}
                <input type="password" id="new-password" placeholder="رمز عبور (حداقل ۸ کاراکتر)" required minlength="8" />
            </div>
            <button type="submit" class="submit-btn">ساخت حساب کاربری</button>
          </form>

          <!-- Forgot Password Form -->
          <form id="forgot-password-form" class="auth-form">
            <h2 class="form-title">بازیابی رمز عبور</h2>
            <p class="form-subtitle">ایمیل خود را برای دریافت لینک بازیابی وارد کنید.</p>
            <div class="input-group">
                ${ICONS.email}
                <input type="email" id="reset-email" placeholder="ایمیل" required />
            </div>
            <button type="submit" class="submit-btn">ارسال لینک</button>
            <a href="#" class="back-to-login-link">بازگشت به صفحه ورود</a>
          </form>
        </div>
      </div>
    </div>
    ${getAuthModalCSS()}
`;

export const initAuthListeners = (onLoginSuccess: (username: string) => void) => {
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return;

    document.getElementById('login-tab-btn')?.addEventListener('click', () => switchAuthForm('login'));
    document.getElementById('signup-tab-btn')?.addEventListener('click', () => switchAuthForm('signup'));
    document.querySelector('.forgot-password-link')?.addEventListener('click', (e) => { e.preventDefault(); switchAuthForm('forgot'); });
    document.querySelector('.back-to-login-link')?.addEventListener('click', (e) => { e.preventDefault(); switchAuthForm('login'); });

    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const users = await getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            if (user.status === 'suspended') {
                showToast('حساب کاربری شما مسدود شده است.', 'error');
            } else {
                showToast(`خوش آمدید، ${user.username}!`, 'success');
                onLoginSuccess(user.username);
            }
        } else {
            showToast('ایمیل یا رمز عبور نامعتبر است.', 'error');
        }
    });

    document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = (document.getElementById('new-username') as HTMLInputElement).value;
        const email = (document.getElementById('new-email') as HTMLInputElement).value;
        const password = (document.getElementById('new-password') as HTMLInputElement).value;

        if (password.length < 8) {
            showToast('رمز عبور باید حداقل ۸ کاراکتر باشد.', 'error'); return;
        }
        const users = await getUsers();
        if (users.some(u => u.username === username)) {
            showToast('این نام کاربری قبلا استفاده شده است.', 'error'); return;
        }
        if (users.some(u => u.email === email)) {
            showToast('این ایمیل قبلا ثبت شده است.', 'error'); return;
        }

        const newUser = { username, email, password, role: 'user' as const, status: 'active' as const, coachStatus: null, joinDate: new Date().toISOString() };
        await saveUsers([...users, newUser]);
        await saveUserData(username, { joinDate: newUser.joinDate });
        await addActivityLog(`New user registered: ${username}`);
        
        showToast('ثبت نام موفق بود! اکنون وارد شوید.', 'success');
        switchAuthForm('login');
    });

    document.getElementById('forgot-password-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('reset-email') as HTMLInputElement).value;
        if (!email) { showToast('لطفا ایمیل خود را وارد کنید.', 'error'); return; }
        
        const users = await getUsers();
        const userExists = users.some(u => u.email === email);
        
        showToast('اگر ایمیل شما موجود باشد، لینک بازیابی ارسال خواهد شد.', 'success');
        await addActivityLog(`Password reset requested for: ${email}. User exists: ${userExists}`);
        switchAuthForm('login');
    });

    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => showToast('این ویژگی به زودی اضافه خواهد شد!', 'info'));
    });
};


const getAuthModalCSS = (): string => `
<style>
:root {
    --base-bg: #1e1e24;
    --surface-bg: #2a2a30;
    --primary-gradient: linear-gradient(90deg, #00aaff, #0077cc);
    --text-primary: #f0f0f0;
    --text-secondary: #a0a0a0;
    --border-color: #404045;
    --inset-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.3);
    --outset-shadow: 0 8px 16px rgba(0,0,0,0.4);
}
#auth-modal .modal-content-inner {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--base-bg);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    box-shadow: var(--outset-shadow);
    padding: 0;
    overflow: hidden;
}
.content-wrapper { position: relative; }
.auth-form {
    display: none;
    flex-direction: column;
    gap: 1.25rem;
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
}
.auth-form.active {
    display: flex;
    opacity: 1;
}
.form-title { font-size: 1.6rem; color: var(--text-primary); text-align: center; margin: 0; }
.form-subtitle { font-size: 0.9rem; color: var(--text-secondary); text-align: center; margin: -10px 0 10px; }
.tabs {
    display: flex;
    padding: 1rem 2rem 0;
    border-bottom: 1px solid var(--border-color);
}
.tab-btn {
    background: none; border: none; color: var(--text-secondary);
    padding: 0.8rem 1rem; font-size: 1rem; cursor: pointer;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: color 0.2s, border-color 0.2s;
}
.tab-btn.active {
    color: var(--text-primary);
    border-bottom-color: #00aaff;
}
.input-group {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--surface-bg);
    border-radius: 8px;
    box-shadow: var(--inset-shadow);
    border: 1px solid var(--border-color);
}
.input-group svg {
    position: absolute;
    left: 1rem;
    color: var(--text-secondary);
    pointer-events: none;
}
.input-group input {
    width: 100%;
    padding: 0.9rem 1rem 0.9rem 3rem;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 1rem;
}
.input-group input::placeholder { color: var(--text-secondary); }
.input-group input:focus {
    outline: none;
}
.input-group:focus-within {
    border-color: #00aaff;
    box-shadow: var(--inset-shadow), 0 0 0 3px rgba(0, 170, 255, 0.2);
}
.forgot-password-link, .back-to-login-link {
    font-size: 0.85rem; color: #00aaff; text-decoration: none;
    text-align: right; margin-top: -10px;
    transition: color 0.2s;
}
.forgot-password-link:hover, .back-to-login-link:hover { color: #33bbff; }
.back-to-login-link { text-align: center; margin-top: 10px; }

.submit-btn {
    padding: 0.9rem; background-image: var(--primary-gradient);
    border: none; border-radius: 8px;
    color: white; font-size: 1.1rem; font-weight: 600;
    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 8px rgba(0, 150, 255, 0.2);
}
.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0, 150, 255, 0.3); }
.submit-btn:active { transform: translateY(0); box-shadow: 0 2px 4px rgba(0, 150, 255, 0.2); }

.divider {
    text-align: center; font-size: 0.8rem; color: var(--text-secondary);
    display: flex; align-items: center; gap: 1rem;
}
.divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border-color);
}
.social-logins {
    display: flex; justify-content: center; gap: 1rem;
}
.social-btn {
    display: flex; align-items: center; justify-content: center;
    width: 3.5rem; height: 3.5rem;
    background: var(--surface-bg); border: 1px solid var(--border-color);
    border-radius: 50%; cursor: pointer; transition: background-color 0.2s;
}
.social-btn svg { fill: var(--text-secondary); transition: fill 0.2s; }
.social-btn:hover { background-color: #383840; }
.social-btn:hover svg { fill: var(--text-primary); }
</style>
`;