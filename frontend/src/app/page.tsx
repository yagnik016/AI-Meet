"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Sparkles,
  Mic,
  Brain,
  Users,
  FileText,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Video,
  Play,
  MessageSquare,
  Clock,
  Globe,
  Shield,
  X,
} from "lucide-react";
import { PricingCard } from "@/components/pricing-card";
import { BillingToggle } from "@/components/billing-toggle";

const features = [
  {
    icon: Mic,
    title: "Smart Transcription",
    description:
      "Real-time transcription with speaker identification and timestamping across all major platforms.",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Get sentiment analysis, key topics, action items, and meeting insights powered by advanced AI.",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share meeting notes, assign tasks, and collaborate with your team in real-time.",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    icon: FileText,
    title: "Searchable Archives",
    description:
      "Search through all your past meetings with natural language queries and smart filters.",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Auto Follow-ups",
    description:
      "Automatically generate and assign follow-up tasks based on meeting discussions.",
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: BarChart3,
    title: "Team Analytics",
    description:
      "Track meeting patterns, engagement metrics, and productivity insights for your team.",
    color: "from-indigo-500/20 to-violet-500/20",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect Your Calendar",
    description: "Integrate with Google Calendar, Outlook, or your preferred calendar app.",
    icon: Clock,
  },
  {
    number: "02",
    title: "Join Meetings",
    description: "MeetAI automatically joins and records your scheduled meetings.",
    icon: Video,
  },
  {
    number: "03",
    title: "Get Insights",
    description: "Receive AI-generated summaries, action items, and analytics after every meeting.",
    icon: Brain,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function FloatingOrb({ className }: { className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      animate={{
        x: [0, 30, 0],
        y: [0, -30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function VideoMeetingMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full max-w-4xl mx-auto mt-12 perspective-1000"
    >
      {/* Main video grid container */}
      <div className="relative bg-card border rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm text-muted-foreground ml-2">Team Standup - MeetAI</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>32:14</span>
            </div>
            <div className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              REC
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-background">
          {/* Participant 1 - Active speaker */}
          <motion.div
            className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden border-2 border-primary/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">JD</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium">John Doe</span>
            </div>
            <div className="absolute top-2 right-2">
              <Mic className="w-4 h-4 text-primary" />
            </div>
            {/* Audio wave animation */}
            <div className="absolute bottom-2 right-2 flex gap-0.5 items-end h-4">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-primary rounded-full"
                  animate={{ height: [4, 12, 4] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Participant 2 */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-500">AS</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium">Alice Smith</span>
            </div>
          </div>

          {/* Participant 3 */}
          <div className="relative aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl font-semibold text-purple-500">RJ</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium">Robert Johnson</span>
            </div>
          </div>

          {/* AI Assistant Panel */}
          <motion.div
            className="relative aspect-video bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-lg overflow-hidden border border-amber-500/30"
            animate={{ boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0)", "0 0 20px 2px rgba(245, 158, 11, 0.3)", "0 0 0 0 rgba(245, 158, 11, 0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">MeetAI Assistant</span>
              <span className="text-[10px] text-muted-foreground mt-1">Recording & Analyzing...</span>
            </div>
            {/* Processing dots */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-amber-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Screen share preview */}
          <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden col-span-2 md:col-span-1">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400">Screen Share</span>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-white">Q4 Analytics</span>
            </div>
          </div>
        </div>

        {/* Live transcript preview */}
        <motion.div
          className="border-t bg-muted/30 p-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">Live Transcript</span>
          </div>
          <motion.div
            className="text-xs text-muted-foreground space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p><span className="font-medium text-foreground">John:</span> Let&apos;s discuss the Q4 roadmap and key deliverables...</p>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <span className="font-medium text-foreground">Alice:</span> The new AI features are looking great for launch next month.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="text-primary/80"
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              Action item assigned: Prepare launch documentation (Robert)
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </motion.div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main ref={containerRef} className="flex-1 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted" />
        <FloatingOrb className="w-[500px] h-[500px] bg-gradient-to-br from-primary/40 to-purple-500/40 -top-48 -right-48" />
        <FloatingOrb className="w-[400px] h-[400px] bg-gradient-to-br from-blue-500/30 to-cyan-500/30 top-1/3 -left-48" />
        <FloatingOrb className="w-[600px] h-[600px] bg-gradient-to-br from-amber-500/20 to-orange-500/20 bottom-0 right-1/4" />
      </motion.div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Animated Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <motion.div
                className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                </motion.span>
                <span>Powered by Advanced AI</span>
              </motion.div>
            </motion.div>

            {/* Animated Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mb-6"
            >
              <span className="block">Transform Your Meetings</span>
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                with AI Intelligence
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="max-w-2xl text-lg text-muted-foreground sm:text-xl mb-8"
            >
              Automatically transcribe, analyze, and extract insights from every meeting.
              Never miss an action item again.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={session ? "/dashboard" : "/signup"}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                  Start Free Trial
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="inline-flex items-center justify-center rounded-full border-2 border-input bg-background/50 backdrop-blur-sm px-8 py-4 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 pt-8 border-t w-full max-w-2xl"
            >
              {[
                { value: "99%", label: "Accuracy", icon: CheckCircle2 },
                { value: "10x", label: "Faster Notes", icon: Zap },
                { value: "50K+", label: "Meetings", icon: Video },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="text-3xl font-bold mb-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <stat.icon className="w-3 h-3" />
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Video Meeting Mockup */}
          <VideoMeetingMockup />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <motion.div
              className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="mr-2 h-4 w-4 text-primary" />
              <span>Powerful Features</span>
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="max-w-2xl text-muted-foreground text-lg">
              Powerful features to help you get the most out of every meeting
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="group relative overflow-hidden rounded-2xl border bg-background/50 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-primary/10 transition-all h-full">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-transparent" />
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-4 mb-16"
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/50 backdrop-blur-sm">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              <span>Quick Setup</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="max-w-2xl text-muted-foreground text-lg">
              Get started in minutes and transform your meeting workflow
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center"
              >
                <motion.div
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-500 text-white text-2xl font-bold shadow-lg shadow-primary/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon className="w-8 h-8" />
                </motion.div>
                <motion.div
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold mb-3"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section id="pricing" className="py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/50 backdrop-blur-sm">
              <Globe className="mr-2 h-4 w-4 text-primary" />
              <span>Global Pricing</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-2xl text-muted-foreground text-lg">
              Start free and scale as you grow. No hidden fees.
            </p>

            {/* Billing Toggle */}
            <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />

            {/* Pricing Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl"
            >
              {/* Free Plan */}
              <PricingCard
                name="Free"
                monthlyPrice={0}
                yearlyPrice={0}
                features={[
                  "5 meetings/month",
                  "Basic transcription",
                  "Email summaries",
                  "7-day storage"
                ]}
                plan="starter"
                buttonText="Get Started"
                variant="default"
                isYearly={isYearly}
              />

              {/* Starter Plan */}
              <PricingCard
                name="Starter"
                monthlyPrice={499}
                yearlyPrice={4790}
                features={[
                  "20 meetings/month",
                  "Advanced transcription",
                  "AI summaries",
                  "30-day storage",
                  "Email support"
                ]}
                plan="starter"
                buttonText="Subscribe"
                variant="default"
                isYearly={isYearly}
              />

              {/* Pro Plan - Most Popular */}
              <PricingCard
                name="Pro"
                monthlyPrice={1299}
                yearlyPrice={12470}
                features={[
                  "Unlimited meetings",
                  "AI insights & analysis",
                  "Advanced search",
                  "Team collaboration",
                  "Priority support",
                  "1-year storage"
                ]}
                plan="pro"
                buttonText="Subscribe Now"
                variant="popular"
                isPopular
                isYearly={isYearly}
              />

              {/* Business Plan */}
              <PricingCard
                name="Business"
                monthlyPrice={2499}
                yearlyPrice={23990}
                features={[
                  "Everything in Pro",
                  "SSO & SAML",
                  "Custom integrations",
                  "Advanced analytics",
                  "Dedicated support",
                  "Unlimited storage"
                ]}
                plan="enterprise"
                buttonText="Subscribe"
                variant="default"
                isYearly={isYearly}
              />
            </motion.div>

            {/* Enterprise CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 p-6 rounded-2xl border bg-background/50 backdrop-blur-sm max-w-2xl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Enterprise
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Custom solutions for large organizations
                  </p>
                </div>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary px-6 py-3 text-sm font-medium transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-between gap-4 md:flex-row"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="font-bold text-lg">MeetAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 MeetAI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Designed & Developed by <span className="font-medium text-primary">Yagnik Vadaliya.</span>
            </p>
            <div className="flex gap-4">
              {["Privacy", "Terms"].map((link) => (
                <Link
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {isDemoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsDemoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-background rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">MeetAI Demo</h3>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Video Container - YouTube Embed */}
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/JGu2ghWmKXU?autoplay=0&rel=0"
                title="AI Meeting Assistant Demo - Transcription & Insights"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Demo: AI Meeting Copilot with transcription & automated insights
              </p>
              <button
                onClick={() => setIsDemoOpen(false)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
