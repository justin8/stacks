import cdk = require('@aws-cdk/core');
import {Construct} from '@aws-cdk/core';
import {Artifact, Pipeline} from '@aws-cdk/aws-codepipeline';
import actions = require('@aws-cdk/aws-codepipeline-actions');
import {PipelineProject, BuildSpec, Project, Cache, LocalCacheMode} from '@aws-cdk/aws-codebuild';
import {PolicyStatement, Effect} from '@aws-cdk/aws-iam';
import {pipeline} from 'stream';

export interface CodeBuildProps {
  pipeline: Pipeline;
  input: Artifact;
  buildSpec: BuildSpec;
  cache?: Cache;
  priveleged?: boolean;
  timeout?: cdk.Duration;
}

export class CodeBuild extends Construct {
  public project: PipelineProject;
  public output: Artifact;
  public defaultProps = {
    cache: Cache.none(),
    priveleged: false,
    timeout: cdk.Duration.minutes(10),
  }

  constructor(parent: Construct, name: string, props: CodeBuildProps) {
    super(parent, name);

    props = {
      ...this.defaultProps,
      ...props,
    };

    this.output = new Artifact();

    this.project = new PipelineProject(this, name + '-project', {
      buildSpec: props.buildSpec,
      cache: props.cache,
      timeout: props.timeout,
      environment: {
        privileged: props.priveleged,
      }
    });

    const action = new actions.CodeBuildAction({
      actionName: name,
      project: this.project,
      input: props.input,
      outputs: [this.output],
    });

    props.pipeline.addStage({stageName: name, actions: [action]});
  }
}