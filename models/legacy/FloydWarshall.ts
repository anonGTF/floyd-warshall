export class FloydWarshall<T> {
    private directed: boolean;
    private numNodes = 0;
  
    private distance: number[][] = [];
    private next: number[][] = [];
  
    private nodeIndex: Map<T, number> = new Map();
    private node: Map<number, T> = new Map();
  
    /**
     *
     * @param edges
     */
    constructor(edges: Edge<T>[]);
    /**
     * In a undirected graph provide only one of the symmetric edges. The other will be generated.
     *
     * @param edges a list of edge objects. Each edge is an object with from, to, and weight values.
     * @param directed True for directed graphs (default). False for undirected graphs.
     */
    constructor(edges: Edge<T>[], directed: boolean);
    /**
     *
     * @param nodes
     * @param edges
     */
    constructor(nodes: T[], edges: Edge<T>[]);
    /**
     *
     * @param nodes if the list is empty, nodes are inferred from edges
     * @param edges
     * @param directed
     */
    constructor(nodes: T[], edges: Edge<T>[], directed: boolean);
    constructor(arg1: T[] | Edge<T>[], arg2?: boolean | Edge<T>[], arg3 = true) {
        let nodes: T[] = [];
        let edges: Edge<T>[] = [];
        let directed = true;

        if (arg1.length > 0) {
            // arg1[0].hasOwnProperty('from'))
            if (Object.prototype.hasOwnProperty.call(arg1[0], "from")) {
                edges = arg1 as Edge<T>[];
                if (arg2 !== undefined) {
                    directed = arg2 as boolean;
                }
            } else {
                nodes = arg1 as T[];
                edges = arg2 as Edge<T>[];
            }
        } else {
            if (Array.isArray(arg2)) {
                edges = arg2;
                directed = arg3;
            } else {
                if (arg2 !== undefined) {
                    directed = arg2;
                }
            }
        }
    
        this.directed = directed;
    
        if (nodes.length === 0) nodes = this.getImplicitNodes(edges);
    
        nodes.forEach((n) => {
            this.nodeIndex.set(n, this.numNodes);
            this.node.set(this.numNodes, n);
            this.numNodes++;
        });
  
      const numericalEdges: Edge<number>[] = [];
        edges.forEach((d) => {
            const fromNode = this.nodeIndex.get(d.from);
            if (fromNode === undefined)
            throw new Error("Node " + fromNode + " is not in list of nodes.");
            const toNode = this.nodeIndex.get(d.to);
            if (toNode === undefined)
            throw new Error("Node " + toNode + " is not in list of nodes.");
    
            numericalEdges.push({
            from: fromNode,
            to: toNode,
            weight: d.weight,
            });
        });
    
        this.initDistanceMatrix(numericalEdges);
        this.floydWarshall();
    }
  
    private getImplicitNodes(edges: Edge<T>[]): T[] {
        const nodes: T[] = [];
        edges.forEach((d) => {
            const indexFrom = nodes.indexOf(d.from);
            if (indexFrom < 0) nodes.push(d.from);
            const indexTo = nodes.indexOf(d.to);
            if (indexTo < 0) nodes.push(d.to);
        });
        return nodes;
    }
  
    private initDistanceMatrix(edges: Edge<number>[]): void {
        for (let i = 0; i < this.numNodes; i++) {
            this.distance.push([]);
            this.next.push([]);
            for (let j = 0; j < this.numNodes; j++) {
            if (i == j) {
                this.distance[i].push(0);
                this.next[i].push(i);
            } else {
                this.distance[i].push(Infinity);
                this.next[i].push(Infinity); // null
            }
            }
        }
        edges.forEach((e) => {
            this.distance[e.from][e.to] = e.weight;
            this.next[e.from][e.to] = e.to;
    
            if (!this.directed) {
            this.distance[e.to][e.from] = e.weight;
            this.next[e.to][e.from] = e.from;
            }
        });
    }
  
    /**
     * Caculates the V x V matrix of shortest distances between all nodes V.
     */
    private floydWarshall(): void {
        for (let k = 0; k < this.numNodes; k++) {
            for (let i = 0; i < this.numNodes; i++) {
                for (let j = 0; j < this.numNodes; j++) {
                    if (this.distance[i][j] > this.distance[i][k] + this.distance[k][j]) {
                    this.distance[i][j] = this.distance[i][k] + this.distance[k][j];
                    this.next[i][j] = this.next[i][k];
                    }
                }
            }
        }
    }
  
    private shortestPath(u: number, v: number): number[] {
        if (this.next[u][v] == Infinity) {
            return [];
        }
        const path: number[] = [u];
        while (u != v) {
            u = this.next[u][v];
            path.push(u);
        }
        return path;
    }
  
    /**
     * Returns the shortest path (list of nodes) between the two parameters.
     *
     * @param from node
     * @param to node
     * @returns a list of nodes
     */
    getShortestPath(from: T, to: T): T[] {
        const fromNode = this.nodeIndex.get(from);
        const toNode = this.nodeIndex.get(to);
        if (fromNode !== undefined && toNode !== undefined) {
            return this.numberListToNodeList(this.shortestPath(fromNode, toNode));
        } else {
            throw new Error("Unknown node");
        }
    }
  
    private shortestVisitingPath(nodeArray: number[]): number[] {
        const p = new Permutation(nodeArray.length);
    
        let bestPermutation: number[] = [];
        let bestDistance = Infinity;
    
        while (p.hasNext()) {
            const permutation = p.next().map((i) => nodeArray[i]);
            let permutationDistance = 0;
            for (let i = 0; i < permutation.length - 1; i++) {
                permutationDistance += this.distance[permutation[i]][permutation[i + 1]];
            }
            if (permutationDistance < bestDistance) {
                bestDistance = permutationDistance;
                bestPermutation = permutation;
            }
        }
    
        let path: number[] = [];
        if (bestPermutation.length > 0) {
            path.push(bestPermutation[0]);
        }
        for (let i = 0; i < bestPermutation.length - 1; i++) {
            path = path.concat(this.shortestPath(bestPermutation[i], bestPermutation[i + 1]).slice(1));
        }
    
        return path;
    }
    
    /**
     * Returns the shortest path (list of nodes) visiting all the nodes in the parameter list.
     *
     * @param visiting an array of nodes that have to be visited by the path
     * @returns a list of nodes (the shortest path)
     */
    getShortestVisitingPath(visiting: T[]): T[] {
        const visitingNum: number[] = [];

        for (let i = 0; i < visiting.length; i++) {
            const num = this.nodeIndex.get(visiting[i]);
            if (num === undefined) throw new Error("Unknown node: " + visiting[i]);
            visitingNum.push(num);
        }
    
        return this.numberListToNodeList(this.shortestVisitingPath(visitingNum));
    }
    
    private numberListToNodeList(numbers: number[]): T[] {
        const nodes: T[] = [];
        for (let i = 0; i < numbers.length; i++) {
            const node = this.node.get(numbers[i]);
            if (node === undefined) throw new Error("Unknown node");
            nodes.push(node);
        }
        return nodes;
    }
    
    isDirected(): boolean {
        return this.directed;
    }
    
    /**
     * Shortest distance uses the internal distance table calculated by the
     * Floyd-Warshall algorithm to return the shortest distance between two nodes.
     *
     * @param from node
     * @param to node
     * @returns shortest distance or Infinity if the nodes are not connected
     */
    getShortestDistance(from: T, to: T): number {
        const fromNode = this.nodeIndex.get(from);
        const toNode = this.nodeIndex.get(to);
        if (fromNode !== undefined && toNode !== undefined) {
            return this.distance[fromNode][toNode];
        } else {
            throw new Error("Unknown node");
        }
    }
}
  
