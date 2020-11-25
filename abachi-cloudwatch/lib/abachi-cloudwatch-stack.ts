import cdk = require("@aws-cdk/core");
import { User, ManagedPolicy } from "@aws-cdk/aws-iam";

export class AbachiCloudwatchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const user = new User(this, "abachiCloudwatch", {
      userName: "abachiCloudwatch",
    });

    user.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
    );
  }
}
