import { useState, useEffect } from "react";
import { BarChart3, Copy, Download, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResults, clearResults, copyToClipboard, downloadText, shareContent, ToolResult } from "@/lib/toolResults";
import { toast } from "sonner";

function formatResult(r: ToolResult): string {
  const date = new Date(r.timestamp).toLocaleString();
  const dataLines = Object.entries(r.data)
    .filter(([k]) => !["suggestions", "warnings", "tips", "suspiciousWordsFound"].includes(k))
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n");
  const lists = Object.entries(r.data)
    .filter(([k]) => ["suggestions", "warnings", "tips"].includes(k))
    .map(([k, v]) => `  ${k}:\n${(v as string[]).map((s) => `    • ${s}`).join("\n")}`)
    .join("\n");
  return `[${r.tool}] — ${date}\nInput: ${r.input}\n${dataLines}${lists ? "\n" + lists : ""}`;
}

export default function ReportGenerator() {
  const [results, setResults] = useState<ToolResult[]>([]);

  useEffect(() => {
    setResults(getResults());
  }, []);

  const fullReport = results.length > 0
    ? `SecureTools Report\nGenerated: ${new Date().toLocaleString()}\n${"=".repeat(40)}\n\n${results.map(formatResult).join("\n\n" + "-".repeat(30) + "\n\n")}`
    : "";

  const handleClear = () => {
    clearResults();
    setResults([]);
    toast.success("Results cleared");
  };

  return (
    <div className="container max-w-2xl py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Report Generator</h1>
          <p className="text-sm text-muted-foreground">View and export combined tool results</p>
        </div>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No results yet. Use the tools first, then come back here to generate a report.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{results.length} result(s) collected</p>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Clear All
            </Button>
          </div>

          {results.map((r, i) => (
            <Card key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{r.tool}</CardTitle>
                  <span className="text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-1">Input: {r.input}</p>
                <div className="text-xs font-mono text-muted-foreground">
                  {Object.entries(r.data)
                    .filter(([k]) => !Array.isArray(r.data[k]))
                    .map(([k, v]) => (
                      <div key={k}>{k}: {String(v)}</div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => { copyToClipboard(fullReport); toast.success("Report copied!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Copy Report
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadText(fullReport, "securetools-report.txt")}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareContent("SecureTools Report", fullReport).then(() => toast.success("Shared!"))}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
