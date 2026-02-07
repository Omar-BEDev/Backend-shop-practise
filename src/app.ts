import express from "express"
import handleErrors from "./api/middlewares/error.middleware"
import helmet from "helmet"
import ExpressMongoSanitize from "express-mongo-sanitize"
import orderRouter from "./api/routes/orders.route"
import productRouter from "./api/routes/products.route"
import userRouter from "./api/routes/users.route"
import swaggerui from "swagger-ui-express"
import swaggerDocument from "./docs/swagger.json"
import cors from "cors"
import { authToken } from "./api/middlewares/auth.middeleware"
import { isSuperAdmin } from "./api/middlewares/users.middleware"
const app = express()

app.use(helmet())
app.use(express.json())
app.use(ExpressMongoSanitize())

app.use(cors({
  origin : "https://hoppscotch.io", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use("/api/orders", orderRouter)
app.use("/api/products", productRouter)
app.use("/api/users",userRouter)
app.use("/docs",authToken,isSuperAdmin,swaggerui.serve,swaggerui.setup(swaggerDocument))
app.use(handleErrors)

export default app
