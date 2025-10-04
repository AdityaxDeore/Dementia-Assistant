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
import { Users, X } from "lucide-react";
import { apiMenteeRegistrationSchema, type ApiMenteeRegistration } from "@shared/schema";

const interests = [
  "Emotional Support",
  "Daily Care Guidance", 
  "Caregiver Respite",
  "Communication Help",
  "Safety & Wandering Support",
  "Memory Activity Ideas",
  "Family Coordination",
  "Healthcare Navigation",
  "Legal & Financial Guidance",
  "Community Resources",
  "Crisis Support",
  "Grief & Loss Support",
  "Early Stage Dementia Help",
  "Middle Stage Dementia Support",
  "Late Stage Dementia Care",
  "Alzheimer's Specific Support",
  "Behavioral Management",
  "Social Interaction",
  "Meal Planning Help",
  "Medication Management"
];

const regions = [
  "North Region", "South Region", "East Region", "West Region", "Central Region", "Northeast Region"
];

export function MenteeRegistration() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApiMenteeRegistration>({
    resolver: zodResolver(apiMenteeRegistrationSchema),
    defaultValues: {
      name: "",
      year: 1,
      region: "",
      interests: [],
      goals: "",
    },
  });

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      const updated = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5
        ? [...prev, interest]
        : prev;
      
      form.setValue("interests", updated);
      return updated;
    });
  };

  const onSubmit = async (data: ApiMenteeRegistration) => {
    if (selectedInterests.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one area of interest.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mentees/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, interests: selectedInterests }),
      });

      if (!response.ok) {
        throw new Error("Failed to register as mentee");
      }

      toast({
        title: "Success!",
        description: "You have been registered as a mentee. Browse mentors to find your perfect match!",
      });

      form.reset();
      setSelectedInterests([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register as mentee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-3 sm:pb-6">
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl text-purple-700">Find a Companion</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Connect with experienced caregivers in your area who can provide emotional support and guidance
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
              <Label htmlFor="year" className="text-sm sm:text-base">Academic Year *</Label>
              <Select
                value={form.watch("year")?.toString()}
                onValueChange={(value) => form.setValue("year", parseInt(value))}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year (Fresher)</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
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
            <p className="text-xs text-muted-foreground">
              You'll be matched with mentors from the same region who understand your background
            </p>
            {form.formState.errors.region && (
              <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.region.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm sm:text-base">Areas of Interest * (Select 1-5)</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Choose the areas where you want guidance and skill development
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                    disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
                  />
                  <Label htmlFor={interest} className="text-xs sm:text-sm cursor-pointer leading-tight">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    {interest}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleInterestToggle(interest)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            {form.formState.errors.interests && (
              <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.interests.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals" className="text-sm sm:text-base">Your Goals & Expectations (Optional)</Label>
            <Textarea
              id="goals"
              {...form.register("goals")}
              placeholder="What do you hope to achieve through mentorship? What specific skills do you want to develop? Any particular challenges you're facing?"
              rows={4}
              className="text-sm sm:text-base resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This helps mentors understand how they can best support you
            </p>
            {form.formState.errors.goals && (
              <p className="text-xs sm:text-sm text-red-500">{form.formState.errors.goals.message}</p>
            )}
          </div>

          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">What to Expect</h4>
            <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
              <li>• Regular one-on-one sessions with your mentor</li>
              <li>• Personalized tasks and learning objectives</li>
              <li>• Guidance on academic and career decisions</li>
              <li>• Access to mentor's network and resources</li>
              <li>• Progress tracking and feedback</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base py-2 sm:py-3"
            disabled={isSubmitting || selectedInterests.length === 0}
          >
            {isSubmitting ? "Registering..." : "Register as Mentee"}
          </Button>

          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>By registering, you commit to actively participate in the mentorship program</p>
            <p>and maintain regular communication with your assigned mentor.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}