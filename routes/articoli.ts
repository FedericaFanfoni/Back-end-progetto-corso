import express, { Request, Response } from "express";
import { progettoDB } from "../db";
import { ObjectId } from "mongodb";

const router = express.Router()

router.route('/').get(async (req: Request, res: Response) => {

    const params: any = {}

    if (req.query.nome) {
        params.nome = new RegExp(`.*${req.query.nome}.*`, "i");
    }

    if (req.query.best_seller === 'true') {
        params.best_seller = { $gt: 3 };
    }

    if (req.query.nuovo_arrivo) {
        params.nuovo_arrivo = true
    }

    if (req.query.attivita) {
        params.attivita = req.query.attivita;
    }

    if (req.query.taglia) {
        params.taglie_disponibili = req.query.taglia;
    }

    if (req.query.colore) {
        params.colori_disponibili = req.query.colore;
    }

    if (req.query.min || req.query.max) {
        
        params.prezzo = {};

        if (req.query.min) {
            params.prezzo.$gte = +req.query.min;
        }
        if (req.query.max) {
            params.prezzo.$lte = +req.query.max;
        }
    }

    try {
        const articoli = await progettoDB.articoli.find(
            params,
            {
                limit: 12,
                skip: +req.query.skip!,
            }
        ).toArray()

        const totale_articoli = await progettoDB.articoli.countDocuments(params)

        if(totale_articoli === 0){
            res.status(400).json({ error: "Non è stato trovato nessun articolo" })
            return
        }
        res.json({ articoli, totale_articoli })
    }
    catch {
        res.status(400).json({ error: "Nessun articolo trovato" })
    }
})

router.route("/:_id").get(async (req: Request, res: Response) => {
    try {
        const articolo = await progettoDB.articoli.findOne(
            { _id: new ObjectId(req.params._id) }
        )
        res.json(articolo)
    }
    catch {
        res.status(400).json({ error: "Nessun articolo trovato" })
    }
})

export const articoliRoute = router