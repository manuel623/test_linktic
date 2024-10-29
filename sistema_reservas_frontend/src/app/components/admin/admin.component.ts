import { Component } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes/clientes.service';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  public user_information: any | null = null;
  public dataClient: any = [];
  public dataService: any = [];
  public dataReserva: any = [];
  public loading: boolean = true;

  constructor(
    private clientService: ClientesService,
    private servicesService: ServiciosService,
    private reservaService: ReservasService
    
  ) {
    const storedUserInfo = localStorage.getItem('user');
    this.user_information = storedUserInfo ? JSON.parse(storedUserInfo) : null;
  }

  ngOnInit() {
    this.getClients();
    this.getServicios();
    this.getReservaciones();
  }

  /**
   * Trae todos los clientes registrados
   */
  getClients() {
    this.clientService.listClient().subscribe(
      (response) => {
        this.dataClient = response.clients;
        this.loading = false;
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
   * Trae todas las reservaciones programados
   */
  getReservaciones() {
    this.reservaService.listReservas().subscribe(
      (response) => {
        this.dataReserva = response.reservas;
        this.loading = false;
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
  getServicios() {
    this.servicesService.listService().subscribe(
      (response) => {
        this.dataService = response.services;
        this.loading = false;
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
}
