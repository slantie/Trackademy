import React from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Calendar,
  Award,
  PieChart,
  TrendingUp,
  Clock,
  Target,
  Globe,
  Database,
  Activity,
  FileText,
  MessageCircle,
  Lightbulb,
  Sparkles,
  Code,
  Layers,
  Palette,
  GraduationCap,
  Brain,
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
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { TextReveal } from "../components/ui/text-reveal";
import BentoGrid1 from "../components/mvpblocks/bento-grid-1";
import Feature1 from "../components/mvpblocks/feature-1";
import ContactUs1 from "../components/mvpblocks/contact-us-1";
import { SparklesCore } from "../components/ui/sparkles";
import { motion } from "framer-motion";

const projectName = import.meta.env.VITE_PROJECT_NAME || "Trackademy";

function Home() {
  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Assignments Tracked", value: "50,000+", icon: FileText },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Institutions", value: "100+", icon: Globe },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Dean of Engineering",
      content:
        "Trackademy has revolutionized how we manage our academic programs. The insights are invaluable.",
      avatar: "SJ",
      rating: 5,
    },
    {
      name: "Prof. Michael Chen",
      role: "Computer Science Faculty",
      content:
        "The assignment management system has saved me countless hours. Highly recommended!",
      avatar: "MC",
      rating: 5,
    },
    {
      name: "Lisa Rodriguez",
      role: "Academic Administrator",
      content:
        "Finally, a platform that understands the complexities of academic management.",
      avatar: "LR",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Sparkles Background */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Sparkles Background */}
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#3b82f6"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to the Future of Education
              </Badge>
            </motion.div>

            {/* Text Reveal Animation */}
            <div className="mb-8">
              <TextReveal
                className="text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
                from="bottom"
                split="word"
                delay={0.15}
              >
                Transform Education with {projectName}
              </TextReveal>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              Empower educational institutions with comprehensive tracking,
              analytics, and management solutions.
              <span className="text-foreground font-semibold">
                {" "}
                Built for educators, designed for excellence.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Using MVPBlocks Feature Component */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Lightbulb className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything you need to manage education
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools educators need
              to track, manage, and improve academic outcomes.
            </p>
          </motion.div>

          {/* Feature Component */}
          <Feature1 />
        </div>
      </section>

      {/* Bento Grid Section - Using MVPBlocks Bento Grid */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Code className="w-4 h-4 mr-2" />
              Platform Benefits
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Built for modern education
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of cutting-edge technology designed
              specifically for educational institutions.
            </p>
          </motion.div>

          <BentoGrid1 />
        </div>
      </section>

      {/* Enhanced Analytics Dashboard */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <div>
              <Badge variant="outline" className="mb-4">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Real-time insights at your fingertips
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get comprehensive analytics and reporting that help you make
                data-driven decisions for better educational outcomes.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Performance Tracking</h3>
                    <p className="text-muted-foreground">
                      Monitor student progress and identify areas for
                      improvement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Custom Reports</h3>
                    <p className="text-muted-foreground">
                      Generate detailed reports tailored to your institution's
                      needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Predictive Analytics</h3>
                    <p className="text-muted-foreground">
                      AI-powered insights to predict and prevent academic
                      challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl mb-2 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-primary" />
                    Live Dashboard
                  </CardTitle>
                  <CardDescription className="text-base">
                    Real-time metrics and performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Student Engagement</span>
                      <span className="text-sm text-muted-foreground">87%</span>
                    </div>
                    <Progress value={87} className="h-3" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Assignment Completion</span>
                      <span className="text-sm text-muted-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-3" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">System Performance</span>
                      <span className="text-sm text-muted-foreground">99%</span>
                    </div>
                    <Progress value={99} className="h-3" />

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-background">
                        <div className="text-2xl font-bold text-primary">
                          1,247
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Active Users
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-background">
                        <div className="text-2xl font-bold text-primary">
                          342
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Today's Submissions
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              What educators are saying
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from educational professionals who have transformed their
              institutions with Trackademy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Using MVPBlocks Contact Component */}
      <section className="py-20 lg:py-32">
        <ContactUs1 />
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute inset-0 w-full h-full opacity-30">
          <SparklesCore
            id="cta-particles"
            background="transparent"
            minSize={0.4}
            maxSize={1.0}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#3b82f6"
          />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6">
              <Target className="w-4 h-4 mr-2" />
              Ready to Get Started?
            </Badge>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Join thousands of educators transforming education
            </h2>

            <p className="text-xl text-muted-foreground mb-12">
              Start your journey with Trackademy today. No setup fees, no
              complicated onboarding. Just powerful tools ready to transform
              your educational institution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                Schedule Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
