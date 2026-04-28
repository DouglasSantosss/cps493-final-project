import { Router } from "express"
import { getAll, get, create, update, remove, login, search } from "../models/users"
import { User, LoginResponse, DataEnvelope, DataListEnvelope } from "../types"
import { verifyToken, requireAdmin } from "../middleware/auth"

const app = Router()

app.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({
                data: null,
                isSuccess: false,
                message: "Email and password required",
            } as DataEnvelope<null>)
        }

        const result = await login(email, password)
        const response: DataEnvelope<LoginResponse> = {
            data: result,
            isSuccess: true,
        }
        res.send(response)
    } catch (err) {
        next(err)
    }
})
    .post("/register", async (req, res, next) => {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return res.status(400).send({
                    data: null,
                    isSuccess: false,
                    message: "All fields required",
                } as DataEnvelope<null>)
            }

            const newUser = await create({ name, email, password, role: "user", friendIds: [] })
            const response: DataEnvelope<User> = {
                data: newUser,
                isSuccess: true,
            }
            res.status(201).send(response)
        } catch (err) {
            next(err)
        }
    })
    .get("/", verifyToken, requireAdmin, async (_req, res, next) => {
        try {
            const { list, count } = await getAll()
            const response: DataListEnvelope<User> = {
                data: list,
                isSuccess: true,
                total: count,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .get("/me", verifyToken, async (req, res, next) => {
        try {
            const item = await get(req.user!.id)
            const response: DataEnvelope<User> = {
                data: item,
                isSuccess: true,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .get("/search/:query", verifyToken, async (req, res, next) => {
        try {
            const { query } = req.params
            const results = await search(query)
            const response: DataListEnvelope<User> = {
                data: results,
                isSuccess: true,
                total: results.length,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .get("/:id", verifyToken, async (req, res, next) => {
        try {
            const { id } = req.params
            const item = await get(Number(id))
            const response: DataEnvelope<User> = {
                data: item,
                isSuccess: true,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .patch("/:id", verifyToken, async (req, res, next) => {
        try {
            const { id } = req.params
            const isOwner = req.user!.id === Number(id)
            const isAdmin = req.user!.role === "admin"

            if (!isOwner && !isAdmin) {
                return res.status(403).send({
                    data: null,
                    isSuccess: false,
                    message: "Access denied",
                } as DataEnvelope<null>)
            }
            if (!isAdmin && req.body.role) delete req.body.role

            const updatedItem = await update(Number(id), req.body)
            const response: DataEnvelope<User> = {
                data: updatedItem,
                isSuccess: true,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .delete("/:id", verifyToken, requireAdmin, async (req, res, next) => {
        try {
            const { id } = req.params
            if (req.user!.id === Number(id)) {
                return res.status(400).send({
                    data: null,
                    isSuccess: false,
                    message: "Cannot delete your own account",
                } as DataEnvelope<null>)
            }

            const removedItem = await remove(Number(id))
            const response: DataEnvelope<User> = {
                data: removedItem,
                isSuccess: true,
                message: `User ${removedItem.name} has been removed.`,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .post("/create", verifyToken, requireAdmin, async (req, res, next) => {
        try {
            const newItem = await create(req.body)
            const response: DataEnvelope<User> = {
                data: newItem,
                isSuccess: true,
            }
            res.status(201).send(response)
        } catch (err) {
            next(err)
        }
    })

export default app
