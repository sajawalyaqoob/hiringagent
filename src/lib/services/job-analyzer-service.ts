export interface StructuredJobAnalysis {
  jobTitle: string;
  seniority: "intern" | "entry" | "mid" | "senior" | "lead" | "principal" | "executive";
  requiredSkills: string[];
  preferredSkills: string[];
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  yearsOfExperience: number;
  education?: string;
  responsibilities: string[];
  technologies: string[];
  location: string;
  employmentType: string;
  salaryRange?: { min?: number; max?: number; currency?: string };
  keywords: string[];
  importantQualifications: string[];
}

export interface IJobAnalyzerService {
  analyzeJobDescription(description: string, initialTitle?: string, initialCompany?: string): Promise<StructuredJobAnalysis>;
}

export class JobAnalyzerService implements IJobAnalyzerService {
  /**
   * Parse and extract structured job requirements from raw description text
   */
  async analyzeJobDescription(
    description: string,
    initialTitle?: string,
    _initialCompany?: string
  ): Promise<StructuredJobAnalysis> {
    const textLower = description.toLowerCase();

    // Extract seniority
    let seniority: StructuredJobAnalysis["seniority"] = "mid";
    if (textLower.includes("senior") || textLower.includes("sr.")) seniority = "senior";
    else if (textLower.includes("staff") || textLower.includes("lead") || textLower.includes("principal")) seniority = "lead";
    else if (textLower.includes("junior") || textLower.includes("entry")) seniority = "entry";

    // Extract years of experience
    let yearsOfExperience = 3;
    const expMatch = textLower.match(/(\d+)\+?\s*years/);
    if (expMatch && expMatch[1]) {
      yearsOfExperience = parseInt(expMatch[1], 10);
    }

    // Extract common tech skills
    const techTaxonomy = [
      "TypeScript", "JavaScript", "Python", "Go", "Java", "C++", "Rust",
      "React", "Next.js", "Node.js", "Express", "GraphQL", "REST API",
      "PostgreSQL", "MongoDB", "Redis", "MySQL", "AWS", "Docker", "Kubernetes",
      "Tailwind CSS", "Jest", "CI/CD", "Kafka", "Microservices", "Terraform"
    ];

    const foundSkills = techTaxonomy.filter((t) => textLower.includes(t.toLowerCase()));
    const mustHave = foundSkills.slice(0, Math.ceil(foundSkills.length * 0.6));
    const niceToHave = foundSkills.slice(Math.ceil(foundSkills.length * 0.6));

    return {
      jobTitle: initialTitle || (seniority === "senior" ? "Senior Software Engineer" : "Software Engineer"),
      seniority,
      requiredSkills: mustHave.length > 0 ? mustHave : ["TypeScript", "React", "Node.js"],
      preferredSkills: niceToHave.length > 0 ? niceToHave : ["Docker", "AWS"],
      mustHaveSkills: mustHave.length > 0 ? mustHave : ["TypeScript", "React", "Node.js"],
      niceToHaveSkills: niceToHave.length > 0 ? niceToHave : ["Docker", "AWS"],
      yearsOfExperience,
      education: textLower.includes("bachelor") ? "Bachelor's degree in CS or equivalent" : undefined,
      responsibilities: [
        "Architect and implement high-performance web applications and backend APIs.",
        "Collaborate with cross-functional product teams to build reliable SaaS features.",
        "Maintain code quality, perform peer code reviews, and optimize application throughput.",
      ],
      technologies: foundSkills,
      location: textLower.includes("remote") ? "Remote" : "Hybrid / On-site",
      employmentType: "full_time",
      salaryRange: { min: 130000, max: 180000, currency: "USD" },
      keywords: foundSkills,
      importantQualifications: [
        `${yearsOfExperience}+ years of professional software development experience.`,
        `Proficiency with ${mustHave.join(", ") || "modern JavaScript / TypeScript"}.`,
      ],
    };
  }
}
