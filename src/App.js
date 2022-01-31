import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';




const url="http://localhost:3030/usuarios";
const url2="http://localhost:3030/usuarios/mod";
const url3="http://localhost:3030/usuarios/upd";



class App extends Component{

  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      ID_Cliente: 0,
      Nombre: '',
      Direccion: '',
      Telefono: '',
      Fecha_Registro: '',
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
        ID_Cliente:0,
        Fecha_Registro: this.getdate()
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
    delete this.state.form.Fecha_Registro;
    axios.put(url3, this.state.form).then(responsive=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url+'/del',{data:{"ID_Cliente": this.state.form.ID_Cliente}}).then(responsive=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }

  seleccionarUsuario=(cliente)=>{
    this.setState({
      tipoModal: 'actualizar',
      form:{
        ID_Cliente: parseInt(cliente.ID_Cliente),
        Nombre: cliente.Nombre,
        Direccion: cliente.Direccion,
        Telefono: cliente.Telefono,
        Fecha_Registro: cliente.Fecha_Registro
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
          <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Usuario</button>
          <br/><br/>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID cliente</th>
                <th>Nombre</th>
                <th>Direccion</th>
                <th>Telefono</th>
                <th>Fecha de registro</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(cliente=>{
                return(
                  <tr>
                    <td>{cliente.ID_Cliente}</td>
                    <td>{cliente.Nombre}</td>
                    <td>{cliente.Direccion}</td>
                    <td>{cliente.Telefono}</td>
                    <td>{cliente.Fecha_Registro}</td>
                    <td>
                      <button className="btn btn-primary" onClick={()=>{this.seleccionarUsuario(cliente); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                      {"   "}
                      <button className="btn btn-danger" onClick={()=>{this.seleccionarUsuario(cliente); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{display:'block'}}>
              <button style={{float: 'right'}} onClick={()=>this.modalInsertar()}>X</button>
            </ModalHeader>
            <ModalBody>
              <div>
                <div className="card ">
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                          <label htmlFor="ID_Cliente" className="form-label" > ID Cliente</label>
                          <input readOnly name="ID_Cliente"  type="number" className="form-control" id="ID_Cliente"  placeholder="Identificador" onChange={this.handlerChange} value={form?form.ID_Cliente: 0}/>
                          <br/>
                      </div>
                      <div className="mb-3">
                          <label htmlFor="Nombre" className="form-label">Nombre del Cliente</label>
                          <input name="Nombre"  type="text" className="form-control" id="Nombre"  placeholder="Ejemplo. Juanito" onChange={this.handlerChange} value={form?form.Nombre: ''}/>
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
                          <input readOnly name="Fecha_Registro" type="text" className="form-control" id="Fecha_Registro" aria-describedby="emailHelp"   value={form?form.Fecha_Registro: this.getdate()}/>
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


export default App;