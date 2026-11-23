class Conta {
    constructor(
        private _id: number,
        private _numero: string,
        private _saldo: number,
        private _titular: string = ""
    ) {}

    get id(): number { return this._id; }
    get numero(): string { return this._numero; }
    get saldo(): number { return this._saldo; }
    get titular(): string { return this._titular; }

    depositar(valor: number): void {
        if (valor > 0) {
            this._saldo += valor;
        }
    }

    sacar(valor: number): boolean {
        if (valor > 0 && valor <= this._saldo) {
            this._saldo -= valor;
            return true;
        }
        return false;
    }

    transferir(destino: Conta, valor: number): boolean {
        if (this.sacar(valor)) {
            destino.depositar(valor);
            return true;
        }
        return false;
    }


    paraLinha(): string {
        return `C;${this.numero};${this.saldo};${this.id};${this.titular}`;
    }

    descricao(): string {
        return `Conta ${this.numero} | Saldo: ${this.saldo.toFixed(2)} | Titular: ${this.titular}`;
    }
}

export class Poupanca extends Conta {
    private _taxaJuros: number;

    constructor(id: number, numero: string, saldo: number, taxaJuros: number, titular: string = "") {
        super(id, numero, saldo, titular);
        this._taxaJuros = taxaJuros;
    }

    get taxaJuros(): number { return this._taxaJuros; }

    renderJuros(): void {
        this.depositar(this.saldo * this._taxaJuros / 100);
    }

    paraLinha(): string {
        return `CP;${this.numero};${this.saldo};${this.taxaJuros};${this.id};${this.titular}`;
    }

    descricao(): string {
        return `Poupança ${this.numero} | Saldo: ${this.saldo.toFixed(2)} | Juros: ${this.taxaJuros}% | Titular: ${this.titular}`;
    }
}

class ContaImposto extends Conta {
    private _taxaDesconto: number;

    constructor(id: number, numero: string, saldo: number, taxaDesconto: number, titular: string = "") {
        super(id, numero, saldo, titular);
        this._taxaDesconto = taxaDesconto;
    }

    get taxaDesconto(): number { return this._taxaDesconto; }


    sacar(valor: number): boolean {
        const total = valor + valor * (this._taxaDesconto / 100);
        return super.sacar(total);
    }

    paraLinha(): string {
        return `CI;${this.numero};${this.saldo};${this.taxaDesconto};${this.id};${this.titular}`;
    }

    descricao(): string {
        return `Conta Imposto ${this.numero} | Saldo: ${this.saldo.toFixed(2)} | Desconto: ${this.taxaDesconto}% | Titular: ${this.titular}`;
    }
}


class ContaBonus extends Conta {
    private _pontos: number;

    constructor(id: number, numero: string, saldo: number, pontos: number = 0, titular: string = "") {
        super(id, numero, saldo, titular);
        this._pontos = pontos;
    }

    get pontos(): number { return this._pontos; }

    depositar(valor: number): void {
        super.depositar(valor);
        if (valor > 0) {
            this._pontos += Math.floor(valor / 100);
        }
    }

    converterPontos(): void {
        const pontos = this._pontos;
        this._pontos = 0;
        super.depositar(pontos); 
    }

    paraLinha(): string {
        return `CB;${this.numero};${this.saldo};${this.pontos};${this.id};${this.titular}`;
    }

    descricao(): string {
        return `Conta Bônus ${this.numero} | Saldo: ${this.saldo.toFixed(2)} | Pontos: ${this.pontos} | Titular: ${this.titular}`;
    }
}
