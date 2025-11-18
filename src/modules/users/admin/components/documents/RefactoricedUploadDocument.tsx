"use client";

import { showToast } from "@/components/CustomToaster";
import { TeamsEntity } from "@/core";
import { TeamsApiRepository } from "@/infrastructure/repositories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

/*
  ZOD Validations
*/
export const uploadDocumentSchema = z.object({
  name: z.string().min(1, "Name is required"),

  type: z
    .enum(["REPORT", "INVOICE", "CONTRACT", "MULTIMEDIA"])
    .optional()
    .refine((v) => !!v, { message: "Document type is required" }),

  accessType: z
    .enum(["PUBLIC", "PRIVATE", "SHARED", "SHARED_PRIVATE", "TEAM"])
    .optional()
    .refine((v) => !!v, { message: "Access type is required" }),

  teamId: z.string().min(1, "Team is required"),

  info: z.object({
    description: z.string().min(1, "Description is required"),
    tags: z.array(z.string()).optional().default(["Uncategorized"]),
    metadata: z.object({
      size: z.string().optional().default(""),
      type: z.string().optional().default(""),
      lastModified: z.string().optional().default(""),
      name: z.string().optional().default(""),
    }),
  }),

  // Campo file
  file: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "File is required",
    }) as z.ZodType<FileList>,
});
export type UploadDocumentType = z.infer<typeof uploadDocumentSchema>;

export const RefactoricedUploadDocuments = () => {
  const [iserror, setIserror] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<TeamsEntity[] | null>(null);

  useEffect(() => {
    if (iserror) {
      showToast({
        description: iserror,
        type: "error",
        message: "Error",
      });
    }
  }, [iserror]);

  useEffect(() => {
    const getTeams = async () => {
      const teams_repo = new TeamsApiRepository();

      try {
        setIsLoading(true);
        const dataFromTeams = await teams_repo.findAll();
        setTeams(dataFromTeams);
      } catch (error) {
        setIserror(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while trying to retrieve information from the server."
        );
      } finally {
        setIsLoading(false);
      }
    };
    getTeams();
  }, []);

  const submitHandler = useForm<UploadDocumentType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(uploadDocumentSchema as any),
    mode: "onBlur",
  });

  return <></>;
};
