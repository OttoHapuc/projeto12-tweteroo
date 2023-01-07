import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 5000;

const users = [];
const tweets = [];

function avatarForTweet(tweet) {
    const {avatar} =users.find(u => (u.username === tweet.username) && u.avatar)
    const obj = {
        username: tweet.username,
        avatar: avatar,
        tweet: tweet.tweet
    }

    return obj;
}

app.get("/tweets", (req, res) => {

    const everyTweets = tweets.map((tweet) => avatarForTweet(tweet));

    res.send(everyTweets.slice(-10,everyTweets.length));
})

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!username || !avatar) res.status(400).send("object invalid");

    users.push({
        username: username,
        avatar: avatar
    });

    res.status(200).send("OK");
});

app.post("/tweets", (req, res) => {

    const { username, tweet } = req.body;
    const existUser = users.find(user => user.username == username)

    console.log(req.body)
    console.log(existUser)

    if (!username || !tweet) res.status(400).send("object invalid");

    if (!existUser) res.status(401).send("user not found");

    tweets.push({
        username: username,
        tweet: tweet
    })

    res.send("OK")
})

app.listen(PORT);