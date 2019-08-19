#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AbachiCloudwatchStack } from '../lib/abachi-cloudwatch-stack';

const app = new cdk.App();
new AbachiCloudwatchStack(app, 'AbachiCloudwatchStack');
