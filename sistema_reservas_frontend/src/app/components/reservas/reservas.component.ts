import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  public viewForm: boolean = false;
  public createUserButton: boolean = false;
  public loadingTable: boolean = true;
  public dataReserva: any = [];
  public dataClient: any = [];
  public dataServicio: any = [];
  public reservaForm: FormGroup;
  public dataTempUser: any = {};
  public searchText: string = '';
  constructor(
    private reservaService: ReservasService,
    private clientService: ClientesService,
    private serviciosService: ServiciosService,
    private fb: FormBuilder,
  ) {
    this.reservaForm = this.fb.group({
      cliente: ['', Validators.required],
      servicio: ['', Validators.required],
      fecha: ['', [Validators.required, this.fechaFuturaValidator.bind(this)]],
      hora: ['', Validators.required],
      estado: ['Activa', Validators.required]
    });
  }

  ngOnInit() {
    this.getDataReserva();
    this.getDataClients();
    this.getDataServicios();
  }

  /**
   * Formatea la fecha para ser mas amigable con el usuario
   * @param control 
   * @returns 
   */
  fechaFuturaValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return { fechaPasada: true };
    }
    return null;
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  /** 
   * Trae todas las reservas registradas
   */
  getDataReserva() {
    this.reservaService.listReservas().subscribe(
      (response) => {
        this.dataReserva = response.reservas;
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
   * Trae todos los clientes registrados
   */
  getDataClients() {
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
   * Trae todos los servicios registrados
   */
  getDataServicios() {
    this.serviciosService.listService().subscribe(
      (response) => {
        this.dataServicio = response.services;
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
    this.reservaForm.reset();
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
   * Crea una nueva reserva 
   * */
  createReser() {
    if (this.reservaForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      const fechaReserva = `${this.reservaForm.get('fecha')?.value}T${this.reservaForm.get('hora')?.value}`;
      let data = {
        ClienteId: Number(this.reservaForm.get('cliente')?.value),
        ServicioId: Number(this.reservaForm.get('servicio')?.value),
        FechaReserva: fechaReserva,
        Estado: this.reservaForm.get('estado')?.value
      };

      this.reservaService.createReservas(data).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataReserva();
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
  public editViewUReser(id: number) {
    this.dataTempUser = {};
    this.reservaForm.reset();
    this.viewForm = true;
    this.dataTempUser = this.dataReserva.find((u: any) => u.id === id);
    console.log("edt", this.dataTempUser);
    const [fecha, hora] = this.dataTempUser.fechaReserva.split('T');

    this.reservaForm.patchValue({
      cliente: this.dataTempUser.clienteNombre,
      servicio: this.dataTempUser.servicioNombre,
      fecha: fecha,
      hora: hora,
      estado: this.dataTempUser.estado 
    });
  }

  /**
   * Consulta en el mismo formulario, si se crea o si se actualiza un servicio 
   */
  public submitForm() {
    if (this.dataTempUser && Object.keys(this.dataTempUser).length > 0) {
      this.editReser();
    } else {
      this.createReser();
    }
  }

  /**
   * Edita una reserva
   */
  public editReser() {
    if (this.reservaForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      const fechaReserva = `${this.reservaForm.get('fecha')?.value}T${this.reservaForm.get('hora')?.value}`;
      let data = {
        ClienteId: Number(this.reservaForm.get('cliente')?.value), 
        ServicioId: Number(this.reservaForm.get('servicio')?.value), 
        FechaReserva: fechaReserva, 
        Estado: this.reservaForm.get('estado')?.value 
      };
      this.reservaService.editReservas(data, this.dataTempUser.id).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataReserva();
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
        this.reservaService.deleteReservas(id).subscribe({
          next: (response) => {
            this.getDataReserva();
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

  /**
   * Filtro de busqueda
   * @returns
   */
  filteredData(): Array<any> {
    return this.dataReserva.filter((item: any) => {
      const searchLower = this.searchText.toLowerCase();
      return item.clienteNombre.toLowerCase().includes(searchLower) ||
        item.servicioNombre.toLowerCase().includes(searchLower) ||
        item.estado.toLowerCase().includes(searchLower);
    });
  }
}
