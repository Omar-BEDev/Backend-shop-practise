import express from "express"
import handleErrors from "./api/middlewares/error.middleware"
import helmet from "helmet"
import ExpressMongoSanitize from "express-mongo-sanitize"
import orderRouter from "./api/routes/orders.route"
import productRouter from "./api/routes/products.route"
import userRouter from "./api/routes/users.route"

const app = express()

app.use(helmet())
app.use(express.json())
app.use(ExpressMongoSanitize())


app.use("/api/orders", orderRouter)
app.use("/api/products", productRouter)
app.use("/api/users",userRouter)

app.use(handleErrors)

export default app