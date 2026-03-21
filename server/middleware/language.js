module.exports = function (req, res, next) {
  // Check ?lang= query param first
  if (req.query.lang) {
    req.lang = req.query.lang.toLowerCase() === 'tr' ? 'tr' : 'en';
    return next();
  }
  
  // Fallback to Accept-Language header
  const acceptLang = req.headers['accept-language'];
  if (acceptLang) {
    req.lang = acceptLang.toLowerCase().includes('tr') ? 'tr' : 'en';
    return next();
  }

  // Default to English
  req.lang = 'en';
  next();
};
