import { Banco } from "./ex04_banco";
import { Conta, Poupanca, ContaImposto, ContaBonus } from "./ex04_contas";

const banco = new Banco();
banco.inserir(new Conta(1, "111-1", 100, "Ely"));
banco.inserir(new Poupanca(2, "222-2", 100, 0.5, "Maria"));
banco.inserir(new ContaImposto(3, "333-3", 100, 0.38, "Pedro"));
banco.inserir(new ContaBonus(4, "444-4", 0, 0, "Amanda"));

banco.renderJuros("222-2");
console.log("Poupança após juros (esperado 100.5):", banco.consultar("222-2")!.saldo);
banco.renderJuros("111-1"); 
console.log("Conta comum após renderJuros (esperado 100):", banco.consultar("111-1")!.saldo);
 
banco.sacar("333-3", 10);
console.log("Conta imposto (esperado 89.962):", banco.consultar("333-3")!.saldo);

banco.depositar("444-4", 250); 
banco.converterPontos("444-4");
console.log("Conta bônus (esperado 252):", banco.consultar("444-4")!.saldo);

const b2 = new Banco();
console.log("Lidas do arquivo:", b2.carregar("contas.txt"));
b2.contas.forEach(c => console.log(c.descricao()));
b2.depositar("111-1", 10);
b2.salvar("contas_saida.txt");
console.log("Gravado em contas_saida.txt");
