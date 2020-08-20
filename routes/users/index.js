const   express = require("express"),
        router = express.Router();

const   login = require("./login"),
        data = require("./data");

router.get('/', (_, res) => {
    res.json({"Users": "Works"});
});

router.use('/login', login);

router.use('/data', data);

module.exports = router;