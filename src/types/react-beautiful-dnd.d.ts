// src/types/react-beautiful-dnd.d.ts

declare module 'react-beautiful-dnd' {
  import * as React from 'react'

  export interface DropResult {
    draggableId: string
    type: string
    reason: 'DROP' | 'CANCEL'
    source: {
      index: number
      droppableId: string
    }
    destination?: {
      index: number
      droppableId: string
    }
    combine?: {
      draggableId: string
      droppableId: string
    } | null
    mode?: 'FLUID' | 'SNAP'
  }

  export interface DraggableProvided {
    innerRef: (element?: HTMLElement | null) => any
    draggableProps: React.HTMLAttributes<HTMLElement>
    dragHandleProps?: React.HTMLAttributes<HTMLElement>
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean
    isDropAnimating: boolean
  }

  export interface DroppableProvided {
    innerRef: (element?: HTMLElement | null) => any
    droppableProps: React.HTMLAttributes<HTMLElement>
    placeholder?: React.ReactElement | null
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean
  }

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void
    children?: React.ReactNode
  }

  export const DragDropContext: React.FC<DragDropContextProps>
  export const Droppable: React.FC<{
    droppableId: string
    children: (
      provided: DroppableProvided,
      snapshot: DroppableStateSnapshot
    ) => React.ReactNode
  }>
  export const Draggable: React.FC<{
    draggableId: string
    index: number
    children: (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot
    ) => React.ReactNode
  }>
}
