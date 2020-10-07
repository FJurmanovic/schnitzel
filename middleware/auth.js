const jwt_decode = require("jwt-decode");

module.exports = function(req, res, next) {
  let token = req.header("token");
  if (!token) next();

  try {
    const decoded = jwt_decode(token);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    req.user = { id: "anonymous" }
    next();
  }
};