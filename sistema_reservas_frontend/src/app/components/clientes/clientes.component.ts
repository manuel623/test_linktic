import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  public viewForm: boolean = false;
  public createUserButton: boolean = false
  public loadingTable: boolean = true;
  public dataClient: any = [];
  public clientForm: FormGroup;
  public dataTempClient: any = {};

  constructor(
    private clientService: ClientesService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    })
  }

  ngOnInit() {
    this.getDataClient();
  }

  /** 
   * Trae todos los clientes registrados
   */
  getDataClient() {
    this.clientService.listClient().subscribe(
      (response) => {
        this.dataClient = response.clients;
        this.loadingTable = false;
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  /** 
   * Valida la vista del formulario
   */
  viewFormCreate() {
    this.clientForm.reset();
    this.dataTempClient = {};
    this.viewForm = true;
  }

  /** 
   * Valida la vista de la tabla de contenidos
   */
  goBack() {
    this.viewForm = false;
  }

  /**
   * Crea nuevo cliente
   */
  createUser() {
    if (this.clientForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      let data = {
        Nombre: this.clientForm.get('nombre')?.value,
        Telefono: this.clientForm.get('telefono')?.value,
        email: this.clientForm.get('email')?.value,
      };
      this.clientService.createClient(data).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataClient();
            Swal.fire({
              title: '¡Éxito!',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
          } else {
            this.loadingTable = false;
            Swal.fire({
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        },
        (error) => {
          this.createUserButton = false;
          Swal.fire({
            title: '¡Error!',
            text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        }
      )
    }
  }

  /**
   * Trae la data registrada del cliente a editar
   * @param id 
   */
  public editViewUser(id: number) {
    this.dataTempClient = {};
    this.clientForm.reset();
    this.viewForm = true;
    this.dataTempClient = this.dataClient.find((u: any) => u.id === id);

    this.clientForm.patchValue({
      nombre: this.dataTempClient.nombre,
      email: this.dataTempClient.email,
      telefono: this.dataTempClient.telefono
    })
  }

  /**
   * Consulta en el mismo formulario, si se crea o si se actualiza un cliente 
   */
  public submitForm() {
    if (this.dataTempClient && Object.keys(this.dataTempClient).length > 0) {
      this.editUser();
    } else {
      this.createUser();
    }
  }

  /**
   * Edita cliente
   */
  public editUser() {
    if (this.clientForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      let data = {
        Nombre: this.clientForm.get('nombre')?.value,
        Telefono: this.clientForm.get('telefono')?.value,
        email: this.clientForm.get('email')?.value,
      };
      this.clientService.editClient(data, this.dataTempClient.id).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataClient();
            Swal.fire({
              title: '¡Éxito!',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
          } else {
            this.loadingTable = false;
            Swal.fire({
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        },
        (error) => {
          this.createUserButton = false;
          Swal.fire({
            title: '¡Error!',
            text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
            icon: 'warning',
            confirmButtonText: 'OK',
          });
        }
      )
    }
  }

  /**
   * Elimina cliente
   * @param id 
   */
  public deleteUser(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el registro permanentemente. ¡No podrás revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingTable = true;
        this.clientService.deleteClient(id).subscribe({
          next: (response) => {
            this.getDataClient();
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El registro ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          error: (error) => {
            this.loadingTable = false;
            Swal.fire({
              title: '¡Ups! Algo salió mal',
              text: 'Tuvimos un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        });
      }
    });
  }
}
