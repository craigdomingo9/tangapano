"use client";
import React from "react";
import {
  WifiOff,
  RotateCcw,
  Home,
  AlertCircle,
  FileWarning,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  type: "404" | "500" | "maintenance" | "access";
  refreshFn?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ type, refreshFn }) => {
  const router = useRouter();

  // Configuration for different error states
  const errorConfig = {
    "500": {
      icon: <WifiOff className="w-12 h-12 text-destructive" />,
      title: "Unable to Load Properties",
      description:
        "We're having trouble connecting to the server. This might be a temporary connection issue.",
      code: "Error 500",
      primaryAction: "Try Again",
      secondaryAction: "Check Status",
      primaryActionFn: refreshFn,
      secondaryActionFn: () => null,
    },
    "404": {
      icon: <FileWarning className="w-12 h-12 text-primary" />,
      title: "Resource Not Found",
      description:
        "The resource you are looking for doesn't exist or has been moved.",
      code: "Error 404",
      primaryAction: "Refresh",
      secondaryAction: "Support",
      primaryActionFn: refreshFn,
      secondaryActionFn: () => router.push("/partner/dashboard?page=support"),
    },
    maintenance: {
      icon: <AlertCircle className="w-12 h-12 text-amber-500" />,
      title: "System Maintenance",
      description:
        "We're currently performing scheduled maintenance to improve your experience. Please check back shortly.",
      code: "Maintenance Mode",
      primaryAction: "Refresh",
      secondaryAction: "Support",
      primaryActionFn: refreshFn,
      secondaryActionFn: () => router.push("/partner/dashboard?page=support"),
    },
    access: {
      icon: <Lock className="w-12 h-12 text-rose-500" />,
      title: "Access Restricted",
      description:
        "You don't have the necessary permissions to view this property group. Please contact your administrator.",
      code: "Error 403",
      primaryAction: "Request Access",
      secondaryAction: "Switch Account",
      primaryActionFn: () => router.push("/partner/dashboard?page=support"),
      secondaryActionFn: () => router.push("/partner/login"),
    },
  };

  const config = errorConfig[type];

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-screen">
      <Card className="max-w-md w-full border-border/60 shadow-lg bg-card/50 backdrop-blur-sm relative overflow-hidden">
        {/* Abstract background decorative element */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />

        <CardHeader className="text-center items-center pb-2 relative z-10">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-4 ring-8 ring-secondary/30 transition-all duration-500 hover:ring-secondary/50 mx-auto">
            {config.icon}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase bg-secondary/50 px-2 py-1 rounded-full border border-border">
              {config.code}
            </span>
            <CardTitle className="text-2xl pt-4">{config.title}</CardTitle>
          </div>
          <CardDescription className="text-center max-w-[300px] mt-2 mx-auto">
            {config.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          {/* Mock "Ghost" Content to make it look like part of the app */}
          <div className="mt-4 p-4 rounded-lg border border-dashed border-border bg-background/50">
            <div className="flex items-center space-x-4 opacity-50">
              <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded bg-muted/50 animate-pulse" />
            <div className="mt-2 h-2 w-2/3 rounded bg-muted/50 animate-pulse" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 relative z-10 pb-8">
          <Button
            className="w-full gap-2 group"
            size="lg"
            onClick={config.primaryActionFn}
          >
            {type === "500" || type === "maintenance" ? (
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            ) : null}
            {config.primaryAction}
            {type === "404" && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={config.secondaryActionFn}
          >
            {type === "500" ? "Return to Dashboard" : config.secondaryAction}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
