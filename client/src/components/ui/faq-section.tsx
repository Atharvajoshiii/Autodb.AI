import { Check, PhoneCall, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

function FAQ() {
  return (
    <div className="w-full py-20 lg:py-40 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="flex gap-10 flex-col justify-center">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="outline" className="text-sm">FAQ</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h4 className="text-4xl md:text-6xl tracking-tighter max-w-xl text-left font-bold text-gray-800">
                Got Questions? We’ve Got Answers!
                </h4>
                <p className="text-xl max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-gray-600 text-left">
                  Traditional database design is slow and complex. Our AI-driven tool automates schema generation, making it effortless for developers, analysts, and businesses.
                </p>
              </div>
              <div className="mt-4">
                <Button className="gap-4" variant="outline">
                  Any questions? Reach out <PhoneCall className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <Accordion 
            type="single" 
            collapsible 
            className="w-full space-y-4"
          >
            {[
              {
                question: "How does the AI automate database design?",
                answer: "Our system leverages Sonnet LLM to process user prompts, merge them with system-level instructions, and generate optimized database schemas instantly."
              },
              {
                question: "Is this suitable for beginners?",
                answer: "Absolutely! Our tool simplifies database structuring, making it easy for students, analysts, and startups to create efficient schemas without prior experience."
              },
              {
                question: "What technologies power this tool?",
                answer: "We use Firebase for authentication, Firestore for project storage, and Sonnet LLM for AI-driven schema generation, ensuring efficiency and scalability."
              },
              {
                question: "Can I customize the generated schemas?",
                answer: "Yes! Our drag-and-drop editor allows users to tweak AI-generated schemas to fit their specific needs before finalizing the design."
              },
              {
                question: "How does this improve database efficiency?",
                answer: "Our AI optimizes schema structures, reducing redundancy, ensuring normalization, and improving query performance for real-world applications."
              }
            ].map((item, index) => (
              <AccordionItem 
                key={`question-${index + 1}`} 
                value={`question-${index + 1}`} 
                className="border border-gray-200 rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl font-semibold text-left text-gray-800">
                      {item.question}
                    </span>
                    <div className="ml-4">
                      <Plus className="h-6 w-6 text-gray-500 accordion-open:hidden" />
                      <Minus className="h-6 w-6 text-gray-500 hidden accordion-open:block" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white">
                  <p className="text-lg text-gray-600">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export { FAQ };