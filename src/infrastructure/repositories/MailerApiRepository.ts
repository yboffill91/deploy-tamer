import {
  CreateDomainDTO,
  CreateEmailDTO,
  ResedApiEmailsResponseDTO,
  ResendApiBaseEmailDTO,
} from '@/core/dto';
import {
  EmailsEntity,
  MailerDomainsEntity,
  ResendEmailEntity,
} from '@/core/entities';
import { fetchHelper } from '@/lib/fetch-helper';
import { SessionRepository } from './SessionRepository';
import { mailerDomainsApi, mailerEmailsApi, mailingApi } from '@/lib/apis';

interface IMailerRepository {
  createDomain(data: CreateDomainDTO): Promise<MailerDomainsEntity>;
  sendEmail(data: CreateEmailDTO): Promise<void>;
}

export class MailerApiRepository implements IMailerRepository {
  private MapToEntity(data: CreateDomainDTO) {
    return { ...data };
  }
  private auth = async () => {
    const AuthRepo = new SessionRepository();
    const auth = await AuthRepo.autorization();
    return auth;
  };
  private commonHeader = {
    'Content-Type': 'application/json',
    accept: '*/*',
  };

  async createDomain(data: CreateDomainDTO): Promise<MailerDomainsEntity> {
    try {
      const Response = await fetchHelper<CreateDomainDTO>(mailerDomainsApi, {
        method: 'POST',
        headers: {
          ...this.commonHeader,
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(data),
      });
      if (!Response)
        throw new Error('Unexpected error triyng to create the domain');
      const MAP = this.MapToEntity(Response);
      return Object.assign(new MailerDomainsEntity(), MAP);
    } catch (error) {
      throw error;
    }
  }
  async sendEmail(data: CreateEmailDTO): Promise<void> {
    try {
      const Response = await fetchHelper<ResendApiBaseEmailDTO>(mailingApi, {
        method: 'POST',
        headers: {
          'Content/Type': 'application/json',
          Authorization: `Bearer ${await this.auth()}`,
        },
        body: JSON.stringify(data),
      });
      if (!Response) throw new Error('Error sending email');
    } catch (error) {
      throw error;
    }
  }

  async getMailList(): Promise<ResendEmailEntity[]> {
    try {
      const Response = await fetchHelper<ResedApiEmailsResponseDTO>(
        mailerEmailsApi,
        {
          headers: {
            Authorization: `Bearer ${await this.auth()}`,
          },
        }
      );
      if (!Response) throw new Error('Error getting the emails list');
      const data = Response.data!.data;

      return data.map((resp) => Object.assign(new ResendEmailEntity(), resp));
    } catch (error) {
      throw error;
    }
  }
}
