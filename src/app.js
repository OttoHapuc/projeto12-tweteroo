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

app.get("/tweets/:id?", (req, res) => {

    const everyTweets = tweets.map((tweet) => avatarForTweet(tweet));

    const USERNAME = req.params.id;
    if(USERNAME)res.status(200).send(tweets.filter((tweet) => (tweet.username === USERNAME) && avatarForTweet(tweet)))

    if(tweets.length === 0) res.status(200).send(tweets)

    res.status(200).send(everyTweets.slice(-10,everyTweets.length));
})

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;



    if (!username || !avatar) res.status(400).send("object invalid");
    if (Number(username)) res.status(400).send("username is not a string");
    if (Number(avatar)) res.status(400).send("url is not a string");

    users.push({
        username: username,
        avatar: avatar
    });

    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {

    const { username, tweet } = req.body;
    const existUser = users.find(user => user.username == username);

    const head = req.headers
    const existUserHeaders = users.find(user => user.username == head.username)

    if(head.username){
        if(!existUserHeaders)res.status(401).send("user not found");
        tweets.push({
            username: head.username,
            tweet: tweet
        });
    
        res.status(201).send("OK");
    }

    if (!username || !tweet) res.status(400).send("object invalid");
    if (!existUser) res.status(401).send("user not found");
    if (Number(tweet)) res.status(400).send("tweet is not a string");

    tweets.push({
        username: username,
        tweet: tweet
    });

    res.status(201).send("OK");
})

app.listen(PORT);