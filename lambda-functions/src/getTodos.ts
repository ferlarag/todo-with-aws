// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/QueryCommand/
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

const client = new DynamoDBClient();
const TableName = process.env.TABLE_NAME ?? "udefined_table";

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  const userId = event.requestContext.authorizer.jwt.claims["sub"];

  const {id} = JSON.parse(event.body ?? "{}");

  try {
    if (!id) {
      const command = new GetItemCommand({
        TableName,
        Key: {
          id: {S: id},
          userId: {S: userId as string},
        },
      });

      const data = await client.send(command);
      return {
        statusCode: 201,
        body: JSON.stringify(data),
      };
    } else {
      const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": {S: userId as string},
        },
      });

      const data = await client.send(command);
      return {
        statusCode: 201,
        body: JSON.stringify(data),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Couldn't get todos",
        error,
      }),
    };
  }
};
