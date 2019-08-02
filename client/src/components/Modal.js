import React from 'react';
import Modal from 'react-bootstrap/Modal';


function MyModal(props) {
  console.log(props);
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          Retrieving Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Please wait...</h4>
          <p>
           Shipping info will be ready when this icon pops up.
           <img className="icon-shipping" src={process.env.PUBLIC_URL + "/images/shipping.png"} alt="shipping" />
          </p>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={props.onHide}>Close</Button> */}
        </Modal.Footer>
      </Modal>
    );
  }

  export default MyModal;
 