import cdk = require("@aws-cdk/core");
import { Topic, Subscription, SubscriptionProtocol } from "@aws-cdk/aws-sns";

export interface alarmsStackProps {
  alarmEmails: Array<string>;
  alarmsTopicName: string;
}

export class alarmsStack extends cdk.Stack {
  public alarmsTopic: Topic;

  constructor(scope: cdk.Construct, id: string, props: alarmsStackProps) {
    super(scope, id);

    this.alarmsTopic = new Topic(this, "alarmsTopic", {
      topicName: "alarmsTopic"
    });

    for (let email of props.alarmEmails) {
      new Subscription(this, email, {
        protocol: SubscriptionProtocol.EMAIL,
        topic: this.alarmsTopic,
        endpoint: email
      });
    }
  }
}
