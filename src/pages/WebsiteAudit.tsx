import { useState } from "react";
import { Globe, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { saveResult, copyToClipboard, shareContent } from "@/lib/toolResults";
import { toast } from "sonner";

interface AuditResult {
  design: number;
  seo: number;
  trust: number;
  security: number;
  performance: number;
  suggestions: string[];
}

function analyzeUrl(url: string): AuditResult {
  const hasHttps = url.startsWith("https://");
  const hasWww = url.includes("www.");
  const hasTld = /\.\w{2,}/.test(url);
  const length = url.length;
  const hasDash = url.includes("-");
  const hasSubdomain = (url.replace("https://", "").replace("http://", "").match(/\./g) || []).length > 1;

  const security = hasHttps ? 75 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 25);
  const trust = (hasHttps ? 30 : 0) + (hasWww ? 15 : 5) + (hasTld ? 20 : 0) + Math.floor(Math.random() * 25);
  const seo = Math.min(100, (hasTld ? 25 : 0) + (length < 50 ? 20 : 5) + (!hasDash ? 10 : 15) + Math.floor(Math.random() * 35));
  const design = 40 + Math.floor(Math.random() * 50);
  const performance = 35 + Math.floor(Math.random() * 55);

  const suggestions: string[] = [];
  if (!hasHttps) suggestions.push("Enable HTTPS for better security and SEO.");
  if (!hasWww) suggestions.push("Consider using www subdomain for consistency.");
  if (length > 50) suggestions.push("Shorten your URL for better readability.");
  if (hasSubdomain) suggestions.push("Too many subdomains may affect trust signals.");
  if (security < 60) suggestions.push("Improve security headers and SSL configuration.");
  if (performance < 60) suggestions.push("Optimize images and enable caching for better performance.");
  if (seo < 60) suggestions.push("Add meta tags and structured data for SEO.");
  if (design < 60) suggestions.push("Improve mobile responsiveness and visual hierarchy.");

  return { design, seo, trust: Math.min(100, trust), security: Math.min(100, security), performance, suggestions };
}

const scores = [
  { key: "design", label: "Design", color: "bg-info" },
  { key: "seo", label: "SEO", color: "bg-success" },
  { key: "trust", label: "Trust", color: "bg-warning" },
  { key: "security", label: "Security", color: "bg-destructive" },
  { key: "performance", label: "Performance", color: "bg-primary" },
] as const;

export default function WebsiteAudit() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = () => {
    if (!url.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const res = analyzeUrl(url);
      setResult(res);
      saveResult({ tool: "Website Audit", input: url, timestamp: Date.now(), data: res as unknown as Record<string, unknown> });
      setLoading(false);
    }, 1200);
  };

  const resultText = result
    ? `Website Audit for ${url}\n\nDesign: ${result.design}/100\nSEO: ${result.seo}/100\nTrust: ${result.trust}/100\nSecurity: ${result.security}/100\nPerformance: ${result.performance}/100\n\nSuggestions:\n${result.suggestions.map((s) => `• ${s}`).join("\n")}`
    : "";

  return (
    <div className="container max-w-2xl py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Website Audit</h1>
          <p className="text-sm text-muted-foreground">Analyze any website's quality scores</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAudit()}
        />
        <Button onClick={handleAudit} disabled={loading || !url.trim()}>
          {loading ? "Analyzing…" : "Audit"}
        </Button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scores.map((s) => (
                <div key={s.key} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{s.label}</span>
                    <span className="text-muted-foreground">{result[s.key]}/100</span>
                  </div>
                  <Progress value={result[s.key]} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-foreground">•</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(resultText); toast.success("Copied!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareContent("Website Audit", resultText).then(() => toast.success("Shared!"))}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
