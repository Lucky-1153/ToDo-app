import { Router } from "express";
import { newTodo, updateTodo, getTodo, deleteTodo, completeTodo, inCompleteTodo } from "../controllers/todo.controller.js";
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = Router()

router.route('/new-todo').post(jwtVerify, newTodo)
router.route('/get-todo').get(jwtVerify, getTodo)
router.route('/update-todo').put(jwtVerify, updateTodo)
router.route('/delete-todo').delete(jwtVerify, deleteTodo)
router.route('/complete-todo').put(jwtVerify, completeTodo)
router.route('/incomplete-todo').put(jwtVerify, inCompleteTodo)

export default router