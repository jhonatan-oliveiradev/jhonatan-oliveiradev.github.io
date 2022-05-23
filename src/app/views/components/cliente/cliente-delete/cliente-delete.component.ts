import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Cliente } from "src/app/models/cliente";
import { ClienteService } from "src/app/services/cliente.service";

@Component({
  selector: "app-cliente-delete",
  templateUrl: "./cliente-delete.component.html",
  styleUrls: ["./cliente-delete.component.css"],
})
export class ClienteDeleteComponent implements OnInit {
  id_cli = "";

  cliente: Cliente = {
    id: "",
    nome: "",
    cpf: "",
    telefone: "",
  };

  nome = new FormControl("", [Validators.minLength(5)]);
  cpf = new FormControl("", [Validators.minLength(11)]);
  telefone = new FormControl("", [Validators.minLength(11)]);

  constructor(
    private router: Router,
    private service: ClienteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id_cli = this.route.snapshot.paramMap.get("id")!;
    this.findById();
  }

  findById(): void {
    this.service.findById(this.id_cli).subscribe((response) => {
      this.cliente = response;
    });
  }

  cancel(): void {
    this.router.navigate(["clientes"]);
  }

  update(): void {
    this.service.update(this.cliente).subscribe((response) => {
      this.router.navigate(["clientes"]);
      this.service.message("Cliente removido com sucesso!");
    });
  }

  delete(): void {
    this.service.delete(this.id_cli).subscribe(
      (response) => {
        this.router.navigate(["clientes"]);
        this.service.message("Cliente removido com sucesso!");
      },
      (err) => {
        this.service.message(
          "Cliente possui Ordens de Serviço em aberto, não pode ser deletado!"
        );
      }
    );
  }
}
