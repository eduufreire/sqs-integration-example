import 'dotenv/config'
import express from 'express'
import aws from 'aws-sdk'

const app = express()

app.use(express.static('../frontend'))
app.use(express.json())

aws.config.update({ region: 'us-east-2'})
const sqs = new aws.SQS()

app.post('/queue', (req, res) => {
    const quantidade = parseInt(req.body.quantidade)

    for (let index = 0; index < quantidade; index++) {

        sqs.sendMessage({
            MessageBody: `Hello World ${index + 1}`,
            QueueUrl: process.env.QUEUE_URL,
        }, (err, data) => {
            if(err) {
                console.log(err)
            } else {
                console.log("Sucesse send message: " + data.MessageId)
            }
        })
        
    }
    
    res.json({
       ok: true 
    })
})

app.listen(3333, () => {
    console.log("Server running!")
})