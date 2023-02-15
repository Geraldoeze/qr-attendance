import React, { useState } from 'react';


import './modal.css';

const Modal = ({ children, open, close }) => {
  const showHideClassName = open ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="modal-main">{children}</section>
    </div>
  );
};

export default Modal;


