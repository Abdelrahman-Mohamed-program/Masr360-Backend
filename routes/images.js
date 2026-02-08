const express = require('express');
const router = express.Router();
const {destroy} = require("../controllers/images.controller")

router.delete("/:id",destroy);
module.exports = router;