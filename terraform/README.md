# Terraform file

## Introduction

This project is perfect to get you started with AWS as a React/Javascript Developer. The goal is to get comfortable with AWS Services and not necessarily provide the best DX.

## Table of contents

- [Basic commands](#basic-commands)
- [Deployment and Development](#developing)
  - [Deploying the app](#deploying-the-app-and-resources)
  - [React App](#the-react-app)
  - [Lambda functions](#the-lambda-functions)

This terraform project will create all the resources necesarry for a basic Todo app.

This will create the following:

1. A React app deployed in a **S3 bucket** that uses **Cognito** for user authentication.
2. An **API Gateway** that calls **Lambda** functions to perform basic CRUD operations in **DynamoDB**.

## Basic commands

This are the commands

```
terraform init
terraform apply
terraform destroy
```

## Developing

### Deploying the app and resources

1. Clone the repo and build the React App
2. Build the lambda functions
3. Run the Terraform commands

### The React App

### The Lambda functions

### GitHub actions
