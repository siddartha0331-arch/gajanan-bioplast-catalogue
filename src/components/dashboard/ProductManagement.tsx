import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Plus, Edit, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  price: number;
  description: string;
  image: string;
  moq: number;
  delivery_days: string;
  features: string[];
  printing_options: string[];
}

const ProductManagement = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductList(data || []);
    } catch (error: any) {
      toast.error(error.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      let imageUrl = "/placeholder.svg";
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const featuresStr = formData.get("features") as string;
      const printingStr = formData.get("printing_options") as string;
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: formData.get("name") as string,
          type: formData.get("type") as string,
          size: formData.get("size") as string,
          price: Number(formData.get("price")),
          description: formData.get("description") as string,
          image: imageUrl,
          moq: Number(formData.get("moq")) || 1000,
          delivery_days: formData.get("delivery_days") as string || "7-10 days",
          features: featuresStr ? featuresStr.split(',').map(f => f.trim()) : [],
          printing_options: printingStr ? printingStr.split(',').map(p => p.trim()) : [],
        }])
        .select()
        .single();

      if (error) throw error;

      setProductList([data, ...productList]);
      toast.success("Product added successfully!");
      setIsDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl("");
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error(error.message || "Error adding product");
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    setUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      let imageUrl = editingProduct.image;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const featuresStr = formData.get("features") as string;
      const printingStr = formData.get("printing_options") as string;
      
      const { data, error } = await supabase
        .from('products')
        .update({
          name: formData.get("name") as string,
          type: formData.get("type") as string,
          size: formData.get("size") as string,
          price: Number(formData.get("price")),
          description: formData.get("description") as string,
          image: imageUrl,
          moq: Number(formData.get("moq")) || 1000,
          delivery_days: formData.get("delivery_days") as string || "7-10 days",
          features: featuresStr ? featuresStr.split(',').map(f => f.trim()) : [],
          printing_options: printingStr ? printingStr.split(',').map(p => p.trim()) : [],
        })
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (error) throw error;

      setProductList(productList.map(p => 
        p.id === editingProduct.id ? data : p
      ));
      toast.success("Product updated successfully!");
      setEditingProduct(null);
      setIsDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (error: any) {
      toast.error(error.message || "Error updating product");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setProductList(productList.filter(p => p.id !== id));
        toast.success("Product deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Error deleting product");
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setSelectedFile(null);
    setPreviewUrl("");
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="moq">MOQ</Label>
                  <Input
                    id="moq"
                    name="moq"
                    type="number"
                    min="1"
                    defaultValue={editingProduct?.moq || 1000}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_days">Delivery Days</Label>
                  <Input
                    id="delivery_days"
                    name="delivery_days"
                    defaultValue={editingProduct?.delivery_days || "7-10 days"}
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
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  name="features"
                  defaultValue={editingProduct?.features?.join(', ')}
                  placeholder="Eco-friendly, Reusable, Strong handles"
                  className="mt-2"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="printing_options">Printing Options (comma-separated)</Label>
                <Textarea
                  id="printing_options"
                  name="printing_options"
                  defaultValue={editingProduct?.printing_options?.join(', ')}
                  placeholder="Screen Printing, Flexo Printing, Digital Print"
                  className="mt-2"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="mt-2 space-y-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {(previewUrl || editingProduct?.image) && (
                    <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={previewUrl || editingProduct?.image} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-primary to-accent"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      {editingProduct ? "Update" : "Add"} Product
                    </>
                  )}
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
                <p className="text-sm text-muted-foreground">
                  MOQ: {product.moq} • Delivery: {product.delivery_days}
                </p>
                <p className="text-sm line-clamp-2">{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
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
