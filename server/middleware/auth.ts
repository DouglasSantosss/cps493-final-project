import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

export interface AuthPayload {
    id: number
    email: string
    role: string
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

function getSecret() {
    return process.env.JWT_SECRET || "your-secret-key-change-in-production"
}

export function generateToken(user: {
    id: number
    email: string
    role: string
}) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        getSecret(),
        { expiresIn: "24h" },
    )
}

export function verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send({
            data: null,
            isSuccess: false,
            message: "No token provided",
        })
    }

    const parts = authHeader.split(" ")
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Invalid token format",
        })
    }

    try {
        const decoded = jwt.verify(parts[1], getSecret()) as AuthPayload
        req.user = decoded
        next()
    } catch (_error) {
        return res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Invalid or expired token",
        })
    }
}

export function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (req.user?.role !== "admin") {
        return res.status(403).send({
            data: null,
            isSuccess: false,
            message: "Admin access required",
        })
    }
    next()
}
