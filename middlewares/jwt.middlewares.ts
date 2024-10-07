import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import * as utils from '../utils'

declare global {
    namespace Express {
        export interface Request {
            user_id?:string
        }
    }
}

export const controlloToken = (req: Request, res: Response, next: NextFunction) => {

    if (req.path !== "/accounts/ordini") {
        next()
    }
    else { 
        // Accedo al valore dell'intestazione HTTP per verificare la presenza del token
        const authorization = req.header("Authorization") 
        // Se non lo trova
        if (!authorization) {
            res.status(401).json({ error: "Autorizzazione richiesta" })
        }
        else {
        // Se il token viene trovato
            try {
                // Authorization restituisce una stringa di cui prendo solo la parte che contiene il token
                const token = authorization.split(" ")[1]
                // Verifica e decodifica del token per vedere se è autentico e valido 
                const decodedToken = jwt.verify(token, utils.JWT_SECRET_KEY) as JwtPayload
                req.user_id = decodedToken._id
                next()
            }
            catch {
                res.status(401).json({ error: "Token non valido" })
            }  
        }
    }
}