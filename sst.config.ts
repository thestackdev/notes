import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import {
  APP_NAME,
  AWS_CERTIFICATE_ARN,
  AWS_CERTIFICATE_IDENTIFIER,
  AWS_REGION,
  PUBLISH_DOMAIN,
} from "./utils/constants";

export default {
  config(_input) {
    return { name: APP_NAME, region: AWS_REGION };
  },
  stacks(app) {
    app.setDefaultRemovalPolicy("destroy");
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: PUBLISH_DOMAIN,
          isExternalDomain: true,
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              AWS_CERTIFICATE_IDENTIFIER,
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
