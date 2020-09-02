const   express = require("express"),
        router = express.Router();

const Post = require("../../model/Post");
const User = require("../../model/User");

const auth = require("../../middleware/auth");

router.get('/', auth, async (req, res) => {
    let page = Number(req.query.page) || 1,
        ppp = Number(req.query.ppp) || 10,
        type = req.query.type || "comment",
        postId = req.query.postId || null,
        commentId = req.query.commentId || null,
        firstDate = req.query.firstDate || Date.now();

    try{
        let options = {},
            user = [];

        if (type === "comment") {
            options = {
                '_id': postId,
                'comments.createdAt': {"$lte": firstDate}
            }
        } else if (type === "reply") {
            options = {
                "_id": postId,
                'comments._id': commentId,
                'comments.reply.createdAt': {"$lte": firstDate}
            };
        } 
        const post = await Post.findOne(options).sort('-createdAt');


        let items = [];
        let total = 0;
        if(post && type === "comment") {
            total = post.comments.length;
            let limit = 0;
            for (const [key, comment] of post.comments.entries()) {
                if(key < (page - 1) * ppp) continue;
                limit++;
                if(limit > ppp) break;
                const item = await Items(comment, req.user.id);
                items.push(item);
            }
        } else if(post && type === "reply") {
            let replies = post.comments.filter(comment => comment._id == commentId)[0].reply || [];
            total = replies.length;
            let limit = 0;
            for (const [key, reply] of replies.entries()) {
                if(key < (page - 1) * ppp) continue;
                limit++;
                if(limit > ppp) break;
                const item = await Items(reply, req.user.id);
                items.push(item);
            }
        }
        res.json({
            "page": page,
            "ppp": ppp,
            "total": total,
            "items": items
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching");
    }
});

router.post('/', auth, async (req, res) => {
    const {user: {id}, body: {type, comment, postId, commentId}} = req;
    try{
        let points = [];

        if (type === "reply") {
            await Post.updateOne({_id: postId, 'comments._id': commentId}, { $addToSet: { 'comments.$.reply': {"userId": id, "comment": comment, "points": points} } }); //Adds new reply list to comment if commentId is present in req.body 
            res.status(200).send("Added reply");
            return;

        } else if (type === "comment") {
            await Post.findByIdAndUpdate(postId, { $push: { comments: {"userId": id, "comment": comment, "points": points}}}); //If there is no commentId, adds new comments list
            res.status(200).send("Added comment");
            return;
        }
            
        res.send("Comment not added");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching");
    }
});

router.delete('/', auth, async (req, res) => {
    const {user: {id}, body: {type, postId, commentId, replyId}} = req;
    try {
        let pst = null;
        if (type === "reply") {
            pst = await Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, "userId": id } } } } }, { $set: {'comments.$[comment].reply.$[repl].comment': "[ Reply deleted ]", 'comments.$[comment].reply.$[repl].isDeleted': true} }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] });
        } else if (type === "comment") {
            pst = await Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, "userId": id }}}, { $set: {'comments.$[comment].comment': "[ Comment deleted ]", 'comments.$[comment].isDeleted': true} }, { arrayFilters: [{ 'comment._id': commentId }] });
        }
        console.log(pst);
        res.status(200).send("Succesfully deleted comment")
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching");
    }
})

router.put('/', auth, async (req, res) => {
    const {user: {id}, body: {type, comment, postId, commentId, replyId}} = req;
    try{
        let points = [];

        if (type === "reply") {
            await Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, reply: {$elemMatch: { "_id": replyId, "userId": id, "isDeleted": {$ne: true} } } } } }, { $set: { 'comments.$[comment].reply.$[repl].comment': comment, 'comments.$[comment].reply.$[repl].updatedAt': new Date() } }, { arrayFilters: [{ 'comment._id': commentId }, { 'repl._id': replyId }] }); //Adds new reply list to comment if commentId is present in req.body 
            res.status(200).send("Succesfully edited reply");
            return;

        } else if (type === "comment") {
            await Post.findOneAndUpdate({"_id": postId, comments: {$elemMatch: { "_id": commentId, "userId": id }}}, { $set: {'comments.$[comment].comment': comment, 'comments.$[comment].updatedAt': new Date()} }, { arrayFilters: [{ 'comment._id': commentId }] }); //If there is no commentId, adds new comments list
            res.status(200).send("Succesfully edited comment");
            return;
        }
            
        res.send("Comment not added");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching");
    }
});

module.exports = router;

async function Items(object, userId) {
    let user = await User.findById(object.userId);
    if(!user){
        user= {"username": "DeletedUser"}
    }
    function constructor() {
        this.id = object._id;
        this.comment = object.comment;
        this.username = user.username;
        if (object.reply) this.replies = object.reply.length || 0;
        this.isPointed = object.points.filter(x => x.userId == userId).map(x => x.userId == userId)[0] || false;
        this.isDeleted = object.isDeleted || false;
        this.points = object.points.length;
        this.userId = object.userId;
        this.createdAt = object.createdAt;
        if(!object.updatedAt){
            this.timeAgo = "Posted " + timeSince(object.createdAt);
        } else {
            this.timeAgo = "Posted " + timeSince(object.createdAt) + ` <i>(Edited)</i>`;
        }
    }
    
    return new constructor;
}

function timeSince(datetime) {
    var seconds = Math.floor((new Date() - datetime) / 1000);
    let time = null;
    if((time = Math.floor(seconds / 60 / 60 / 24 / 30 / 12)) > 1){
        return `${time} years ago.`
    }else if ((time = Math.floor(seconds / 60 / 60 / 24 / 30)) > 1){
        return `${time} months ago.`
    }else if ((time = Math.floor(seconds / 60 / 60 / 24)) > 1){
        return `${time} days ago.`
    }else if ((time = Math.floor(seconds / 60 / 60)) > 1){
        return `${time} hours ago.`
    }else if ((time = Math.floor(seconds / 60)) > 1) {
        if (time >= 30) {
            return "30 minutes ago."
        }else if (time >= 15) {
            return "15 minutes ago."
        }else{
            return "few minutes ago"
        }
    }else {
        return "few seconds ago"
    }
}