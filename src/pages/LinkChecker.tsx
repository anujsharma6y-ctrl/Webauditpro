import { useState } from "react";
import { Link2, Copy, Share2, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { saveResult, copyToClipboard, shareContent } from "@/lib/toolResults";
import { toast } from "sonner";

const suspiciousWords = ["free", "win", "click", "login", "verify", "account", "update", "secure", "bank", "paypal", "prize", "urgent", "confirm", "password", "suspend"];

interface LinkResult {
  riskScore: number;
  hasSSL: boolean;
  suspiciousWordsFound: string[];
  isPhishing: boolean;
  warnings: string[];
}

function checkLink(url: string): LinkResult {
  const lower = url.toLowerCase();
  const hasSSL = lower.startsWith("https://");
  const found = suspiciousWords.filter((w) => lower.includes(w));
  const hasIP = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
  const longUrl = url.length > 100;
  const hasManyDots = (url.match(/\./g) || []).length > 4;
  const hasAtSign = url.includes("@");

  let risk = 0;
  if (!hasSSL) risk += 25;
  risk += found.length * 8;
  if (hasIP) risk += 30;
  if (longUrl) risk += 10;
  if (hasManyDots) risk += 15;
  if (hasAtSign) risk += 20;
  risk = Math.min(100, risk);

  const warnings: string[] = [];
  if (!hasSSL) warnings.push("No SSL certificate detected.");
  if (hasIP) warnings.push("URL uses an IP address instead of a domain name.");
  if (longUrl) warnings.push("URL is unusually long.");
  if (hasManyDots) warnings.push("URL has many subdomains.");
  if (hasAtSign) warnings.push("URL contains @ sign — possible redirect trick.");
  if (found.length > 0) warnings.push(`Suspicious keywords found: ${found.join(", ")}`);

  return { riskScore: risk, hasSSL, suspiciousWordsFound: found, isPhishing: risk > 60, warnings };
}

export default function LinkChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<LinkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!url.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const res = checkLink(url);
      setResult(res);
      saveResult({ tool: "Link Checker", input: url, timestamp: Date.now(), data: res as unknown as Record<string, unknown> });
      setLoading(false);
    }, 800);
  };

  const resultText = result
    ? `Fake Link Check for ${url}\n\nRisk Score: ${result.riskScore}/100\nSSL: ${result.hasSSL ? "Yes" : "No"}\nPhishing: ${result.isPhishing ? "Likely" : "Unlikely"}\n\nWarnings:\n${result.warnings.map((w) => `• ${w}`).join("\n")}`
    : "";

  return (
    <div className="container max-w-2xl py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
          <Link2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Fake Link Checker</h1>
          <p className="text-sm text-muted-foreground">Check if a URL might be malicious</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          placeholder="https://suspicious-link.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        />
        <Button onClick={handleCheck} disabled={loading || !url.trim()}>
          {loading ? "Checking…" : "Check"}
        </Button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Risk Assessment</CardTitle>
                <Badge variant={result.isPhishing ? "destructive" : "secondary"}>
                  {result.isPhishing ? "High Risk" : "Low Risk"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Risk Score</span>
                  <span className="text-muted-foreground">{result.riskScore}/100</span>
                </div>
                <Progress value={result.riskScore} className="h-2" />
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  {result.hasSSL ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                  SSL: {result.hasSSL ? "Valid" : "Missing"}
                </div>
                <div className="flex items-center gap-1.5">
                  {result.isPhishing ? <ShieldAlert className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-success" />}
                  {result.isPhishing ? "Possible Phishing" : "Looks Safe"}
                </div>
              </div>
            </CardContent>
          </Card>

          {result.warnings.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" /> {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(resultText); toast.success("Copied!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareContent("Link Check", resultText).then(() => toast.success("Shared!"))}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
