import React from "react";
import {
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import kandarp from "../../public/Kandarp.jpg";
import harsh from "../../public/Harsh.jpg";
import parin from "../../public/Parin.jpg";

const projectName = import.meta.env.VITE_PROJECT_NAME || "Trackademy";

const teamMembers = [
  {
    name: "Kandarp Gajjar",
    role: "Full Stack Developer",
    email: "kandarp_22091@ldrp.ac.in",
    linkedin: "https://www.linkedin.com/in/kandarpgajjar",
    portfolio: "https://slantie.vercel.app/",
    github: "https://github.com/slantie/",
    bio: "A passionate full-stack developer with expertise in modern web technologies and AI/ML systems. Kandarp architected the core frontend infrastructure of Trackademy using React, Vite, and modern JavaScript, while also implementing intelligent data analytics features. His specialization in artificial intelligence and machine learning has been instrumental in developing the platform's advanced academic analytics capabilities, enabling institutions to derive meaningful insights from student data. With a keen eye for user experience design and system architecture, he ensures that complex educational workflows are transformed into intuitive, seamless interfaces.",
    specialties: ["React.js", "TypeScript", "AI/ML", "System Architecture"],
    initials: "KG",
    color: "bg-[#155dfc]",
    image: kandarp,
  },
  {
    name: "Harsh Dodiya",
    role: "Full Stack Developer",
    email: "harsh_22087@ldrp.ac.in",
    linkedin: "https://www.linkedin.com/in/dodiyaharsh",
    portfolio: "https://harshdodiya.me/",
    github: "https://github.com/HarshDodiya1/",
    bio: "An accomplished full-stack developer with deep expertise in system design and DevOps practices. Harsh has been the driving force behind Trackademy's scalable architecture, designing robust backend systems that handle complex educational data workflows with high performance and reliability. His mastery of system design principles ensures the platform can efficiently manage thousands of concurrent academic operations while maintaining data integrity. Through his DevOps expertise, he has established seamless CI/CD pipelines and deployment strategies that enable rapid feature delivery and system maintenance, making Trackademy a truly enterprise-ready solution for educational institutions.",
    specialties: [
      "Node.js",
      "System Design",
      "DevOps",
      "Database Architecture",
    ],
    initials: "HD",
    color: "bg-[#2668fd]",
    image: harsh,
  },
  {
    name: "Parin Dave",
    role: "Full Stack Developer",
    email: "parin_22088@ldrp.ac.in",
    linkedin: "https://www.linkedin.com/in/parin-dave-800938267/",
    bio: "A skilled full-stack developer who played a crucial role in building Trackademy's comprehensive backend infrastructure. Parin developed the Node.js and Python-based servers that power the platform's core operations, handling everything from user authentication to complex academic data processing. His expertise in multiple programming languages and frameworks enabled the creation of robust APIs that seamlessly integrate with the frontend while maintaining high security standards. Through his work on the server architecture, he ensured that Trackademy can efficiently process and store large volumes of educational data, providing the reliable foundation that institutions depend on for their critical academic management processes.",
    specialties: [
      "Python",
      "Node.js",
      "API Development",
      "Database Management",
    ],
    initials: "PD",
    color: "bg-[#0a4eeb]",
    image: parin,
  },
];

function Team() {
  return (
    <div className="min-h-screen">
      {/* Team Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <GraduationCap className="w-4 h-4 mr-2" />
              Meet Our Team
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              The Minds Behind{" "}
              <span className="text-primary">{projectName}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three passionate Computer Engineering students who combined their
              skills and vision to create this comprehensive academic management
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-lg transition-shadow"
              >
                <CardHeader className="text-center">
                  {/* Avatar */}
                  <div
                    className={`w-60 h-60 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-60 h-60 rounded-full object-cover"
                    />

                    {/* <span className="text-2xl font-bold text-white">
                      {member.initials}
                    </span> */}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-lg font-medium text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bio */}
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {member.bio}
                  </p>

                  {/* Specialties */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Links */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {member.email}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1"
                      >
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>

                      {member.github && (
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="flex-1"
                        >
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>

                    {member.portfolio && (
                      <Button
                        size="sm"
                        variant="default"
                        asChild
                        className="w-full"
                      >
                        <a
                          href={member.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Portfolio
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Institution Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              <GraduationCap className="w-4 h-4 mr-2" />
              Our Institution
            </Badge>
            <h2 className="text-6xl lg:text-5xl font-bold mb-8">
              LDRP Institute of Technology & Research
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              This project was developed as part of our 7th semester Computer
              Engineering curriculum at LDRP-ITR, Gandhinagar. Under the
              guidance of our faculty, we applied theoretical knowledge to
              real-world challenges, creating a solution that addresses genuine
              needs in academic management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit LDRP-ITR
              </Button>
              <Button size="lg">
                <Github className="w-5 h-5 mr-2" />
                View Project Repository
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Team;
