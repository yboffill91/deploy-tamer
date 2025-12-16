import { CreateDomainDTO } from "@/core/dto";
import { MailerDomainsEntity } from "@/core/entities";
import { fetchHelper } from "@/lib/fetch-helper";
import { SessionRepository } from "./SessionRepository";
import { mailerDomainsApi, mailingApi } from "@/lib/apis";

interface IMailerRepository {
    createDomain(data: CreateDomainDTO): Promise<MailerDomainsEntity>
}


export class MailerApiRepository implements IMailerRepository {
    private MapToEntity(data: CreateDomainDTO) {
        return {...data}
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
                    "Authorization": `Bearer ${await this.auth()}`
                },
                body: JSON.stringify(data)

            })
            if (!Response) throw new Error('Unexpected error triyng to create the domain')
            const MAP = this.MapToEntity(Response)
            return Object.assign(new MailerDomainsEntity(), MAP)
        } catch (error) {
            throw error;
        }
    }
}