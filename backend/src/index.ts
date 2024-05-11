import { Hono } from 'hono'
import { blogRouter } from './router/blog';
import { userRouter } from './router/user';
const app = new Hono<{
  Bindings:{
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.route("/api/v1/user", userRouter)
app.route("/api/v1/blog", blogRouter)
app.get("/", (c)=> {
  return c.text("hakuna")
})


export default app
