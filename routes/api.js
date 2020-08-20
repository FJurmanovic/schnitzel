const   express = require("express"),
        router = express.Router();

const users = require("./users");

router.get('/', (_, res) => {
    res.json({"API": "Works"});
});

router.use('/user', users);

module.exports = router;