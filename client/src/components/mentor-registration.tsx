import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Plus, X } from "lucide-react";
import { apiMentorRegistrationSchema, type ApiMentorRegistration } from "@shared/schema";

const domains = [
  "Emotional Support",
  "Daily Care Assistance", 
  "Caregiver Respite",
  "Communication Support",
  "Safety & Wandering Prevention",
  "Memory Care Activities",
  "Family Navigation",
  "Healthcare Coordination",
  "Legal & Financial Planning",
  "Community Resources",
  "Crisis Support",
  "Grief & Loss Support",
  "Early Stage Dementia",
  "Middle Stage Dementia",
  "Late Stage Dementia",
  "Alzheimer's Specific Care",
  "Vascular Dementia Support",
  "Frontotemporal Dementia"
];

const regions = [
  "North Region", "South Region", "East Region", "West Region", "Central Region", "Northeast Region"
];

export function MentorRegistration() {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApiMentorRegistration>({
    resolver: zodResolver(apiMentorRegistrationSchema),
    defaultValues: {
      name: "",
      year: 2,
      region: "",
      domains: [],
      bio: "",
      maxMentees: 3,
    },
  });

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains((prev) => {
      const updated = prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : prev.length < 5
        ? [...prev, domain]
        : prev;
      
      form.setValue("domains", updated);
      return updated;
    });
  };

  const onSubmit = async (data: ApiMentorRegistration) => {
    if (selectedDomains.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one area of support.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mentors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, domains: selectedDomains }),
      });

      if (!response.ok) {
        throw new Error("Failed to register as companion");
      }

      toast({
        title: "Success!",
        description: "You have been registered as a companion. You'll start receiving family connection requests soon!",
      });

      form.reset();
      setSelectedDomains([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register as companion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-3 sm:pb-6">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
          <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl text-blue-700">Become a Companion</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Support families affected by dementia in your area by sharing your caregiving experience and emotional support
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Full Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter your full name"
                className="text-sm sm:text-base"
              />
              {form.formState.errors.name && (
                <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm sm:text-base">Experience Level *</Label>
              <Select
                value={form.watch("year")?.toString()}
                onValueChange={(value) => form.setValue("year", parseInt(value))}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">New to Caregiving</SelectItem>
                  <SelectItem value="2">Some Experience (1-3 years)</SelectItem>
                  <SelectItem value="3">Experienced (3-7 years)</SelectItem>
                  <SelectItem value="4">Very Experienced (7+ years)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.year && (
                <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-sm sm:text-base">Region *</Label>
            <Select
              value={form.watch("region")}
              onValueChange={(value) => form.setValue("region", value)}
            >
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.region && (
              <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.region.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Areas of Support * (Select 1-5)</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Choose the areas where you can provide companionship and support to families
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {domains.map((domain) => (
                <div key={domain} className="flex items-center space-x-2">
                  <Checkbox
                    id={domain}
                    checked={selectedDomains.includes(domain)}
                    onCheckedChange={() => handleDomainToggle(domain)}
                    disabled={!selectedDomains.includes(domain) && selectedDomains.length >= 5}
                  />
                  <Label htmlFor={domain} className="text-xs sm:text-sm cursor-pointer leading-tight">
                    {domain}
                  </Label>
                </div>
              ))}
            </div>
            {selectedDomains.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedDomains.map((domain) => (
                  <Badge
                    key={domain}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    {domain}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleDomainToggle(domain)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            {form.formState.errors.domains && (
              <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.domains.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMentees" className="text-sm sm:text-base">Maximum Families to Support</Label>
            <Select
              value={form.watch("maxMentees")?.toString()}
              onValueChange={(value) => form.setValue("maxMentees", parseInt(value))}
            >
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Family</SelectItem>
                <SelectItem value="2">2 Families</SelectItem>
                <SelectItem value="3">3 Families</SelectItem>
                <SelectItem value="4">4 Families</SelectItem>
                <SelectItem value="5">5 Families</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How many families can you effectively support at once?
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm sm:text-base">About You (Optional)</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Tell families about your caregiving experience, background, and how you can provide emotional support..."
              rows={4}
              className="text-sm sm:text-base resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This will be visible to families seeking companion support
            </p>
            {form.formState.errors.bio && (
              <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.bio.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
            disabled={isSubmitting || selectedDomains.length === 0}
          >
            {isSubmitting ? "Registering..." : "Register as Companion"}
          </Button>

          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>By registering, you agree to help mentor students from your region</p>
            <p>and provide guidance in your selected domains of expertise.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}