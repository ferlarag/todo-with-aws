# Output the API Gateway endpoint and S3 website URL
output "api_gateway_url" {
  value = aws_api_gateway_deployment.todo_api_deployment.invoke_url
}

output "s3_website_endpoint_url" {
  value = aws_s3_bucket_website_configuration.s3_website_config.website_endpoint
}

output "s3_website_domain_url" {
  value = aws_s3_bucket_website_configuration.s3_website_config.website_domain
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.user_pool_client.id
}

output "create_todo_integration_uri" {
  value = aws_api_gateway_integration.create_todo_integration.uri
}
output "get_todo_integration_uri" {
  value = aws_api_gateway_integration.get_todo_integration.uri
}
output "delete_todo_integration_uri" {
  value = aws_api_gateway_integration.delete_todo_integration.uri
}
output "update_todo_integration_uri" {
  value = aws_api_gateway_integration.update_todo_integration.uri
}


