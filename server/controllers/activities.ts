import { Router } from "express"
import { getAll, get, getByUserId, getByUserIds, create, update, remove } from "../models/activities"
import { get as getUser } from "../models/users"
import { Activity, DataEnvelope, DataListEnvelope } from "../types"
import { verifyToken, requireAdmin } from "../middleware/auth"

const app = Router()

app.get("/", verifyToken, requireAdmin, async (_req, res, next) => {
    try {
        const { list, count } = await getAll()
        const response: DataListEnvelope<Activity> = {
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
            const { list, count } = await getByUserId(req.user!.id)
            const response: DataListEnvelope<Activity> = {
                data: list,
                isSuccess: true,
                total: count,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .get("/friends", verifyToken, async (req, res, next) => {
        try {
            const user = await getUser(req.user!.id)
            const friendIds = user.friendIds || []
            const list = await getByUserIds(friendIds)
            const response: DataListEnvelope<Activity> = {
                data: list,
                isSuccess: true,
                total: list.length,
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
            const response: DataEnvelope<Activity> = {
                data: item,
                isSuccess: true,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .post("/", verifyToken, async (req, res, next) => {
        try {
            const newItem = await create({ ...req.body, userId: req.user!.id })
            const response: DataEnvelope<Activity> = {
                data: newItem,
                isSuccess: true,
            }
            res.status(201).send(response)
        } catch (err) {
            next(err)
        }
    })
    .patch("/:id", verifyToken, async (req, res, next) => {
        try {
            const { id } = req.params
            const item = await get(Number(id))
            const isOwner = req.user!.id === item.userId
            const isAdmin = req.user!.role === "admin"

            if (!isOwner && !isAdmin) {
                return res.status(403).send({
                    data: null,
                    isSuccess: false,
                    message: "Access denied",
                } as DataEnvelope<null>)
            }

            const updateData = { ...req.body }
            delete updateData.userId
            const updatedItem = await update(Number(id), updateData)
            const response: DataEnvelope<Activity> = {
                data: updatedItem,
                isSuccess: true,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .delete("/:id", verifyToken, async (req, res, next) => {
        try {
            const { id } = req.params
            const item = await get(Number(id))
            const isOwner = req.user!.id === item.userId
            const isAdmin = req.user!.role === "admin"

            if (!isOwner && !isAdmin) {
                return res.status(403).send({
                    data: null,
                    isSuccess: false,
                    message: "Access denied",
                } as DataEnvelope<null>)
            }

            const removedItem = await remove(Number(id))
            const response: DataEnvelope<Activity> = {
                data: removedItem,
                isSuccess: true,
                message: `Activity "${removedItem.title}" has been removed.`,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })

export default app
