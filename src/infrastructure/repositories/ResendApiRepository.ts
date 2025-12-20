import { Resend } from "resend";


export class ResendApiRepository {
  private ResendApiKey = 're_JjwUekrU_A2PYQ1VxJ9c7VPHRFazHfdGX';
  private ResendService = new Resend('re_JjwUekrU_A2PYQ1VxJ9c7VPHRFazHfdGX');

  async GetMailsList() {
      const { data, error } = await this.ResendService.emails.list();
    return { data, error };
  }
}