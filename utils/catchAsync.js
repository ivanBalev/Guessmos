module.exports = (func) => {
  return (req, res, next) => {
    func(req, res)
      // using just next as argument triggers error handling
      .then(() => next())
      .catch(next);
  };
};
