const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) return res.status(403).send("Permission denied.");
    next();
  };
  
  module.exports = roleMiddleware;
  