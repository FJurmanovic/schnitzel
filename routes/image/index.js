const   express = require("express"),
        router = express.Router(),
        path = require("path"),
        sharp = require("sharp");
        
const auth = require("../../middleware/auth"),
      image = require("../../middleware/image")

const serviceKey = path.join(__dirname, '../../keys.json')
const Post = require("../../model/Post");
const User = require("../../model/User");

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'schnitzel-278322'
});
const bucket = storage.bucket("schnitzel")

router.get("/:type/:postId/:file", async (req, res) => {
    const {params: {type, postId, file}} = req;

    try {
        let fileName = `${type}/${postId}/${file}`;

        const blob = bucket.file(fileName);

        const blobStream = blob.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60 * 24 * 6
        });

        const [url] = await blobStream;

        res.send(url);
        
    } catch (err) {
        console.log(err);
        res.status(500).send("Error uploading image");
    }
    
});

router.post("/", image, auth, (req, res) => { //Uploads the image to cloudinary
    const {headers: {type, postid}, user: {id}} = req;

    try {
        let fileId = null;
        if(type === "post") fileId = postid;
        else fileId = id;

        let fileName = `${type}/${fileId}/${fileId}.webp`;

        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
            resumable: false
        })
        const toWebp = sharp(req.file.buffer)
                            .webp({ lossless: true })
                            .toBuffer()
        blobStream.on('finish', async () => {
            if(type === "post") await Post.findByIdAndUpdate(postid, { $set: { "photoExt": ".webp", "hasPhoto": true } });
            if(type === "avatar") await User.findOneAndUpdate({'_id': id}, { $set: {"photoExt": ".webp", "hasPhoto": true} });
            res.status(200).send("Image uploaded");
        })
        blobStream.on('error', (err) => {
            res.status(500).send(err)
        })
        toWebp.then((buff) => blobStream.end(buff))
    }

    catch (err) {
        console.log(err);
        res.status(500).send("Error uploading image");
    }
    //console.log(req.file)
});

module.exports = router;