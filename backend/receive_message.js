import 'dotenv/config'
import aws from 'aws-sdk'

aws.config.update({ region: 'us-east-2' })
const sqs = new aws.SQS()

function receiveMessages() {
    sqs.receiveMessage({
        QueueUrl: process.env.QUEUE_URL,
        WaitTimeSeconds: 10,
        MaxNumberOfMessages: 5,
    }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Mensagens recebidas: " + data.Messages.length)
            data.Messages.forEach(element => {
                console.log(`Message ID: ${element.MessageId}  Message Body ${element.Body}`)
                deleteMessageQueue(element.ReceiptHandle)
            });
        }
    })
}

function deleteMessageQueue(receiptHandle) {
    sqs.deleteMessage({
        QueueUrl: process.env.QUEUE_URL,
        ReceiptHandle: receiptHandle
    }, (err) => {
        if(err) console.log(err)
    })
}

setInterval(() => {
    receiveMessages()
}, 5000)