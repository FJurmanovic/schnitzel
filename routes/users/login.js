const   express = require("express"),
        router = express.Router(),
        bcrypt = require("bcryptjs"),
        jwt = require("jsonwebtoken"),
        { check, validationResult} = require("express-validator");

const User = require("../../model/User");

router.post('/',
    [
    check("email", "Please enter a valid email").isEmail(), //Checks if email
    check("password", "Please enter a valid password").isLength({ //Checks if >6
        min: 3
    })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array()
          });
        }

        const {email, password} = req.body;
        try {
            const user = await User.findOne({ //Checks if email exists
                email
            });
            if (!user)
            return res.status(400).json({ //If not, sends message
                type: "email",
                message: "User does not exist"
            });

            const isMatch = await bcrypt.compare(password, user.password); //decrypts and compares if passwords match
            if (!isMatch)
            return res.status(400).json({
                type: "password",
                message: "Incorrect Password!"
            });

            const payload = {
            user: {
                id: user.id
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
                token //Sends token used for login and backend auth
                });
            }
            );
        } catch (err) {
            console.log(err);
            res.status(500).send("Error logging in");
        }
});

module.exports = router;