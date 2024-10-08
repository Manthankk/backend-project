 import mongoose ,{Schema} from "mongoose"
 import jwt from "jsonwebtoken"
 import bcrypt from "bcrypt"


const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String , //use cloudnary
            required:true,
        },
        coverImage:{
            type:String , //use cloudnary
        },  
        watchHistory:[{
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'password is required']
    },
    refreshTokens:{
        type:string
    }   
    },
    {
        timestamps:true,
    }
)

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,10)
    next()
})


userSchema.methods.isPasswordCorrect=async function(password){
    return   await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
} // this is JWT token
userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign(
        {
            _id:this._id,   // this has less information    
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
        )

}  // this is JWT refresh token



export const User=mongoose.model("Users",userSchema)