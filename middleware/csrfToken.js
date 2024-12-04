import csrf from 'csurf';

// Configura CSRF protection con cookies
const csrfProtection = csrf({ cookie: true });

// Middleware para configurar el token CSRF
const setCsrfToken = (req, res, next) => {
  // Asegúrate de que csrfProtection esté activo antes de acceder al token
  csrfProtection(req, res, () => {
    res.cookie('XSRF-TOKEN', req.csrfToken());  // Establece el token en la cookie
    res.json({ csrfToken: req.csrfToken() });   // Devuelve el token en el cuerpo de la respuesta
  });
};

// Middleware CSRF (se puede aplicar a las rutas donde se necesita protección CSRF)
const csrfMiddleware = (req, res, next) => {
  csrfProtection(req, res, next);  // Aplica CSRF a las rutas protegidas
};

export default { setCsrfToken, csrfMiddleware };
