import cdk = require("@aws-cdk/core");
import { Construct } from "@aws-cdk/core";
import codecommit = require("@aws-cdk/aws-codecommit");
import { Artifact, Pipeline } from "@aws-cdk/aws-codepipeline";
import {
  PipelineProject,
  BuildSpec,
  Project,
  Cache,
  LocalCacheMode
} from "@aws-cdk/aws-codebuild";

import actions = require("@aws-cdk/aws-codepipeline-actions");

export interface SourceProps {
  pipeline: Pipeline;
  buildSpec: BuildSpec;
  input: Artifact;
}

export class CodeBuild extends Construct {
  public buildProject: PipelineProject;
  public pipelineAction: actions.CodeBuildAction;
  public output: Artifact;
  constructor(parent: Construct, name: string, props: SourceProps) {
    super(parent, name);

    this.output = new Artifact();

    this.buildProject = new PipelineProject(this, "project", {
      buildSpec: props.buildSpec,
      timeout: cdk.Duration.minutes(10)
    });

    this.pipelineAction = new actions.CodeBuildAction({
      actionName: name,
      project: this.buildProject,
      input: props.input,
      outputs: [this.output]
    });

    props.pipeline.addStage({
      stageName: name,
      actions: [this.pipelineAction]
    });
  }
}
