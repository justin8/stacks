import * as cdk from "@aws-cdk/core";
import sqs = require("@aws-cdk/aws-sqs");
import lambda = require("@aws-cdk/aws-lambda");
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";

export class LambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "queue", {
      queueName: "example-queue",
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const lambdaFunction = new lambda.Function(this, "function", {
      functionName: "example-queue-processor",
      runtime: lambda.Runtime.PYTHON_3_7,
      timeout: cdk.Duration.seconds(300),
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda-source")
    });

    lambdaFunction.addEventSource(new SqsEventSource(queue, { batchSize: 10 }));
  }
}
