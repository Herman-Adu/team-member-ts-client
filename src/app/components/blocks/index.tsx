import { RichTextBlock } from "./rich-text-block";
import { TestimonialBlock } from "./testimonial-block";
import { SpoilerBlock } from "./spoiler-block";
import { AccordionBlock } from "./accordion";

type TeamPageBlock =
  | SpoilerBlock
  | TestimonialBlock
  | RichTextBlock
  | AccordionBlock;

const blocks: Record<
  TeamPageBlock["__component"],
  React.ComponentType<{ block: TeamPageBlock }>
> = {
  "blocks.spoiler": ({ block }: { block: TeamPageBlock }) => (
    <SpoilerBlock block={block as SpoilerBlock} />
  ),
  "blocks.testimonial": ({ block }: { block: TeamPageBlock }) => (
    <TestimonialBlock block={block as TestimonialBlock} />
  ),
  "blocks.rich-text": ({ block }: { block: TeamPageBlock }) => (
    <RichTextBlock block={block as RichTextBlock} />
  ),
  "blocks.accordion": ({ block }: { block: TeamPageBlock }) => (
    <AccordionBlock block={block as AccordionBlock} />
  ),
};

function BlockRenderer({ block }: { block: TeamPageBlock }) {
  const BlockComponent = blocks[block.__component];
  return BlockComponent ? <BlockComponent block={block} /> : null;
}

export { BlockRenderer };
export type { TeamPageBlock };
