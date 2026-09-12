import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  authenticate,
  createSession,
  getUserByToken,
  destroySession,
  getUserById,
  getAllUsers,
  updateUser,
  createUser,
  deleteUser,
  saveUserFormulation,
  saveUserResponse,
  getAllUserResponses,
} from './server/userStore.js';
import { generateFloralFormulationForUser } from './server/gemini.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// AUTH MIDDLEWARES
// ==========================================

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No autorizado. Inicie sesión para continuar.' });
    return;
  }
  const token = authHeader.substring(7).trim();
  const user = getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: 'Sesión expirada o inválida. Por favor ingrese de nuevo.' });
    return;
  }
  (req as any).user = user;
  (req as any).token = token;
  next();
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user.role !== 'admin') {
      res.status(403).json({ error: 'Acceso restringido exclusivamente a Ronald (administrador).' });
      return;
    }
    next();
  });
}

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// POST /api/auth/login
// Identifies user manually without revealing user lists or accounts
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Por favor ingresa usuario y contraseña.' });
    return;
  }

  const user = authenticate(username, password);
  if (!user) {
    res.status(401).json({ error: 'Usuario o contraseña incorrectos. Verifica tus datos.' });
    return;
  }

  const token = createSession(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
  });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, (req, res) => {
  const token = (req as any).token;
  destroySession(token);
  res.json({ success: true, message: 'Sesión cerrada correctamente.' });
});

// ==========================================
// 2. USER INDIVIDUAL EXPERIENCE ENDPOINTS
// ==========================================

// GET /api/user/experience
// STRICT PRIVACY: Returns ONLY the authenticated user's content.
// Personal text is returned exactly as written by the administrator.
app.get('/api/user/experience', requireAuth, (req, res) => {
  const user = (req as any).user;
  const isPendingText =
    !user.personalText ||
    user.personalText.trim() === '' ||
    user.personalText.includes('[PENDIENTE');

  const isPendingProfiling =
    !user.profiling ||
    user.profiling.trim() === '' ||
    user.profiling.includes('[PENDIENTE');

  res.json({
    id: user.id,
    name: user.name,
    username: user.username,
    personalText: user.personalText || '',
    isPendingText,
    isPendingProfiling,
    theme: user.theme || {
      primaryColor: '',
      secondaryColor: '',
      backgroundColor: '',
      surfaceColor: '',
      textColor: '',
      accentColor: '',
      petalColors: [],
      fontStyle: 'serif',
      ambientGlow: '',
      themeName: '',
    },
    flowerConfig: user.flowerConfig || {
      specificInstructions: '',
      preferredTone: '',
      customFormulation: null,
    },
    savedFormulation: user.generatedFormulation || null,
    userResponse: user.userResponse || null,
  });
});

// POST /api/user/response
// Users submit their own personal response to their experience
// PRIVACY & IMMUTABILITY: Only saved to the authenticated user once. Permanent lock after submission.
app.post('/api/user/response', requireAuth, (req, res) => {
  const user = (req as any).user;

  // STRICT IMMUTABILITY CHECK:
  if (user.userResponse && user.userResponse.text && user.userResponse.text.trim().length > 0) {
    res.status(403).json({
      error: 'Tu respuesta ya fue enviada y se encuentra bloqueada de forma permanente. No es posible modificarla ni reemplazarla.',
    });
    return;
  }

  const { responseText } = req.body;
  if (!responseText || typeof responseText !== 'string' || !responseText.trim()) {
    res.status(400).json({ error: 'Por favor escribe un mensaje antes de enviar tu respuesta.' });
    return;
  }

  const saved = saveUserResponse(user.id, responseText);
  if (!saved) {
    res.status(500).json({ error: 'No se pudo guardar la respuesta.' });
    return;
  }

  res.json({ success: true, userResponse: saved });
});

// POST /api/flowers/formulate
// Calls Gemini with ONLY this user's profiling and floral instructions
app.post('/api/flowers/formulate', requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const formulation = await generateFloralFormulationForUser(user);
    saveUserFormulation(user.id, formulation);
    res.json({ formulation });
  } catch (err: any) {
    console.warn('[Server] Error generating formulation:', err?.message || err);
    res.status(500).json({
      error: 'Hubo un inconveniente al generar la formulación floral.',
      details: err?.message,
    });
  }
});

