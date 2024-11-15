import {DeleteItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

const client = new DynamoDBClient();
const TableName = process.env.TABLE_NAME ?? "udefined_table";

export const hanlder = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  const userId = event.requestContext.authorizer.jwt.claims["sub"];

  const {id} = JSON.parse(event.body ?? "{}");
  if (!id) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "id is required in order to delete the todo",
      }),
    };
  }
  try {
    const command = new DeleteItemCommand({
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Couldn't delete todo",
      }),
    };
  }
};
