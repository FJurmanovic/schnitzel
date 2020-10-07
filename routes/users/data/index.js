const   express = require("express"),
        router = express.Router(),
        bcrypt = require("bcryptjs"),
        jwt = require("jsonwebtoken"),
        { check, validationResult} = require("express-validator"),
        path = require("path");

const serviceKey = path.join(__dirname, '../../../keys.json')

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'schnitzel-278322'
});
const bucket = storage.bucket("schnitzel");
        

const User = require("../../../model/User");
const Post = require("../../../model/Post");

const auth = require("../../../middleware/auth");

const [followers, following] = [require("./followers"), require("./following")];

router.use('/followers', followers);
router.use('/following', following);

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
        
        if(user.hasPhoto) {
          let fileName = `avatar/${req.user.id}/${req.user.id}${user.photoExt}`;
          const blob = bucket.file(fileName);
          const blobStream = blob.getSignedUrl({
              version: 'v4',
              action: 'read',
              expires: Date.now() + 1000 * 60 * 60 * 24 * 6
          });

          const [url] = await blobStream;
          userData.url = url;
      }
  
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
        res.status(401).json({ 
          type: "fetch",
          message: "Error in Fetching user" 
        });
      }
});

router.get('/:userId', auth, async (req, res) => {
  try {
    const {userId} = req.params;
    //const [user, profile] = await Promise.all([await User.findOne({ username: userId }), await User.findById(req.user.id)]);
    const user = await User.findOne({ username: userId });
    let profile = [];
    if (req.user.id !== "anonymous") profile = await User.findById(req.user.id);
    const posts = await Post.find({ userId: user._id });

    const postNum = posts.length;

    const isFollowing = profile.following ? profile.following.filter(x => x.userId == user._id).map(x => x.userId == user._id)[0] : false;

    let userData = {};

    if(user.hasPhoto) {
      let fileName = `avatar/${user._id}/${user._id}${user.photoExt}`;
      const blob = bucket.file(fileName);
      const blobStream = blob.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * 6
      });

      const [url] = await blobStream;
      userData.url = url;
    }

    userData["id"] = user._id;
    userData["hasPhoto"] = user.hasPhoto;
    userData["username"] = user.username;
    userData["isFollowing"] = isFollowing;
    userData["postNum"] = postNum;
    userData["isPrivate"] = user.isPrivate;
    userData["createdAt"] = user.createdAt;
    userData["points"] = user.points || 0;
    userData["followerNum"] = user.followers.length || 0;
    res.json(userData);
  } catch (e) {
    res.status(401).json({ 
      type: "fetch",
      message: "Error in Fetching user" 
    });
  }
});

router.put('/', auth,
  [
    check("username", "Please Enter a Valid Username") //Checks if "username" request is empty
    .optional()
    .not()
    .isEmpty()
    .isLength({
      min: 2,
      max: 10
    }),
    check("email", "Please enter a valid email")
    .optional()
    .isEmail(), //Checks if "email" request is email
    check("password", "Please enter a valid password")
    .optional()
    .isLength({ //Checks if "password" request is smaller than 6 characters
        min: 6
    })
  ], 
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

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

      let user = new editUser(req.body);

      if ('password' in req.body) {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashpassword;
      }

      if(!findUser && !findEmail) {
        await User.findByIdAndUpdate(req.user.id, user);
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
      res.status(401).json({
        type: "fetch",
        message: "Error in fetching user"
      });
    }
});

module.exports = router;

function editUser (object) {
  if (object.email) this.email = object.email;
  if (object.username) this.username = object.username;
  if (object.privacy) this.isPrivate = object.isPrivate;
}