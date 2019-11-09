const axios = require('axios')

const express = require("express");
const app = express();
const port = 6777;

app.post("*", async (req, res) => {

    const {
        originalUrl,
        query: {
            access_token
        },
        body
    } = req;

    const connnetMarkdown = {
        title: "test title",
        text: "这是一个 test 提交"
    }


    const dingdingReq = {
        msgtype: "markdown",
        markdown: connnetMarkdown,
        isAtAll: false
    }
    const dingUrl = `https://oapi.dingtalk.com${originalUrl}`;

    const dingResult = await axios.post(dingUrl, dingdingReq);

    const {
        data
    } = dingResult;

    res.send(data);

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))