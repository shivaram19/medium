import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt"
import { signInInput } from "@shivaram19/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string ;
    JWT_SECRET: string;
  }
}>()


userRouter.post('/signup',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const { success } = signInInput.safeParse(body)
  if(!success){
    c.status(403)
    return c.json({
      msg:"input details are wrong"
    })
  }
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

  const token = await sign({id : user.id}, c.env.JWT_SECRET)

  return c.json({
    token: token
  })
})

userRouter.post('/signin',async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
  const { success } = signInInput.safeParse(body);
  if(!success){
      c.status(403)
      return c.json({
        msg:"input details are wrong"
      })
    } 
	const user = await prisma.user.findUnique({where: { email: body.email } } );

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt }); 
})