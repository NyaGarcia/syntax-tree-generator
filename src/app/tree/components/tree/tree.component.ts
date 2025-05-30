import { Component, ElementRef, Input, Signal, ViewChild } from '@angular/core';
import { TreeLayout, hierarchy } from 'd3';
import * as d3 from 'd3';
import { TreeService } from '../../tree.service';
import { OptionsComponent } from '../options/options.component';
import { Rule } from '../../../../grammar/symbols/rule';
import { GrammarSymbol } from '../../../../grammar/symbols/grammar-symbol.interface';
import { TreeNode } from '../../../utils/tree-node';
import { CommonModule } from '@angular/common';
import { v7 } from 'uuid';
import { MatButtonModule } from '@angular/material/button';
import { Grammar } from '../../../../grammar/grammar';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { EPSILON } from '../../../utils/constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Terminal } from '../../../../grammar/symbols/terminal';
import { NonTerminal } from '../../../../grammar/symbols/non-terminal';
import { GrammarStateService } from '../../../../grammar/services/grammar-state.service';

interface HierarchyDatum {
  name: string;
  value: number;
  children?: Array<HierarchyDatum>;
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [
    OptionsComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbar,
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent {
  grammar: Grammar;

  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;

  root: any;
  tree: TreeLayout<HierarchyDatum>;
  treeData: any;
  svg: any;

  height: number;
  width: number;
  margin: any = { top: 80, bottom: 80, left: 200, right: 90 };
  duration: number = 750;
  horizontalSeparationBetweenNodes: number = 5;
  verticalSeparationBetweenNodes: number = 5;
  nodeTextDistanceY: string = '-5px';
  nodeTextDistanceX: number = 5;
  nodes: any[];
  links: any;

  options: Rule[];

  derivedString: string;

  constructor(
    public treeService: TreeService,
    private grammarState: GrammarStateService
  ) {}

  ngOnInit() {
    this.grammar = this.grammarState.get();
    this.treeService.loadGrammar(this.grammar);
    this.render();
  }

  expandNode(rule: Rule) {
    const currentNode = this.treeService.getCurrentNode();

    if (!currentNode.children) {
      currentNode.children = [];
      currentNode.data.children = [];
    }

    const nodes = rule
      .getSymbols()
      .map((symbol) => this.createNode(symbol, currentNode));

    this.treeService.updateTreeStatus(nodes);

    this.updateNode(currentNode);
    this.updateOptions();
    this.resizeSVG();
  }

  private updateOptions() {
    this.options = this.treeService.getOptions();

    if (this.options.length === 0) {
      this.derivedString = this.getDerivedString();
    }
  }

  private createNode(symbol: GrammarSymbol, currentNode: any) {
    let newNode = hierarchy({ symbol }) as TreeNode<any>;
    newNode.parent = currentNode;
    newNode.depth = currentNode.depth + 1;
    newNode.height = currentNode.height - 1;
    newNode.data = symbol;
    // generate a new unix uuid v7
    newNode.id = v7();

    currentNode.children = [...currentNode.children, newNode];
    currentNode.data.children = [...currentNode.data.children, newNode];

    return newNode;
  }

  render() {
    let element: any = this.chartContainer.nativeElement;
    this.width = 600;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 500 400')
      .append('g')
      .attr('transform', 'translate(0,' + this.margin.top + ')');

    this.tree = d3.tree<HierarchyDatum>().size([this.width, this.height]);

    this.root = d3.hierarchy(this.treeService.getInitialSymbol(), (d: any) => {
      return d.children;
    });

    this.root.x0 = this.width / 2;
    this.root.y0 = 0;

    this.treeData = this.tree(this.root);
    this.treeService.setCurrentNode(this.treeData.descendants()[0]);
    this.options = this.treeService.getOptions();

    this.updateNode(this.root);
  }

  collapse(d: any) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  }

  updateNode(source: any) {
    // Assigns the x and y position for the nodes
    this.treeData = this.tree(this.root);

    // Compute the new tree layout.
    const nodes = this.treeData.descendants(),
      links = this.treeData.descendants().slice(1);

    // Normalize for fixed-depth
    nodes.forEach((d: any) => {
      d.y = d.depth * 100;
    });

    // **************** Nodes Section ****************

    // Update the nodes...
    const node = this.svg.selectAll('g.node').data(nodes, (d: any) => d.id);

    // Enter any new nodes at the parent's previous position.

    const currentNode = this.treeService.getCurrentNode();

    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .classed('terminal', (d: any) => d.data instanceof Terminal)
      .classed('non-terminal', (d: any) => d.data instanceof NonTerminal)
      .classed(
        'current',
        (d: any) => currentNode !== undefined && currentNode.id === d.id
      )
      .attr('transform', (d: any) => {
        return 'translate(' + source.x0 + ',' + source.y0 + ')';
      })
      .on('click', this.click);

    // Add Circle for the nodes
    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', (d: any) => {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => {
        return d.children || d._children ? -18 : 18;
      })
      .attr('text-anchor', (d: any) => {
        return d.children || d._children ? 'end' : 'start';
      })
      .text((d: any) => {
        return d.data.value;
      });

