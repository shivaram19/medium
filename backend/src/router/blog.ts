import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string ;
  },
  Variables: {
    userId: string;
  }
}>()


blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const user =  await verify(authHeader, "secret")
  if( user ){
    c.set("userId", user.id)
    await next()
  }else {
    c.status(403)
    return c.json({
      msg : " you are not logged in "
    })
  }
})

blogRouter.post('/',async (c) => {
  
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const authorId = c.get("userId")
  const blog = await prisma.blog.create({
    data:{
      title: body.content,
      content: body.content,
      published: false,
      authorId: authorId
    }
  })
  
  return c.json({
    id : blog.id
  })

})

blogRouter.put('/',async (c) => {
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const authorId = c.get("userId")
  const isBlog = await prisma.blog.findUnique({
    where:{
      id: body.id
    }
  })
  if(!isBlog) return c.text("the blog you are searching for is not present")
  const blog = await prisma.blog.update({
    where:{
      id: isBlog.id
    },
    data:{
      title: body.title,
      content: body.content,
      authorId: authorId
    }
  })
  return c.json({
    title: blog.title
  })
})

  //todo : add pagination 
  blogRouter.get('/bulk',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const blogs = await prisma.blog.findMany()
    return c.json({
      blogs
  })

  blogRouter.get('/:id',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const body = c.req.param();
    const blog = await prisma.blog.findUnique({ 
      where:{
        id: body.id
      }
    })
      if(!blog) return c.text("the blog you are searching for is not present")

    return c.json({
      content: blog.content
    })
  })

})