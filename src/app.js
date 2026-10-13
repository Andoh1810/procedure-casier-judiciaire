import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/user.routes.js";
import cors from 'cors'


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Trop de requettes pour cette addresse IP"
})

const app = express()

//middleware
app.use(morgan('tiny'))
app.use(express.json())
app.use(limiter)

//routes
app.use("/users",userRoutes)

export default app