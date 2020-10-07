const   express = require("express"),
        router = express.Router();

const Post = require("../../model/Post");

const auth = require("../../middleware/auth");
const User = require("../../model/User");
const { Query } = require("mongoose");

router.put('/:postId', auth, async (req, res) => {
    const {user: {id}, body: {type, commentId, replyId}, params: {postId}} = req;
    try {
        if(req.user.id === "anonymous") return res.send("Could not add point");
    	let pst = null;
        if(type === "post") {
            pst = await Post.findOneAndUpdate({"_id": postId, 'points.userId': {$ne: id}}, { $addToSet: { points: { "userId": id } }});
            await User.findOneAndUpdate({"_id": pst.userId}, { $inc: {"points": 1 }});
        } else if (type === "comment") {
            pst = await Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': {$ne: id} }} }, { $addToSet: { 'comments.$[comment].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }] });
            let uid = pst.comments.filter(x => x["_id"] == commentId)[0].userId;
            await User.findOneAndUpdate({"_id": uid}, { $inc: {"points": 1 }});
        } else if (type === "reply") {
            pst = await Post.findByIdAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': {$ne: id} } } }}}, { $addToSet: { 'comments.$[comment].reply.$[repl].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] });
            let uid = pst.comments.filter(x => x["_id"] == commentId)[0].reply.filter(x => x["_id"] == replyId)[0].userId;
            await User.findOneAndUpdate({"_id": uid}, { $inc: {"points": 1 }});
        } else {
            res.send("Could not add point");
            return;
        }
        if (!pst) {
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
        if(req.user.id === "anonymous") return res.send("Could not remove point");
        if(type === "post") {
            pst = await Post.findOneAndUpdate({"_id": postId, 'points.userId': id}, { $pull: { points: { "userId": id } }});
            await User.findOneAndUpdate({"_id": pst.userId}, { $inc: {"points": -1 }});
        } else if (type === "comment") {
            pst = await Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': id }} }, { $pull: { 'comments.$[comment].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }] });
            let uid = pst.comments.filter(x => x["_id"] == commentId)[0].userId;
            await User.findOneAndUpdate({"_id": uid}, { $inc: {"points": -1 }});
        } else if (type === "reply") {
            pst = await Post.findByIdAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': id } } }}}, { $pull: { 'comments.$[comment].reply.$[repl].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] });
            let uid = pst.comments.filter(x => x._id == commentId)[0].reply.filter(x => x._id == replyId)[0].userId;
            await User.findOneAndUpdate({"_id": uid}, { $inc: {"points": -1 }});
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