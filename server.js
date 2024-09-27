import express from 'express'
import http from 'http'
import path from 'path'
import {Server} from 'socket.io'

const app=express()
const server=http.createServer(app)
let __dirname = path.resolve()
app.use(express.static(path.join(__dirname,'public')))

let io = new Server(server)
io.on("connection",(socket)=>{
    console.log("user created")
    socket.on("set username",(username)=>{
        if(username){
            socket.username = username
            io.emit("user connected",`${username} has joined the chat`)
        }
    })

    socket.on("chat message",(message)=>{
        if(socket.username){
            io.emit("chat message",{username:socket.username,message:message})
        }
        else console.log("user is not set")
    })

    socket.on("disconnect",()=>{
        if(socket.username){
            io.emit("user disconnected",`${socket.username} has left the chat`)
        }
    })
})

// http://localhost:3000
app.get('/',(req,res)=>{res.sendFile(__dirname + '/index.html')})
let PORT=3000
server.listen(PORT,()=>console.log(`server started at http://localhost:${PORT}`))