import express, { Request, Response } from "express";
import { progettoDB } from "../db";
import * as utils from '../utils'
import { Account } from "../models/account.model";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

const router = express.Router()

router.post("/registrazione", async (req: Request, res: Response) => {

    // Creazione dell'account
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!req.body.nome) {
        res.status(400).json({ error: "Nome non presente" })
        return
    }
    if (!req.body.cognome) {
        res.status(400).json({ error: "Cognome non presente" })
        return
    }
    if (!req.body.email || emailRegex.test(req.body.email) === false) {
        res.status(400).json({ error: "Email non presente o non valida" })
        console.log(emailRegex.test(req.body.email))
        return
    }
    if (!req.body.password) {
        res.status(400).json({ error: "Password non presente" })
        return
    }

    req.body.password = utils.encrypt(req.body.password)

    try {
        const account = await progettoDB.accounts.insertOne(req.body)
        res.json({ message: `Account creato` })
    }
    catch {
        res.status(500).json({ error: "Impossibile creare l'account." })
    }
})

// LOGIN
router.post("/login", async (req:Request, res:Response) => {
   
    // Cerco l'utente con quella email e password
    const account = await progettoDB.accounts.findOne<Account>({
        email: req.body.email,
        password: utils.encrypt(req.body.password)
    },
        {
            projection: { password: 0 } // escludo la password dai dati che mi tornano
        })

    // Verifico che l'utente esiste e se non esiste restituisco un errore 401
    if (account === null) {
        // 401 Unauthorized
        res.status(401).json({ error: "Email o password non valida" })
        return
    }

    // Se l'utente esiste deve essere generato un TOKEN per l'utente
    const token = jwt.sign(account, utils.JWT_SECRET_KEY, { expiresIn: "3 days" })
    res.json({
        message: "Login OK",
        token
    })
})

// Rotta per prendere gli ordini effettuati e per aggiungerli all'account
router.route("/ordini")

    .post(async (req:Request, res:Response) => {

        try {
            const ordine = await progettoDB.accounts.updateOne(
                { _id: new ObjectId(req.user_id) },
                { $push: { ordini: req.body } }
            )
            res.json({ message: "L'ordine è stato aggiunto" })
        }
        catch {
            res.status(500).json({ error: "Impossibile trovare l'account." })
        }
    })

    .get(async (req, res) => {
        try {
            const ordini = await progettoDB.accounts.findOne(
                { _id: new ObjectId(req.user_id) },
                { projection: { ordini: 1, _id: 0 } }
            )
            res.json({ ordini })
        }
        catch {
            res.status(500).json({ error: "Impossibile trovare l'account." })
        }
    })

export const accountsRoute = router