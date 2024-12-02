import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TreeLayout,hierarchy } from 'd3';
import * as d3 from 'd3';
import { TreeService } from '../../tree.service';
import { OptionsComponent } from "../options/options.component";
import { Rule } from '../../../../grammar/symbols/rule';
import { GrammarSymbol } from '../../../../grammar/symbols/grammar-symbol.interface';
import { NonTerminal } from '../../../../grammar/symbols/non-terminal';
import { TreeNode } from '../../../utils/tree-node';
import { CommonModule } from '@angular/common';

interface HierarchyDatum {
  name: string;
  value: number;
  children?: Array<HierarchyDatum>;
}

const data: HierarchyDatum = {
  name: 'A1',
  value: 100,
  children: [
    {
      name: 'B1',
      value: 100,
      children: [
        {
          name: 'C1',
          value: 100,
          children: undefined,
        },
        {
          name: 'C2',
          value: 300,
          children: [
            {
              name: 'D1',
              value: 100,
              children: undefined,
            },
            {
              name: 'D2',
              value: 300,
              children: undefined,
            },
          ],
        },
        {
          name: 'C3',
          value: 200,
          children: undefined,
        },
      ],
    },
    {
      name: 'B2',
      value: 200,
      children: [
        {
          name: 'C4',
          value: 100,
          children: undefined,
        },
        {
          name: 'C5',
          value: 300,
          children: undefined,
        },
        {
          name: 'C6',
          value: 200,
          children: [
            {
              name: 'D3',
              value: 100,
              children: undefined,
            },
            {
              name: 'D4',
              value: 300,
              children: undefined,
            },
          ],
        },
      ],
    },
  ],
};


@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [OptionsComponent, CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent {
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

  dragStarted: boolean;
  draggingNode: any;
  nodes: any[];
  selectedNodeByDrag: any;

  selectedNodeByClick: any;
  previousClickedDomNode: any;
  links: any;

  options: Rule[];

  constructor(private treeService: TreeService) {}

  ngOnInit() {
    this.render();
  }

  expandNode(rule: Rule) {
    const currentNode = this.treeService.getCurrentNode();

    if(!currentNode.children){
      currentNode.children = [];
      currentNode.data.children = [];
    }
    
    const nodes = rule.getSymbols().map(symbol => this.createNode(symbol, currentNode));

    this.treeService.updateTreeStatus(nodes);
    
    console.log("NEW NODE");
    console.log(currentNode);
    this.updateNode(currentNode);
    this.updateOptions();
  }

  private updateOptions() {
    this.options = this.treeService.getOptions();
  }

  private createNode(symbol: GrammarSymbol, currentNode: any) {
    let newNode = hierarchy({symbol}) as TreeNode<any>;
    newNode.parent = currentNode;
    newNode.depth = currentNode.depth + 1;
    newNode.height = currentNode.height - 1;
    newNode.data = symbol;

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
      .attr('viewBox', '0 0 600 350')
      .append('g')
      .attr('transform', 'translate(0,' + this.margin.top + ')');

    this.tree = d3.tree<HierarchyDatum>().size([this.width, this.height]);

    this.root = d3.hierarchy(this.treeService.getCurrentNode(), function (d: any) {
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
    let i = 0;
    // Assigns the x and y position for the nodes
    this.treeData = this.tree(this.root);

    // Compute the new tree layout.
    const nodes = this.treeData.descendants(),
      links = this.treeData.descendants().slice(1);

    console.log(this.treeData.descendants());

    // Normalize for fixed-depth
    nodes.forEach(function (d: any) {
        d.y = d.depth * 100;
    });

    // **************** Nodes Section ****************

    // Update the nodes...
    const node = this.svg.selectAll('g.node').data(nodes, function (d: any) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function (d: any) {
        return 'translate(' + source.x0 + ',' + source.y0 + ')';
      })
      .on('click', this.click);

    // Add Circle for the nodes
    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style('fill', function (d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      });

    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('x', function (d: any) {
        return d.children || d._children ? -13 : 13;
      })
      .attr('text-anchor', function (d: any) {
        return d.children || d._children ? 'end' : 'start';
      })
      .text(function (d: any) {
        return d.data.value;
      });

    // Update
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the nodes
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

    // Update the node attributes and style
    nodeUpdate
      .select('circle.node')
      .attr('r', 10)
      .style('fill', function (d: any) {
        return d._children ? 'lightsteelblue' : '#fff';
      })
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr('transform', function (d: any) {
        return 'translate(' + source.x + ',' + source.y + ')';
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text lables
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // **************** Links Section ****************

    // Update the links...
    const link = this.svg.selectAll('path.link').data(links, function (d: any) {
      return d.id;
    });

    // Enter any new links at the parent's previous position
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', function (d: any) {
        const o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    // Update
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr('d', function (d: any) {
        return diagonal(d, d.parent);
      });

    // Remove any existing links
    const linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr('d', function (d: any) {
        const o = { x: source.x, y: source.y };
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d: any) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Create a curved (diagonal) path from parent to the child nodes
    function diagonal(s: any, d: any) {
      const path = `M ${s.x} ${s.y}
        C ${(s.x + d.x) / 2} ${s.y},
          ${(s.x + d.x) / 2} ${d.y},
          ${d.x} ${d.y}`;

      return path;
    }
  }

  // Toggle children on click
  click = (event: any, d: any) => {
    console.log("click");
    console.log(d);
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.updateNode(d);
  };
}
