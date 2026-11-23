import * as readline from "readline";
import { Banco } from "./ex04_banco";
import { Conta, Poupanca, ContaImposto, ContaBonus } from "./ex04_contas";

const banco = new Banco();
const ARQUIVO = "contas.txt";

const rl = readline.createInterface({ input: process.stdin });
const linhas = rl[Symbol.asyncIterator]();

async function perguntar(texto: string): Promise<string> {
    process.stdout.write(texto);
    const r = await linhas.next();
    return r.done ? "0" : r.value.trim();
}

function menu(): void {
    console.log(`
===== BANCO =====
1 - Inserir conta
2 - Consultar conta
3 - Depositar
4 - Sacar
5 - Transferir
6 - Render Juros
7 - Converter pontos (Conta Bônus)
8 - Carregar contas do arquivo
9 - Gravar contas no arquivo
10 - Listar contas
0 - Sair`);
}

async function inserir(): Promise<void> {
    const tipo = (await perguntar("Tipo (C=Conta, CP=Poupança, CI=Conta Imposto, CB=Conta Bônus): ")).toUpperCase();
    const id = parseInt(await perguntar("Id: "));
    const numero = await perguntar("Número: ");
    const saldo = parseFloat(await perguntar("Saldo inicial: "));
    const titular = await perguntar("Titular: ");
    let conta: Conta | null = null;

    if (tipo === "C") {
        conta = new Conta(id, numero, saldo, titular);
    } else if (tipo === "CP") {
        const taxa = parseFloat(await perguntar("Taxa de juros (%): "));
        conta = new Poupanca(id, numero, saldo, taxa, titular);
    } else if (tipo === "CI") {
        // Ex. 4b: só a App precisou mudar; o Banco trabalha com "Conta" (polimorfismo)
        const taxa = parseFloat(await perguntar("Taxa de desconto (%): "));
        conta = new ContaImposto(id, numero, saldo, taxa, titular);
    } else if (tipo === "CB") {
        conta = new ContaBonus(id, numero, saldo, 0, titular);
    } else {
        console.log("Tipo inválido.");
        return;
    }
    console.log(banco.inserir(conta) ? "Conta inserida." : "Já existe conta com esse número.");
}

async function main(): Promise<void> {
    let opcao = "";
    do {
        menu();
        opcao = await perguntar("Opção: ");
        try {
            switch (opcao) {
                case "1": await inserir(); break;
                case "2": {
                    const c = banco.consultar(await perguntar("Número: "));
                    console.log(c ? c.descricao() : "Conta não encontrada.");
                    break;
                }
                case "3": {
                    const n = await perguntar("Número: ");
                    banco.depositar(n, parseFloat(await perguntar("Valor: ")));
                    break;
                }
                case "4": {
                    const n = await perguntar("Número: ");
                    const ok = banco.sacar(n, parseFloat(await perguntar("Valor: ")));
                    console.log(ok ? "Saque realizado." : "Saque não realizado.");
                    break;
                }
                case "5": {
                    const o = await perguntar("Origem: ");
                    const d = await perguntar("Destino: ");
                    const ok = banco.transferir(o, d, parseFloat(await perguntar("Valor: ")));
                    console.log(ok ? "Transferência realizada." : "Transferência não realizada.");
                    break;
                }
                case "6": banco.renderJuros(await perguntar("Número da poupança: ")); break;
                case "7": banco.converterPontos(await perguntar("Número da conta bônus: ")); break;
                case "8": console.log(`${banco.carregar(ARQUIVO)} conta(s) carregada(s).`); break;
                case "9": banco.salvar(ARQUIVO); console.log("Contas gravadas."); break;
                case "10": banco.contas.forEach(c => console.log(c.descricao())); break;
                case "0": console.log("Até logo!"); break;
                default: console.log("Opção inválida.");
            }
        } catch (e) {
            console.log("Erro:", (e as Error).message);
        }
    } while (opcao !== "0");
    rl.close();
}

main();
