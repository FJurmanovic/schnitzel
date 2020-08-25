const   express = require("express"),
        router = express.Router(),
        { check, validationResult} = require("express-validator");

const User = require("../../model/User");
const Post = require("../../model/Post");

const auth = require("../../middleware/auth");

const point = require("./point");

router.use("/point", point);

router.get('/', auth, async (req, res) => {
    let page = Number(req.query.page) || 1,
        ppp = Number(req.query.ppp) || 10,
        type = req.query.type || "feed",
        category = req.query.category || "all"
        profileId = req.query.profileId || req.user.id
        firstDate = req.query.firstDate || Date.now();

    try{
        let options = {},
            user = [];

        if (type === "feed") {
            user = await User.findById(req.user.id);
            const following = [req.user.id, ...user.following.map((x) => x.userId)];
            options = {
                "userId": {"$in": following}
            }
        } else if (type === "profile") {
            user = await User.findById(profileId);
            const followers = [...user.followers.map((x) => x.userId)];
            if (followers.indexOf(req.user.id, 0) != -1 || !user.isPrivate){
                options = {
                    "userId": profileId,
                    "isPrivate": false
                };
            } else {
                res.status(403).send({"message": "Error getting posts", "status": 403});
            }
        } else if (type === "explore") {
            if (category === "all") { 
                options = {
                    "isPrivate": false
                }
            } else {
                options = {
                    "isPrivate": false,
                    "categories": category
                }
            }
        }
        options.createdAt = {"$lte": firstDate}; 
        const [posts, total] = await Promise.all([Post.find(options).skip((page - 1) * ppp).limit(ppp).sort('-createdAt'), Post.find(options)]);
        let items = [];
        for (post of posts) {
            const item = await Items(post, req.user.id);
            items.push(item);
        }
        res.json({
            "page": page,
            "ppp": ppp,
            "total": total.length,
            "items": items
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching");
    }
});

router.post('/', auth, 
    [
        check("title", "Please Enter a Valid Title") //Checks if title is empty
        .not()
        .isEmpty(),
        check("description", "Please enter a valid description").not() //Checks if description is empty
        .isEmpty()
    ],
    async (req, res) => {
        const { title, type, isPrivate, hasPhoto, photoExt, description, categories, ingredients, directions } = req.body;
        try { 
            let points = [];
            const userId = req.user.id;
            if(type === "post"){
                post = new Post({ //Creates new post in database without ingredients and directions
                    title,
                    type,
                    isPrivate,
                    hasPhoto,
                    photoExt,
                    description,
                    categories,
                    points,
                    userId
                });
            }else if(type === "recipe"){
                let newIngredients = [];
                newIngredients = ingredients.filter(x => !!x.name);
                post = new Post({ //Creates new post in database with ingredients and directions
                    title,
                    type,
                    isPrivate,
                    hasPhoto,
                    photoExt,
                    description,
                    categories,
                    points,
                    userId,
                    "ingredients": newIngredients,
                    directions
                })
            }
            post.createdAt = new Date();

            await post.save();

            res.send({id: post.id})
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
        this.title = object.title;
        this.type = object.type;
        this.username = user.username;
        this.description = object.description;
        this.comments = object.comments.length || 0;
        this.isPrivate = object.isPrivate || false;
        this.isPointed = object.points.filter(x => x.userId == userId).map(x => x.userId == userId)[0] || false;
        this.hasPhoto = object.hasPhoto || false;
        this.photoExt = object.photoExt || '';
        this.points = object.points.length;
        this.categories = object.categories;
        if(object.type === "recipe"){
            this.ingredients = object.ingredients;
            this.directions = object.directions;
        }
        this.userId = object.userId;
        this.createdAt = object.createdAt;
        this.timeAgo = timeSince(object.createdAt);
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
    }else if ((time = Math.floor(seconds / 60 / 60) > 1)){
        return `${time} hours ago.`
    }else if ((time = Math.floor(seconds / 60) > 1)) {
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