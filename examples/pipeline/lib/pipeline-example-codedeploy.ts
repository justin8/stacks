import cdk = require("@aws-cdk/core");
import { Construct } from "@aws-cdk/core";
import codecommit = require("@aws-cdk/aws-codecommit");
import { Artifact, Pipeline } from "@aws-cdk/aws-codepipeline";
import codedeploy = require("@aws-cdk/aws-codedeploy");

import actions = require("@aws-cdk/aws-codepipeline-actions");

export interface SourceProps {
  pipeline: Pipeline;
  input: Artifact;
}

export class CodeDeploy extends Construct {
  public codeDeployApp: codedeploy.ServerApplication;
  public pipelineAction: actions.CodeDeployServerDeployAction;
  public output: Artifact;
  constructor(parent: Construct, name: string, props: SourceProps) {
    super(parent, name);

    this.output = new Artifact();

    this.codeDeployApp = new codedeploy.ServerApplication(this, "application", {
    applicationName: name
    })

    const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, "deploymentgroup",{application: this.codeDeployApp})


    this.pipelineAction = new actions.CodeDeployServerDeployAction({
      actionName: name,
      deploymentGroup: deploymentGroup,
      input: props.input
    });

    props.pipeline.addStage({
      stageName: name,
      actions: [this.pipelineAction]
    });
  }
}
