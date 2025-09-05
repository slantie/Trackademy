### 1. 📊 **Exams Module Analytics**

**Schema Highlights:** `Exam` (`name`, `examType`, `semesterId`, `isPublished`), related to `Semester`, `Department`, `AcademicYear`.

1.  **Total Exams by Type (Pie/Bar Chart)**
    *   **Description:** Visualizes the distribution of exams based on their `examType` (e.g., Midterm, Final, Remedial, Repeat).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`.
    *   **Insight:** Helps understand the academic calendar's structure and emphasis on different exam formats.
2.  **Exam Publication Status (Pie Chart)**
    *   **Description:** Shows the proportion of exams that are `isPublished` (true) versus `unpublished` (false).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `examType`.
    *   **Insight:** Tracks the readiness and transparency of exam results for students.
3.  **Exams Conducted Over Time (Line Chart)**
    *   **Description:** Trends the number of exams conducted each month or quarter over a selected period. (Requires `createdAt` or `examDate` on the `Exam` model for accurate trending, `examDate` is optional in the schema).
    *   **Filters:** `collegeId`, `departmentId`, `examType`.
    *   **Insight:** Identifies peak periods for examinations and workload distribution.

---

### 2. 👨‍🎓 **Students Module Analytics**

**Schema Highlights:** `Student` (`fullName`, `enrollmentNumber`, `batch`, `departmentId`, `semesterId`, `divisionId`), related to `User`, `Department`, `Semester`, `Division`.

1.  **Student Enrollment Overview (Key Metrics / Donut Chart)**
    *   **Description:** Displays key figures like `totalStudents`, `deletedStudents`, `verifiedUsers`, and `unverifiedUsers` (derived from `user` relations). A donut chart could show the `verificationPercentage`.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `batch`.
    *   **Insight:** Provides a high-level health check of the student base and account status.
2.  **Students by Batch (Bar Chart)**
    *   **Description:** Shows the count of students within each `batch`.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`.
    *   **Insight:** Useful for understanding class sizes and resource allocation per batch.
3.  **Students by Division (Bar Chart)**
    *   **Description:** Illustrates the distribution of students across different `division`s within a semester or department.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `batch`.
    *   **Insight:** Helps in balancing class sizes and managing academic loads per division.
