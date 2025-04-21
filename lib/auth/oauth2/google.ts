import { generateS256CodeChallenge } from "@/lib/auth/oauth2/pkce";
import { encodeClientCredentials } from "@/lib/auth/oauth2/utils";

const authorizationEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenEndpoint = "https://oauth2.googleapis.com/token";

export class Google {
  public clientId: string;

  private clientPassword: string;
  private redirectURI: string;

  constructor(clientId: string, clientPassword: string, redirectURI: string) {
    this.clientId = clientId;
    this.clientPassword = clientPassword;
    this.redirectURI = redirectURI;
  }

  public async createAuthorizationURLWithPKCE(
    state: string,
    codeVerifier: string,
    scopes: string[],
  ) {
    const codeChallenge = await generateS256CodeChallenge(codeVerifier);
    const url = new URL(authorizationEndpoint);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("redirect_uri", this.redirectURI);
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("prompt", "select_account");
    if (scopes.length > 0) {
      url.searchParams.set("scope", scopes.join(" "));
    }
    return url;
  }

  public async exchangeCodeForTokens(code: string, codeVerifier: string) {
    const encodedCredentials = encodeClientCredentials(
      this.clientId,
      this.clientPassword,
    );

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: new URLSearchParams({
        code,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
        client_id: this.clientId,
        redirect_uri: this.redirectURI,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        data: null,
        error: {
          type: data.error,
          message: data.error_description,
        },
      };
    }

    const data = await response.json();
    return {
      data,
      error: null,
    };
  }
}
