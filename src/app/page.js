import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { getJobs } from "@/lib/api";

export default function HomePage() {
  const { user } = useAuth();

  const jobs = getJobs();

  return (
    <>
      <h1>Hello {user}</h1>

      <p>{jobs[0]}</p>

      <Button />
    </>
  );
}