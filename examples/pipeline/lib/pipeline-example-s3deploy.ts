import cdk = require("@aws-cdk/core");
import { Construct } from "@aws-cdk/core";
import codecommit = require("@aws-cdk/aws-codecommit");
import { Artifact, Pipeline } from "@aws-cdk/aws-codepipeline";
import codedeploy = require("@aws-cdk/aws-codedeploy");
import s3 = require("@aws-cdk/aws-s3");

import actions = require("@aws-cdk/aws-codepipeline-actions");

export interface SourceProps {
  pipeline: Pipeline;
  input: Artifact;
}

export class S3Deploy extends Construct {
  public bucket: s3.Bucket;
  public pipelineAction: actions.S3DeployAction;
  constructor(parent: Construct, name: string, props: SourceProps) {
    super(parent, name);

    this.bucket = new s3.Bucket(this, "bucket", {});

    this.pipelineAction = new actions.S3DeployAction({
      actionName: name,
      bucket: this.bucket,
      input: props.input
    });

    props.pipeline.addStage({
      stageName: name,
      actions: [this.pipelineAction]
    });
  }
}
