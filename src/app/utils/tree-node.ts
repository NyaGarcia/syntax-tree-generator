import { HierarchyNode } from "d3";

export interface TreeNode<T> extends HierarchyNode<T>  {
    depth: number;
    height: number;
}