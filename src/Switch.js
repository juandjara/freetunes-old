import React from 'react';
import styled from 'styled-components';

/* https://www.w3schools.com/howto/howto_css_switch.asp */
const SwitchStyle = styled.label`
  .switch {
    /* Base styles for the switch - the box around the slider */
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    vertical-align: bottom;

    /* Hide default HTML checkbox */
    input {
      display:none;
    }

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 20px;  
    }

    .slider:before {
      position: absolute;
      content: '';
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;  
    }

    input:checked + .slider {
      background-color: #3D9970;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #3D9970;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }
  }
  span {
    margin: 10px;
  }
`;

const Switch = (props) => (
  <SwitchStyle title={props.title}>
    <div className="switch">
      <input
        checked={props.value}
        onChange={props.onChange}
        type="checkbox" />
      <div className="slider round"></div>
    </div>
    <span>{props.label}</span>
  </SwitchStyle>
)

export default Switch;
