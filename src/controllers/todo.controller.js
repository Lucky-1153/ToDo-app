import { Todo } from "../models/todo.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

const newTodo = async (req,res) => {
   try {
        const {title, description} = req.body

        if( [title, description].some( (field) => field?.trim() === ""))
            throw new ApiError(501, "enter title and description")
        
        const todo = await Todo.create(
            {
                title,
                description,
                user : req.user._id
            }
        )
        

        if(!todo)
            throw new ApiError(502, "not abel to save new todo in database")

        return res
        .status(200)
        .json(
            "new todo created"
        )
   } catch (error) {
        throw new ApiError(503, "error while creating new todo",error)
   }


}

const getTodo = async( req, res) => {
    try {
        const todo = await Todo.find({user: req.user?._id})
    
        if(!todo)
            throw new ApiError(501, "unauthorized access")
    
        return res
        .status(200)
        .send(todo)
    } catch (error) {
        throw new ApiError(502, "can't get todo",error)
    }
}

const updateTodo = async( req, res) => {

    try {
        const {title, description} = req.body
    
        if([title,description].some((field) => field.trim() === ""))
            throw new ApiError(502, "enter title and description")
        
        const todo = await Todo.findOneAndUpdate(
            {user : req.user._id},
            {
                title,
                description
            },
            {
                new: true
            }
        )

        const newTodo = Todo.findById(todo._id)
        console.log(todo)

        
        return res
        .status(200)
        .json(
            'updated successfully' 
        )
    } catch (error) {
        throw new ApiError( 503, "not able to update",error)
    }
}

const deleteTodo = async(req, res) => {
    try {
        const todo = await Todo.find({user: req.user._id})
        if(!todo)
            throw new ApiError(501, "unauthorized access")
        console.log(todo)
        await Todo.findByIdAndDelete(todo)
        
    
        return res
            .status(200)
            .json(
                'deleted successfully' 
            )
    } catch (error) {
        throw new ApiError(502, "unable to delete",error)
    }
}

const completeTodo = async (req, res) => {

    try {
        const todo = await Todo.find({user: req.user?._id})
        if(!todo)
            throw new ApiError(501, "unauthorized access")
    
        await Todo.findByIdAndUpdate(
            todo,
            {
                $set:{
                    done: true
                }
            },
            {
                new: true
            }
        )
    
        return res
        .status(200)
        .json(
            "todo completed"
        )
    } catch (error) {
        throw new ApiError(502, "unable to complete todo", error)
    }

}

const inCompleteTodo = async(req, res) => {

    try {
        const todo = await Todo.find( {user: req.user._id})
        if(!todo)
            throw new ApiError(501, "unable to mark todo incomplete")

        await Todo.findByIdAndUpdate(
            todo,
            {
                $set: {
                    done: false
                }
            },
            {
                new: true
            }
        )
    
        return res
        .status(200)
        .json(
            "done marked false"
        )
    
    } catch (error) {
        throw new ApiError('sorry for task incoplete', error)
    }
}

export {
    newTodo,
    getTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    inCompleteTodo
}