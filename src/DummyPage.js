import React from "react";
import {
    Button,
    FormGroup,
    Input,
    Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";




class DummyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            nestedModal:false,
            closeAll:false
        };

        this.toggle = this.toggle.bind(this);
        this.toggleNested=this.toggleNested.bind(this);
        this.toggleAll=this.toggleAll.bind(this);
        this.setNestedModal=this.setNestedModal.bind(this);
        this.setCloseAll=this.setCloseAll.bind(this);
    }

    toggle =()=>{
        this.setState({modal: !this.state.modal});
        console.log("Toggle ", !this.state.modal)
    };

    toggleNested = () => {
        this.setNestedModal(!this.state.nestedModal);
        this.setCloseAll(false);
    };

    toggleAll = () => {
        this.setNestedModal(!this.state.nestedModal);
        this.setCloseAll(true);
    };

    setNestedModal =(toggle)=>{
    this.setState({nestedModal: toggle })
  };


    setCloseAll =(toggle)=>{
        this.setState({closeAll:toggle})
    };


    render(){
        return(
                <div>
                            <Button className="btn-fill" color="primary" onClick={this.toggle}>
                            Create new subscriber
                            </Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle}  size="lg" >
                                <ModalHeader toggle={this.toggle}>Create New Subscriber</ModalHeader>
                                <ModalBody>
                                    Story
                                     <FormGroup>
                          <label>City</label>
                          <Input
                            defaultValue="Mike"
                            placeholder="City"
                            type="text"
                          />
                        </FormGroup>
                                    <br/>
                            <Button color="success" onClick={this.toggleNested}>Add Device</Button>
                            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
                                <ModalHeader>Nested Modal title</ModalHeader>
                                <ModalBody>Stuff and things</ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.toggleNested}>Done</Button>{' '}
                                    <Button color="secondary" onClick={this.toggleAll}>All Done</Button>
                                </ModalFooter>
                            </Modal>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
        );
    }

}



export default DummyPage;


