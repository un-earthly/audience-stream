"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import { storage, PERSIST_KEYS } from "@/lib/utils/storage";

const SettingsSchema = z.object({
  workspaceName: z.string().min(2, "Workspace name is too short"),
  notificationsEmail: z.string().email("Enter a valid email"),
  theme: z.enum(["light", "dark"]),
});

type SettingsForm = z.infer<typeof SettingsSchema>;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const defaultValues = useMemo<SettingsForm>(() => ({
    workspaceName: "My Workspace",
    notificationsEmail: "alerts@example.com",
    theme: (theme as "light" | "dark") ?? "light",
  }), [theme]);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(SettingsSchema),
    defaultValues,
  });
  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (values: SettingsForm) => {
    // Persist settings client-side (stub). Replace with API call when ready.
    setTheme(values.theme);
    storage.set(PERSIST_KEYS.settings, values);
    toast.success("Settings saved");
  };

  const currentTheme = form.watch("theme");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = storage.get<SettingsForm | null>(PERSIST_KEYS.settings, null);
    if (saved) {
      form.reset(saved);
      setTheme(saved.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Update your workspace and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="workspaceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace name</FormLabel>
                    <FormControl>
                      <Input id="workspaceName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificationsEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notifications email</FormLabel>
                    <FormControl>
                      <Input id="notificationsEmail" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <div className="flex gap-2">
                      <Button type="button" variant={field.value === "light" ? "default" : "outline"} onClick={() => { field.onChange("light"); setTheme("light"); }}>Light</Button>
                      <Button type="button" variant={field.value === "dark" ? "default" : "outline"} onClick={() => { field.onChange("dark"); setTheme("dark"); }}>Dark</Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button type="submit" disabled={isSubmitting}>Save settings</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
