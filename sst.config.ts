import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

const AWS_CERTIFICATE_ARN = process.env.AWS_CERTIFICATE_ARN;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const APP_NAME = process.env.APP_NAME;
const PUBLISH_DOMAIN = process.env.PUBLISH_DOMAIN;
const AWS_REGION = process.env.AWS_REGION;

if (!AWS_CERTIFICATE_ARN) {
  throw new Error("Missing env var: AWS_CERTIFICATE_ARN");
}

if (!AWS_ACCESS_KEY_ID) {
  throw new Error("Missing env var: AWS_ACCESS_KEY_ID");
}

if (!APP_NAME) {
  throw new Error("Missing env var: APP_NAME");
}

if (!AWS_REGION) {
  throw new Error("Missing env var: AWS_REGION");
}

if (!PUBLISH_DOMAIN) {
  throw new Error("Missing env var: PUBLISH_DOMAIN");
}

export default {
  config(_input) {
    return { name: APP_NAME, region: AWS_REGION };
  },
  stacks(app) {
    app.setDefaultRemovalPolicy("destroy");
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        path: "notes",
        customDomain: {
          domainName: PUBLISH_DOMAIN,
          isExternalDomain: true,
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              AWS_ACCESS_KEY_ID,
              AWS_CERTIFICATE_ARN
            ),
          },
        },
      });
      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
