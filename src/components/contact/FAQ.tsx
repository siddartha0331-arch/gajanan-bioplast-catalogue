import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer: "Our minimum order quantity varies by product type. Typically, it's 1,000 units for non-woven bags and 500 units for PP woven bags. For custom orders with specific printing, please contact us for exact MOQ requirements.",
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 7-10 business days from order confirmation. For urgent orders, we offer express delivery options at additional cost. Delivery time may vary based on order quantity and customization requirements.",
  },
  {
    question: "Can I get custom sizes and printing?",
    answer: "Yes! We offer full customization including custom sizes, colors, and printing. You can add your logo, brand name, or any design. Our team will work with you to ensure the final product meets your exact specifications.",
  },
  {
    question: "What printing options are available?",
    answer: "We offer screen printing, offset printing, and flexo printing. Screen printing is ideal for simple designs with few colors. Offset printing offers high-quality multi-color prints. Our team can recommend the best option based on your design.",
  },
  {
    question: "Are your bags eco-friendly and biodegradable?",
    answer: "Yes, all our non-woven and bioplast bags are 100% eco-friendly and biodegradable. They decompose naturally within 180 days under composting conditions. Our products comply with all environmental regulations.",
  },
  {
    question: "Do you provide samples before bulk orders?",
    answer: "Yes, we can provide samples for quality verification. For standard products, samples may be free (shipping charges apply). For custom designs, there's a nominal fee which is adjusted against your bulk order.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers (NEFT/RTGS), UPI payments, and cheques. For bulk orders, we typically require 50% advance payment with the balance before dispatch. Regular customers may qualify for credit terms.",
  },
  {
    question: "Do you deliver across India?",
    answer: "Yes, we deliver to all major cities and towns across India. Shipping charges are calculated based on order quantity and delivery location. Free shipping is available for orders above certain thresholds.",
  },
];

export const FAQ = () => {
  return (
    <Card className="border-none shadow-lg animate-fade-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
