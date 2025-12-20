import {
  type EmailComponent,
  type ComponentType,
  COMPONENT_METADATA,
} from './email-types';

// Generate unique ID for components
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate if a component can be added to a parent
export function canAddComponent(
  componentType: ComponentType,
  parentType?: ComponentType
): boolean {
  const metadata = COMPONENT_METADATA[componentType];

  if (!parentType) {
    return componentType === 'section';
  }

  const parentMetadata = COMPONENT_METADATA[parentType];

  if (
    metadata.allowedParents &&
    !metadata.allowedParents.includes(parentType)
  ) {
    return false;
  }

  if (
    parentMetadata.allowedChildren &&
    !parentMetadata.allowedChildren.includes(componentType)
  ) {
    return false;
  }

  return true;
}

// Create a new component with default props
export function createComponent(type: ComponentType): EmailComponent {
  const metadata = COMPONENT_METADATA[type];
  return {
    ...metadata.defaultProps,
    id: generateId(),
  } as EmailComponent;
}

// Find component by ID in tree
export function findComponent(
  components: EmailComponent[],
  id: string
): EmailComponent | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if ('children' in component && component.children) {
      const found = findComponent(component.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Update component in tree
export function updateComponent(
  components: EmailComponent[],
  id: string,
  updates: Partial<EmailComponent>
): EmailComponent[] {
  return components.map((component) => {
    if (component.id === id) {
      return { ...component, ...updates } as EmailComponent;
    }
    if ('children' in component && component.children) {
      return {
        ...component,
        children: updateComponent(component.children, id, updates),
      } as EmailComponent;
    }
    return component;
  });
}

// Add component to parent
export function addComponentToParent(
  components: EmailComponent[],
  parentId: string | null,
  newComponent: EmailComponent
): EmailComponent[] {
  if (parentId === null) {
    return [...components, newComponent];
  }

  return components.map((component) => {
    if (component.id === parentId) {
      if ('children' in component) {
        return {
          ...component,
          children: [...(component.children || []), newComponent],
        };
      }
    }
    if ('children' in component && component.children) {
      return {
        ...component,
        children: addComponentToParent(
          component.children,
          parentId,
          newComponent
        ),
      };
    }
    return component;
  });
}

// Remove component from tree
export function removeComponent(
  components: EmailComponent[],
  id: string
): EmailComponent[] {
  return components
    .filter((component) => component.id !== id)
    .map((component) => {
      if ('children' in component && component.children) {
        return {
          ...component,
          children: removeComponent(component.children, id),
        };
      }
      return component;
    });
}
