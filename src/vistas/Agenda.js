import React, { Component } from 'react';
import axios from "axios";
import '../index';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'; 



//#region url para solicitudes a las apis correspondientes
const url="http://localhost:3030/agenda";
const urlREs_vent="http://localhost:3030/Registroventas";
const url_ven = "http://localhost:3030/venta";
const url_get_mas="http://localhost:3030/mascotas/";
const url_del_venta="http://localhost:3030/venta/del";
const urlagenda ="http://localhost:3030/DatosAgenda"; 
const urlpago = 'https://api-bancoppel-transferencia.herokuapp.com/transacciones';
//#endregion


class Agenda extends Component{

  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    modalPago: false,
    form:{
      ID_Servicio:'',
      ID_Agenda: 0,
      ID_Mascota: '',
      Nombre_Mascota: '',
      Nombre_Cliente: '',
      Telefono: '',
      Direccion: '',
      Nombre_Servicio: '',
      Fecha: '',
      Hora: '',
      Total: 0,
      tipoModal: '',
      origin_account: '',
      exp_date: '',
      cvv: '',
      ammount: 0,
      Estado: '',
      Campo: {},
      error: {},
      transporte: false
    }
  }
// control para abrir formularios
  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }
  modalPago=()=>{
    this.setState({modalPago: !this.state.modalPago});
  }
  //Peticion para la vista Datos_agenda de la BD
  peticionGet=()=>{
    axios.get(urlagenda).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  // Accion cuando se realiza una cita
  peticionPost= async()=>{
    await axios.post('http://localhost:3001/PagoBanco', 
      {
        "IdTarjetaOrigen": this.state.form.origin_account,
        "IdTarjetaDestino": "5579100251520001",
        "Cvv": this.state.form.cvv,
        "TipoTransaccion": 3,
        "Motivo": "Servicio estetica",
        "Monto": this.state.form.ammount,
        "Fecha": this.state.form.exp_date
        
      }).then(response=>{
        const resp=response.data.EstadoTrans;
        const idt = response.data.IdTransaccion;
        if(resp == 'Transaccion Completada'){
          console.log('Transaccion Completada');
          this.peticionPost_agenda(idt);
        }else{
          alert("Revise su informacion");
        }
    }).catch(error=>{
      console.log(error.message);
    }) 
  }

  peticionPost_agenda = async(idt)=>{
    await axios.post(url, {
      "ID_Agenda": 0,
      "ID_Mascota": this.state.form.ID_Mascota,
      "Fecha": this.state.form.Fecha,
      "Hora": this.state.form.Hora
    }).then(responsive=>{
      this.postagen_vent_conID(idt);
    }).catch(error=>{
      console.log(error.message);
    })
  }

  postagen_vent_conID=(idt)=>{
    axios.get(url+'/id').then(response=>{
      const aaa=response.data;
      const aa= aaa.map(mas=>mas.ID_Agenda);
      const a= aa[0];
      console.log(a);
      this.peticionPost_venta(a,idt);
    })
  }
  peticionPost_RegistroVenta = async (idt) => {
    await axios.post(urlREs_vent, {
      "ID_Registro": 0,
      "Fecha": this.state.form.Fecha,
      "descripcion": this.state.form.descripcion,
      "total": this.state.form.ammount,
      "id_transaccioin": idt
    }).then(responsive=>{
      this.chekareso();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  // Ver el estado checbox para enviar inf al servicio transporte
  chekareso=()=>{
    var chbox = document.getElementById('cbox1');
    if(chbox.checked){
      this.sendtranportedata();
    }else{
      this.modalInsertar();
      this.modalPago();
      this.peticionGet();
    }
  }
  //cambia el valor a pagar de la cita si se solicita transporte
  request_transporte=async()=>{

    if(this.state.form.transporte){
      await this.setState({
        form:{
          ...this.state.form,
          ammount: (this.state.form.ammount-100),
          transporte: false
        }}
      );console.log(this.state.form);
    }else{
      await this.setState({
        form:{
          ...this.state.form,
          ammount: (this.state.form.ammount+100),
          transporte: true
        }}
      );console.log(this.state.form);
    }
  }
  
  // Inserccion en la tabla de ventas (requerida para la vista de inicio)
  peticionPost_venta=async(a,idt)=>{
    await axios.post(url_ven, {
      "ID_Agenda": a,
      "ID_Servicio": this.state.form.ID_Servicio,
      "Total": this.state.form.ammount
    }).then(responsive=>{
      this.peticionPost_RegistroVenta(idt);
    }).catch(error=>{
      console.log(error.message);
    })
  }

  // Progeso para enviar datos a transporte
  sendtranportedata=()=>{
    //obteniendo id del dueño de la mascota
    axios.get("http://localhost:3030/mascotas/cliente/"+this.state.form.ID_Mascota).then(response=>{
      const idcli1 = response.data.map(x=>x.ID_Cliente)
      const idcli = idcli1[0];
      console.log(idcli);
      this.getdatacliente(idcli);
    })
  }

  getdatacliente=(idcli)=>{
    //obteniendo inf del dueño de la mascota
    axios.get('http://localhost:3030/usuarios/one/'+idcli).then(response=>{
      
    const x = response.data.map(x=>x)
    console.log(x[0].Nombre)
    this.peticionPost_transporte(x);
    })
  }

  obtenermascota=async()=>{

  }

  //enviar informacion a tranporte
  peticionPost_transporte=async(c)=>{
    var x
    var namepet
      axios.get("http://localhost:3030/mascotas/id/"+this.state.form.ID_Mascota).then(response=>{
        x = response.data.map(x=>x);
        namepet = x[0].Nombre;
        axios.post('http://localhost:3001/Transporte',{
        "nombreMascota": namepet,
        "nombreCliente": c[0].Nombre,
        "direccion": c[0].Direccion,
        "telefono": c[0].Telefono,
        "fecha": this.state.form.Fecha,
        "hora": this.state.form.Hora
      }).then(response=>{
        this.modalInsertar();
        this.modalPago();
        this.peticionGet();
      });
    });
}


  //switch para indicar que servivio eligio el cliente en la cita
  setIDservicio=async()=>{
    var monto = this.state.form.Total;
    switch(monto){
      case '120':
      await this.setState({
          form:{
            ...this.state.form,
            ID_Servicio: '1',
            Total: 120,
            ID_Agenda: 0,
            ammount: 120
          }}
        );
      break;
      case '170':
        await this.setState({
          form:{
            ...this.state.form,
            ID_Servicio: '2',
            Total: 170,
            ID_Agenda: 0,
            ammount: 170
          }}
        );
      break;
      case '145':
        await this.setState({
          form:{
            ...this.state.form,
            ID_Servicio: '3',
            Total: 145,
            ID_Agenda: 0,
            ammount: 145
          }}
        );
      break;
      case '250':
        await this.setState({
          form:{
            ...this.state.form,
            ID_Servicio: '4',
            Total: 250,
            ID_Agenda: 0,
            ammount: 250
          }}
        );
      break;
      case '240':
        await this.setState({
          form:{
            ...this.state.form,
            ID_Servicio: '5',
            Total: 240,
            ID_Agenda: 0,
            ammount: 240
          }}
        );
      break;
      case '295':
        await this.setState({
          form:{
            ...this.state.form,
            ID_Servicio: '6',
            Total: 295,
            ID_Agenda: 0,
            ammount: 295
          }}
        );
      break;
      case '390':
        await this.setState({
          form:{
            ...this.state.form,
            ID_Servicio: '7',
            Total: 390,
            ID_Agenda: 0,
            ammount: 390
          }}
        );
      break;
    }
  }

  //Actualizar datos de la cita: fecha y hora
  peticionPut=()=>{
    axios.put(url+'/mod', this.state.form).then(responsive=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  //Eliminar cita (delete en las tablas agenda y venta de la BD)
  peticionDelete=()=>{
    console.log(this.state.form.ID_Agenda)
    axios.delete(url_del_venta+'/'+this.state.form.ID_Agenda).then(responsive=>{
    }).catch(error=>{
      console.log(error.message);
    });
    this.peticionDelete_venta();

  } 
  //                                               ↑ 
  //eliminar registro de la venta _________________↑
  peticionDelete_venta=()=>{
    axios.delete(url+'/del/'+this.state.form.ID_Agenda).then(responsive=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    }) 
  }

  //selecciona la informacion de la cita correspondiente al registro seleccionado
  seleccionarUsuario=(cliente)=>{
    axios.get(url_get_mas+cliente.Nombre_Mascota).then(response=>{
      let dat = response.data;
      //console.log(this.state.form.ID_Agenda);
      //console.log(dat.map(mas=>mas.ID_Mascota));

      this.setState({
        tipoModal: 'actualizar',
        form:{
          /*1*/ID_Agenda: cliente.ID_Agenda,
          /*2*/ID_Mascota: dat.map(mas=>mas.ID_Mascota),
          /*3*/Nombre_Cliente: cliente.Nombre_Cliente,
          /*4*/Telefono: cliente.Telefono,
          /*5*/Direccion: cliente.Direccion,
          /*6*/Nombre_Servicio: cliente.Nombre_Servicio,
          /*7*/Fecha: cliente.Fecha,
          /*8*/Hora: cliente.Hora
        }
      });

    }).catch(error=>{
      console.log(error.message);
    })

    //console.log(this.setState);
  }

  


  //Evento para modificar el estado
  handlerChange= async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    this.setIDservicio();
    console.log(this.state.form);
  }

  //Lo que se inicial al entrar a la clase
  componentDidMount(){
    this.peticionGet();
  }
  // Convertir Fecha AAAA-MM-DD -> DD-MM-AAAA
  convertDateFormat(string) {
    var info = string.split('-');
    return info[2] + '/' + info[1] + '/' + info[0];
  }
  
  getdate() {
    let string = new Date().toLocaleDateString();
    console.log(string)
    return string;
  }
  getdate2(){
    var todayDate = new Date().toISOString().slice(0, 10);
    return todayDate;
  }
  
  //Inicial el codigo HTML de la vista
  render(){
    const {form} = this.state;
    
    return(
      <div className="container">
        <div className="App">
          <br/>
          <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Cita</button>
          <br/><br/>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID Agenda</th>
                <th>Nom. Mascota</th>
                <th>Nom. Cliente</th>
                <th>Telefono</th>
                <th>Direccion</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(cliente=>{
                return(
                  <tr>
                    <td>{cliente.ID_Agenda}</td>
                    <td>{cliente.Nombre_Mascota}</td>
                    <td>{cliente.Nombre_Cliente}</td>
                    <td>{cliente.Telefono}</td>
                    <td>{cliente.Direccion}</td>
                    <td>{cliente.Servicio}</td>
                    <td>{this.convertDateFormat(cliente.Fecha)}</td>
                    <td>{cliente.Hora}</td>
                    <td>
                      <button className="btn bt+n-primary" onClick={()=>{this.seleccionarUsuario(cliente); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                      {"   "}
                      {<button className="btn btn-danger" onClick={()=>{this.seleccionarUsuario(cliente); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>


          {/* Formulario de Agenda*/}
          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{display:'block'}}>
              <button style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</button>
            </ModalHeader>
            <ModalBody>
              <div>
                <div className="card ">
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                          <label htmlFor="ID_Cliente" className="form-label" > ID Agenda:</label>
                          <input readOnly name="ID_Agenda"  type="number" className="form-control" id="ID_Cliente"  placeholder="Identificador" onChange={this.handlerChange} value={form?form.ID_Agenda: this.state.data.length+1} required/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Nombre" className="form-label">ID Mascota:</label>
                          <input name="ID_Mascota"  type="text" className="form-control" id="Nombre"  placeholder="Identificador" onChange={this.handlerChange} value={form?form.ID_Mascota: ''} required/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Direccion" className="form-label">Fecha:</label>
                          <input name="Fecha" type="date" className="form-control" min={this.getdate2()} max={"2023-01-03"} onChange={this.handlerChange} value={form?form.Fecha: this.getdate2()} required/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Telefono" className="form-label">Hora de la Cita:</label>
                          <input name="Hora"  type="time" className="form-control" id="Telefono" min={"09:00"} max={"18:00"}  onChange={this.handlerChange} value={form?form.Hora: '09:00'} required/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Telefono" className="form-label">Servicio:</label>
                          <select name="Total" class="form-select" aria-label="Default select example" onChange={this.handlerChange} value={form?form.Total: ''}>
                              <option>Seleccione Servicio</option>
                              <option value={120}> $ 120.00 ------{'>'} Baño Completo</option>
                              <option value={170}> $ 170.00 ------{'>'} Corte de Pelo </option>
                              <option value={145}> $ 145.00 ------{'>'} Corte de Uñas </option>
                              <option value={250}> $ 250.00 ------{'>'} Baño Completo y Corte de Pelo </option>
                              <option value={240}> $ 240.00 ------{'>'} Baño Completo y Corte de Uñas </option>
                              <option value={295}> $ 295.00 ------{'>'} Corte de Pelo y Corte de Uñas</option>
                              <option value={390}> $ 390.00 ------{'>'} Corte de Pelo, Corte de Uñas y Baño Completo</option>
                          </select>
                      </div>
                      <div className="mb-3">
                          <a style={{padding:"20px"}}><input  type="checkbox" id="cbox1"  onClick={this.request_transporte}/> </a>
                          <label htmlFor="Telefono" className="form-label">Solicitar Transporte: costo extra de $100.00 MXN</label><br/>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {this.state.tipoModal==='insertar'?
                <button className="btn btn-success" onClick={()=>this.modalPago()}>Ir a Pagar</button>:
                <button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar </button>
            }
                <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar
                </button>
            </ModalFooter>
          </Modal>


            {/* Formulario de Eliminacion*/}
          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar la cita : {form && form.ID_Agenda}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>


          {/* Formulario de Eliminacion SI/NO*/}  
          <Modal isOpen={this.state.modalPago}>
            <ModalBody>
               Estás seguro que deseas eliminar la Cita {form && form.Nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>

            {/* Formulario de Pagar al banco*/}  
          <Modal isOpen={this.state.modalPago}>
            <ModalHeader style={{display:'block'}}>
              <button type="button" class="btn btn-danger" style={{float: 'right'}} onClick={()=>this.modalPago()}>X</button>
            </ModalHeader>
            <ModalBody>
                                
                <form>
                  <br/>
                  <div className='card'>
                      <div className="mb-3">
                          <label htmlFor="ID_Cliente" className="form-label" >Número de Tarjeta</label>
                          <input  name="origin_account"  type="number" className="form-control" id=" "  placeholder=" " onChange={this.handlerChange} value={form?form.origin_account:''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="ID_Cliente" className="form-label" > CVV</label>
                          <input  name="cvv"  type="number" className="form-control" id=" "  placeholder=" " onChange={this.handlerChange} value={form?form.cvv:''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="ID_Cliente" className="form-label" > Fecha de Vencimiento</label>
                          <input  name="exp_date"  type="text" className="form-control" id=" "  placeholder=" " onChange={this.handlerChange} value={form?form.exp_date:''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="ID_Cliente" className="form-label" > Monto</label>
                          <input readOnly name="ammount"  type="number" className="form-control" id=" "  placeholder="" onChange={this.handlerChange} value={form?form.ammount:''}/>
                          <br/>
                      </div>
                  </div>
                    
                </form>
                
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-success" onClick={()=>this.peticionPost()}>Enviar</button>
                <button className="btn btn-danger" onClick={()=>this.modalPago()}>Cancelar
                </button>
            </ModalFooter>
          </Modal>

        </div>
      </div>
    );
  }
}


export default Agenda;