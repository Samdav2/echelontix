"use client";
import { useState } from "react";
import AccordionItem from "./accordionItem";
import { HelpCircle } from "lucide-react";

const AccordionMenu = [
  {
    id: 1,
    title: "How do I buy a ticket?",
    content:
      "Simply visit our website, select your preferred event, choose your ticket category (Regular, VIP, VVIP, or Table), and complete your purchase securely via Paystack.",
  },
  {
    id: 2,
    title: "How will I receive my ticket?",
    content:
      "After a successful payment, your ticket will be delivered instantly by email. Each ticket includes a unique QR code or ticket ID, which must be presented at the event for entry.",
  },
  {
    id: 3,
    title: "What if I don’t receive my ticket?",
    content:
      "First, check your spam or promotions folder. If it’s still not there, contact us at echelontix@gmail.com with your payment details, and we’ll resend your ticket promptly.",
  },
  {
    id: 5,
    title: "What is your refund policy?",
    content:
      "Refunds are only available in specific cases, such as event cancellation, duplicate payments, or technical errors. For details, please review our Refund Policy.",
  },
  {
    id: 6,
    title: "What payment methods are accepted?",
    content:
      "We accept secure online payments through Paystack, which supports major debit/credit cards, bank transfers, and USSD.",
  },
  {
    id: 7,
    title: "Who do I contact for support?",
    content:
      "For all inquiries, ticket issues, or refund requests, please email us at echelontix@gmail.com. Our support team will assist you within 24–48 hours.",
  },
];

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="my-12 lg:my-20 relative">
      {/* Header */}
      <div className="flex justify-center items-center mb-10">
        <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-white-500" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl ml-3 font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          FAQs
        </h1>
      </div>

      {/* Accordion Items */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {AccordionMenu.map((item, index) => (
          <AccordionItem
            key={item.id}
            title={item.title}
            content={item.content}
            index={index}
            activeIndex={activeIndex}
            onAccordionClick={handleAccordionClick}
          />
        ))}
      </div>
    </section>
  );
};

export default Accordion;
