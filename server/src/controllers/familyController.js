export const createFamily = (req, res) => {
  res.json({
    message: `Family created successfully by ${req.user.name} (${req.user.role})`,
  });
};
