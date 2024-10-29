import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {
  public viewForm: boolean = false;
  public createUserButton: boolean = false;
  public loadingTable: boolean = true;
  public dataService: any = [];
  public serviceForm: FormGroup;
  public dataTempUser: any = {};

  constructor(
    private servicesService: ServiciosService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.serviceForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnInit() {
    this.getDataService();
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  /** 
   * Trae todos los servicios registrados
   */
  getDataService() {
    this.servicesService.listService().subscribe(
      (response) => {
        this.dataService = response.services;
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
    this.serviceForm.reset();
    this.dataTempUser = {};
    this.viewForm = true;
  }

  /** 
   * Valida la vista de la tabla de contenidos
   */
  goBack() {
    this.viewForm = false;
  }

  /** 
   * Crea un nuevo servicio 
   * */
  createService() {
    if (this.serviceForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      let data = {
        Nombre: this.serviceForm.get('nombre')?.value,
        Descripcion: this.serviceForm.get('descripcion')?.value,
        Precio: this.serviceForm.get('precio')?.value,
      };
      this.servicesService.createService(data).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataService();
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
      );
    }
  }

  /**
   * 
   * @param id 
   */
  public editViewService(id: number) {
    this.dataTempUser = {};
    this.serviceForm.reset();
    this.viewForm = true;
    this.dataTempUser = this.dataService.find((u: any) => u.id === id);

    this.serviceForm.patchValue({
      nombre: this.dataTempUser.nombre,
      descripcion: this.dataTempUser.descripcion,
      precio: this.dataTempUser.precio
    });
  }

  /**
   * Consulta en el mismo formulario, si se crea o si se actualiza un servicio 
   */
  public submitForm() {
    if (this.dataTempUser && Object.keys(this.dataTempUser).length > 0) {
      this.editService();
    } else {
      this.createService();
    }
  }

  /**
   * Edita un servicio
   */
  public editService() {
    if (this.serviceForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      let data = {
        Nombre: this.serviceForm.get('nombre')?.value,
        Descripcion: this.serviceForm.get('descripcion')?.value,
        Precio: this.serviceForm.get('precio')?.value,
      };

      this.servicesService.editService(data, this.dataTempUser.id).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataService();
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
      );
    }
  }

  /**
   * Elimina un servicio
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
        this.servicesService.deleteService(id).subscribe({
          next: (response) => {
            this.getDataService();
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
