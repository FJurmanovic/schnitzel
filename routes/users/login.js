const   express = require("express"),
        router = express.Router();

router.post('/', (req, res) => {
    const {email, password} = req.body;
    try {
        res.send("Login");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;