const   express = require("express"),
        router = express.Router(),
        bcrypt = require("bcryptjs"),
        jwt = require("jsonwebtoken");

const User = require("../../model/User");

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

module.exports = router;