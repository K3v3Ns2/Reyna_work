import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'; 

const url="http://localhost:3030/servicio";


class Servicios extends Component{

  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
        ID_Servicio: 0,
        Nombre_Servicio: '',
        Descripcion: '',
        Costo: '',
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
    await axios.post(url, this.state.form).then(responsive=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    axios.put(url, this.state.form).then(responsive=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url+this.state.form.id).then(responsive=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }

  seleccionarUsuario=(cliente)=>{
    this.setState({
      tipoModal: 'actualizar',
      form:{
        ID_Cliente: parseInt(cliente.ID_Servicio),
        Nombre: cliente.Nombre_Servicio,
        Direccion: cliente.Descripcion,
        Telefono: cliente.Costo
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


  render(){
    const {form} = this.state;
    
    return(
      <div className="container">
        <div className="App">
        <br/><br/>
          {/* <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Servicio</button> */}
          <br/><br/>
          <table className="table table-striped">
            <thead className="thead-light">
              <tr>
                <th scope="col">ID Servicio</th>
                <th scope="col">Nombre Servicio</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Costo</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(cliente=>{
                return(
                  <tr>
                    <td>{cliente.ID_Servicio}</td>
                    <td>{cliente.Nombre_Servicio}</td>
                    <td>{cliente.Descripcion}</td>
                    <td>{cliente.Costo}</td>
                    <td>
                      {/* <button className="btn btn-primary" onClick={()=>{this.seleccionarUsuario(cliente); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button> */}
                      {"   "}
                      {/* <button className="btn btn-danger" onClick={()=>{this.seleccionarUsuario(cliente); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button> */}
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
                          <label htmlFor="ID_Cliente" className="form-label" > ID Servicio</label>
                          <input  name="ID_Servicio"  type="number" className="form-control" id="ID_Cliente"  placeholder="Identificador" onChange={this.handlerChange} value={form?form.ID_Servicio: this.state.data.length+1}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Nombre" className="form-label">Servicio</label>
                          <input name="Nombre_Servicio"  type="text" className="form-control" id="Nombre"  placeholder="Ejemplo. Juanito" onChange={this.handlerChange} value={form?form.Nombre: ''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Direccion" className="form-label">Dirección</label>
                          <input name="Direccion" type="text" className="form-control" id="Direccion"  placeholder="Ejemplo. Av. Nuñez #78" onChange={this.handlerChange} value={form?form.Direccion: ''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Telefono" className="form-label">Número de Telefono</label>
                          <input name="Telefono"  type="number" className="form-control" id="Telefono" placeholder="Ejemplo. 6621203034" onChange={this.handlerChange} value={form?form.Telefono: ''}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Fecha_Registro" className="form-label">Fecha de Registro</label>
                          <input name="Fecha_Registro" type="text" className="form-control" id="Fecha_Registro" aria-describedby="emailHelp" placeholder="Ejemplo. 31/12/2021" onChange={this.handlerChange} value={form?form.Fecha_Registro: ''}/>
                          <br/>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              {this.state.tipoModal=='insertar'?
                <button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</button>:
                <button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar </button>
            }
                <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar
                </button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar a el usuario {form && form.Nombre}
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


export default Servicios;