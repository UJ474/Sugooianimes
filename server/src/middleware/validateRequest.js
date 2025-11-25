const { ZodError } = require("zod");

module.exports = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Validate request body
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors.map(e => ({
          path: e.path.join("."),
          message: e.message
        }))
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};