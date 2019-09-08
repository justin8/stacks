import cdk = require('@aws-cdk/core');
import {Construct} from '@aws-cdk/core';
import {Artifact, Pipeline} from '@aws-cdk/aws-codepipeline';
import actions = require('@aws-cdk/aws-codepipeline-actions');

export interface SourceProps {
  githubRepo: string;
  pipeline: Pipeline;
}

export class Source extends Construct {
  public output: Artifact;
  constructor(parent: Construct, name: string, props: SourceProps) {
    super(parent, name);
    this.output = new Artifact();
    const sourceAction = new actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: props.githubRepo.split('/')[0],
      repo: props.githubRepo.split('/')[1],
      oauthToken: cdk.SecretValue.secretsManager('github-token'),
      output: this.output,
      trigger: actions.GitHubTrigger.WEBHOOK
    });
    props.pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });
  }
}