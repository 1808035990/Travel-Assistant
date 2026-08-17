import express from 'express'
import travelService from '../service/travelService.js'
import { createStreamResponse } from '../utils/streamUtils.js'

const router = express.Router()

router.post('/recommend', async (req, res) => {
    const { city, budget, days } = req.body
    if (!city || !budget || !days) {
        return res.status(400).json({
            success: false,
            error: '缺少必要参数：city, budget, days'
        })
    }
    const result = await travelService.recommend(city, budget, days)
    return res.json(result)
})

router.post('/chat', async (req, res) => {
    const { message } = req.body
    if (!message) {
        return res.status(400).json({
            success: false,
            error: '缺少必要参数：message'
        })
    }
    // 对SSE流式接口返回处理
    const stream = createStreamResponse(res)

    // 调用大模型获取流式响应
    const result = await travelService.chat(message, (chunk) => {
        stream.send({ type: 'chunk', content: chunk })
    });
    stream.send({ type: 'complete', data: result })
    stream.end()
})

export default router