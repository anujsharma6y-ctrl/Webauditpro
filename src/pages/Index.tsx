import { Link } from "react-router-dom";
import { Shield, Link2, KeyRound, FileText, BarChart3, Globe, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  {
    title: "Website Audit",
    description: "Analyze any website for design, SEO, trust, security, and performance scores.",
    icon: Globe,
    to: "/tools/website-audit",
    delay: "0ms",
  },
  {
    title: "Fake Link Checker",
    description: "Check if a URL is safe or potentially a phishing/scam link.",
    icon: Link2,
    to: "/tools/link-checker",
    delay: "75ms",
  },
  {
    title: "Password Strength",
    description: "Test your password strength, entropy, and get security tips.",
    icon: KeyRound,
    to: "/tools/password-checker",
    delay: "150ms",
  },
  {
    title: "Privacy Policy Generator",
    description: "Generate a privacy policy for your website in seconds.",
    icon: FileText,
    to: "/tools/privacy-policy",
    delay: "225ms",
  },
  {
    title: "Report Generator",
    description: "Combine your tool results into a single downloadable report.",
    icon: BarChart3,
    to: "/tools/report",
    delay: "300ms",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="container py-20 md:py-32 text-center animate-fade-in">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            Free &amp; Open Security Tools
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Security &amp; Web Tools<br />
            <span className="text-muted-foreground">for Everyone</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Audit websites, check links, test passwords, and generate policies — all free, all client-side, no login required.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button asChild size="lg">
              <Link to="/tools/website-audit">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/tools/report">View Reports</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="container pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group">
              <Card
                className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50"
                style={{ animationDelay: tool.delay }}
              >
                <CardHeader>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                    Launch tool <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
