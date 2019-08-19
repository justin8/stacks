#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CloudwatchLogsRetentionStack } from '../lib/cloudwatch-logs-retention-stack';

const app = new cdk.App();
new CloudwatchLogsRetentionStack(app, 'CloudwatchLogsRetentionStack');
