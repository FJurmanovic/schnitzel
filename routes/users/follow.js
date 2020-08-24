const   express = require("express"),
        router = express.Router();

const User = require("../../model/User");

const auth = require("../../middleware/auth");

router.put('/:userId', auth, async (req, res) => {
    const {user: {id}, params: {userId}} = req;
    try {
        const user = await User.findOne({"_id": id, 'following.userId': userId}).exec();
        
        if(!user) {
            const checkExist = await User.find({"$or": [{"_id": id}, {"_id": userId}]}).count();
            if(checkExist == 2) {
                await Promise.all([User.findByIdAndUpdate(id, { "$push": { "following": {"userId": userId} } }), User.findByIdAndUpdate(userId, { "$push": { "followers": { "userId": id } } })]);
                res.send("Follower added");
                return;
            } else {
                res.send("User does not exist");
                return;
            }
        }

        res.send("Already following");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding point");
    }
});

router.delete("/:userId", auth, async (req, res) => {    
    const {user: {id}, params: {userId}} = req;
    try {
        const user = await User.findOne({"_id": id, 'following.userId': userId}).exec();
        
        if(!!user) {
            const checkExist = await User.find({"$or": [{"_id": id}, {"_id": userId}]}).count();
            if(checkExist == 2) {
                await Promise.all([User.findByIdAndUpdate(id, { "$pull": { "following": {"userId": userId} } }), User.findByIdAndUpdate(userId, { "$pull": { "followers": { "userId": id } } })]);
                res.send("Follower removed");
                return;
            } else {
                res.send("User does not exist");
                return;
            }
        }

        res.send("Not following");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding point");
    }
})

module.exports = router;