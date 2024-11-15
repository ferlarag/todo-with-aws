provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

# DynamoDB Table
resource "aws_dynamodb_table" "todo_table" {
  name         = var.todo_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = var.todo_table_name
  }
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = var.iam_role_for_lambda_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Attach DynamoDB access policy to Lambda role
resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

// ----------------
# API Gateway setup with routes for each Lambda
resource "aws_api_gateway_rest_api" "todo_api" {
  name = "todo-api"
}

resource "aws_api_gateway_resource" "todos_api_resources" {
  rest_api_id = aws_api_gateway_rest_api.todo_api.id
  parent_id   = aws_api_gateway_rest_api.todo_api.root_resource_id
  path_part   = "todos"
}

// https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_method
resource "aws_api_gateway_authorizer" "api_authorizer" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.todo_api.id
  provider_arns = [aws_cognito_user_pool.user_pool.arn]
}

# resource "aws_apigatewayv2_authorizer" "cognito_authorizer" {
#   api_id          = aws_apigatewayv2_api.your_api.id
#   name            = "CognitoAuthorizer"
#   authorizer_type = "JWT"
#   identity_sources = ["$request.header.Authorization"]
#   jwt_configuration {
#     audience = [aws_cognito_user_pool_client.user_pool_client.id]
#     issuer   = "https://cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.user_pool.id}"
#   }
# }


// All the Lambdas setup -------------
// 1. Lambda function
// 2. Lambda permission
// 3. API method
// 4. API integration

resource "aws_lambda_function" "create_todo" {
  filename      = "../lambda-functions/zip/createTodo.zip"
  function_name = "createTodo"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todo_table.name
    }
  }
}

resource "aws_lambda_permission" "create_todo_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_todo.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.todo_api.execution_arn}/*"
}

resource "aws_api_gateway_method" "create_todo_method" {
  rest_api_id   = aws_api_gateway_rest_api.todo_api.id
  resource_id   = aws_api_gateway_resource.todos_api_resources.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.api_authorizer.id

  #   request_parameters = {
  #     "method.request.path.proxy" = true
  #   }
}

resource "aws_api_gateway_method_settings" "methods_settings" {
  rest_api_id = aws_api_gateway_rest_api.todo_api.id
  stage_name  = aws_api_gateway_stage.api_dev_stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

resource "aws_api_gateway_integration" "create_todo_integration" {
  rest_api_id             = aws_api_gateway_rest_api.todo_api.id
  resource_id             = aws_api_gateway_resource.todos_api_resources.id
  http_method             = aws_api_gateway_method.create_todo_method.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.create_todo.invoke_arn
}


resource "aws_lambda_function" "delete_todo" {
  filename      = "../lambda-functions/zip/deleteTodo.zip"
  function_name = "deleteTodo"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todo_table.name
    }
  }
}

resource "aws_lambda_permission" "delete_todo_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_todo.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.todo_api.execution_arn}/*"
}

resource "aws_api_gateway_method" "delete_todo_method" {
  rest_api_id   = aws_api_gateway_rest_api.todo_api.id
  resource_id   = aws_api_gateway_resource.todos_api_resources.id
  http_method   = "DELETE"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.api_authorizer.id

  #   request_parameters = {
  #     "method.request.path.proxy" = true
  #   }
}

resource "aws_api_gateway_integration" "delete_todo_integration" {
  rest_api_id             = aws_api_gateway_rest_api.todo_api.id
  resource_id             = aws_api_gateway_resource.todos_api_resources.id
  http_method             = aws_api_gateway_method.delete_todo_method.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.delete_todo.invoke_arn
}


resource "aws_lambda_function" "get_todos" {
  filename      = "../lambda-functions/zip/getTodos.zip"
  function_name = "getTodos"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todo_table.name
    }
  }
}

resource "aws_lambda_permission" "get_todos_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_todos.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.todo_api.execution_arn}/*"
}

