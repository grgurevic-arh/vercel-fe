import type { Block, BlockText } from "@/types/cms";

function renderTextNode(node: BlockText, index: number) {
  let content: React.ReactNode = node.text;

  if (node.bold) content = <strong key={index}>{content}</strong>;
  if (node.italic) content = <em key={index}>{content}</em>;
  if (node.underline) content = <u key={index}>{content}</u>;
  if (node.strikethrough) content = <s key={index}>{content}</s>;
  if (node.code) content = <code key={index}>{content}</code>;

  return <span key={index}>{content}</span>;
}

function renderChildren(children: BlockText[]) {
  if (!Array.isArray(children)) return null;
  return children.map((child, i) => renderTextNode(child, i));
}

interface BlocksRendererProps {
  content: Block[];
  className?: string;
  numberedHeadings?: boolean;
}

export function BlocksRenderer({
  content,
  className,
  numberedHeadings,
}: BlocksRendererProps) {
  if (!Array.isArray(content)) return null;
  return (
    <div className={className}>
      {content.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Tag = `h${block.level}` as const;
            const text = block.children?.map((c) => c.text).join("") ?? "";
            const dotIdx = text.indexOf(". ");
            if (
              numberedHeadings &&
              dotIdx !== -1 &&
              /^\d+$/.test(text.slice(0, dotIdx))
            ) {
              const number = text.slice(0, dotIdx + 2);
              const rest = text.slice(dotIdx + 2);
              return (
                <Tag key={index} className="relative">
                  <span className="absolute right-full pr-[4px] whitespace-nowrap">
                    {number}
                  </span>
                  {rest}
                </Tag>
              );
            }
            return <Tag key={index}>{renderChildren(block.children)}</Tag>;
          }
          case "paragraph":
            return <p key={index}>{renderChildren(block.children)}</p>;
          case "list": {
            const Tag = block.format === "ordered" ? "ol" : "ul";
            return (
              <Tag key={index}>
                {block.children.map((item, i) => (
                  <li key={i}>{renderChildren(item.children)}</li>
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={index}>
                {renderChildren(block.children)}
              </blockquote>
            );
          case "code":
            return (
              <pre key={index}>
                <code>{renderChildren(block.children)}</code>
              </pre>
            );
          case "image":
            return (
              <img
                key={index}
                src={block.image.url}
                alt={block.image.alternativeText ?? ""}
                width={block.image.width}
                height={block.image.height}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
