import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash } from "lucide-react";

interface TableProps {
  caption?: string;
  headers: { name: string; label: string }[];
  data: Record<string, any>[];
  onEdit?: (row: Record<string, any>) => void;
  onDelete?: (row: Record<string, any>) => void;
}

export function CustomTable({
  caption,
  headers,
  data,
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead
              key={index}
              className={index === headers.length - 1 ? "text-right" : ""}
            >
              {header.label}
            </TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell>
              {row.image_url ? (
                <img
                  src={row.image_url ?? ""}
                  alt="..."
                  className="w-[40px] object-cover rounded-md"
                />
              ) : (
                "-"
              )}
            </TableCell>
            {headers.map(
              (header, colIndex) =>
                header.name !== "image_url" && (
                  <TableCell
                    key={colIndex}
                    className={
                      colIndex === headers.length - 1 ? "text-right" : ""
                    }
                  >
                    {row[header.name] || "-"}
                  </TableCell>
                )
            )}
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="lg" onClick={() => onEdit?.(row)}>
                <FilePenLine />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={() => onDelete?.(row)}
              >
                <Trash />
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
