'use client';

import { CustomEmpty } from '@/components/CustomEmpty';
import { CustomPageLoader } from '@/components/CustomPageLoader';
import { showToast } from '@/components/CustomToaster';
import { GenericDataTable } from '@/components/GenericDataTable';
import { Card, CardContent } from '@/components/ui';
import { CompanyEntity, KeywordResearchEntity } from '@/core/entities';
import {
  CompanyApiRepository,
  KeywordResearchApiRepository,
} from '@/infrastructure/repositories';
import { CommonHeader } from '@/modules/users/admin';
import { AlertTriangle, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import { KeywordResearchDataTable } from '../data-tables/KeywordResearchDataTable';

export const AllRequestTable = () => {
  const [rawData, setRawData] = useState<KeywordResearchEntity[]>();
  const [companies, setCompanies] = useState<CompanyEntity[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  useEffect(() => {
    const getData = async () => {
      const REPO = new KeywordResearchApiRepository();
      const CompaniesREPO = new CompanyApiRepository();
      try {
        setIsError('');
        setIsLoading(true);
        const Data = await REPO.findAll();
        const Companies = await CompaniesREPO.findAll();
        setCompanies(Companies);
        setRawData(Data);
      } catch (error) {
        setIsError(
          error instanceof Error
            ? error.message
            : "Unexpected Error Trying To Get All Research's Data"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (isError) {
      showToast({
        description: isError,
        message: 'Error',
        type: 'error',
      });
    }
  }, [isError]);

  console.log(companies);

  return (
    <>
      <CommonHeader
        title='All Research Requested'
        icon={List}
        desc={'Manage all Research Requested'}
      />
      {isLoading && !rawData && (
        <CustomPageLoader message='Getting All Keyword Research Data' />
      )}
      {!isLoading && rawData && (
        <Card className='container'>
          <CardContent>
                      <KeywordResearchDataTable data={rawData}
              
                      />
          </CardContent>
        </Card>
      )}

      {!isLoading && rawData && rawData.length === 0 && (
        <CustomEmpty
          icon={AlertTriangle}
          title='No Keywords Researched'
          description='No keyword research has been done yet. Start by clicking the New Keyword Research button.'
          onClick={() => console.log('Click')}
        />
      )}
    </>
  );
};
