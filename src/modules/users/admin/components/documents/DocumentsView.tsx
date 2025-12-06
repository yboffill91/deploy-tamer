'use client';
import { CustomEmpty } from '@/components/CustomEmpty';
import { CustomPageLoader } from '@/components/CustomPageLoader';
import { GenericDataTable } from '@/components/GenericDataTable';
import { DocumentsEntity, TeamsEntity, UsersEntity } from '@/core/entities';
import { DocumentsApiRepository } from '@/infrastructure/repositories/DocumentsApiRepository';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DocumentsDataTable } from '../dataTables/DocumetsDataTable';
import {
  TeamsApiRepository,
  UsersApiRepository,
} from '@/infrastructure/repositories';

export const DocumentsView = () => {
  const [documents, setDocuments] = useState<DocumentsEntity[] | null>(null);
  const [users, setUsers] = useState<UsersEntity[] | null>(null);
  const [teams, setTeams] = useState<TeamsEntity[] | null>(null);

  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const DOCS_REPO = new DocumentsApiRepository();
    const USERS_REPO = new UsersApiRepository();
    const TEAM_REPO = new TeamsApiRepository();
    const getData = async () => {
      try {
        setIsLoading(true);
        const docs = await DOCS_REPO.findAll();
        const users_list = await USERS_REPO.findAll();
        const teams_list = await TEAM_REPO.findAll();
        setDocuments(docs);
        setUsers(users_list);
        setTeams(teams_list);
      } catch (error) {
        setIsError(
          error instanceof Error ? error.message : 'Error fetching documents'
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <>
      {isLoading && <CustomPageLoader message='Getting Uploaded Documents' />}
      {!isLoading && documents && documents.length === 0 && (
        <CustomEmpty
          description='No Documents Uploaded Yet'
          icon={FileText}
          title='No Documents Uploaded Yet'
          onClick={() => console.log('Create Document')}
        />
      )}
      {!isLoading && documents && documents.length > 0 && (
        <DocumentsDataTable data={documents} users={users!} teams={teams!} />
      )}
    </>
  );
};
