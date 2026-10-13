import prisma from "../lib/prisma.js";
import {v4 as uuidv4} from 'uuid'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cles from "../utils/tokenGenerate.js";
import { httpCode } from "../static/httpCode.js";

const generateAccessToken = (user)=>{
    return jwt.sign(
        {
            email:user.email
        },
        cles.cleAccesToken,
        {
            expiresIn: "2m"
        }
    )
}

const generateRefreshToken = (user)=>{
    return jwt.sign(
        {
            email:user.email
        },
        cles.cleRefreshToken,
        {
            expiresIn: "7d"
        }
    )
}


const userController = {
    signup : async (req, res) => {
        
        try {
            
            const {nom, email, password} = req.body

            if(!nom || !email || !password){
                return res.status(httpCode.BAD_REQUEST).json({message: "Tous les champs sont requis!"})
            }

            const verifEmail = await prisma.utilisateur.findUnique({where: {email}})

            if(verifEmail){
                return res.status(httpCode.BAD_REQUEST).json({message: "Cette addresse email est déjà utilisée"})
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = await prisma.utilisateur.create({
                data: {
                    id: uuidv4(),
                    nom, email, 
                    password: hashedPassword
                }
            })

            return res.status(httpCode.CREATED).json({message: "Création de compte réussie", newUser})

        } catch (error) {
            return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: error.message})
        }

    }, 
    
    login : async (req, res) => {
        
        try {
            
            const {email, password} = req.body

            if(!email || !password){
                return res.status(httpCode.BAD_REQUEST).json({message: "Tous les champs sont requis!"})
            }

            const user = await prisma.utilisateur.findUnique({where:{email}})

            if(!user){
                return res.status(httpCode.NOT_FOUND).json({message: "Email ou mot de passe incorrect!"})
            }

            const verifPassword = await bcrypt.compare(password, user.password)

            if(!verifPassword){
                return res.status(httpCode.NOT_FOUND).json({message: "Email ou mot de passe incorrect!"})
            }

            const accessToken = generateAccessToken(user)
            const refreshtoken = generateRefreshToken(user)

            await prisma.utilisateur.update({where:{email}, data:{refreshtoken}})

            return res.status(httpCode.OK).json({message: "Connexion réuissie!", accessToken, refreshtoken})

        } catch (error) {
            return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: error.message})
        }

    }, 
    
    logout : async (req, res) => {
        
        try {
            
            const {id} = req.params

            const user = await prisma.utilisateur.findUnique({where:{id}})

            if(!user){
                return res.status(httpCode.NOT_FOUND).json({message: "Utilisateur introuvable!"})
            }

            await prisma.utilisateur.update({where:{id}, data:{refreshtoken:null}})
D
            return res.status(httpCode.OK).json({message: "Déconnexion réussie!"})

        } catch (error) {
            return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: error.message})
        }

    }, 
    
    updateUser : async (req, res) => {
        
        try {
            
            const {nom, email, password} = req.body

            const {id} = req.params

            const user = await prisma.utilisateur.findUnique({where:{id}})

            if(!user){
                return res.status(httpCode.NOT_FOUND).json({message: "Utilisateur introuvable!"})
            }

            const updateUser = await prisma.utilisateur.update({
                where: {id},

                data: {
                    nom: nom ?? user.nom,
                    email: email ?? user.email,
                    password: password ?? user.password
                }
            })

            return res.status(httpCode.OK).json({message: "Modifications réussie", updateUser})
            
        } catch (error) {
            return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: error.message})
        }

    }, 
    
    deleteUser : async (req, res) => {
        
        try {
            
            const {id} = req.params

            const user = await prisma.utilisateur.findUnique({where:{id}})

            if(!user){
                return res.status(httpCode.NOT_FOUND).json({message: "Utilisateur introuvable!"})
            }

            await prisma.utilisateur.delete({where: {id}})

            return res.status(httpCode.OK).json({message: `Le compte de ${user.nom} a été supprimé avec succès!`})

        } catch (error) {
            return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: error.message})
        }

    }, 
    
    refreshtoken : async (req, res) => {
        
        try {
            
            const {refreshtoken} = req.body

            if(!refreshtoken){
                return res.status(httpCode.BAD_REQUEST).json({message: "refresh token manquant"})
            }

            const decode = jwt.verify(refreshtoken, cles.cleRefreshToken)

            const user = await prisma.utilisateur.findUnique({where:{email: decode.email}})

            if(!user || user.refreshtoken!==refreshtoken){
                return res.status(httpCode.UNAUTHORIZED).json({message: "Token invalide!"})
            }

            const newAccessToken = generateAccessToken(user)

            return res.status(httpCode.OK).json({message: "Nouvel access token créé", newAccessToken})

        } catch (error) {
            return res.status(httpCode.INTERNAL_SERVER_ERROR).json({message: error.message})
        }

    }  
}

export default userController