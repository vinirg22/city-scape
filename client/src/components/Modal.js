import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

function modalHeader(data) {
  switch (data) {
    case "loadShipping":
      return ([
        `Retrieving Information`,
        <span><img className="mt-1" src={process.env.PUBLIC_URL + "/images/loadbar.gif"} alt="loading" /></span>
      ]);
    case "selectWarning":
      return "Product selection required...";
    default:
      return "";
  }
}

function modalContent(data, onHide) {
  switch (data) {
    case "loadShipping":
      return ([
        <h4>Please wait...</h4>,
        <p>
          Shipping info will be ready when this icon pops up.
           <img className="icon-shipping" src={process.env.PUBLIC_URL + "/images/shipping.png"} alt="shipping" />
        </p>
      ]);
    case "selectWarning":
      return ([
          <p>Please select at least one product to proceed.</p>,
          <Button variant="primary" onClick={onHide}>Close</Button>
      ]);
    default:
      return "";
  }
}

function modalSize(data) {
  if (data==="loadShipping")
    return "lg";
  else
    return "md";
}

function MyModal(props) {

  return (
    <Modal
      {...props}
      size={modalSize(props.data)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {modalHeader(props.data)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalContent(props.data, props.onHide)}
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
}

export default MyModal;
