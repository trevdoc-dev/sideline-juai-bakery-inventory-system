import { CustomTable } from "@/components/CustomTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";

export default function IngredientsPage() {
  const headers = ["ID", "Name", "Quantity", "Unit", "Threshold", "ExpiryDate"];
  const invoices = [
    {
      ID: "INV001",
      Name: "Sugar",
      Quantity: "100",
      Unit: "kl",
      Threshold: "20",
      ExpiryDate: "2022-12-31",
    },
    {
      ID: "INV002",
      Name: "Wheat Flour",
      Quantity: "500",
      Unit: "kl",
      Threshold: "50",
      ExpiryDate: "2022-12-31",
    },
    {
      ID: "INV003",
      Name: "Cooking Oil",
      Quantity: "100",
      Unit: "ltr",
      Threshold: "50",
      ExpiryDate: "2022-12-31",
    },
  ];

  return (
    <div>
      {/* header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-8">Manage Ingredients</h1>
        <Button variant="default" size="lg">
          <Plus className="text-white" /> Add Ingredient
        </Button>
      </div>

      {/* notification */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="mb-2 font-semibold">Just a heads up!</AlertTitle>
        <AlertDescription>
          You're out of stock for some ingredients: Sugar, Salt, and Pepper.
        </AlertDescription>
      </Alert>

      {/* table */}
      <div className="mt-8">
        <CustomTable
          caption="A list of all your ingredients stocks."
          headers={headers}
          data={invoices}
        />
      </div>
    </div>
  );
}
