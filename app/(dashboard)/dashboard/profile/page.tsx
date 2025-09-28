"use client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSuccess } from "@/lib/features/auth/authSlice";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mail, User as UserIcon, ImageIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const ProfileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  avatar: z.string().url().optional().or(z.literal("").transform(() => undefined)),
});

type ProfileForm = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const defaultValues: ProfileForm = useMemo(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? "",
    }),
    [user]
  );

  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  });
  const { handleSubmit, formState: { isSubmitting }, reset, watch } = form;
  const onSubmit = async (values: ProfileForm) => {
    // Local mock update only
    if (!user) return;
    const updated = { ...user, ...values, avatar: values.avatar ?? undefined };
    dispatch(loginSuccess(updated));
    toast.success("Profile updated");
    reset(values);
  };

  const avatarUrl = watch("avatar");
  const initials = (user?.name ?? "U S").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-6 space-y-6">
      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-transparent to-transparent">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-6 -translate-y-6 rounded-full bg-primary/20 blur-2xl" />
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Your Profile</h2>
              <p className="text-sm text-muted-foreground">Manage your identity across the AI workspace</p>
            </div>
          </div>
          {user?.plan && (
            <Badge variant="secondary" className="uppercase tracking-wide">{user.plan} plan</Badge>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Campaigns launched</div>
            <div className="text-2xl font-semibold mt-1">24</div>
            <div className="text-xs text-green-600 mt-1">+3 this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Average ROI</div>
            <div className="text-2xl font-semibold mt-1">3.7x</div>
            <div className="text-xs text-green-600 mt-1">+0.2 vs last week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Segments managed</div>
            <div className="text-2xl font-semibold mt-1">12</div>
            <div className="text-xs text-muted-foreground mt-1">stable</div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Identity card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>Photo and contact info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-xl bg-muted overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-muted-foreground">{initials}</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                This avatar previews from the URL you provide below.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Editable form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
            <CardDescription>Make sure your name and avatar look sharp</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Name</FormLabel>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input id="name" {...field} className="pl-10" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Avatar URL</FormLabel>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input id="avatar" placeholder="https://..." {...field} className="pl-10" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 flex items-center gap-3">
                  <Button type="submit" disabled={isSubmitting}>Save changes</Button>
                  <span className="text-sm text-muted-foreground">Your info is stored locally for this mock app.</span>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
