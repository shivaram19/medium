import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@shivaram19/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";


export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string ;
    JWT_SECRET: string ;
  },
  Variables: {
    userId: string;
  }
}>()


blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const user =  await verify(authHeader,c.env.JWT_SECRET )
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
  const { success } = createBlogInput.safeParse(body)
  if(!success){
    c.status(403)
    return c.json({
      msg:"input details are wrong"
    })
  }
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
  const { success } = updateBlogInput.safeParse(body)
  if(!success){
    c.status(403)
    return c.json({
      msg:"input details are wrong"
    })
  }
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
     
    }
  })
  return c.json({
    title: blog.title
  })
})
  blogRouter.get('/:id',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const id = c.req.param("id");
    const blog = await prisma.blog.findUnique({ 
      where:{
        id: id
      }
    })
      if(!blog) return c.text("the blog you are searching for is not present")

    return c.json({
      content: blog.content
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


})