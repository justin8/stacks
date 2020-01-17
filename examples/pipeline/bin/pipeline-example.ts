#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { PipelineExampleStack } from '../lib/pipeline-example-stack';

const app = new cdk.App();
new PipelineExampleStack(app, 'PipelineExampleStack');
