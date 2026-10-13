import { httpCode } from "../static/httpCode.js";
import prisma from "../lib/prisma.js";

const verifRoles = {
    
    user : async (req, res, next) => {

        if(!req.user){
            return res.status(httpCode.FORBIDEN).json({message: "Vous n'êtes pas connecté!"})
        }
        
        const {email} = req.user

        const user = await prisma.utilisateur.findUnique({where:{email}})

        if(user.role !== "UTILISATEUR"){
            return res.status(httpCode.FORBIDEN).json({message: "Route révervée aux utilisateurs simples!"})
        }

        next()
    },

    greffier : async (req, res, next) => {

        if(!req.user){
            return res.status(httpCode.FORBIDEN).json({message: "Vous n'êtes pas connecté!"})
        }
        
        const {email} = req.user

        const user = await prisma.utilisateur.findUnique({where:{email}})

        if(user.role !== "GREFFIER"){
            return res.status(httpCode.FORBIDEN).json({message: "Route révervée aux Greffiers"})
        }

        next()
    },

    greffier_chef : async (req, res, next) => {

        if(!req.user){
            return res.status(httpCode.FORBIDEN).json({message: "Vous n'êtes pas connecté!"})
        }
        
        const {email} = req.user

        const user = await prisma.utilisateur.findUnique({where:{email}})

        if(user.role !== "GREFFIER_CHEF"){
            return res.status(httpCode.FORBIDEN).json({message: "Route révervée aux Greffiers en chef"})
        }

        next()
    },

    procureur : async (req, res, next) => {

        if(!req.user){
            return res.status(httpCode.FORBIDEN).json({message: "Vous n'êtes pas connecté!"})
        }
        
        const {email} = req.user

        const user = await prisma.utilisateur.findUnique({where:{email}})

        if(user.role !== "PROCUREUR"){
            return res.status(httpCode.FORBIDEN).json({message: "Route révervée aux procureurs"})
        }

        next()
    }

}

export default verifRoles