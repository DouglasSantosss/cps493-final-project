import { Router } from "express"
import { getAll, get, create, update, remove, calculateCalories } from "../models/exerciseTypes"
import { ExerciseType, DataEnvelope, DataListEnvelope } from "../types"
import { verifyToken, requireAdmin } from "../middleware/auth"

const app = Router()

app.get("/", verifyToken, async (_req, res, next) => {
    try {
        const { list, count } = await getAll()
        const response: DataListEnvelope<ExerciseType> = {
            data: list,
            isSuccess: true,
            total: count,
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
            const response: DataEnvelope<ExerciseType> = {
                data: item,
                isSuccess: true,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .post("/calculate-calories", verifyToken, async (req, res, next) => {
        try {
            const { typeName, duration } = req.body
            if (!typeName || !duration) {
                return res.status(400).send({
                    data: null,
                    isSuccess: false,
                    message: "typeName and duration required",
                } as DataEnvelope<null>)
            }

            const calories = await calculateCalories(typeName, duration)
            const response: DataEnvelope<{ calories: number }> = {
                data: { calories },
                isSuccess: true,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })
    .post("/", verifyToken, requireAdmin, async (req, res, next) => {
        try {
            const { name, category, caloriesPerMinute, icon } = req.body
            if (!name || !category) {
                return res.status(400).send({
                    data: null,
                    isSuccess: false,
                    message: "name and category required",
                } as DataEnvelope<null>)
            }

            const newItem = await create({
                name,
                category,
                caloriesPerMinute: caloriesPerMinute || 5,
                icon: icon || "🎯",
            })
            const response: DataEnvelope<ExerciseType> = {
                data: newItem,
                isSuccess: true,
            }
            res.status(201).send(response)
        } catch (err) {
            next(err)
        }
    })
    .patch("/:id", verifyToken, requireAdmin, async (req, res, next) => {
        try {
            const { id } = req.params
            const updatedItem = await update(Number(id), req.body)
            const response: DataEnvelope<ExerciseType> = {
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
            const removedItem = await remove(Number(id))
            const response: DataEnvelope<ExerciseType> = {
                data: removedItem,
                isSuccess: true,
                message: `Exercise type ${removedItem.name} has been removed.`,
            }
            res.send(response)
        } catch (err) {
            next(err)
        }
    })

export default app
