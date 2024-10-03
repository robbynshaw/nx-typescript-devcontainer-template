import * as cdk from 'aws-cdk-lib';
import { aws_cloudfront as cf } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { SecurityPolicyProtocol } from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import type { Construct } from 'constructs';
import { join } from 'path';
import type { BaseStackResources } from './base-stack';

const workspaceRoot = () => join(__dirname, '..', '..', '..', '..');

export interface SiteStackProps extends cdk.StackProps, BaseStackResources {
  domain: string;
  subdomain: string;
}

export class SiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);
    const { domain, subdomain } = props;
    const fullDomain = `${subdomain}.${domain}`;

    const { bucket, zone } = props;
    const cfDistribution = new cf.Distribution(this, 'SiteCfDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3StaticWebsiteOrigin(bucket, {
          // originAccessIdentity,
          // originPath: '/blog',
        }),
        compress: true,
        allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      priceClass: cf.PriceClass.PRICE_CLASS_ALL,
      domainNames: [fullDomain],
      certificate: new acm.Certificate(this, 'SiteCertificate', {
        domainName: domain,
        subjectAlternativeNames: [`${subdomain}.${domain}`],
        validation: acm.CertificateValidation.fromDns(zone),
      }),
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
        },
      ],
    });

    new s3deploy.BucketDeployment(this, 'SiteBucketDeployment', {
      destinationBucket: bucket,
      distribution: cfDistribution,
      distributionPaths: ['/*'],
      sources: [s3deploy.Source.asset(join(workspaceRoot(), 'site', 'out'))],
    });

    new route53.ARecord(this, 'SiteAliasRecord', {
      zone,
      recordName: subdomain,
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(cfDistribution),
      ),
    });
  }
}
