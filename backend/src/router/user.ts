import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string ;
  }
}>()


userRouter.post('/signup',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  
  const alreadyUser = await prisma.user.findUnique({
    where:{
      email: body.email
    }
  })
  if(alreadyUser) return c.text("already Registered please login to continue")
  const user = await prisma.user.create({
    data:{
      email: body.email,
      password: body.password
    }
  })

  const token = await sign({id : user.id}, "secret")

  return c.json({
    token: token
  })
})

userRouter.post('/signin',async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({where: { email: body.email } } );

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, "secret");
	return c.json({ jwt }); 
})