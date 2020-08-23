const   express = require("express"),
        router = express.Router();

const Post = require("../../model/Post");

const auth = require("../../middleware/auth");

router.put('/:postId', auth, async (req, res) => {
    const {user: {id}, body: {type, userId}, params: {postId}} = req;
    try {
        let partOf = await Post.find({"_id": postId, 'points.userId': id}).count();
        if (!partOf || partOf < 1) {
            if(type === "post"){
                await Post.findByIdAndUpdate(postId, { $push: { points: { "userId": id } }});
            }
        } else {
            res.send("Could not add point");
            return;
        }

        res.send("Added point");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding point");
    }
});

router.delete("/:postId", auth, async (req, res) => {    
    const {user: {id}, body: {type, userId}, params: {postId}} = req;
    try {
        let partOf = await Post.find({"_id": postId, 'points.userId': id}).count();
        if(partOf || partOf > 0) {
            if(type === "post"){
                await Post.findByIdAndUpdate(postId, { $pull: { points: { "userId": id } }});
            }
        } else {
            res.send("Could not remove point");
            return;
        }

        res.send("Removed point");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error removing point");
    }
})

module.exports = router;