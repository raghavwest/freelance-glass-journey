
import React, { useState } from "react";
import FreelanceApp from "@/components/FreelanceApp";
import { Job } from "@/components/FreelanceApp";

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  return <FreelanceApp />;
};

export default Index;
