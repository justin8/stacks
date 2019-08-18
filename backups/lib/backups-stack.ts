import cdk = require('@aws-cdk/core');
import {PolicyStatement, User, Effect, Policy} from '@aws-cdk/aws-iam';
import {Bucket, BucketEncryption} from '@aws-cdk/aws-s3';
import {Duration} from '@aws-cdk/core';

export class BackupsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'backupsBucket', {
      bucketName: `justin-dray-backups-${cdk.Aws.REGION}`,
      encryption: BucketEncryption.KMS_MANAGED,
    });

    bucket.addLifecycleRule({
      abortIncompleteMultipartUploadAfter: Duration.days(7),
    });


    let users = [];
    for (let user of ['abachiBackups']) {
      users.push(new User(this, user, {userName: user}))
    }

    const policies = [new Policy(this, 's3BackupsWriterPolicy', {
      policyName: 's3BackupsWriterPolicy',
      statements: [new PolicyStatement({
        actions: ['s3:*'],
        effect: Effect.ALLOW,
        resources: [bucket.bucketArn, bucket.arnForObjects('*')]
      })]
    })];

    for (let policy of policies) {
      for (let user of users) {
        user.attachInlinePolicy(policy);
      }
    }
  }
}
