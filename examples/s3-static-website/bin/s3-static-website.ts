#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3StaticWebsiteStack } from '../lib/s3-static-website-stack';

const app = new cdk.App();
new S3StaticWebsiteStack(app, 'S3StaticWebsiteStack');
