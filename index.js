const aws = require('aws-sdk')
const stepfunctions = new aws.StepFunctions({ region: 'us-east-1' })

const stepFunctionsArns =
  {
    plaid: 'arn:aws:states:us-east-1:537508223032:stateMachine:plaid-transactions-event',
    belvo: 'arn:aws:states:us-east-1:537508223032:stateMachine:belvo-transactions-event',
    yapily: 'arn:aws:states:us-east-1:537508223032:stateMachine:yapily-transactions-event',
    enable: 'arn:aws:states:us-east-1:537508223032:stateMachine:enable-transactions-event'
  }

exports.handler = async (event) => {
  try {
    for (const { body, messageAttributes } of event.Records) {
      await callStepFunction(messageAttributes, body)
      const response = {
        statusCode: 200,
        body: `Successfully processed ${event.Records.length} messages.`
      }
      return response
    }
  } catch (error) {
    console.error('An error occured while calling the step functions')
    console.error(error)
    const response = {
      statusCode: 500,
      body: `Failed to process ${event.Records.length} messages.`
    }
    return response
  }
}

async function callStepFunction (messageAttributes, body) {
  const apiAggregor = messageAttributes.ApiAggregor.stringValue
  const params = {
    stateMachineArn: stepFunctionsArns[apiAggregor],
    input: body
  }
  await stepfunctions.startExecution(params).promise()
}
