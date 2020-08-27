const   express = require("express"),
        router = express.Router(),
        { check, validationResult} = require("express-validator"),
        path = require("path"),
        sharp = require("sharp");

const User = require("../../model/User");
const Post = require("../../model/Post");

const auth = require("../../middleware/auth");

const point = require("./point"),
      comment = require("./comment");

router.use("/point", point);
router.use("/comment", comment);

const serviceKey = path.join(__dirname, '../../keys.json')

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'schnitzel-278322'
});
const bucket = storage.bucket("schnitzel");

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
                    "isPrivate": false,
                }
            } else {
                options = {
                    "isPrivate": false,
                    "categories": category
                }
            }
        }
        options.createdAt = {"$lte": firstDate}; 
        let [posts, total] = await Promise.all([Post.find(options).skip((page - 1) * ppp).limit(ppp).sort('-createdAt'), Post.find(options)]);
        let length = total.length;
        let items = [];
        for (post of posts) {
            //const item = await Items(post, req.user.id, type);
            let item = {};
            let user = await User.findById(post.userId); // Change with another fetch action to get usernames after posts are fetched
            if (user.isPrivate && user.id != req.user.id) {
                length--;
                continue;
            }
            if(!user){
                user= {"username": "DeletedUser"}
            }

            if(post.hasPhoto) {
                let fileName = `post/${post._id}/${post._id}${post.photoExt}`;
                const blob = bucket.file(fileName);
                const blobStream = blob.getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 1000 * 60 * 60 * 24 * 6
                });

                const [url] = await blobStream;
                item.url = url;
            }
    
            item.id = post._id;
            item.title = post.title;
            item.type = post.type;
            item.username = user.username;
            item.description = post.description;
            item.comments = post.comments.length || 0;
            item.isPrivate = post.isPrivate || false;
            item.isPointed = post.points.filter(x => x.userId == req.user.id).map(x => x.userId == req.user.id)[0] || false;
            item.hasPhoto = post.hasPhoto || false;
            item.points = post.points.length;
            item.categories = post.categories;
            if(post.type === "recipe"){
                item.ingredients = post.ingredients;
                item.directions = post.directions;
            }
            item.userId = post.userId;
            item.createdAt = post.createdAt;
            item.timeAgo = timeSince(post.createdAt);
            items.push(item);
        }
        res.json({
            "page": page,
            "ppp": ppp,
            "total": length,
            "items": items
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in fetching");
    }
});

router.get('/:postId', auth, async (req, res) => {
    const {user: {id}, params: {postId}} = req;
    try {
        const post = await Post.findById(postId);
        let item = {};
        let user = await User.findById(post.userId); // Change with another fetch action to get usernames after posts are fetched
        if (user.isPrivate && user.id != id) {
            return;
        }
        if(!user){
            user= {"username": "DeletedUser"}
        }

        if(post.hasPhoto) {
            let fileName = `post/${post._id}/${post._id}${post.photoExt}`;
            const blob = bucket.file(fileName);
            const blobStream = blob.getSignedUrl({
                version: 'v4',
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60 * 24 * 6
            });

            const [url] = await blobStream;
            item.url = url;
        }

        item.id = post._id;
        item.title = post.title;
        item.type = post.type;
        item.username = user.username;
        item.description = post.description;
        item.comments = post.comments.length || 0;
        item.isPrivate = post.isPrivate || false;
        item.isPointed = post.points.filter(x => x.userId == id).map(x => x.userId == id)[0] || false;
        item.hasPhoto = post.hasPhoto || false;
        item.points = post.points.length;
        item.categories = post.categories;
        if(post.type === "recipe"){
            item.ingredients = post.ingredients;
            item.directions = post.directions;
        }
        item.userId = post.userId;
        item.createdAt = post.createdAt;
        item.timeAgo = timeSince(post.createdAt);
        res.json(item);
    } catch (e) {
        res.status(500).send("Error fetching");
    }
});

router.get('/edit-data/:postId', auth, async (req, res) => {
    const {user: {id}, params: {postId}} = req;
    try {
        const post = await Post.findById(postId);
        if(post.userId !== id) {
            res.status(401).send("This is not your post");
            return;
        }

        let user = await User.findById(id);

        if(user == null){
            user = {"username": "DeletedUser"}
        }
        
        let postMap = {};
    
        postMap["id"] = post._id;
        postMap["title"] = post.title;
        postMap["type"] = post.type;
        postMap["isPrivate"] = post.isPrivate || false;
        postMap["hasPhoto"] = post.hasPhoto || false;
        postMap["photoExt"] = post.photoExt || '';
        postMap["description"] = post.description;
        postMap["categories"] = post.categories;
        if(post.type == "recipe"){
            postMap["ingredients"] = post.ingredients;
            postMap["directions"] = post.directions;
        }
        postMap["userId"] = post.userId;
        postMap["username"] = user.username;
        postMap["createdAt"] = post.createdAt;

        res.json(postMap);
    } catch (e) {
        res.status(500).send("Error fetching");
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

router.put('/:postId', auth, 
    [
        check("title", "Please Enter a Valid Title") //Checks if title is empty
        .not()
        .isEmpty(),
        check("description", "Please enter a valid description").not() //Checks if description is empty
        .isEmpty()
    ],
    async (req, res) => {
        const { body: { title, type, isPrivate, description, categories, ingredients, directions }, params: {postId}, user: {id} } = req;
        try { 
            let post = await Post.findById(postId);
            if(post.userId !== id) {
                res.status(401).send("This is not your post");
                return;
            }

            post = await Post.findByIdAndUpdate(postId, {title, type, isPrivate, description, categories, ingredients, directions, updatedAt: Date()})

            res.send({id: post.id})
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in fetching");
        }
});


router.delete('/:postId', auth, async (req, res) => {
    const {user: {id}, params: {postId}} = req;
    try {
        const post = await Post.findById(postId);
        if(!!post && (post.userId == id)){
            if(post.hasPhoto){
                console.log("delete photo")
            }
          await Post.findByIdAndRemove(postId);
          res.json("Removed post");
          return;
        }
          res.send("Not your post");
    } catch (e) {
        res.status(500).send("Error deleting post")
    }
});

module.exports = router;

async function Items(object, userId, type) {
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