import mongoose, { connect } from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`)
    } catch (error) {
        console.log("error while connecting databse : ",error)
        process.exit(1)
    }
}

export default connectDB