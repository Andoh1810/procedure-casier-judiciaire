import { httpCode } from "../static/httpCode.js";
import jwt from "jsonwebtoken"
import cles from "../utils/tokenGenerate.js";

const authMiddleWare = async (req, res, next) => {

    try {

        const tokenHeader = req.headers.authorization
    
        if(!tokenHeader || !tokenHeader.startsWith("Bearer ")){
            return res.status(httpCode.UNAUTHORIZED).json({message: "Token manquant ou mal écrit!"})
        }

        const token = tokenHeader.split(' ')[1]
    
        const decoded = jwt.verify(token, cles.cleAccesToken)
        req.user = decoded

        next()
        
    } catch (error) {
        return res.status(httpCode.UNAUTHORIZED).json({message: "Token expiré"})
    }

}

export default authMiddleWare