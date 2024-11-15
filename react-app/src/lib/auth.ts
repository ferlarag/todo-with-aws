import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "../../cognito_config.json";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
});

type SignInParams = {
  username: string;
  password: string;
};

export const getCurrentSession = () => {
  const token = sessionStorage.getItem("accessToken");
  //   const refreshToken = sessionStorage.getItem("refreshToken");
  //   const tokenId = sessionStorage.getItem("idToken");

  if (!token) return undefined;
  return token;
};

export const signOut = async () => {
  const command = new GlobalSignOutCommand({
    AccessToken: getCurrentSession(),
  });
  sessionStorage.clear();
  try {
    await cognitoClient.send(command);
  } catch (error) {
    console.log("An error occurred signing out", error);
    throw new Error();
  }
};

export const signIn = async ({password, username}: SignInParams) => {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: config.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const {AuthenticationResult} = await cognitoClient.send(command);

    if (AuthenticationResult) {
      sessionStorage.setItem("idToken", AuthenticationResult.IdToken || "");
      sessionStorage.setItem(
        "accessToken",
        AuthenticationResult.AccessToken || ""
      );
      sessionStorage.setItem(
        "refreshToken",
        AuthenticationResult.RefreshToken || ""
      );
      return AuthenticationResult;
    }
  } catch (error) {
    console.log("Error signing in: ", error);
    throw error;
  }
};

type SignUpParams = {
  email: string;
  password: string;
};

export const signUp = async ({password, email}: SignUpParams) => {
  const command = new SignUpCommand({
    ClientId: config.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  });
  const response = await cognitoClient.send(command);
  return response;
};

interface ConfirmSingUpType {
  username: string;
  code: string;
}

export const confirmSignUp = async ({code, username}: ConfirmSingUpType) => {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: config.clientId,
      Username: username,
      ConfirmationCode: code,
    });
    await cognitoClient.send(command);
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.log("Error during sign up confirmation: ", error);
    throw error;
  }
};

export const logOut = () => {
  sessionStorage.clear();
};
