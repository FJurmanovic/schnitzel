const   express = require("express"),
        router = express.Router(),
        bcrypt = require("bcryptjs"),
        jwt = require("jsonwebtoken"),
        { check, validationResult} = require("express-validator");

const User = require("../../model/User");

router.post('/',
    [
        check("username", "Please Enter a Valid Username") //Checks if "username" request is empty
        .not()
        .isEmpty()
        .isLength({
        min: 2,
        max: 10
        }),
        check("email", "Please enter a valid email").isEmail(), //Checks if "email" request is email
        check("password", "Please enter a valid password").isLength({ //Checks if "password" request is smaller than 6 characters
            min: 6
        })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        const {
            username,
            email,
            password,
            isPrivate
        } = req.body; //Variables from request's body
        try {
            let user = await User.findOne({ //If email exists in database, it will return true
                email 
            });
            if (user) {
                return res.status(400).json({ //It will send respond that email already exists
                    type: "email",
                    message: "Email is already registred"
                });
            }

            user = await User.findOne({ 
                username
            });
            if (user) {
                return res.status(400).json({
                    type: "username",
                    message: "Username is already registred"
                });
            }

            user = new User({ //If everything checks right, it will add new user to database
                username,
                email,
                password,
                isPrivate
            });

            
            user.createdAt = new Date();
            user.updatedAt = new Date();

            const salt = await bcrypt.genSalt(10); //Adds random characters(salt) 
            user.password = await bcrypt.hash(password, salt); //Encrypts password + salt

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({ //Sends back token that rest of the backend uses for authentication
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
});

module.exports = router;