/**
 * Steinhaus–Johnson–Trotter algorithm, Even's speedup
 * https://en.wikipedia.org/wiki/Steinhaus%E2%80%93Johnson%E2%80%93Trotter_algorithm
 *
 *
 * The Steinhaus–Johnson–Trotter algorithm or Johnson–Trotter algorithm generates
 * all of the permutations of n elements. Each permutation in the sequence that
 * it generates differs from the previous permutation by swapping two adjacent
 * elements of the sequence.
 *
 * An improvement of the Steinhaus–Johnson–Trotter algorithm by Shimon Even
 * provides an improvement to the running time
 * of the algorithm by storing additional information for each element in the
 * permutation: its position, and a direction (positive, negative, or zero) in which
 * it is currently moving.
 */
export class Permutation {
    private numbers: number[] = [];
    private directions: number[] = [];
    private positions: number[] = [];
    private terminated = false;
    /**
     *
     * @param n numbers in the arrray 1..n
     */
    constructor(private n: number, private start = 0) {
        if (n < 0) throw new Error("Permutation constructor expects a positive number");

        /**
         * Initially, the direction of the number 1 is zero,
         * and all other elements have a negative direction
         */
        for (let i = 0; i < n; i++) {
            this.numbers.push(i);
            this.positions.push(i);
            if (i === 0) this.directions.push(0);
            else this.directions.push(-1);
        }
    }

