const   express = require("express"),
        router = express.Router();
    
const User = require("../../../model/User");

const auth = require("../../../middleware/auth");

router.get('/:userId', auth, async (req, res) => {
    let {userId} = req.params;
    try {
        const user = await User.findById(userId);

        const { followers } = user || [];
        let newFollowers = [];

        for(const [key, follower] of followers.entries()) {
            const userFollower = await User.findById(follower.userId);
            if(user !== null) {
                newFollowers[key] = {
                    "userId": follower.userId,
                    "username": userFollower.username
                };
            }
        }

        res.send([...newFollowers]);

    } catch (e) {
        res.status(401).json({ 
            type: "fetch",
            message: "Error in Fetching user" 
        });
    }
});


module.exports = router;