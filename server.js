import dotenv from "dotenv/config"
import app from "./src/app.js"

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
})