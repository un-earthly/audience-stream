"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ExternalLink, Shield, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Progress } from "../ui/progress";
import { useAppDispatch } from "../../lib/hooks";
import { updateConnectionStatus, setConnecting } from "../../lib/features/connections/connectionsSlice";
import { DataSource } from "@/lib/types";

interface ConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataSource: DataSource | null;
}

export function ConnectionModal({ open, onOpenChange, dataSource }: ConnectionModalProps) {
  const [step, setStep] = useState<"info" | "connecting" | "success">("info");
  const [progress, setProgress] = useState(0);
  const dispatch = useAppDispatch();

  if (!dataSource) return null;

  const handleConnect = async () => {
    setStep("connecting");
    dispatch(setConnecting(true));
    dispatch(updateConnectionStatus({ id: dataSource.id, status: "pending" }));

    // Simulate connection progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setStep("success");
    dispatch(updateConnectionStatus({
      id: dataSource.id,
      status: "connected",
      lastSync: Date.now(),
    }));
    dispatch(setConnecting(false));

    // Auto close after success
    setTimeout(() => {
      onOpenChange(false);
      setStep("info");
      setProgress(0);
    }, 2000);
  };

  const getSourceInfo = (type: string) => {
    switch (type) {
      case "shopify":
        return {
          description: "Connect your Shopify store to access customer data, purchase history, and product analytics.",
          features: ["Customer segments", "Purchase behavior", "Product performance", "Revenue analytics"],
          permissions: ["Read customer data", "Access order history", "View product catalog"],
        };
      case "analytics":
        return {
          description: "Integrate with Google Analytics to understand website visitor behavior and conversion patterns.",
          features: ["Website traffic", "User behavior", "Conversion tracking", "Audience insights"],
          permissions: ["Read analytics data", "Access audience reports", "View conversion data"],
        };
      case "facebook":
        return {
          description: "Connect Facebook Pixel to track user interactions and create custom audiences for advertising.",
          features: ["Event tracking", "Custom audiences", "Conversion optimization", "Lookalike audiences"],
          permissions: ["Read pixel data", "Access audience insights", "View conversion events"],
        };
      default:
        return {
          description: "Connect this data source to enhance your campaign targeting and analytics.",
          features: ["Enhanced targeting", "Better analytics", "Improved performance"],
          permissions: ["Read data", "Access insights"],
        };
    }
  };

  const sourceInfo = getSourceInfo(dataSource.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {step === "info" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{dataSource.icon}</div>
                <div>
                  <DialogTitle>{dataSource.name}</DialogTitle>
                  <DialogDescription>
                    Enhance your campaigns with {dataSource.name} data
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {sourceInfo.description}
                </p>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Features you'll unlock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sourceInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Permissions required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sourceInfo.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {permission}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={handleConnect} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect {dataSource.name}
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "connecting" && (
          <div className="text-center space-y-6 py-8">
            <div className="text-4xl">{dataSource.icon}</div>
            <div>
              <DialogTitle>Connecting to {dataSource.name}</DialogTitle>
              <DialogDescription className="mt-2">
                Please wait while we establish a secure connection...
              </DialogDescription>
            </div>
            <div className="space-y-3">
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-muted-foreground">
                {progress}% complete
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <DialogTitle className="text-green-600">Successfully Connected!</DialogTitle>
              <DialogDescription className="mt-2">
                {dataSource.name} is now connected and ready to use.
              </DialogDescription>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}