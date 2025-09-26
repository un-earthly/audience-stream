import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge, Download, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const DataTable = ({
    title,
    description,
    data,
    columns,
    searchable = true,
    exportable = true
}: {
    title: string;
    description: string;
    data: any[];
    columns: Array<{ key: string; label: string; render?: (value: any) => React.ReactNode }>;
    searchable?: boolean;
    exportable?: boolean;
}) => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const filteredData = searchable ?
        data.filter(row =>
            Object.values(row).some(val =>
                String(val).toLowerCase().includes(search.toLowerCase())
            )
        ) : data;

    const paginatedData = filteredData.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    const exportCSV = () => {
        const headers = columns.map(col => col.label).join(",");
        const rows = filteredData.map(row =>
            columns.map(col => JSON.stringify(row[col.key] ?? "")).join(",")
        ).join("\n");

        const csv = headers + "\n" + rows;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            {title}
                            <Badge className="text-xs">
                                {filteredData.length}
                            </Badge>
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    {exportable && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportCSV}
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {searchable && (
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(v) => {
                                setPageSize(Number(v));
                                setCurrentPage(0);
                            }}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="rounded-lg border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                {columns.map((col, idx) => (
                                    <th key={idx} className="p-3 text-left text-sm font-medium">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, idx) => (
                                <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-3 text-sm">
                                            {col.render ? col.render(row[col.key]) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredData.length > pageSize && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {currentPage * pageSize + 1} to{" "}
                            {Math.min((currentPage + 1) * pageSize, filteredData.length)} of{" "}
                            {filteredData.length} results
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={(currentPage + 1) * pageSize >= filteredData.length}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};