    // Update
    const nodeUpdate = nodeEnter
      .merge(node as any)
      .classed('terminal', (d: any) => d.data instanceof Terminal)
      .classed('non-terminal', (d: any) => d.data instanceof NonTerminal)
      .classed(
        'current',
        (d: any) => currentNode !== undefined && currentNode.id === d.id
      );

    // Transition to the proper position for the nodes
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr('transform', (d: any) => {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    // Update the node attributes and style
    nodeUpdate
      .select('circle.node')
      .attr('r', 10)
      .style('fill', (d: any) => {
        return d._children ? 'lightsteelblue' : '#fff';
      })
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr('transform', (d: any) => {
        return 'translate(' + source.x + ',' + source.y + ')';
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text lables
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // **************** Links Section ****************

    // Update the links...
    const link = this.svg.selectAll('path.link').data(links, (d: any) => {
      return d.id;
    });

    // Enter any new links at the parent's previous position
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal(o, o);
      });

    // Update
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr('d', (d: any) => {
        return this.diagonal(d, d.parent);
      });

    // Remove any existing links
    link
      .exit()
      .transition()
      .duration(this.duration)
      .attr('d', (d: any) => {
        const o = { x: source.x, y: source.y };
        return this.diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Create a curved (diagonal) path from parent to the child nodes
  }

  // Toggle children on click
  click = (event: any, d: any) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (!d.children && !d._children) {
      return;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.updateNode(d);
  };

  undo() {
    this.treeService.undo();
    const currentNode = this.treeService.getCurrentNode();
    this.removeNode(currentNode);

    this.updateOptions();
  }

  private removeNode(node: any) {
    node.children = undefined;
    node.data.children = undefined;

    this.updateNode(node);
  }

  private diagonal(s: any, d: any) {
    const path = `M ${s.x} ${s.y}
      C ${(s.x + d.x) / 2} ${s.y},
        ${(s.x + d.x) / 2} ${d.y},
        ${d.x} ${d.y}`;

    return path;
  }

  clear() {
    const nativeElement = this.chartContainer.nativeElement;

    if (nativeElement.firstChild) {
      nativeElement.removeChild(nativeElement.firstChild);
    }

    this.root = null;
    this.treeService.clear();
    this.render();
  }
  private resizeSVG() {
    const svg = this.chartContainer.nativeElement.firstChild;
    const bbox = svg.getBBox();
    // Update the width and height using the size of the contents
    svg.setAttribute('width', bbox.x * 2 + bbox.width);
    svg.setAttribute('height', bbox.y * 3 + bbox.height);
    svg.setAttribute(
      'viewBox',
      '0 0 ' + (bbox.x * 2 + bbox.width) + ' ' + (bbox.y * 2 + bbox.height)
    );
  }

  private getDerivedString() {
    return this.getLeafNodesLeftToRight(this.root)
      .map(({ data: { value } }) => (value === EPSILON ? '' : value))
      .join('');
  }

  private getLeafNodesLeftToRight(root: any): any[] {
    const leaves: any[] = [];

    function traverse(node: any): void {
      if (!node.children || node.children.length === 0) {
        leaves.push(node);
      } else {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }

    traverse(root);
    return leaves;
  }

  @ViewChild('chart', { static: true }) chartRef!: ElementRef;

  downloadSvg(): void {
    const chartEl = this.chartRef.nativeElement as HTMLElement;
    const svg = chartEl.querySelector('svg');
    if (!svg) {
      console.error('SVG not found');
      return;
    }

    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

    // Manually apply known SCSS styles from your file
    clonedSvg.querySelectorAll('.node circle').forEach((el) => {
      el.setAttribute('fill', '#fff');
      el.setAttribute('stroke', 'steelblue');
      el.setAttribute('stroke-width', '3px');
    });

    clonedSvg.querySelectorAll('.node.terminal circle').forEach((el) => {
      el.setAttribute('fill', '#fff');
      el.setAttribute('stroke', 'green');
      el.setAttribute('stroke-width', '3px');
    });

    clonedSvg.querySelectorAll('.node text').forEach((el) => {
      el.setAttribute('font-size', '12px');
      el.setAttribute('font-family', 'sans-serif');
    });

    clonedSvg.querySelectorAll('.link').forEach((el) => {
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#ccc');
      el.setAttribute('stroke-width', '2px');
    });

    // Serialize and trigger download
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tree-diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
