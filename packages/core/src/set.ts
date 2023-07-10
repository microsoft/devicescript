export class Set<T> {
    private elements: T[] = []

    constructor(elements?: readonly T[] | null) {
        if (elements) {
            this.elements = elements
        }
    }

    size(): number {
        return this.elements.length
    }

    add(value: T): this {
        if (!this.elements.includes(value)) {
            this.elements.push(value)
        }
        return this
    }

    clear(): void {
        this.elements = []
    }

    delete(value: T): boolean {
        if (this.elements.includes(value)) {
            this.elements = this.elements.filter(e => e !== value)
            return true;
        }
        return false;
    }

    has(value: T): boolean {
        return this.elements.includes(value)
    }
}
