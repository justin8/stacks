import { Pipeline } from "@aws-cdk/aws-codepipeline";
import * as cdk from "@aws-cdk/core";
import { Source } from "./pipeline-example-source";
import { CodeBuild } from "./pipeline-example-codebuild";
import codecommit = require("@aws-cdk/aws-codecommit");
import { BuildSpec } from "@aws-cdk/aws-codebuild";
import { S3Deploy } from "./pipeline-example-s3deploy";

export class PipelineExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const repository = new codecommit.Repository(this, "repository", {
      repositoryName: "example-source"
    });

    const pipeline = new Pipeline(this, "example-pipeline", {});

    const source = new Source(this, "example-source", {
      pipeline: pipeline,
      repository: repository
    });

    const build = new CodeBuild(this, "build", {
      pipeline: pipeline,
      buildSpec: BuildSpec.fromSourceFilename("buildspec.yaml"),
      input: source.output
    });

    const deploy = new S3Deploy(this, "deploy", {
      pipeline: pipeline,
      input: build.output
    });
  }
}