// POST /api/flowers/reset
app.post('/api/flowers/reset', requireAuth, (req, res) => {
  const user = (req as any).user;
  updateUser(user.id, { generatedFormulation: null });
  res.json({ success: true });
});

// ==========================================
// 3. ADMINISTRATOR ENDPOINTS (RONALD ONLY)
// ==========================================

// GET /api/admin/users
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const allUsers = getAllUsers();
  res.json({ users: allUsers });
});

// GET /api/admin/responses
// Exclusive to Ronald: view all user responses with user details
app.get('/api/admin/responses', requireAdmin, (req, res) => {
  const responses = getAllUserResponses();
  res.json({ responses });
});

// PUT /api/admin/user/:id
app.put('/api/admin/user/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const {
    name,
    passwordPlain,
    isActive,
    profiling,
    personalText,
    theme,
    flowerConfig,
    role,
    userResponse,
  } = req.body;

  const existing = getUserById(id);
  if (!existing) {
    res.status(404).json({ error: 'Usuario no encontrado.' });
    return;
  }

  const updates: any = {};
  if (typeof name === 'string') updates.name = name;
  if (typeof passwordPlain === 'string') updates.passwordPlain = passwordPlain;
  if (typeof isActive === 'boolean') updates.isActive = isActive;
  if (typeof profiling === 'string') updates.profiling = profiling;
  if (typeof personalText === 'string') updates.personalText = personalText;
  if (theme && typeof theme === 'object') updates.theme = theme;
  if (flowerConfig && typeof flowerConfig === 'object') updates.flowerConfig = flowerConfig;
  if (role === 'user' || role === 'admin') updates.role = role;
  if (userResponse !== undefined) updates.userResponse = userResponse;

  const updated = updateUser(id, updates);
  res.json({ user: updated });
});

// POST /api/admin/user
app.post('/api/admin/user', requireAdmin, (req, res) => {
  const { name, username, passwordPlain, profiling, personalText, theme, flowerConfig, role } = req.body;
  if (!name || !username || !passwordPlain) {
    res.status(400).json({ error: 'Nombre, usuario y contraseña son requeridos.' });
    return;
  }

  const cleanId = username.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const existing = getUserById(cleanId);
  if (existing) {
    res.status(409).json({ error: 'Ya existe un usuario con este identificador.' });
    return;
  }

  const newUser = createUser({
    id: cleanId,
    name,
    username,
    role: role === 'admin' ? 'admin' : 'user',
    isActive: true,
    profiling: profiling || '',
    personalText: personalText || '',
    theme: theme || {
      primaryColor: '',
      secondaryColor: '',
      backgroundColor: '',
      surfaceColor: '',
      textColor: '',
      accentColor: '',
      petalColors: [],
      fontStyle: 'serif',
      ambientGlow: '',
      themeName: '',
    },
    flowerConfig: flowerConfig || {
      specificInstructions: '',
      preferredTone: '',
      customFormulation: null,
    },
    generatedFormulation: null,
    userResponse: null,
  });

  res.status(201).json({ user: newUser });
});

// DELETE /api/admin/user/:id
app.delete('/api/admin/user/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  if (id.toLowerCase() === 'ronald') {
    res.status(400).json({ error: 'No se puede eliminar la cuenta principal de Ronald.' });
    return;
  }
  const ok = deleteUser(id);
  if (!ok) {
    res.status(404).json({ error: 'Usuario no encontrado.' });
    return;
  }
  res.json({ success: true, message: 'Usuario eliminado correctamente.' });
});

// DELETE /api/admin/response/:userId
// Ronald is the only authorized role to delete user responses
app.delete('/api/admin/response/:userId', requireAdmin, (req, res) => {
  const { userId } = req.params;
  const user = getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado.' });
    return;
  }

  updateUser(userId, { userResponse: null });
  res.json({ success: true, message: `Respuesta de ${user.name} eliminada.` });
});

// ==========================================
// 4. VITE & STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
