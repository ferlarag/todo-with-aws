import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import {randomUUID} from "crypto";

const dynamodb = new DynamoDBClient({});
const TableName = process.env.TABLE_NAME ?? "undefined";

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  const userId = event.requestContext.authorizer.jwt.claims["sub"];

  const {completed, title, description} = JSON.parse(event.body ?? "{}");

  if (!completed || !title || !description) {
    const params = JSON.stringify({
      completed,
      title,
      description,
    });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Must contain title, description ",
        received: params,
      }),
    };
  }

  try {
    const command = new PutItemCommand({
      TableName,
      Item: {
        id: {S: randomUUID()},
        completed: {BOOL: completed},
        title: {S: title},
        description: {S: description},
      },
    });
    const data = await dynamodb.send(command);
    return {
      statusCode: 201,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Couldn't create todo",
      }),
    };
  }
};
