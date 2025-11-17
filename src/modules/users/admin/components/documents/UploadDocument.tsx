"use client";
import { CustomLoading } from "@/components/CustomLoading";
import { showToast } from "@/components/CustomToaster";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui";
import { TeamsEntity } from "@/core";
import { DocumentsDTO } from "@/core/dto/DocumentsDTO";
import { DocumentsAccessType, DocumentsType } from "@/core/entities";
import { TeamsApiRepository } from "@/infraestructure/repositories";
import { DocumentsApiRepository } from "@/infraestructure/repositories/DocumentsApiRepository";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  CloudUpload,
  FileText,
  Plus,
  Tag,
  Tags,
} from "lucide-react";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const UploadDocument = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isError, setIsError] = useState<string | null>(null);
  const [teams, setTeams] = useState<TeamsEntity[] | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [inputTags, setInputTags] = useState<string[] | null>(null);
  const [inputTag, setInputTag] = useState<string>("");

  const [formData, setFormData] = useState<DocumentsDTO>({
    name: "",
    type: DocumentsType.REPORT,
    accessType: DocumentsAccessType.PUBLIC,
    teamId: "",
    info: {
      description: "",
      tags: ["Uncategorized"],
      metadata: {
        size: "",
        type: "",
        lastModified: "",
        name: " ",
      },
    },
    file: files[0],
  });

  useEffect(() => {
    if (isError) {
      showToast({
        description: isError,
        type: "error",
        message: "Error",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (files.length > 0) {
      setFormData({
        ...formData,
        info: {
          ...formData.info,
          metadata: {
            ...formData.info?.metadata,
            name: files[0].name,
          },
        },
      });
    }
  }, [files]);

  useEffect(() => {
    const teams_repo = new TeamsApiRepository();
    const GetData = async () => {
      try {
        setIsLoadingTeam(true);
        const dataFromTeams = await teams_repo.findAll();
        setTeams(dataFromTeams);
      } catch (error) {
        setIsError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while trying to retrieve information from the server."
        );
      } finally {
        setIsLoadingTeam(false);
      }
    };
    GetData();
  }, []);

  //  TODO: logs

  console.log(formData);

  const onFileValidate = useCallback(
    (file: File): string | null => {
      if (files.length >= 1) {
        return "You can only upload up to 1 file";
      }

      // Validate file type
      if (!file.type.startsWith("application/pdf")) {
        return "Only PDF files are allowed";
      }

      /*  // Validate file size 
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
      } */

      return null;
    },
    [files]
  );

  const onFileReject = useCallback((file: File) => {
    setIsError(
      `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected. You can only upload one file at a time. The file must be a PDF. `
    );
  }, []);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const documents_repo = new DocumentsApiRepository();

    if (files.length === 0) {
      setIsError("Please select a file");
      return;
    }

    if (!formData.name) {
      setIsError("Please enter a name");
      return;
    }

    if (!formData.type) {
      setIsError("Please select a type");
      return;
    }

    if (!formData.accessType) {
      setIsError("Please select an access type");
      return;
    }

    if (!formData.teamId) {
      setIsError("Please select a team");
      return;
    }

    if (!formData.info?.description) {
      setIsError("Please enter a description");
      return;
    }

    if (!formData.info?.tags?.length) {
      setIsError("Please enter a tag");
      return;
    }

    setFormData({
      ...formData,
      info: {
        ...formData.info,
        metadata: {
          ...formData.info?.metadata,
          name: files[0].name,
          type: files[0].type,
          size: (files[0].size * (1024 * 1024)).toString(),
          lastModified: files[0].lastModified.toString(),
        },
        tags: inputTags?.length ? inputTags : ["Uncategorized"],
      },
    });

    try {
      await documents_repo.create(formData);
      showToast({
        description: "Document uploaded successfully",
        type: "success",
        message: "Success",
      });
    } catch (error) {
      setIsError(
        error instanceof Error
          ? error.message
          : `Error uploading document: ${error}`
      );
    }

    setFiles([]);
    setFormData({
      name: "",
      type: DocumentsType.REPORT,
      accessType: DocumentsAccessType.PUBLIC,
      teamId: "",
      info: {
        description: "",
        tags: ["Uncategorized"],
        metadata: {
          size: "",
          type: "",
          lastModified: "",
          name: " ",
        },
      },
      file: files[0],
    });
    setInputTag("");
    setInputTags(null);
  };

  const docsType: DocumentsType[] = [
    DocumentsType.REPORT,
    DocumentsType.INVOICE,
    DocumentsType.CONTRACT,
    DocumentsType.MULTIMEDIA,
  ];

  const docsAccessType: DocumentsAccessType[] = [
    DocumentsAccessType.PUBLIC,
    DocumentsAccessType.PRIVATE,
    DocumentsAccessType.SHARED,
    DocumentsAccessType.SHARED_PRIVATE,
    DocumentsAccessType.TEAM,
  ];

  const handleAddTag = (tag: string) => {
    setInputTags((prevTags) => {
      if (prevTags?.includes(tag)) {
        return prevTags;
      }
      if (tag.trim() === "") {
        return prevTags;
      }
      if (prevTags) {
        return [...prevTags, tag];
      }
      return [tag];
    });
    setInputTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setInputTags((prevTags) => {
      if (prevTags) {
        return prevTags.filter((t) => t !== tag);
      }
      return [];
    });
  };

  return (
    <>
      <Card className=" max-w-3xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">
            Upload PDF Document
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={submitHandler}>
            <div className="space-y-4 flex flex-col w-full mb-12">
              <FileUpload
                value={files}
                onValueChange={setFiles}
                onFileValidate={onFileValidate}
                onFileReject={onFileReject}
                accept="application/pdf"
                maxFiles={1}
                multiple={false}
                disabled={files.length >= 1}
                className="w-full"
              >
                <FileUploadDropzone className="cursor-pointer py-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="border rounded-lg p-2">
                      <CloudUpload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">
                      Drag & drop your PDF file here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Or click to browse from your computer
                    </p>
                  </div>

                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-3">
                      Browse files
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>

                {/* Files List */}
                <FileUploadList className="mt-4">
                  {files.map((file) => (
                    <FileUploadItem key={file.name} value={file}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAME */}
              <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Name
                </Label>
                <InputGroup>
                  <InputGroupAddon>
                    <FileText />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Document Name"
                    id="name"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />
                </InputGroup>
              </div>

              {/* TYPE OF DOCUMENT */}
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">Document Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as DocumentsType,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {docsType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ACCESS TYPE */}
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">Access Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      accessType: value as DocumentsAccessType,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select access" />
                  </SelectTrigger>
                  <SelectContent>
                    {docsAccessType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* TEAM */}
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">Team</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, teamId: value })
                  }
                >
                  <SelectTrigger className="w-full" disabled={isLoadingTeam}>
                    <SelectValue
                      placeholder={
                        isLoadingTeam ? (
                          <CustomLoading message="Loading Teams Data" />
                        ) : (
                          "Select team"
                        )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {teams?.map((team) => (
                      <SelectItem key={team.id} value={team.id!.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-1"
                >
                  Description
                </Label>
                <InputGroup>
                  <InputGroupAddon>
                    <ClipboardList />
                  </InputGroupAddon>
                  <InputGroupTextarea
                    placeholder="Description"
                    id="description"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        info: { ...formData.info, description: e.target.value },
                      });
                    }}
                  />
                </InputGroup>
              </div>

              {/* TAGS */}
              <div className="flex flex-col gap-1 col-span-1 md:col-span-1">
                <Label htmlFor="tags" className="flex items-center gap-1">
                  Tags
                </Label>
                <InputGroup>
                  <InputGroupAddon>
                    <Tag />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Example: finance, report"
                    id="tags"
                    onChange={(e) => setInputTag(e.target.value)}
                  />
                  <InputGroupButton asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      className="mx-2"
                      onClick={() => handleAddTag(inputTag)}
                    >
                      <Tags /> <Plus />
                    </Button>
                  </InputGroupButton>
                </InputGroup>
                <div
                  className={cn(
                    "flex flex-wrap gap-2 bg-accent p-2 rounded-lg",
                    inputTags?.length ? "flex" : "hidden"
                  )}
                >
                  {inputTags?.map((tag) => (
                    <Badge key={tag}>
                      <Tag /> {tag}{" "}
                      <span
                        onClick={() => handleRemoveTag(tag)}
                        className="border   size-3 flex items-center border-destructive/50 rounded-sm bg-destructive text-destructive-foreground justify-center cursor-pointer"
                      >
                        <X />
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-12">
              {" "}
              Upload
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
