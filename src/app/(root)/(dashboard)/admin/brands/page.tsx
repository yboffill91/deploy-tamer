"use client";
import { ControlledDialog } from "@/components/ControlledDialog";
import { CustomEmpty } from "@/components/CustomEmpty";
import { CustomLoading } from "@/components/CustomLoading";
import { CustomPageLoader } from "@/components/CustomPageLoader";
import { showToast } from "@/components/CustomToaster";
import { GenericDataTable } from "@/components/GenericDataTable";
import { Button, Card, CardContent } from "@/components/ui";
import { BrandsEntity, CompanyEntity } from "@/core/entities";
import {
  BrandApiRepository,
  CompanyApiRepository,
} from "@/infrastructure/repositories";
import {
  BrandsDataTable,
  BrandsForm,
  CommonHeader,
} from "@/modules/users/admin";
import { Tags } from "lucide-react";
import { useEffect, useState } from "react";

const BrandsPage = () => {
  const [brands, setBrands] = useState<BrandsEntity[] | null>(null);
  const [companies, setCompanies] = useState<CompanyEntity[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const [brandToEdit, setBrandToEdit] = useState<BrandsEntity | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [brandToDelete, setBrandToDelete] = useState<BrandsEntity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      showToast({
        message: isError,
        description: isError,
        type: "error",
      });
    }
  }, [isError]);

  useEffect(() => {
    const COMPANIES_REPO = new CompanyApiRepository();
    const BRANDS_REPO = new BrandApiRepository();

    const getData = async () => {
      try {
        setIsLoading(true);
        const companies = await COMPANIES_REPO.findAll();
        const brands = await BRANDS_REPO.findAll();
        setCompanies(companies);
        setBrands(brands);
      } catch (error) {
        setIsError(
          `Error getting brands info: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const onAddHandler = () => {
    setIsEditing(false);
    setBrandToEdit(null);
    setIsDialogOpen(true);
  };

  const onEditHandler = (brand: BrandsEntity) => {
    setIsEditing(true);
    setBrandToEdit(brand);
    setIsDialogOpen(true);
  };

  const onDeleteHandler = (brand: BrandsEntity) => {
    setBrandToDelete(brand);
    setBrandToEdit(null);
    setConfirmDelete(true);
  };

  const onConfirmDeleteHandler = async () => {
    setIsDeleting(true);
    const BRAND_REPO = new BrandApiRepository();
    try {
      await BRAND_REPO.delete(brandToDelete!.id!.toString());
      showToast({
        message: "Success",
        description: "Brand deleted successfully",
        type: "success",
      });
      const refreshBrands = await BRAND_REPO.findAll();
      setBrands(refreshBrands);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : "Error deleting brand"
      );
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const onCompleteHandler = async () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setIsDeleting(false);
    setBrandToEdit(null);
    setBrandToDelete(null);
    setIsDialogOpen(false);
    try {
      const BRAND_REPO = new BrandApiRepository();
      const refreshBrands = await BRAND_REPO.findAll();
      setBrands(refreshBrands);
    } catch (error) {
      setIsError(
        error instanceof Error ? error.message : "Error getting brands"
      );
    }
  };

  return (
    <>
      <CommonHeader title="Brands" desc="Manage Companies Brands" icon={Tags} />
      {isLoading && (!brands || brands.length === 0) && (
        <CustomPageLoader message="Loading Brands..." />
      )}

      {!isLoading &&
        brands &&
        brands.length > 0 &&
        companies &&
        companies.length > 0 && (
          <Card>
            <CardContent>
              <BrandsDataTable
                data={brands}
                companies={companies}
                onAdd={onAddHandler}
                onEdit={(brand) => onEditHandler(brand)}
                onDelete={(brand) => onDeleteHandler(brand)}
              />
            </CardContent>
          </Card>
        )}

      {!isLoading && (!brands || brands.length === 0) && (
        <CustomEmpty
          title="No Brands Founded"
          description="No Brands was founded, you can create a new one by clicking the create button"
          icon={Tags}
          onClick={onAddHandler}
        />
      )}

      <ControlledDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={isEditing ? "Edit Brand" : "Add Brand"}
      >
        <BrandsForm
          brand={brandToEdit}
          companies={companies!}
          onComplete={() => onCompleteHandler()}
          editForm={isEditing}
        />
      </ControlledDialog>

      <ControlledDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete Brand"
      >
        <p>Are you sure you want to delete this brand?</p>
        <div className="mt-8 flex items-center justify-end gap-4">
          <Button variant="outline" disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => onConfirmDeleteHandler()}
          >
            {isDeleting ? <CustomLoading message="Deleting..." /> : "Delete"}
          </Button>
        </div>
      </ControlledDialog>
    </>
  );
};

export default BrandsPage;
