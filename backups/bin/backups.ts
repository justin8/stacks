#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { BackupsStack } from "../lib/backups-stack";
import { alarmsStack } from "@justin8-cdk/alarms-stack";

const app = new cdk.App();
const alarmsTopicName = "alarmsTopic";
const region = "us-east-1";

const alarms = new alarmsStack(app, "alarms-stack", {
  alarmEmails: ["justin@dray.be"],
  alarmsTopicName: alarmsTopicName,
  env: { region },
});

const backups = new BackupsStack(app, "BackupsStack", {
  alarmsTopic: alarms.alarmsTopic,
  env: { region },
});
