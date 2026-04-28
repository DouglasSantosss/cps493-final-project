import express from "express"
import usersController from "./controllers/users"
import activitiesController from "./controllers/activities"
import exerciseTypesController from "./controllers/exerciseTypes"
import { DataEnvelope } from "./types"
import { config } from "dotenv"

config()

const PORT = process.env.PORT ?? 3000
const SERVER = process.env.SERVER ?? "localhost"
const STATIC_DIR = process.env.STATIC_DIR ?? "client/dist"

const app = express()


app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "*")
    next()
}).use(express.json())
// check this before deployment

app.use(express.static(STATIC_DIR))

    .use("/api/v1/users", usersController)
    .use("/api/v1/activities", activitiesController)
    .use("/api/v1/exercise-types", exerciseTypesController)


app.use(
    (
        err: Error & { status?: number },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        console.error(err)

        const response: DataEnvelope<null> = {
            data: null,
            isSuccess: false,
            message: err.message ?? "An error occurred",
        }

        res.status(err.status ?? 500).send(response)
    },
)

app.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER}:${PORT}`)
})
