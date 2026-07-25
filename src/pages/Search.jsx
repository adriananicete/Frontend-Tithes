import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CiSearch } from "react-icons/ci";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchResultRow } from "@/components/layout/SearchResultsDropdown";
import { Spinner } from "@/components/ui/spinner";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

function Section({ title, items, onSelect }) {
  if (items.length === 0) return null;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">
          {title}{" "}
          <span className="text-muted-foreground font-normal">({items.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y border-t">
        {items.map((r) => (
          <SearchResultRow key={`${r.type}-${r.id}`} result={r} onSelect={onSelect} />
        ))}
      </CardContent>
    </Card>
  );
}

function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);

  // Keep the URL's ?q= in sync with the input (shareable/bookmarkable),
  // without stacking history entries.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (query !== current) {
      const params = new URLSearchParams(searchParams);
      if (query.trim()) params.set("q", query);
      else params.delete("q");
      setSearchParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const { results, counts, loading, error } = useGlobalSearch(query, { limit: 50 });

  const rfResults = results.filter((r) => r.type === "rf");
  const voucherResults = results.filter((r) => r.type === "voucher");

  const onSelect = (r) => navigate(`${r.route}?focus=${r.focusId}`);

  const trimmed = query.trim();
  const total = (counts.rf || 0) + (counts.voucher || 0);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-5 overflow-auto px-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Search</h1>
        <p className="text-sm text-muted-foreground">
          Find request forms and vouchers by reference number or particulars.
        </p>
      </div>

      <div className="flex items-center gap-2 w-full sm:max-w-md border border-gray-300 dark:border-border p-2 rounded-[5px]">
        <CiSearch size={18} className="shrink-0" />
        <input
          autoFocus
          className="w-full px-1 bg-transparent outline-none text-sm"
          type="text"
          placeholder="Search RF-0001, PCF-0001, or particulars…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {trimmed.length < 2 ? (
        <p className="text-sm text-muted-foreground">Type at least 2 characters to search.</p>
      ) : loading ? (
        <Spinner size="sm" label="Searching…" className="flex-row" />
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : total === 0 ? (
        <p className="text-sm text-muted-foreground">No results for “{trimmed}”.</p>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">
            {total} result{total === 1 ? "" : "s"} for “{trimmed}”
          </p>
          <Section title="Request Forms" items={rfResults} onSelect={onSelect} />
          <Section title="Vouchers" items={voucherResults} onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}

export default Search;
