const axios = require("axios")
const _ = require("lodash")
const bodyParser = require("body-parser")
const express = require("express");
const app = express();
const port = 6777;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));





const protocolMesTemplate = {
    title: "",
    text: ""
}

const destructTentMes = (body) => {
    const template = _.cloneDeep(protocolMesTemplate);
    /**
     * 获取 text
     * @param {*} text 
     */
    const getMarkdownTextTemp = (text) => {
        return `> ${text} \n`
    }
    const getUsername = (pusher) => {
        const {
            name,
            username,
        } = pusher;
        return name ? name : username;
    }

    const getEntranceTitle = (resultTexts, body) => {
        const {
            pusher
        } = body;
        const pusherName = getUsername(pusher);
        resultTexts = resultTexts + `${pusherName}提交了代码`;
        return resultTexts;
    }

    const getCardTitle = (resultTexts, body) => {

        const {
            pusher,
            repository: {
                name: repoName
            },
            ref
        } = body;
        const pusherName = getUsername(pusher);
        const cardTitle = `${pusherName} to ${ref} at ${repoName}\n`;
        resultTexts = resultTexts + cardTitle;
        return resultTexts;
    }

    const getCardBody = (resultTexts, body) => {
        const {
            commits
        } = body;
        commits.forEach(commit => {
            const {
                message
            } = commit;

            const resultMes = getMarkdownTextTemp(message);
            resultTexts = `${resultTexts}${resultMes}`;
        });
        return resultTexts;
    }
    // 聊天窗口的 title
    let entranceTitle = "";
    template.title = getEntranceTitle(entranceTitle, body);
    // 具体内容的 title 的具体 commits
    let resultTexts = "";
    resultTexts =  getCardTitle(resultTexts, body);
    resultTexts = getCardBody(resultTexts, body);
    template.text = resultTexts;
    return template;
}
/**
 * 获取钉钉的内容
 */
const getDingMes = (protocolMesTemplate) => {

    const dingdingReq = {
        msgtype: "markdown",
        markdown: protocolMesTemplate,
        isAtAll: false
    }
    return dingdingReq;
}

app.post("*", async (req, res) => {

    const {
        originalUrl,
        body
    } = req;

    console.log("body" + body);
    const preTemp = destructTentMes(body);

    // 拼装请求
    const dingdingReq = getDingMes(preTemp);

    // 发送请求
    const dingUrl = `https://oapi.dingtalk.com${originalUrl}`;

    const dingResult = await axios.post(dingUrl, dingdingReq);

    const {
        data
    } = dingResult;

    res.send(data);

})

app.listen(port, () => console.log(`tending bot listening on port ${port}!`))