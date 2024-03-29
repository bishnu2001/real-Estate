const bcryptjs = require('bcryptjs');
const { User } = require('../model/user.model');
const { Listing } = require('../model/listing.model');
module.exports.updateuser = async (req, res) => {
    try {
        if (req.user.id == req.params.id) {
            return res.status(401).json({ message: "you can only update your own account" });
        }
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updateuser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true });

        const { password, ...rest } = updateuser._doc;
        return res.status(200).json({ success: true, ...rest, message: "update successful" });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
module.exports.deleteuser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(401).json({ error: "you can delete only your account" })
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(201).json({ message: "user successfully deleted" })
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
module.exports.getuserlisting = async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            const listing = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listing)
        } catch (error) {

        }
    } else {
        return res.status(501).json({ message: "you can view only your listing" })
    }
}
module.exports.getUser=async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user){
            res.json('user not found')
        }
        const {password:pass,...rest}=user._doc;
        res.status(201).json(rest)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}