/**
 * A store for the transformer.
 * The transformer is a Konva component.
 * It handles the selection and transformation of shapes.
 */
import Konva from 'konva';
import React from 'react';
import { create } from 'zustand';

const DEFAULT_ENABLED_ANCHORS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

type EventListener = typeof Konva.Transformer.prototype.on;

export interface TransformerStore {
  actions: {
    initialize: (transformer: React.RefObject<Konva.Transformer>) => void;

    /** Enables all anchors for transformation of the selection */
    enableAllAnchors: () => void;

    /** Enables the default anchors for transformation of the selection */
    enableDefaultAnchors: () => void;

    /** Enables or disables rotating the selection */
    enableRotation: (enabled: boolean) => void;

    /** Enables or disables resizing the selection */
    enableResizing: (enabled: boolean) => void;

    /** Resets current selection by removing all nodes from the transformer */
    clearSelection: () => void;

    /** Returns true if the transformer currently has a selection */
    hasSelection: () => boolean;

    /** Returns true if the given node is currently selected */
    isNodeSelected: (konvaNode: Konva.Node) => boolean;

    /** Returns true if the transformer is currently transforming a node */
    isTransforming: () => boolean;

    /** Returns the current selection */
    getSelection: () => Konva.Node[];

    /** Selects a single node */
    select: (node: Konva.Node) => void;

    /** Add a new node to the transformer's current set of nodes */
    addNodeToSelection: (node: Konva.Node) => void;

    /** Removes given node from the transformer's current set of nodes */
    removeNodeFromSelection: (node: Konva.Node) => void;

    /** Replaces the selected nodes with the provided array */
    replaceNodesInSelectionSelection: (nodes: Konva.Node[]) => void;

    /** Removes all currently selected nodes from the transformer */
    removeAllNodesFromSelection: () => void;

    /** Adds an event listener to the transformer */
    addEventListener: EventListener;

    /** Removes an event listener from the transformer */
    removeEventListener: (evtStr?: string | undefined, callback?: () => void | undefined) => void;

    /** Prevents all transformer actions from being executed */
    blockTransformerActions: () => void;

    /** Resume accepting transformer actions again */
    unblockTransformerActions: () => void;
  };
}

export const useTransformerStore = create<TransformerStore>()(() => {
  let __transformerRef = React.createRef<Konva.Transformer>();
  let blocked: boolean;

  return {
    actions: {
      initialize(transformerRef) {
        __transformerRef = transformerRef;
        blocked = false;
      },
      enableAllAnchors: () => {
        if (blocked) return;
        enableAllAnchors(__transformerRef.current);
      },
      enableDefaultAnchors: () => {
        if (blocked) return;
        __transformerRef.current?.enabledAnchors(DEFAULT_ENABLED_ANCHORS);
      },
      enableRotation(enabled) {
        if (blocked) return;
        __transformerRef.current?.rotateEnabled(enabled);
      },
      enableResizing(enabled) {
        if (blocked) return;
        __transformerRef.current?.resizeEnabled(enabled);
      },
      clearSelection: () => {
        if (blocked) return;
        clearSelection(__transformerRef.current);
      },
      hasSelection: () => hasSelection(__transformerRef.current),
      isNodeSelected: (node) => isNodeSelected(__transformerRef.current, node),
      isTransforming: () => isTransforming(__transformerRef.current),
      getSelection: () => __transformerRef.current?.nodes() ?? [],
      select: (node) => {
        if (blocked) return;
        select(__transformerRef.current, node);
      },
      addEventListener(event, fn) {
        if (blocked) return;
        __transformerRef.current?.on(event, fn);
      },
      removeEventListener: (event, fn) => {
        if (blocked) return;
        removeEventListener(__transformerRef.current, event, fn);
      },
      addNodeToSelection: (node) => {
        if (blocked) return;
        addNodeToSelection(__transformerRef.current, node);
      },
      removeNodeFromSelection: (node) => {
        if (blocked) return;
        removeNodeFromSelection(__transformerRef.current, node);
      },
      removeAllNodesFromSelection: () => {
        if (blocked) return;
        setSelectedNodes(__transformerRef.current, []);
      },
      replaceNodesInSelectionSelection: (nodes) => {
        if (blocked) return;
        setSelectedNodes(__transformerRef.current, nodes);
      },
      blockTransformerActions: () => (blocked = true),
      unblockTransformerActions: () => (blocked = false),
    },
  } satisfies TransformerStore;
});

function enableAllAnchors(transformer: Konva.Transformer | null) {
  transformer?.enabledAnchors([
    'top-left',
    'top-center',
    'top-right',
    'middle-right',
    'middle-left',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ]);
}

function clearSelection(transformer: Konva.Transformer | null) {
  transformer?.enabledAnchors(DEFAULT_ENABLED_ANCHORS);
  transformer?.nodes([]);
}

function hasSelection(transformer: Konva.Transformer | null): boolean {
  const nodes = transformer?.nodes() ?? [];
  return nodes.length > 0;
}

function isNodeSelected(transformer: Konva.Transformer | null, konvaNode: Konva.Node): boolean {
  const nodes = transformer?.nodes() ?? [];
  return nodes.includes(konvaNode);
}

function isTransforming(transformer: Konva.Transformer | null): boolean {
  return transformer?.isTransforming() ?? false;
}

function select(transformer: Konva.Transformer | null, node: Konva.Node) {
  transformer?.nodes([node]);
}

function removeEventListener(
  transformer: Konva.Transformer | null,
  evtStr?: string | undefined,
  callback?: () => void | undefined,
) {
  transformer?.off(evtStr, callback);
}

function addNodeToSelection(transformer: Konva.Transformer | null, node: Konva.Node) {
  const currentNodes = transformer?.nodes() ?? [];
  if (!currentNodes.includes(node)) {
    transformer?.nodes([...currentNodes, node]);
  }
}

function removeNodeFromSelection(transformer: Konva.Transformer | null, node: Konva.Node) {
  const currentNodes = transformer?.nodes() ?? [];
  const newNodes = currentNodes.filter((n) => n !== node);
  transformer?.nodes(newNodes);
}

function setSelectedNodes(transformer: Konva.Transformer | null, nodes: Konva.Node[]) {
  transformer?.nodes(nodes);
}
