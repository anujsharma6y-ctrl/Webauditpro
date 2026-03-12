import { useState } from "react";
import { FileText, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveResult, copyToClipboard, downloadText, shareContent } from "@/lib/toolResults";
import { toast } from "sonner";

const countries = ["United States", "United Kingdom", "India", "Canada", "Germany", "Australia", "France", "Brazil", "Other"];

function generatePolicy(data: { name: string; email: string; country: string; ads: boolean; analytics: boolean }): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `PRIVACY POLICY

Last updated: ${date}

${data.name} ("we", "us", or "our") operates this website. This Privacy Policy explains how we collect, use, and protect your personal information.

1. INFORMATION WE COLLECT
We may collect personal information such as your name, email address, and usage data when you interact with our website.

2. HOW WE USE YOUR INFORMATION
We use collected information to:
- Provide and maintain our services
- Communicate with you
- Improve our website${data.ads ? "\n- Display personalized advertisements" : ""}${data.analytics ? "\n- Analyze usage patterns via analytics services" : ""}

3. COOKIES AND TRACKING
${data.analytics ? "We use cookies and similar tracking technologies to analyze traffic and improve your experience. Third-party analytics services may be used to collect and process data." : "We use minimal cookies necessary for the operation of our website."}

${data.ads ? `4. ADVERTISING
We work with third-party advertising partners who may use cookies and similar technologies to serve personalized ads based on your browsing activity.

5. DATA SHARING` : "4. DATA SHARING"}
We do not sell your personal information. We may share data with service providers who assist us in operating our website, subject to confidentiality agreements.

${data.ads ? "6" : "5"}. DATA SECURITY
We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.

${data.ads ? "7" : "6"}. YOUR RIGHTS
Depending on your jurisdiction (${data.country}), you may have rights to access, correct, delete, or port your personal data. Contact us to exercise these rights.

${data.ads ? "8" : "7"}. CHILDREN'S PRIVACY
Our services are not directed to children under 13. We do not knowingly collect personal information from children.

${data.ads ? "9" : "8"}. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.

${data.ads ? "10" : "9"}. CONTACT US
If you have questions about this Privacy Policy, please contact us at:
Email: ${data.email}

© ${new Date().getFullYear()} ${data.name}. All rights reserved.`;
}

export default function PrivacyPolicy() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [ads, setAds] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [policy, setPolicy] = useState("");

  const canGenerate = name.trim() && email.trim() && country;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const text = generatePolicy({ name, email, country, ads, analytics });
    setPolicy(text);
    saveResult({ tool: "Privacy Policy", input: name, timestamp: Date.now(), data: { name, country, ads, analytics } });
  };

  return (
    <div className="container max-w-2xl py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Privacy Policy Generator</h1>
          <p className="text-sm text-muted-foreground">Generate a privacy policy for your website</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Website Name</Label>
            <Input id="name" placeholder="My Website" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" placeholder="contact@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ads">Display Ads?</Label>
            <Switch id="ads" checked={ads} onCheckedChange={setAds} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="analytics">Use Analytics?</Label>
            <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics} />
          </div>
          <Button onClick={handleGenerate} disabled={!canGenerate} className="w-full">
            Generate Policy
          </Button>
        </CardContent>
      </Card>

      {policy && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Generated Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">{policy}</pre>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(policy); toast.success("Copied!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadText(policy, `privacy-policy-${name.replace(/\s+/g, "-").toLowerCase()}.txt`)}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareContent("Privacy Policy", policy).then(() => toast.success("Shared!"))}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
