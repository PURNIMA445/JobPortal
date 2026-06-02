import JobCard from "@/components/ui/JobCard"
export default function Jobs()
{
   return <div className="grid gap-4 p-6 md:grid-cols-2">
      
      <JobCard
        title="Frontend Developer"
        company="Google"
        location="Remote"
        type="Full-time"
        salary="$80k - $120k"
      />

      <JobCard
        title="Backend Engineer"
        company="Amazon"
        location="USA"
        type="Part-time"
        salary="$60k - $100k"
      />
      
    </div>
}