import { Link } from "react-router-dom";
import { Link2, KeyRound, FileText, BarChart3, Globe, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const tools = [
  {
    title: "Website Audit Tool",
    description: "Analyze any website for design, SEO, trust, security, and performance scores.",
    icon: Globe,
    to: "/tools/website-audit",
  },
  {
    title: "Fake Link Checker",
    description: "Check if a URL is safe or potentially a phishing/scam link.",
    icon: Link2,
    to: "/tools/link-checker",
  },
  {
    title: "Password Strength Analyzer",
    description: "Test your password strength, entropy, and get security tips.",
    icon: KeyRound,
    to: "/tools/password-checker",
  },
  {
    title: "Privacy Policy Generator",
    description: "Generate a privacy policy for your website in seconds.",
    icon: FileText,
    to: "/tools/privacy-policy",
  },
  {
    title: "Report Generator",
    description: "Combine your tool results into a single downloadable report.",
    icon: BarChart3,
    to: "/tools/report",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="container py-20 md:py-32 text-center animate-fade-in">
        <div className="mx-auto max-w-3xl space-y-6">
          <img src={logo} alt="WebAuditPro" className="h-16 w-16 mx-auto" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="gradient-text">WebAuditPro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Free Website Audit &amp; Security Tools
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Audit websites, check links, test passwords, and generate policies — all free, all client-side, no login required.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button asChild size="lg" className="gradient-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity">
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group">
              <Card className="h-full glass rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-white shadow-md shadow-primary/20">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1">
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
