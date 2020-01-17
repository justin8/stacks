import cdk = require("@aws-cdk/core");
import { Construct } from "@aws-cdk/core";
import codecommit = require("@aws-cdk/aws-codecommit");
import { Artifact, Pipeline } from "@aws-cdk/aws-codepipeline";
import actions = require("@aws-cdk/aws-codepipeline-actions");

export interface SourceProps {
  pipeline: Pipeline;
  repository: codecommit.Repository;
}

export class Source extends Construct {
  public pipelineAction: actions.CodeCommitSourceAction;
  public output: Artifact;
  constructor(parent: Construct, name: string, props: SourceProps) {
    super(parent, name);

    this.output = new Artifact();


    this.pipelineAction = new actions.CodeCommitSourceAction({
      actionName: name,
      repository: props.repository,
      output: this.output
    });

    props.pipeline.addStage({
      stageName: "Source",
      actions: [this.pipelineAction]
    });
  }
}
