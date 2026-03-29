const adminOnly = (req, res, next) => {
  console.log("user from token:", req.user);
  if (req.user && req.user.role==="admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = adminOnly;
