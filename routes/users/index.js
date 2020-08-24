const   express = require("express"),
        router = express.Router();

const   login = require("./login"),
        data = require("./data"),
        register = require("./register"),
        follow = require("./follow");

router.get('/', (_, res) => {
    res.json({"Users": "Works"});
});

router.use('/login', login);

router.use('/data', data);

router.use('/register', register);

router.use('/follow', follow);

module.exports = router;