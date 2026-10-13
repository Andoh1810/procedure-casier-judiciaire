import userController from "../controller/user.controller.js";
import { Router } from "express";
import authMiddleWare from "../middleware/auth.middleware.js";
import verifRoles from "../middleware/verifRole.middleware.js";

const userRoutes = Router()

const patternUser = {
    login: "/login",
    singup: "/singup",
    logout: "/logout",
    update: "/update/:id",
    delete: "/delete/:id",
    refreshtoken: "/refreshtoken"
}

userRoutes.post(patternUser.singup, userController.signup)
userRoutes.post(patternUser.login, userController.login)
userRoutes.post(patternUser.refreshtoken, userController.refreshtoken)

userRoutes.put(patternUser.logout, userController.logout)
userRoutes.put(patternUser.update, userController.updateUser)

userRoutes.delete(patternUser.delete, userController.deleteUser)

export default userRoutes

