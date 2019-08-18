#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { BackupsStack } from '../lib/backups-stack';

const app = new cdk.App();
new BackupsStack(app, 'BackupsStack', {
});
