import cdk = require('@aws-cdk/core');
import {Source} from './hass-source';
import {Pipeline} from '@aws-cdk/aws-codepipeline';
import {CodeBuild} from './hass-codebuild';
import {BuildSpec, PipelineProject, LocalCacheMode, Cache} from '@aws-cdk/aws-codebuild';
import {PolicyStatement, Effect} from '@aws-cdk/aws-iam';

export class HassStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubRepo = 'justin8/home-assistant-config';
    const homeAssistantSecretsARN = getParameterARN('home-assistant-secrets');
    const deploymentKeyARN = getParameterARN('deployment-key');

    const pipeline = new Pipeline(this, 'hassPipeline', {});

    // Source
    const source = new Source(this, 'source', {githubRepo, pipeline});

    // Test
    const test = new CodeBuild(this, 'test', {
      pipeline,
      input: source.output,
      buildSpec: BuildSpec.fromSourceFilename('test-buildspec.yaml'),
      cache: Cache.local(LocalCacheMode.DOCKER_LAYER),
      priveleged: true,
    });

    addParameterPermissions(test, homeAssistantSecretsARN);

    // Deploy
    const deploy = new CodeBuild(this, 'deploy', {
      pipeline,
      input: source.output,
      buildSpec: BuildSpec.fromSourceFilename('deploy-buildspec.yaml'),
    });

    addParameterPermissions(deploy, deploymentKeyARN);
  }
}

function getParameterARN(parameter: String) {
  return `arn:${cdk.Aws.PARTITION}:ssm:${cdk.Aws.REGION}:${
      cdk.Aws.ACCOUNT_ID}:parameter/${parameter}`
}
function addParameterPermissions(codeBuild: CodeBuild, secretsARN: string) {
  codeBuild.project.addToRolePolicy(new PolicyStatement({
    actions: ['ssm:GetParameter'],
    effect: Effect.ALLOW,
    resources: [secretsARN]
  }));
}
