import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'; 

const url="http://localhost:3030/mascotas";


class mascotas extends Component{

  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      ID_Mascota: 0,
      ID_Cliente: 0,
      Fecha_registro: '',
      Nombre: '',
      Raza: '',
      Especie: '',
      Edad: 0,
      tipoModal: ''
    }
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  peticionGet=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPost= async()=>{
    await this.setState({
      form:{
        ...this.state.form,
        ID_Mascota:0,
        Fecha_registro : this.getdate()  
      }
    });
    await axios.post(url, this.state.form).then(responsive=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    console.log(this.state.form);
    axios.put(url+"/mod", this.state.form).then(responsive=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url+'/del', {data: {"ID_Mascota": this.state.form.ID_Mascota} }).then(responsive=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  seleccionarMascota=(mascota)=>{
    this.setState({
      tipoModal: 'actualizar',
      form:{
        ID_Mascota: parseInt(mascota.ID_Mascota),
        ID_Cliente: parseInt(mascota.ID_Cliente),
        Fecha_registro: mascota.Fecha_registro,
        Nombre: mascota.Nombre,
        Raza: mascota.Raza,
        Especie: mascota.Especie,
        Edad: mascota.Edad
      }
    });
    console.log(this.setState);
  }

  handlerChange= async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount(){
    this.peticionGet();
  }
  
  // Convertir Fecha AAAA-MM-DD -> DD-MM-AAAA
  getdate() {
    let string = new Date().toLocaleDateString();
    return string;
  }


  render(){
    
    const {form} = this.state;
    
    return(
      <div className="container">
        <div className="App">
          <br/>
          <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Mascota</button>
          <br/><br/>
          <table className="table">
            <thead>
              <tr>
                <th>ID Mascota</th>
                <th>ID Cliente</th>
                <th>Fecha de registro</th>
                <th>Nombre</th>
                <th>Raza</th>
                <th>Especie</th>
                <th>Edad</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(animal=>{
                return(
                  <tr>
                    <td>{animal.ID_Mascota}</td>
                    <td>{animal.ID_Cliente}</td>
                    <td>{animal.Fecha_registro}</td>
                    <td>{animal.Nombre}</td>
                    <td>{animal.Raza}</td>
                    <td>{animal.Especie}</td>
                    <td>{animal.Edad} años</td>
                    <td>
                      <button className="btn btn-primary" onClick={()=>{this.seleccionarMascota(animal); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                      {"   "}
                      <button className="btn btn-danger" onClick={()=>{this.seleccionarMascota(animal); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

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
                          <label htmlFor="ID_Mascota" className="form-label">ID Macota</label>
                          <input readOnly name="ID_Mascota" type="" className="form-control" id="ID_Mascota"  placeholder="Identificador Mascota" onChange={this.handlerChange} value={form?form.ID_Mascota:0}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="ID_Cliente" className="form-label">ID Cliente</label>
                          <input name="ID_Cliente" className="form-control" id="ID_Cliente"  placeholder="Identificador" onChange={this.handlerChange} value={form?form.ID_Cliente: ''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Fecha_registro" className="form-label">Fecha de Registro</label>
                          <input readOnly name="Fecha_registro" type="text" className="form-control" id="Fecha_registro" aria-describedby="emailHelp"  onChange={this.handlerChange} value={form?form.Fecha_registro: this.getdate()}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Nombre" className="form-label">Nombre de la Mascota</label>
                          <input name="Nombre"  type="text" className="form-control" id="Nombre"  placeholder="Ejemplo. Juanito" onChange={this.handlerChange} value={form?form.Nombre: ''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Raza" className="form-label">Raza</label>
                          <input name="Raza" type="text" className="form-control" id="Raza"  placeholder="Ejemplo. Chihuahua" onChange={this.handlerChange} value={form?form.Raza: ''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Especie" className="form-label">Especie</label>
                          <input name="Especie"  type="text" className="form-control" id="Especie" placeholder="Ejemplo. Perro" onChange={this.handlerChange} value={form?form.Especie: ''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Edad" className="form-label">Edad</label>
                          <input name="Edad"  type="number" className="form-control" id="Edad" placeholder="Ejemplo. 1" onChange={this.handlerChange} value={form?form.Edad: ''}/>
                          <br/>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {this.state.tipoModal=='insertar'?
                <button className="btn btn-success" onClick={()=>this.peticionPost()}> Insertar</button>:
                <button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar </button>
            }
                <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar
                </button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar a la mascota {form && form.Nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>

        </div>
      </div>
    );
  }
}


export default mascotas;