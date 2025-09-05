// src/pages/StudentInternshipsPage.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Fab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Stack,
  Input,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BuildingIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Work as WorkIcon,
  OpenInNew as ExternalLinkIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import {
  useGetMyInternships,
  useCreateInternship,
  useUpdateInternship,
  useDeleteInternship,
} from "../../hooks/useInternships";
import { createInternshipWithFile } from "../../api/internshipService";
import { toast } from "react-hot-toast";

const INTERNSHIP_STATUSES = [
  { value: "APPLIED", label: "Applied", color: "info" },
  { value: "ONGOING", label: "Ongoing", color: "warning" },
  { value: "COMPLETED", label: "Completed", color: "success" },
  { value: "CANCELLED", label: "Cancelled", color: "error" },
];

const StudentInternshipsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);
  const [uploadMethod, setUploadMethod] = useState("url");
  const [selectedFile, setSelectedFile] = useState(null);

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "APPLIED",
      location: "",
      stipend: "",
      certificateUrl: "",
    },
  });

  // API hooks
  const {
    data: internshipsData,
    isLoading,
    isError,
    error,
  } = useGetMyInternships();

  const createInternshipMutation = useCreateInternship();
  // const createInternshipWithFileMutation = useCreateInternship();
  const updateInternshipMutation = useUpdateInternship();
  const deleteInternshipMutation = useDeleteInternship();

  const internships = internshipsData?.data || [];

  const handleOpenDialog = (internship = null) => {
    setEditingInternship(internship);
    setUploadMethod("url");
    setSelectedFile(null);
    if (internship) {
      reset({
        companyName: internship.companyName,
        position: internship.role, // Map role from backend to position in frontend
        description: internship.description || "",
        startDate: dayjs(internship.startDate).format("YYYY-MM-DD"),
        endDate: internship.endDate
          ? dayjs(internship.endDate).format("YYYY-MM-DD")
          : "",
        status: internship.status,
        location: internship.location || "",
        stipend: internship.stipend ? internship.stipend.toString() : "", // Convert to string for form
        certificateUrl: internship.offerLetterPath || "", // Map offerLetterPath to certificateUrl
      });
    } else {
      reset({
        companyName: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "APPLIED",
        location: "",
        stipend: "",
        certificateUrl: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInternship(null);
    setSelectedFile(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      // Transform data to match backend schema
      const transformedData = {
        companyName: data.companyName,
        role: data.position, // Map position to role
        description: data.description || undefined,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        status: data.status,
        location: data.location || undefined,
        stipend: data.stipend ? Number(data.stipend) : undefined, // Convert to number
        offerLetterPath: data.certificateUrl || undefined, // Map certificateUrl to offerLetterPath
      };

      if (editingInternship) {
        // Update existing internship
        await updateInternshipMutation.mutateAsync({
          internshipId: editingInternship.id,
          internshipData: transformedData,
        });
        toast.success("Internship updated successfully!");
      } else {
        // Create new internship
        if (selectedFile && uploadMethod === "file") {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append("file", selectedFile);

          // Append transformed data to FormData, ensuring proper string conversion
          Object.keys(transformedData).forEach((key) => {
            if (transformedData[key] !== undefined) {
              // Convert to string for FormData
              formData.append(key, String(transformedData[key]));
            }
          });

          await createInternshipWithFile(formData);
          toast.success("Internship created successfully with file!");
        } else {
          // Regular creation
          await createInternshipMutation.mutateAsync(transformedData);
          toast.success("Internship created successfully!");
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting internship:", error);
      toast.error("Failed to submit internship. Please try again.");
    }
  };

  const handleDelete = (internship) => {
    setInternshipToDelete(internship);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteInternshipMutation.mutateAsync(internshipToDelete.id);
      toast.success("Internship deleted successfully!");
      setDeleteConfirmOpen(false);
      setInternshipToDelete(null);
    } catch (error) {
      toast.error("Failed to delete internship.");
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  if (isLoading) {
    return (
      <Container maxWidth="2xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="2xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Error loading internships: {error?.message || "Something went wrong"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="2xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            My Internships
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track and manage your internship experiences
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add Internship
        </Button>
      </Box>

      {/* Content */}
      {internships.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "grey.50",
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <WorkIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No internships yet
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 3 }}>
            Start tracking your internship experiences to build your
            professional portfolio
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Your First Internship
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {internships.map((internship) => (
            <Grid item xs={12} md={6} lg={4} key={internship.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <BuildingIcon color="primary" />
                        <Typography variant="h6" component="h3">
                          {internship.companyName}
                        </Typography>
                      </Box>
                      <Typography
                        color="textSecondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {internship.role}
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        INTERNSHIP_STATUSES.find(
                          (s) => s.value === internship.status
                        )?.label
                      }
                      color={
                        INTERNSHIP_STATUSES.find(
                          (s) => s.value === internship.status
                        )?.color
                      }
                      size="small"
                    />
                  </Box>

                  {/* Description */}
                  {internship.description && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {internship.description}
                    </Typography>
                  )}

                  {/* Details */}
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {dayjs(internship.startDate).format("MMM DD, YYYY")} -
                        {internship.endDate
                          ? dayjs(internship.endDate).format("MMM DD, YYYY")
                          : "Ongoing"}
                      </Typography>
                    </Box>

                    {internship.location && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {internship.location}
                        </Typography>
                      </Box>
                    )}

                    {internship.stipend && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <MoneyIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          ₹{Number(internship.stipend).toLocaleString()}/month
                        </Typography>
                      </Box>
                    )}

                    {internship.offerLetterPath && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ExternalLinkIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Button
                          size="small"
                          href={internship.offerLetterPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ p: 0, minWidth: "auto", textTransform: "none" }}
                        >
                          View Certificate
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(internship)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(internship)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="h2">
            {editingInternship ? "Edit Internship" : "Add New Internship"}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              {/* Basic Info */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="companyName"
                  control={control}
                  rules={{ required: "Company name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Company Name"
                      fullWidth
                      error={!!errors.companyName}
                      helperText={errors.companyName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="position"
                  control={control}
                  rules={{ required: "Position is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Position"
                      fullWidth
                      error={!!errors.position}
                      helperText={errors.position?.message}
                    />
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Brief description of your role and responsibilities..."
                    />
                  )}
                />
              </Grid>

              {/* Dates */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="End Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      helperText="Leave empty if ongoing"
                    />
                  )}
                />
              </Grid>

              {/* Status and Location */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        {INTERNSHIP_STATUSES.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      fullWidth
                      placeholder="City, State/Country"
                    />
                  )}
                />
              </Grid>

              {/* Stipend */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="stipend"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Monthly Stipend (₹)"
                      type="number"
                      fullWidth
                      placeholder="e.g., 15000"
                    />
                  )}
                />
              </Grid>

              {/* Certificate Upload */}
              {!editingInternship && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Certificate/Document
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={uploadMethod}
                      onChange={(e) => setUploadMethod(e.target.value)}
                      row
                    >
                      <FormControlLabel
                        value="url"
                        control={<Radio />}
                        label="URL"
                      />
                      <FormControlLabel
                        value="file"
                        control={<Radio />}
                        label="Upload File"
                      />
                    </RadioGroup>
                  </FormControl>

                  {uploadMethod === "url" ? (
                    <Controller
                      name="certificateUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Certificate URL"
                          type="url"
                          fullWidth
                          placeholder="https://example.com/certificate.pdf"
                          sx={{ mt: 1 }}
                        />
                      )}
                    />
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Upload Certificate/Document
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {selectedFile && (
                        <Typography variant="body2" color="textSecondary">
                          Selected: {selectedFile.name}
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                      >
                        Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                      </Typography>
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                createInternshipMutation.isLoading ||
                updateInternshipMutation.isLoading
              }
            >
              {createInternshipMutation.isLoading ||
              updateInternshipMutation.isLoading
                ? "Saving..."
                : editingInternship
                ? "Update"
                : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Internship</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the internship at{" "}
            <strong>{internshipToDelete?.companyName}</strong>? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteInternshipMutation.isLoading}
          >
            {deleteInternshipMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentInternshipsPage;
