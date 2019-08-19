import cdk = require('@aws-cdk/core');
import {PolicyStatement, Effect} from '@aws-cdk/aws-iam';
import targets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import events = require('@aws-cdk/aws-events');

import fs = require('fs');

export class CloudwatchLogsRetentionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logLimiterLambda = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.PYTHON_3_7,
      timeout: cdk.Duration.seconds(300),
      handler: 'index.main',
      code: lambda.Code.asset('lambda'),
    });

    logLimiterLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['*'],
      actions: [
        'logs:DescribeLogGroups',
        'logs:PutRetentionPolicy',
      ]
    }));

    const logLimiterLambdaRule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.rate(cdk.Duration.days(7)),
    });

    logLimiterLambdaRule.addTarget(
        new targets.LambdaFunction(logLimiterLambda));
  }
}
