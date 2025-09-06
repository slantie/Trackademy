import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateInternship,
  useUpdateInternship,
} from "../../hooks/useInternships";
// import { createInternshipWithFile } from "../../api/internshipService";
import { showToast } from "../../utils/toast";
import dayjs from "dayjs";

const INTERNSHIP_STATUSES = ["APPLIED", "ONGOING", "COMPLETED", "CANCELLED"];

const InternshipForm = ({ internship, onFinished }) => {
  const isEdit = !!internship;
  const {
    register,
    handleSubmit,
    reset,
    control,
  } = useForm();

  const createMutation = useCreateInternship();
  // We need to handle file upload separately
  const _createFileMutation = useUpdateInternship(); // This needs to be checked
  const updateMutation = useUpdateInternship();

  useEffect(() => {
    if (isEdit) {
      reset({
        companyName: internship.companyName,
        role: internship.role,
        description: internship.description || "",
        startDate: dayjs(internship.startDate).format("YYYY-MM-DD"),
        endDate: internship.endDate
          ? dayjs(internship.endDate).format("YYYY-MM-DD")
          : "",
        status: internship.status,
        location: internship.location || "",
        stipend: internship.stipend || "",
        offerLetterPath: internship.offerLetterPath || "",
      });
    } else {
      reset({
        companyName: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "APPLIED",
        location: "",
        stipend: "",
        offerLetterPath: "",
      });
    }
  }, [internship, reset, isEdit]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      stipend: data.stipend ? Number(data.stipend) : undefined,
      endDate: data.endDate || undefined,
    };

    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Internship ${isEdit ? "updated" : "added"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "add"} internship.`
        );
      },
    };

    if (isEdit) {
      updateMutation.mutate(
        { internshipId: internship.id, internshipData: processedData },
        mutationOptions
      );
    } else {
      // Logic for creating with or without file would go here
      // For simplicity, we'll assume URL for now as file logic is complex with react-hook-form
      createMutation.mutate(processedData, mutationOptions);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6"
    >
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="companyName" className="text-right">
          Company
        </Label>
        <Input
          id="companyName"
          {...register("companyName", { required: true })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Role
        </Label>
        <Input
          id="role"
          {...register("role", { required: true })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="startDate" className="text-right">
          Start Date
        </Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate", { required: true })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="endDate" className="text-right">
          End Date
        </Label>
        <Input
          id="endDate"
          type="date"
          {...register("endDate")}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERNSHIP_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">
          Location
        </Label>
        <Input id="location" {...register("location")} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stipend" className="text-right">
          Stipend (₹)
        </Label>
        <Input
          id="stipend"
          type="number"
          {...register("stipend")}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="offerLetterPath" className="text-right">
          Offer Letter URL
        </Label>
        <Input
          id="offerLetterPath"
          {...register("offerLetterPath")}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          {isLoading ? "Saving..." : "Save Internship"}
        </Button>
      </div>
    </form>
  );
};

export default InternshipForm;
