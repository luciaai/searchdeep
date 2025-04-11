import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SearchFAQ() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What&apos;s the difference between the top scroll websites and the websites in the AI&apos;s response?
            </AccordionTrigger>
            <AccordionContent>
              The top scroll area shows all websites found by our search engine, while the AI&apos;s response only includes the most relevant sources as citations. 
              Think of the top scroll as a complete bibliography and the response citations as footnotes for specific information.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Why do I see more websites in the top scroll than in the AI&apos;s response?
            </AccordionTrigger>
            <AccordionContent>
              The AI only cites sources that directly contributed to answering your question. 
              The top scroll shows all discovered sources, giving you complete transparency and additional resources to explore.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>
              When I download a conversation, what content is included?
            </AccordionTrigger>
            <AccordionContent>
              Downloads include the conversation between you and the AI, including any citations the AI provided in its responses. 
              The download does not include the complete list of websites from the top scroll area.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>
              If I repeat a search from my history, will I get the same websites?
            </AccordionTrigger>
            <AccordionContent>
              Not necessarily. Each search is a fresh request to our search engine, which may return different results based on 
              updated web content, changes to search algorithms, or new available information.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>
              How many searches do I get with a free account?
            </AccordionTrigger>
            <AccordionContent>
              Free accounts come with 5 credits. Each search uses 1 credit, regardless of the type of search.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
