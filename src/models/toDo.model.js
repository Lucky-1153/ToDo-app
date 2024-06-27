import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        
        description:{
            type: String,
            required: true
        },

        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        done:{
            Boolean
        }
    },
    {
        timestamps: true
    }
)

export const Todo = mongoose.model('Todo', todoSchema)