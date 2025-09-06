import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Upload,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Student & Faculty Management",
    desc: "Comprehensive user management system with role-based access for students, faculty, and administrators.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Attendance Tracking",
    desc: "Real-time attendance management with Excel upload support and automated analytics for academic monitoring.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Assignment System",
    desc: "Complete assignment lifecycle management from creation to submission with automated grading capabilities.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Academic Analytics",
    desc: "Advanced reporting and analytics for tracking student performance, attendance patterns, and academic trends.",
  },
  {
    icon: <Upload className="h-6 w-6" />,
    title: "File Management",
    desc: "Integrated file upload system with Cloudinary for secure document storage and certificate management.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Platform",
    desc: "JWT-based authentication with role-based permissions ensuring data security and user privacy.",
  },
];

export default function Feature1() {
  return (
    <section className="relative py-4">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        {/* <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Comprehensive Academic Management
            </h3>
            <p className="font-geist text-foreground/60 mt-3">
              Streamline your educational institution with our all-in-one platform 
              designed for modern academic management and student success.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                "linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)",
            }}></div>
        </div> */}
        <div className="">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa42f_inset]"
              >
                <div className="text-primary w-fit transform-gpu rounded-full border p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa43f_inset] dark:[box-shadow:0_-20px_80px_-20px_#ff7aa40f_inset]">
                  {item.icon}
                </div>
                <h4 className="font-geist text-lg font-bold tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-gray-500">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// } from "lucide-react";

// const features = [
//   {
//     icon: <Users className="h-6 w-6" />,
//     title: "Student & Faculty Management",
//     desc: "Comprehensive user management system with role-based access for students, faculty, and administrators.",
//   },
//   {
//     icon: <Calendar className="h-6 w-6" />,
//     title: "Attendance Tracking",
//     desc: "Real-time attendance management with Excel upload support and automated analytics for academic monitoring.",
//   },
//   {
//     icon: <FileText className="h-6 w-6" />,
//     title: "Assignment System",
//     desc: "Complete assignment lifecycle management from creation to submission with automated grading capabilities.",
//   },
//   {
//     icon: <BarChart3 className="h-6 w-6" />,
//     title: "Academic Analytics",
//     desc: "Advanced reporting and analytics for tracking student performance, attendance patterns, and academic trends.",
//   },
//   {
//     icon: <Upload className="h-6 w-6" />,
//     title: "File Management",
//     desc: "Integrated file upload system with Cloudinary for secure document storage and certificate management.",
//   },
//   {
//     icon: <Shield className="h-6 w-6" />,
//     title: "Secure Platform",
//     desc: "JWT-based authentication with role-based permissions ensuring data security and user privacy.",
//   },
// ];
// export default function Feature1() {
//   return (
//     <section className="relative py-14">
//       <div className="mx-auto max-w-screen-xl px-4 md:px-8">
//         <div className="relative mx-auto max-w-2xl sm:text-center">
//           <div className="relative z-10">
//             <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
//               Let&apos;s help build your MVP
//             </h3>
//             <p className="font-geist text-foreground/60 mt-3">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
//               congue, nisl eget molestie varius, enim ex faucibus purus.
//             </p>
//           </div>
//           <div
//             className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
//             style={{
//               background:
//                 "linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)",
//             }}></div>
//         </div>
//         <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
//         <div className="relative mt-12">
//           <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {features.map((item, idx) => (
//               <li
//                 key={idx}
//                 className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa42f_inset]">
//                 <div className="text-primary w-fit transform-gpu rounded-full border p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa43f_inset] dark:[box-shadow:0_-20px_80px_-20px_#ff7aa40f_inset]">
//                   {item.icon}
//                 </div>
//                 <h4 className="font-geist text-lg font-bold tracking-tighter">
//                   {item.title}
//                 </h4>
//                 <p className="text-gray-500">{item.desc}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }
