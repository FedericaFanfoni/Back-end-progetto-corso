import { createHash } from 'crypto'; // per crittografare la password

export const JWT_SECRET_KEY = "gibd2o48304prjfowelasmg?!2"

export const encrypt = (s: string) => {
    return createHash("sha256").update(s).digest("hex")
}