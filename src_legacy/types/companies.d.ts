export interface Company {
  id: number;
  name: string;
  ownerId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateCompanyRequest {
  name: string;
}

export interface UpdateCompanyRequest {
  id: number;
  name: string;
}
