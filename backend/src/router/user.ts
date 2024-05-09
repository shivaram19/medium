import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string ;
  }
}>()


userRouter.post('/signup',async (c) => {

  console.log("1")
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  console.log("2")


  const body = await c.req.json()
  const alreadyUser = await prisma.user.findUnique({ where: { email: body.email } })

  console.log("3")


  if(alreadyUser) {
   c.status(403)
   return c.json({msg: "hakunamatata"})
  }


  console.log("4")

  const newUser = await prisma.user.create({
    data: {
      email: body.email, 
      password: body.password
    }
  })

  const token = await sign({ id: newUser.id }, "ashhuhd" )

  return c.json({  token })

})

userRouter.post('/api/v1/user/signin',async (c) => {
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