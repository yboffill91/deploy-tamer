// Types for email template components

export type ComponentType =
  | 'section'
  | 'img'
  | 'heading'
  | 'text'
  | 'link'
  | 'column'
  | 'row'
  | 'button'
  | 'hr';

export interface BaseComponent {
  id: string;
  type: ComponentType;
  className?: string;
  children?: EmailComponent[];
}

export interface SectionComponent extends BaseComponent {
  type: 'section';
  children: EmailComponent[];
}

export interface ImgComponent extends BaseComponent {
  type: 'img';
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface HeadingComponent extends BaseComponent {
  type: 'heading';
  content: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string;
}

export interface LinkComponent extends BaseComponent {
  type: 'link';
  href: string;
  content: string;
}

export interface ColumnComponent extends BaseComponent {
  type: 'column';
  children: EmailComponent[];
}

export interface RowComponent extends BaseComponent {
  type: 'row';
  children: EmailComponent[];
}

export interface ButtonComponent extends BaseComponent {
  type: 'button';
  href: string;
  content: string;
}

export interface HrComponent extends BaseComponent {
  type: 'hr';
}

export type EmailComponent =
  | SectionComponent
  | ImgComponent
  | HeadingComponent
  | TextComponent
  | LinkComponent
  | ColumnComponent
  | RowComponent
  | ButtonComponent
  | HrComponent;

export interface EmailTemplate {
  preview: string;
  body: EmailComponent[];
}

// Component metadata for the component library
export interface ComponentMetadata {
  type: ComponentType;
  label: string;
  icon: string;
  description: string;
  canHaveChildren: boolean;
  allowedParents?: ComponentType[];
  allowedChildren?: ComponentType[];
  defaultProps: Partial<EmailComponent>;
}

export const COMPONENT_METADATA: Record<ComponentType, ComponentMetadata> = {
  section: {
    type: 'section',
    label: 'Section',
    icon: 'LayoutGrid',
    description: 'Independent content section',
    canHaveChildren: true,
    allowedChildren: ['row'],
    defaultProps: { type: 'section', children: [] },
  },
  row: {
    type: 'row',
    label: 'Row',
    icon: 'RectangleHorizontal',
    description: 'Full-width row container',
    canHaveChildren: true,
    allowedParents: ['section'],
    allowedChildren: [
      'column',
      'heading',
      'text',
      'button',
      'link',
      'img',
      'hr',
    ],
    defaultProps: { type: 'row', children: [] },
  },
  column: {
    type: 'column',
    label: 'Column',
    icon: 'RectangleVertical',
    description: 'Column container for content',
    canHaveChildren: true,
    allowedParents: ['row'],
    allowedChildren: ['heading', 'text', 'button', 'link', 'img', 'hr'],
    defaultProps: { type: 'column', children: [] },
  },
  img: {
    type: 'img',
    label: 'Image',
    icon: 'ImageIcon',
    description: 'Display an image',
    canHaveChildren: false,
    allowedParents: ['column', 'row'],
    defaultProps: {
      type: 'img',
      src: '/placeholder.svg?height=200&width=600',
      width: 600,
      height: 200,
      alt: 'Image description',
    },
  },
  heading: {
    type: 'heading',
    label: 'Heading',
    icon: 'Heading',
    description: 'Text heading',
    canHaveChildren: false,
    allowedParents: ['column', 'row'],
    defaultProps: { type: 'heading', content: 'Heading Text', level: 1 },
  },
  text: {
    type: 'text',
    label: 'Text',
    icon: 'Type',
    description: 'Paragraph text',
    canHaveChildren: false,
    allowedParents: ['column', 'row'],
    defaultProps: { type: 'text', content: 'Your text content here...' },
  },
  link: {
    type: 'link',
    label: 'Link',
    icon: 'Link',
    description: 'Hyperlink',
    canHaveChildren: false,
    allowedParents: ['column', 'row'],
    defaultProps: {
      type: 'link',
      href: 'https://example.com',
      content: 'Click here',
    },
  },
  button: {
    type: 'button',
    label: 'Button',
    icon: 'MousePointer2',
    description: 'Call-to-action button',
    canHaveChildren: false,
    allowedParents: ['column', 'row'],
    defaultProps: {
      type: 'button',
      href: 'https://example.com',
      content: 'Click me',
    },
  },
  hr: {
    type: 'hr',
    label: 'Separator',
    icon: 'Minus',
    description: 'Horizontal line separator',
    canHaveChildren: false,
    allowedParents: ['column', 'row'],
    defaultProps: { type: 'hr' },
  },
};
