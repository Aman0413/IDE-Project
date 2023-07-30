const { runCode } = require("../controllers/codeController");

const router = require("express").Router();

router.post("/run", runCode);
module.exports = router;
