import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string ;
  }
}>()

blogRouter.use("/*",(c, next) =>{
  // bunch of authentication checks need to be done 
  next()
})

blogRouter.post('/',async (c) => {

  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());

  const body = c.req.json()
  const isBlog = await prisma.blog.create({
   data : {
      title: body.title,
      content: body.content,
      authorId: "1"
    } 
  })

  return c.json({
    id: isBlog.id
  })
})

blogRouter.put('/',async (c) => {
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());

  const body = c.req.json()
  const isBlog = await prisma.blog.findMany({ where:{ id: body.id } })
  if(!isBlog) return c.text("the blog you are searching is not present")
   await prisma.blog.update({ 
      where: { id: isBlog.id },
      data :{
        title: body.title,
        content: body.content
      }
    })

  return c.json({
    id: blog.id
  })
})

blogRouter.get('/:id',async (c) => {
  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
  }).$extends(withAccelerate());

  const body = c.req.json()
  const isBlog = await prisma.blog.findMany({ where:{ id: body.id } })
  if(!isBlog) return c.text("the blog you are searching is not present")
   await prisma.blog.findUnique({ 
      where: { id: isBlog.id },

    })

  return c.json({
    id: blog.id
  })
  return c.text("hello world")
})

blogRouter.get('/bulk',(c) => {
  return c.text("hello world")
})