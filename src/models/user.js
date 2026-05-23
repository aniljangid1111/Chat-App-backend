const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", 
        },
        status: {
            type: Boolean,
            default: 1,
        }, 
        created_at: {
            type: Date,
            default: Date.now()  
        },
        updated_at: {
            type: Date,
            default: Date.now()
        },
        delete_at: {
            type: Date,
            default: ''
        }
    }
    // ,
    // {
    //     timestamps: true
    // }
)
const userModels = mongoose.model('Users', userSchema);
module.exports = userModels;