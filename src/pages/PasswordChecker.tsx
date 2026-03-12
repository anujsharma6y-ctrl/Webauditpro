import { useState } from "react";
import { KeyRound, Copy, Share2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { saveResult, copyToClipboard, shareContent } from "@/lib/toolResults";
import { toast } from "sonner";

interface PasswordResult {
  score: number;
  level: string;
  entropy: number;
  tips: string[];
}

function checkPassword(pw: string): PasswordResult {
  let score = 0;
  const tips: string[] = [];

  if (pw.length >= 8) score += 15; else tips.push("Use at least 8 characters.");
  if (pw.length >= 12) score += 15; else if (pw.length >= 8) tips.push("Consider using 12+ characters.");
  if (pw.length >= 16) score += 10;
  if (/[a-z]/.test(pw)) score += 10; else tips.push("Add lowercase letters.");
  if (/[A-Z]/.test(pw)) score += 10; else tips.push("Add uppercase letters.");
  if (/\d/.test(pw)) score += 10; else tips.push("Add numbers.");
  if (/[^a-zA-Z0-9]/.test(pw)) score += 15; else tips.push("Add special characters (!@#$%^&*).");
  if (!/(.)\1{2,}/.test(pw)) score += 5; else tips.push("Avoid repeated characters.");
  if (!/^(123|abc|password|qwerty)/i.test(pw)) score += 10; else tips.push("Avoid common patterns.");

  score = Math.min(100, score);

  // Entropy calc
  let charsetSize = 0;
  if (/[a-z]/.test(pw)) charsetSize += 26;
  if (/[A-Z]/.test(pw)) charsetSize += 26;
  if (/\d/.test(pw)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) charsetSize += 32;
  const entropy = charsetSize > 0 ? Math.round(pw.length * Math.log2(charsetSize) * 10) / 10 : 0;

  const level = score >= 80 ? "Strong" : score >= 50 ? "Medium" : "Weak";

  if (tips.length === 0) tips.push("Great password! Keep it safe and don't reuse it.");

  return { score, level, entropy, tips };
}

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);

  const handleCheck = () => {
    if (!password) return;
    const res = checkPassword(password);
    setResult(res);
    saveResult({ tool: "Password Checker", input: "***", timestamp: Date.now(), data: res as unknown as Record<string, unknown> });
  };

  const resultText = result
    ? `Password Strength Check\n\nStrength: ${result.level} (${result.score}/100)\nEntropy: ${result.entropy} bits\n\nTips:\n${result.tips.map((t) => `• ${t}`).join("\n")}`
    : "";

  return (
    <div className="container max-w-2xl py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Password Strength Checker</h1>
          <p className="text-sm text-muted-foreground">Test how strong your password is</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (e.target.value) { setResult(checkPassword(e.target.value)); } else { setResult(null); } }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <Button onClick={handleCheck} disabled={!password}>Check</Button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Strength</CardTitle>
                <Badge variant={result.level === "Strong" ? "default" : result.level === "Medium" ? "secondary" : "destructive"}>
                  {result.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Score</span>
                  <span className="text-muted-foreground">{result.score}/100</span>
                </div>
                <Progress value={result.score} className="h-2" />
              </div>
              <div className="text-sm">
                <span className="font-medium">Entropy:</span>{" "}
                <span className="text-muted-foreground font-mono">{result.entropy} bits</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.tips.map((t, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-foreground">•</span> {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(resultText); toast.success("Copied!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareContent("Password Check", resultText).then(() => toast.success("Shared!"))}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
