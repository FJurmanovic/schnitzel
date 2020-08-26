const   express = require("express"),
        router = express.Router();

const Post = require("../../model/Post");

const auth = require("../../middleware/auth");

router.put('/:postId', auth, async (req, res) => {
    const {user: {id}, body: {type, commentId, replyId}, params: {postId}} = req;
    try {
        if(type === "post") {
            let partOf = await Post.find({"_id": postId, 'points.userId': id}).count();
            if (!partOf || partOf < 1) {
                await Post.findByIdAndUpdate(postId, { $push: { points: { "userId": id } }});
            }
        } else if (type === "comment") {
            let partOf = await Post.find({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': id }} }).count();
            if (!partOf || partOf < 1) {
                await Post.findByIdAndUpdate({_id: postId}, { $addToSet: { 'comments.$[comment].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }] });
            }
        } else if (type === "reply") {
            let partOf = await Post.find({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': id } } }} }).count();
            if (!partOf || partOf < 1) {
                await Post.findByIdAndUpdate({_id: postId}, { $addToSet: { 'comments.$[comment].reply.$[repl].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] });
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
    const {user: {id}, body: {type, commentId, replyId}, params: {postId}} = req;
    try {
        if(type === "post") {
            let partOf = await Post.find({"_id": postId, 'points.userId': id}).count();
            if (partOf || partOf > 0) {
                await Post.findByIdAndUpdate(postId, { $pull: { points: { "userId": id } }});
            }
        } else if (type === "comment") {
            let partOf = await Post.find({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': id }} }).count();
            if (partOf || partOf > 0) {
                await Post.findByIdAndUpdate({_id: postId}, { $pull: { 'comments.$[comment].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }] });
            }
        } else if (type === "reply") {
            let partOf = await Post.find({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': id } } }} }).count();
            if (partOf || partOf > 0) {
                await Post.findByIdAndUpdate({_id: postId}, { $pull: { 'comments.$[comment].reply.$[repl].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] });
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