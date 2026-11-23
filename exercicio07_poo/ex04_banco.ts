import * as fs from "fs";
import { Conta, Poupanca, ContaImposto, ContaBonus } from "./ex04_contas";

export class Banco {
    private _contas: Conta[] = [];

    get contas(): Conta[] { return this._contas; }

    inserir(conta: Conta): boolean {
        if (this.consultar(conta.numero) == null) {
            this._contas.push(conta);
            return true;
        }
        return false;
    }

    // A consulta funciona para qualquer tipo de conta (polimorfismo)
    consultar(numero: string): Conta | null {
        for (const c of this._contas) {
            if (c.numero === numero) return c;
        }
        return null;
    }

    depositar(numero: string, valor: number): void {
        const c = this.consultar(numero);
        if (c != null) c.depositar(valor);
    }

    sacar(numero: string, valor: number): boolean {
        const c = this.consultar(numero);
        return c != null ? c.sacar(valor) : false;
    }

    transferir(origem: string, destino: string, valor: number): boolean {
        const o = this.consultar(origem);
        const d = this.consultar(destino);
        if (o != null && d != null) return o.transferir(d, valor);
        return false;
    }

    // Ex. 4a
    renderJuros(numero: string): void {
        const conta = this.consultar(numero);
        if (conta != null && conta instanceof Poupanca) {
            (<Poupanca> conta).renderJuros(); // cast para acessar o método da subclasse
        }
    }

    // Ex. 4e - novo comportamento exposto no Banco
    converterPontos(numero: string): void {
        const conta = this.consultar(numero);
        if (conta instanceof ContaBonus) {
            (<ContaBonus> conta).converterPontos();
        }
    }

    // Ex. 4c - leitura do arquivo (módulo "fs" nativo do Node.js)
    // Formato: tipo;numero;saldo;[extra];id;titular
    //   C  -> C;numero;saldo;id;titular
    //   CP -> CP;numero;saldo;taxaJuros;id;titular
    //   CI -> CI;numero;saldo;taxaDesconto;id;titular
    //   CB -> CB;numero;saldo;pontos;id;titular
    carregar(caminho: string): number {
        if (!fs.existsSync(caminho)) {
            throw new Error(`Arquivo não encontrado: ${caminho}`);
        }
        const linhas = fs.readFileSync(caminho, "utf-8").split(/\r?\n/);
        this._contas = [];
        let lidas = 0;

        for (const linha of linhas) {
            if (linha.trim() === "") continue;
            const p = linha.split(";").map(s => s.trim());
            const tipo = p[0];
            let conta: Conta | null = null;

            if (tipo === "C") {
                conta = new Conta(parseInt(p[3]), p[1], parseFloat(p[2]), p[4]);
            } else if (tipo === "CP") {
                conta = new Poupanca(parseInt(p[4]), p[1], parseFloat(p[2]), parseFloat(p[3]), p[5]);
            } else if (tipo === "CI") {
                conta = new ContaImposto(parseInt(p[4]), p[1], parseFloat(p[2]), parseFloat(p[3]), p[5]);
            } else if (tipo === "CB") {
                conta = new ContaBonus(parseInt(p[4]), p[1], parseFloat(p[2]), parseInt(p[3]), p[5]);
            }

            if (conta != null && this.inserir(conta)) lidas++;
        }
        return lidas;
    }

    // Ex. 4d - gravação no arquivo
    salvar(caminho: string): void {
        const texto = this._contas.map(c => c.paraLinha()).join("\n") + "\n";
        fs.writeFileSync(caminho, texto, "utf-8");
    }
}
