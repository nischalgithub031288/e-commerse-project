const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 123

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String
            }


        }

    ]
    // role: {
    //     type: String,
    //     required: true,
    // }
})


userSchema.pre('validate', function (next) {
    let count
    if (this.isNew) {
        this.constructor.countDocuments((err, data) => {
            if (err) {
                return next(err)
            }
            count = data
            console.log('documents count', count)
        })
            .then(() => {
                if (count == 0) {
                    this.role = 'admin'
                    next()
                }
                else {
                    this.role = 'user'
                    next()
                }
            })
    }
    else {
        next()
    }
})
userSchema.pre('save', function (next) {
    //if the registration is new then this method call
    //if the record is already stored in database it return false
    if (this.isNew) {
        bcryptjs.genSalt(10).then((salt) => {


            bcryptjs.hash(this.password, salt).then((hashedPassword) => {
                this.password = hashedPassword
                next()
            })
        })
    }
    //other wise next Function call
    else {
        next()
    }
})

userSchema.statics.findByEmailAndPassword = function (email, password) {
    const User = this
    return User.findOne({ email })
        .then((user) => {
            if (user) {
                return bcryptjs.compare(password, user.password)
                    .then((result) => {
                        if (result) {

                            return Promise.resolve(user)
                        }
                        else {

                            return Promise.reject('invalid email or Password')
                        }
                    })
            } else {

                return Promise.reject('invalid email or Password')
            }

        })
        .catch((err) => {

            return Promise.reject(err)
        })


}
//1 st step for token
userSchema.methods.generateToken = function () {
    const user = this
    const tokenData = {
        userId: user._id
    }
    const token = jwt.sign(tokenData, 'dct@welt123')
    user.tokens.push({
        token
    })

    //whenever we use save() the line no 50 function call again decrypted the salt value that why we used if conditon
    return user.save().then((user) => {
        return token
    }).catch((err) => {
        return err
    })
    //if it is sucess token information get istead of user informations
}

// userSchema.statics.findByToken = function (token) {
//     const User = this
//     let tokenData
//     try {
//         tokenData = jwt.verify(token, 'nischal@123')
//     }
//     catch (err) {
//         return Promise.reject(err)
//     }
//     return User.findOne({
//         '_id': tokenData.userId,
//         'tokens.token': token
//     })
//         .then((user) => {
//             console.log('usr', user)
//             return Promise.resolve(user)

//         })
//         .catch((err) => {
//             console.log('er')
//             return Promise.reject(err)

//         })
// }

userSchema.statics.findByToken = function (token) {
    console.log('this is niscal', token)
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'dct@welt123')
        console.log('tokenData', tokenData)
    } catch (err) {
        console.log('error')
        return Promise.reject(err)
    }

    return User.findOne({
        _id: tokenData.userId,


    })
        .then((user) => {
            // console.log(user)
            //console.log('my ID', _id)
            var found = user.tokens.some(x => x.token === token)
            // return Promise.resolve(user)
            if (found) {
                return User.findOne({
                    '_id': tokenData.userId,
                    'tokens.token': token
                })
                    .then((user) => {
                        return Promise.resolve(user)
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })

            }
            else {
                return Promise.reject({ notice: ' redirect to login page' })
            }
        })
        .catch((err) => {

            return Promise.reject(err)
        })


}

//static used in model level ex userSchema.statics
//instance used in object level ex userSchema.methods

userSchema.methods.generateToken = function () {
    const user = this
    //we generate some token data in tokenData object
    const tokenData = {
        userId: user._id,
        username: user.username,
        email: user.email
    }
    // now we generate token data
    //dct@welt123 is a secret value
    const token = jwt.sign(tokenData, 'dct@welt123')
    user.tokens.push({
        token        //token : token  consice method
    })
    //token i generated we push
    return user.save().then((user) => {
        return token
    }).catch((err) => {
        return err
    })
}




const User = mongoose.model('User', userSchema)

module.exports = {
    User
}
