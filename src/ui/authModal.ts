
import { getUsers, saveUsers, saveUserData, addActivityLog } from '../services/storage';
import { showToast } from '../utils/dom';

// This function is required by landing.ts to switch between forms.
export const switchAuthForm = (tab: 'login' | 'signup' | 'forgot') => {
  const loginTab = document.getElementById('login-tab-btn');
  const signupTab = document.getElementById('signup-tab-btn');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-password-form');

  if (!loginTab || !signupTab || !loginForm || !signupForm || !forgotForm) {
    return;
  }

  // Hide all forms first
  loginForm.style.display = 'none';
  signupForm.style.display = 'none';
  forgotForm.style.display = 'none';

  // Deactivate all tabs
  loginTab.classList.remove('active');
  signupTab.classList.remove('active');

  if (tab === 'login') {
    loginTab.classList.add('active');
    loginForm.style.display = 'block';
  } else if (tab === 'signup') {
    signupTab.classList.add('active');
    signupForm.style.display = 'block';
  } else { // forgot
    // No tab is active for the forgot password form
    forgotForm.style.display = 'block';
  }
};

export const renderAuthModal = (): string => {
  return `
    <div id="auth-modal" class="modal fixed inset-0 bg-black/60 z-[100] hidden opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
      <div class="modal-content-inner card w-full max-w-md transform scale-95 transition-transform duration-300 relative !bg-[#2a2a2e] !border-[#444]">
        <div id="auth-tabs" class="tabs">
          <button id="login-tab-btn" class="tab-btn">ورود</button>
          <button id="signup-tab-btn" class="tab-btn">ثبت نام</button>
        </div>

        <div class="p-8 pt-6">
            <!-- Login Form -->
            <form id="login-form" class="auth-form">
              <h2>خوش آمدید!</h2>
              <p>برای ادامه وارد حساب کاربری خود شوید.</p>
              <div class="input-group">
                <label for="email">ایمیل</label>
                <input type="email" id="email" placeholder="example@email.com" required />
              </div>
              <div class="input-group">
                <label for="password">رمز عبور</label>
                <div class="password-wrapper">
                    <input type="password" id="password" placeholder="••••••••" required />
                    <button type="button" class="password-toggle">نمایش</button>
                </div>
              </div>
              <a href="#" class="forgot-password-link">رمز عبور را فراموش کرده‌اید؟</a>
              <button type="submit" class="submit-btn">ورود</button>
            </form>

            <!-- Sign Up Form -->
            <form id="signup-form" class="auth-form" style="display: none;">
              <h2>حساب کاربری جدید بسازید</h2>
              <p>برای دسترسی به امکانات ویژه ثبت نام کنید.</p>
               <div class="input-group">
                <label for="new-username">نام کاربری</label>
                <input type="text" id="new-username" placeholder="مثال: user123" required />
              </div>
              <div class="input-group">
                <label for="new-email">ایمیل</label>
                <input type="email" id="new-email" placeholder="example@email.com" required />
              </div>
              <div class="input-group">
                <label for="new-password">رمز عبور</label>
                <div class="password-wrapper">
                    <input type="password" id="new-password" placeholder="حداقل ۸ کاراکتر" required minlength="8" />
                    <button type="button" class="password-toggle">نمایش</button>
                </div>
              </div>
              <button type="submit" class="submit-btn">ثبت نام</button>
            </form>

            <!-- Forgot Password Form -->
            <form id="forgot-password-form" class="auth-form" style="display: none;">
              <h2>بازیابی رمز عبور</h2>
              <p>ایمیل خود را وارد کنید تا لینک بازیابی را برایتان ارسال کنیم.</p>
              <div class="input-group">
                <label for="reset-email">ایمیل</label>
                <input type="email" id="reset-email" placeholder="example@email.com" required />
              </div>
              <button type="submit" class="submit-btn">ارسال لینک بازیابی</button>
              <a href="#" class="back-to-login-link">بازگشت به صفحه ورود</a>
            </form>
        </div>
      </div>
    </div>
    ${getAuthModalCSS()}
  `;
};

