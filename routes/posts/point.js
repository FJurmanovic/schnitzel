const   express = require("express"),
        router = express.Router();

const Post = require("../../model/Post");

const auth = require("../../middleware/auth");
const User = require("../../model/User");

router.put('/:postId', auth, async (req, res) => {
    const {user: {id}, body: {type, commentId, replyId}, params: {postId}} = req;
    try {
        if(req.user.id === "anonymous") return res.send("Could not add point");
    	let pst = null;
        if(type === "post") {
            pst = await Post.findOne({"_id": postId, 'points.userId': {$ne: id}});
            if(pst) await Promise.all([
                Post.findOneAndUpdate({"_id": postId, 'points.userId': {$ne: id}}, { $addToSet: { points: { "userId": id } }}), 
                User.findOneAndUpdate({"_id": pst.userId}, { $inc: {"points": 1 }})
            ]);
        } else if (type === "comment") {
            pst = await Post.findOne({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': {$ne: id} }} });
            let filteredPost = pst.comments.filter(x => x["_id"] == commentId)[0].userId;
            let uid = filteredPost.userId;
            if(filteredPost && !filteredPost.isDeleted) await Promise.all([
                Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': {$ne: id} }} }, { $addToSet: { 'comments.$[comment].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }] }),
                User.findOneAndUpdate({"_id": uid}, { $inc: {"points": 1 }})
            ]);
        } else if (type === "reply") {
            pst = await Post.findOne({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': {$ne: id} } } }}});
            let filteredPost = pst.comments.filter(x => x["_id"] == commentId)[0].reply.filter(x => x["_id"] == replyId)[0];
            let uid = filteredPost.userId;
            if(filteredPost && !filteredPost.isDeleted) await Promise.all([
                Post.findByIdAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': {$ne: id} } } }}}, { $addToSet: { 'comments.$[comment].reply.$[repl].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] }),
                User.findOneAndUpdate({"_id": uid}, { $inc: {"points": 1 }})
            ]);
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
        let pst = null;
        if(type === "post") {
            pst = await Post.findOne({"_id": postId, 'points.userId': id});
            if (pst) await Promise.all([
                Post.findOneAndUpdate({"_id": postId, 'points.userId': id}, { $pull: { points: { "userId": id } }}),
                User.findOneAndUpdate({"_id": pst.userId}, { $inc: {"points": -1 }})
            ]);
        } else if (type === "comment") {
            pst = await Post.findOne({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': id, "isDeleted": {$ne: true} }} });
            let filteredPost = pst.comments.filter(x => x["_id"] == commentId)[0].userId;
            let uid = filteredPost.userId;
            if (filteredPost && !filteredPost.isDeleted) await Promise.all([
                Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, 'points.userId': id, "isDeleted": {$ne: true} }} }, { $pull: { 'comments.$[comment].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }] }),
                User.findOneAndUpdate({"_id": uid}, { $inc: {"points": -1 }})
            ]);
        } else if (type === "reply") {
            pst = await Post.findByIdAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': id } } }}});
            let filteredPost = pst.comments.filter(x => x._id == commentId)[0].reply.filter(x => x._id == replyId)[0].userId;
            let uid = filteredPost.userId;
            if (filteredPost && !filteredPost.isDeleted) await Promise.all([
                Post.findByIdAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, 'points.userId': id } } }}}, { $pull: { 'comments.$[comment].reply.$[repl].points': {"userId": id} } }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] }),
                User.findOneAndUpdate({"_id": uid}, { $inc: {"points": -1 }})
            ]);
        } else {
            res.send("Could not remove point");
            return;
        }
        if (!pst) {
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