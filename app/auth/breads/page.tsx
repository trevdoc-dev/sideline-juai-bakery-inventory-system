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
import { AlertCircle, Plus, Upload } from "lucide-react";
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
import { BreadInterface } from "@/interfaces/bread";

export default function BreadPage() {
  const headers = [
    { name: "image_url", label: "Image" },
    { name: "id", label: "ID" },
    { name: "name", label: "Name" },
    { name: "price", label: "Price" },
  ];
  const [breads, setBreads] = useState<BreadInterface[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [selectedRow, setSelectedRow] = useState<{
    id?: string;
    name: string;
    price: number;
    image_url?: string;
  } | null>(null);
  const [deleteRow, setDeleteRow] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const BreadSchema = z.object({
    name: z.string().min(2).max(50),
    price: z.coerce.number().min(1),
    image: z.instanceof(File).optional(),
  });

  const form = useForm<z.infer<typeof BreadSchema>>({
    resolver: zodResolver(BreadSchema),
    defaultValues: {
      name: "",
      price: 0,
      image: undefined,
    },
  });

  // Fetch breads from Supabase
  useEffect(() => {
    const fetchBreads = async () => {
      const { data, error } = await supabase.from("breads").select("*");
      if (error) console.error(error);
      else setBreads(data || []);
    };

    fetchBreads();

    // Realtime Subscription
    const subscription = supabase
      .channel("breads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "breads" },
        fetchBreads
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const openSheetForAdd = () => {
    setSheetMode("add");
    setSelectedRow(null);
    form.reset({ name: "", price: 0, image: undefined });
    setIsSheetOpen(true);
  };

  const openSheetForEdit = (row: Record<string, any>) => {
    setSheetMode("edit");
    setSelectedRow({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      image_url: row.image_url,
    });
    form.reset({ name: row.name, price: Number(row.price) });
    setIsSheetOpen(true);
  };

  const confirmDelete = (row: Record<string, any>) => {
    setDeleteRow({ id: row.id, name: row.name });
  };

  const handleDelete = async () => {
    if (!deleteRow) return;

    const { error } = await supabase
      .from("breads")
      .delete()
      .match({ id: deleteRow.id });

    if (error) console.error(error);
    setDeleteRow(null);
  };

  const onSubmit = async (values: z.infer<typeof BreadSchema>) => {
    let imageUrl = selectedRow?.image_url || null;

    if (values.image) {
      const uploadedUrl = await uploadToCloudinary(values.image);
      if (!uploadedUrl) {
        console.error("Image upload failed.");
        return;
      }
      imageUrl = uploadedUrl;
    }

    if (sheetMode === "add") {
      const { error } = await supabase
        .from("breads")
        .insert([
          { name: values.name, price: values.price, image_url: imageUrl },
        ]);
      if (error) console.error(error);
    } else if (selectedRow?.id) {
      const { error } = await supabase
        .from("breads")
        .update({ name: values.name, price: values.price, image_url: imageUrl })
        .match({ id: selectedRow.id });
      if (error) console.error(error);
    }

    setIsSheetOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-8">Manage Breads</h1>
        <Button size="lg" onClick={openSheetForAdd}>
          <Plus /> Add Bread
        </Button>
      </div>

      <CustomTable
        caption="A list of available breads."
        headers={headers}
        data={breads}
        onEdit={openSheetForEdit}
        onDelete={confirmDelete}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add" ? "Add Bread" : "Edit Bread"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "add"
                ? "Add a new bread."
                : "Update bread details."}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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

                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        form.setValue("image", e.target.files?.[0])
                      }
                    />
                  </FormControl>
                </FormItem>

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
