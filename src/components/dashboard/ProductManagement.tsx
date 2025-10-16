import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/products";

interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  price: number;
  description: string;
  image: string;
}

const ProductManagement = () => {
  const [productList, setProductList] = useState<Product[]>(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      size: formData.get("size") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      image: formData.get("image") as string || "/placeholder.svg",
    };

    setProductList([...productList, newProduct]);
    toast.success("Product added successfully!");
    setIsDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);
    
    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      size: formData.get("size") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      image: formData.get("image") as string || editingProduct.image,
    };

    setProductList(productList.map(p => 
      p.id === editingProduct.id ? updatedProduct : p
    ));
    toast.success("Product updated successfully!");
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductList(productList.filter(p => p.id !== id));
      toast.success("Product deleted successfully!");
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-gradient-to-r from-primary to-accent">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? "Update the product details below" 
                  : "Fill in the details for the new product"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    name="type"
                    defaultValue={editingProduct?.type}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    defaultValue={editingProduct?.size}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingProduct?.price}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description}
                  required
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  defaultValue={editingProduct?.image}
                  placeholder="/placeholder.svg"
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
                  {editingProduct ? "Update" : "Add"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productList.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-lg">{product.name}</span>
                <span className="text-primary font-bold">₹{product.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  Type: {product.type} • Size: {product.size}
                </p>
                <p className="text-sm line-clamp-2">{product.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
