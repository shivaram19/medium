import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('api/v1/user/signup',(req, res) => {
  return 
})

app.post('/api/v1/user/signin',(){

})

app.post('/api/v1/blog',(){

})

app.put('/api/v1/blog',(){
  
})

app.get('/api/v1/blog/:id',{

})

app.get('api/v1/blog/bulk',(){

})
export default app
