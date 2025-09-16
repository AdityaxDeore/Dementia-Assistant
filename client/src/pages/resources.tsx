import { ResourceHub } from "@/components/resource-hub";
import { TherapistCommunity } from "@/components/therapist-community";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResourcesPage() {
  return (
    <div className="space-y-6" data-testid="page-resources">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Resource Hub</h1>
        <p className="text-muted-foreground">
          Discover curated mental health resources, professional insights, self-help guides, and educational content. 
          All content is reviewed by mental health professionals and tailored for students.
        </p>
      </div>
      
      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resources">Self-Help Resources</TabsTrigger>
          <TabsTrigger value="professionals">Professional Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="space-y-6">
          <ResourceHub />
        </TabsContent>
        
        <TabsContent value="professionals" className="space-y-6">
          <TherapistCommunity />
        </TabsContent>
      </Tabs>
    </div>
  );
}