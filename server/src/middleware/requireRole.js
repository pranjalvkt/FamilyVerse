export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user; // set from auth middleware / JWT decode

      if (!user)
        return res.status(401).json({ error: "Unauthorized: no user found" });

      if (!allowedRoles.includes(user.role))
        return res.status(403).json({ error: "Forbidden: insufficient access" });

      next();
    } catch (err) {
      res.status(500).json({ error: "Role validation failed" });
    }
  };
};
