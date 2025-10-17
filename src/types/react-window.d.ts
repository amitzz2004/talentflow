// src/types/react-window.d.ts
declare module 'react-window' {
  import * as React from 'react'

  export interface ListChildComponentProps {
    index: number
    style: React.CSSProperties
    data?: any
  }

  export interface FixedSizeListProps {
    height: number
    itemCount: number
    itemSize: number
    width: number | string
    children: React.ComponentType<ListChildComponentProps>
  }

  // ✅ Main class React uses
  export class FixedSizeList extends React.Component<FixedSizeListProps> {}

  // ✅ Optional: also support default export
  const _default: { FixedSizeList: typeof FixedSizeList }
  export default _default
}
