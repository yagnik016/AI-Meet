"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, FileText, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  type: "meeting" | "transcript" | "action_item";
  excerpt?: string;
  date: string;
  url: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Weekly Team Sync",
      type: "meeting",
      excerpt: "Discussed Q2 goals and roadmap progress...",
      date: "2026-04-15",
      url: "/meetings/1",
    },
    {
      id: "2",
      title: "Product Design Review",
      type: "transcript",
      excerpt: "The mobile app feature is on track for release next month...",
      date: "2026-04-14",
      url: "/meetings/2",
    },
    {
      id: "3",
      title: "Prepare Q2 metrics report",
      type: "action_item",
      excerpt: "Assigned to Jane Smith - Due April 20, 2026",
      date: "2026-04-15",
      url: "/meetings/1",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      // Filter mock results based on query
      const filtered = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.excerpt?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "transcript":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "action_item":
        return <ArrowRight className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[20vh]">
      <div className="w-full max-w-2xl rounded-lg bg-card shadow-lg overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b p-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search meetings, transcripts, action items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length < 2 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="mb-2">Start typing to search...</p>
              <p className="text-sm">
                Search across meetings, transcripts, and action items
              </p>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 rounded-md p-3 hover:bg-accent"
                >
                  {getIcon(result.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{result.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.date).toLocaleDateString()}
                      </span>
                    </div>
                    {result.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.excerpt}
                      </p>
                    )}
                    <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                      {result.type.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
