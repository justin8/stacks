import cdk = require("@aws-cdk/core");
import { PolicyStatement, User, Effect, Policy } from "@aws-cdk/aws-iam";
import { Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { FilterPattern } from "@aws-cdk/aws-logs";
import { Duration } from "@aws-cdk/core";
import { LogGroupWrapper } from "@justin8-cdk/logwrapper";
import { Topic } from "@aws-cdk/aws-sns";

export interface s3BackupStackProps extends cdk.StackProps {
  alarmsTopic: Topic;
}

export class BackupsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: s3BackupStackProps) {
    super(scope, id);

    const bucket = new Bucket(this, "backupsBucket", {
      bucketName: `justin-dray-backups-${cdk.Aws.REGION}`,
      encryption: BucketEncryption.KMS_MANAGED,
    });

    bucket.addLifecycleRule({
      abortIncompleteMultipartUploadAfter: Duration.days(7),
    });

    const photoBackupsBucket = new Bucket(this, "photoBackups", {
      bucketName: `justin-dray-photo-backups-${cdk.Aws.REGION}`,
      encryption: BucketEncryption.KMS_MANAGED,
    });

    photoBackupsBucket.addLifecycleRule({
      abortIncompleteMultipartUploadAfter: Duration.days(7),
    });

    let users = [];
    for (let user of ["abachiBackups"]) {
      users.push(new User(this, user, { userName: user }));
    }

    const policies = [
      new Policy(this, "s3BackupsWriterPolicy", {
        policyName: "s3BackupsWriterPolicy",
        statements: [
          new PolicyStatement({
            actions: ["s3:*"],
            effect: Effect.ALLOW,
            resources: [
              bucket.bucketArn,
              bucket.arnForObjects("*"),
              photoBackupsBucket.bucketArn,
              photoBackupsBucket.arnForObjects("*"),
            ],
          }),
        ],
      }),
    ];

    for (let policy of policies) {
      for (let user of users) {
        user.attachInlinePolicy(policy);
      }
    }

    const logGroups = [
      new LogGroupWrapper(this, "s3Backup", {
        logGroupName: "/var/log/s3-backup.log",
        alarmsTopic: props.alarmsTopic,
        filterPattern: FilterPattern.anyTerm(
          "error",
          "Error",
          "does not exist"
        ),
        noLogsAlarm: {
          enabled: false,
        },
        errorsAlarm: {
          enabled: true,
          evaluationPeriods: 1,
          metricPeriod: cdk.Duration.minutes(5),
          threshold: 1,
        },
      }),
    ];
  }
}
