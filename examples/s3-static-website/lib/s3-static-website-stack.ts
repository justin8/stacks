import * as cdk from "@aws-cdk/core";
import { StaticSite } from "@justin8-cdk/static-site";

export class S3StaticWebsiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const site = new StaticSite(this, "widgets", {
      source: { path: "website-contents" }
    });
  }
}