export const initAuthListeners = (onLoginSuccess: (username: string) => void) => {
  const loginTab = document.getElementById('login-tab-btn');
  const signupTab = document.getElementById('signup-tab-btn');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const forgotPasswordLink = document.querySelector('.forgot-password-link');
  const backToLoginLink = document.querySelector('.back-to-login-link');
  const authTabs = document.getElementById('auth-tabs');

  if (!loginTab || !signupTab || !loginForm || !signupForm || !forgotPasswordForm || !forgotPasswordLink || !backToLoginLink || !authTabs) {
    return;
  }

  loginTab.addEventListener('click', () => switchAuthForm('login'));
  signupTab.addEventListener('click', () => switchAuthForm('signup'));

  forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      authTabs.style.display = 'none';
      switchAuthForm('forgot');
  });

  backToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      authTabs.style.display = 'flex';
      switchAuthForm('login');
  });

  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
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
      } catch (error) {
        showToast('خطایی در هنگام ورود رخ داد. لطفا دوباره تلاش کنید.', 'error');
      }
  });

  signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const username = (document.getElementById('new-username') as HTMLInputElement).value;
        const email = (document.getElementById('new-email') as HTMLInputElement).value;
        const password = (document.getElementById('new-password') as HTMLInputElement).value;

        if (!username || !email || !password) {
            showToast('لطفا تمام فیلدها را پر کنید.', 'error');
            return;
        }
        if (password.length < 8) {
            showToast('رمز عبور باید حداقل ۸ کاراکتر باشد.', 'error');
            return;
        }

        const users = await getUsers();
        if (users.some(u => u.username === username)) {
            showToast('این نام کاربری قبلا استفاده شده است.', 'error');
            return;
        }
        if (users.some(u => u.email === email)) {
            showToast('این ایمیل قبلا ثبت شده است.', 'error');
            return;
        }

        const newUser = {
            username,
            email,
            password, // WARNING: Plain text password. Should be hashed in a real app.
            role: 'user' as const,
            status: 'active' as const,
            coachStatus: null,
            joinDate: new Date().toISOString(),
        };

        await saveUsers([...users, newUser]);
        await saveUserData(username, { 
            joinDate: newUser.joinDate
        });
        await addActivityLog(`New user registered: ${username}`);
        
        showToast('ثبت نام شما با موفقیت انجام شد! حالا وارد شوید.', 'success');
        switchAuthForm('login');
      } catch (error) {
        showToast('خطایی در هنگام ثبت نام رخ داد. لطفا دوباره تلاش کنید.', 'error');
      }
  });

  forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('reset-email') as HTMLInputElement).value;
    if (!email) {
        showToast('لطفا ایمیل خود را وارد کنید.', 'error');
        return;
    }
    
    const users = await getUsers();
    const userExists = users.some(u => u.email === email);
    
    showToast('اگر این ایمیل در سیستم ما موجود باشد، لینک بازیابی برایتان ارسال خواهد شد.', 'success');
    await addActivityLog(`Password reset requested for email: ${email}. User exists: ${userExists}`);
    
    authTabs.style.display = 'flex';
    switchAuthForm('login');
  });

  // Add listeners for all password toggles
  document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
          const wrapper = toggle.closest('.password-wrapper');
          const input = wrapper?.querySelector('input');
          if (input) {
              if (input.type === 'password') {
                  input.type = 'text';
                  toggle.textContent = 'پنهان';
              } else {
                  input.type = 'password';
                  toggle.textContent = 'نمایش';
              }
          }
      });
  });
};

const getAuthModalCSS = (): string => {
  return `
  <style>
    #auth-modal .modal-content-inner {
      background-color: #2a2a2e;
      color: #fff;
      border-radius: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      border: 1px solid #444;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      padding: 0;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid #444;
      padding: 0 2rem;
    }
    .tabs .tab-btn {
      background: none;
      border: none;
      color: #888;
      padding: 0.8rem 1.2rem;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }
    .tabs .tab-btn.active {
      color: #00aaff;
      border-bottom-color: #00aaff;
    }
    .auth-form h2 {
      margin-top: 0;
      font-size: 1.8rem;
      text-align: center;
      color: #fff;
    }
    .auth-form p {
      text-align: center;
      color: #aaa;
      margin-bottom: 2rem;
    }
    .input-group {
      margin-bottom: 1.2rem;
    }
    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #ccc;
      font-size: 0.9rem;
    }
    .input-group input {
      width: 100%;
      padding: 0.8rem;
      background-color: #333;
      border: 1px solid #555;
      border-radius: 5px;
      color: #fff;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .password-wrapper {
        position: relative;
    }
    .password-wrapper input {
        padding-left: 4.5rem; /* Make space for the toggle button */
    }
    .password-toggle {
        position: absolute;
        left: 0.25rem;
        top: 50%;
        transform: translateY(-50%);
        background: #444;
        border: none;
        color: #ccc;
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
        border-radius: 3px;
        cursor: pointer;
    }
    .forgot-password-link, .back-to-login-link {
      display: block;
      text-align: right;
      font-size: 0.9rem;
      color: #00aaff;
      text-decoration: none;
      margin-bottom: 1.5rem;
    }
    .back-to-login-link {
        text-align: center;
        margin-top: 1.5rem;
        margin-bottom: 0;
    }
    .submit-btn {
      width: 100%;
      padding: 0.9rem;
      background-color: #00aaff;
      border: none;
      border-radius: 5px;
      color: #fff;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .submit-btn:hover {
      background-color: #0088cc;
    }
  </style>
  `;
};