    /**
     * Checks if there is a permutation to return.
     *
     * @returns
     */
    hasNext(): boolean { return !this.terminated; }
    /**
     * Returns the next permutation of the Steinhaus–Johnson–Trotter algorithm,
     * starting with [1,2,3, ..., n].
     *
     * Returns undefined if the permutations have been exhausted.
     *
     * @returns the next permutation or undefined
     */
    next(): number[] {
        if (this.terminated) {
            throw new Error("next(): there is no next permutation");
        }
        const copy = this.numbers.slice(0);
        this.generateNext();
        if (this.start > 0) return copy.map((i) => i + this.start);
        else return copy;
    }

    /**
     * At each step, the algorithm finds the greatest element with a nonzero direction,
     * and swaps it in the indicated direction.
     *
     * When all numbers become unmarked, the algorithm terminates.
     */
    private generateNext() {
        // findMaxWithDirection;
        let index = -1;
        for (let i = this.n - 1; i >= 0; i--) {
            if (this.directions[i] !== 0) {
                index = this.positions[i];
                break;
            }
        }
        // swap
        if (index !== -1) this.swapWithNextElementInDirection(index);
        else this.terminated = true;
    }

    private swapWithNextElementInDirection(index: number) {
        // precondition this.directions[index] not 0
        /**
         * swaps it in the indicated direction
         */
        const number = this.numbers[index];
        const newIndex = index + this.directions[number];
        const otherNumber = this.numbers[newIndex];

        [this.positions[number], this.positions[otherNumber]] = [
            this.positions[otherNumber],
            this.positions[number],
        ];
        [this.numbers[newIndex], this.numbers[index]] = [
            this.numbers[index],
            this.numbers[newIndex],
        ];

        /**
         * If this causes the chosen element to reach the first or last position
         * within the permutation, or if the next element in the same direction
         * is greater than the chosen element, the direction of the chosen element is set to zero:
         */
        if (
            newIndex === 0 ||
            newIndex === this.numbers.length - 1 ||
            this.numbers[newIndex] < this.numbers[newIndex + this.directions[number]]
        ) {
            this.directions[number] = 0;
        }

        /**
         * After each step, all elements greater than the chosen element
         * (which previously had direction zero) have their directions
         * set to indicate motion toward the chosen element.
         * */
        for (let i = 0; i < this.numbers.length; i++) {
            if (i === newIndex) continue;
            if (this.numbers[i] > this.numbers[newIndex]) {
            this.directions[this.numbers[i]] = i < newIndex ? 1 : -1;
            }
        }
    }
}
  