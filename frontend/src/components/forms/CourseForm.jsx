// src/components/forms/CourseForm.jsx
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  DialogContent,
  DialogActions,
  DialogTitle,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useCreateCourse, useUpdateCourse } from '../../hooks/useCourses';
import { useGetSubjects } from '../../hooks/useSubjects';
import { useGetFaculties } from '../../hooks/useFaculties';
import { useGetSemesters } from '../../hooks/useSemesters';
import { useGetDivisions } from '../../hooks/useDivisions';
import { toast } from 'react-hot-toast';

const LectureType = {
  THEORY: "THEORY",
  PRACTICAL: "PRACTICAL",
};

const CourseForm = ({ onClose, course }) => {
  const isEdit = !!course;
  const { register, handleSubmit, reset, control, watch } = useForm({
    defaultValues: isEdit
      ? {
          subject: course.subject || null,
          faculty: course.faculty || null,
          semester: course.semester || null,
          division: course.division || null,
          lectureType: course.lectureType || 'THEORY',
          batch: course.batch || '',
        }
      : {
          subject: null,
          faculty: null,
          semester: null,
          division: null,
          lectureType: 'THEORY',
          batch: '',
        },
  });

  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects();
  const { data: facultiesData, isLoading: facultiesLoading } = useGetFaculties();
  const { data: semestersData, isLoading: semestersLoading } = useGetSemesters();
  const { data: divisionsData, isLoading: divisionsLoading } = useGetDivisions();

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  const watchedLectureType = watch('lectureType');

  useEffect(() => {
    if (isEdit && course) {
      reset({
        subject: course.subject || null,
        faculty: course.faculty || null,
        semester: course.semester || null,
        division: course.division || null,
        lectureType: course.lectureType || 'THEORY',
        batch: course.batch || '',
      });
    } else {
      reset({
        subject: null,
        faculty: null,
        semester: null,
        division: null,
        lectureType: 'THEORY',
        batch: '',
      });
    }
  }, [isEdit, course, reset]);

  const onSubmit = (data) => {
    const submitData = {
      ...data,
      subjectId: data.subject?.id,
      facultyId: data.faculty?.id,
      semesterId: data.semester?.id,
      divisionId: data.division?.id,
      // Remove complex objects
      subject: undefined,
      faculty: undefined,
      semester: undefined,
      division: undefined,
      // Ensure batch is null for THEORY and sent for PRACTICAL
      batch: data.lectureType === 'THEORY' ? null : data.batch,
    };
    
    // Clean data by removing undefined fields
    Object.keys(submitData).forEach(key => submitData[key] === undefined && delete submitData[key]);

    if (isEdit) {
      updateMutation.mutate(
        { courseId: course.id, courseData: submitData },
        {
          onSuccess: () => {
            toast.success('Course updated successfully!');
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(`Failed to update course: ${error.response?.data?.message || error.message}`);
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success('Course created successfully!');
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(`Failed to create course: ${error.response?.data?.message || error.message}`);
        },
      });
    }
  };

  const subjects = subjectsData?.data?.subjects || [];
  const faculties = facultiesData?.data?.faculties?.data || [];
  const semesters = semestersData?.data?.semesters?.data || [];
  const divisions = divisionsData?.data?.divisions?.data || [];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{isEdit ? 'Update Course' : 'Create Course'}</DialogTitle>
      <DialogContent dividers>
        <Controller
          name="subject"
          control={control}
          rules={{ required: 'Subject is required' }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={subjects}
              getOptionLabel={(option) => option ? `${option.code || 'N/A'} - ${option.name || 'N/A'}` : "NA"}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              disabled={isEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subject"
                  margin="normal"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {subjectsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />

        <Controller
          name="faculty"
          control={control}
          rules={{ required: 'Faculty is required' }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={faculties}
              getOptionLabel={(option) => option ? `${option.fullName} (${option.abbreviation})` : ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              disabled={isEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Faculty"
                  margin="normal"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {facultiesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        
        <Controller
          name="semester"
          control={control}
          rules={{ required: 'Semester is required' }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={semesters}
              getOptionLabel={(option) => option ? `Semester ${option.semesterNumber} (${option.academicYear?.year}) - ${option.department?.abbreviation}` : ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              disabled={isEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Semester"
                  margin="normal"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {semestersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        
        <Controller
          name="division"
          control={control}
          rules={{ required: 'Division is required' }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={divisions}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              disabled={isEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Division"
                  margin="normal"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {divisionsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Lecture Type</InputLabel>
          <Controller
            name="lectureType"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Lecture Type" disabled={isEdit}>
                {Object.values(LectureType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {watchedLectureType === 'PRACTICAL' && (
          <TextField
            margin="normal"
            fullWidth
            label="Batch"
            {...register('batch')}
            required
            disabled={isEdit}
          />
        )}
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={createMutation.isLoading || updateMutation.isLoading}
        >
          {createMutation.isLoading || updateMutation.isLoading ? (
            <CircularProgress size={24} />
          ) : isEdit ? (
            'Update'
          ) : (
            'Create'
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default CourseForm;
