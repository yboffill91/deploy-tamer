import { AuthError } from "@/core";
import { secureUserGenerateOtp, usersApi, verifyUserOtp } from "@/lib/apis";
import { fetchHelper } from "@/lib/fetch-helper";

interface IOtpRepository {
  sendEmailUuid(email: string, uuid: string): Promise<string>;
  getCode(token: string): Promise<void>;
  verifyCode(code: string, token: string): Promise<void>;
}

export class SessionVerificationRepository implements IOtpRepository {
  async sendEmailUuid(email: string, uuid: string): Promise<string> {
    try {
      const response = await fetch(`${usersApi}/${email}/${uuid}`);

      if (response.status === 400 || response.status === 404) {
        return "User Not Found";
      }

      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      throw new AuthError(
        error instanceof Error ? error.message : "Error sending email uuid"
      );
    }
  }

  async getCode(token: string): Promise<void> {
    try {
      await fetchHelper(secureUserGenerateOtp, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error generating 2nd Factor Authentication Code"
      );
    }
  }
  async verifyCode(code: string, token: string): Promise<void> {
    try {
      const response = await fetchHelper(`${verifyUserOtp}/${code}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response) {
        throw new Error("Error verifying 2nd Factor Authentication Code");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error verifying 2nd Factor Authentication Code"
      );
    }
  }
}