4.  **Student Enrollment Growth (Line Chart)**
    *   **Description:** Tracks the number of new student enrollments (`user.createdAt` for role `STUDENT`) over time (e.g., monthly, yearly).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`.
    *   **Insight:** Visualizes the institution's growth and intake trends.

---

### 3. 💼 **Internship Module Analytics**

**Schema Highlights:** `Internship` (`companyName`, `role`, `startDate`, `endDate`, `status`, `stipend`, `location`, `studentId`), related to `Student`.

1.  **Internship Status Breakdown (Pie Chart)**
    *   **Description:** Shows the distribution of internships by `status` (Applied, Ongoing, Completed, Cancelled).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `batch`, `startDate` (year/month range).
    *   **Insight:** Helps in tracking the progression and success rates of student internships.
2.  **Internship Application Trends (Line Chart)**
    *   **Description:** Visualizes the number of internships applied for or started (`startDate`) over time (e.g., monthly, quarterly).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `status`.
    *   **Insight:** Identifies seasonal peaks in internship activities and student interest.
3.  **Top Internship Companies (Bar Chart)**
    *   **Description:** Lists the top N companies where students are doing internships, based on the count of `COMPLETED` or `ONGOING` internships.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `status` (`COMPLETED`, `ONGOING`).
    *   **Insight:** Highlights popular and recurring internship partners.
4.  **Top Internship Roles (Bar Chart)**
    *   **Description:** Shows the most common internship `role`s undertaken by students.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `status` (`COMPLETED`, `ONGOING`).
    *   **Insight:** Reveals prevalent career paths and skill demands in the industry.
5.  **Average Stipend by Role/Company (Bar Chart)**
    *   **Description:** Compares the average `stipend` offered across different `role`s or `companyName`s.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `status` (`COMPLETED`, `ONGOING`).
    *   **Insight:** Provides benchmarks for student compensation in various internship positions.

---

### 4. 📝 **Assignments Module Analytics**

**Schema Highlights:** `Assignment` (`title`, `dueDate`, `totalMarks`, `courseId`), related to `Course`, `Submission`.

1.  **Assignment Overview (Key Metrics)**
    *   **Description:** Displays `totalAssignments`, `activeAssignments`, `overdueAssignments`, `totalSubmissions`, `gradedSubmissions`, `pendingSubmissions` (from `submissionService.getStatistics`).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `subjectId`, `facultyId`, `courseId`.
    *   **Insight:** Provides a quick summary of assignment workload and completion/grading status.
2.  **Submission Status Breakdown (Pie Chart)**
    *   **Description:** For a given assignment or course, shows the percentage of submissions that are `GRADED`, `SUBMITTED`, `PENDING_REVIEW`, and potentially `OVERDUE` (not yet submitted past deadline).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `subjectId`, `facultyId`, `courseId`, `assignmentId`.
    *   **Insight:** Helps faculty track grading progress and student compliance.
3.  **Average Marks by Assignment/Course/Subject (Bar Chart)**
    *   **Description:** Compares `averageMarks` obtained for assignments, grouped by assignment, course, or subject.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `subjectId`, `facultyId`, `courseId`.
    *   **Insight:** Highlights student performance trends in different academic areas.
4.  **Assignment Due Date Distribution (Histogram/Bar Chart)**
    *   **Description:** Shows the number of assignments due within specific timeframes (e.g., weekly, monthly).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `subjectId`, `facultyId`, `courseId`.
    *   **Insight:** Aids in workload planning for both faculty and students.

---

### 5. 💯 **Results Module Analytics** (Referencing `ExamResult` and `Result` models)

**Schema Highlights:** `ExamResult` (`spi`, `cpi`, `status`, `examId`, `studentId`), `Result` (`grade`, `credits`, `subjectId`).

1.  **Overall Exam Performance (Key Metrics / Donut Chart)**
    *   **Description:** Displays `totalResults`, `passCount`, `failCount`, `passPercentage`, `failPercentage` (from `examResultService.getStatistics`). A donut chart can visualize pass vs. fail.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `examId`, `examType`.
    *   **Insight:** Provides an immediate understanding of overall student success in exams.
2.  **Average SPI and CPI Trends (Line Chart)**
    *   **Description:** Tracks the `averageSpi` and `averageCpi` over different `academicYear`s or `semester`s.
    *   **Filters:** `collegeId`, `departmentId`, `examType` (e.g., to compare performance in midterms vs. finals).
    *   **Insight:** Shows long-term academic performance and overall student quality.
3.  **Top/Bottom Performers by SPI/CPI (Bar Chart / List)**
    *   **Description:** Lists the top N students with the highest `spi` or `cpi` (and lowest, if desired).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `examId`, `byField` (`spi` or `cpi`).
    *   **Insight:** Recognizes high achievers and identifies students who may require academic intervention.
4.  **Result Status Distribution (Pie Chart)**
    *   **Description:** Breaks down exam results by `status` (Pass, Fail, Trial, Absent, Unknown, Withheld).
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `examId`.
    *   **Insight:** Offers a detailed view of student outcomes beyond simple pass/fail, indicating specific issues like absent students or pending results.
5.  **Subject-wise Grade Distribution (Bar Chart)**
    *   **Description:** For a given `exam` or `semester`, shows the count of students receiving each `grade` (e.g., A, B, C, D, F) for each `subject`.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `examId`, `subjectId`.
    *   **Insight:** Pinpoints subjects where students collectively excel or struggle, informing curriculum adjustments or teaching strategies.

---

### 6.  attendance Module Analytics

**Schema Highlights:** `Attendance` (`date`, `status`, `courseId`, `studentId`), related to `Course`, `Student`.

1.  **Overall Attendance Rate (Key Metric / Gauge Chart)**
    *   **Description:** Displays the average attendance percentage across the institution or filtered segments.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `batch`, `subjectId`, `facultyId`, `courseId`, `dateRange`.
    *   **Insight:** A high-level indicator of student engagement and presence.
2.  **Attendance Status Breakdown (Pie Chart)**
    *   **Description:** Shows the distribution of attendance records by `status` (PRESENT, ABSENT, MEDICAL_LEAVE, AUTHORIZED_LEAVE) for a selected period or course.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `subjectId`, `facultyId`, `courseId`, `date` (specific day).
    *   **Insight:** Helps understand the reasons for absences and identify patterns.
3.  **Top/Bottom Attended Courses (Bar Chart)**
    *   **Description:** Lists courses with the highest and lowest average attendance percentages.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `facultyId`, `dateRange`.
    *   **Insight:** Can highlight student interest in certain subjects or indicate issues with specific courses/instructors.
4.  **Student Attendance Trends (Line Chart)**
    *   **Description:** Shows the attendance percentage for an individual student or the average for a group (e.g., a division or batch) over a period.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `batch`, `studentId`, `courseId`, `dateRange`.
    *   **Insight:** Monitors individual student engagement or identifies groups with declining attendance.
5.  **Attendance by Lecture Type (Bar Chart)**
    *   **Description:** Compares the average attendance rates for `THEORY` versus `PRACTICAL` lectures.
    *   **Filters:** `collegeId`, `departmentId`, `academicYearId`, `semesterId`, `divisionId`, `batch`, `subjectId`, `facultyId`, `dateRange`.
    *   **Insight:** Explores if different lecture formats influence student attendance differently.

---