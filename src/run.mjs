import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { getTopHNArticles} from "./scraper.mjs";


// Set the AWS Region.
const REGION = "eu-west-1";

// Create SES service object.
const sesClient = new SESClient({ region: REGION });

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "HTML_FORMAT_BODY",
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

export const run = async () => {

    const articles = getTopHNArticles(3);
    
    
    const sendEmailCommand = createSendEmailCommand(
	process.env.FROM_ADDRESS,
	process.env.TO_ADDRESS
    );

    try {
	return await sesClient.send(sendEmailCommand);
    } catch (caught) {
	if (caught instanceof Error && caught.name === "MessageRejected") {
	    /** @type { import('@aws-sdk/client-ses').MessageRejected} */
	    const messageRejectedError = caught;
	    return messageRejectedError;
	}
	throw caught;
    }
};
