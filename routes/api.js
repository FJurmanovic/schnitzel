const   express = require("express"),
        router = express.Router();

const   users = require("./users"),
        posts = require("./posts");

router.get('/', (_, res) => {
    res.json({"API": "Works"});
});

router.use('/user', users);
router.use('/posts', posts)

module.exports = router;