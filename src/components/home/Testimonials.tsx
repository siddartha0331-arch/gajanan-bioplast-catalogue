import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    company: "ABC Retail",
    content: "Excellent quality bags! We've been using Gajanan Bioplast for our store packaging for 3 years. Their D-Cut bags are durable and eco-friendly.",
    rating: 5,
    location: "Mumbai",
  },
  {
    name: "Priya Patel",
    company: "Green Grocers",
    content: "The custom printing quality is amazing. Our customers love the branded bags. Timely delivery and great customer service.",
    rating: 5,
    location: "Pune",
  },
  {
    name: "Amit Joshi",
    company: "Fashion Hub",
    content: "We switched to their BOPP bags for our boutique and the feedback has been phenomenal. Premium look at affordable prices.",
    rating: 5,
    location: "Delhi",
  },
  {
    name: "Sunita Deshmukh",
    company: "Organic Store",
    content: "As an eco-conscious business, finding truly biodegradable bags was important. Gajanan Bioplast delivered exactly what we needed.",
    rating: 5,
    location: "Ahmednagar",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-bold text-primary">Customer Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by 500+ businesses across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up bg-background"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <Quote className="w-8 h-8 text-primary/20" />
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
