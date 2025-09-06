import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useCreateCertificate,
  useCreateCertificateWithFile,
  useUpdateCertificate,
} from "../../hooks/useCertificates";
import { showToast } from "../../utils/toast";
import dayjs from "dayjs";
import { Link, UploadCloud } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

const CertificateForm = ({ certificate, onFinished }) => {
  const isEdit = !!certificate;
  const [uploadMethod, setUploadMethod] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset, control } = useForm();

  const createMutation = useCreateCertificate();
  const createFileMutation = useCreateCertificateWithFile();
  const updateMutation = useUpdateCertificate();

  useEffect(() => {
    if (isEdit) {
      reset({
        title: certificate.title,
        issuingOrganization: certificate.issuingOrganization,
        issueDate: dayjs(certificate.issueDate).format("YYYY-MM-DD"),
        description: certificate.description || "",
        certificatePath: certificate.certificatePath || "",
      });
      // If the existing certificate has a path, assume it's a URL
      setUploadMethod(certificate.certificatePath ? "url" : "file");
    } else {
      reset({
        title: "",
        issuingOrganization: "",
        issueDate: "",
        description: "",
        certificatePath: "",
      });
    }
  }, [certificate, reset, isEdit]);

  const onSubmit = (data) => {
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Certificate ${isEdit ? "updated" : "added"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "add"} certificate.`
        );
      },
    };

    if (isEdit) {
      updateMutation.mutate(
        { certificateId: certificate.id, certificateData: data },
        mutationOptions
      );
    } else {
      if (uploadMethod === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("certificate", selectedFile);
        Object.keys(data).forEach((key) => {
          if (key !== "certificatePath") formData.append(key, data[key]);
        });
        createFileMutation.mutate(formData, mutationOptions);
      } else {
        createMutation.mutate(data, mutationOptions);
      }
    }
  };

  const isLoading =
    createMutation.isPending ||
    createFileMutation.isPending ||
    updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="issuingOrganization" className="text-right">
          Organization
        </Label>
        <Input
          id="issuingOrganization"
          {...register("issuingOrganization", {
            required: "Organization is required",
          })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="issueDate" className="text-right">
          Issue Date
        </Label>
        <Input
          id="issueDate"
          type="date"
          {...register("issueDate", { required: "Issue date is required" })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right pt-2">
          Description
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          className="col-span-3"
        />
      </div>

      {!isEdit && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Source</Label>
          <Controller
            name="uploadMethod"
            control={control}
            render={() => (
              <RadioGroup
                defaultValue="url"
                onValueChange={setUploadMethod}
                className="col-span-3 flex gap-4"
              >
                <Label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="url" id="url" />{" "}
                  <Link className="w-4 h-4 mr-1" /> URL
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="file" id="file" />{" "}
                  <UploadCloud className="w-4 h-4 mr-1" /> File
                </Label>
              </RadioGroup>
            )}
          />
        </div>
      )}

      {uploadMethod === "url" ? (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="certificatePath" className="text-right">
            Certificate URL
          </Label>
          <Input
            id="certificatePath"
            {...register("certificatePath")}
            className="col-span-3"
            placeholder="https://..."
          />
        </div>
      ) : !isEdit ? (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="file-upload" className="text-right">
            Upload File
          </Label>
          <Input
            id="file-upload"
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="col-span-3"
          />
        </div>
      ) : null}

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onFinished}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save Certificate"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CertificateForm;
