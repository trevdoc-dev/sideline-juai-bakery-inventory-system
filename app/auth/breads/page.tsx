"use client";

import { CustomTable } from "@/components/CustomTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

export default function BreadPage() {
  const headers = ["ID", "Name", "Price"];
  const [invoices, setInvoices] = useState([
    { ID: "INV001", Name: "Cheese Bread", Price: "250" },
    { ID: "INV002", Name: "Pandesal", Price: "150" },
    { ID: "INV003", Name: "Ensaymada", Price: "350" },
  ]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const [deleteRow, setDeleteRow] = useState<{
    ID: string;
    Name: string;
  } | null>(null);

  const BreadSchema = z.object({
    name: z.string().min(2).max(50),
    price: z.coerce.number().min(1),
  });

  const form = useForm<z.infer<typeof BreadSchema>>({
    resolver: zodResolver(BreadSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  const openSheetForAdd = () => {
    setSheetMode("add");
    setSelectedRow(null);
    form.reset({ name: "", price: 0 });
    setIsSheetOpen(true);
  };

  const openSheetForEdit = (row: Record<string, any>) => {
    setSheetMode("edit");
    setSelectedRow({ name: row.Name, price: Number(row.Price) });
    form.reset({ name: row.Name, price: Number(row.Price) });
    setIsSheetOpen(true);
  };

  const confirmDelete = (row: Record<string, any>) => {
    setDeleteRow({ ID: row.ID, Name: row.Name });
  };

  const handleDelete = () => {
    if (!deleteRow) return;

    console.log("Deleting:", deleteRow);

    // Simulating API call
    setInvoices((prev) => prev.filter((item) => item.ID !== deleteRow.ID));

    setDeleteRow(null);
  };

  function onSubmit(values: z.infer<typeof BreadSchema>) {
    if (sheetMode === "add") {
      console.log("Adding:", values);
    } else {
      console.log("Editing:", values);
    }
    setIsSheetOpen(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-8">Manage Breads</h1>

        {/* Add Button */}
        <Button size="lg" onClick={openSheetForAdd}>
          <Plus /> Add Bread
        </Button>
      </div>

      {/* Alert */}
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold">Alert</AlertTitle>
        <AlertDescription>
          You're out of stocks for these products: Cheese Bread, Pandesal,
          Ensaymada.
        </AlertDescription>
      </Alert>

      {/* Table */}
      <CustomTable
        caption="A list of available breads."
        headers={headers}
        data={invoices}
        onEdit={openSheetForEdit}
        onDelete={confirmDelete}
      />

      {/* Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add" ? "Add Bread" : "Edit Bread"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "add"
                ? "Add a new bread that will be available in the store."
                : "Update the details of this bread."}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Eg: Ensaymada" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Price Field */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                  {sheetMode === "add" ? "Add" : "Save Changes"}
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      {deleteRow && (
        <AlertDialog
          open={!!deleteRow}
          onOpenChange={(open) => !open && setDeleteRow(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this item?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. You will remove{" "}
                <b>{deleteRow.Name}</b> from the list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteRow(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
