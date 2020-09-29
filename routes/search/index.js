const   express = require("express"),
        router = express.Router(),
        { check, validationResult} = require("express-validator"),
        path = require("path"),
        sharp = require("sharp");

const User = require("../../model/User");
const Post = require("../../model/Post");

const auth = require("../../middleware/auth");

router.get('/', async (req, res) => {
    const {query: {searchQuery}} = req;
    try {
        const query = new RegExp(`^${searchQuery}`, "i");
        const post = await Post.find({"title": {$regex: query}}).limit(5);
        const user = await User.find({"username": {$regex: query}}).limit(5);

        let items = [...post, ...user];

        items = items.sort((a,b) => (a.title > b.title || a.username > b.username || a.title > b.username || a.username > b.title) ? 1 : -1)
                     .map(val => ({title: val.title || val.username, id: val.id, type: val.title ? "post" : "user" }));

        res.json(
            {
                items,
                total: items.length || 0
            }
        );
    } catch (e) {
        res.status(500).send("Error fetching");
    }
});

module.exports = router;