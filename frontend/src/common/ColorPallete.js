export default class ColorPallete {

    constructor() {
        this.current = 0;
        this.colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']
    };
    next() {
        let col = this.colors[this.current % this.colors.length];
        this.current++;
        return col;
    };
    first() {
        return this.colors[0];
    }
};
