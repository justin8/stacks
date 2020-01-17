import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import S3StaticWebsite = require('../lib/s3-static-website-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new S3StaticWebsite.S3StaticWebsiteStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
