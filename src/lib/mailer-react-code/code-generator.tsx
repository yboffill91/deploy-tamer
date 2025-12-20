import { EmailComponent } from "./email-types";

// Generate code for a single component
function generateComponentCode(component: EmailComponent, indent = 0): string {
  const spaces = '  '.repeat(indent);
  const { type, className } = component;

  // Build className prop
  const classNameProp = className ? ` className="${className}"` : '';

  switch (type) {
    case 'section':
      return `${spaces}<Section${classNameProp}>
${
  'children' in component && component.children
    ? component.children
        .map((child) => generateComponentCode(child, indent + 1))
        .join('\n')
    : ''
}
${spaces}</Section>`;

    case 'row':
      return `${spaces}<Row${classNameProp}>
${
  'children' in component && component.children
    ? component.children
        .map((child) => generateComponentCode(child, indent + 1))
        .join('\n')
    : ''
}
${spaces}</Row>`;

    case 'column':
      return `${spaces}<Column${classNameProp}>
${
  'children' in component && component.children
    ? component.children
        .map((child) => generateComponentCode(child, indent + 1))
        .join('\n')
    : ''
}
${spaces}</Column>`;

    case 'heading':
      if ('content' in component) {
        const level = 'level' in component ? component.level || 1 : 1;
        return `${spaces}<Heading as="h${level}"${classNameProp}>${component.content}</Heading>`;
      }
      return '';

    case 'text':
      if ('content' in component) {
        return `${spaces}<Text${classNameProp}>${component.content}</Text>`;
      }
      return '';

    case 'link':
      if ('href' in component && 'content' in component) {
        return `${spaces}<Link href="${component.href}"${classNameProp}>${component.content}</Link>`;
      }
      return '';

    case 'button':
      if ('href' in component && 'content' in component) {
        return `${spaces}<Button href="${component.href}"${classNameProp}>${component.content}</Button>`;
      }
      return '';

    case 'img':
      if (
        'src' in component &&
        'width' in component &&
        'height' in component &&
        'alt' in component
      ) {
        return `${spaces}<Img src="${component.src}" width={${component.width}} height={${component.height}} alt="${component.alt}"${classNameProp} />`;
      }
      return '';

    case 'hr':
      return `${spaces}<Hr${classNameProp} />`;

    default:
      return '';
  }
}

// Generate complete email template code
export function generateEmailCode(
  components: EmailComponent[],
  previewText: string
): string {
  const bodyContent = components
    .map((component) => generateComponentCode(component, 4))
    .join('\n');

  return `import {
  Html,
  Head,
  Tailwind,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Link,
  Button,
  Img,
  Hr,
  Preview,
} from "@react-email/components"

export default function EmailTemplate() {
  return (
    <Html>
      <Head />
      <Preview>${previewText}</Preview>
      <Tailwind>
        <Body>
          <Container>
${bodyContent}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}`;
}
