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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, Trash2, Upload, Loader2, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  moq: number;
  delivery_days: string;
  features: string[];
  printing_options: string[];
  dimensions: string[];
}

const ProductManagement = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [carouselIndex, setCarouselIndex] = useState(0);

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
      setProductList((data || []) as Product[]);
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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Generate preview URLs for all selected files
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setPreviewUrls(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePreviewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Upload all images
      const imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
      }

      const featuresStr = formData.get("features") as string;
      const printingStr = formData.get("printing_options") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      
      // Parse dimensions as array of strings
      const dimensions = dimensionsStr ? dimensionsStr.split(',').map(d => d.trim()).filter(Boolean) : [];
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: formData.get("name") as string,
          type: formData.get("type") as string,
          size: formData.get("size") as string,
          price: Number(formData.get("price")),
          description: formData.get("description") as string,
          image: imageUrls[0] || "/placeholder.svg",
          images: imageUrls,
          moq: Number(formData.get("moq")) || 1000,
          delivery_days: formData.get("delivery_days") as string || "7-10 days",
          features: featuresStr ? featuresStr.split(',').map(f => f.trim()) : [],
          printing_options: printingStr ? printingStr.split(',').map(p => p.trim()) : [],
          dimensions: dimensions,
        }])
        .select()
        .single();

      if (error) throw error;

      setProductList([data as Product, ...productList]);
      toast.success("Product added successfully!");
      setIsDialogOpen(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
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
      
      // Upload new images if selected
      let imageUrls = editingProduct.images || [editingProduct.image];
      if (selectedFiles.length > 0) {
        imageUrls = [];
        for (const file of selectedFiles) {
          const url = await uploadImage(file);
          imageUrls.push(url);
        }
      }

      const featuresStr = formData.get("features") as string;
      const printingStr = formData.get("printing_options") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      
      // Parse dimensions as array of strings
      const dimensions = dimensionsStr ? dimensionsStr.split(',').map(d => d.trim()).filter(Boolean) : [];
      
      const { data, error } = await supabase
        .from('products')
        .update({
          name: formData.get("name") as string,
          type: formData.get("type") as string,
          size: formData.get("size") as string,
          price: Number(formData.get("price")),
          description: formData.get("description") as string,
          image: imageUrls[0] || "/placeholder.svg",
          images: imageUrls,
          moq: Number(formData.get("moq")) || 1000,
          delivery_days: formData.get("delivery_days") as string || "7-10 days",
          features: featuresStr ? featuresStr.split(',').map(f => f.trim()) : [],
          printing_options: printingStr ? printingStr.split(',').map(p => p.trim()) : [],
          dimensions: dimensions,
        })
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (error) throw error;

      setProductList(productList.map(p => 
        p.id === editingProduct.id ? data as Product : p
      ));
      toast.success("Product updated successfully!");
      setEditingProduct(null);
      setIsDialogOpen(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
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
    setSelectedFiles([]);
    setPreviewUrls([]);
    setCarouselIndex(0);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setCarouselIndex(0);
    setIsDialogOpen(true);
  };

  // Get unique product types for filter
  const productTypes = Array.from(new Set(productList.map(p => p.type)));

  // Filter products based on search and filter
  const filteredProducts = productList.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || product.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Get all images for carousel (existing or preview)
  const carouselImages = previewUrls.length > 0 
    ? previewUrls 
    : (editingProduct?.images && editingProduct.images.length > 0 
        ? editingProduct.images 
        : []);

  const nextImage = () => {
    if (carouselImages.length > 0) {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }
  };

  const prevImage = () => {
    if (carouselImages.length > 0) {
      setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    }
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Product Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-gradient-to-r from-primary to-accent">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
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
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
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

              {/* Dimensions Section */}
              <div className="space-y-2">
                <Label htmlFor="dimensions">
                  Available Sizes (comma-separated, e.g., "10x15, 12x18, 15x21")
                </Label>
                <Textarea
                  id="dimensions"
                  name="dimensions"
                  defaultValue={editingProduct?.dimensions?.join(', ')}
                  placeholder="10x15, 12x18, 15x21, 19x22"
                  className="mt-2"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Enter dimension ratios in format: widthxheight (e.g., 10x15)
                </p>
              </div>

              <div>
                <Label htmlFor="images">Product Images (Multiple)</Label>
                <div className="mt-2 space-y-4">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  
                  {/* Image Carousel Preview */}
                  {carouselImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                        <img 
                          src={carouselImages[carouselIndex]} 
                          alt={`Preview ${carouselIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        
                        {/* Navigation buttons */}
                        {carouselImages.length > 1 && (
                          <>
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={prevImage}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={nextImage}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {/* Image counter */}
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {carouselIndex + 1} / {carouselImages.length}
                        </Badge>
                        
                        {/* Delete button for preview images */}
                        {previewUrls.length > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 left-2 h-8 w-8"
                            onClick={() => removePreviewImage(carouselIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Thumbnail navigation */}
                      {carouselImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {carouselImages.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCarouselIndex(idx)}
                              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                                idx === carouselIndex 
                                  ? 'border-primary scale-105' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <img 
                                src={img} 
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Upload multiple images. First image will be the main product image.
                  </p>
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name, type, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {productList.length} products
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={product.images?.[0] || product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images && product.images.length > 1 && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {product.images.length} images
                </Badge>
              )}
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
                {product.dimensions && product.dimensions.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Available Sizes: {product.dimensions.join(', ')}
                  </p>
                )}
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
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
