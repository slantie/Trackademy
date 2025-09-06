import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCollege, useUpdateCollege } from "../../hooks/useColleges";
import { showToast } from "../../utils/toast";

const CollegeForm = ({ college, onFinished }) => {
  const isEdit = !!college;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createMutation = useCreateCollege();
  const updateMutation = useUpdateCollege();

  useEffect(() => {
    if (isEdit) {
      reset({
        name: college.name,
        abbreviation: college.abbreviation,
        website: college.website || "",
        address: college.address || "",
        contactNumber: college.contactNumber || "",
      });
    } else {
      reset({
        name: "",
        abbreviation: "",
        website: "",
        address: "",
        contactNumber: "",
      });
    }
  }, [college, reset, isEdit]);

  const onSubmit = (data) => {
    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `College ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} college.`
        );
      },
    };

    if (isEdit) {
      mutation.mutate(
        { collegeId: college.id, collegeData: data },
        mutationOptions
      );
    } else {
      mutation.mutate(data, mutationOptions);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          className="col-span-3"
        />
        {errors.name && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="abbreviation" className="text-right">
          Abbreviation
        </Label>
        <Input
          id="abbreviation"
          {...register("abbreviation", {
            required: "Abbreviation is required",
          })}
          className="col-span-3"
        />
        {errors.abbreviation && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.abbreviation.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="website" className="text-right">
          Website
        </Label>
        <Input id="website" {...register("website")} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Address
        </Label>
        <Input id="address" {...register("address")} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactNumber" className="text-right">
          Contact
        </Label>
        <Input
          id="contactNumber"
          {...register("contactNumber")}
          className="col-span-3"
        />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default CollegeForm;