resource "aws_api_gateway_method" "get_todo_method" {
  rest_api_id   = aws_api_gateway_rest_api.todo_api.id
  resource_id   = aws_api_gateway_resource.todos_api_resources.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.api_authorizer.id

  #   request_parameters = {
  #     "method.request.path.proxy" = true
  #   }
}

resource "aws_api_gateway_integration" "get_todo_integration" {
  rest_api_id             = aws_api_gateway_rest_api.todo_api.id
  resource_id             = aws_api_gateway_resource.todos_api_resources.id
  http_method             = aws_api_gateway_method.get_todo_method.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.get_todos.invoke_arn
}

resource "aws_lambda_function" "update_todo" {
  filename      = "../lambda-functions/zip/updateTodo.zip"
  function_name = "updateTodo"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.todo_table.name
    }
  }
}

resource "aws_lambda_permission" "update_todo_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_todo.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.todo_api.execution_arn}/*"
}

resource "aws_api_gateway_method" "update_todo_method" {
  rest_api_id   = aws_api_gateway_rest_api.todo_api.id
  resource_id   = aws_api_gateway_resource.todos_api_resources.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.api_authorizer.id

  #   request_parameters = {
  #     "method.request.path.proxy" = true
  #   }
}

resource "aws_api_gateway_integration" "update_todo_integration" {
  rest_api_id             = aws_api_gateway_rest_api.todo_api.id
  resource_id             = aws_api_gateway_resource.todos_api_resources.id
  http_method             = aws_api_gateway_method.update_todo_method.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.update_todo.invoke_arn
}

resource "aws_api_gateway_stage" "api_dev_stage" {
  deployment_id = aws_api_gateway_deployment.todo_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.todo_api.id
  stage_name    = "dev"
}

# Deploy API Gateway
resource "aws_api_gateway_deployment" "todo_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.create_todo_integration,
    aws_api_gateway_integration.delete_todo_integration,
    aws_api_gateway_integration.get_todo_integration,
    aws_api_gateway_integration.update_todo_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.todo_api.id
}

# Cognito User Pool
resource "aws_cognito_user_pool" "user_pool" {
  name = "todo-user-pool"
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                                 = "todo-user-pool-client"
  user_pool_id                         = aws_cognito_user_pool.user_pool.id
  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true

  allowed_oauth_flows  = ["implicit"]
  allowed_oauth_scopes = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls        = ["http://localhost:3000"] # Update with your app's URL
}

# S3 bucket for React app hosting
resource "aws_s3_bucket" "react_app_bucket" {
  bucket = "todo-app-react-bucket"
}

resource "aws_s3_bucket_public_access_block" "s3_public_access" {
  bucket                  = aws_s3_bucket.react_app_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "react_app_bucket_policy" {
  bucket = aws_s3_bucket.react_app_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.react_app_bucket.arn}/*"
      }
    ]
  })
}


resource "aws_s3_bucket_website_configuration" "s3_website_config" {
  bucket = aws_s3_bucket.react_app_bucket.id
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# # https://www.stormit.cloud/blog/cloudfront-origin-access-identity/
# resource "aws_cloudfront_origin_access_identity" "cloudfront_access_identity" {
#   comment = "Some comment"
# }


# # CloudFront distribution for S3 bucket
# resource "aws_cloudfront_distribution" "cdn" {
#   origin {
#     domain_name = aws_s3_bucket.react_app_bucket.bucket_regional_domain_name
#     origin_id   = "s3-react-app-origin"

#     s3_origin_config {
#       origin_access_identity = aws_cloudfront_origin_access_identity.cloudfront_access_identity.cloudfront_access_identity_path
#     }
#   }

#   enabled             = true
#   default_root_object = "index.html"

#   default_cache_behavior {
#     allowed_methods  = ["GET", "HEAD"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = "s3-react-app-origin"

#     forwarded_values {
#       query_string = false
#       cookies {
#         forward = "none"
#       }
#     }

#     viewer_protocol_policy = "redirect-to-https"
#   }

#   price_class = "PriceClass_100"

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   viewer_certificate {
#     cloudfront_default_certificate = true
#   }
# }
