import { App } from 'aws-cdk-lib';
import { BaseStack } from './stacks/base-stack';
import { SiteStack } from './stacks/site-stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const sharedProps = {
  env: devEnv,
  domain: "rnshaw.com",
  subdomain: "test-site"
}

const STACK_BASE_NAME = 'nx-template-next-';

const app = new App();

const baseStack = new BaseStack(app, `${STACK_BASE_NAME}-base-stack`, { ...sharedProps })

new SiteStack(app, `${STACK_BASE_NAME}-site-stack`, { ...sharedProps, ...baseStack.resources() })

app.synth();
