document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('tokenCreatedAt', Date.now());
      window.location.href = './posts.html';
    } else {
      throw new Error(data.message || 'Erro ao fazer login.');
    }
  } catch (err) {
    document.getElementById('login-error').textContent = err.message;
  }
});