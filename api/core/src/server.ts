import express, {Request, Response} from "express";
import {routes} from "./routes";
import {errorHandler} from "./core/middlewares/ErrorHandler";

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const Pusher = require('pusher');
// const cors = require('cors');
// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', routes)
app.use(errorHandler)

export const pusher = new Pusher({
    appId: "1594774",
    key: "5918ae5c8a1c68cce96d",
    secret: "e90760e33013f1523e9b",
    cluster: "sa1",
    useTLS: true
});

app.get("/", function (req: Request, res: Response) {
    res.send("Bohr Express template");
});

app.post("/pusher/auth", function (req, res) {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const id = req.body.id;

    const presenceData = {
        user_id: id,
        user_info: {user_id: id},
    };
    // This authenticates every user. Don't do this in production!
    const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
    res.send(authResponse);
});

if (!module.parent) {
    app.listen(port);
    console.log("Express started on port 3000");
}

export default app;
