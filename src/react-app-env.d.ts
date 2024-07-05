import 'react';

/// <reference types="react-scripts" />

// It needs to avoid losing generic types in a memoized component
declare module 'react' {
  function memo<T extends ComponentType<any>>(
    Component: T,
    propsAreEqual?: (
      prevProps: Readonly<ComponentProps<T>>,
      nextProps: Readonly<ComponentProps<T>>,
    ) => boolean,
  ): T & { displayName?: string };
}
