class Produto {
    private _id: number;
    private _descricao: string;
    private _quantidade: number;
    private _valorUnitario: number;

    constructor(id: number, descricao: string, quantidade: number, valorUnitario: number) {
        this._id = id;
        this._descricao = descricao;
        this._quantidade = quantidade;
        this._valorUnitario = valorUnitario;
    }

    get id(): number { return this._id; }
    get descricao(): string { return this._descricao; }
    get quantidade(): number { return this._quantidade; }
    get valorUnitario(): number { return this._valorUnitario; }

    repor(quantidade: number): void {
        if (quantidade > 0) {
            this._quantidade += quantidade;
        }
    }

    darBaixa(quantidade: number): void {
        if (quantidade > 0 && quantidade <= this._quantidade) {
            this._quantidade -= quantidade;
        }
    }
}

class ProdutoPerecivel extends Produto {
    private _dataValidade: Date;

    constructor(id: number, descricao: string, quantidade: number, valorUnitario: number, dataValidade: Date) {
        super(id, descricao, quantidade, valorUnitario);
        this._dataValidade = dataValidade;
    }

    get dataValidade(): Date { return this._dataValidade; }

    estaValido(): boolean {
        return this._dataValidade.getTime() >= new Date().getTime();
    }


    repor(quantidade: number): void {
        if (this.estaValido()) {
            super.repor(quantidade);
        }
    }

    darBaixa(quantidade: number): void {
        if (this.estaValido()) {
            super.darBaixa(quantidade);
        }
    }
}

class Estoque {
    private _produtos: (Produto | ProdutoPerecivel)[] = [];

    existe(id: number, descricao: string): boolean {
        for (const p of this._produtos) {
            if (p.id === id || p.descricao === descricao) return true;
        }
        return false;
    }

    incluir(produto: Produto): boolean {
        if (!this.existe(produto.id, produto.descricao)) {
            this._produtos.push(produto);
            return true;
        }
        return false;
    }

    consultar(id: number): Produto | null {
        for (const p of this._produtos) {
            if (p.id === id) return p;
        }
        return null;
    }

    excluir(id: number): boolean {
        const indice = this._produtos.findIndex(p => p.id === id);
        if (indice >= 0) {
            this._produtos.splice(indice, 1);
            return true;
        }
        return false;
    }

    repor(id: number, quantidade: number): void {
        const p = this.consultar(id);
        if (p != null) p.repor(quantidade);
    }

    darBaixa(id: number, quantidade: number): void {
        const p = this.consultar(id);
        if (p != null) p.darBaixa(quantidade);
    }

    listarPereciveisVencidos(): ProdutoPerecivel[] {
        const vencidos: ProdutoPerecivel[] = [];
        for (const p of this._produtos) {
            if (p instanceof ProdutoPerecivel && !p.estaValido()) {
                vencidos.push(p);
            }
        }
        return vencidos;
    }
}

const estoque = new Estoque();
const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);

console.log(estoque.incluir(new Produto(1, "Caderno", 10, 15.5)));                 
console.log(estoque.incluir(new Produto(1, "Lápis", 10, 2)));                               (id repetido)
console.log(estoque.incluir(new Produto(2, "Caderno", 5, 15.5)));                  
console.log(estoque.incluir(new ProdutoPerecivel(3, "Leite", 20, 5, amanha)));     
console.log(estoque.incluir(new ProdutoPerecivel(4, "Iogurte", 8, 4, ontem)));     
estoque.repor(1, 5);
estoque.darBaixa(1, 3);
console.log("Caderno (esperado 12):", estoque.consultar(1)!.quantidade);

estoque.darBaixa(3, 5);
console.log("Leite (esperado 15):", estoque.consultar(3)!.quantidade);

estoque.repor(4, 10); 
console.log("Iogurte vencido (esperado 8):", estoque.consultar(4)!.quantidade);

console.log("Vencidos:", estoque.listarPereciveisVencidos().map(p => p.descricao)); 
console.log("Excluir 1:", estoque.excluir(1), "| Consultar 1:", estoque.consultar(1));
