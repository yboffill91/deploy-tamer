"use client";

import { CustomPageLoader } from "@/components/CustomPageLoader";
import { GenericDataTable } from "@/components/GenericDataTable";
import { Card, CardContent } from "@/components/ui";
import { CompanyEntity } from "@/core/entities/CompanyEntity";
import { CompanyApiRepository } from "@/infrastructure/repositories/CompanyRepository";
import { CommonHeader } from "@/modules/users/admin";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";

const CompaniesPage = () => {
  const [data, setData] = useState<{
    companies: CompanyEntity[];
  } | null>(null);
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const COMPANIES_REPO = new CompanyApiRepository();
      try {
        setIsLoading(true);
        const companies_data = await COMPANIES_REPO.findAll();
        setData({
          companies: companies_data,
        });
      } catch (e) {
        setIsError(
          e instanceof Error ? e.message : "Error getting Companies Data"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <>
      <CommonHeader
        title="Companies Management"
        desc="Manage all companies and partners data"
        icon={Building2}
      />
      {isLoading && data?.companies.length === 0 && (
        <CustomPageLoader message="Getting Companies Data" />
      )}
      {!isLoading && data?.companies && data.companies.length > 0 && (
        <Card>
          <CardContent>
            <GenericDataTable data={data.companies} />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CompaniesPage;
