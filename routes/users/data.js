const   express = require("express"),
        router = express.Router(),
        jwt = require("jsonwebtoken");

const User = require("../../model/User");
const Post = require("../../model/Post");

const auth = require("../../middleware/auth");

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let userData = {};
        userData["id"] = user._id;
        userData["username"] = user.username;
        userData["email"] = user.email;
        userData["createdAt"] = user.createdAt;
        userData["isPrivate"] = user.isPrivate;
        userData["hasPhoto"] = user.hasPhoto || false;
        userData["photoExt"] = user.photoExt || '';
  
        let { following, followers } = user;
  
        let newFollowing = [] 
        let newFollowers = []
        for(const [key, resp] of following.entries()){
          const userr = await User.findById(resp.userId);
          if(!(userr === null)){ 
            newFollowing[key] = {
              "userId": resp.userId,
              "username": userr.username
            };
          }
        }
        for(const [key, resp] of followers.entries()){
          const userr = await User.findById(resp.userId);
          if(!(userr === null)){ 
            newFollowers[key] = {
              "userId": resp.userId,
              "username": userr.username
            };
          }
        }
        userData["followers"] = newFollowers || []
        userData["following"] = newFollowing || []
  
        res.send(userData)
  
      } catch (e) {
        res.json({ 
          type: "fetch",
          message: "Error in Fetching user" 
        });
      }
});

router.get('/:userId', auth, async (req, res) => {
  try {
    const {userId} = req.params;

    const [user, profile, posts] = await Promise.all([await User.findById(userId), await User.findById(req.user.id), await Post.find({userId: userId })]);

    const postNum = posts.length

    const isFollowing = profile.following.filter(x => x.userId == user._id).map(x => x.userId == user._id)[0] || false

    let userData = {};
    userData["id"] = user._id;
    userData["hasPhoto"] = user.hasPhoto;
    userData["photoExt"] = user.photoExt;
    userData["username"] = user.username;
    userData["isFollowing"] = isFollowing;
    userData["postNum"] = postNum;
    userData["isPrivate"] = user.isPrivate;
    userData["createdAt"] = user.createdAt;
    res.json(userData);
  } catch (e) {
    res.json({ 
      type: "fetch",
      message: "Error in Fetching user" 
    });
  }
});

router.put('/', auth, async (req, res) => {
  const { email, username } = req.body;
  try {
    if(req.user.id == "5ed4ce7841cc3c001cfa6bfb"){
      res.send({
        type: "demo",
        message: "You cannot edit demo account"
      })
      return
    }

    const [findUser, findEmail] = await Promise.all([User.findOne({username}), User.findOne({email})]);

    if(!findUser && !findEmail) {
      await User.findByIdAndUpdate(req.user.id, req.body);
    } else {
      !!findUser && res.send({
        type: "username",
        message: "Username already exists"
      });
      !!findEmail && res.send({
        type: "email",
        message: "Email already exists"
      });
    }

    const payload = {
      user: {
        id: req.user.id
      }
    };

    jwt.sign(
      payload,
      "secret",
      {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token
        });
      }
    );
  } catch (e) {
    res.json({
      type: "fetch",
      message: "Error in fetching user"
    });
  }
});

module.exports = router;