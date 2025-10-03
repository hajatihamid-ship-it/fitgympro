
<script lang="ts">
  let isLogin = true; // true for Login, false for Sign Up

  function toggleMode() {
    isLogin = !isLogin;
  }
</script>

<div class="modal-backdrop">
  <div class="modal-content">
    <div class="tabs">
      <button class:active={isLogin} on:click={() => isLogin = true}>ورود</button>
      <button class:active={!isLogin} on:click={() => isLogin = false}>ثبت نام</button>
    </div>

    {#if isLogin}
      <form class="auth-form" on:submit|preventDefault>
        <h2>خوش آمدید!</h2>
        <p>برای ادامه وارد حساب کاربری خود شوید.</p>
        <div class="input-group">
          <label for="email">ایمیل</label>
          <input type="email" id="email" placeholder="example@email.com" required />
        </div>
        <div class="input-group">
          <label for="password">رمز عبور</label>
          <input type="password" id="password" placeholder="••••••••" required />
        </div>
        <a href="/forgot-password" class="forgot-password">رمز عبور را فراموش کرده‌اید؟</a>
        <button type="submit" class="submit-btn">ورود</button>
      </form>
    {:else}
      <form class="auth-form" on:submit|preventDefault>
        <h2>حساب کاربری جدید بسازید</h2>
        <p>برای دسترسی به امکانات ویژه ثبت نام کنید.</p>
        <div class="input-group">
          <label for="new-email">ایمیل</label>
          <input type="email" id="new-email" placeholder="example@email.com" required />
        </div>
        <div class="input-group">
          <label for="new-password">رمز عبور</label>
          <input type="password" id="new-password" placeholder="حداقل ۸ کاراکتر" required />
        </div>
         <div class="input-group">
          <label for="confirm-password">تکرار رمز عبور</label>
          <input type="password" id="confirm-password" placeholder="تکرار رمز عبور" required />
        </div>
        <button type="submit" class="submit-btn">ثبت نام</button>
      </form>
    {/if}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background-color: #2a2a2e;
    color: #fff;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .tabs {
    display: flex;
    border-bottom: 1px solid #444;
    margin-bottom: 1.5rem;
  }
  .tabs button {
    background: none;
    border: none;
    color: #888;
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border-bottom: 2px solid transparent;
  }
  .tabs button.active {
    color: #00aaff;
    border-bottom-color: #00aaff;
  }
  .auth-form h2 {
    margin-top: 0;
    font-size: 1.8rem;
    text-align: center;
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
  }
  .input-group input {
    width: 100%;
    padding: 0.8rem;
    background-color: #333;
    border: 1px solid #555;
    border-radius: 5px;
    color: #fff;
    font-size: 1rem;
  }
  .forgot-password {
    display: block;
    text-align: right;
    font-size: 0.9rem;
    color: #00aaff;
    text-decoration: none;
    margin-bottom: 1.5rem;
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
