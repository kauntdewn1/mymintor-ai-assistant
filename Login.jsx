// Ajustes sugeridos para garantir autenticação e persistência no Login.js e AuthContext:

// === LOGIN.JS ===
// Ajustar handleSubmit para salvar token no localStorage e acionar login do contexto:

const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');
  setLoading(true);

  try {
    if (email === 'netto@flowoff.xyz' && password === 'senha123') {
      const mockUser = { name: 'Netto Mello', email };
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userData', JSON.stringify(mockUser));
      onLogin?.();
      navigate('/');
    } else {
      setError('Email ou senha inválidos. Tente novamente.');
    }
  } catch (err) {
    setError('Erro ao tentar autenticar.');
  } finally {
    setLoading(false);
  }
};

// === AUTH CONTEXT ===
// Atualizar getCurrentUser e isAuthenticated do authService para funcionar com localStorage:

// services/api.js (mock)
export const authService = {
  getCurrentUser: () => {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('authToken'),
  login: async (email, password) => {
    // Simulação de API
    return {
      user: { name: 'Netto Mello', email },
      token: 'mock-token',
    };
  },
  register: async (data) => ({ user: data }),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }
};

// Isso garante que ao atualizar a página a autenticação se mantenha válida

// No App.js você já está usando:
// const { isAuthenticated, loading } = useAuth();
// ... está correto!

// ✅ Com isso, seu login, persistência e controle de rotas protegidas estarão funcionando corretamente com base no LocalStorage
