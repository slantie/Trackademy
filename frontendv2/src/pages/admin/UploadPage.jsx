import React, { useState } from "react";
import {
  UploadCloud,
  Users,
  BookUser,
  Book,
  FileJson,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadData } from "../../hooks/useUpload";
import { useGetDepartments } from "../../hooks/useDepartments";
import { useGetAcademicYears } from "../../hooks/useAcademicYears";
import { showToast } from "../../utils/toast";

const UploadCard = ({
  title,
  description,
  icon,
  uploadKey,
  fields = [],
  onUpload,
  status,
}) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleFieldChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      showToast.warning("Please select a file to upload.");
      return;
    }
    onUpload(uploadKey, file, formData);
  };

  const isLoading = status?.loading;

  return (
    <div className="bg-background border border-border rounded-xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-grow space-y-4"
      >
        <div className="space-y-4 flex-grow">
          <div>
            <Label htmlFor={`file-${uploadKey}`}>Excel File</Label>
            <Input
              id={`file-${uploadKey}`}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          {fields.map((field) => (
            <div key={field.name}>
              <Label>{field.label}</Label>
              <Select
                onValueChange={(value) => handleFieldChange(field.name, value)}
                required={field.required}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isLoading} className="mt-4 w-full">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload {title}
            </>
          )}
        </Button>

        {status?.error && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {status.error}
          </p>
        )}
        {status?.success && (
          <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> {status.success}
          </p>
        )}
      </form>
    </div>
  );
};

const UploadPage = () => {
  const { mutate: uploadData } = useUploadData();
  const [uploadStatus, setUploadStatus] = useState({});

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const { data: academicYearsData, isLoading: yearsLoading } =
    useGetAcademicYears();

  const departments = departmentsData?.data?.departments?.data || [];
  const academicYears = academicYearsData?.data?.academicYears || [];

  const handleUpload = (uploadKey, file, formData) => {
    setUploadStatus((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null, success: null },
    }));

    uploadData(
      { uploadType: uploadKey, file, ...formData },
      {
        onSuccess: () => {
          setUploadStatus((prev) => ({
            ...prev,
            [uploadKey]: { loading: false, success: "Upload successful!" },
          }));
        },
        onError: (error) => {
          setUploadStatus((prev) => ({
            ...prev,
            [uploadKey]: {
              loading: false,
              error: error.response?.data?.message || "Upload failed.",
            },
          }));
        },
      }
    );
  };

  const uploadConfigs = [
    {
      key: "students",
      title: "Student Data",
      description: "Bulk upload student records.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      key: "faculty",
      title: "Faculty Data",
      description: "Bulk upload faculty records.",
      icon: <BookUser className="w-6 h-6" />,
    },
    {
      key: "subjects",
      title: "Subject Data",
      description: "Bulk upload course subjects.",
      icon: <Book className="w-6 h-6" />,
    },
    {
      key: "faculty-matrix",
      title: "Faculty Matrix",
      description: "Assign subjects to faculty.",
      icon: <FileJson className="w-6 h-6" />,
      fields: [
        {
          name: "academicYearId",
          label: "Academic Year",
          placeholder: "Select Academic Year",
          required: true,
          options: academicYears.map((y) => ({ value: y.id, label: y.year })),
        },
        {
          name: "departmentId",
          label: "Department",
          placeholder: "Select Department",
          required: true,
          options: departments.map((d) => ({ value: d.id, label: d.name })),
        },
        {
          name: "semesterType",
          label: "Semester Type",
          placeholder: "Select Type",
          required: true,
          options: [
            { value: "ODD", label: "Odd" },
            { value: "EVEN", label: "Even" },
          ],
        },
      ],
    },
    {
      key: "results",
      title: "Exam Results",
      description: "Upload student exam results.",
      icon: <FileJson className="w-6 h-6" />,
      fields: [
        {
          name: "examType",
          label: "Exam Type",
          placeholder: "Select Type",
          required: true,
          options: [
            { value: "MIDTERM", label: "Midterm" },
            { value: "FINAL", label: "Final" },
            { value: "REMEDIAL", label: "Remedial" },
          ],
        },
        {
          name: "academicYearId",
          label: "Academic Year",
          placeholder: "Select Year",
          required: true,
          options: academicYears.map((y) => ({ value: y.id, label: y.year })),
        },
        {
          name: "departmentId",
          label: "Department",
          placeholder: "Select Department",
          required: true,
          options: departments.map((d) => ({ value: d.id, label: d.name })),
        },
      ],
    },
  ];

  if (departmentsLoading || yearsLoading) {
    return (
      <div className="text-center p-10">
        Loading necessary data for upload forms...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Bulk Data Upload</h1>
        <p className="text-muted-foreground mt-1">
          Streamline data entry by uploading Excel files. Download templates to
          ensure correct formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploadConfigs.map((config) => (
          <UploadCard
            key={config.key}
            {...config}
            onUpload={handleUpload}
            status={uploadStatus[config.key]}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadPage;
