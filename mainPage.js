const mainPageHandler = (req, res, next) => {
  const { pathname } = req.url;
  if (pathname === '/') {
    res.statusCode = 302;
    res.setHeader('Location', 'index.html');
    res.end();
    return;
  }
  next();
};

module.exports = { mainPageHandler };
