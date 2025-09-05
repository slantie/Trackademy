// src/pages/student/StudentCertificatesPage.jsx
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
  Link,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Input,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import {
  useGetMyCertificates,
  useCreateCertificate,
  useCreateCertificateWithFile,
  useUpdateCertificate,
  useDeleteCertificate,
} from "../../hooks/useCertificates";

const StudentCertificatesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [uploadMethod, setUploadMethod] = useState("url"); // "url" or "file"
  const [selectedFile, setSelectedFile] = useState(null);

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      issuingOrganization: "",
      issueDate: "",
      description: "",
      certificatePath: "",
    },
  });

  // API hooks
  const {
    data: certificatesData,
    isLoading,
    isError,
    error,
  } = useGetMyCertificates();

  const createCertificateMutation = useCreateCertificate();
  const createCertificateWithFileMutation = useCreateCertificateWithFile();
  const updateCertificateMutation = useUpdateCertificate();
  const deleteCertificateMutation = useDeleteCertificate();

  const certificates = certificatesData?.data || [];

  const handleOpenDialog = (certificate = null) => {
    setEditingCertificate(certificate);
    setUploadMethod("url");
    setSelectedFile(null);
    if (certificate) {
      reset({
        title: certificate.title,
        issuingOrganization: certificate.issuingOrganization,
        issueDate: dayjs(certificate.issueDate).format("YYYY-MM-DD"),
        description: certificate.description || "",
        certificatePath: certificate.certificatePath,
      });
    } else {
      reset({
        title: "",
        issuingOrganization: "",
        issueDate: "",
        description: "",
        certificatePath: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCertificate(null);
    setUploadMethod("url");
    setSelectedFile(null);
    reset();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDeleteConfirm = (certificate) => {
    setCertificateToDelete(certificate);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setCertificateToDelete(null);
  };

  const onSubmit = async (data) => {
    try {
      if (editingCertificate) {
        // For editing, always use the regular update method
        await updateCertificateMutation.mutateAsync({
          certificateId: editingCertificate.id,
          certificateData: data,
        });
      } else {
        // For creating new certificates
        if (uploadMethod === "file" && selectedFile) {
          // Use file upload method
          const formData = new FormData();
          formData.append("certificate", selectedFile);
          formData.append("title", data.title);
          formData.append("issuingOrganization", data.issuingOrganization);
          formData.append("issueDate", data.issueDate);
          formData.append("description", data.description || "");

          await createCertificateWithFileMutation.mutateAsync(formData);
        } else {
          // Use URL method
          await createCertificateMutation.mutateAsync(data);
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving certificate:", error);
    }
  };

  const handleDelete = async () => {
    if (certificateToDelete) {
      try {
        await deleteCertificateMutation.mutateAsync(certificateToDelete.id);
        handleDeleteCancel();
      } catch (error) {
        console.error("Error deleting certificate:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="2xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="2xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Failed to load certificates. Please try again later.
          {error?.message && <div>Error: {error.message}</div>}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="2xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <SchoolIcon sx={{ mr: 2, fontSize: 32, color: "primary.main" }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Certificates
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your professional certificates and achievements
          </Typography>
        </Box>
        <Chip
          label={`${certificates.length} Certificate${
            certificates.length !== 1 ? "s" : ""
          }`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.50",
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <SchoolIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No certificates yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start building your professional portfolio by adding your
            certificates
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Your First Certificate
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {certificates.map((certificate) => (
            <Grid item xs={12} sm={6} md={4} key={certificate.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <SchoolIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" noWrap>
                        {certificate.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <BusinessIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {certificate.issuingOrganization}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(certificate.issueDate).format("MMM D, YYYY")}
                    </Typography>
                  </Box>

                  {certificate.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {certificate.description}
                    </Typography>
                  )}
                </CardContent>

                <CardActions
                  sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                >
                  <Box>
                    {certificate.certificatePath && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          window.open(certificate.certificatePath, "_blank")
                        }
                        title="View certificate"
                      >
                        <ViewIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(certificate)}
                      title="Edit certificate"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteConfirm(certificate)}
                      title="Delete certificate"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add certificate"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Certificate Title"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="issuingOrganization"
                control={control}
                rules={{ required: "Issuing organization is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Issuing Organization"
                    placeholder="e.g., Amazon Web Services"
                    error={!!errors.issuingOrganization}
                    helperText={errors.issuingOrganization?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="issueDate"
                control={control}
                rules={{ required: "Issue date is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Issue Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.issueDate}
                    helperText={errors.issueDate?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              {/* Certificate Upload Method Selection (only for new certificates) */}
              {!editingCertificate && (
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Certificate Source</FormLabel>
                  <RadioGroup
                    value={uploadMethod}
                    onChange={(e) => setUploadMethod(e.target.value)}
                    row
                  >
                    <FormControlLabel
                      value="url"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LinkIcon sx={{ mr: 1 }} />
                          URL/Link
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="file"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CloudUploadIcon sx={{ mr: 1 }} />
                          Upload File
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              )}

              {/* Certificate Path/URL Field (when URL method is selected or editing) */}
              {(uploadMethod === "url" || editingCertificate) && (
                <Controller
                  name="certificatePath"
                  control={control}
                  rules={{
                    required:
                      uploadMethod === "url"
                        ? "Certificate URL/Path is required"
                        : false,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Certificate URL/Path"
                      placeholder="https://..."
                      error={!!errors.certificatePath}
                      helperText={
                        errors.certificatePath?.message ||
                        "Provide a link to view the certificate"
                      }
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              )}

              {/* File Upload Field (when file method is selected) */}
              {uploadMethod === "file" && !editingCertificate && (
                <Box sx={{ mb: 2 }}>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    Upload Certificate File
                  </FormLabel>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    inputProps={{
                      accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
                    }}
                    sx={{ width: "100%" }}
                  />
                  {selectedFile && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Selected: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              )}

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Description (Optional)"
                    placeholder="Brief description of the certificate..."
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                createCertificateMutation.isLoading ||
                createCertificateWithFileMutation.isLoading ||
                updateCertificateMutation.isLoading ||
                (uploadMethod === "file" &&
                  !editingCertificate &&
                  !selectedFile)
              }
            >
              {createCertificateMutation.isLoading ||
              createCertificateWithFileMutation.isLoading ||
              updateCertificateMutation.isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Saving...
                </>
              ) : editingCertificate ? (
                "Update Certificate"
              ) : (
                "Add Certificate"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Certificate</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the certificate "
            {certificateToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteCertificateMutation.isLoading}
          >
            {deleteCertificateMutation.isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentCertificatesPage;
