// Ajustes finais para o fluxo completo com API real usando axios (já implementado)

// === LOGIN.JS ===
// handleSubmit agora deve chamar o contexto de autenticação real:

const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');
  setLoading(true);

  try {
    const { token, user } = await login(email, password); // do contexto
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    navigate('/');
  } catch (err) {
    setError('Email ou senha inválidos ou erro na autenticação.');
  } finally {
    setLoading(false);
  }
};

// === AUTH CONTEXT ===
// já está chamando corretamente:
// authService.login(email, password) => que usa o axios configurado com interceptors

// === API.JS ===
// Seu api.js está completo, inclui interceptors + authService real:
// login, logout, register, getCurrentUser, isAuthenticated

// Interceptor do axios já cuida da expiração de token (401) e redireciona para /login automaticamente

// ✅ Resultado esperado:
// - Login real via /auth/login
// - Token salvo e usado em todas as requisições
// - Autenticação persistente via localStorage
// - Navegação segura e protegida com base no contexto de autenticação
