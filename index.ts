import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { articoliRoute } from "./routes/articoli";
import { accountsRoute } from "./routes/accounts";
import { controlloToken } from "./middlewares/jwt.middlewares";
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(controlloToken)
app.use("/articoli", articoliRoute)
app.use("/accounts", accountsRoute)

app.listen(3000, () => {
    console.log("Progetto backend started");
})