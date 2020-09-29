const   express = require("express"),
        router = express.Router();

const   users = require("./users"),
        posts = require("./posts"),
        image = require("./image"),
        search = require("./search");

router.get('/', (_, res) => {
    res.json({"API": "Works"});
});

router.use('/user', users);
router.use('/posts', posts);
router.use('/image', image);
router.use('/search', search);

module.exports = router; 