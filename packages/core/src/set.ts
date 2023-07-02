Set.prototype.add = function (value) {
    if (!this.elements.includes(value)) {
        this.elements.push(value)
    }
    return this
}

Set.prototype.clear = function () {
    this.elements = []
}

Set.prototype.delete = function (value) {
    if (this.elements.includes(value)) {
        this.elements = this.elements.filter(e => e !== value)
        return true;
    }
    return false;
}


Set.prototype.forEach = function (f, thisArg?) {
    this.elements.forEach((element) => {
        // TODO: set "this" to be thisArg
        f(element, element, this)
    })
}

Set.prototype.has = function (value) {
    return this.elements.includes(value);
}

