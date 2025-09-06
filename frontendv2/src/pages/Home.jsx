import React from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  Calendar,
  Award,
  PieChart,
  TrendingUp,
  Clock,
  Globe,
  Database,
  Activity,
  FileText,
  Lightbulb,
  Sparkles,
  Code,
  Layers,
  Palette,
  GraduationCap,
  Brain,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Github,
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
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { TextReveal } from "../components/ui/text-reveal";
import BentoGrid1 from "../components/mvpblocks/bento-grid-1";
import Feature1 from "../components/mvpblocks/feature-1";
import { SparklesCore } from "../components/ui/sparkles";

const projectName = import.meta.env.VITE_PROJECT_NAME || "Trackademy";

function Home() {
  const stats = [
    { label: "Students Managed", value: "500+", icon: Users },
    { label: "Assignments Tracked", value: "1,200+", icon: FileText },
    { label: "Academic Records", value: "2,500+", icon: Database },
    { label: "Faculty Members", value: "50+", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Sparkles Background */}
      <section className="relative py-12 lg:py-24 overflow-hidden">
        {/* Sparkles Background */}
        {/* <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#3b82f6"
          />
        </div> */}

        <div className="absolute inset-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                7th Semester Computer Engineering Project
              </Badge>
            </div>

            {/* Text Reveal Animation */}
            <div className="mb-8">
              <TextReveal
                className="text-5xl lg:text-7xl font-bold leading-tight text-primary"
                from="bottom"
                split="word"
                delay={0.15}
              >
                {projectName}
              </TextReveal>
              <TextReveal
                className="text-3xl font-bold leading-tight"
                from="bottom"
                split="word"
                delay={0.15}
              >
                Academic Management System
              </TextReveal>
            </div>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              A comprehensive academic management system designed to streamline
              student tracking, attendance management, assignment handling, and
              academic analytics.
              <span className="text-foreground font-semibold">
                {" "}
                Built with modern technologies for educational excellence.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                <Github className="w-5 h-5 mr-2" />
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))} 
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Using MVPBlocks Feature Component */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Lightbulb className="w-4 h-4 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything you need for academic management
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools educators need
              to track, manage, and improve academic outcomes efficiently.
            </p>
          </div>

          {/* Feature Component */}
          <Feature1 />
        </div>
      </section>

      {/* Bento Grid Section - Using MVPBlocks Bento Grid
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Code className="w-4 h-4 mr-2" />
              Platform Capabilities
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Built for modern education
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of cutting-edge technology designed
              specifically for academic institutions and student management.
            </p>
          </div>

          <BentoGrid1 />
        </div>
      </section> */}

      {/* Enhanced Analytics Dashboard */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <Badge variant="outline" className="mb-4">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Real-time insights for academic excellence
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get comprehensive analytics and reporting that help educators
                make data-driven decisions for better academic outcomes and
                student progress tracking.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Student Performance Tracking
                    </h3>
                    <p className="text-muted-foreground">
                      Monitor individual and class progress with detailed
                      analytics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Attendance Analytics</h3>
                    <p className="text-muted-foreground">
                      Generate detailed attendance reports and identify
                      patterns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Assignment Insights</h3>
                    <p className="text-muted-foreground">
                      Track submission rates and identify students needing
                      support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Dashboard Preview */}
            <div>
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl mb-2 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-primary" />
                    Academic Dashboard
                  </CardTitle>
                  <CardDescription className="text-base">
                    Real-time academic metrics and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Overall Attendance</span>
                      <span className="text-sm text-muted-foreground">87%</span>
                    </div>
                    <Progress value={87} className="h-3" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Assignment Completion</span>
                      <span className="text-sm text-muted-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-3" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Academic Performance</span>
                      <span className="text-sm text-muted-foreground">91%</span>
                    </div>
                    <Progress value={91} className="h-3" />

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-background">
                        <div className="text-2xl font-bold text-primary">
                          247
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Active Students
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-background">
                        <div className="text-2xl font-bold text-primary">
                          42
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Today's Submissions
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Layers className="w-4 h-4 mr-2" />
              Technology Stack
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Built with modern technologies
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our project leverages cutting-edge technologies to deliver a
              robust, scalable, and user-friendly academic management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Frontend Technologies */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Frontend</CardTitle>
                <CardDescription>
                  Modern user interface technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-medium">React.js</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="font-medium">Vite</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="font-medium">JavaScript</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span className="font-medium">Tailwind CSS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="font-medium">Framer Motion</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backend Technologies */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                  <Server className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Backend</CardTitle>
                <CardDescription>
                  Robust server-side technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">Node.js</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="font-medium">TypeScript</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                    <span className="font-medium">Express.js</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    <span className="font-medium">Prisma ORM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-medium">Python FastAPI</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database & Cloud */}
            <Card className="p-6 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                  <Cloud className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Database & Cloud</CardTitle>
                <CardDescription>
                  Data storage and cloud services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                    <span className="font-medium">PostgreSQL</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="font-medium">Cloudinary</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <span className="font-medium">JWT Auth</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="font-medium">REST APIs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-medium">File Upload</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Development Tools */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center mb-8">
              Development Tools & Practices
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Github className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium">Git & GitHub</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Code className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium">VS Code</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium">Prisma Studio</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium">Responsive Design</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium">Security</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium">Performance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6">
              <GraduationCap className="w-4 h-4 mr-2" />
              Academic Project
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              7th Semester Computer Engineering Project
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              {projectName} represents our comprehensive approach to solving
              real-world academic management challenges through innovative
              technology solutions. This project demonstrates our understanding
              of full-stack development, database design, user experience, and
              modern software engineering practices.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  6 Months
                </div>
                <div className="text-muted-foreground">
                  Development Timeline
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Core Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  3 Platforms
                </div>
                <div className="text-muted-foreground">
                  Frontend, Backend, Analytics
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                <Github className="w-5 h-5 mr-2" />
                View Source Code
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                <Activity className="w-5 h-5 mr-2" />
                Project Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
