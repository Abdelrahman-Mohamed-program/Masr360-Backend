const http = require("http");
const notFound = (req, res, next) => {
  const err = new Error("please check the route and the method");
  err.status = 404;
  next(err);
};

const errorHandler = (err, req, res, next) => {
  let errors;

  //handling mongoose validation errors
  if (err.name == "ValidationError") {
    errors = {};
    err.status = 400;
    err.message = "validation failed";
    for (const field in err.errors) {
      if (err.errors[field].name === "CastError") {
       errors[field] = `Invalid value of '${err.errors[field].value}' for '${err.errors[field].path}' field`;
        continue;
      }
      errors[field] = err.errors[field].message;
    }
  } else if (err.name == "CastError") {
    err.message = `Invalid value of '${err.value}' for '${err.path}' field`;
  }
  // } else if (err.code == 11000) {
  // err.status = 400;
  //   const field = Object.keys(err.errorResponse.keyValue);
  //   if (field == "email") {
  //     err.message = "user already registered";
  //   }
  // }
  const status = err.status || 500;

  res.status(status).json({
    error: http.STATUS_CODES[status],
    message: err.message || "Something went wrong",
    errors,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
