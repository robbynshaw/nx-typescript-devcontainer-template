import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
// import * as sqs from "aws-cdk-lib/aws-sqs"

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // defines your stack here

    // example resource
    // const queue = new sqs.Queue(this, "TmpQueue", {
    //   visibilityTimeout: cdk.Duration.seconds(300),
    // })
  }
}
