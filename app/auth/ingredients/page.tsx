"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
import { IngredientInterface } from "@/interfaces/ingredient";

export default function IngredientPage() {
  const headers = [
    { name: "id", label: "ID" },
    { name: "name", label: "Name" },
    { name: "quantity", label: "Quantity" },
    { name: "unit", label: "Unit" },
    { name: "threshold", label: "Threshold" },
    { name: "expiry_date", label: "Expiry Date" },
  ];
  const [ingredients, setIngredients] = useState<IngredientInterface[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<{
    id?: string;
    name: string;
    quantity: number;
    unit: string;
    threshold: number;
    expiry_date: number;
  } | null>(null);
  const [deleteRow, setDeleteRow] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const IngredientSchema = z.object({
    name: z.string().min(2).max(50),
    quantity: z.coerce.number().min(1),
    unit: z.string().min(1).max(10),
    threshold: z.coerce.number().min(1),
    expiry_date: z.coerce.date(),
  });

  const form = useForm<z.infer<typeof IngredientSchema>>({
    resolver: zodResolver(IngredientSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      unit: "",
      threshold: 0,
      expiry_date: new Date(),
    },
  });

  // Fetch ingredients from Supabase
  useEffect(() => {
    const fetchBreads = async () => {
      const { data, error } = await supabase.from("ingredients").select("*");
      if (error) console.error(error);
      else setIngredients(data || []);
    };

    fetchBreads();

    // Realtime Subscription
    const subscription = supabase
      .channel("ingredients")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ingredients" },
        fetchBreads
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const openSheetForAdd = () => {
    setSheetMode("add");
    setSelectedRow(null);
    form.reset({
      name: "",
      quantity: 0,
      unit: "",
      threshold: 0,
      expiry_date: 0,
    });
    setIsSheetOpen(true);
  };

  const openSheetForEdit = (row: Record<string, any>) => {
    setSheetMode("edit");
    setSelectedRow({
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      unit: row.unit,
      threshold: row.threshold,
      expiry_date: row.expiry_date,
    });
    form.reset({
      name: row.name,
      quantity: row.quantity,
      unit: row.unit,
      threshold: row.threshold,
      expiry_date: row.expiry_date,
    });
    setIsSheetOpen(true);
  };

  const confirmDelete = (row: Record<string, any>) => {
    setDeleteRow({ id: row.id, name: row.name });
  };

  const handleDelete = async () => {
    if (!deleteRow) return;

    const { error } = await supabase
      .from("ingredients")
      .delete()
      .match({ id: deleteRow.id });

    if (error) console.error(error);
    setDeleteRow(null);
  };

  const onSubmit = async (values: z.infer<typeof IngredientSchema>) => {
    if (sheetMode === "add") {
      const { error } = await supabase.from("ingredients").insert([
        {
          name: values.name,
          quantity: values.quantity,
          unit: values.unit,
          threshold: values.threshold,
          expiry_date: values.expiry_date,
        },
      ]);
      if (error) console.error(error);
    } else if (selectedRow?.id) {
      const { error } = await supabase
        .from("ingredients")
        .update({
          name: values.name,
          quantity: values.quantity,
          unit: values.unit,
          threshold: values.threshold,
          expiry_date: values.expiry_date,
        })
        .match({ id: selectedRow.id });
      if (error) console.error(error);
    }

    setIsSheetOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-8">Manage Ingredients</h1>
        <Button size="lg" onClick={openSheetForAdd}>
          <Plus /> Add Ingredients
        </Button>
      </div>

      {/* Alert */}
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold">Alert</AlertTitle>
        <AlertDescription>
          You're out of stock for some ingredients: Sugar, Salt, and Pepper.
        </AlertDescription>
      </Alert>

      {/* Table */}
      <CustomTable
        caption="A list of available ingredients."
        headers={headers}
        data={ingredients}
        onEdit={openSheetForEdit}
        onDelete={confirmDelete}
      />

      {/* Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add" ? "Add Ingredient" : "Edit Ingredient"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "add"
                ? "Add a new ingredient that will be available in the store."
                : "Update the details of this ingredient."}
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
                        <Input placeholder="Eg: Sugar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Quantity Field */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Unit Field */}
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="kl, g, pc, ml"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Threshold Field */}
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Expiry Date Field */}
                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                <b>{deleteRow.name}</b> from the list.
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
