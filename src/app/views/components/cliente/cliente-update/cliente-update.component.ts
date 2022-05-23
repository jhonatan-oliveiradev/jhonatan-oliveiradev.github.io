import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Cliente } from "src/app/models/cliente";
import { ClienteService } from "src/app/services/cliente.service";

@Component({
  selector: "app-cliente-update",
  templateUrl: "./cliente-update.component.html",
  styleUrls: ["./cliente-update.component.css"],
})
export class ClienteUpdateComponent implements OnInit {
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
    this.service.update(this.cliente).subscribe(
      (response) => {
        this.router.navigate(["clientes"]);
        this.service.message("Cliente Atualizado com sucesso!");
      },
      (err) => {
        if (err.error.error.match("já cadastrado")) {
          this.service.message("CPF já cadastrado no banco de dados!");
        } else if (
          err.error.errors[0].message ===
          "número do registro de contribuinte individual brasileiro (CPF) inválido"
        ) {
          this.service.message("CPF inválido!");
        }
      }
    );
  }

  errorValidName() {
    if (this.nome.invalid) {
      return "O nome deve ter no mínimo 5 caracteres!";
    }
    return false;
  }

  errorValidCpf() {
    if (this.cpf.invalid) {
      return "O CPF deve ter 11 e 15 caracteres!";
    }
    return false;
  }

  errorValidTelefone() {
    if (this.telefone.invalid) {
      return "O telefone deve ter 11 e 18 caracteres!";
    }
    return false;
  }
}
