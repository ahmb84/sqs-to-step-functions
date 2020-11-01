const aws = require('aws-sdk')
const stepfunctions = new aws.StepFunctions({ region: 'us-east-1' })

const stateMachineArn = 'arn:aws:states:us-east-1:537508223032:stateMachine:standard-bank-aggregator-transactions-event-pipeline'

exports.handler = async (event) => {
  try {
    for (const { body } of event.Records) {
      await stepfunctions.startExecution({ stateMachineArn, input: body }).promise()
    }
  } catch (error) {
    console.error('An error occured while calling the step functions')
    console.error(error)
    throw error
  }
}
