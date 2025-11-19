"use client";

import { ControlledDialog } from "@/components/ControlledDialog";
import { CustomPageLoader } from "@/components/CustomPageLoader";
import { showToast } from "@/components/CustomToaster";
import { Card, CardContent } from "@/components/ui";
import { UsersEntity } from "@/core";
import { CompanyEntity } from "@/core/entities/CompanyEntity";
import { UsersApiRepository } from "@/infrastructure/repositories";
import { CompanyApiRepository } from "@/infrastructure/repositories/CompanyRepository";
import {
  CommonHeader,
  CompaniesDataTable,
  CompanyForm,
} from "@/modules/users/admin";
import { Button } from "@/components/ui";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomEmpty } from "@/components/CustomEmpty";
import { CustomLoading } from "@/components/CustomLoading";

const CompaniesPage = () => {
  const [companiesData, setCompaniesData] = useState<CompanyEntity[] | null>(
    null
  );
  const [usersData, setUsersData] = useState<UsersEntity[] | null>(null);
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingCompany, setIsEditingCompany] =
    useState<CompanyEntity | null>(null);
  const [editingCompany, setEditingCompany] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const COMPANIES_REPO = new CompanyApiRepository();
      const USERS_REPO = new UsersApiRepository();
      try {
        const companies_data = await COMPANIES_REPO.findAll();
        const users_data = await USERS_REPO.findAll();
        setCompaniesData(companies_data);
        setUsersData(users_data);
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

  useEffect(() => {
    if (isError) {
      showToast({
        message: "Error",
        description: isError,
        type: "error",
      });
    }
  }, [isError]);

  const handleEditCompany = (company: CompanyEntity) => {
    setIsEditingCompany(company);
    setEditingCompany(true);
    setIsDialogOpen(true);
  };

  const handleAddCompany = () => {
    setIsEditingCompany(null);
    setEditingCompany(false);
    setIsDialogOpen(true);
  };

  const handleDeleteCompany = (company: CompanyEntity) => {
    setIsEditingCompany(company);
    setEditingCompany(false);
    setIsConfirm(true);
  };

  const confirmDeleteCompany = async () => {
    const COMPANY_REPO = new CompanyApiRepository();
    try {
      setIsDeleting(true);
      await COMPANY_REPO.delete(isEditingCompany!.id!.toString());
      showToast({
        message: "Success",
        description: "Company deleted successfully",
        type: "success",
      });
      const refreshCompanies = await COMPANY_REPO.findAll();
      setCompaniesData(refreshCompanies);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : "Error deleting company"
      );
    } finally {
      setIsConfirm(false);
      setIsDeleting(false);
    }
  };

  const handleComplete = async () => {
    setIsDialogOpen(false);
    setIsConfirm(false);
    setIsEditingCompany(null);
    setEditingCompany(false);
    try {
      setIsLoading(true);
      const COMPANY_REPO = new CompanyApiRepository();
      const refreshCompanies = await COMPANY_REPO.findAll();
      setCompaniesData(refreshCompanies);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : "Error getting companies data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommonHeader
        title="Companies Management"
        desc="Manage all companies and partners data"
        icon={Building2}
      />
      {isLoading && <CustomPageLoader message="Getting Companies Data" />}
      {!isLoading &&
        companiesData &&
        companiesData.length > 0 &&
        usersData &&
        usersData.length > 0 && (
          <Card>
            <CardContent>
              <CompaniesDataTable
                data={companiesData}
                users={usersData}
                onAdd={handleAddCompany}
                onEdit={(company) => handleEditCompany(company)}
                onDelete={(company) => handleDeleteCompany(company)}
              />
            </CardContent>
          </Card>
        )}
      <ControlledDialog
        onOpenChange={setIsDialogOpen}
        open={isDialogOpen}
        title={editingCompany ? "Edit Company" : "Add Company"}
      >
        {usersData && (
          <CompanyForm
            users={usersData}
            company={isEditingCompany}
            editForm={editingCompany}
            onComplete={handleComplete}
          />
        )}
      </ControlledDialog>
      <ControlledDialog
        onOpenChange={setIsConfirm}
        open={isConfirm}
        title="Delete Company"
      >
        <div className="flex flex-col gap-1">
          <p>Are you sure you want to delete this company?</p>
          <div className="w-full flex items-center justify-end gap-4 mt-8">
            <Button onClick={() => setIsConfirm(false)}>Cancel</Button>
            <Button
              onClick={confirmDeleteCompany}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? <CustomLoading message="Deleting ..." /> : "Delete"}
            </Button>
          </div>
        </div>
      </ControlledDialog>
      {!isLoading && companiesData?.length === 0 && (
        <CustomEmpty
          description="No companies created yet, you can add the first by clicking on the create button"
          title="No companies created yet"
          icon={Building2}
          onClick={handleAddCompany}
        />
      )}
    </>
  );
};

export default CompaniesPage;
