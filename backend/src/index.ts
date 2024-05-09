import { Hono } from 'hono'
import { blogRouter } from './router/blog';
import { userRouter } from './router/user';
const app = new Hono<{
  Bindings:{
    DATABASE_URL: string;
  }
}>();

app.route("/api/v1/user", userRouter)
app.route("/api/v1/blog", blogRouter)



export default app
