const   express = require("express"),
        router = express.Router();

const   login = require("./login");

router.get('/', (_, res) => {
    res.json({"Users": "Works"});
});

router.use('/login', login);

module.exports = router;