const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const regexEmail = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/i;
const testEmail = (email) => regexEmail.test(email);

// to signup a new user
exports.signup = (req, res, next) => {
    if(!testEmail(req.body.email)) {
        res.status(400).json({message: "Invalid email address input !"});      
    } else {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
            email: req.body.email,
            password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'user is created successfully !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }
  };

// to login
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Password doesn't match with email." });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Password doesn't match with email." });
                    }
                    const createdToken = jwt.sign({ userId: user._id },                                                
                                                 process.env.ACCESS_SECRET_TOKEN,
                                                 { expiresIn: '24h' })
                    res.status(200).json({
                        userId: user._id,
                        token: createdToken
                    });
                    console.log(createdToken);
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};