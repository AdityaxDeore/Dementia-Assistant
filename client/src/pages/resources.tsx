import { ResourceHub } from "@/components/resource-hub";

export default function ResourcesPage() {
  return (
    <div className="space-y-6" data-testid="page-resources">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Resource Hub</h1>
        <p className="text-muted-foreground">
          Discover curated mental health resources, self-help guides, educational videos, and practical exercises. 
          All content is reviewed by mental health professionals and tailored for students.
        </p>
      </div>
      
      <ResourceHub />
    </div>
  );
}