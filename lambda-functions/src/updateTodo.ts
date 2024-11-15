import {DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

const TableName = process.env.TABLE_NAME ?? "undefined";
const client = new DynamoDBClient();

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  const userId = event.requestContext.authorizer.jwt.claims["sub"];

  const {id, completed, title, description} = JSON.parse(event.body ?? "{}");

  if (!id || !completed || !title || !description) {
    const params = {
      id,
      completed,
      title,
      description,
    };
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "One or more parameters missing: ",
        params,
      }),
    };
  }
  try {
    const command = new UpdateItemCommand({
      TableName,
      Key: {
        id: {S: id},
        userId: {S: userId as string},
      },
      UpdateExpression:
        "SET #completed = :completed, #title = :title, #description = :description",
      ExpressionAttributeNames: {
        "#completed": ":completed",
        "#title": ":title",
        "#description": ":description",
      },
      ExpressionAttributeValues: {
        ":completed": {BOOL: completed},
        ":title": {S: title},
        ":description": {S: description},
      },
      ReturnValues: "ALL_NEW",
    });

    const data = await client.send(command);

    return {
      statusCode: 201,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred updating the todo",
      }),
    };
  }
};
