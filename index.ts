import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config()

const PORT = process.env.PORT



const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.json('Express + TS')
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})