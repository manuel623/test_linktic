import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  public viewForm: boolean = false;
  public createUserButton: boolean = false
  public loadingTable: boolean = true;
  public dataUser: any = [];
  public userForm: FormGroup;
  public dataTempUser: any = {};

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]]
    })
  }

  ngOnInit() {
    this.getDataUser();
  }

  /** 
   * Trae todos los usuarios registrados
   */
  getDataUser() {
    this.userService.listUser().subscribe(
      (response) => {
        this.dataUser = response.users;
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
    this.userForm.reset();
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
   * Crea usuarios
   * */
  createUser() {
    if (this.userForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      let data = {
        Nombre: this.userForm.get('nombre')?.value,
        password: this.userForm.get('password')?.value,
        email: this.userForm.get('email')?.value,
      };
      this.userService.createUser(data).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataUser();
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
   * 
   * @param id 
   */
  public editViewUser(id: number) {
    this.dataTempUser = {};
    this.userForm.reset();
    this.viewForm = true;
    this.dataTempUser = this.dataUser.find((u: any) => u.id === id);

    this.userForm.patchValue({
      nombre: this.dataTempUser.nombre,
      email: this.dataTempUser.email
    })
  }

  /**
   * Consulta en el mismo formulario, si se crea o si se actualiza un usuario 
   */
  public submitForm() {
    if (this.dataTempUser && Object.keys(this.dataTempUser).length > 0) {
      this.editUser();
    } else {
      this.createUser();
    }
  }

  /**
   * Edita usuarios
   */
  public editUser() {
    if (this.userForm.valid) {
      this.createUserButton = true;
      this.loadingTable = true;
      let data = {
        Nombre: this.userForm.get('nombre')?.value,
        password: this.userForm.get('password')?.value,
        email: this.userForm.get('email')?.value,
      };
      console.log("console", this.dataTempUser.id);
      
      this.userService.editUser(data, this.dataTempUser.id).subscribe(
        (response) => {
          this.createUserButton = false;
          if (response.success) {
            this.viewForm = false;
            this.getDataUser();
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
   * Elimina usuarios
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
        this.userService.deleteUser(id).subscribe({
          next: (response) => {
            this.getDataUser();
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
