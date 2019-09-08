#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { HassStack } from '../lib/hass-stack';

const app = new cdk.App();
new HassStack(app, 'HassStack');
