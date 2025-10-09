import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products, Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const [selectedType, setSelectedType] = useState<string>("All");

  const types = ["All", "D Cut", "W Cut", "PP Woven", "BOPP"];

  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our complete range of eco-friendly bags and packaging solutions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className={
                selectedType === type
                  ? "bg-gradient-to-r from-primary to-accent"
                  : ""
              }
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-none shadow-md animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      {product.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">
                      {product.size}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-2xl font-bold text-primary mb-4">
                    ₹{product.price}
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    <a
                      href={`https://wa.me/919834711168?text=Hello%20Gajanan%20Bioplast,%20I%20want%20to%20enquire%20about%20${encodeURIComponent(
                        product.name
                      )}%20(${product.size})%20priced%20at%20₹${product.price}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enquire on WhatsApp
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
