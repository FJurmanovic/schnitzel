const   express = require("express"),
        router = express.Router();

const   login = require("./login"),
        data = require("./data"),
        register = require("./register");

router.get('/', (_, res) => {
    res.json({"Users": "Works"});
});

router.use('/login', login);

router.use('/data', data);

router.use('/register', register);

module.exports = router;