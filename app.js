import express, { request, response } from 'express';
import bodyParser from 'body-parser';

// tod o create todo, update todo by id, deleat todo by id, get todo

// id status = compleated, in-progress, cancle name

const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))

let todolist = [];

//การส่งข้อมูล หรือการสร้าง
app.post('/todo', (request, response)=>{
    console.log('body data', request.body)
    todolist.push(request.body);
    response.send(request.body);
})
//การแสดงข้อมูล
app.get('/todo',(request, response)=>{
    response.send(todolist);
})
//การลบข้อมูล
app.delete('/todo/:id',(request, response)=>{
    const todoindex = todolist.findIndex((todo)=>todo.id === request.params.id);
    if(todoindex === -1){
        response.status(404).send('todo not found')
    }
    todolist.splice(todoindex,1);
    response.send(request.params.id)
})
//การอัพเดทข้อมูล
app.patch('/todo/:id', (request, response)=>{
    const todoindex = todolist.findIndex((todo)=> todo.id === request.params.id)
    if(todoindex === -1){
        response.status(404).send('todo not found')
        return;
    }
    todolist[todoindex] = {...todolist[todoindex],...request.body};
    response.send(todolist[todoindex]);
})
//การอัพเดทเหมือนกันแต่เป็นการ เขียนทับข้อมูลทั้งก้อน เช่น มี ข้อมูล 3 ตัว เราแก้ แค่ 1 ใน 3 ตัว จะทับให้ข้อมูลทั้ง3 เหลือแค่ 1(จากข้อมูลที่ส่งไป 1 ตัวเช่น มีtest 1-3 แก้ test 3 1-2 เหมือนเดิม 3 เปลี่ยน)
app.put('/todo/:id', (request, response)=>{
    const todoindex = todolist.findIndex((todo)=> todo.id === request.params.id)
    if(todoindex === -1){
        response.status(404).send('todo not found')
        return;
    }
    todolist[todoindex] = request.body;
    response.send(todolist[todoindex]);
})

//การ get ทีละไอดี
app.get('/todo/:id',(request, response )=>{
    const todo = todolist.find((todo)=> todo.id === request.params.id);
    if(todo){
        response.send(todo);
    }
    response.status(404).send('todo not found');
});
//การเพิ่มข้อมูลทีละ 1+ เช่น 3 ไอดีเพิ่มไปทีเดียว
app.post("/todo/bulk",(request, response)=>{
    todolist.push(...request.body);
    response.send(request.body);
})

app.delete('/todo',(request, response)=>{
    const listIds = request.query.in.split(',')
    console.log('lisIds', lisIds)

    todolist = todolist.filter((todo)=> !listIds.includes(todo.id))

    response.send(listIds)
});

app.listen(8080, ()=>{
    console.log('localhost:8080')
})
